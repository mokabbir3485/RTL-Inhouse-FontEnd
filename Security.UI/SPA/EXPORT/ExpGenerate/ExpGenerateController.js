app.controller("ExpGenerateController", function ($scope, $cookieStore, $http, $filter, $window) {


    function Clear() {
        $scope.Count = 0;
        $scope.SOCount = 0;
        $scope.rowCount = 0;
        $scope.EvenrowCount = 0;
        $scope.OddrowCount = 0;
        $scope.QtySum = 0;
        $scope.flug = 0;
        $scope.PaymentProcessTypeList = [{ PaymentProcessType: 'LC' }, { PaymentProcessType: 'TT' }, { PaymentProcessType: 'FDD' }]
        $scope.exp_PaymentProcess = {};
        $scope.exp_AmendmentRequest = {};
        $scope.PaymentProcessList = [];
        $scope.InvoiceSearchList = []; 
        $scope.AmendmentReasonList = [];
        $scope.CompanyDropdownList = [];
        $scope.CompanyDropdownGridList = [];
        $scope.ProformaInvoiceList = [];
        $scope.InvoiceIdLis = [];
        $scope.InvoiceWiseItem = [];
        $scope.InvoiceWiseItemList = [];
        $scope.ItemLists = [];
        $scope.InvoiceDropdownList = [];

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

    $scope.OpenReport = function (id) {
        $window.open("http://43.224.119.250/Reports_MSSQLSERVER2016/report/Reports/Export/Rpt_ExpNoRequestApplication?PaymentProcessId=" + id);
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
                $http({
                    url: '/ExpInvoice/GetItemByInvoice?invoiceId=' + invoiceId,
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
                    url: '/ExpInvoice/GetItemByInvoice?invoiceId=' + invoiceId,
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
                url: '/ExpInvoice/GetItemByInvoice?invoiceId=' + invoiceId,
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
    $scope.CompanyChange = function () {
        var invType = $scope.ddlPaymentProcessType.PaymentProcessType === 'LC' ? 'PI' : 'SC';
        var where = "InvoiceType = '" + invType + "' AND ImporterBankId IN (SELECT BankAccountId FROM ad_BankAccount WHERE AccountRefId = " + $scope.ddlCompany.CompanyId + ") AND InvoiceId IN (SELECT DocumentId FROM exp_Approval WHERE [ApprovalType]='PiNew' AND IsApproved=1) AND InvoiceId NOT IN (SELECT ISNULL(RTRIM(LTRIM(Name)),0) FROM dbo.SplitString((SELECT STUFF((SELECT ', ' " + encodeURIComponent('+') + "+ InvoiceIds FROM dbo.exp_PaymentProcess WITH(NOLOCK) FOR XML PATH('')), 1, 2, ''))))";
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
            console.log($scope.InvoiceSearchList);
        })
    }

    

    $scope.SearchProformaInvoice = function () {
        var criteria = "";
        var fromDate = $("#txtFromScDate").val();
        var toDate = $("#txtToScDate").val();
        if (fromDate !== "" || toDate !== "") {
            $scope.FromDate = fromDate;
            $scope.ToDate = toDate;
            console.log($scope.FromDate + "ToDate");

            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            var dateSplit = $scope.FromDate.split(' ');
            console.log(dateSplit + "dateSplit");
            var date = dateSplit[1].replace(',', '');
            var year = dateSplit[2];
            console.log(dateSplit[1] + "dateSplit[1]");
            console.log(date + "date");

            var month;
            for (var j = 0; j < months.length; j++) {
                if (dateSplit[0] == months[j]) {
                    month = months.indexOf(months[j]) + 1;
                }
            }
            var fromDate = year + "-" + month + "-" + date;

            dateSplit = $scope.ToDate.split(' ');
            date = dateSplit[1].replace(',', '');
            year = dateSplit[2];
            for (var j = 0; j < months.length; j++) {
                if (dateSplit[0] == months[j]) {
                    month = months.indexOf(months[j]) + 1;
                }
            }
            var toDate = year + "-" + month + "-" + date;
            if ($scope.InvoiceDate == "" || $scope.InvoiceDate == null) {
                criteria = "InvoiceDate BETWEEN '" + fromDate + "' AND '" + toDate + "'";
            }
            else {
                criteria = "InvoiceDate BETWEEN '" + fromDate + "' AND '" + toDate + "'";
            }

        }

        if ((fromDate !== "" || toDate !== "") && ($scope.ddlInvoiceNo !== undefined && $scope.ddlInvoiceNo != null)) {
            criteria += " AND InvoiceNo=" + "'" + $scope.ddlInvoiceNo.InvoiceNo + "'";
        }

        if ((fromDate === "" || toDate === "") && ($scope.ddlInvoiceNo !== undefined && $scope.ddlInvoiceNo != null)) {
            criteria += "InvoiceNo=" + "'" + $scope.ddlInvoiceNo.InvoiceNo + "'";
        }

        $http({
            url: '/ExpInvoice/GetExpInvoiceDynamic?searchCriteria=' + criteria + "&orderBy='InvoiceNo'",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                angular.forEach(data, function (aSd) {
                    var res1 = aSd.InvoiceDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.InvoiceDate.substr(6)));
                        console.log("parsedDate1 " + parsedDate1);
                        var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                        aSd.InvoiceDate = date1;
                        console.log("date1" + date1);
                    }
                })
            }
            else
                alertify.log('No Proforma Invoice Found', 'error', '5000');

            $scope.InvoiceSearchList = data;
        });
    }
    $scope.PaymentProcessSearch = function () {
        var fromDate = $("#txtFromPpDate").val();
        var toDate = $("#txtToPpDate").val();
        $scope.FromDate = fromDate;
        $scope.ToDate = toDate;
        console.log($scope.FromDate + "ToDate");

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var dateSplit = $scope.FromDate.split(' ');
        console.log(dateSplit + "dateSplit");
        var date = dateSplit[1].replace(',', '');
        var year = dateSplit[2];
        console.log(dateSplit[1] + "dateSplit[1]");
        console.log(date + "date");

        var month;
        for (var j = 0; j < months.length; j++) {
            if (dateSplit[0] == months[j]) {
                month = months.indexOf(months[j]) + 1;
            }
        }
        var fromDate = year + "-" + month + "-" + date;

        dateSplit = $scope.ToDate.split(' ');
        date = dateSplit[1].replace(',', '');
        year = dateSplit[2];
        for (var j = 0; j < months.length; j++) {
            if (dateSplit[0] == months[j]) {
                month = months.indexOf(months[j]) + 1;
            }
        }
        var toDate = year + "-" + month + "-" + date;
        if ($scope.ExpApplication == "" || $scope.ExpApplication == null) {
            var criteria = "ApplicationDate BETWEEN '" + fromDate + "' AND '" + toDate + "'";
        }
        else {
            alert($scope.ExpApplication);
            var criteria = "ApplicationDate BETWEEN '" + fromDate + "' AND '" + toDate + "'";
        }


        //if ($scope.ddlCompany !== undefined && $scope.ddlCompanyForGrid != null) {
        //    criteria += " AND PI.CompanyId=" + $scope.ddlCompanyForGrid.CompanyId;
        //}

        $http({
            url: '/ExpPaymentProcess/GetExpPaymentProcessDynamic?searchCriteria=' + criteria + "&orderBy='ApplicationDate'",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                angular.forEach(data, function (aSd) {
                    var res1 = aSd.ApplicationDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.ApplicationDate.substr(6)));
                        console.log("parsedDate1 " + parsedDate1);
                        var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                        aSd.ApplicationDate = date1;
                        console.log("date1" + date1);
                    }
                })
            }
            else
                alertify.log('No Proforma Invoice Found', 'error', '5000');

            $scope.PaymentProcessList = data;
        });
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
            var type = $scope.exp_PaymentProcess.PaymentProcessId === 0 ? 'Saved' : 'Updated';
            SavePaymentProcess(type);
        }
    };
    $scope.SaveAmendmentRequest = function () {
        if ($scope.ConfirmationMessageForAdmin) {
            if ($scope.exp_AmendmentRequest.AmendmentRequestId == 0) {
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