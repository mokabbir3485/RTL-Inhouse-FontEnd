app.controller("StockValuationSetupController", function ($scope, $cookieStore, $http, $filter) {
    $scope.ScreenId = $cookieStore.get('StockValuationSetupScreenId');
    $scope.currentPage = 1;
    $scope.pageSize = 5;
    $scope.message = "Hellero!";
    $scope.button = "Save";
    $scope.Incriment = '';
    $scope.IsFinancialCycleAuto = '';
    $scope.setuplist = [];
    $scope.CurrentValuationTypeList = [];
    $scope.NextValuationTypeList = [];
    $scope.IsNextValuation = false;
    $scope.IsEdit = false;
    function GetSetup() {
        $http({
            url: '/Setup/GetAllSetup',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.IsFinancialCycleAuto = data;

        })
    }

    function CheckDate() {
        var date;
        var res = new Date().toLocaleDateString();
        if (res == "/Date") {
            var parsedDate = new Date(parseInt(DateTime.Now.substr(6)));
            date = $filter('date')(parsedDate, 'dd/MM/yyyy');
        }
        if (date > $scope.inv_StockValuationSetup.ToDate) {
            $scope.inv_StockValuationSetup.FromDate = DateTime.Now.Date.AddDays(1);
            $scope.inv_StockValuationSetup.ToDate = DateTime.Now.Date.AddMonths($("#aa"));

        }
    }
    function GetNextValuationType() {
        $http({
            url: '/Setup/GetNextValuationType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data != '') {
                $scope.formDate = '';
                $scope.toDate = '';
                $scope.NextValuationTypeList = data;
                $scope.inv_StockValuationSetup.FinancialCycleId = $scope.NextValuationTypeList.FinancialCycleId;
                $scope.inv_StockValuationSetup.ValuationType = $scope.NextValuationTypeList.ValuationType;
                $scope.ValuationType = $scope.NextValuationTypeList.ValuationType;
                var res = $scope.NextValuationTypeList.FromDate.substring(0, 5);
                if (res == "/Date") {
                    var parsedDate = new Date(parseInt($scope.NextValuationTypeList.FromDate.substr(6)));
                    $scope.formDate = parsedDate;
                }
                var res = $scope.NextValuationTypeList.ToDate.substring(0, 5);
                if (res == "/Date") {
                    var parsedDate = new Date(parseInt($scope.NextValuationTypeList.ToDate.substr(6)));
                    $scope.toDate = parsedDate;
                }

                var past_date = new Date($scope.formDate);
                var current_date = new Date($scope.toDate);

                var difference = (current_date.getFullYear() * 12 + current_date.getMonth()) - (past_date.getFullYear() * 12 + past_date.getMonth());
                if (difference > 1) {
                    $scope.Incriment = difference + 1;
                }
                else {
                    $scope.Incriment = difference;
                }
                $http({
                    url: '/Setup/GetCurrentValuationType',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    $scope.CurrentValuationTypeList = data;
                    $scope.inv_StockValuationSetup.FromDate = $scope.CurrentValuationTypeList.FromDate;
                    $scope.inv_StockValuationSetup.ToDate = $scope.CurrentValuationTypeList.ToDate;
                    var res = $scope.inv_StockValuationSetup.FromDate.substring(0, 5);
                    if (res == "/Date") {
                        var parsedDate = new Date(parseInt($scope.inv_StockValuationSetup.FromDate.substr(6)));
                        $scope.inv_StockValuationSetup.FromDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
                    }
                    var res = $scope.inv_StockValuationSetup.ToDate.substring(0, 5);
                    if (res == "/Date") {
                        var parsedDate = new Date(parseInt($scope.inv_StockValuationSetup.ToDate.substr(6)));
                        $scope.inv_StockValuationSetup.ToDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
                    }
                })
                $scope.IsNextValuation = true;
            }
            else {
                $http({
                    url: '/Setup/GetCurrentValuationType',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    $scope.CurrentValuationTypeList = data;
                    $scope.inv_StockValuationSetup.ValuationType = $scope.CurrentValuationTypeList.ValuationType;
                    $scope.inv_StockValuationSetup.FromDate = $scope.CurrentValuationTypeList.FromDate;
                    $scope.inv_StockValuationSetup.ToDate = $scope.CurrentValuationTypeList.ToDate;

                    var res = $scope.inv_StockValuationSetup.FromDate.substring(0, 5);
                    if (res == "/Date") {
                        var parsedDate = new Date(parseInt($scope.inv_StockValuationSetup.FromDate.substr(6)));
                        $scope.inv_StockValuationSetup.FromDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
                    }
                    var res = $scope.inv_StockValuationSetup.ToDate.substring(0, 5);
                    if (res == "/Date") {
                        var parsedDate = new Date(parseInt($scope.inv_StockValuationSetup.ToDate.substr(6)));
                        $scope.inv_StockValuationSetup.ToDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
                    }
                })
            }
        })
    }
  

    function Clear() {
        $scope.inv_StockValuationSetup = new Object();
        $scope.inv_StockValuationSetup.FinancialCycleId = 0;
        $scope.button = "Save";
        $scope.Show = false;
        GetSetup();
        if ($scope.IsFinancialCycleAuto=='true') {
            $scope.inv_StockValuationSetup.IsActive = true;
        }
        else {
            $scope.inv_StockValuationSetup.IsActive = false;
        }
        GetNextValuationType();
        CheckDate();
        ShowDateForDemo();
    }
    Clear();
   
    $scope.AddSetup = function () {
        //save button 
        if ($scope.found) {
            alertify.log('Save failed!', 'error', '100000');
        }
        else {
            var to = $("#txtToDate2").val().split("/");
            var t = new Date(to[2], to[1] - 1, to[0]);
            var day = new Date(t);
            day.setDate(day.getDate() + 1);
            $scope.inv_StockValuationSetup.FromDate = day // Next From date
            if ($scope.IsEdit) {
                var Nextto = $("#txtDemoToDate").val().split("/");
                var toDate = new Date(Nextto[2], Nextto[1] - 1, Nextto[0]);
                var day = new Date(toDate);
                $scope.inv_StockValuationSetup.ToDate = day //Next To date
            }
            else {
                var nextToDate = new Date(day);
                nextToDate.setMonth(day.getMonth() + $scope.Incriment);
                $scope.inv_StockValuationSetup.ToDate = nextToDate; //Next To date
            }

            $scope.inv_StockValuationSetup.ValuationType = $scope.ValuationType;
            $scope.inv_StockValuationSetup.IsCurrent = false;
            if ($scope.IsNextValuation) {
                var parms = JSON.stringify({ setup: $scope.inv_StockValuationSetup });
                $http.post('/Setup/Update', parms).success(function (data) {
                    alertify.log(' Update Successfully!', 'success', '100000');
                    Clear();
                    $scope.setupForm.$setPristine();
                    $scope.setupForm.$setUntouched();

                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '10000');
                });

            }
            else {
                var parms = JSON.stringify({ setup: $scope.inv_StockValuationSetup });
                $http.post('/Setup/Save', parms).success(function (data) {
                    alertify.log(' Saved Successfully!', 'success', '100000');
                    Clear();
                    $scope.setupForm.$setPristine();
                    $scope.setupForm.$setUntouched();

                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '10000');
                });
            }
        }

    }
    $scope.CheckDate = function () {
        var to = $("#txtToDate2").val().split("/");
        var ff = new Date(to[2], to[1] - 1, to[0]);
        var from = $("#txtFromDate3").val().split("/");
        var f = new Date(from[2], from[1] - 1, from[0]);
        var x = new Date(ff);
        var y = new Date(f);
        $scope.found = false;

        if (y > x) {

            $scope.found = false;
        }
        else {
            $scope.found = true;
            alertify.log('Next financial cycle must be greater than current Financial Cycle', 'error', '200000');
        }
    }
    $scope.resetForm = function () {
        Clear();
        $scope.setupForm.$setPristine();
        $scope.setupForm.$setUntouched();
    };

    function ShowDateForDemo() {
        $scope.DemoFromDate = false;
        $scope.DemoToDate = false;
    }

    
    $scope.ShowDate = function (inc) {
        if (inc == "") {
            $scope.num = parseInt(0);
            ShowDateForDemo();
        }
        else {
            $scope.num = parseInt(inc);
            $scope.DemoFromDate = true;
            $scope.DemoToDate = true;
        }
        var to = $("#txtToDate2").val().split("/");
        var t = new Date(to[2], to[1] - 1, to[0]);
        var day = new Date(t);
        day.setDate(day.getDate() + 1);
        $scope.DemoFromDate = $filter('date')(day, 'dd/MM/yyyy');
        // Next From date

        var nextToDate = new Date(day);
        nextToDate.setMonth(day.getMonth() + $scope.num);
        $scope.DemoToDate = $filter('date')(nextToDate, 'dd/MM/yyyy');
        //Next To date
        $scope.IsEdit = true;
    };



    //SignalR Test 


    //SignalR start

    var myHub = $.connection.getCurrentQuantity;

    myHub.client.shareLiveQty = function () {
        Focus();
        $scope.$apply();
    }
    $.connection.hub.start().done(function () {

    });
    //SignalR end
    $scope.currentQtyList = '';
    function GetCurrentQty() {
        $http({
            url: '/Setup/GetCurrentQty',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.currentQtyList = data;
            $scope.inv_StockValuation = data;
            $scope.display = $scope.inv_StockValuation.CurrentQuantity;
        })
    }
    function Focus() {
        $scope.inv_StockValuation = new Object();
        GetCurrentQty();
    }
    Focus();
    $scope.AddQty = function () {
        $scope.inv_StockValuation.CurrentQuantity = $scope.inputQty;
        var parms = JSON.stringify({ stkVal: $scope.inv_StockValuation});
        $http.post('/Setup/AddQty', parms).success(function (data) {
            alertify.log(' Update Successfully!', 'success', '100000');
            myHub.server.shareLiveQty();
            Focus();
            $scope.inputQty = '';
            $scope.setupForm.$setPristine();
            $scope.setupForm.$setUntouched();

        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '10000');
        });
    }
    $scope.DeductQty = function () {
        //if ($scope.inv_StockValuation.CurrentQuantity < $scope.inputQty) {
        //    alertify.log('Not Enough!', 'error', '10000');
        //}
        //else {
            $scope.inv_StockValuation.CurrentQuantity = $scope.inputQty;
            var parms = JSON.stringify({ stkVal: $scope.inv_StockValuation });
        $http.post('/Setup/DeductQty', parms).success(function (data) {
            if (data > 0) {
                alertify.log(' Update Successfully!', 'success', '100000');
                myHub.server.shareLiveQty();
                Focus();
                $scope.inputQty = '';
                $scope.setupForm.$setPristine();
                $scope.setupForm.$setUntouched();
            }
            else {
                alertify.log('Not Enough!', 'error', '10000');
            }

            }).error(function (data) {
                alertify.log('Server Errors!', 'error', '10000');
            });
        //}
    }

   

});