app.controller("PurchaseAcknowledgementEntryController", function ($scope, $cookieStore, $http, $filter, $window) {
    //#region  GLOBAL VARIABLES & METHODS CALL
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.CurrentValuationSetup = $cookieStore.get('Valuation');
    Clear();
    GetActiveSupplier();
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
        $scope.inv_PurchaseBillList = [];
        $scope.inv_PurchaseBill = { ApprovedBy: $scope.LoginUser.UserId, ApprovedDate: today };
        $scope.MinDate = new Date(parseInt($scope.CurrentValuationSetup.FromDate.replace('/Date(', '')));
        $scope.FromDate = $scope.ToDate = today;
        $scope.VoucherNoExist = false;
    }

    function GetActiveSupplier() {
        $http({
            url: '/Supplier/GetDynamic?searchCriteria=IsActive=1',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.supplierList = data;
        })
    }
    //#endregion 

    //#region EVENTS
    $scope.SearchPurchaseBill = function () {
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

        var criteria = "IsApproved=0 AND PBDate BETWEEN '" + fromDate + "' AND '" + toDate + "'";

        if ($scope.ddlSupplier !== undefined && $scope.ddlSupplier != null) {
            criteria += " AND SupplierId=" + $scope.ddlSupplier.SupplierId;
        }

        $http({
            url: '/PurchaseBill/GetPBDynamic?where=' + criteria + "&orderBy='PBDate'",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                angular.forEach(data, function (aSd) {
                    var res1 = aSd.PBDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.PBDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aSd.PBDate = date1;
                    }
                })
            }
            else
                alertify.log('No Purchase Bill Found', 'error', '5000');

            $scope.PurchaseBillList = data;
        });
    }

    $scope.CheckVoucherNoExists = function () {
        if (!angular.isUndefined($scope.inv_PurchaseBill.VoucherNo) && $scope.inv_PurchaseBill.VoucherNo != null && $scope.inv_PurchaseBill.VoucherNo != '') {
            $http({
                url: "/CompanyAdvance/CheckVoucherNoExists?voucherNo=" + $scope.inv_PurchaseBill.VoucherNo,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                if (data.length && data[0].VoucherCount > 0) {
                    alertify.log('Voucher No.' + $scope.inv_PurchaseBill.VoucherNo + ' already exists!', 'error', '5000');
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
        $scope.inv_PurchaseBillList = Enumerable.From($scope.PurchaseBillList).Where('$.selected==true').ToArray();
        $scope.inv_PurchaseBill.Amount = Enumerable.From($scope.inv_PurchaseBillList).Sum('$.Amount').toFixed(2);
    }

    $scope.SaveAcknowledgement = function () {
        var accountsTrn = {};
        accountsTrn.Narration = 'Orders: ';

        angular.forEach($scope.inv_PurchaseBillList, function (aPb) {
            aPb.ApprovedBy = $scope.inv_PurchaseBill.ApprovedBy;
            aPb.ApprovedDate = $scope.inv_PurchaseBill.ApprovedDate;
            if (accountsTrn.Narration === 'Orders: ')
                accountsTrn.Narration += aPb.PBNo + '(' + aPb.SupplierName + ')';
            else
                accountsTrn.Narration += ', ' + aPb.PBNo + '(' + aPb.SupplierName + ')';
        });

        accountsTrn.ActionType = 'Journal';
        accountsTrn.RefType = 'Purchase';
        accountsTrn.FromAccountCode = '5001';   //Purchases
        accountsTrn.ToAccountCode = '2001';     //AP
        //accountsTrn.Narration = 'Purchased goods from ' + $scope.inv_PurchaseBill.SupplierName + ' [Order No: ' + $scope.inv_PurchaseBill.PBNo + ']';
        accountsTrn.TxDate = $scope.inv_PurchaseBill.ApprovedDate;
        accountsTrn.RefNumber = $scope.inv_PurchaseBill.PBId;
        accountsTrn.Amount = $scope.inv_PurchaseBill.Amount;
        accountsTrn.CreatorId = $scope.inv_PurchaseBill.ApprovedBy;

        alertify.confirm("Are you sure to save?", function (e) {
            if (e) {
                var params = JSON.stringify({ accountsTransaction: accountsTrn, salesOrderList: [], purBillList: $scope.inv_PurchaseBillList });
                $http.post('/AccountsTransaction/Acknowledge', params).success(function (data) {
                    if (data > 0) {
                        alertify.log('Acknowledgements saved successfully!', 'success', '5000');
                        Clear();
                        $scope.PurchaseBillList = [];
                        $scope.ddlSupplier = null;
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
        $scope.PurchaseBillList = [];
        $scope.ddlSupplier = null;
        $scope.purchaseAcknowledgementEntryForm.$setPristine();
        $scope.purchaseAcknowledgementEntryForm.$setUntouched();
    }

    $scope.ShowReport = function (salesOrderId) {
        $window.open("/ErpReports/RV_Pos_SalesOrderBySalesOrderId.aspx?SalesOrderId=" + salesOrderId, "_blank", "width=790,height=630,left=340,top=25");
    }
    //#endregion
})