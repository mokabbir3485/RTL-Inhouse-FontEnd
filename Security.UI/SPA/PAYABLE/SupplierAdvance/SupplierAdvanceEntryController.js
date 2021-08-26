app.controller("SupplierAdvanceEntryController", function ($scope, $cookieStore, $http, $filter) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.CurrentValuationSetup = $cookieStore.get('Valuation');
    Clear();
    GetActiveSupplier();
    GetCashAndBankAccounts();

    function Clear() {
        $scope.pay_SupplierAdvance = { FinancialCycleId: $scope.CurrentValuationSetup.FinancialCycleId, IsOpening: false, UpdatorId: $scope.LoginUser.UserId, UpdateDate: ($filter('date')(new Date(), 'MMM dd, yyyy')).toString() };
        $scope.pay_SupplierAdvance.FinancialCycleId = $scope.CurrentValuationSetup.FinancialCycleId;
        $scope.SupplierAdvanceType = "advance";
        $scope.MinDate = new Date(parseInt($scope.CurrentValuationSetup.FromDate.replace('/Date(', '')));
        $scope.MinDateFormat = ($filter('date')($scope.MinDate, 'dd/MM/yyyy')).toString();
        $scope.OpeningAdvanceSaved = false;
        $scope.OpeningBalanceSaved = false;
        $('#ddlSupplier').focus();
    }

    function ClearForSupplierAdvanceTypeChange(supplierChange) {
        if ($scope.SupplierAdvanceType != 'advance') {
            $scope.pay_SupplierAdvance.AdvanceDate = ($filter('date')($scope.MinDate, 'MMM dd, yyyy')).toString();
            $scope.pay_SupplierAdvance.PaymentTypeId = 0;
            $scope.pay_SupplierAdvance.IsOpening = true;
            $scope.pay_SupplierAdvance.VoucherNo = "";
        }
        else {
            $scope.pay_SupplierAdvance.AdvanceDate = null;
            $scope.pay_SupplierAdvance.PaymentTypeId = null;
            $scope.ddlPaymentType = null;
            $scope.pay_SupplierAdvance.IsOpening = false;
            if (!supplierChange)
                $scope.pay_SupplierAdvance.VoucherNo = null;
        }

        $scope.supplierAdvanceEntryForm.$setPristine();
        $scope.supplierAdvanceEntryForm.$setUntouched();
    }

    function GetActiveSupplier() {
        $http({
            url: '/Supplier/GetDynamic?searchCriteria=IsActive=1&orderBy=SupplierName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.supplierList = data;
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

    $('#dtPayDate').datetimepicker({
        format: 'MMM DD, YYYY',
        timepicker: false,
        minDate: $scope.MinDate,
        maxDate: new Date(parseInt($scope.CurrentValuationSetup.ToDate.replace('/Date(', '')))
    });

    $scope.CalendarOpen = function () {
        $("#dtPayDate").focus();
        $("#dtPayDate").trigger("click");
    }

    $scope.SupplierAdvanceTypeChange = function () {
        $scope.ddlSupplier = $scope.pay_SupplierAdvance.SupplierId = null
        $scope.pay_SupplierAdvance.Amount = null
        ClearForSupplierAdvanceTypeChange(false);
        $('#ddlSupplier').focus();
    }

    $scope.CheckOpeningSavedOnSupplierChange = function () {
        ClearForSupplierAdvanceTypeChange(true);

        if ($scope.SupplierAdvanceType != 'advance' && !angular.isUndefined($scope.pay_SupplierAdvance.SupplierId) && $scope.pay_SupplierAdvance.SupplierId != null) {
            var where = "FinancialCycleId=" + $scope.pay_SupplierAdvance.FinancialCycleId + " AND SupplierId=" + $scope.pay_SupplierAdvance.SupplierId;

            if ($scope.SupplierAdvanceType == 'openingAdvance') {
                //Check Opening Advance Saved
                $http({
                    url: '/SupplierAdvance/SupplierAdvanceGetDynamic?orderBy=SupplierId&searchCriteria=' + where,
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    if (data.length) {
                        $scope.OpeningAdvanceSaved = true;
                        $scope.pay_SupplierAdvance.Amount = data[0].Amount;
                    }
                    else {
                        $scope.OpeningAdvanceSaved = false;
                        $scope.pay_SupplierAdvance.Amount = null;
                    }
                });
            }
            else {
                //Check Opening Balance Saved
                $http({
                    url: '/SupplierAdvance/SupplierOpeningBalanceGetDynamic?orderBy=SupplierId&searchCriteria=' + where,
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    if (data.length) {
                        $scope.OpeningBalanceSaved = true;
                        $scope.pay_SupplierAdvance.Amount = data[0].Amount;
                    }
                    else {
                        $scope.OpeningBalanceSaved = false;
                        $scope.pay_SupplierAdvance.Amount = null;
                    }
                });
            }

            $('#txtAmount').focus();
        }
        else {
            $scope.OpeningAdvanceSaved = false;
            $scope.OpeningBalanceSaved = false;
            $('#ddlPaymentType').focus();
        }
    }

    $scope.SaveAdvance = function () {
        var type;
        var errorMsg = [];

        if ($scope.SupplierAdvanceType == 'advance') {
            type = "Advance";

            if ($scope.pay_SupplierAdvance.PaymentTypeId == null || $scope.pay_SupplierAdvance.AdvanceDate == null) {
                errorMsg.push({
                    msg: "Please provide Payment Type and Payment Date"
                });
            }
        }
        else if ($scope.SupplierAdvanceType == 'openingAdvance')
            type = "Opening Advance";
        else
            type = "Opening Balance";

        if (!errorMsg.length) {
            alertify.confirm("Are you sure to save?", function (e) {
                if (e) {
                    var params = JSON.stringify({ supplierAdvance: $scope.pay_SupplierAdvance, advanceType: $scope.SupplierAdvanceType });
                    $http.post('/SupplierAdvance/SaveSupplierAdvanceOrOpeningBalance', params).success(function (data) {
                        if (data > 0) {
                            alertify.log(type + ' saved successfully!', 'success', '5000');
                            $scope.ResetForm();
                        }
                    }).error(function (msg) {
                        alertify.log('Save failed, refresh page and try again', 'error', '5000');
                    });
                }
            })
        }

        else {
            alertify.log(errorMsg[0].msg, 'error', '5000');
        }
    }

    $scope.ResetForm = function () {
        $scope.pay_SupplierAdvance = {};
        $scope.ddlSupplier = null;
        $scope.ddlPaymentType = null;
        Clear();
        $scope.supplierAdvanceEntryForm.$setPristine();
        $scope.supplierAdvanceEntryForm.$setUntouched();
    }
})