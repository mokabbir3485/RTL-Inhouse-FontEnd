app.controller('SaleVoidController', function ($scope, $cookieStore, $http, $filter) {
    Load();
    function Load() {
        $scope.LoginUser = $cookieStore.get('UserData');
        $scope.Pos_Sale = {};
        $scope.pos_SaleDetailLst = {};
        $scope.userOutletList = [];
        $scope.EmployeeList = [];
        $scope.SaleList = [];
        $scope.SaleDetailList = [];
        GetAllEmployee();
        $scope.ddlVoidBy = { "EmployeeId": $scope.LoginUser.EmployeeId };
        $scope.FromDate = $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy');
        $scope.ToDate = $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy');
        $scope.VoidDate = $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy');
        GetAllUserOutLet();
    }

    function GetAllUserOutLet() {
        $http({
            url: '/User/GetUserDepartmentByUserId?userId=' + $scope.LoginUser.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (userOutletList) {
            $scope.userOutletList = userOutletList;
            if ($scope.userOutletList.length == 1) {
                $scope.ddlOutLet = { DepartmentId: $scope.userOutletList[0].DepartmentId };
            }
        });
    }

    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.EmployeeList = data;
        });
    }

    $scope.SearchSale = function () {
        var dateParts = $scope.FromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
        var dateParts2 = $scope.ToDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
        var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
        var searchCriteria = "S.RefInvoiceNo='' AND IsVoid=0 AND DepartmentId=" + $scope.ddlOutLet.DepartmentId + " and SaleDate Between '" + from + "' And '" + to + "'";
        $http({
            url: '/Sale/GetSaleDynamic?searchCriteria=' + searchCriteria + '&orderBy=SaleDate',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (AllSales) {
            if (AllSales.length > 0) {
                angular.forEach(AllSales, function (allSales) {
                    allSales.CustomerNaemAndCode = allSales.CustomerName + ' [' + allSales.CustomerCode + ']';
                    var res1 = allSales.SaleDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(allSales.SaleDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        allSales.SaleDate = date1;
                    }
                })
                $scope.SaleList = AllSales;
            }
            else {
                $scope.SaleList = [];
                $scope.SaleDetailList = [];
                alertify.log('No Sale found!', 'error', '5000');
            }
        })
    }

    $scope.RowClick = function (aSaleList) {
        $scope.Pos_Sale = aSaleList;
        $http({
            url: '/Sale/GetSaleDetailById?invoiceNo=' + aSaleList.InvoiceNo,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (SaleDetail) {
            $scope.SaleDetailList = SaleDetail;
        });
    }

    $scope.SaveSaleVoid = function () {
        alertify.confirm("Are you sure to Void Invoice # " + $scope.Pos_Sale.InvoiceNo + "?", function (e) {
            if (e) {
                var from = $scope.Pos_Sale.SaleDate.split("/");
                var f = new Date(from[2], from[1] - 1, from[0]);
                $scope.Pos_Sale.SaleDate = f;

                var from = $("#txtVoidDate").val().split("/");
                var txtVoidDate = new Date(from[2], from[1] - 1, from[0]);                
                $scope.Pos_Sale.VoidDate = txtVoidDate;

                $scope.Pos_Sale.VoidBy = $scope.ddlVoidBy.EmployeeId;
                $scope.Pos_Sale.IsVoid = true;

                var param = JSON.stringify({ _pos_Sale: $scope.Pos_Sale, pos_SaleDetailLst: $scope.SaleDetailList });
                $http.post('/Sale/SaveSaleVoid', param).success(function (data) {
                    if (data > 0) {
                        Load();
                        $scope.SaleVoid.$setPristine();
                        $scope.SaleVoid.$setUntouched();
                        alertify.log('Sale  Cancel successfully!', 'success', '5000');
                    }
                    else {
                        alertify.log('Server Errors!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors !', 'error', '5000');
                });
            }
        })
    }
})