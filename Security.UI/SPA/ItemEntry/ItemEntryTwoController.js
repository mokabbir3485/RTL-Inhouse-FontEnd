app.controller("ItemEntryTwoController",
    function ($scope, $http, $cookieStore, $window) {
        $scope.LoginUser = $cookieStore.get("UserData");
        $scope.UserId = $scope.LoginUser.UserId;
        $scope.ScreenId = $cookieStore.get("ProductScreenId");

        Clear();
        BindData();

        function Clear() {
            //ScreenLock();
            //Server side pagination
            //$scope.currentPage = 1;
            //$scope.PerPage = 10;
            //$scope.total_count = 0;
            //$scope.SearchCriteria = "1=1";
            $scope.currentPage = 1;
            $scope.PerPage = 10;
            $scope.total_count = 0;
            GetItemPaged($scope.currentPage);

            $scope.DuplicateBarcodeFound = false;
            $scope.ScreenLockInfo = [];
            $scope.ItemPackageUnitlist = [];
            $scope.ItemMainlist = [];
            $scope.AllItemSearch = [];
            $scope.FirstAttributeList = [];
            $scope.ItemSearchResultList = [];
            //$scope.ItemNameList = ["Barcode Label", "Barcode Ribbon"];
            $scope.ItemNameList = [
                { 'ItemName': 'Barcode Label'},
                { 'ItemName': 'Barcode Ribbon'}

            ];

            $scope.HsCodeList = [];
            $scope.found = false;
            $scope.ad_Item = {};
            $scope.ad_ItemVat = {};
            $scope.ad_Item.ItemId = 0;
            $scope.ad_Item.UnitPerPackage = 1;
            //$scope.ad_Item.ContainerId = 0;
            RemoveImgURL("imgFram");
            $scope.ddlCategory = null;
            $scope.ddlSubCategory = null;
            $scope.ddlItemUnit = null;
            $scope.ad_Item.ContainerId = 0;
            $scope.btnItemDeleleShow = false;
            $scope.ad_Item.IsActive = true;
            GetByCombinationValue();
            GetHsCode();
            //GetItemSearchResultPaged($scope.currentPage, $scope.SearchCriteria);

            $scope.btnSaveItem = "Save";
            $scope.btnUnitPackage = $scope.ddlItemPackage;

            $scope.btnPackageWeight = "Roll Weight";
            $scope.btnPackagePerContainer = "Package Per Container";
            $scope.btnContainerWeight = "Carton Weight";
            $scope.btnContainerSize = "Carton Size";
            $scope.Package = false;
            $scope.Container = false;
        }

        $scope.hideBtnColapse = function () {
            $scope.IsChecked == false;

            //ainv_PurchaseBill.ShipmentInfo = ainv_PurchaseBill.ShipmentInfo == null ? "" : ainv_PurchaseBill.ShipmentInfo;
            //$scope.IsChecked = $scope.IsChecked == false ? true : false;
            //if ($scope.btnIcon == "+") {
            //    $scope.invDetailsFiledHide = true;
            //} 
        }

        function BindData() {
            $scope.CategoryList = [];
            $scope.SubcategoryList = [];
            $scope.ItemUnitlist = [];
            GetAllCategory();
            GetAllSubCategory();
            GetAllItemUnit();
        }

        $scope.itemNameId = function () {
            var itemname = $scope.ad_Item.ItemName;
            //console.log(itemname);
        }

        //function GetItemSearchResultPaged(curPage, SearchCriteria) {
        //    if (curPage == null) curPage = 1;
        //    var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        //    $http({
        //        url: "/Item/GetItemSearchResultPaged?StartRecordNo=" +
        //            StartRecordNo +
        //            "&RowPerPage=" +
        //            $scope.PerPage +
        //            "&whClause=" +
        //            encodeURIComponent(SearchCriteria) +
        //            "&rows=" +
        //            0,
        //        method: "GET",
        //        headers: { 'Content-Type': "application/json" }
        //    }).success(function (data) {
        //        $scope.ItemSearchResultList = data.ListData;
        //        console.log($scope.ItemSearchResultList);
        //        $scope.total_count = data.TotalRecord;
        //    });
        //}
        function GetHsCode() {

            $http({
                url: "/ItemHsCode/Get",
                method: "Get",
                headers: {'Content-Type': "application/json"}
            }).success(function (data) {
                $scope.HsCodeList = data;
                //console.log(data);
            })
        }
        function GetAllCategory() {
            $http({
                url: "/Category/GetAllCategory",
                method: "GET",
                headers: { 'Content-Type': "application/json" }
            }).success(function (data) {
                $scope.CategoryList = data;
            });
        }

        function GetAllSubCategory() {
            $http({
                url: "/Subcategory/GetAllSubategory",
                method: "GET",
                headers: { 'Content-Type': "application/json" }
            }).success(function (data) {
                $scope.SubcategoryList = data;
            });
        }

        function GetAllItemUnit() {
            $http({
                url: "/Unit/GetAllUnit",
                method: "GET",
                headers: { 'Content-Type': "application/json" }
            }).success(function (data) {
                $scope.ItemUnitlist = data;
                //console.log($scope.ItemUnitlist);
            });
        }


        function GetByCombinationValue() {
            $http({
                url: "/Item/GetByCombinationValue",
                method: "GET",
                headers: { 'Content-Type': "application/json" }
            }).success(function (data) {
                $scope.ItemMainlist = data;
            });
        }

        //$scope.getData = function (curPage) {
        //    if ($scope.PerPage > 100) {
        //        $scope.PerPage = 100;
        //        $scope.currentPage = curPage;
        //        GetItemSearchResultPaged($scope.currentPage, $scope.SearchCriteria);
        //        alertify.log("Maximum record  per page is 100", "error", "5000");
        //    } else if ($scope.PerPage < 1) {
        //        $scope.PerPage = 1;
        //        $scope.currentPage = curPage;
        //        GetItemSearchResultPaged($scope.currentPage, $scope.SearchCriteria);
        //        alertify.log("Minimum record  per page is 1", "error", "5000");
        //    } else {
        //        $scope.currentPage = curPage;
        //        GetItemSearchResultPaged($scope.currentPage, $scope.SearchCriteria);
        //    }
        //};


        //$scope.Search = function () {
        //    $scope.SearchCriteria = "1=1";
        //    if ($scope.SrcCode != null && $scope.SrcCode != "") {
        //        $scope.SearchCriteria += " AND ItemCode LIKE '%" + $scope.SrcCode + "%'";
        //    }
        //    //if ($scope.SrcName != null && $scope.SrcName != "") {
        //    //    $scope.SearchCriteria += " AND I.ItemName LIKE '%" + $scope.SrcName + "%'";
        //    //}
        //    if ($scope.ddlSrcCategory != null) {
        //        $scope.SearchCriteria += " AND C.CategoryId=" + $scope.ddlSrcCategory.CategoryId;
        //    }
        //    if ($scope.ddlSrcSubategory != null) {
        //        $scope.SearchCriteria += " AND I.SubCategoryId=" + $scope.ddlSrcSubategory.SubCategoryId;
        //    }
        //    if ($scope.Description != null && $scope.Description != "") {
        //        $scope.SearchCriteria += " AND I.ItemDescription LIKE '%" + $scope.Description + "%'";
        //    }

        //    GetItemSearchResultPaged($scope.currentPage, $scope.SearchCriteria);
           

        //};

        //$scope.Unit = function (e) {

        //    if (e.ItemUnitId == 2) {
        //        $scope.dropDown1 = e.UnitName;
        //    }
        //    else if (e.ItemUnitId == 3) {
        //        $scope.dropDown2 = e.UnitName;

        //    }


        //}
        //$scope.Package = function (e) {
        //    if (e.ItemUnitId == 2) {
        //        $scope.dropDown1 = e.UnitName;
        //    }
        //    else if (e.ItemUnitId == 3){
        //        $scope.dropDown2 = e.UnitName;

        //    }

        //}
        //$scope.SelectddlItemContainer = function (e) {
        //    if (e.ItemUnitId == 2) {
        //        $scope.dropDown1 = e.UnitName;
        //    }
        //    else if (e.ItemUnitId == 3) {
        //        $scope.dropDown2 = e.UnitName;

        //    }
        //}

        $scope.CategoryChange = function () {
            $scope.AllItemSearch = [];
            $scope.FirstAttributeList = [];
            $scope.ad_Item.ItemName = null;
            $scope.ad_Item.ItemDescription = null;
            //$scope.itemEntryNewForm.$setUntouched();
            //$scope.itemEntryNewForm.$setPristine();
        };

        $scope.SelectddlItemUnit = function (item) {
            if (item) {
                $scope.ItemPackageUnitlist = angular.copy($scope.ItemUnitlist);
            } else {
                $scope.ItemPackageUnitlist = null;
            }
            $window.scrollTo(0, 0);
        };

        $scope.ItemSearchTextChange = function (subCategoryId) {
            $scope.ad_Item.ItemDescription = null;
            ad_Item.ItemName;
            var ItemSearchList = Enumerable.From($scope.ItemMainlist).Where("$.SubCategoryId==" + subCategoryId)
                .ToArray();

            if ($scope.ad_Item.ItemName != undefined &&
                $scope.ad_Item.ItemName != null &&
                $scope.ad_Item.ItemName != "") {
                var SingleSearchItem = $scope.ad_Item.ItemName.split(" ");
                var SearchCriteria = "";
                myHilitor = new Hilitor2("SearchResults");
                myHilitor.remove();
                for (var i = 0; i < SingleSearchItem.length; i++) {
                    myHilitor.setMatchType("open");
                    if (SearchCriteria == "") {
                        SearchCriteria =
                            "~($.ItemName).toUpperCase().indexOf('" + SingleSearchItem[i] + "'.toUpperCase())";
                    } else {
                        SearchCriteria += " && ~($.ItemName).toUpperCase().indexOf('" +
                            SingleSearchItem[i] +
                            "'.toUpperCase())";
                    }

                    myHilitor.apply(SingleSearchItem[i]);
                }

                $scope.AllItemSearch = Enumerable.From(ItemSearchList).Where(SearchCriteria).Take(8).ToArray();
                $scope.ShowItemSearch = true;
            } else
                $scope.ShowItemSearch = false;

            var firstAttribute = Enumerable
                .From((Enumerable.From(ItemSearchList).Select("x => { FirstAttribute: x['FirstAttribute'] }")
                    .ToArray())).Distinct("$.FirstAttribute").ToArray();
            for (var i = 0; i < firstAttribute.length; i++) {
                var obj = {};
                obj.AttributeValue = firstAttribute[i].FirstAttribute;
                $scope.FirstAttributeList.push(obj);
            }
        };

        $scope.LoadAnItem = function (aItem) {
            //console.log($scope.aItem);
            $scope.ad_Item.ItemName = aItem.ItemName;
            $scope.ShowItemSearch = false;
            $scope.AllItemSearch = [];

            $("#txtFirstDescription").focus();

            //var ItemSearchList = Enumerable.From($scope.ItemMainlist).Where("$.SubCategoryId==" + $scope.ddlSubCategory.SubCategoryId).ToArray();

            //var firstAttribute = Enumerable.From((Enumerable.From(ItemSearchList).Select("x => { FirstAttribute: x['FirstAttribute'] }").ToArray())).Distinct("$.FirstAttribute").ToArray();
            //for (var i = 0; i < firstAttribute.length; i++) {
            //    var obj = {};
            //    obj.AttributeValue = firstAttribute[i].FirstAttribute;
            //    $scope.FirstAttributeList.push(obj);
            //}
        };

        $scope.FirstDescriptionTextChange = function () {
            if ($scope.ad_Item.ItemDescription != undefined &&
                $scope.ad_Item.ItemDescription != null &&
                $scope.ad_Item.ItemDescription != "") {
                $scope.FirstAttributeSearch = Enumerable.From($scope.FirstAttributeList)
                    .Where("~($.AttributeValue).toUpperCase().indexOf('" +
                        $scope.ad_Item.ItemDescription +
                        "'.toUpperCase())").Take(8).ToArray();
                $scope.ShowFirstAttribute = true;
            } else
                $scope.ShowFirstAttribute = false;
        };

        $scope.LoadFirstAttributeValue = function (attributeValue) {
            $scope.ad_Item.ItemDescription = attributeValue;
            $scope.ShowFirstAttribute = false;
            $("#txtItemCode").focus();
        };

        $scope.CheckDuplicateBarcode = function () {
            var where = "ItemCode='" + $scope.ad_Item.ItemCode + "' ";
            if ($scope.ad_Item.ItemId > 0)
                where += "AND ItemId<>" + $scope.ad_Item.ItemId;
            $http({
                url: "/Item/GetItemSearchResult?searchCriteria=" + where,
                method: "GET",
                headers: { 'Content-Type': "application/json" }
            }).success(function (data) {
                if (data.length > 0) {
                    alertify.log($scope.ad_Item.ItemCode + " Item Code already exists!", "already", "5000");
                    txtItemCode.focus();
                    $scope.DuplicateBarcodeFound = true;
                } else {
                    $scope.DuplicateBarcodeFound = false;
                }
            });
        };

        $scope.ItemCodeChange = function () {
            $scope.DuplicateBarcodeFound = true;
        };

        $scope.CartonSizeChange = function () {
            if ($scope.ad_Item.ContainerWeight == 0.346) {
                $scope.ad_Item.ContainerSize = "(33 X 33 X 16)";
            } else if ($scope.ad_Item.ContainerWeight == 0.414) {
                $scope.ad_Item.ContainerSize = "(35 X 35 X 23)";
            } else if ($scope.ad_Item.ContainerWeight == 0.500) {
                $scope.ad_Item.ContainerSize = "(35 X 35 X 27)";
            } else {
                $scope.ad_Item.ContainerSize = "";
            }
        }

        $scope.SaveItem = function () {
            if ($scope.DuplicateBarcodeFound) {
                txtItemCode.focus();
                return;
            }

            //var where = "$.FirstAttribute.toLowerCase()=='" + $scope.ad_Item.ItemDescription.toLowerCase() + "' && $.ItemName.toLowerCase()=='" + $scope.ad_Item.ItemName.toLowerCase() + "'";
            //if ($scope.ad_Item.ItemId > 0)
            //    where += " && $.ItemId != " + $scope.ad_Item.ItemId;

            //var itemCombinationExists = Enumerable.From($scope.ItemMainlist).Where($.ItemId != " + $scope.ad_Item.ItemId).FirstOrDefault();
            //if (itemCombinationExists != null || !angular.isUndefined(itemCombinationExists)) {
            //    alertify.log($scope.ad_Item.ItemName + " with Description " + $scope.ad_Item.ItemDescription + " already exists", 'error', '5000');
            //    return;
            //}

            $scope.ad_Item.SubCategoryId = $scope.ddlSubCategory.SubCategoryId;
            $scope.ad_Item.ItemName = $scope.ad_Item.ItemName;
            $scope.ad_Item.UnitId = $scope.ddlItemUnit.ItemUnitId;
            if ($scope.ddlItemPackage == undefined) {
                $scope.ad_Item.PackageId = 0;
            }
            else {
                $scope.ad_Item.PackageId = $scope.ddlItemPackage.ItemUnitId;
            }
            // console.log('Container: '+$scope.ddlItemContainer);
            //if (angular.isUndefined($scope.ddlItemContainer.ItemUnitId)) {
            //    $scope.ddlItemContainer.ItemUnitId = 0;
            //}
            if ($scope.ddlItemContainer == undefined) {
                $scope.ad_Item.ContainerId = 0;
            }
            else {
                $scope.ad_Item.ContainerId = $scope.ddlItemContainer.ItemUnitId;
            }

            // console.log($scope.ddlItemContainer.ItemUnitId);
            //$scope.ad_Item.ContainerId = $scope.ddlItemContainer.ItemUnitId;
            //console.log($scope.ad_Item.ContainerId);

            $scope.ad_Item.CreatorId = $scope.UserId;
            $scope.ad_Item.UpdatorId = $scope.UserId;
            //console.log($scope.ad_Item);
            var parms = JSON.stringify({ item: $scope.ad_Item, itemVat: $scope.ad_ItemVat });

            var type = $scope.ad_Item.ItemId == 0 ? "Saved" : "Updated";

            $http.post("/Item/SaveNew", parms).success(function (data) {
                if (data > 0) {
                    alertify.log("Product " + type + " Successfully", "success", "5000");

                    Clear();
                    $scope.itemEntryTwoForm.$setPristine();
                    $scope.itemEntryTwoForm.$setUntouched();
                    //$scope.CategoryChange();
                    $("#cmbCategory").focus();
                    window.scroll(0, 0);
                } else {
                    alertify.log("Server Errors!", "error", "5000");
                }
            }).error(function (data) {
                alertify.log("Server Errors!", "error", "5000");
            });
        };

        $scope.itemVatAll = function (itemId) {
            $http({
                url: "/Item/GetItemVatById?ItemId=" + itemId,
                method: "GET",
                headers: { 'Content-Type': "application/json" }
            }).success(function (data) {
                //angular.forEach(data, function (aData) {
                //    $scope.ad_ItemVat.Sd = aData.Sd;
                //    $scope.ad_ItemVat.Vat = aData.Vat;
                //    $scope.ad_ItemVat.ItemId = aData.ItemId;
                //    $scope.ad_ItemVat.ItemVatId = aData.ItemVatId;

                //    $scope.IsChecked = true;
                //});
                $scope.ad_ItemVat = data[0];
                $scope.IsChecked = true;
                //console.log("$scope.ad_ItemVat", $scope.ad_ItemVat);
            })
        }

        $scope.SelItem = function (item) {
            $scope.btnSaveItem = "Update";
            $scope.ad_Item = item;
            //console.log($scope.ad_Item);
            $scope.ddlCategory = { "CategoryId": item.CategoryId };
            $scope.ddlSubCategory = { "SubCategoryId": item.SubCategoryId };
            $scope.ddlHsCode = { "HsCodeId": item.HsCodeId };

            var objUnit = Enumerable.From($scope.ItemUnitlist).Where("$.ItemUnitId ==" + item.UnitId).FirstOrDefault();
            $scope.ddlItemUnit = objUnit;

            var objPackage = Enumerable.From($scope.ItemUnitlist).Where("$.ItemUnitId ==" + item.PackageId)
                .FirstOrDefault();
            $scope.ddlItemPackage = objPackage;

            var objContainer = Enumerable.From($scope.ItemUnitlist).Where("$.ItemUnitId ==" + item.ContainerId)
                .FirstOrDefault();
            $scope.ddlItemContainer = objContainer;


            //$scope.ddlItemContainer = { "ItemUnitId": item.ContainerId };

            //$scope.lblUnitPerPackage = $('#ddlItemUnit').text() + ' Per ' + $('#ddlItemPackage').text();

            $window.scrollTo(0, 0);
        };

        $scope.ResetForm = function () {
            Clear();
            $scope.IsChecked = false;
            $scope.CategoryChange();
            $("#cmbCategory").focus();
        };

        $scope.reloadBtn = function () {
            $('#textItemCodeAndDescription').val('');
            $scope.ItemCodeAndDescription = null;
            GetItemPaged(1);
        }

        $scope.ItemSearch = function () {
            GetItemPaged(1);

        } 

        function GetItemPaged(curPage) {

            if (curPage == null) curPage = 1;
            var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;

            var SearchCriteria = "";
            if ($scope.ItemCodeAndDescription != undefined && $scope.ItemCodeAndDescription != "") {
                SearchCriteria = "I.[ItemCode] LIKE '%" + $scope.ItemCodeAndDescription + "%' OR I.[ItemDescription] LIKE '%" + $scope.ItemCodeAndDescription + "%'";
                //alert("Name, Date Success!!!!!");
            }
           // console.log(SearchCriteria);
            $http({
                url: "/Item/GetItemSearchResultPaged?StartRecordNo=" +
                    StartRecordNo +
                    "&RowPerPage=" +
                    $scope.PerPage +
                    "&whClause=" +
                    encodeURIComponent(SearchCriteria) +
                    "&rows=" +
                    0,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {

                if (data.ListData.length > 0) {
                    

                }
                else {
                    alertify.log('Commercial Invoice  Not Found', 'error', '5000');
                }
                $scope.ItemSearchResultList = data.ListData;
                $scope.total_count = data.TotalRecord;


            });
        }

        $scope.getData = function (curPage) {

            // if ($scope.FromDate == "" || $scope.ToDate == "" ) {

            if ($scope.PerPage > 100) {
                $scope.PerPage = 100;
                $scope.currentPage = curPage;
                GetItemPaged($scope.currentPage);
                alertify.log('Maximum record  per page is 100', 'error', '5000');
            }
            else if ($scope.PerPage < 1) {
                $scope.PerPage = 1;
                $scope.currentPage = curPage;
                GetItemPaged($scope.currentPage);
                alertify.log('Minimum record  per page is 1', 'error', '5000');
            }
            else {
                $scope.currentPage = curPage;
                GetItemPaged($scope.currentPage);
            }
            //  }


        }
    });