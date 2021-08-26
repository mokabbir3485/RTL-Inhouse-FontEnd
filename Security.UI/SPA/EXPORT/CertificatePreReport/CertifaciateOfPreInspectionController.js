app.controller('CertifaciateOfPreInspectionController', function ($scope, $http, $cookieStore) {
    $scope.LoginUser = $cookieStore.get('UserData');
    
    $scope.CommercialInvoiceId = $cookieStore.get('CommercialInvoiceId');
    console.log("id", $scope.CommercialInvoiceId);
    Clear();
    function Clear() {
        //$scope.certificateOriginName = "CERTIFICATE OF ORIGIN";
        $scope.CommercialInvoiceList = [];
     
        //$scope.CertificateOfOriginList = [];
        $scope.CertifaciateOfPreInspectionList = [];
     
        //GetAllCertificateOforigin();
        GetAllCertificateOfPre();

        $scope.certificateOfOriginCiId = [];

        GetCIInfoDetailReport();
    }

   


    //function GetAllCertificateOforigin(CertificateType = "co") {
       
    //        $http({
    //            url: "/CertificateOfOrigin/GetAllCertificateOforigin?CommercialInvoiceId=" + $scope.CommercialInvoiceId + "&CertificateType=" + CertificateType,
    //            method: "GET",
    //            headers: { 'Content-Type': 'application/json' }
    //        }).success(function (Cofdata) {
    //            $scope.CertificateOfOriginList = Cofdata;
    //            console.log('List Data', $scope.CertificateOfOriginList);
    //        });

      
    //}

    function GetAllCertificateOfPre(CertificateType = "pi") {

        $http({
            url: "/CertificateOfOrigin/GetAllCertificateOforigin?CommercialInvoiceId=" + $scope.CommercialInvoiceId + "&CertificateType=" + CertificateType,
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).success(function (Cofdata) {
            $scope.CertifaciateOfPreInspectionList = Cofdata;
            console.log('List Data', $scope.CertifaciateOfPreInspectionList);
        });


    }
    function GetCIInfoDetailReport() {
        $http({
            url: '/ExpCommercialInvoice/GetCIInfoDetailReport?commercialInvoiceId=' + $scope.CommercialInvoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CiInfoDetailReportList = data;
            console.log($scope.CiInfoDetailReportList[0]);


        });
    }
  
   
});