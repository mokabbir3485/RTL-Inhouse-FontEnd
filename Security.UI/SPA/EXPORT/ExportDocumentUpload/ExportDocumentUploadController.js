
app.controller("ExportDocumentUploadController", function ($scope, $http, FileUploadService) {
    Clear();
    function Clear() {
        // Variables
        $scope.Message = "";
        $scope.FileInvalidMessage = "";
        $scope.SelectedFileForUpload = null;
        $scope.FileDescription = "";
        $scope.IsFormSubmitted = false;
        $scope.IsFileValid = false;
        $scope.IsFormValid = false;
        /////////////////////
        $scope.ad_Item = [];
        $scope.invoiceList = [];
        $scope.SalesOrderList = [];
        $scope.CommercialInvoiceList = [];
        GetAllCommercialInvoice();
        GetAllProformaInvoice();
        GetAllSalesOrder();
    }

    function GetAllCommercialInvoice() {
        $http({
            url: '/ExpCommercialInvoice/GetAllCommercialInvoice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CommercialInvoiceList = data;

        });
    }
    function GetAllSalesOrder() {
        $http({
            url: '/SalesOrder/GetAllRole',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.SalesOrderList = data;
        });

    }
    function GetAllProformaInvoice() {
        $http({
            url: "/ExpInvoice/GetAllInvoice",
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.invoiceList = data;
        });
    }


    //Form Validation
    $scope.$watch("f1.$valid", function (isValid) {
        $scope.IsFormValid = isValid;
    });


    // THIS IS REQUIRED AS File Control is not supported 2 way binding features of Angular
    // ------------------------------------------------------------------------------------
    //File Validation
    $scope.ChechFileValid = function (file) {
        var isValid = false;
        if ($scope.SelectedFileForUpload != null) {
            //if ((file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif' || file.type == 'application/pdf') && file.size <= (512 * 1024)) {
            if ((file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif' || file.type == 'application/pdf')) {
                $scope.FileInvalidMessage = "";
                isValid = true;
            }
            else {
                $scope.FileInvalidMessage = "Selected file is Invalid. (only file type png, jpeg and gif and 512 kb size allowed)";
            }
        }
        else {
            $scope.FileInvalidMessage = "Image required!";
        }
        $scope.IsFileValid = isValid;
    };

    //File Select event 
    $scope.selectFileforUpload = function (file) {
        $scope.SelectedFileForUpload = file[0];
    }
    //----------------------------------------------------------------------------------------

    //Save File
    $scope.SaveFile = function () {
        $scope.IsFormSubmitted = true;
        $scope.Message = "";
        $scope.ChechFileValid($scope.SelectedFileForUpload);
        if ($scope.IsFormValid && $scope.IsFileValid) {
            FileUploadService.UploadFile($scope.SelectedFileForUpload, $scope.FileDescription).then(function (d) {
                alert("Upload Successfull!!!");
                ClearForm();
            }, function (e) {
                alert(e);
            });
        }
        else {
            $scope.Message = "All the fields are required.";
        }
    };
    //Clear form 
    function ClearForm() {
        $scope.FileDescription = "";
        //as 2 way binding not support for File input Type so we have to clear in this way
        //you can select based on your requirement
        angular.forEach(angular.element("input[type='file']"), function (inputElem) {
            angular.element(inputElem).val(null);
        });

        $scope.f1.$setPristine();
        $scope.IsFormSubmitted = false;
    }

    //$scope.uploadFile = function (file) {
    //    $scope.UploadFile = file[0];
    //    $scope.ad_Item.imageUrl = "/UploadedImages/" + file[0].name;
    //    $scope.ad_Item.AccountCode = $scope.ad_Item.imageUrl;
    //    $scope.imgUrl = $scope.ad_Item.imageUrl;
    //    $scope.stepsModel.push($scope.imgUrl);


    //};

    ////$scope.uploadFile = function (file) {
    ////    var files = event.target.files; //FileList object

    ////    for (var i = 0; i < files.length; i++) {
    ////        var fileShow = files[i];
    ////        var reader = new FileReader();
    ////        reader.onload = $scope.imageIsLoaded;
    ////        reader.readAsDataURL(fileShow);
    ////    }
    ////}

    //$scope.stepsModel = [];
    //$scope.imageIsLoaded = function (e) {
    //    $scope.$apply(function () {
    //        $scope.stepsModel.push(e.target.result);
    //    });
    //}
    //$scope.SaveItem = function UploadImage(odlUrl) {
    //    var fd = new FormData();
    //    //Take the first selected file
    //    fd.append("file", $scope.UploadFile);
    //    fd.append("odlUrl", odlUrl);

    //    $http.post("/Item/SaveFiles", fd, {
    //        withCredentials: true,
    //        headers: { 'Content-Type': undefined },
    //        transformRequest: angular.identity
    //    }).success(function (d) {
    //        alert('succ');
    //    })
    //        .error(function () {
    //            alert('err');
    //        });

    //};
}).factory('FileUploadService', function ($http, $q) { // explained abour controller and service in part 2

    var fac = {};
    fac.UploadFile = function (file, description) {
        var formData = new FormData();
        formData.append("file", file);
        //We can send more data to server using append         
        formData.append("description", description);

        var defer = $q.defer();
        $http.post("/Item/SaveFiles", formData,
            {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
            .then(function (d) {
                defer.resolve(d);
            });


        return defer.promise;

    }
    return fac;

});