app.controller("BarcodePrintControlloer", function ($scope, $cookieStore, $http, $filter, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    Load();
    function Load() {
        $scope.ProductDetailList = [];
        $scope.barcodeList = [];
        $scope.Branchlist = [];
        GetAllBranch();
        GetByCombinationand();
        GetAllVariety();
    }
    function GetAllVariety() {
        $http({
            url: "/Item/GetLimitedProperty",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.VarietyList = data;
        });
    }
    function GetAllBranch() {
        $http({
            url: '/Branch/GetAllBranch',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Branchlist = data;
        });
    }
    function GetByCombinationand() {
        $http({
            url: '/Item/GetCombinationWithPrice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AllCombinationlist = JSON.parse(data);
        })
    }
    $scope.ItemSearchCombinationTextChange = function () {
        if ($scope.ItemSearchCombination != undefined && $scope.ItemSearchCombination != null && $scope.ItemSearchCombination != "") {
            var SingleSearchItem = $scope.ItemSearchCombination.split(" ");
            var SearchCriteria = "";
            myHilitor = new Hilitor2("SearchResults");
            myHilitor.remove();
            for (var i = 0; i < SingleSearchItem.length; i++) {
                myHilitor.setMatchType("open");
                if (SearchCriteria == "") {
                    SearchCriteria = "~($.Combination).toUpperCase().indexOf('" + SingleSearchItem[i] + "'.toUpperCase())";
                } else {
                    SearchCriteria += " && ~($.Combination).toUpperCase().indexOf('" + SingleSearchItem[i] + "'.toUpperCase())";
                }

                myHilitor.apply(SingleSearchItem[i]);
            }

            $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).Where(SearchCriteria).Take(7).ToArray();
            $scope.VisibilityOfSuggession = true;
        }
        else {
            $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).Take(7).ToArray();
            $scope.VisibilityOfSuggession = false;
        }
    }
    $scope.LoadACombination = function (aCombination) {
        $scope.ItemCombination = aCombination;
        $scope.VisibilityOfSuggession = false;
        $scope.ItemSearchCombination = $scope.ItemCombination.Combination;
        $scope.AllCombinationSearch = [];
        $('#txtQty').focus();
    }
    $scope.AddProduct = function () {
        var flag = true;
        angular.forEach($scope.barcodeList, function (aDetailAdAttribute) {
            if (aDetailAdAttribute.Barcode == $scope.ItemCombination.Barcode) {
                flag = false;
            }
        });
        if (flag) {
            var ValueOfAttribute = [];
            var a = $scope.ItemCombination.AttributeNames.split(',');
            for (var i = 0; i < a.length; i++) {
                var val = a[i].split(':');
                ValueOfAttribute.push(val[1].trim());
            }
            $scope.ItemCombination.ValueOfAttribute = ValueOfAttribute;
            var Attribute = $scope.ItemCombination;
            Attribute.Qty = $scope.Qty;
            $scope.barcodeList.push(Attribute);

            flag = true;
            angular.forEach($scope.ProductDetailList, function (aItem) {
                if (aItem.ItemId == $scope.ItemCombination.ItemId) {
                    flag = false;
                }
            });
            if (flag) {
                var Item = {};
                angular.forEach($scope.VarietyList, function (aItem) {
                    if (aItem.ItemId == $scope.ItemCombination.ItemId) {
                        Item = aItem;
                    }
                })
                Item.HeaderOfAttribute = [];
                var HeaderOfAttribute = [];
                var a = $scope.ItemCombination.AttributeNames.split(',');
                for (var i = 0; i < a.length; i++) {
                    var val = a[i].split(':');
                    HeaderOfAttribute.push(val[0].trim());
                }
                Item.HeaderOfAttribute = HeaderOfAttribute;
                $scope.ProductDetailList.push(Item);
            }

            $scope.ItemCombination = {};
            $scope.ItemSearchCombination = null;
            $scope.Qty = null;
            $('#SearchTextBox').focus();
        }
        else {
            alertify.log('This Combination already Exist, Try another one !!!', 'error', '5000');
        }
    }
    $scope.RemoveItemAttr = function (aCode) {
        var ind = $scope.barcodeList.indexOf(aCode);
        $scope.barcodeList.splice(ind, 1);
        angular.forEach($scope.ProductDetailList, function (aProduct) {
            var flag = true;
            angular.forEach($scope.barcodeList, function (aCod) {
                if (aCod.ItemId == aProduct.ItemId) {
                    flag = false;
                }
            });
            if (flag) {
                var ind2 = $scope.ProductDetailList.indexOf(aProduct);
                $scope.ProductDetailList.splice(ind2, 1);
            }
        });
    }
    $scope.Save = function () {
        angular.forEach($scope.barcodeList, function (aBarcode) {
            aBarcode.BranchId = $scope.ddlBranch.BranchId;
        })
        var parms = JSON.stringify({ barcodePrintLst: $scope.barcodeList});
        $http.post('/BarcodePrint/SaveBarcode', parms).success(function (data) {
            $window.open("/ErpReports/RVBarcodeTest.aspx", "_blank", "width=1115,height=630,left=125,top=25");
            Load();
        })
    }
});
