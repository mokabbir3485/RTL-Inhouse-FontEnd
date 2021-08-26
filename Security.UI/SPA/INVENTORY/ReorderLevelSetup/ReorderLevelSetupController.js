app.controller("ReorderLevelSetupController", function ($scope, $cookieStore, $http, $httpParamSerializer) {
    $scope.ReorderLevelList = [];
    $scope.Storelist = [];
    $scope.CategoryList = [];
    $scope.SubcategoryList = [];
    $scope.ItemSearchResultList = [];
    $scope.SearchBtnDisable = false;
    $scope.ExportBtnDisable = false;

    $scope.ItemUnitlist = [];
    Clear();

    function GetAllStore() {
        $scope.LoginUser = $cookieStore.get('UserData');
        $http({
            url: '/User/GetUserDepartmentByUserId?userId=' + $scope.LoginUser.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (userOutletList) {
            $scope.Storelist = userOutletList;

            if ($scope.Storelist.length == 1) {
                $scope.ddlStore = { 'DepartmentId': $scope.Storelist[0].DepartmentId };
            }
        });
    }

    function GetAllProduct() {
        var SearchCriteria = '1=1';
        $http({
            url: '/Item/GetItemSearchResult?searchCriteria=' + SearchCriteria,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ItemSearchResultList = angular.copy(data);
        });
    }

    function Clear() {
        $scope.ReorderLevelList = [];
        $scope.ddlStoreDisable = false;
        GetAllStore();
        GetAllCategory();
        GetAllSubCategory();
        GetAllProduct();
        GetAllItemUnit();
        $scope.ddlStore = null;
        $scope.ddlSrcCategory = null;
        $scope.ddlSrcSubategory = null;
        $scope.ddlProduct = null;
        $('#browsFile').val("");
        angular.element("input[type='file']").val("");
    }

    function GetAllCategory() {
        $http({
            url: '/Category/GetAllCategory',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CategoryList = data;
        });
    }

    function GetAllItemUnit() {
        $http({
            url: '/Unit/GetAllUnit',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            //Delete unuse property 
            data.forEach(function (aData) {
                delete aData.CreatorId;
                delete aData.CreateDate;
                delete aData.UpdatorId;
                delete aData.UpdateDate;
            });
            $scope.ItemUnitlist = data;
        });
    }

    function GetAllSubCategory() {
        $http({
            url: '/Subcategory/GetAllSubategory',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.SubcategoryList = data;
        });
    }

    $scope.$watch('ReorderLevelList', function (newValue, oldValue) {
        if (newValue !== oldValue) {
            if ($scope.ReorderLevelList.length > 0) {
                $scope.ExportBtnDisable = true;
            } else {
                $scope.ExportBtnDisable = false;
            }
        }
    });

    $scope.ClearsorList = function () {
        $scope.ReorderLevelList = [];
    }

    $scope.SelectCategory = function () {
        $scope.ddlProduct = new Object();
        var SearchCriteria = '1=1';
        if ($scope.ddlSrcCategory != null) {
            SearchCriteria += ' AND C.CategoryId=' + $scope.ddlSrcCategory.CategoryId;
        }

        $http({
            url: '/Item/GetItemSearchResult?searchCriteria=' + SearchCriteria,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ItemSearchResultList = data;
        });
    };

    $scope.SelectSubategory = function () {
        $scope.ReorderLevelList = [];
        $scope.ddlProduct = new Object();
        var SearchCriteria = '1=1';
        if ($scope.ddlSrcCategory != null) {
            SearchCriteria += ' AND C.CategoryId=' + $scope.ddlSrcCategory.CategoryId;
        }
        if ($scope.ddlSrcSubategory != null) {
            SearchCriteria += ' AND I.SubCategoryId=' + $scope.ddlSrcSubategory.SubCategoryId;
        }
        $http({
            url: '/Item/GetItemSearchResult?searchCriteria=' + SearchCriteria,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ItemSearchResultList = data;
        });
    };

    $scope.unitFilter = function (RawItem) {
        return function (pram) {
            return (pram.ItemUnitId == RawItem.UnitId) || (pram.ItemUnitId == RawItem.PackageId) || (pram.ItemUnitId == RawItem.ContainerId);
        };
    };

    $scope.SearchReorderlevel = function (depId, categoryId, subcategoryId, itemId) {
        $http({
            url: '/ReorderLevelSetup/SearchReorderlevel?depId=' + depId + '&categoryId=' + categoryId + '&subcategoryId=' + subcategoryId + '&itemId=' + itemId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0 && data != null) {
                $scope.ReorderLevelList = data;
                angular.forEach($scope.ReorderLevelList, function (aReorderLevel) {
                    if (aReorderLevel.ReorderUnitId > 0) {
                        aReorderLevel.ddlUnitReorderlevel = { "ItemUnitId": aReorderLevel.ReorderUnitId };
                    }
                    else {
                        var reorderUnitId = aReorderLevel.ContainerId > 0 ? aReorderLevel.ContainerId : (aReorderLevel.PackageId > 0 ? aReorderLevel.PackageId : aReorderLevel.UnitId);
                        aReorderLevel.ddlUnitReorderlevel = { "ItemUnitId": reorderUnitId };
                        aReorderLevel.ReorderUnitId = reorderUnitId;

                        angular.forEach($scope.ItemUnitlist, function (aUnit) {
                            if (aUnit.ItemUnitId == reorderUnitId) {
                                aReorderLevel.UnitName = aUnit.UnitName;
                            }
                        })
                    }
                });
            }
            else {
                alertify.log('No data found.', 'Error', 5000);
            }
        });
    };

    $scope.exportData = function () {
        var mystyle = {
            headers: true,
            columns: [
                { columnid: 'DepartmentName', width: 100 },
                { columnid: 'CategoryName', width: 100 },
                { columnid: 'SubcategoryName', width: 100 },
                { columnid: 'ItemName', width: 200 },
                { columnid: 'ItemCode', width: 100 },
                { columnid: 'UnitName', width: 100 },
                { columnid: 'MinReorderLevel', width: 100 },
                { columnid: 'MaxReorderLevel', width: 100 },
                { columnid: 'ContainerId', width: 0 },
                { columnid: 'StockQty', width: 0 },
                { columnid: 'Difference', width: 0 },
                { columnid: 'PackageId', width: 0 },
                { columnid: 'UnitId', width: 0 },
                { columnid: 'ReorderLevelId', width: 0 },
                { columnid: 'DepartmentId', width: 0 },
                { columnid: 'ItemId', width: 0 },
                { columnid: 'ReorderUnitId', width: 0 }
            ]
        };
        alasql('SELECT * INTO XLSXML("ReorderLevelData.xls",?) FROM ?', [mystyle, $scope.ReorderLevelList]);
    };

    $scope.AddReorderLevel = function (depId) {
        $scope.ReorderLevelist_save = [];

        angular.forEach($scope.ReorderLevelList, function (aReorderLevel) {
            if (aReorderLevel.MinReorderLevel > 0 && aReorderLevel.ReorderUnitId >= 1) { aReorderLevel.selected = true; } else { aReorderLevel.selected = false; }
            if (aReorderLevel.selected) {
                $scope.ReorderLevelist_save.push({ ReorderLevelId: aReorderLevel.ReorderLevelId, DepartmentId: depId, ItemId: aReorderLevel.ItemId, ReorderUnitId: aReorderLevel.ReorderUnitId, MinReorderLevel: aReorderLevel.MinReorderLevel, MaxReorderLevel: aReorderLevel.MaxReorderLevel, ItemName: aReorderLevel.ItemName, UnitName: aReorderLevel.UnitName });
            }
        });

        //Save
        $.ajax({
            url: "/ReorderLevelSetup/SaveReorderLevel",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({ SaveReorderLevellist: $scope.ReorderLevelist_save }),
            success: function (data) {
                alertify.log('Reorder Level Saved Successfully!', 'success', '5000');
                Clear();
                $scope.reorderLevelSetupForm.$setPristine();
                $scope.reorderLevelSetupForm.$setUntouched();
            }, error: function (msg) {
                alertify.log('Server Save Errors!', 'error', '5000');
            }
        });
    };

    $scope.resetReorderLevelSetupForm = function () {
        Clear();
        $scope.reorderLevelSetupForm.$setPristine();
        $scope.reorderLevelSetupForm.$setUntouched();
    };
});

