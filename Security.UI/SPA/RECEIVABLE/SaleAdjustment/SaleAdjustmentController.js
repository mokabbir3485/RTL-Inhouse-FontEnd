app.controller("SaleAdjustmentEntryController", function ($scope, $cookieStore, $http, $filter) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.CurrentValuationSetup = $cookieStore.get('Valuation');
    Clear();
    GetActiveCompany();
    GetActiveAdjustmentType();

    //#region  Date Config
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

    function Clear() {
        var today = ($filter('date')(new Date(), 'MMM dd, yyyy')).toString();
        $scope.rcv_SaleAdjustment = { FinancialCycleId: $scope.CurrentValuationSetup.FinancialCycleId, AdjustmentDate: today, UpdatorId: $scope.LoginUser.UserId, UpdateDate: today };
        $scope.MinDate = new Date(parseInt($scope.CurrentValuationSetup.FromDate.replace('/Date(', '')));
        $scope.FromDate = $scope.ToDate = today;
        $scope.TotalAdjustedAmount = 0;
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

    function GetActiveAdjustmentType() {
        $scope.AdjustmentTypeList = [{ AdjustmentTypeId: 1, AdjustmentTypeName: "Rebate" }, { AdjustmentTypeId: 2, AdjustmentTypeName: "Benefit" }]
        //$http({
        //    url: '/BillAdjustmentType/GetBillAdjustmentTypeDynamic?searchCriteria=C.IsActive=1&orderBy=AdjustmentTypeName',
        //    method: 'GET',
        //    headers: { 'Content-Type': 'application/json' }
        //}).success(function (data) {
        //    $scope.AdjustmentTypeList = data;
        //})
    }

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

        var criteria = "IsAcknowledged=1 AND SalesOrderDate BETWEEN '" + fromDate + "' AND '" + toDate + "'";

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
        if (!angular.isUndefined($scope.rcv_SaleAdjustment.VoucherNo) && $scope.rcv_SaleAdjustment.VoucherNo != null && $scope.rcv_SaleAdjustment.VoucherNo != '') {
            $http({
                url: "/CompanyAdvance/CheckVoucherNoExists?voucherNo=" + $scope.rcv_SaleAdjustment.VoucherNo,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                if (data.length && data[0].VoucherCount > 0) {
                    alertify.log('Voucher No.' + $scope.rcv_SaleAdjustment.VoucherNo + ' already exists!', 'error', '5000');
                    $scope.VoucherNoExist = true;
                    $('#txtVoucherNo').focus();
                }
                else {
                    $scope.VoucherNoExist = false;
                }
            });
        }
    }

    $scope.SumTotalAdjust = function () {
        angular.forEach($scope.SalesOrderList, function (aSO) {
            if (aSO.AdjAmount < 0 || aSO.AdjAmount == undefined || aSO.AdjAmount == null || aSO.AdjAmount =="") {
                aSO.AdjAmount = 0;
            }
        });

        $scope.TotalAdjustedAmount = Enumerable.From($scope.SalesOrderList).Sum('$.AdjAmount').toFixed(2);
    }

    $scope.SaveAdjustment = function () {
        $scope.CheckVoucherNoExists();
        if ($scope.VoucherNoExist)
            return;

        var listSaleAdjustment = [];

        angular.forEach($scope.SalesOrderList, function (aSd) {
            if (aSd.AdjAmount > 0) {
                $scope.rcv_SaleAdjustment.SalesOrderId = aSd.SalesOrderId;
                $scope.rcv_SaleAdjustment.Amount = aSd.AdjAmount;
                var aSaleAdj = angular.copy($scope.rcv_SaleAdjustment);
                listSaleAdjustment.push(aSaleAdj);
            }
        })

        alertify.confirm("Are you sure to save?", function (e) {
            if (e) {
                var params = JSON.stringify({ lstSaleAdjustment: listSaleAdjustment });
                $http.post('/SaleAdjustment/Save', params).success(function (data) {
                    if (data > 0) {
                        alertify.log('Adjustments saved successfully!', 'success', '5000');
                        $scope.ResetForm();
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
        $scope.ddlAdjustmentType = null;
        $scope.saleAdjustmentEntryForm.$setPristine();
        $scope.saleAdjustmentEntryForm.$setUntouched();
    }
})