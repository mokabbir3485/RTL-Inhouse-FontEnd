
app.controller("ConsumptionCertificateReportController", function ($scope, $cookieStore, $http, $filter, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.CommercialInvoiceId = $cookieStore.get('CommercialInvoiceId');
    Clear();

    function Clear() {
        $scope.TotalAmount = 0;
        $scope.TotalQuantity = 0;
        $scope.TotalQtyDescription = 0;
        GetCIMasterByCIid();
        GetConsumptionCertificateReport();
        GetConsumptionCertificateDescriptionReport();
        GetConsumptionCertificateRawMaterialsReport();
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

    function GetCIMasterByCIid() {
        $http({
            url: '/ExpCommercialInvoice/GetCIMasterByInvoiceId?commercialInvoiceId=' + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CommercialInvoiceMasterList = data;
            $scope.CommercialInvoiceMasterList[0].PiRefNo = $scope.CommercialInvoiceMasterList[0].PiRefNo.split(",");
            $scope.CommercialInvoiceMasterList[0].PiRefDate = $scope.CommercialInvoiceMasterList[0].PiRefDate.split(",");
        });
    }
    function GetConsumptionCertificateReport() {
        $http({
            url: '/CertificateOfOrigin/GetConsumptionCertificateReport?ciId=' + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ConsumptionReportList = data;

            var res1 = $scope.ConsumptionReportList[0].StatementDate.substring(0, 5);
            if (res1 == "/Date") {
                var parsedDate1 = new Date(parseInt($scope.ConsumptionReportList[0].StatementDate.substr(6)));
                var date1 = ($filter('date')(parsedDate1, 'dd.MM.yyyy')).toString();
                $scope.ConsumptionReportList[0].StatementDate = date1;
            }
            if ($scope.ConsumptionReportList[0].BillOfEntryDate != "") {
                //var res2 = $scope.ConsumptionReportList[0].BillOfEntryDate.substring(0, 5);
                //if (res2 == "/Date") {
                //    var parsedDate2 = new Date(parseInt($scope.ConsumptionReportList[0].BillOfEntryDate.substr(6)));
                //    var date2 = ($filter('date')(parsedDate2, 'dd.MM.yyyy')).toString();
                //    $scope.ConsumptionReportList[0].BillOfEntryDate = date2;
                //}

                $scope.ConsumptionReportList[0].BillOfEntryDate = $scope.ConsumptionReportList[0].BillOfEntryDate.split("-").reverse().join(".");
            }
            
            if ($scope.ConsumptionReportList[0].EpzPermissionDate != null) {
                //var res3 = $scope.ConsumptionReportList[0].EpzPermissionDate.substring(0, 5);
                //if (res3 == "/Date") {
                //    var parsedDate3 = new Date(parseInt($scope.ConsumptionReportList[0].EpzPermissionDate.substr(6)));
                //    var date3 = ($filter('date')(parsedDate3, 'dd.MM.yyyy')).toString();
                //    $scope.ConsumptionReportList[0].EpzPermissionDate = date3;
                //}
                $scope.ConsumptionReportList[0].EpzPermissionDate = $scope.ConsumptionReportList[0].EpzPermissionDate.split("-").reverse().join(".");
            }
            if ($scope.ConsumptionReportList[0].DEPZPermissionDate != null) {
                //var res3 = $scope.ConsumptionReportList[0].EpzPermissionDate.substring(0, 5);
                //if (res3 == "/Date") {
                //    var parsedDate3 = new Date(parseInt($scope.ConsumptionReportList[0].EpzPermissionDate.substr(6)));
                //    var date3 = ($filter('date')(parsedDate3, 'dd.MM.yyyy')).toString();
                //    $scope.ConsumptionReportList[0].EpzPermissionDate = date3;
                //}
                $scope.ConsumptionReportList[0].DEPZPermissionDate = $scope.ConsumptionReportList[0].DEPZPermissionDate.split("-").reverse().join(".");
            }
            

            var res4 = $scope.ConsumptionReportList[0].LcDate.substring(0, 5);
            if (res4 == "/Date") {
                var parsedDate4 = new Date(parseInt($scope.ConsumptionReportList[0].LcDate.substr(6)));
                var date4 = ($filter('date')(parsedDate4, 'dd.MM.yyyy')).toString();
                $scope.ConsumptionReportList[0].LcDate = date4;
            }

            var res5 = $scope.ConsumptionReportList[0].InvoiceDate.substring(0, 5);
            if (res5 == "/Date") {
                var parsedDate5 = new Date(parseInt($scope.ConsumptionReportList[0].InvoiceDate.substr(6)));
                var date5 = ($filter('date')(parsedDate5, 'dd.MM.yyyy')).toString();
                $scope.ConsumptionReportList[0].InvoiceDate = date5;
            }

        });
    }
    function GetConsumptionCertificateDescriptionReport() {
        $http({
            url: '/CertificateOfOrigin/GetDescriptionOfGoods?ciId=' + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DescriptionReportList = data;

            for (var i = 0; i < $scope.DescriptionReportList.length; i++) {
                $scope.DescriptionReportList[i].UnitPrice = parseFloat($scope.DescriptionReportList[i].UnitPrice).toFixed(2);
                $scope.DescriptionReportList[i].Amount = parseFloat($scope.DescriptionReportList[i].Amount).toFixed(2);

            }

            for (var i = 0; i < $scope.DescriptionReportList.length; i++) {
                if ($scope.DescriptionReportList[i].ItemName == "Barcode Ribbon") {
                    $scope.DescriptionReportList[i].QtyDescription = 0;
                }

            }

            
            angular.forEach($scope.DescriptionReportList, function (item) {
                $scope.TotalAmount += parseFloat(item.Amount);
                $scope.TotalQuantity += item.Quantity;
                $scope.TotalQtyDescription += parseFloat(item.QtyDescription);
            })
            $scope.TotalQtyDescription = parseFloat($scope.TotalQtyDescription).toFixed(2);
            $scope.TotalAmount = parseFloat($scope.TotalAmount).toFixed(2);
        });
    }
    function GetConsumptionCertificateRawMaterialsReport() {
        $http({
            url: '/CertificateOfOrigin/ConsuptionCertificateRawMatrial?CommercialInvoiceId=' + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.RawMaterialsReportList = data;
        });
    }


});