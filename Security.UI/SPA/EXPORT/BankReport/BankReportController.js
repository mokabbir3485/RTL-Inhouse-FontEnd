app.controller("BankReportController", function ($scope, $cookieStore, $http, $filter, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.CommercialInvoiceId = $cookieStore.get('CommercialInvoiceId');
    Clear();

    function Clear() {
        $scope.BankDocTableDataRow = [];
        $scope.BankDocForReport = [];
        $scope.BankDoc = [];
        GetCIMasterByCIid();
        GetBankDocForReport();
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
            console.log($scope.CommercialInvoiceMasterList[0]);
            $scope.CommercialInvoiceMasterList[0].PiRefNo = $scope.CommercialInvoiceMasterList[0].PiRefNo.split(",");
            $scope.CommercialInvoiceMasterList[0].PiRefDate = $scope.CommercialInvoiceMasterList[0].PiRefDate.split(",");
        });
    } 

    function GetBankDocForReport() {
        $http({
            url: '/ExpCommercialInvoice/GetBankDocForReport?commercialInvoiceId=' + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.BankDocForReport = data;
        });
    }

});