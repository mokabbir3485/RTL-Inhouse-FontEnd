
app.controller("BillOfExchangeReportController", function ($scope, $cookieStore, $http, $filter, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.CommercialInvoiceId = $cookieStore.get('CommercialInvoiceId');
    Clear();

    function Clear() {
        //GetCIMasterByCIid();
        GetCIInfoDetailReport();
        GetBillOfExchangeForReport();
        GetPOReference();
        GetDateTimeFormat();
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

    function GetPOReference() {
        $http({
            url: '/ExpCommercialInvoice/GetPOReference?DocType=CI' + "&DocumentId=" + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length) {


                $scope.POReferencelist = [];
                angular.forEach(data, function (aPODetail) {
                    var res2 = aPODetail.PODate.substring(0, 5);
                    if (res2 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aPODetail.PODate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                        aPODetail.PODate = date1;
                    }

                    $scope.POReferencelist.push(aPODetail);
                })

            }

        });
    }


    function GetCIMasterByCIid() {
        $http({
            url: '/ExpCommercialInvoice/GetCIMasterByInvoiceId?commercialInvoiceId=' + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CommercialInvoiceMasterList = data;
            $scope.CommercialInvoiceMasterList[0].CommercialInvoiceNo = $scope.CommercialInvoiceMasterList[0].CommercialInvoiceNo.replace("CI", "BOE");
        });
    }

    function GetCIInfoDetailReport() {
        $http({
            url: '/ExpCommercialInvoice/GetCIInfoDetailReport?commercialInvoiceId=' + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CiInfoDetailReportList = data;


        });
    }
    function GetBillOfExchangeForReport() {
        $http({
            url: '/ExpCommercialInvoice/GetBillOfExchangeForReport?commercialInvoiceId=' + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.BillForReportList = data;
            console.log($scope.BillForReportList[0]);
            $scope.BillForReportList[0].Amount = parseFloat($scope.BillForReportList[0].Amount).toFixed(2);

            $scope.BillForReportList[0].PiRefNo = $scope.BillForReportList[0].BOENumber.replace("BOE", "PI");
            //{ { BillForReportList[0].PINo } } Date: { { BillForReportList[0].PIDate } }
            var arrPI = $scope.BillForReportList[0].PINo.split(" & ");
            var arrDate = $scope.BillForReportList[0].PIDate.split(" & ");
            var dateTime = [];

            for (var i in arrPI) {

                var timeIndex = i;
                var startTime = arrDate[timeIndex]
                dateTime.push([arrPI[i], startTime].join(','))
            }

            var res = dateTime.join(" & ");

            $scope.PiRefInfo = res.replaceAll(",", ", Date: ");  

            //////////////////////////////////////////////
            //var arrPONo = $scope.BillForReportList[0].PONo.split(",");
            //var arrPODate = $scope.BillForReportList[0].PODate.split(",");

            //var dateTimePO = [];

            //for (var i in arrPONo) {

            //    var timeIndex = i;
            //    var startTime = arrPODate[timeIndex]
            //    dateTimePO.push([arrPONo[i], startTime].join(','))
            //}

            //var res = dateTimePO.join(" & ");

            //$scope.POInfo = res.replaceAll(",", ", Date: ");


            if ($scope.BillForReportList[0].LcScDate != null) {
                var res1 = $scope.BillForReportList[0].LcScDate.substring(0, 5);
                if (res1 == "/Date") {
                    var parsedDate1 = new Date(parseInt($scope.BillForReportList[0].LcScDate.substr(6)));
                    var date1 = ($filter('date')(parsedDate1, 'dd.MM.yyyy')).toString();
                    $scope.BillForReportList[0].LcScDate = date1;
                }
            }

            if ($scope.BillForReportList[0].ApplicationDate != null) {
                var res1 = $scope.BillForReportList[0].ApplicationDate.substring(0, 5);
                if (res1 == "/Date") {
                    var parsedDate1 = new Date(parseInt($scope.BillForReportList[0].ApplicationDate.substr(6)));
                    var date1 = ($filter('date')(parsedDate1, 'dd.MM.yyyy')).toString();
                    $scope.BillForReportList[0].ApplicationDate = date1;
                }
            }

            if ($scope.BillForReportList[0].ExpDate != null) {
                var res1 = $scope.BillForReportList[0].ExpDate.substring(0, 5);
                if (res1 == "/Date") {
                    var parsedDate1 = new Date(parseInt($scope.BillForReportList[0].ExpDate.substr(6)));
                    var date1 = ($filter('date')(parsedDate1, 'dd.MM.yyyy')).toString();
                    $scope.BillForReportList[0].ExpDate = date1;
                }
            }

            
            

        });
    }


});