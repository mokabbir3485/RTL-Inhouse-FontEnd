app.controller("PaymentProcessController", function ($scope, $cookieStore, $http, $filter) {


    function Clear() {
        $scope.PaymentProcessTypeList = [{ PaymentProcessType: 'LC' }, { PaymentProcessType: 'TT' }, { PaymentProcessType: 'FDD' }]
        $scope.exp_PaymentProcess = {};
        $scope.PaymentProcessList = [];
        $scope.InvoiceSearchList = [];
        $scope.CompanyDropdownList = [];
        $scope.InvoiceIdLis = [];
        $scope.Count = 0;
        $scope.InvCount=0;
        $scope.found = false;
        $scope.btnDeleleShow = false;
        $scope.ddlPaymentProcessType = null;
        $scope.ConfirmationMessageForAdmin = false;
        $scope.exp_PaymentProcess.PaymentProcessId = 0
        $scope.exp_PaymentProcess.IsActive = true;
        GetAllPaymentProcess();
        GetConfirmationMessageForAdmin();
       // GetUsersPermissionDetails();
        $scope.button = "Save";
       
    }
    Clear();
    
    function GetAllPaymentProcess()
    {
        $http({
            url: '/ExpPaymentProcess/GetAllPaymentProcess',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.PaymentProcessList = data;
        });
    }
    
    function GetAllActiveCompany() {
        var criteria = "C.IsActive=1";
        $http({
            url: '/Company/GetCompanyDynamic?searchCriteria=' + criteria + "&orderBy=CompanyName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CompanyDropdownList = data;
           
        })
    }

    function SavePaymentProcess(status) {

        $scope.exp_PaymentProcess.InvoiceIdsArray = [];
        var InvIds = '';
        angular.forEach($scope.InvoiceSearchList, function (e) {
            if (e.IsCheck) {
                InvIds += InvIds===''?(''+e.InvoiceId):(','+e.InvoiceId);
                $scope.InvCount++;
            }
            if($scope.InvCount<0){
                alert("Please select at least one invoice");
                return;
            }
            $scope.exp_PaymentProcess.InvoiceIds = InvIds;
            console.log($scope.exp_PaymentProcess.InvoiceIds);
        });
       
        var parms = JSON.stringify({ exp_PaymentProcess: $scope.exp_PaymentProcess });
       
        $http.post('/ExpPaymentProcess/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Payment Process ' + status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.paymentProcessEntryForm.$setPristine();
                $scope.paymentProcessEntryForm.$setUntouched();
                $("#txtPaymentProcessName").focus();
            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    function GetConfirmationMessageForAdmin() {
        $http({
            url: '/Role/GetConfirmationMessageForAdmin',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ConfirmationMessageForAdmin = (data === 'true');
        });
    }

    //function GetUsersPermissionDetails() {
    //    $scope.CreatePermission = false;
    //    $scope.RevisePermission = false;
    //    $scope.RemovePermission = false;
    //    $scope.ListViewPermission = false;

    //    var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('DesignationScreenId');
    //    $http({
    //        url: '/Permission/GetUsersPermissionDetails?searchCriteria=' + searchCriteria + '&orderBy=PermissionDetailId',
    //        method: 'GET',
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (data) {
    //        $scope.PermissionDetails = data;
    //        angular.forEach($scope.PermissionDetails, function (aPermissionDetails) {
    //            if (aPermissionDetails.FunctionName == 'Create') {
    //                $scope.CreatePermission = aPermissionDetails.CanExecute;
    //            }
    //            else if (aPermissionDetails.FunctionName == 'Revise') {
    //                $scope.RevisePermission = aPermissionDetails.CanExecute;
    //            }
    //            else if (aPermissionDetails.FunctionName == 'Remove') {
    //                $scope.RemovePermission = aPermissionDetails.CanExecute;
    //            }
    //            else if (aPermissionDetails.FunctionName == 'ListView') {
    //                $scope.ListViewPermission = aPermissionDetails.CanExecute;
    //            }
    //        });
    //    });
    //}

    $scope.selectAllCheck = function (value) {
        $scope.Count = 0;
        if ($scope.InvoiceSearchList) {
            angular.forEach($scope.InvoiceSearchList, function (e) {
                e.IsCheck = value;
                if (e.IsCheck) {
                    $scope.Count += e.Amount;
                }
            });

            if (!value) {
                $scope.Count = 0;
            }
         $scope.exp_PaymentProcess.Amount = $scope.Count;
        }


    }

    $scope.SelectCheck = function (row, value) {
        row.IsCheck = value;
        if (row.IsCheck) {
            $scope.Count += row.Amount;
        }
        else {
            $scope.Count -= row.Amount;
        }
     $scope.exp_PaymentProcess.Amount = $scope.Count;

    }
   
    $scope.GetCompanyByPaymentProcessType = function () {
        GetAllActiveCompany();
    }
    $scope.CompanyChange = function () {
        var invType = $scope.ddlPaymentProcessType.PaymentProcessType === 'LC' ? 'PI' : 'SC';
        var where = "InvoiceType = '" + invType + "' AND ImporterBankId IN (SELECT BankAccountId FROM ad_BankAccount WHERE AccountRefId = " + $scope.ddlCompany.CompanyId + ")";

        $http({
            url: "/ExpInvoice/GetExpInvoiceDynamic?searchCriteria=" + where + "&orderBy=InvoiceId",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

                if (data.length > 0) {
                    angular.forEach(data, function (e) {
                        e.IsCheck = false;
                        var res1 = e.InvoiceDate.substring(0, 5);
                        if (res1 == "/Date") {
                            var parsedDate1 = new Date(parseInt(e.InvoiceDate.substr(6)));
                            var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                            e.InvoiceDate = date1;
                        }
                    })
                }
                $scope.InvoiceSearchList = data;
        })
    }
   
    $scope.Selpaymentprocess = function (aPaymentProcess) {
        if (aPaymentProcess) {
            var res1 = aPaymentProcess.ApplicationDate.substring(0, 5);
            var res2 = aPaymentProcess.LcDate.substring(0, 5);
            var res3 = aPaymentProcess.ExportContactDate.substring(0, 5);
            if (res1 && res2 && res3 == "/Date") {
                var parsedDate1 = new Date(parseInt(aPaymentProcess.ApplicationDate.substr(6)));
                var parsedDate2 = new Date(parseInt(aPaymentProcess.LcDate.substr(6)));
                var parsedDate3 = new Date(parseInt(aPaymentProcess.ExportContactDate.substr(6)));
                var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                var date2 = ($filter('date')(parsedDate2, 'MMM dd, yyyy')).toString();
                var date3 = ($filter('date')(parsedDate3, 'MMM dd, yyyy')).toString();
                aPaymentProcess.ApplicationDate = date1;
                aPaymentProcess.LcDate = date2;
                aPaymentProcess.ExportContactDate = date3;
            }
        }
        $scope.exp_PaymentProcess = aPaymentProcess;
        $scope.button = "Update";
        $scope.btnDeleleShow = false;
    };

    $scope.SavePaymentProcess = function () {
        if ($scope.found) {
            $('#txtPaymentProcessName').focus();
        }
        else {
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.exp_PaymentProcess.PaymentProcessId == 0) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SavePaymentProcess('Saved');
                        }
                    })
                }
             
                else if ($scope.exp_PaymentProcess.PaymentProcessId > 0) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SavePaymentProcess('Updated');
                        }
                    })
                }
               
            }
          
        }
    };

    $scope.resetForm = function () {
        Clear();
        $scope.paymentProcessEntryForm.$setPristine();
        $scope.paymentProcessEntryForm.$setUntouched();
    };

    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ paymentProcessId: $scope.exp_PaymentProcess.PaymentProcessId });
                $http.post('/ExpPaymentProcess/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Payment Process Deleted Successfully!', 'success', '5000');
                        Clear();
                    } else {
                        alertify.log('Delete Failed!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '5000');
                });
            }
        })
    };

    //#region
    $('#txtApplicationDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,
       

    });

    $scope.CalendarAppDate = function () {
        $("#txtApplicationDate").focus();
        $("#txtApplicationDate").trigger("click");
    }
    $('#txtLcDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,

    });

    $scope.CalendarLcDate = function () {
        $("#txtLcDate").focus();
        $("#txtLcDate").trigger("click");
    }
    $('#txtFromScDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,

    });

    $scope.CalendarLCFromDate = function () {
        $("#txtFromScDate").focus();
        $("#txtFromScDate").trigger("click");
    }
    $('#txtToScDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,

    });

    $scope.CalendarLCToDate = function () {
        $("#txtToScDate").focus();
        $("#txtToScDate").trigger("click");
    }
    $('#txtFromLiDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,


    });

    $scope.CalendarFromLiDate = function () {
        $("#txtFromLiDate").focus();
        $("#txtFromLiDate").trigger("click");
    }
    $('#txtToLiDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,

    });

    $scope.CalendarToLiDate = function () {
        $("#txtToLiDate").focus();
        $("#txtToLiDate").trigger("click");
    }
    $('#txtExportContactDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,

    });

    $scope.CalendarExportContactDate = function () {
        $("#txtExportContactDate").focus();
        $("#txtExportContactDate").trigger("click");
    }

    //#endregion 
   
});