app.controller("PurchaseRealizationEntryController", function ($scope, $cookieStore, $http, $filter) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.CurrentValuationSetup = $cookieStore.get('Valuation');
    Clear();
    GetActiveSupplier();
    GetCashAndBankAccounts();

    //#region  Date Config
    $('#dtRealizationDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,
        minDate: new Date(parseInt($scope.CurrentValuationSetup.FromDate.replace('/Date(', ''))),
        maxDate: new Date(parseInt($scope.CurrentValuationSetup.ToDate.replace('/Date(', '')))
    });

    $scope.CalendarOpenApprovedDate = function () {
        $("#dtRealizationDate").focus();
        $("#dtRealizationDate").trigger("click");
    }
    //#endregion 

    function Clear() {
        var today = ($filter('date')(new Date(), 'MMM dd, yyyy')).toString();
        $scope.pay_PurchaseRealization = {
            FinancialCycleId: $scope.CurrentValuationSetup.FinancialCycleId, PaymentDate: today, UpdatorId: $scope.LoginUser.UserId,
            UpdateDate: today, PBId: 0, FromAdvance: 0, TDS: 0, VDS: 0
        };
    }

    function ClearAll() {
        Clear();
        $scope.PurchasesOrderList = [];
        $scope.ddlSupplier = null;
        $scope.ddlPaymentType = null;
        $scope.TotalDue = $scope.TotalAdvance = $scope.TotalReceivable = null;
    }

    function GetActiveSupplier() {
        $http({
            url: '/Supplier/GetDynamic?searchCriteria=IsActive=1&orderBy=SupplierName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.SupplierList = data;
        })
    }

    function GetCashAndBankAccounts() {
        $http({
            url: '/AccountsTransaction/GetCashAndBankAccounts',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.PaymentTypeList = data;
        })
    }

    $scope.GetSupplierTotals = function () {
        $scope.TotalDue = $scope.TotalAdvance = $scope.TotalReceivable = $scope.ddlPaymentType = null;
        Clear();
        $scope.pay_PurchaseRealization.SupplierId = $scope.ddlSupplier.SupplierId
        $scope.PurchasesOrderList = [];
        $scope.purchaseRealizationEntryForm.$setPristine();

        if (angular.isUndefined($scope.ddlSupplier) || $scope.ddlSupplier == null)
            return;

        $http({
            url: '/AccountsTransaction/GetSupplierTotals?financialCycleId=' + $scope.CurrentValuationSetup.FinancialCycleId + '&supplierId=' + $scope.ddlSupplier.SupplierId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (!data.length) {
                alertify.log('No information found for this supplier', 'error', '5000');
                return;
            }

            if (data[0].Msg != '') {
                $scope.ddlSupplier = null;
                alertify.log(data[0].Msg, 'error', '5000');
                return;
            }

            $scope.TotalDue = data[0].TotalDue;
            $scope.TotalAdvance = data[0].TotalAdvance;
            $scope.TotalReceivable = data[0].TotalReceivable;
            
            var plus = encodeURIComponent('+');
            var criteria = 'SupplierId=' + $scope.ddlSupplier.SupplierId
                + ' AND (CAST(((ISNULL((SELECT SUM(OrderQty*OrderPrice) FROM pos_PurchasesOrderDetail D WHERE D.PurchasesOrderId=SO.PurchasesOrderId),0))-(ISNULL((SELECT SUM(Amount) FROM pay_PurchaseAdjustment A WHERE A.PurchasesOrderId=SO.PurchasesOrderId),0))-(ISNULL((SELECT SUM(Amount' + plus + 'FromAdvance) FROM pay_PurchaseRealization R WHERE R.PurchasesOrderId=SO.PurchasesOrderId),0))) AS DECIMAL(16,2)))>0'
            $http({
                url: '/PurchaseBill/GetForRealization?financialCycleId=' + $scope.CurrentValuationSetup.FinancialCycleId + '&supplierId=' + $scope.ddlSupplier.SupplierId,
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
                    $scope.PurchasesOrderList = data;
                }
                else
                    alertify.log('No Purchases Order Found', 'error', '5000');
            });

        }).error(function (msg) {
            $scope.ddlSupplier = null;
            alertify.log('Supplier select failed, refresh page and try again', 'error', '5000');
        });
    }

    $scope.LoadInInvoices = function () {
        var amount = (angular.isUndefined($scope.pay_PurchaseRealization.Amount) ? 0 : $scope.pay_PurchaseRealization.Amount);
        var advance = (angular.isUndefined($scope.pay_PurchaseRealization.FromAdvance) ? 0 : $scope.pay_PurchaseRealization.FromAdvance);
        var tds = (angular.isUndefined($scope.pay_PurchaseRealization.TDS) ? 0 : $scope.pay_PurchaseRealization.TDS);
        var vds = (angular.isUndefined($scope.pay_PurchaseRealization.VDS) ? 0 : $scope.pay_PurchaseRealization.VDS);
        var payTotal = amount + advance + tds + vds;

        $scope.pay_PurchaseRealization.Amount = amount;
        $scope.pay_PurchaseRealization.FromAdvance = advance;
        $scope.pay_PurchaseRealization.TDS = tds;
        $scope.pay_PurchaseRealization.VDS = vds;

        if (payTotal > $scope.pay_PurchaseRealization.TotalDue) {
            alertify.log('Cannot pay more than Invoice Amount', 'error', '5000');
            return;
        }

        angular.forEach($scope.PurchasesOrderList, function (aSd) {
            if (aSd.PBId == $scope.pay_PurchaseRealization.PBId) {
                aSd.RcvAmount = $scope.pay_PurchaseRealization.Amount;
                aSd.FromAdvance = $scope.pay_PurchaseRealization.FromAdvance;
                aSd.TDS = $scope.pay_PurchaseRealization.TDS;
                aSd.VDS = $scope.pay_PurchaseRealization.VDS;
                aSd.Subtotal = (aSd.RcvAmount + aSd.FromAdvance + aSd.TDS + aSd.VDS);
            }
        })
    }

    $scope.SaveRealization = function () {
        var accountsTrn = {};
        accountsTrn.FinancialCycleId = $scope.pay_PurchaseRealization.FinancialCycleId;
        accountsTrn.SupplierId = $scope.pay_PurchaseRealization.SupplierId;
        accountsTrn.RefNumber = $scope.pay_PurchaseRealization.PBId;
        accountsTrn.ActionType = 'Payment';
        accountsTrn.RefType = 'Purchase Payment';
        accountsTrn.PaymentTypeId = $scope.pay_PurchaseRealization.PaymentTypeId;
        accountsTrn.FromAccountCode = '2001'; //AP
        accountsTrn.ToAccountCode = accountsTrn.PaymentTypeId;   //CIH  
        accountsTrn.Narration = $scope.pay_PurchaseRealization.Narration;
        accountsTrn.TxDate = $scope.pay_PurchaseRealization.PaymentDate;
        accountsTrn.Amount = $scope.pay_PurchaseRealization.Amount;
        accountsTrn.FromAdvance = $scope.pay_PurchaseRealization.FromAdvance;
        accountsTrn.TDS = $scope.pay_PurchaseRealization.TDS;
        accountsTrn.VDS = $scope.pay_PurchaseRealization.VDS;
        accountsTrn.CreatorId = $scope.pay_PurchaseRealization.UpdatorId;

        alertify.confirm("Are you sure to save?", function (e) {
            if (e) {
                var params = JSON.stringify({ accountsTransaction: accountsTrn });
                $http.post('/AccountsTransaction/Realization', params).success(function (data) {
                    if (data > 0) {
                        alertify.log('Realization saved successfully!', 'success', '5000');
                        $scope.ResetForm();
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
        ClearAll();
        $scope.purchaseRealizationEntryForm.$setPristine();
        $scope.purchaseRealizationEntryForm.$setUntouched();
    }
})