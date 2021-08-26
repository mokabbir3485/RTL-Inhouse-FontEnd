app.controller("HomeController", function ($scope, $rootScope, $cookieStore, $http, $filter) {
    $scope.LoginUser = $cookieStore.get('UserData');
    Load()
    function Load() {
        $scope._pos_Shift = {};
        $scope.lblSaveBtnlbl = 'Clock In';
        GetAllUserOutLet();
        CheckRolePermision();
        GetUsersShift();
    }
    function GetUsersShift() {
        var criteria = '1=1 AND S.UserId=' + $scope.LoginUser.UserId + ' AND IsClose = 0';
        $http({
            url: '/Shift/GetUsersShift?searchCriteria=' + criteria + '',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length) {
                $scope.ShiftId = data[0].ShiftId;
              //  $rootScope.DepartmentId = data[0].DepartmentId;
                $scope.lblSaveBtnlbl = 'Resume';
            } else {
                $scope.lblSaveBtnlbl = 'Clock In';
            }
        });
    };

    function GetAllUserOutLet() {
        $http({
            url: '/User/GetUserDepartmentByUserId?userId=' + $scope.LoginUser.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (userOutletList) {
            $scope.userOutletList = userOutletList;
            if ($scope.userOutletList.length == 1) {
                $scope.ddlOutLet = { DepartmentId: $scope.userOutletList[0].DepartmentId };
                $scope.ddlOutLet.BranchId = $scope.userOutletList[0].BranchId;
            }
        });
    }

    function CheckRolePermision() {
        var criteria = '1=1 AND RoleId=' + $scope.LoginUser.RoleId;
        $http({
            url: '/Role/GetRoleDynamic?searchCriteria=' + criteria + '&orderBy=RoleName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.IsCheckoutOperator = data[0].IsCheckoutOperator;
        });
    }
    $scope.SaveShift = function () {
        if ($scope.lblSaveBtnlbl == 'Clock In') {
            var erroMsg = [];
            if ($scope.ddlOutLet == undefined || $scope.ddlOutLet == null || $scope.ddlOutLet == '') {
                erroMsg.push({
                    msg: "Please Select Outlet"
                });
            }
            if (erroMsg.length > 0) {
                angular.forEach(erroMsg, function (aErroMsg) {
                    alertify.log(aErroMsg.msg, 'error', '5000');
                });
            }
            else {
                alertify.confirm("Are you sure to Clock In?", function (e) {
                    if (e) {
                        $scope._pos_Shift.DepartmentId = $scope.ddlOutLet.DepartmentId;
                        $scope._pos_Shift.UserId = $scope.LoginUser.UserId;
                        $.ajax({
                            url: "/Shift/SaveShift",
                            contentType: "application/json;charset=utf-8",
                            type: "POST",
                            data: JSON.stringify({ _pos_Shift: $scope._pos_Shift }),
                            success: function (data) {
                                if (data != null && data != '' && data != 0) {
                                    alertify.log('Clock in Successful', 'success', '5000');
                                    window.location = '/Home/Index#/Sale';
                                } else { alertify.log('Server Save Errors!', 'error', '5000'); }
                            }, error: function (msg) {
                                alertify.log('Server Save Errors!', 'error', '5000');
                            }
                        });
                    }
                });
            }
        }
        else {
            alertify.log('Welcome Back', 'success', '5000');
            window.location = '/Home/Index#/Sale';
        }
    }
    $scope.CalculateShift = function () {
        CalCulateShiftInfo();
    }
    function CalCulateShiftInfo() {
        $scope.pos_Shift.SystemCloseBalance = Enumerable.From($scope.ShiftAmountDetails).Sum('$.Amount');
        $scope.pos_Shift.InputCloseBalance = Enumerable.From($scope.ShiftAmountDetails).Sum('$.InputAmount');
        $scope.pos_Shift.SystemCloseCash = (Enumerable.From($scope.ShiftAmountDetails).Where("$.PaymentTypeName == 'Cash'").Sum('$.Amount')) + $scope.pos_Shift.InputOpenCash;
        $scope.pos_Shift.InputCloseCash = (Enumerable.From($scope.ShiftAmountDetails).Where("$.PaymentTypeName == 'Cash'").Sum('$.InputAmount')) + $scope.pos_Shift.InputOpenCash;
    }
    $scope.loadShiftInfo = function () {
        $http({
            url: "/Shift/GetSalePaymentByShift?shiftId=" + $scope.ShiftId + '&UserId=' + $scope.LoginUser.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.pos_Shift = data.Shift[0];
            $scope.ShiftAmountDetails = JSON.parse(data.ShiftDetails);
            CalCulateShiftInfo();
        })
    }
    $scope.ShiftClose = function () {
        alertify.confirm("Are you sure to Clock Out?", function (e) {
            if (e) {
                $.ajax({
                    url: "/Shift/CloseShift",
                    contentType: "application/json;charset=utf-8",
                    type: "POST",
                    data: JSON.stringify({ _pos_Shift: $scope.pos_Shift }),
                    success: function (data) {
                        if (data != null && data != '' && data != 0) {
                            alertify.log('Clock Out Successful', 'success', '5000');
                            PrintCounterClose($scope.pos_Shift.ShiftId);
                            Load();
                        } else { alertify.log('Server Save Errors!', 'error', '5000'); }
                    }, error: function (msg) {
                        alertify.log('Server Save Errors!', 'error', '5000');
                    }
                });
            }
        });
    }
    function PrintCounterClose(ShiftId) {
        var criteria = 'ShiftId=' + ShiftId;
        $http({
            url: '/Shift/GetUsersShift?searchCriteria=' + criteria + '&orderBy=UserId',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            var ShiftDetails = data[0];
            var OpenTime = "";
            var CloseTime = "";

            res = ShiftDetails.OpenTime.substring(0, 5);
            if (res == "/Date") {
                var parsedDate = new Date(parseInt(ShiftDetails.OpenTime.substr(6)));
                //OpenTime = $filter('date')(parsedDate, 'h:MM:ss tt');
                OpenTime = parsedDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            }

            res = ShiftDetails.CloseTime.substring(0, 5);
            if (res == "/Date") {
                var parsedDate = new Date(parseInt(ShiftDetails.CloseTime.substr(6)));
                //CloseTime = $filter('date')(parsedDate, 'h:MM:ss tt');
                CloseTime = parsedDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            }

            res = ShiftDetails.CloseTime.substring(0, 5);
            if (res == "/Date") {
                var parsedDate = new Date(parseInt(ShiftDetails.CloseTime.substr(6)));
                ShiftDetails.CloseTime = $filter('date')(parsedDate, 'dd-MMM-yyyy');
            }

            var printContents = '<div style="font-family:Verdana !important;"><div style="text-align: center"><strong>' + ShiftDetails.GroupName + '</strong><br>' + ShiftDetails.BranchName + '</div><hr>' + '<div style="font-size:10px !important;"><span><strong>Cashier : </strong>' + ShiftDetails.EmployeeName + '<br>' + '<strong>Date : </strong> ' + ShiftDetails.CloseTime + '</span><br><span> <strong>From : </strong> ' + OpenTime + '</span> <span> <strong>To : </strong> ' + CloseTime + '<br></span></div><hr />';
            printContents += '<table style="font-size:10px !important; width:100%;"><tr><td style="text-align:left" colspan="3">Opening Cash :' + ShiftDetails.InputOpenCash + '</td></tr><tr><td style="text-align:center" colspan="3">Closing Balance</td></tr><tr style="text-align:center"><td>System</td><td>Input</td><td>Difference</td></tr><tr style="text-align:center"><td>' + ShiftDetails.SystemCloseBalance + '</td><td>' + ShiftDetails.InputCloseBalance + '</td><td>' + (ShiftDetails.SystemCloseBalance - ShiftDetails.InputCloseBalance) + '</td></tr><tr><td style="text-align:center" colspan="3">Closing Cash</td></tr><tr style="text-align:center"><td>System</td><td>Input</td><td>Difference</td></tr><tr style="text-align:center"><td>' + ShiftDetails.SystemCloseCash + '</td><td>' + ShiftDetails.InputCloseCash + '</td><td>' + (ShiftDetails.SystemCloseCash - ShiftDetails.InputCloseCash) + '</td></tr><tr><td style="text-align:center" colspan="3">Own Cash</td></tr><tr style="text-align:center"><td>System</td><td>Input</td><td>Difference</td></tr><tr style="text-align:center"><td>' + ShiftDetails.OwnCashIn + '</td><td>' + ShiftDetails.OwnCashOut + '</td><td>' + (ShiftDetails.OwnCashIn - ShiftDetails.OwnCashOut) + '</td></tr></table></div>';
            myWindow = window.open('Apon', 'Apon Plastic Pvt Ltd | Clock Out Report', 'width=900,height=600');
            myWindow.document.write(printContents);
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        });
    }
});