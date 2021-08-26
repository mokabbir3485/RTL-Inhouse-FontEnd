
app.controller('CIFReportController', function ($http, $scope, $cookieStore, $cookies) {
    $scope.Company = {};
    $scope.Company = $cookies.getObject('Company');
    if ($scope.Company.CIFFromDate == undefined || $scope.Company.CIFToDate == undefined) {
        $scope.Company.CIFFromDate = null;
        $scope.Company.CIFToDate = null;

    }
    //$scope.CompanyId = $cookieStore.get('CompanyId');
    //console.log("id", $scope.CommercialInvoiceId);

    Clear();
    function Clear() {
        GetDateTimeFormat();
        //$scope.RollDirection = 'Shuvo';
        GetBy_inv_CIFProductReports();
        GetBy_inv_CIFCustomerReports();
        $scope.CIFProductList = [];
        $scope.CIFCustomerList = [];
        /*$cookies.remove("Company");*/
    }
    function GetDateTimeFormat() {
        function formatDate(date) {
            var hours = date.getHours();
            var minutes = date.getMinutes();
            var ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            var strTime = hours + ':' + minutes + ' ' + ampm;
            return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
        }
        var currentDatetime = new Date();
        $scope.currentDatetimeFormated = formatDate(currentDatetime);

    }
    //endDate
    function GetBy_inv_CIFCustomerReports() {
        $http({
            url: "/InternalWorkOrder/GetBy_inv_CIFCustomerReports?CompanyId=" + $scope.Company.companyId,
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CIFCustomerList = data[0];


        });
    }
    function GetBy_inv_CIFProductReports() {
        $http({
            url: "/InternalWorkOrder/GetBy_inv_CIFProductReports?CompanyId=" + $scope.Company.companyId + '&startDate=' + $scope.Company.CIFFromDate + '&endDate=' + $scope.Company.CIFToDate,
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CIFProductList = data;

            angular.forEach($scope.CIFProductList, function (e) {
                if (e.RollDirection == 'Face In') {
                    e['FaceIn'] = true;
                    e['FaceOut'] = false;
                    e['ClockWise'] = false;
                    e['AntiClockWise'] = false;

                }
                if (e.RollDirection == 'Face Out') {
                    e['FaceIn'] = false;
                    e['FaceOut'] = true;
                    e['ClockWise'] = false;
                    e['AntiClockWise'] = false;

                }
                if (e.RollDirection == 'Clock Wise') {
                    e['FaceIn'] = false;
                    e['FaceOut'] = false;
                    e['ClockWise'] = true;
                    e['AntiClockWise'] = false;

                }
                if (e.RollDirection == 'Anti Clock Wise') {
                    e['FaceIn'] = false;
                    e['FaceOut'] = false;
                    e['ClockWise'] = false;
                    e['AntiClockWise'] = true;

                }
                if (e.RollDirection == 'N/A') {
                    e['FaceIn'] = false;
                    e['FaceOut'] = false;
                    e['ClockWise'] = false;
                    e['AntiClockWise'] = false;

                }
                //////////////////////////
                if (e.Core == 40) {
                    e['40'] = true;
                    e['Core76'] = false;
                    e['Core25'] = false;
                    e['Core12'] = false;

                }
                if (e.Core == 76) {
                    e['Core40'] = false;
                    e['Core76'] = true;
                    e['Core25'] = false;
                    e['Core12'] = false;

                }
                if (e.Core == 25) {
                    e['Core40'] = false;
                    e['Core76'] = false;
                    e['Core25'] = true;
                    e['Core12'] = false;

                }
                if (e.Core == 12.5) {
                    e['Core40'] = false;
                    e['Core76'] = false;
                    e['Core25'] = false;
                    e['Core12'] = true;

                }
                if (e.Core == null) {
                    e['Core40'] = false;
                    e['Core76'] = false;
                    e['Core25'] = false;
                    e['Core12'] = false;

                }

            })
        });
    }



});