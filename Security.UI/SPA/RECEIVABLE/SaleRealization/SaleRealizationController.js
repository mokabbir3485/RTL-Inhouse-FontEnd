app.controller("SaleRealizationEntryController", function ($scope, $cookieStore, $http, $filter, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.CurrentValuationSetup = $cookieStore.get('Valuation');
    Clear();
    GetActiveCompany();
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

    $('#dtChequeDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,
        minDate: new Date(parseInt($scope.CurrentValuationSetup.FromDate.replace('/Date(', ''))),
        maxDate: new Date(parseInt($scope.CurrentValuationSetup.ToDate.replace('/Date(', '')))
    });

    $scope.CalendarOpenChequeDate = function () {
        $("#dtChequeDate").focus();
        $("#dtChequeDate").trigger("click");
    }
    //#endregion 

    function Clear() {
        var today = ($filter('date')(new Date(), 'MMM dd, yyyy')).toString();
        $scope.rcv_SaleRealization = {
            FinancialCycleId: $scope.CurrentValuationSetup.FinancialCycleId, PaymentDate: today, UpdatorId: $scope.LoginUser.UserId,
            UpdateDate: today, SalesOrderId: 0, FromAdvance: 0, TDS: 0, VDS: 0
        };
        $scope.VoucherNoExist = false;
    }

    function ClearAll() {
        Clear();
        $scope.SalesOrderList = [];
        $scope.ddlCompany = null;
        $scope.ddlPaymentType = null;
        $scope.TotalDue = $scope.TotalAdvance = $scope.TotalPayable = null;
    }

    function GetActiveCompany() {
        $http({
            url: '/Company/GetCompanyDynamic?searchCriteria=C.IsActive=1&orderBy=CompanyName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CompanyList = data;
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

    $scope.GetCompanyTotals = function () {
        $scope.TotalDue = $scope.TotalAdvance = $scope.TotalPayable = $scope.ddlPaymentType = null;
        Clear();
        $scope.rcv_SaleRealization.CompanyId = $scope.ddlCompany.CompanyId;
        $scope.rcv_SaleRealization.CompanyName = $scope.ddlCompany.CompanyName;
        $scope.SalesOrderList = [];
        $scope.saleRealizationEntryForm.$setPristine();

        if (angular.isUndefined($scope.ddlCompany) || $scope.ddlCompany == null)
            return;

        $http({
            url: '/AccountsTransaction/GetCompanyTotals?financialCycleId=' + $scope.CurrentValuationSetup.FinancialCycleId + '&companyId=' + $scope.ddlCompany.CompanyId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (!data.length) {
                alertify.log('No information found for this company', 'error', '5000');
                return;
            }

            if (data[0].Msg != '') {
                $scope.ddlCompany = null;
                alertify.log(data[0].Msg, 'error', '5000');
                return;
            }

            $scope.TotalDue = data[0].TotalDue;
            $scope.TotalAdvance = data[0].TotalAdvance;
            $scope.TotalPayable = data[0].TotalPayable;
            
            var plus = encodeURIComponent('+');
            var criteria = 'SO.CompanyId=' + $scope.ddlCompany.CompanyId
                + ' AND (CAST(((ISNULL((SELECT SUM(OrderQty*OrderPrice) FROM pos_SalesOrderDetail D WHERE D.SalesOrderId=SO.SalesOrderId),0))-(ISNULL((SELECT SUM(Amount) FROM rcv_SaleAdjustment A WHERE A.SalesOrderId=SO.SalesOrderId),0))-(ISNULL((SELECT SUM(Amount' + plus + 'FromAdvance) FROM rcv_SaleRealization R WHERE R.SalesOrderId=SO.SalesOrderId),0))) AS DECIMAL(16,2)))>0'
            $http({
                url: '/SalesOrder/GetForRealization?financialCycleId=' + $scope.CurrentValuationSetup.FinancialCycleId + '&companyId=' + $scope.ddlCompany.CompanyId,
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
                    $scope.SalesOrderList = data;
                }
                else
                    alertify.log('No Sales Order Found', 'error', '5000');
            });

        }).error(function (msg) {
            $scope.ddlCompany = null;
            alertify.log('Company select failed, refresh page and try again', 'error', '5000');
        });
    }

    $scope.LoadInInvoices = function () {
        var amount = (angular.isUndefined($scope.rcv_SaleRealization.Amount) ? 0 : $scope.rcv_SaleRealization.Amount);
        var advance = (angular.isUndefined($scope.rcv_SaleRealization.FromAdvance) ? 0 : $scope.rcv_SaleRealization.FromAdvance);
        var tds = (angular.isUndefined($scope.rcv_SaleRealization.TDS) ? 0 : $scope.rcv_SaleRealization.TDS);
        var vds = (angular.isUndefined($scope.rcv_SaleRealization.VDS) ? 0 : $scope.rcv_SaleRealization.VDS);
        var payTotal = amount + advance + tds + vds;

        $scope.rcv_SaleRealization.Amount = amount;
        $scope.rcv_SaleRealization.FromAdvance = advance;
        $scope.rcv_SaleRealization.TDS = tds;
        $scope.rcv_SaleRealization.VDS = vds;

        if (payTotal > $scope.rcv_SaleRealization.TotalDue) {
            alertify.log('Cannot pay more than Invoice Amount', 'error', '5000');
            return;
        }

        angular.forEach($scope.SalesOrderList, function (aSd) {
            if (aSd.SalesOrderId == $scope.rcv_SaleRealization.SalesOrderId) {
                aSd.RcvAmount = $scope.rcv_SaleRealization.Amount;
                aSd.FromAdvance = $scope.rcv_SaleRealization.FromAdvance;
                aSd.TDS = $scope.rcv_SaleRealization.TDS;
                aSd.VDS = $scope.rcv_SaleRealization.VDS;
                aSd.Subtotal = (aSd.RcvAmount + aSd.FromAdvance + aSd.TDS + aSd.VDS);
            }
        })
    }

    $scope.SaveRealization = function () {
        if ((!angular.isUndefined($scope.ddlPaymentType) && $scope.ddlPaymentType != null && $scope.ddlPaymentType.PaymentTypeId != 3001) && 
            (angular.isUndefined($scope.rcv_SaleRealization.ChequeNo) || $scope.rcv_SaleRealization.ChequeNo == null || $scope.rcv_SaleRealization.ChequeNo === '' ||
             angular.isUndefined($scope.rcv_SaleRealization.ChequeDate) || $scope.rcv_SaleRealization.ChequeDate == null ||
             angular.isUndefined($scope.rcv_SaleRealization.ChequeBank) || $scope.rcv_SaleRealization.ChequeBank == null || $scope.rcv_SaleRealization.ChequeNo === ''))
        {
            alertify.log('Cheque No., Cheque Date and Bank Name all are required', 'error', '5000');
            return;
        }

        var accountsTrn = {};
        accountsTrn.FinancialCycleId = $scope.rcv_SaleRealization.FinancialCycleId;
        accountsTrn.CompanyId = $scope.rcv_SaleRealization.CompanyId;
        accountsTrn.VendorName = $scope.rcv_SaleRealization.CompanyName;
        accountsTrn.RefNumber = $scope.rcv_SaleRealization.SalesOrderId;
        accountsTrn.ActionType = 'Receipt';
        accountsTrn.RefType = 'Sale Collection';
        accountsTrn.PaymentTypeId = $scope.rcv_SaleRealization.PaymentTypeId;
        accountsTrn.FromAccountCode = '1001';
        accountsTrn.ToAccountCode = accountsTrn.PaymentTypeId;
        accountsTrn.Narration = $scope.rcv_SaleRealization.Narration;
        accountsTrn.TxDate = $scope.rcv_SaleRealization.PaymentDate;
        accountsTrn.Amount = $scope.rcv_SaleRealization.Amount;
        accountsTrn.FromAdvance = $scope.rcv_SaleRealization.FromAdvance;
        accountsTrn.TDS = $scope.rcv_SaleRealization.TDS;
        accountsTrn.VDS = $scope.rcv_SaleRealization.VDS;
        accountsTrn.CreatorId = $scope.rcv_SaleRealization.UpdatorId;

        if (!angular.isUndefined($scope.ddlPaymentType) && $scope.ddlPaymentType != null && $scope.ddlPaymentType.PaymentTypeId != 3001) {
            accountsTrn.ChequeNo = $scope.rcv_SaleRealization.ChequeNo;
            accountsTrn.ChequeDate = $scope.rcv_SaleRealization.ChequeDate;
            accountsTrn.ChequeBank = $scope.rcv_SaleRealization.ChequeBank;
        }

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
        $scope.saleRealizationEntryForm.$setPristine();
        $scope.saleRealizationEntryForm.$setUntouched();
    }

    $scope.ShowReport = function (salesOrderId) {
        $window.open("/ErpReports/RV_Pos_SalesOrderBySalesOrderId.aspx?SalesOrderId=" + salesOrderId, "_blank", "width=790,height=630,left=340,top=25");
    }
})