app.directive("fileread", [function () {
    return {
        link: function ($scope, $elm) {
            $elm.on('change', function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.$apply(function () {
                        var data = evt.target.result;
                        var workbook = XLSX.read(data, { type: 'binary' });
                        $scope.ReorderLevelList = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                        var erroMsg = [];
                        //Excel Header Formate Checking...
                        for (var i = 0; i < 1; i++) {
                            var aReorderLevel = $scope.ReorderLevelList[0]
                            var length = aReorderLevel.length;
                            var check = [];
                            for (ColumnName in aReorderLevel) {
                                if (ColumnName != 'CategoryName' && ColumnName != 'ContainerId' && ColumnName != 'DepartmentId' && ColumnName != 'DepartmentName' && ColumnName != 'Difference' && ColumnName != 'ItemCode' && ColumnName != 'ItemId' && ColumnName != 'ItemName' && ColumnName != 'MaxReorderLevel' && ColumnName != 'MinReorderLevel' && ColumnName != 'PackageId' && ColumnName != 'ReorderLevelId' && ColumnName != 'ReorderUnitId' && ColumnName != 'StockQty' && ColumnName != 'SubcategoryName' && ColumnName != 'UnitId' && ColumnName != 'UnitName') {
                                    erroMsg.push({
                                        msg: "Invalid File Format"
                                    });
                                }
                                else {
                                    if (check.length) {
                                        var mathced = 0;
                                        for (var i = 0; i < check.length; i++) {
                                            if (check[i] == ColumnName) {
                                                mathced += 1;
                                            }
                                        }
                                        if (mathced == 0) {
                                            check.push(ColumnName);
                                        }
                                        else {
                                            erroMsg.push({
                                                msg: "Invalid File Format"
                                            });
                                        }
                                    }
                                    else {
                                        check.push(ColumnName);
                                    }
                                }
                            }
                            if (check.length != 17) {
                                erroMsg.push({
                                    msg: "Invalid File Format"
                                });
                            }
                        }

                        //Excel Row Value Checking...
                        angular.forEach($scope.ReorderLevelList, function (aReorderLevel) {
                            if (!IsNumerics(aReorderLevel.MinReorderLevel)) {
                                aReorderLevel.MinReorderLevel = 0;
                            }
                            if (!IsNumerics(aReorderLevel.MaxReorderLevel)) {
                                aReorderLevel.MaxReorderLevel = 0;
                            }

                            var checked = false;
                            angular.forEach($scope.ItemUnitlist, function (aItemUnit) {
                                if (aReorderLevel.UnitName == aItemUnit.UnitName && aReorderLevel.ReorderUnitId == aItemUnit.ItemUnitId) {
                                    checked = true;
                                }
                            });

                            if (!checked) {
                                aReorderLevel.ddlUnitReorderlevel = null;
                            }
                            else {
                                aReorderLevel.ddlUnitReorderlevel = { ItemUnitId: aReorderLevel.ReorderUnitId };
                            }

                        });

                        if (erroMsg.length != 0) {
                            alertify.log(erroMsg[0].msg + ' on ' + erroMsg.length + ' Places', 'error', '5000');
                            $scope.ReorderLevelList = [];
                        }
                        else {

                            //angular.forEach($scope.ReorderLevelList, function (aReorderLevel) {
                            //    aReorderLevel.ddlUnitReorderlevel = { "ItemUnitId": aReorderLevel.ReorderUnitId };
                            //})

                            $scope.ddlStore = { DepartmentId: $scope.ReorderLevelList[0].DepartmentId };
                        }
                    });
                };
                reader.readAsBinaryString(changeEvent.target.files[0]);
            });
        }
    }
}]);

