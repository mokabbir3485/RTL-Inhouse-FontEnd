app.controller("CategoryEntryController", function ($scope, $cookieStore, $http, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('CategoryScreenId');
    Clear();
    function Clear() {
        $scope.ScreenLockInfo = [];
        //ScreenLock();
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.categorylist = [];
        $scope.found = false;
        $scope.foundShortName = false;
        $scope.ad_ItemCategory = {};
        $scope.ad_ItemCategory.CategoryId = 0;
        $scope.ad_ItemCategory.IsActive = true;
        $scope.button = "Save";
        $scope.btnDeleleShow = false;
        //$('#txtCategoryName').focus();
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        GetUsersPermissionDetails();
        GetCategoryPaged($scope.currentPage);
    }
    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('CategoryScreenId');
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
    $scope.GetCropSearch = function () {
        GetCategoryPaged(1);
    }

    function GetCategoryPaged(curPage) {
        var SearchCriteria = "1=1";
        if ($scope.SearchCropName != null && $scope.SearchCropName != '' && $scope.SearchCropName != undefined) {
            SearchCriteria += " AND CategoryName LIKE '%" + $scope.SearchCropName + "%'";
        }
        if ($scope.ddlSearchStatus != null && $scope.ddlSearchStatus != '' && $scope.ddlSearchStatus != undefined) {
            SearchCriteria += " AND IsActive = " + $scope.ddlSearchStatus;
        }

        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/Category/GetCategoryPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&SearchCr=' + SearchCriteria + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.categorylist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }
    function SaveCategory(Status) {
        var parms = JSON.stringify({ category: $scope.ad_ItemCategory });
        $http.post('/Category/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Category ' + Status + ' Successfully!', 'success', '5000');
                Clear();
                $('#txtCategoryName').focus();
                $scope.categoryEntryForm.$setPristine();
                $scope.categoryEntryForm.$setUntouched();
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
            GetCategoryPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetCategoryPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetCategoryPaged($scope.currentPage);
        }
    };
    $scope.CheckDuplicateCategoryName = function () {
        var criteria = '1=1';
        if ($scope.ad_ItemCategory.CategoryId == 0) {
            criteria += ' AND CategoryName=\'' + $scope.ad_ItemCategory.CategoryName + '\'';
        }
        else {
            criteria += ' AND CategoryName=\'' + $scope.ad_ItemCategory.CategoryName + '\' AND CategoryId<>' + $scope.ad_ItemCategory.CategoryId;
        }
        $http({
            url: '/Category/GetCategoryDynamic?searchCriteria=' + criteria + '&orderBy=CategoryName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_ItemCategory.CategoryName + ' already exists!', 'already', '5000');
                $('#txtCategoryName').focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    };
    $scope.CheckDuplicateShortName = function () {
        if ($scope.ad_ItemCategory.ShortName != undefined && $scope.ad_ItemCategory.ShortName != '' && $scope.ad_ItemCategory.ShortName != null) {
            var criteria = '1=1';
            if ($scope.ad_ItemCategory.CategoryId == 0) {
                criteria += ' AND ShortName=\'' + $scope.ad_ItemCategory.ShortName + '\'';
            }
            else {
                criteria += ' AND ShortName=\'' + $scope.ad_ItemCategory.ShortName + '\' AND CategoryId<>' + $scope.ad_ItemCategory.CategoryId;
            }
            $http({
                url: '/Category/GetCategoryDynamic?searchCriteria=' + criteria + '&orderBy=ShortName',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                if (data.length > 0) {
                    alertify.log($scope.ad_ItemCategory.ShortName + ' already exists!', 'already', '5000');
                    $('#txtShortName').focus();
                    $scope.foundShortName = true;
                } else {
                    $scope.foundShortName = false;
                }
            });
        }
        else {
            $scope.foundShortName = false;
        }
    };
    $scope.foundChange = function () {
        $scope.found = true;
    };
    $scope.foundChangeShortName = function () {
        $scope.foundShortName = true;
    };
    $scope.AddCategory = function() {
        if ($scope.found) {
            $('#txtCategoryName').focus();
        }
        else if ($scope.foundShortName) {
            $('#txtShortName').focus();
        }
        else {
            $scope.ad_ItemCategory.CreatorId = $scope.UserId;
            $scope.ad_ItemCategory.UpdatorId = $scope.UserId;
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_ItemCategory.CategoryId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SaveCategory('Saved');
                        }
                    })
                }
                else if ($scope.ad_ItemCategory.CategoryId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_ItemCategory.CategoryId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SaveCategory('Updated');
                        }
                    })
                }
                else if ($scope.ad_ItemCategory.CategoryId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_ItemCategory.CategoryId == 0 && $scope.CreatePermission) {
                    SaveCategory('Saved');
                }
                else if ($scope.ad_ItemCategory.CategoryId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_ItemCategory.CategoryId > 0 && $scope.RevisePermission) {
                    SaveCategory('Updated');
                }
                else if ($scope.ad_ItemCategory.CategoryId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    };
    $scope.SelCategory = function (category) {
        $scope.ad_ItemCategory = category;
        $scope.button = "Update";
        $scope.btnDeleleShow = false;
    }
    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ categoryId: $scope.ad_ItemCategory.CategoryId });
                $http.post('/Category/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Category Deleted Successfully!', 'success', '5000');
                        Clear();
                        $scope.categoryEntryForm.$setPristine();
                        $scope.categoryEntryForm.$setUntouched();
                    } else {
                        alertify.log('Delete Failed!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '5000');
                });
            }
        });
    };
    $scope.resetForm = function () {
        Clear();
        $scope.categoryEntryForm.$setPristine();
        $scope.categoryEntryForm.$setUntouched();
    };
});