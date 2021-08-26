
app.controller("InternalWorkOrderReportController", function ($scope, $cookieStore, $http, $filter) {
    $scope.LoginUser = $cookieStore.get('UserData');

    $scope.IwoReport = $cookieStore.get('IWOID');

    Clear();

    function Clear() {
        $scope.InternalWorkOrderList = [];
        GetByInternalWorkOrderId($scope.IwoReport);

    }

    function GetByInternalWorkOrderId() {
        $http({
            url: '/ExportReport/GetByInternalWorkOrderId?internalWorkOrderId=' + $scope.IwoReport,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.InternalWorkOrderList = data;
            console.log('Report Lisdt', $scope.InternalWorkOrderList);

            if (data.length > 0) {
                angular.forEach(data, function (aSd) {
                    var res1 = aSd.DeliveryDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.DeliveryDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                        aSd.DeliveryDate = date1;
                    }
                })

            }
            if (data.length > 0) {
                angular.forEach(data, function (aSd) {
                    var res2 = aSd.InternalWorkOrderDate.substring(0, 5);
                    if (res2 == "/Date") {
                        var parsedDate2 = new Date(parseInt(aSd.InternalWorkOrderDate.substr(6)));
                        var date2 = ($filter('date')(parsedDate2, 'MMM dd, yyyy')).toString();
                        aSd.InternalWorkOrderDate = date2;
                    }
                })

            }
            

        });
    }


   
   
});