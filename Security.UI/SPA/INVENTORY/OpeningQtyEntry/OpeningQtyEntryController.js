app.controller("OpeningQtyEntryController", function ($scope,$rootScope, $cookieStore, $http, $filter) {

    $scope.CategoryList = [];
    $scope.SubcategoryList = [];
    $scope.DepartmentList = [];
    $scope.OpeningQuantityList = [];
    $scope.StoreList = [];
    $scope.listXsl = [];
    $scope.ItemSearchResultList = [];
    $scope.ItemUnitlist = [];
    $scope.categoryId = 0;
    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $rootScope.saveBtn = 'Save';

    function Clear() {
        GetAllCategory();
        GetAllSubCategory();
        GetAllDepartment();
        GetAllStore();
        GetAllProduct();
        GetAllItemUnit();
        $scope.mySwitch = false;
        $scope.ExportBtnDisable = false;
        $scope.ddlStore = null;
        $scope.txtOpening = null;
        angular.element("input[type='file']").val("");
        $scope.ddlCategory = null;
        $scope.ddlSubCategory = null;
        $scope.ddlProduct = null;
        $scope.OpeningQuantityList = [];
        $('#fileName').val('');
        $scope.saveBtn = 'Save';

    }

    Clear();

    function GetAllCategory() {
        $http({
            url: '/Category/GetAllCategory',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CategoryList = data;
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

    function GetAllDepartment() {
        $http({
            url: '/Department/GetAllDepartment',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DepartmentList = data;
        });
    }

    function GetAllStore() {
        $scope.LoginUser = $cookieStore.get('UserData');
        $http({
            url: '/User/GetUserDepartmentByUserId?userId=' + $scope.LoginUser.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (userOutletList) {
            $scope.StoreList = userOutletList;
        });
        //$http({
        //    url: '/Department/GetAllStore',
        //    method: 'GET',
        //    headers: { 'Content-Type': 'application/json' }
        //}).success(function (data) {
        //    $scope.StoreList = data;
        //});
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

    //function ChkeckQuantityValidation(alistXsl) {
    //    ((alistXsl.OpeningUnitQuantity > 0) && (alistXsl.OpeningPackageQuantity > 0) && (alistXsl.OpeningContainerQuantity > 0) && (alistXsl.OpeningValue>0)) ? alistXsl.selected = true : alistXsl.selected = false;
    //}

    $scope.AddOpeningQty = function (depId) {
        $scope.OpeningQtylist_save = [];
        $scope.OpeningQtylist_update = [];
        angular.forEach($scope.OpeningQuantityList, function (aOpeningQty) {
            if ((aOpeningQty.OpeningUnitQuantity > 0 || aOpeningQty.OpeningPackageQuantity > 0 || aOpeningQty.OpeningContainerQuantity > 0) && aOpeningQty.OpeningValue > 0)
            {
                aOpeningQty.selected = true;
            }
            else {
                aOpeningQty.selected = false;
            }
            if (aOpeningQty.selected) {                
                if (aOpeningQty.OpeningQtyId > 0) {
                    $scope.OpeningQtylist_update.push({
                        OpeningQtyId: aOpeningQty.OpeningQtyId, DepartmentId: depId, ItemId: aOpeningQty.ItemId, OpeningUnitId: aOpeningQty.OpeningUnitId, OpeningUnitQuantity: aOpeningQty.OpeningUnitQuantity, OpeningPackageId: aOpeningQty.OpeningPackageId, OpeningPackageQuantity: aOpeningQty.OpeningPackageQuantity, OpeningContainerId: aOpeningQty.OpeningContainerId, OpeningContainerQuantity: aOpeningQty.OpeningContainerQuantity,
                        OpeningValue: aOpeningQty.OpeningValue, CreatorId: aOpeningQty.CreatorId, CreateDate: '2016-2-2', UpdatorId: aOpeningQty.UpdatorId, UpdateDate: '2016-2-2', DepartmentName: aOpeningQty.DepartmentName, ItemName: aOpeningQty.ItemName, OpeningUnitName: aOpeningQty.OpeningUnitName, OpeningPackageName: aOpeningQty.OpeningPackageName, OpeningContainerName: aOpeningQty.OpeningContainerName
                    });

                }
                else {
                    $scope.OpeningQtylist_save.push({
                        OpeningQtyId: aOpeningQty.OpeningQtyId, DepartmentId: depId, ItemId: aOpeningQty.ItemId, OpeningUnitId: aOpeningQty.OpeningUnitId, OpeningUnitQuantity: aOpeningQty.OpeningUnitQuantity, OpeningPackageId: aOpeningQty.OpeningPackageId, OpeningPackageQuantity: aOpeningQty.OpeningPackageQuantity, OpeningContainerId: aOpeningQty.OpeningContainerId, OpeningContainerQuantity: aOpeningQty.OpeningContainerQuantity,
                        OpeningValue: aOpeningQty.OpeningValue, CreatorId: aOpeningQty.CreatorId, CreateDate: '2016-2-2', UpdatorId: aOpeningQty.UpdatorId, UpdateDate: '2016-2-2', DepartmentName: aOpeningQty.DepartmentName, ItemName: aOpeningQty.ItemName, OpeningUnitName: aOpeningQty.OpeningUnitName, OpeningPackageName: aOpeningQty.OpeningPackageName, OpeningContainerName: aOpeningQty.OpeningContainerName
                    });
                }
            }
        });

        if ($scope.saveBtn == 'Save') {
            if ($scope.OpeningQtylist_save.length > 0) {
                var parms2 = JSON.stringify({ SaveOpeningQtylist: $scope.OpeningQtylist_save });
                $http.post('/OpeningQty/SaveOpeningQty', parms2).success(function (data) {
                    alertify.log($scope.OpeningQtylist_save.length + ' Item Save Successfully!', 'success', '5000');
                    Clear();
                    $scope.OpeningQtyEntryForm.$setPristine();
                    $scope.OpeningQtyEntryForm.$setUntouched();
                }).error(function (data) {
                    alertify.log('Server Save Errors!', 'error', '5000');
                });
            }
            else {
                alertify.log('Save failed.', 'error', '5000');
            }
        }
        else {
            if ($scope.OpeningQtylist_update.length > 0) {
                var parms = JSON.stringify({ UpdateOpeningQtylist: $scope.OpeningQtylist_update });
                $http.post('/OpeningQty/UpdateOpeningQty', parms).success(function (data) {
                    alertify.log($scope.OpeningQtylist_update.length + ' Item Upadte Successfully!', 'success', '50000');
                    Clear();
                    $scope.OpeningQtyEntryForm.$setPristine();
                    $scope.OpeningQtyEntryForm.$setUntouched();
                }).error(function (data) {
                    alertify.log('Server Update Errors!', 'error', '5000');
                });
            }
            else {
                alertify.log('Update failed.', 'error', '5000');
            }
        }

        //Save
        
    };

    $scope.OpeningDate = function (id) {

        angular.forEach($scope.StoreList, function (str) {
            if (str.DepartmentId == id) {
                var res = str.OpeningDate.substring(0, 5);
                if (res == "/Date") {
                    var parsedDate = new Date(parseInt(str.OpeningDate.substr(6)));
                    $scope.txtOpening = $filter('date')(parsedDate, 'dd/MM/yyyy');
                }
            }
        })
    }

    $scope.ClearOpenintQtyList = function () {
        $scope.OpeningQuantityList = [];
    }

    $scope.SelectSubategory = function () {
        $scope.ddlProduct = new Object();
        var SearchCriteria = '1=1';
        if ($scope.ddlCategory != null) {
            SearchCriteria += ' AND C.CategoryId=' + $scope.ddlCategory.CategoryId;
        }
        if ($scope.ddlSubCategory != null) {
            SearchCriteria += ' AND I.SubCategoryId=' + $scope.ddlSubCategory.SubCategoryId;
        }
        $http({
            url: '/Item/GetItemSearchResult?searchCriteria=' + SearchCriteria,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ItemSearchResultList = data;
        });
    };

    $scope.SearchOpeningQuantity = function (depId, categoryId, subcategoryId, itemId) {
        //alert(depId + "-" + categoryId + "-" + subcategoryId + "-" + itemId );
        //console.log(depId);
        //LoadReorderDataInTable(depId, categoryId, subcategoryId, itemId);

        $http({
            url: '/OpeningQty/SearchOpeningQuantity?depId=' + depId + '&categoryId=' + categoryId + '&subcategoryId=' + subcategoryId + '&itemId=' + itemId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                $scope.OpeningQuantityList = data;
                $scope.ExportBtnDisable = true;
            }
            else {
                $scope.ExportBtnDisable = false;
                alertify.log('No data found.', 'Error', '5000');
            }
        });
    }

    $scope.exportData = function () {
        var mystyle = {
            headers: true,
            columns: [
                { columnid: 'DepartmentName', width: 100 },
                { columnid: 'CategoryName', width: 100 },
                { columnid: 'SubcategoryName', width: 100 },
                { columnid: 'ItemName', width: 200 },
                { columnid: 'OpeningUnitName', width: 100 },
                { columnid: 'OpeningUnitQuantity', width: 100 },
                { columnid: 'OpeningPackageName', width: 100 },
                { columnid: 'OpeningPackageQuantity', width: 100 },
                { columnid: 'OpeningContainerName', width: 100 },
                { columnid: 'OpeningContainerQuantity', width: 100 },
                { columnid: 'OpeningValue', width: 100 },
                { columnid: 'ItemId', width: 0 },
                { columnid: 'OpeningQtyId', width: 0 },
                { columnid: 'DepartmentId', width: 0 },
                { columnid: 'OpeningUnitId', width: 0 },
                { columnid: 'OpeningPackageId', width: 0 },
                { columnid: 'OpeningContainerId', width: 0 }
            ]
        };
        alasql('SELECT * INTO XLSXML("OpeningQuantity.xls",?) FROM ?', [mystyle, $scope.OpeningQuantityList]);
    };

    //For Screen lock
    //$scope.LoginUser = $cookieStore.get('UserData');
    //$scope.UserId = $scope.LoginUser.UserId;
    //$scope.ScreenId = $cookieStore.get('OpeningQuantityScreenId');
    //$scope.ScreenLockInfo = [];
    //ScreenLock();
    ////Lock Screen by user
    //function ScreenLock() {
    //    $http({
    //        url: '/Permission/CheckScreenLock',
    //        method: 'GET',
    //        params: { userId: $scope.UserId, screenId: $scope.ScreenId },
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (data) {
    //        if (data != '') {
    //            $scope.ScreenLockInfo = data;
    //            alertify.alert('This page is locked by ' + $scope.ScreenLockInfo[0].Username);
    //            window.location = '/Home/Index#/Home';
    //        }
    //        else {
    //            $scope.s_ScreenLock = new Object();
    //            $scope.s_ScreenLock.UserId = $scope.UserId;
    //            $scope.s_ScreenLock.ScreenId = $scope.ScreenId;
    //            var parms = JSON.stringify({ screenLock: $scope.s_ScreenLock });
    //            $http.post('/Permission/CreateScreenLock', parms).success(function (data) {
    //            });
    //        }
    //    });
    //}

    $scope.resetForm = function () {
        Clear();
        $scope.OpeningQtyEntryForm.$setPristine();
        $scope.OpeningQtyEntryForm.$setUntouched();
        $scope.OpeningQuantityList.length = 0;
    };

    $scope.RowSelect = function (alistXsl) {
        if (alistXsl.OpeningUnitId > 0 && alistXsl.OpeningPackageId == 0 && alistXsl.OpeningContainerId == 0
            && (alistXsl.OpeningUnitQuantity <= 0 || alistXsl.OpeningUnitQuantity == null
            || alistXsl.OpeningValue <= 0 || alistXsl.OpeningValue == null)) {

            alistXsl.selected = false;
        }
        else if (alistXsl.OpeningUnitId > 0 && alistXsl.OpeningPackageId > 0 && alistXsl.OpeningContainerId == 0
            && (alistXsl.OpeningUnitQuantity == null || alistXsl.OpeningPackageQuantity == null
            || alistXsl.OpeningValue <= 0 || alistXsl.OpeningValue == null
            || (alistXsl.OpeningUnitQuantity + alistXsl.OpeningPackageQuantity) <= 0)) {

            alistXsl.selected = false;
        }
        else if (alistXsl.OpeningUnitId > 0 && alistXsl.OpeningPackageId > 0 && alistXsl.OpeningContainerId > 0
            && (alistXsl.OpeningUnitQuantity == null
            || alistXsl.OpeningPackageQuantity == null
            || alistXsl.OpeningContainerQuantity == null
            || alistXsl.OpeningValue <= 0 || alistXsl.OpeningValue == null
            || (alistXsl.OpeningUnitQuantity + alistXsl.OpeningPackageQuantity + alistXsl.OpeningContainerQuantity) <= 0)) {

            alistXsl.selected = false;
        }
        else {
            alistXsl.selected = true;
        }
    }
});
//excel file read
//app.directive("fileread", [function () {
//    return {
//        scope: false,
//        link: function ($scope, $elm, $attrs, mod) {
//            $elm.on('change', function (changeEvent) {
//                var reader = new FileReader();
//                reader.onload = function (evt) {
//                    $scope.$apply(function () {
//                        var data = evt.target.result;
//                        var workbook = XLSX.read(data, { type: 'binary' });
//                        var headerNames = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], { header: 1 })[0];
//                        var data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
//                        $scope.listXsl = data;
//                        console.log(data);
//                        $elm.val(null);
//                    });
//                };
//                reader.readAsBinaryString(changeEvent.target.files[0]);
//            });
//        }
//    }
//}]);

app.directive("openingqtyfileread", [function () {
    return {
        link: function ($scope, $elm ) {
            $elm.on('change', function (changeEvent) {
                $scope.saveBtn = 'Update';
                var reader = new FileReader();
                reader.onload = function (evt) {
                    $scope.$apply(function () {
                        var data = evt.target.result;
                        var workbook = XLSX.read(data, { type: 'binary' });
                        $scope.OpeningQuantityList = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
                        var erroMsg = [];
                        //Excel Header Formate Checking...
                        for (var i = 0; i < 1; i++) {
                            var aOpeningQuantity = $scope.OpeningQuantityList[0]
                            //var length = aOpeningQuantity.length;
                            var check = [];
                            for (ColumnName in aOpeningQuantity) {
                                if (ColumnName != 'CategoryName' && ColumnName != 'DepartmentId' && ColumnName != 'DepartmentName' && ColumnName != 'ItemId'
                                    && ColumnName != 'ItemName' && ColumnName != 'OpeningContainerId' && ColumnName != 'OpeningContainerName' && ColumnName != 'OpeningContainerQuantity'
                                    && ColumnName != 'OpeningPackageId' && ColumnName != 'OpeningPackageName' && ColumnName != 'OpeningPackageQuantity'
                                    && ColumnName != 'OpeningQtyId' && ColumnName != 'OpeningUnitId' && ColumnName != 'OpeningUnitName' && ColumnName != 'OpeningUnitQuantity'
                                    && ColumnName != 'OpeningValue' && ColumnName != 'SubcategoryName') {
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
                        angular.forEach($scope.OpeningQuantityList, function (aOpeningQuantity) {
                            if (!IsNumerics(aOpeningQuantity.OpeningUnitQuantity)) {
                                aOpeningQuantity.OpeningUnitQuantity = 0;
                            }
                            if (!IsNumerics(aOpeningQuantity.OpeningPackageQuantity)) {
                                aOpeningQuantity.OpeningPackageQuantity = 0;
                            }
                            if (!IsNumerics(aOpeningQuantity.OpeningContainerQuantity)) {
                                aOpeningQuantity.OpeningContainerQuantity = 0;
                            }
                            if (!IsNumerics(aOpeningQuantity.OpeningValue)) {
                                aOpeningQuantity.OpeningValue = 0;
                            }
                        });

                        if (erroMsg.length != 0) {
                            alertify.log(erroMsg[0].msg + ' on ' + erroMsg.length + ' Places', 'error', '5000');
                            $scope.OpeningQuantityList = [];
                        }
                        else {
                            $scope.ddlStore = { DepartmentId: $scope.OpeningQuantityList[0].DepartmentId };
                            $scope.OpeningDate($scope.ddlStore.DepartmentId);
                        }
                    });
                };
                reader.readAsBinaryString(changeEvent.target.files[0]);
            });

        }
    }
}]);