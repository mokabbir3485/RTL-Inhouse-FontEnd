app.controller("Mushak4_3ReportController", function ($scope, $cookieStore, $http, $filter) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.BillOfMaterialObj = $cookieStore.get('BillOfMaterialObj');
    $scope.BillOfMaterialId = $scope.BillOfMaterialObj.BillOfMaterialId;

    var isSubmitDate = isNaN($scope.BillOfMaterialObj.SubmitDate);

    if (isSubmitDate == true) {
        var res1 = $scope.BillOfMaterialObj.SubmitDate.substring(0, 5);
        if (res1 == "/Date") {
            var parsedDate1 = new Date(parseInt($scope.BillOfMaterialObj.SubmitDate.substr(6)));
            var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
            $scope.BillOfMaterialObj.SubmitDate = date1;
        }
    }

    var isDeliveryDate = isNaN($scope.BillOfMaterialObj.DeliveryDate);

    if (isDeliveryDate == true) {
        var res2 = $scope.BillOfMaterialObj.DeliveryDate.substring(0, 5);
        if (res2 == "/Date") {
            var parsedDate2 = new Date(parseInt($scope.BillOfMaterialObj.DeliveryDate.substr(6)));
            var date2 = ($filter('date')(parsedDate2, 'MMM dd, yyyy')).toString();
            $scope.BillOfMaterialObj.DeliveryDate = date2;
        }
    }

    $scope.TotalOverheadAmount = 0;
    $scope.TotalPackingAmount = 0;
    $scope.TotalServiceAmount = 0;
    $scope.TotalRawMaterialValue = 0;
    $scope.TotalRawMaterialWithOtherCost = 0;
    $scope.TotalCost = 0;

    $scope.BillOfMaterialDetaillist = [];
    $scope.OverheadDetailList = [];
    $scope.SeviceDetailList = [];
    $scope.PackingDetailList = [];
    GetBillOfMaterialDetail();
    GetBillOfMaterialOverhead();



    String.prototype.getDigitBanglaFromEnglish = function () {
        var finalEnlishToBanglaNumber = {

            '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪', '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
            'Jan':'জানুয়ারী', 'Feb' : 'ফেব্রুয়ারি','Mar':'মার্চ', 'Apr':'এপ্রিল','May':'মে','Jun':'জুন','Jul':'জুলাই','Aug':'আগস্ট','Sep':'সেপ্টেম্বর','Oct':'অক্টোবর','Nov':'নভেম্বর','Dec':'ডিসেম্বর'
        };
        var retStr = this;
        for (var x in finalEnlishToBanglaNumber) {
            retStr = retStr.replace(new RegExp(x, 'g'), finalEnlishToBanglaNumber[x]);
        }
        return retStr;
    };

    //var itemDigit = "100000023";
    $scope.BillOfMaterialObj.HsCode = $scope.BillOfMaterialObj.HsCode.getDigitBanglaFromEnglish();
    $scope.BillOfMaterialObj.SubmitDate = $scope.BillOfMaterialObj.SubmitDate.getDigitBanglaFromEnglish();
    $scope.BillOfMaterialObj.DeliveryDate = $scope.BillOfMaterialObj.DeliveryDate.getDigitBanglaFromEnglish();
    //console.log(item1);


    function GetBillOfMaterialDetail() {
        $http({
            url: "/BillOfMaterial/GetBillOfMaterialDetailByBillOfMaterialId?BOMId=" + $scope.BillOfMaterialId,
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (BOMDetailData) {
            $scope.BillOfMaterialDetaillist = BOMDetailData;


            angular.forEach($scope.BillOfMaterialDetaillist,
                function (aData) {

                    $scope.TotalRawMaterialValue = aData.TotalValue + $scope.TotalRawMaterialValue;
                    aData.Qty = aData.Qty.toString().getDigitBanglaFromEnglish();
                    aData.UnitPrice = aData.UnitPrice.toString().getDigitBanglaFromEnglish();
                    aData.WastagePercentage = aData.WastagePercentage.toString().getDigitBanglaFromEnglish();
                    aData.WastageAmount = aData.WastageAmount.toString().getDigitBanglaFromEnglish();
                    aData.TotalValue = aData.TotalValue.toString().getDigitBanglaFromEnglish();

                });

            $scope.BillOfMaterialObj.BOMDetail = $scope.BillOfMaterialDetaillist;





        });
    }

    function GetBillOfMaterialOverhead() {
        $http({
            url: "/BillOfMaterial/GetBillOfMaterialOverheadByBillOfMaterialId?BOMId=" + $scope.BillOfMaterialId + "&SectorType=Overhead",
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            if (data.length) {
                $scope.OverheadDetailList = data;


                angular.forEach($scope.OverheadDetailList,
                    function (aData) {
                        $scope.TotalOverheadAmount = aData.Amount + $scope.TotalOverheadAmount;
                        aData.Amount = aData.Amount.toString().getDigitBanglaFromEnglish();

                    });

            }

            $http({
                url: "/BillOfMaterial/GetBillOfMaterialOverheadByBillOfMaterialId?BOMId=" + $scope.BillOfMaterialId + "&SectorType=Packing",
                method: "GET",
                headers: { 'Content-Type': "application/json" }
            }).success(function (data) {
                if (data.length) {
                    $scope.PackingDetailList = data;


                    angular.forEach($scope.PackingDetailList,
                        function (aData) {
                            $scope.TotalPackingAmount = aData.Amount + $scope.TotalPackingAmount;
                            aData.Amount = aData.Amount.toString().getDigitBanglaFromEnglish();

                        });
                }

                $http({
                    url: "/BillOfMaterial/GetBillOfMaterialOverheadByBillOfMaterialId?BOMId=" + $scope.BillOfMaterialId + "&SectorType=Service",
                    method: "GET",
                    headers: { 'Content-Type': "application/json" }
                }).success(function (data) {
                    if (data.length) {
                        $scope.ServiceDetailList = data;


                        angular.forEach($scope.ServiceDetailList,
                            function (aData) {
                                $scope.TotalServiceAmount = aData.Amount + $scope.TotalServiceAmount;
                                aData.Amount = aData.Amount.toString().getDigitBanglaFromEnglish();

                            });


                    }

                    $scope.TotalRawMaterialWithOtherCost = $scope.TotalRawMaterialValue + $scope.TotalServiceAmount + $scope.TotalPackingAmount;
                    $scope.TotalCost = $scope.TotalRawMaterialWithOtherCost + $scope.TotalOverheadAmount;
                    //$scope.TotalCost = $scope.TotalRawMaterialValue + $scope.TotalOverheadAmount + $scope.TotalServiceAmount + $scope.TotalPackingAmount;
                    $scope.TotalRawMaterialValue = $scope.TotalRawMaterialValue.toString().getDigitBanglaFromEnglish();
                    $scope.TotalOverheadAmount = $scope.TotalOverheadAmount.toString().getDigitBanglaFromEnglish();
                    $scope.TotalPackingAmount = $scope.TotalPackingAmount.toString().getDigitBanglaFromEnglish();
                    $scope.TotalServiceAmount = $scope.TotalServiceAmount.toString().getDigitBanglaFromEnglish();
                    $scope.TotalRawMaterialWithOtherCost = $scope.TotalRawMaterialWithOtherCost.toString().getDigitBanglaFromEnglish();
                    $scope.TotalCost = $scope.TotalCost.toString().getDigitBanglaFromEnglish();

                });
            });
        });

    }





})