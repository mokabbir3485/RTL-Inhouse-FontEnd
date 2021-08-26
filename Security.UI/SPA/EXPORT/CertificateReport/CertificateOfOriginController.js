app.controller('CertificateOfOriginController', function ($scope, $http, $cookieStore) {
    $scope.LoginUser = $cookieStore.get('UserData');

    //$scope.CommercialInvoiceId = $cookieStore.get('CommercialInvoiceId');
    $scope.CData = $cookieStore.get('CiData');
    Clear();
    function Clear() {
        //$scope.certificateOriginName = "CERTIFICATE OF ORIGIN";
        $scope.NetWeight = 0;
        $scope.GrossWeight = 0;
        $scope.CommercialInvoiceList = [];

        $scope.CertificateOfOriginList = [];

        GetAllCertificateOforigin();
        GetCIInfoDetailReport();
        //GetAllCertificateOfPre();
        GetDateTimeFormat();

        $scope.certificateOfOriginCiId = [];
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

    function GetAllCertificateOforigin() {

        $http({
            url: "/CertificateOfOrigin/GetAllCertificateOforiginType?CommercialInvoiceId=" + $scope.CData.CommercialInvoiceId + "&CertificateType=" + $scope.CData.CertificateType,
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).success(function (Cofdata) {
            $scope.CertificateOfOriginList = Cofdata;
            $scope.NetWeight = (parseFloat($scope.CertificateOfOriginList[0].LabelNetWeight) + parseFloat($scope.CertificateOfOriginList[0].RibbonNetWeight)).toFixed(2) + ' kg';
            $scope.GrossWeight = (parseFloat($scope.CertificateOfOriginList[0].LabelGrossWeight) + parseFloat($scope.CertificateOfOriginList[0].RibbonGrossWeight)).toFixed(2) + ' kg';

            //{ { BillForReportList[0].PINo } } Date: { { BillForReportList[0].PIDate } }
            var arrPI = $scope.CertificateOfOriginList[0].PINo.split(" & ");
            var arrDate = $scope.CertificateOfOriginList[0].PIDate.split(" & ");
            var dateTime = [];

            for (var i in arrPI) {

                var timeIndex = i;
                var startTime = arrDate[timeIndex]
                dateTime.push([arrPI[i], startTime].join(','))
            }

            var res = dateTime.join(" & ");

            $scope.PiRefInfo = res.replaceAll(",", ", Date: ");
        });


    }

    function GetCIInfoDetailReport() {
        $http({
            url: '/ExpCommercialInvoice/GetCIInfoDetailReport?commercialInvoiceId=' + $scope.CData.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CiInfoDetailReportList = data;

        });
    }

    //function GetAllCertificateOfPre(CertificateType = "pi") {

    //    $http({
    //        url: "/CertificateOfOrigin/GetAllCertificateOforigin?CommercialInvoiceId=" + $scope.CommercialInvoiceId + "&CertificateType=" + CertificateType,
    //        method: "GET",
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (Cofdata) {
    //        $scope.CertificateOfOriginList = Cofdata;;
    //    });


    //}



});