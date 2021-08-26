
app.controller('DeliveryChalanController', function ($http, $scope, $cookieStore) {

    $scope.name = "Delivery Chalan";
    $scope.CommercialInvoiceId = $cookieStore.get('CommercialInvoiceId');
    console.log("id", $scope.CommercialInvoiceId);

    Clear();
    function Clear() {
        $scope.deliveryChalanList = [];
        $scope.deliveryChalanDetailsList = [];
        GetDeliveryChalan();
        GetDeliveryChalanDetailsList();
        GetCIMasterByCIid();

        $scope.totalItem = 0;
        $scope.itemDescription = 0;
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

    function GetDeliveryChalan() {
        //  var CommercialInvoiceId = 33;

        $http({
            url: "/CertificateOfOrigin/GetChalanReportNoTwoList?CommercialInvoiceId=" + $scope.CommercialInvoiceId,
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.deliveryChalanList = data;
            console.log('List Data', $scope.deliveryChalanList);

            $scope.deliveryChalanList[0].EPDate = $scope.deliveryChalanList[0].EPDate.split("-").reverse().join(".");
            $scope.deliveryChalanList[0].BillOfEntryDate = $scope.deliveryChalanList[0].BillOfEntryDate.split("-").reverse().join(".");
        });


    }


    function GetDeliveryChalanDetailsList() {

        $http({
            url: "/CertificateOfOrigin/GetChalanReportNoTwoDetails?CommercialInvoiceId=" + $scope.CommercialInvoiceId,
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.deliveryChalanDetailsList = data;

            angular.forEach(data, function (adata) {
                if (adata.ItemName !== "Barcode Ribbon") {
                    $scope.itemDescription += adata.QtyDescription;
                }
                $scope.totalItem += (adata.Quantity);

            })
            $scope.totalItem = $scope.totalItem.toFixed(2);
            $scope.itemDescription = $scope.itemDescription;
            console.log('totalItem Data', $scope.deliveryChalanDetailsList);
        });


    }

    function GetCIMasterByCIid() {
        $http({
            url: '/ExpCommercialInvoice/GetCIMasterByInvoiceId?commercialInvoiceId=' + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CommercialInvoiceMasterList = data;
            console.log($scope.CommercialInvoiceMasterList[0]);

            var arrPI = $scope.CommercialInvoiceMasterList[0].PiRefNo.split(",");
            var arrDate = $scope.CommercialInvoiceMasterList[0].PiRefDate.split(",");
            var dateTime = [];

            for (var i in arrPI) {

                var timeIndex = i;
                var startTime = arrDate[timeIndex]
                dateTime.push([arrPI[i], startTime].join(','))
            }

            var res = dateTime.join(" & ");

            $scope.PiRefInfo = res.replaceAll(",", ", DATE: ");

        });
    }




    //var queryResult = Enumerable.From(jsonArray)
    //    .Where(function (x) { return x.user.id < 200 })
    //    .OrderBy(function (x) { return x.user.screen_name })
    //    .Select(function (x) { return x.user.screen_name + ':' + x.text })
    //    .ToArray();

    // console.log('Total Item',totalItem);


});