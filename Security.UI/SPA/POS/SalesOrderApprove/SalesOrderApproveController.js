app.controller("SalesOrderApproveController", function ($scope, $cookieStore, $http, $filter, $window) {
    //#region GLOBAL VARIABLES & METHODS CALL
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.CurrentValuationSetup = $cookieStore.get('Valuation');

    Clear();
    GetActiveCompany();

    function Clear() {
        var today = ($filter('date')(new Date(), 'MMM dd, yyyy')).toString();
        $scope.pos_SalesOrder = { AcknowledgedBy: $scope.LoginUser.UserId, AcknowledgedDate: today };
        //$scope.MinDate = new Date(parseInt($scope.CurrentValuationSetup.FromDate.replace('/Date(', '')));
        $scope.FromDate = today;
        $scope.ToDate = today;
        $scope.VoucherNoExist = false;
        $scope.DisBtn = false;
        $scope.btnDisable = true;


        $scope.SalesApproveList1 = [];
        $scope.pos_SalesApproveList = [];
        $scope.SalesOrderApproveList = [];
        $scope.SalesOrderAmendmentList = [];


        GetAllSalesOrderAmendmentApprove();
        GetSalesOrderAmendment();

        //$('#dtFromDate').datetimepicker({
        //    format: 'MMM DD, YYYY',
        //    timepicker: false,
        //    minDate: $scope.MinDate,
        //    maxDate: new Date(parseInt($scope.CurrentValuationSetup.ToDate.replace('/Date(', '')))
        //});

        //$('#dtToDate').datetimepicker({
        //    format: 'MMM DD, YYYY',
        //    timepicker: false,
        //    minDate: $scope.MinDate,
        //    maxDate: new Date(parseInt($scope.CurrentValuationSetup.ToDate.replace('/Date(', '')))
        //});

        //$('#dtApprovedDate').datetimepicker({
        //    format: 'MMM DD, YYYY',
        //    timepicker: false,
        //    minDate: $scope.MinDate,
        //    maxDate: new Date(parseInt($scope.CurrentValuationSetup.ToDate.replace('/Date(', '')))
        //});

        //$scope.CalendarOpenFromDate = function () {
        //    $("#dtFromDate").focus();
        //    $("#dtFromDate").trigger("click");
        //}

        //$scope.CalendarOpenToDate = function () {
        //    $("#dtToDate").focus();
        //    $("#dtToDate").trigger("click");
        //}

        //$scope.CalendarOpenApprovedDate = function () {
        //    $("#dtApprovedDate").focus();
        //    $("#dtApprovedDate").trigger("click");
        //}
    }

    function GetAllSalesOrderAmendmentApprove() {
        $http({
            url: '/ExpApproval/GetSalesOrder?approvalType=SoNew',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                angular.forEach(data, function (aSd) {
                    var res1 = aSd.DocDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.DocDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'mediumDate')).toString();
                        aSd.DocDate = date1;
                    }
                })
            }
            $scope.SalesApproveList1 = data;
        });
    }
    function GetSalesOrderAmendment() {

        $http({
            url: '/ExpApproval/GetSalesOrder?approvalType=SOAmendment',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.SalesOrderAmendmentList = data;
            console.log($scope.SalesOrderAmendmentList);
        });
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

    $scope.SaveAmendmentRequest = function () {
        $http({
            url: '/ExpApproval/CheckDuplicate?approvalType=SOAmendment&approvalPassword=' + $scope.aPassword,
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
                        alertify.log('SO Approved Successfully!', 'success', '5000');
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

    $scope.OpenReport = function (salesOrderNo) {
        console.log(salesOrderNo);

        $window.open("/ErpReports/RV_Pos_SalesOrderBySalesOrderId.aspx?SalesOrderId=" + salesOrderNo, "_blank", "width=790,height=630,left=340,top=25");
    }
    function GetActiveCompany() {
        $http({
            url: '/Company/GetCompanyDynamic?searchCriteria=C.IsActive=1&orderBy=CompanyName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.companyList = data;
        })
    }
    //#endregion 

    //#region EVENTS
    $scope.SearchSalesOrder = function () {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var dateSplit = $scope.FromDate.split(' ');
        var date = dateSplit[1].replace(',', '');
        var year = dateSplit[2];
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

        var criteria = "IsAcknowledged=0 AND SalesOrderDate BETWEEN '" + fromDate + "' AND '" + toDate + "'";

        if ($scope.ddlCompany !== undefined && $scope.ddlCompany != null) {
            criteria += " AND SO.CompanyId=" + $scope.ddlCompany.CompanyId;
        }

        $http({
            url: '/SalesOrder/GetSalesOrderDynamic?searchCriteria=' + criteria + "&orderBy='SalesOrderDate'",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                angular.forEach(data, function (aSd) {
                    var res1 = aSd.SalesOrderDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.SalesOrderDate.substr(6)));
                        // console.log(parsedDate1);
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aSd.SalesOrderDate = date1;
                    }
                })
            }
            else
                alertify.log('No Sales Order Found', 'error', '5000');

            $scope.SalesApproveList = data;
        });
    }

    $scope.CheckVoucherNoExists = function () {
        if (!angular.isUndefined($scope.pos_SalesOrder.VoucherNo) && $scope.pos_SalesOrder.VoucherNo != null && $scope.pos_SalesOrder.VoucherNo != '') {
            $http({
                url: "/CompanyAdvance/CheckVoucherNoExists?voucherNo=" + $scope.pos_SalesOrder.VoucherNo,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                if (data.length && data[0].VoucherCount > 0) {
                    alertify.log('Voucher No.' + $scope.pos_SalesOrder.VoucherNo + ' already exists!', 'error', '5000');
                    $scope.VoucherNoExist = true;
                    $('#txtVoucherNo').focus();
                }
                else {
                    $scope.VoucherNoExist = false;
                }
            });
        }
    }

    $scope.RowSelect = function () {
        $scope.pos_SalesApproveList = Enumerable.From($scope.SalesApproveList).Where('$.selected==true').ToArray();
        $scope.pos_SalesOrder.Amount = Enumerable.From($scope.pos_SalesApproveList).Sum('$.Amount').toFixed(2);
        $scope.btnDisable = false;
    }

    $scope.SelectSalesOrderApproveList = function (row, select) {
        row.Ischeck = select;
        row.IsApproved = true;
        row.ApprovedBy = row.UpdateBy = $scope.LoginUser.UserId;

        if (row.Ischeck) {
            row.ApprovalId = row.ApprovalId;
            $scope.SalesOrderApproveList.push(row);
        }
        else {
            var RowIndexList = [];

            angular.forEach($scope.SalesOrderApproveList, function (salesApprove) {
                if (salesApprove.Ischeck === row.Ischeck) {
                    var ind = $scope.SalesOrderApproveList.indexOf(salesApprove);
                    RowIndexList.push(ind);
                }
            });
            for (var i = RowIndexList.length - 1; i >= 0; i--) {
                $scope.SalesOrderApproveList.splice(RowIndexList[i], 1);
            }
        }

        if ($scope.SalesOrderApproveList.length > 0) {
            $scope.DisBtn = true;
        }
        else {
            $scope.DisBtn = false;
        }
    }

    $scope.SaveSalesOrderApprove = function () {

        if ($scope.SalesOrderApproveList.length <= 0) {
            alertify.log('Please select at least one sales order', 'error', '5000');
            return;
        }
        alertify.confirm("Are you sure to submit?", function (e) {
            if (e) {
                var params = JSON.stringify({ expApproval: $scope.SalesOrderApproveList });
                $http.post('/ExpApproval/UpdateApproval', params).success(function (data) {
                    if (data > 0) {
                        alertify.log('Sales Order Approved successfully!', 'success', '5000');
                        GetAllSalesOrderAmendmentApprove();
                    }
                    else {
                        alertify.log('Network Error, refresh page and try again', 'error', '5000');
                    }
                }).error(function (msg) {
                    alertify.log('Network Error, refresh page and try again', 'error', '5000');
                });
            }
        })
    }

    $scope.SaveAcknowledgement = function () {
        var accountsTrn = {};
        accountsTrn.Narration = 'Orders: ';

        angular.forEach($scope.pos_SalesApproveList, function (aSd) {
            aSd.AcknowledgedBy = $scope.pos_SalesOrder.AcknowledgedBy;
            aSd.AcknowledgedDate = $scope.pos_SalesOrder.AcknowledgedDate;
            if (accountsTrn.Narration === 'Orders: ')
                accountsTrn.Narration += aSd.SalesOrderNo + '(' + aSd.CompanyName + ')';
            else
                accountsTrn.Narration += ', ' + aSd.SalesOrderNo + '(' + aSd.CompanyName + ')';
        });

        accountsTrn.ActionType = 'Journal';
        accountsTrn.RefType = 'Sale';
        accountsTrn.FromAccountCode = '4001';   //Sales
        accountsTrn.ToAccountCode = '1001';     //AR
        //accountsTrn.Narration = 'Sold goods to ' + $scope.pos_SalesOrder.CompanyName + ' [Order No: ' + $scope.pos_SalesOrder.SalesOrderNo + ']';
        accountsTrn.TxDate = $scope.pos_SalesOrder.AcknowledgedDate;
        accountsTrn.RefNumber = 1;
        accountsTrn.Amount = $scope.pos_SalesOrder.Amount;
        accountsTrn.CreatorId = $scope.pos_SalesOrder.AcknowledgedBy;

        alertify.confirm("Are you sure to submit?", function (e) {
            if (e) {
                var params = JSON.stringify({ accountsTransaction: accountsTrn, SalesApproveList: $scope.pos_SalesApproveList, purBillList: [] });
                $http.post('/AccountsTransaction/Acknowledge', params).success(function (data) {
                    if (data > 0) {
                        alertify.log('Acknowledgements saved successfully!', 'success', '5000');
                        Clear();
                        $scope.SalesApproveList = [];
                        $scope.ddlCompany = null;
                    }
                    else {
                        alertify.log('Save failed, refresh page and try again', 'error', '5000');
                    }
                }).error(function (msg) {
                    alertify.log('Save failed, refresh page and try again', 'error', '5000');
                });
            }
        })
    }

    $scope.ResetForm = function () {
        Clear();
        $scope.SalesApproveList = [];
        $scope.ddlCompany = null;
        $scope.saleAcknowledgementEntryForm.$setPristine();
        $scope.saleAcknowledgementEntryForm.$setUntouched();
    }

    $scope.ShowReport = function (purBillId) {
        $window.open("/ErpReports/RV_Inv_PurchaseBillByPBId.aspx?PBId=" + purBillId, "_blank", "width=790,height=630,left=340,top=25");
    }
    //#endregion

})