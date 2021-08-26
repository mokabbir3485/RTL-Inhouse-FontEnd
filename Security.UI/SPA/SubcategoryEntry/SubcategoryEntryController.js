app.controller("SubcategoryEntryController", function ($scope, $cookieStore, $http, $window) {
    //For Screen lock
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('SubcategoryScreenId');
    Clear();
    function Clear() {
        $scope.ScreenLockInfo = [];
        //ScreenLock();
        $scope.Categorylist = [];
        $scope.AssetNaturelist = [];
        $scope.SubCategoryTypelist = [];
        $scope.SubcategoryList = [];
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.found = false;
        $scope.foundShortName = false;
        $scope.ad_ItemSubCategory = {};
        $scope.ad_ItemSubCategory.SubCategoryId = 0;
        $scope.btnSave = "Save";
        $scope.btnDeleteShow = false;
        ddlCategory.focus();
        $scope.ad_ItemSubCategory.IsActive = true;
        GetAllCategory();
        GetAllActiveInActiveCategory();
        GetAllAssetNature();
        GetAllSubCategoryType();
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        GetUsersPermissionDetails();
        $scope.ddlCategory = null;
        $scope.ddlAssetNature = null;
        $scope.ddlSubcategoryType = null;
        GetSubcategoryPaged($scope.currentPage);
    }

    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('SubcategoryScreenId');
        $http({
            url: '/Permission/GetUsersPermissionDetails?searchCriteria=' + searchCriteria + '&orderBy=PermissionDetailId',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.PermissionDetails = data;
            angular.forEach($scope.PermissionDetails, function (aPermissionDetails) {
                if (aPermissionDetails.FunctionName == 'Create') {
                    $scope.CreatePermission = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Revise') {
                    $scope.RevisePermission = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Remove') {
                    $scope.RemovePermission = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'ListView') {
                    $scope.ListViewPermission = aPermissionDetails.CanExecute;
                }
            });
        });
    }
    function ScreenLock() {
        $http({
            url: '/Permission/CheckScreenLock',
            method: 'GET',
            params: { userId: $scope.UserId, screenId: $scope.ScreenId },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data != '') {
                $scope.ScreenLockInfo = data;
                alertify.alert('This page is locked by ' + $scope.ScreenLockInfo[0].Username);
                window.location = '/Home/Index#/Home';
            }
            else {
                $scope.s_ScreenLock = new Object();
                $scope.s_ScreenLock.UserId = $scope.UserId;
                $scope.s_ScreenLock.ScreenId = $scope.ScreenId;
                var parms = JSON.stringify({ screenLock: $scope.s_ScreenLock });
                $http.post('/Permission/CreateScreenLock', parms).success(function (data) {
                });
            }
        });
    }
    function GetConfirmationMessageForAdmin() {
        $http({
            url: '/Role/GetConfirmationMessageForAdmin',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ConfirmationMessageForAdmin = (data === 'true');
        });
    }
    $scope.GetCropTypeSearch = function () {
        GetSubcategoryPaged(1);
    }
    function GetSubcategoryPaged(curPage) {
        var SearchCriteria = "1=1";
        if ($scope.SearchCropTypeName != null && $scope.SearchCropTypeName != '' && $scope.SearchCropTypeName != undefined) {
            SearchCriteria += " AND ISC.SubCategoryName LIKE '" + $scope.SearchCropTypeName + "%'";
        }
        if ($scope.ddlSearchCrop != null && $scope.ddlSearchCrop != '' && $scope.ddlSearchCrop != undefined) {
            SearchCriteria += " AND ISC.CategoryId = " + $scope.ddlSearchCrop.CategoryId;
        }
        if ($scope.ddlSearchStatus != null && $scope.ddlSearchStatus != '' && $scope.ddlSearchStatus != undefined) {
            SearchCriteria += " AND ISC.IsActive = " + $scope.ddlSearchStatus;
        }

        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/Subcategory/GetSubcategoryPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&SearchCr=' + SearchCriteria + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.SubcategoryList = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }
    function GetAllCategory() {
        $http({
            url: '/Category/GetAllCategory',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Categorylist = data;
        });
    }

    function GetAllActiveInActiveCategory() {
        var criteria = '1=1';
        $http({
            url: '/Category/GetCategoryDynamic?searchCriteria=' + criteria + '&orderBy=CategoryName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AllActiveInActiveCategory = data;
        });
    }

    function GetAllAssetNature() {
        $http({
            url: '/Subcategory/GetAllAssetNature',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AssetNaturelist = data;
            $scope.ddlAssetNature = { AssetNatureId: data[1].AssetNatureId };
            $scope.ad_ItemSubCategory.AssetNatureId = data[1].AssetNatureId;
        });
    }
    function GetAllSubCategoryType() {
        $http({
            url: '/Subcategory/GetAllSubCategoryType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.SubCategoryTypelist = data;
        });
    }
    function SaveSubCategory(Status) {
        var parms = JSON.stringify({ subcategory: $scope.ad_ItemSubCategory });
        $http.post('/Subcategory/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Subcategory ' + Status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.subcategoryEntryForm.$setPristine();
                $scope.subcategoryEntryForm.$setUntouched();
                $('#txtSubcategoryName').focus();
            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetSubcategoryPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetSubcategoryPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetSubcategoryPaged($scope.currentPage);
        }
    }
    $scope.CheckDuplicateSubcateroryName = function () {
        var criteria = " CategoryId=" + $scope.ad_ItemSubCategory.CategoryId + " AND SubCategoryName='" + $scope.ad_ItemSubCategory.SubCategoryName + "'";
        if ($scope.ad_ItemSubCategory.SubCategoryId > 0) {
            criteria += " AND SubCategoryId<>" + $scope.ad_ItemSubCategory.SubCategoryId;
        }

        $http({
            url: '/Subcategory/GetSubcategoryDynamic?searchCriteria=' + criteria + '&orderBy=SubCategoryName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_ItemSubCategory.SubCategoryName + ' already exists!', 'already', '5000');
                $('#txtSubcategoryName').focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    }
    $scope.CheckDuplicateSubShortName = function () {
        if ($scope.ad_ItemSubCategory.SubShortName != undefined && $scope.ad_ItemSubCategory.SubShortName != '' && $scope.ad_ItemSubCategory.SubShortName != null) {
            var criteria = " CategoryId=" + $scope.ad_ItemSubCategory.CategoryId + " AND SubShortName='" + $scope.ad_ItemSubCategory.SubShortName + "'";
            if ($scope.ad_ItemSubCategory.SubCategoryId > 0) {
                criteria += " AND SubCategoryId<>" + $scope.ad_ItemSubCategory.SubCategoryId;
            }
            $http({
                url: '/Subcategory/GetSubcategoryDynamic?searchCriteria=' + criteria + '&orderBy=SubShortName',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                if (data.length > 0) {
                    alertify.log($scope.ad_ItemSubCategory.SubShortName + ' already exists!', 'already', '5000');
                    $('#txtSubcategoryShortName').focus();
                    $scope.foundShortName = true;
                } else {
                    $scope.foundShortName = false;
                }
            });
        }
        else {
            $scope.foundShortName = false;
        }
    }
    $scope.foundChange = function () {
        $scope.found = true;
    }
    $scope.foundChangeShortName = function () {
        $scope.foundShortName = true;
    }
    $scope.AddSubCategory = function () {
        if ($scope.found) {
            $('#txtSubcategoryName').focus();
        }
        else if ($scope.foundShortName) {
            $('#txtSubcategoryShortName').focus();
        }
        else {
            $scope.ad_ItemSubCategory.CreatorId = $scope.UserId;
            $scope.ad_ItemSubCategory.UpdatorId = $scope.UserId;
            $scope.ad_ItemSubCategory.CategoryId = $scope.ddlCategory.CategoryId;
            $scope.ad_ItemSubCategory.AssetNatureId = $scope.ddlAssetNature.AssetNatureId;

            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_ItemSubCategory.SubCategoryId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SaveSubCategory('Saved');
                        }
                    })
                }
                else if ($scope.ad_ItemSubCategory.SubCategoryId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_ItemSubCategory.SubCategoryId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SaveSubCategory('Updated');
                        }
                    })
                }
                else if ($scope.ad_ItemSubCategory.SubCategoryId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }

            }
            else {
                if ($scope.ad_ItemSubCategory.SubCategoryId == 0 && $scope.CreatePermission) {
                    SaveSubCategory('Saved');
                }
                else if ($scope.ad_ItemSubCategory.SubCategoryId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_ItemSubCategory.SubCategoryId > 0 && $scope.RevisePermission) {
                    SaveSubCategory('Update');
                }
                else if ($scope.ad_ItemSubCategory.SubCategoryId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    }
    $scope.SelSubCategory = function (subcategory) {
        $scope.ad_ItemSubCategory = subcategory;
        $scope.btnSave = "Update";
        $scope.btnDeleteShow = false;
        $scope.ddlCategory = { "CategoryId": subcategory.CategoryId };
        $scope.ddlSubcategoryType = { "SubCategoryTypeId": subcategory.SubCategoryTypeId };
        $scope.ddlAssetNature = { "AssetNatureId": subcategory.AssetNatureId };
    }
    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ subcategoryId: $scope.ad_ItemSubCategory.SubCategoryId });
                $http.post('/Subcategory/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Subcategory Deleted Successfully!', 'success', '5000');
                        Clear();
                        $scope.subcategoryEntryForm.$setPristine();
                        $scope.subcategoryEntryForm.$setUntouched();
                    } else {
                        alertify.log('Delete Failed!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '5000');
                });
            }
        });
    }
    $scope.resetForm = function () {
        Clear();
        $scope.subcategoryEntryForm.$setPristine();
        $scope.subcategoryEntryForm.$setUntouched();
    }
});