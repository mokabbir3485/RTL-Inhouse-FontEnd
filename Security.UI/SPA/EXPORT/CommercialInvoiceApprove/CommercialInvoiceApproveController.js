app.controller("CommercialInvoiceApproveController", function ($scope, $cookieStore, $http, $filter, $window) {
    Clear();
    function Clear() {
        $scope.LoginUser = $cookieStore.get('UserData');
        GetCommercialInvoice();
        GetCommercialInvoiceNew();
        $scope.CommercialInvoiceListNew = [];
        $scope.name = "CommercialInvoiceApprove";
        $scope.btnCiNewDis = false;
        $scope.btnAmendmentReqDis = false;
        $scope.OTP = null;
        $scope.CIApproveList = [];

        $scope.AmendmentRequestList = [];


    } 

    $scope.SelectCiNewList = function (row, select) {
        row.Ischeck = select;
        row.IsApproved = true;
        row.ApprovedBy = row.UpdateBy = $scope.LoginUser.UserId;

        if (row.Ischeck) {
            row.ApprovalId = row.ApprovalId;
            $scope.CIApproveList.push(row);
            //$scope.CIApproveList=row;
        }
        else {
            var RowIndexList = [];

            angular.forEach($scope.CIApproveList, function (salesApprove) {
                if (salesApprove.Ischeck === row.Ischeck) {
                    var ind = $scope.CIApproveList.indexOf(salesApprove);
                    RowIndexList.push(ind);
                }
            });
            for (var i = RowIndexList.length - 1; i >= 0; i--) {
                $scope.CIApproveList.splice(RowIndexList[i], 1);
            }
        }
        if ($scope.CIApproveList.length >0)
 {
            $scope.btnCiNewDis = true;
        }
        else {
            $scope.btnCiNewDis = false;
        }
    }

   
    $scope.SelectAmendmentRequestList = function (row, select) {
         var array = [];
        row.Ischeck = select;
        row.IsApproved = true;
        row.ApprovedBy = row.UpdateBy = $scope.LoginUser.UserId;

        if (row.Ischeck) {
            row.ApprovalId = row.ApprovalId;
            array.push(row);
            $scope.btnAmendmentReqDis = true;
        }
        $scope.AmendmentRequestList = array;

    }
    $scope.SaveNewApproval = function () {
       
       
        if ($scope.CIApproveList.length <= 0) {
            alertify.log('Please select at least one new approval', 'error', '5000');
            return;
        }
      
        
        var param = JSON.stringify({ expApproval: $scope.CIApproveList });
        $http.post('/ExpApproval/UpdateApproval', param).success(function (data) {

            if (data > 0) {
                alertify.log('CI Send successfully!', 'success', '5000');
     
                Clear();

            }
            else if (data == 0) {
                alertify.log('Network Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Network Errors !', 'error', '5000');
        });
    }

    //$scope.OpenReport = function (ciId) {
    //    $window.open("http://43.224.119.250/Reports_MSSQLSERVER2016/report/Reports/Export/Rpt_CommercialInvoice?CommercialInvoiceId=" + ciId);
    //    event.stopPropagation();
    //}
    $scope.OpenReport = function (ciId) {
        $window.open("#/CommercialInvoiceReport", "popup", "width=800,height=550,left=280,top=80");
        $cookieStore.put("CommercialInvoiceId", ciId);
        event.stopPropagation();
    };

    $scope.SaveAmendmentRequest = function () {
        $http({
            url: '/ExpApproval/CheckDuplicate?approvalType=CIAmendment&approvalPassword=' + $scope.aPassword,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log(' Password already used!', 'already', '5000');
                txtPassword.focus();
                return;
            }
            else {

                if ($scope.AmendmentRequestList.length <= 0) {
                    alertify.log('Please select at least one new approval', 'error', '5000');
                    return;
                }
                angular.forEach($scope.AmendmentRequestList, function (c) {
                    c.ApprovalPassword = $scope.aPassword;
                });
                var param = JSON.stringify({ expApproval: $scope.AmendmentRequestList });
                $http.post('/ExpApproval/UpdateApproval', param).success(function (data) {

                    if (data > 0) {
                        alertify.log('CI Approved Successfully!', 'success', '5000');
                        Clear();
                        $scope.salesOrderApproveForm.$setPristine();
                        $scope.salesOrderApproveForm.$setUntouched();
                        $scope.aPassword = '';
                    }
                    else if (data == 0) {
                        alertify.log('Network Errors!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Network Errors !', 'error', '5000');
                });
            }
        })

    }

    function GetCommercialInvoice() {

        $http({
            url: '/ExpApproval/GetCommercialInvoice?approvalType=CiAmendment',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CommercialInvoiceApproveList= data;
            console.log($scope.CommercialInvoiceApproveList);
        });
    }
    function GetCommercialInvoiceNew() {

       $http({
            url: '/ExpApproval/GetCommercialInvoice?approvalType=CiNew',
          method: 'GET',
            headers: { 'Content-Type': 'application/json' }
       }).success(function (data) {
           $scope.CommercialInvoiceListNew = data;
          
           console.log($scope.CommercialInvoiceListNew);
        });
    }
});