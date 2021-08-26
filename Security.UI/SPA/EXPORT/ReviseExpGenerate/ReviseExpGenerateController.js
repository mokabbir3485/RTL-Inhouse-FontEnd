app.controller("ReviseExpGenerateController", function ($scope, $cookieStore, $http, $filter, $window) {


    function Clear() {
        $scope.Count = 0;
        $scope.SOCount = 0;
        $scope.rowCount = 0;
        $scope.EvenrowCount = 0;
        $scope.OddrowCount = 0;
        $scope.QtySum = 0;
        $scope.PaymentProcessTypeList = [{ PaymentProcessType: 'LC' }, { PaymentProcessType: 'TT' }, { PaymentProcessType: 'FDD' }]
        $scope.exp_PaymentProcess = {};
        $scope.exp_AmendmentRequest = {};
        $scope.PaymentProcessList = [];
        $scope.InvoiceIdList = [];
        $scope.InvoiceSearchList = [];
        $scope.InvoiceListForFilter = [];
        $scope.InvoiceDropdownList = [];
        $scope.AmendmentReasonList = [];
        $scope.CompanyDropdownList = [];
        $scope.CompanyDropdownGridList = [];
        $scope.InvoiceIdLis = [];
        $scope.InvoiceWiseItem = [];
        $scope.InvoiceWiseItemList = [];
        $scope.ItemLists = [];

        $scope.Count = 0;
        $scope.InvCount = 0;
        $scope.AmendmentRequestCheck = false;
        $scope.ExpApplication;
        $scope.found = false;
        $scope.btnDeleleShow = false;
        $scope.ddlPaymentProcessType = null;
        $scope.ConfirmationMessageForAdmin = false;
        $scope.exp_PaymentProcess.PaymentProcessId = 0;
        $scope.exp_AmendmentRequest.AmendmentRequestId = 0;
        $scope.exp_AmendmentRequest.DocumentId = 0;
        $scope.exp_PaymentProcess.IsActive = true;
        GetAllActiveGridCompany();
        GetAllPaymentProcess();
        GetAllAmendmentReason();
        GetConfirmationMessageForAdmin();
        //GetUsersPermissionDetails();
        GetInvoiceList();
        $scope.button = "Save";

    }
    Clear();

    function GetInvoiceList() {
        $http({
            url: '/ExpInvoice/GetAllInvoice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.InvoiceDropdownList = data;

        });
    }
    function GetAllPaymentProcess() {
        $http({
            url: '/ExpPaymentProcess/GetAllPaymentProcess',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.PaymentProcessList = data;
            console.log($scope.PaymentProcessList);
        });
    }

    function GetAllAmendmentReason() {
        $http({
            url: '/ExpAmendmentReason/GetAllAmendmentReason',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AmendmentReasonList = data;
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
    function GetAllActiveGridCompany() {
        var criteria = "C.IsActive=1";
        $http({
            url: '/Company/GetCompanyDynamic?searchCriteria=' + criteria + "&orderBy=CompanyName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CompanyDropdownGridList = data;
        })
    }
    function SavePaymentProcess(status) {

        $scope.exp_PaymentProcess.InvoiceIdsArray = [];
        var InvIds = '';
        angular.forEach($scope.InvoiceSearchList, function (e) {
            if (e.IsCheck) {
                InvIds += InvIds === '' ? ('' + e.InvoiceId) : (',' + e.InvoiceId);
                $scope.InvCount++;
            }
            if ($scope.InvCount < 0) {
                alert("Please select at least one invoice");
                return;
            }
            $scope.exp_PaymentProcess.InvoiceIds = InvIds;
        });

        var parms = JSON.stringify({ exp_PaymentProcess: $scope.exp_PaymentProcess });

        $http.post('/ExpPaymentProcess/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Payment Process ' + status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.PaymentProcessEntryForm.$setPristine();
                $scope.PaymentProcessEntryForm.$setUntouched();
                $scope.reviseExpGenerateForm.$setPristine();
                $scope.reviseExpGenerateForm.$setUntouched();
                $("#txtPaymentProcessName").focus();
            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });

    }
    function SaveAmendmentRequest(status) {
        $scope.exp_AmendmentRequest.ApprovalType = 'ExpAmendment';
        var parms = JSON.stringify({ expApproval: $scope.exp_AmendmentRequest });

        $http.post('/ExpApproval/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Amendment Request ' + status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.PaymentProcessEntryForm.$setPristine();
                $scope.PaymentProcessEntryForm.$setUntouched();
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


    $scope.AmendmentRequest = function () {
        $scope.AmendmentRequestCheck = true;
    }

    //$scope.selectAllCheck = function (value) {
    //    if (value == true) {
    //        angular.forEach($scope.InvoiceSearchList, function (data1) {
    //            var upInvoiceId = data1.InvoiceId;
    //            $scope.InvoiceWiseItemSubListAdd = Enumerable.From($scope.ItemLists).Where('$.InvoiceId==' + upInvoiceId).ToArray();
    //            angular.forEach($scope.InvoiceWiseItemSubListAdd, function (data2) {
    //                var LoInvoiceId = data2.InvoiceId;
    //                $scope.InvoiceWiseItemSubListAdd = Enumerable.From($scope.InvoiceWiseItemSubListAdd).Where('$.InvoiceId==' + LoInvoiceId).ToArray();
    //                $scope.InvoiceWiseItemList.push(data2);
    //            });

    //        });
    //    }
    //    else {
    //        $scope.InvoiceWiseItemList = [];
    //    }
    //    $scope.Count = 0;
    //    if ($scope.InvoiceSearchList) {
    //        angular.forEach($scope.InvoiceSearchList, function (e) {
    //            e.IsCheck = value;
    //            if (e.IsCheck) {
    //                $scope.Count += e.Amount;
    //            }
    //        });

    //        if (!value) {
    //            $scope.Count = 0;
    //        }
    //        $scope.exp_PaymentProcess.Amount = $scope.Count;
    //    }
    //}

    $scope.SelectCheck = function (row, value) {
        var invoiceId = row.InvoiceId;
        var isMarge = false;
        if (value == true) {
            if ($scope.InvoiceWiseItemList.length) {
                var InvoiceWiseItemSubListAdd = Enumerable.From($scope.ItemLists).Where('$.InvoiceId==' + invoiceId).ToArray();
                angular.forEach(InvoiceWiseItemSubListAdd, function (aItem) {
                    var isExist = Enumerable.From($scope.InvoiceWiseItemList).Where('$.ItemId==' + aItem.ItemId).FirstOrDefault();
                    if (isExist) {
                        isExist.Quantity += aItem.Quantity;
                        isExist.isMarge = true;
                        GetItemListArray();

                    }
                    else {
                        aItem.isMarge = false;
                        $scope.InvoiceWiseItemList.push(aItem);
                    }

                });
            }
            else {
                var invoiceItem = Enumerable.From($scope.ItemLists).Where('$.InvoiceId==' + invoiceId).ToArray();
                angular.forEach(invoiceItem, function (data) {
                    data.isMarge = isMarge;
                    $scope.InvoiceWiseItemList.push(data);
                });
            }

        }
        else {

            var InvoiceWiseItemSubListSubtract = Enumerable.From($scope.ItemLists).Where('$.InvoiceId==' + invoiceId).ToArray();
            angular.forEach(InvoiceWiseItemSubListSubtract, function (data) {
                var isMargeExist = Enumerable.From($scope.InvoiceWiseItemList).Where('$.isMarge==true').FirstOrDefault();
                if (isMargeExist && isMargeExist.ItemId == data.ItemId) {
                    isMargeExist.Quantity -= data.Quantity;
                    isMargeExist.isMarge = false;
                }
                else {
                    var isHashKey = Enumerable.From($scope.InvoiceWiseItemList).Where('$.ItemId==' + data.ItemId).FirstOrDefault();
                    var index = $scope.InvoiceWiseItemList.indexOf(isHashKey);
                    $scope.InvoiceWiseItemList.splice(index, 1);
                }
            });
        }
        row.IsCheck = value;
        if (row.IsCheck) {
            $scope.Count += row.Amount;
        }
        else {
            $scope.Count -= row.Amount;
        }
        $scope.exp_PaymentProcess.Amount = $scope.Count;

    }
    $scope.LoadPaymentProcess = function (password) {

        $http({
            url: '/ExpApproval/exp_ExpAmendment_GetForEdit?approvalType=ExpAmendment&approvalPassword=' + password,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            console.log(data);
            if (data.length > 0) {
                var res1 = data[0].ApplicationDate.substring(0, 5);
                var res2 = data[0].LcDate.substring(0, 5);
                var res3 = data[0].ExportContactDate.substring(0, 5);
                if (res1 && res2 && res3 == "/Date") {
                    var parsedDate1 = new Date(parseInt(data[0].ApplicationDate.substr(6)));
                    var parsedDate2 = new Date(parseInt(data[0].LcDate.substr(6)));
                    var parsedDate3 = new Date(parseInt(data[0].ExportContactDate.substr(6)));
                    var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                    var date2 = ($filter('date')(parsedDate2, 'MMM dd, yyyy')).toString();
                    var date3 = ($filter('date')(parsedDate3, 'MMM dd, yyyy')).toString();
                    data[0].ApplicationDate = date1;
                    data[0].LcDate = date2;
                    data[0].ExportContactDate = date3;
                }
               
                $scope.exp_PaymentProcess = data[0];
                $scope.ddlPaymentProcessType = { PaymentProcessType: data[0].PaymentProcessType }
                GetAllActiveCompany();
                $scope.ddlCompany = { CompanyId: data[0].CompanyId }
                CompanyChange();
                $scope.paymentProcess.Password = '';
                $scope.reviseExpGenerateForm.$setPristine();
                $scope.reviseExpGenerateForm.$setUntouched();
                SelectCheck(data[0].PaymentProcessId, true);
                
               
            }
            else { 
                alertify.log(' Password is not matched!', 'already', '5000');
                $('#txtOtp').val('');
                $scope.reviseExpGenerateForm.$setUntouched();

            }
           
        });
    }
    function SelectCheck(id, value) {
        var isMarge = false;
        if (value == true) {
            if ($scope.InvoiceWiseItemList.length) {
                $http({
                    url: '/ExpPaymentProcess/GetItemByPaymentProcess?id=' + id + '&docType=PaymentProcess',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    $scope.ItemLists = data;
                    var InvoiceWiseItemSubListAdd = $scope.ItemLists;
                    angular.forEach(InvoiceWiseItemSubListAdd, function (aItem) {
                        var isExist = Enumerable.From($scope.InvoiceWiseItemList).Where('$.ItemId==' + aItem.ItemId).FirstOrDefault();
                        if (isExist) {
                            isExist.OrderQty += aItem.OrderQty;
                            isExist.isMarge = true;
                            // GetItemByInvoice(invoiceId);

                        }
                        else {
                            aItem.isMarge = false;
                            $scope.InvoiceWiseItemList.push(aItem);
                        }

                    });
                });

            }
            else {
                $http({
                    url: '/ExpPaymentProcess/GetItemByPaymentProcess?id=' + id + '&docType=PaymentProcess',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    $scope.ItemLists = data;
                    var invoiceItem = $scope.ItemLists;
                    angular.forEach(invoiceItem, function (data) {
                        data.isMarge = isMarge;
                        $scope.InvoiceWiseItemList.push(data);
                    });
                });

            }

        }
        else {

            $http({
                url: '/ExpPaymentProcess/GetItemByPaymentProcess?id=' + id + '&docType=PaymentProcess',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.ItemLists = data;
                var InvoiceWiseItemSubListSubtract = $scope.ItemLists;
                angular.forEach(InvoiceWiseItemSubListSubtract, function (data) {
                    var isMargeExist = Enumerable.From($scope.InvoiceWiseItemList).Where('$.isMarge==true').FirstOrDefault();
                    if (isMargeExist && isMargeExist.ItemId == data.ItemId) {
                        isMargeExist.OrderQty -= data.OrderQty;
                        isMargeExist.isMarge = false;
                    }
                    else {
                        var isHashKey = Enumerable.From($scope.InvoiceWiseItemList).Where('$.ItemId==' + data.ItemId).FirstOrDefault();
                        if (isHashKey.isMarge != true) {
                            var index = $scope.InvoiceWiseItemList.indexOf(isHashKey);
                            $scope.InvoiceWiseItemList.splice(index, 1);
                        }
                        else if (isHashKey.isMarge == true) {
                            isHashKey.OrderQty -= data.OrderQty;
                            isHashKey.isMarge = false;
                        }

                    }
                });
            });


        }
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
    function CompanyChange() {

        $scope.InvoiceIdList = $scope.exp_PaymentProcess.InvoiceIds.split(',');

        var invType = $scope.exp_PaymentProcess.PaymentProcessType === 'LC' ? 'PI' : 'SC';
        var where = "InvoiceType = '" + invType + "' AND ImporterBankId IN (SELECT BankAccountId FROM ad_BankAccount WHERE AccountRefId = " + $scope.ddlCompany.CompanyId + ") AND InvoiceId IN (SELECT DocumentId FROM exp_Approval WHERE [ApprovalType]='PiNew' AND IsApproved=1)";

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
            $scope.InvoiceListForFilter = data;
            angular.forEach($scope.InvoiceIdList, function (aInvoice) {
                var CompanyWiseInvoiceList = Enumerable.From($scope.InvoiceListForFilter).Where('$.InvoiceId==' + aInvoice).ToArray();
                CompanyWiseInvoiceList[0].IsCheck = true;
                $scope.InvoiceSearchList.push(CompanyWiseInvoiceList[0]);
            });
        })

    }

    $scope.CompanyChange = function () {
        CompanyChange();
    }

    $scope.LoadExpInfo = function (aPaymentProcess) {
        $scope.PaymentProcessForAmendment = {
            LcScNo: aPaymentProcess.LcNo,
            ImporterName: aPaymentProcess.CompanyName
        };
        $scope.exp_AmendmentRequest.DocumentId = aPaymentProcess.PaymentProcessId;

    }
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
            else {
                if ($scope.ad_PaymentProcess.PaymentProcessId == 0) {
                    SavePaymentProcess('Saved');
                }
              
            }
        }
    };
    $scope.SaveAmendmentRequest = function () {
        if ($scope.ConfirmationMessageForAdmin) {
            if ($scope.exp_AmendmentRequest.AmendmentRequestId == 0 ) {
                alertify.confirm("Are you sure to save?", function (e) {
                    if (e) {
                        SaveAmendmentRequest('Saved');
                    }
                })
            }
          
        }
    }
    $scope.resetForm = function () {
        Clear();
        $scope.PaymentProcessEntryForm.$setPristine();
        $scope.PaymentProcessEntryForm.$setUntouched();
    };

    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ PaymentProcessId: $scope.exp_PaymentProcess.PaymentProcessId });
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
    $('#txtFromPpDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,


    });

    $scope.CalendarFromPpDate = function () {
        $("#txtFromPpDate").focus();
        $("#txtFromPpDate").trigger("click");
    }
    $('#txtToPpDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,

    });

    $scope.CalendarToPpDate = function () {
        $("#txtToPpDate").focus();
        $("#txtToPpDate").trigger("click");
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