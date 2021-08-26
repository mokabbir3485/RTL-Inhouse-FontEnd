app.controller("ItemAdditionalAttributePriceController", function ($scope, $cookieStore, $http, $filter) {
    $scope.LoginUser = $cookieStore.get('UserData');
    load();

    function load() {
        $scope.ddlProduct = null;
        $scope.ProductList = [];
        $scope.BarcodeList = [];
        $scope.HeaderOfAttribute = [];
        $scope.ad_ItemPriceByAttribute = [];
        GetAllProduct();
        GetAllBarcode();
        $scope.valueList = [];
    }

    function GetAllProduct() {
        $http({
            url: "/Item/GetLimitedProperty",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {            
            $scope.ProductList=data;
        });
    }

    function GetAllBarcode() {
        $http({
            url: '/Item/GetAllBarcode',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.BarcodeList = JSON.parse(data);          
        });
    }

    $scope.CheckDuplicateBarcodeNo = function (aCombination) {

        var checkBarcodeOnGrid = Enumerable.From($scope.BarcodeList).Where('$.Barcode=="' + aCombination.Barcode + '"' + " && $.ItemAddAttId !=" + aCombination.ItemAddAttId).FirstOrDefault();

        if ((!angular.isUndefined(checkBarcodeOnGrid) && checkBarcodeOnGrid.Barcode != "")) {
            $scope.found = true;
            alertify.log('Barcode : '+aCombination.Barcode + ' already exists!', 'already', '5000');
            aCombination.Barcode="";

        } else {
            var checkBarcodeInBarcodeArray = Enumerable.From($scope.BarcodeList).Where('$.Barcode=="' + aCombination.Barcode + '"' + " && $.ItemAddAttId ==" + aCombination.ItemAddAttId).FirstOrDefault();
            if (angular.isUndefined(checkBarcodeInBarcodeArray)) {
                var newBarcode = {};
                newBarcode.Barcode = aCombination.Barcode;
                newBarcode.ItemAddAttId = aCombination.ItemAddAttId;
                $scope.BarcodeList.push(newBarcode);
            }            
        }
    }

    $scope.GetCombinationByItemId = function () {
        if($scope.ddlProduct){
            $http({
                url: '/ItemAdditionalAttribute/ItemPriceByAttributeGetByItemId?itemId=' + $scope.ddlProduct.ItemId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                var Attdata = data;
                $scope.ad_ItemPriceByAttribute = [];
                $scope.HeaderOfAttribute = [];
                if (data.length) {
                    var a = data[0].Combination.split(',');
                    for (var i = 0; i < a.length; i++) {
                        var val = a[i].split(':');

                        $scope.HeaderOfAttribute.push(val[0].trim());
                    }
                  
                    angular.forEach(Attdata, function (adata) {
                        var ValueOfAttribute = [];
                        var a = adata.Combination.split(',');
                        for (var i = 0; i < a.length; i++) {
                            var val = a[i].split(':');
                            
                            ValueOfAttribute.push(val[1].trim());
                        }                      
                        adata.ValueOfAttribute = ValueOfAttribute;
                        $scope.ad_ItemPriceByAttribute.push(adata);
                    });
                }
            })
        }
        else {
            load();
        }
    }

    $scope.ItemSearchCombinationTextChange = function () {
        if ($scope.ProductCombination != undefined && $scope.ProductCombination != null && $scope.ProductCombination != "") {
            var SingleSearchItem = $scope.ProductCombination.split(" ");
            var SearchCriteria = "";
            myHilitor = new Hilitor2("SearchResults");
            myHilitor.remove();
            for (var i = 0; i < SingleSearchItem.length; i++) {
                myHilitor.setMatchType("open");
                if (SearchCriteria == "") {
                    SearchCriteria = "~($.AttributeValueCombination).toUpperCase().indexOf('" + SingleSearchItem[i] + "'.toUpperCase())";
                } else {
                    SearchCriteria += " && ~($.AttributeValueCombination).toUpperCase().indexOf('" + SingleSearchItem[i] + "'.toUpperCase())";
                }

                myHilitor.apply(SingleSearchItem[i]);
            }

            $scope.AllCombinationSearch = Enumerable.From($scope.ad_ItemPriceByAttribute).Where(SearchCriteria).Take(7).ToArray();
            $scope.VisibilityOfSuggession = true;
        }
        else {
            $scope.AllCombinationSearch = Enumerable.From($scope.ad_ItemPriceByAttribute).Take(7).ToArray();
            $scope.VisibilityOfSuggession = false;
        }
    }


    $scope.SaveAttributePrice = function () {
        if ($scope.ad_ItemPriceByAttribute.length > 0) {

            //If need setup item manually sales price then remove this foreach and in the 
            //HTML remove display none from sales price column
            angular.forEach($scope.ad_ItemPriceByAttribute, function (aCombination) {
                aCombination.SaleUnitPrice = 0;
            });

            $.ajax({
                url: "/ItemAdditionalAttribute/UpdateItemPriceByAttribute",
                contentType: "application/json;charset=utf-8",
                type: "POST",
                data: JSON.stringify({ _ad_ItemPriceByAttribute: $scope.ad_ItemPriceByAttribute, UpdatorId: $scope.LoginUser.UserId }),
                success: function (data) {
                    if (data != null && data != '' && data != 0) {
                        alertify.log(data +' Attributes Price Updated Successfully', 'success', '10000');
                        load();
                    } else { alertify.log('Server Save Errors!', 'error', '10000'); }
                }, error: function (msg) {
                    alertify.log('Server Save Errors!', 'error', '10000');
                }
            });
        }
        else {
            alertify.log('No Updateable Price !', 'error', '10000');
        }
    }

    $scope.LoadACombination = function (aCombination) {//Barcode "175S0071"
        angular.forEach($scope.ad_ItemPriceByAttribute, function (aPriceAttribut) {
            if (aPriceAttribut.ItemAddAttId == aCombination.ItemAddAttId) {
                var index = $scope.ad_ItemPriceByAttribute.indexOf(aCombination);
                var value = $scope.ad_ItemPriceByAttribute.splice(index, 1)[0]; 
                $scope.ad_ItemPriceByAttribute.splice(0, 0, value);
            }
        })
        //var x = document.getElementById("mytable").getElementsByTagName("tr");
        ////x[0].innerHTML = "i want to change my cell color";
        //x[1].style.backgroundColor = "yellow";
    }

    $scope.ResetForm = function () {
        load();
    }
});