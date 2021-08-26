app.controller("SaleAcknowledgementEntryController", function ($scope, $cookieStore, $http, $filter, $window) {
    //#region GLOBAL VARIABLES & METHODS CALL
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.CurrentValuationSetup = $cookieStore.get('Valuation');
    Clear();
    GetActiveCompany();
    //#endregion 

    //#region DATE CONFIG WITH JQUERY
    $('#dtFromDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,
        minDate: $scope.MinDate,
        maxDate: new Date(parseInt($scope.CurrentValuationSetup.ToDate.replace('/Date(', '')))
    });

    $('#dtToDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,
        minDate: $scope.MinDate,
        maxDate: new Date(parseInt($scope.CurrentValuationSetup.ToDate.replace('/Date(', '')))
    });

    $('#dtApprovedDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,
        minDate: $scope.MinDate,
        maxDate: new Date(parseInt($scope.CurrentValuationSetup.ToDate.replace('/Date(', '')))
    });

    $scope.CalendarOpenFromDate = function () {
        $("#dtFromDate").focus();
        $("#dtFromDate").trigger("click");
    }

    $scope.CalendarOpenToDate = function () {
        $("#dtToDate").focus();
        $("#dtToDate").trigger("click");
    }

    $scope.CalendarOpenApprovedDate = function () {
        $("#dtApprovedDate").focus();
        $("#dtApprovedDate").trigger("click");
    }
    //#endregion 

    //#region METHODS
    function Clear() {
        var today = ($filter('date')(new Date(), 'MMM dd, yyyy')).toString();
        $scope.pos_SalesOrderList = [];
        $scope.pos_SalesOrder = { AcknowledgedBy: $scope.LoginUser.UserId, AcknowledgedDate: today };
        $scope.MinDate = new Date(parseInt($scope.CurrentValuationSetup.FromDate.replace('/Date(', '')));
        $scope.FromDate = $scope.ToDate = today;
        $scope.VoucherNoExist = false;
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
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aSd.SalesOrderDate = date1;
                    }
                })
            }
            else
                alertify.log('No Sales Order Found', 'error', '5000');

            $scope.SalesOrderList = data;
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
        $scope.pos_SalesOrderList = Enumerable.From($scope.SalesOrderList).Where('$.selected==true').ToArray();
        $scope.pos_SalesOrder.Amount = Enumerable.From($scope.pos_SalesOrderList).Sum('$.Amount').toFixed(2);
    }

    $scope.SaveAcknowledgement = function () {
        var accountsTrn = {};
        accountsTrn.Narration = 'Orders: ';

        angular.forEach($scope.pos_SalesOrderList, function (aSd) {
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

        alertify.confirm("Are you sure to save?", function (e) {
            if (e) {
                var params = JSON.stringify({ accountsTransaction: accountsTrn, salesOrderList: $scope.pos_SalesOrderList, purBillList: [] });
                $http.post('/AccountsTransaction/Acknowledge', params).success(function (data) {
                    if (data > 0) {
                        alertify.log('Acknowledgements saved successfully!', 'success', '5000');
                        Clear();
                        $scope.SalesOrderList = [];
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
        $scope.SalesOrderList = [];
        $scope.ddlCompany = null;
        $scope.saleAcknowledgementEntryForm.$setPristine();
        $scope.saleAcknowledgementEntryForm.$setUntouched();
    }

    $scope.ShowReport = function (purBillId) {
        $window.open("/ErpReports/RV_Inv_PurchaseBillByPBId.aspx?PBId=" + purBillId, "_blank", "width=790,height=630,left=340,top=25");
    }
    //#endregion
})