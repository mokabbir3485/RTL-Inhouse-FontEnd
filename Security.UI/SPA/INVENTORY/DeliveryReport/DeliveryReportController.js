
app.controller("DeliveryReportController", function ($scope, $cookieStore, $http, $filter) {
    $scope.LoginUser = $cookieStore.get('UserData');

    $scope.deliveryReport = $cookieStore.get('DeliveryId');

    Clear();

    function Clear() {

        $scope.deliveryReportName = "DELIVERY CHALLAN";
        $scope.DeliveryReportList = [];
        GetAllDeliveryReportdata();
    }


    function GetAllDeliveryReportdata() {
        $http({
            url: '/Delivery/GetAllDeliveryReport?DeliveryId=' + $scope.deliveryReport.DeliveryId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DeliveryReportList = data;
          

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
                    var res2 = aSd.SalesOrderDate.substring(0, 5);
                    if (res2 == "/Date") {
                        var parsedDate2 = new Date(parseInt(aSd.SalesOrderDate.substr(6)));
                        var date2 = ($filter('date')(parsedDate2, 'MMM dd, yyyy')).toString();
                        aSd.SalesOrderDate = date2;
                    }
                })

            }


        });  
       
    }
   
    



});