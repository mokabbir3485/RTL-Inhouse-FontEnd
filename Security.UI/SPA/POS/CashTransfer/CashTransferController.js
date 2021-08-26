app.controller("CashTransferController", function ($scope, $cookieStore, $http, $filter) {
    Load();
    function Load() {
        $scope.LoginUser = $cookieStore.get('UserData');
        $scope.CashDeposit = {};
        $scope.CashDeposit.DepositId = 0;
        GetAllUserOutLet();
        GetAllBank();
        GetAllEmployee();
        //  $scope.ddlOutLet = null;
        $scope.ddlBank = null;
        $scope.ddlEmployee = null;
        $("#txtDate").val('');
    }
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
                $scope.CashDeposit.BranchId = $scope.userOutletList[0].BranchId;
            }
        });
    }
    function GetAllBank() {
        var criteria = "IsActive=1";
        $http({
            url: '/BankEntry/GetBankDynamic?searchCriteria=' + criteria + "&orderBy=BankName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ActiveBankList = data;
        })
    }
    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.employeeList = data;
            //$scope.ddlDeclaredBy = { EmployeeId: $scope.LoginUser.EmployeeId };
        });
    }
    $scope.SaveDeposit = function () {
        var erroMsg = [];
        if ($("#txtDate").val() == '' || $("#txtDate").val() == undefined || $("#txtDate").val() == null) {
            erroMsg.push({
                msg: "Please Select Deposit Date "
            });
        }
        else {
            var from = $("#txtDate").val().split("/");
            var f = new Date(from[2], from[1] - 1, from[0]);
            $scope.CashDeposit.DepositDate = f;
        }
        if (!$scope.ddlOutLet) {
            erroMsg.push({ msg: "Select Out Let" });
        }
        else {
            $scope.CashDeposit.BranchId = $scope.ddlOutLet.BranchId;
        }
        if (!$scope.ddlBank) {
            erroMsg.push({ msg: "Select Bank" });
        }
        else {
            $scope.CashDeposit.BankId = $scope.ddlBank.BankId;
            $scope.CashDeposit.BankName = $scope.ddlBank.BankName;
        }
        if (!$scope.ddlEmployee) {
            erroMsg.push({ msg: "Select Depositor" });
        }
        else {
            $scope.CashDeposit.DepositById = $scope.ddlEmployee.EmployeeId;
            $scope.CashDeposit.DepositByName = $scope.ddlEmployee.FullName;
        }
        if (!$scope.CashDeposit.BankBranchName) {
            erroMsg.push({ msg: "Enter Branch Name" });
        }
        if (!$scope.CashDeposit.ReferenceNo) {
            erroMsg.push({ msg: "Enter Reference No" });
        }
        if (!$scope.CashDeposit.Amount) {
            erroMsg.push({ msg: "Enter Deposit Amount" });
        }
        else if ($scope.CashDeposit.Amount < 1) {
            erroMsg.push({ msg: "Enter Deposit Amount" });
        }
        if (erroMsg.length > 0) {
            angular.forEach(erroMsg, function (aErroMsg) {
                alertify.log(aErroMsg.msg, 'error', '5000');
            });
        }
        else {
            alertify.confirm("Are you sure to Save?", function (e) {
                if (e) {
                    $scope.CashDeposit.CreatorId = $scope.LoginUser.UserId;
                    $scope.CashDeposit.UpdatorId = $scope.LoginUser.UserId;
                    $.ajax({
                        url: "/CashTransfer/Save",
                        contentType: "application/json;charset=utf-8",
                        type: "POST",
                        data: JSON.stringify({ _pos_CashDeposit: $scope.CashDeposit }),
                        success: function (data) {
                            if (data != null && data != '' && data != 0) {
                                alertify.log('Deposit Saved Successfully', 'success', '100000');
                                Load();
                                $scope.CashTransferForm.$setPristine();
                                $scope.CashTransferForm.$setUntouched();
                            } else { alertify.log('Server Save Errors!', 'error', '10000'); }
                        }, error: function (msg) {
                            alertify.log('Server Save Errors!', 'error', '10000');
                        }
                    });
                }
            });
        }
    }
    $scope.Reset = function () {
        //alertify.confirm("Are you Confirm to Reset?", function (e) {
        //    if (e) {
        Load();
        $scope.CashTransferForm.$setPristine();
        $scope.CashTransferForm.$setUntouched();
        //    }
        //});
    }
});