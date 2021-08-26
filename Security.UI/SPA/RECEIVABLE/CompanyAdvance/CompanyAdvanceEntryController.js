app.controller("CompanyAdvanceEntryController", function ($scope, $cookieStore, $http, $filter) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.CurrentValuationSetup = $cookieStore.get('Valuation');
    Clear();
    GetActiveCompany();
    GetCashAndBankAccounts();

    function Clear() {
        $scope.rcv_CompanyAdvance = { FinancialCycleId: $scope.CurrentValuationSetup.FinancialCycleId, IsOpening: false, UpdatorId: $scope.LoginUser.UserId, UpdateDate: ($filter('date')(new Date(), 'MMM dd, yyyy')).toString() };
        $scope.rcv_CompanyAdvance.FinancialCycleId = $scope.CurrentValuationSetup.FinancialCycleId;
        $scope.CompanyAdvanceType = "advance";
        $scope.MinDate = new Date(parseInt($scope.CurrentValuationSetup.FromDate.replace('/Date(', '')));
        $scope.MinDateFormat = ($filter('date')($scope.MinDate, 'dd/MM/yyyy')).toString();
        $scope.OpeningAdvanceSaved = false;
        $scope.OpeningBalanceSaved = false;
        $('#ddlCompany').focus();
    }

    function ClearForCompanyAdvanceTypeChange(companyChange) {
        if ($scope.CompanyAdvanceType != 'advance') {
            $scope.rcv_CompanyAdvance.AdvanceDate = ($filter('date')($scope.MinDate, 'MMM dd, yyyy')).toString();
            $scope.rcv_CompanyAdvance.PaymentTypeId = 0;
            $scope.rcv_CompanyAdvance.IsOpening = true;
            $scope.rcv_CompanyAdvance.VoucherNo = "";
        }
        else {
            $scope.rcv_CompanyAdvance.AdvanceDate = null;
            $scope.rcv_CompanyAdvance.PaymentTypeId = null;
            $scope.ddlPaymentType = null;
            $scope.rcv_CompanyAdvance.IsOpening = false;
            if (!companyChange)
                $scope.rcv_CompanyAdvance.VoucherNo = null;
        }

        $scope.companyAdvanceEntryForm.$setPristine();
        $scope.companyAdvanceEntryForm.$setUntouched();
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

    $scope.CompanyAdvanceTypeChange = function () {
        $scope.ddlCompany = $scope.rcv_CompanyAdvance.CompanyId = null
        $scope.rcv_CompanyAdvance.Amount = null
        ClearForCompanyAdvanceTypeChange(false);
        $('#ddlCompany').focus();
    }

    $scope.CheckOpeningSavedOnCompanyChange = function () {
        ClearForCompanyAdvanceTypeChange(true);

        if ($scope.CompanyAdvanceType != 'advance' && !angular.isUndefined($scope.rcv_CompanyAdvance.CompanyId) && $scope.rcv_CompanyAdvance.CompanyId != null) {
            var where = "FinancialCycleId=" + $scope.rcv_CompanyAdvance.FinancialCycleId + " AND CompanyId=" + $scope.rcv_CompanyAdvance.CompanyId;

            if ($scope.CompanyAdvanceType == 'openingAdvance') {
                //Check Opening Advance Saved
                $http({
                    url: '/CompanyAdvance/CompanyAdvanceGetDynamic?orderBy=CompanyId&searchCriteria=' + where,
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    if (data.length) {
                        $scope.OpeningAdvanceSaved = true;
                        $scope.rcv_CompanyAdvance.Amount = data[0].Amount;
                    }
                    else {
                        $scope.OpeningAdvanceSaved = false;
                        $scope.rcv_CompanyAdvance.Amount = null;
                    }
                });
            }
            else {
                //Check Opening Balance Saved
                $http({
                    url: '/CompanyAdvance/CompanyOpeningBalanceGetDynamic?orderBy=CompanyId&searchCriteria=' + where,
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    if (data.length) {
                        $scope.OpeningBalanceSaved = true;
                        $scope.rcv_CompanyAdvance.Amount = data[0].Amount;
                    }
                    else {
                        $scope.OpeningBalanceSaved = false;
                        $scope.rcv_CompanyAdvance.Amount = null;
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

        if ($scope.CompanyAdvanceType == 'advance') {
            type = "Advance";

            if ($scope.rcv_CompanyAdvance.PaymentTypeId == null || $scope.rcv_CompanyAdvance.AdvanceDate == null) {
                errorMsg.push({
                    msg: "Please provide Payment Type and Payment Date"
                });
            }
        }
        else if ($scope.CompanyAdvanceType == 'openingAdvance')
            type = "Opening Advance";
        else
            type = "Opening Balance";

        if (!errorMsg.length) {
            alertify.confirm("Are you sure to save?", function (e) {
                if (e) {
                    var params = JSON.stringify({ companyAdvance: $scope.rcv_CompanyAdvance, advanceType: $scope.CompanyAdvanceType });
                    $http.post('/CompanyAdvance/SaveCompanyAdvanceOrOpeningBalance', params).success(function (data) {
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
        $scope.rcv_CompanyAdvance = {};
        $scope.ddlCompany = null;
        $scope.ddlPaymentType = null;
        Clear();
        $scope.companyAdvanceEntryForm.$setPristine();
        $scope.companyAdvanceEntryForm.$setUntouched();
    }
})