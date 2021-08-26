app.controller("PriceTypeEntryController", function ($scope, $cookieStore, $http, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('PriceTypeScreenId');
    Clear();
    function Clear() {
        $scope.ScreenLockInfo = [];
        //ScreenLock();
        $scope.pricetypeentrylist = [];
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.found = false;
        $scope.ad_PriceType = {};
        $scope.ad_PriceType.PriceTypeId = 0;
        $scope.ad_PriceType.IsActive = true;
        $scope.button = "Save";
        $scope.btnDeleteShow = false;
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        GetUsersPermissionDetails();
        GetPriceTypePaged($scope.currentPage);
    }
    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('PriceTypeScreenId');
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
    function GetPriceTypePaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/PriceType/GetPriceTypePaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.pricetypeentrylist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }
    function SavePriceType(Status) {
        var parms = JSON.stringify({ price: $scope.ad_PriceType });
        $http.post('/PriceType/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Price Type ' + Status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.priceTypeEntryForm.$setPristine();
                $scope.priceTypeEntryForm.$setUntouched();
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
            GetPriceTypePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetPriceTypePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetPriceTypePaged($scope.currentPage);
        }
    };
    $scope.AddPriceType = function () {
        if ($scope.found) {
            $('#txtPriceTypeName').focus();
        }
        else if ($scope.ad_PriceType.IsDefault && !$scope.ad_PriceType.IsActive) {
            alertify.log('Default Price Type cannot be Inactive', 'error', '5000');
        }
        else {
            $scope.ad_PriceType.CreatorId = $scope.UserId;
            $scope.ad_PriceType.UpdatorId = $scope.UserId;
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_PriceType.PriceTypeId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SavePriceType('Saved');
                        }
                    })
                }
                else if ($scope.ad_PriceType.PriceTypeId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_PriceType.PriceTypeId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SavePriceType('Updated');
                        }
                    })
                }
                else if ($scope.ad_PriceType.PriceTypeId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_PriceType.PriceTypeId == 0 && $scope.CreatePermission) {
                    SavePriceType('Saved');
                }
                else if ($scope.ad_PriceType.PriceTypeId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_PriceType.PriceTypeId > 0 && $scope.RevisePermission) {
                    SavePriceType('Updated');
                }
                else if ($scope.ad_PriceType.PriceTypeId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    }
    $scope.SelPriceType = function (price) {
        $scope.ad_PriceType = price;
        if (price.IsActive) {
            $scope.ad_PriceType.IsActive = true;
        }
        $scope.button = "Update";
        $scope.btnDeleteShow = false;
        $window.scrollTo(0, 0);
    }
    $scope.CheckDuplicatePriceTypeName = function () {
        var criteria = ' PriceTypeName=\'' + $scope.ad_PriceType.PriceTypeName + '\'';
        if ($scope.ad_PriceType.PriceTypeId != 0) {
            criteria += ' AND PriceTypeId<>' + $scope.ad_PriceType.PriceTypeId;
        }

        $http({
            url: '/PriceType/GetPriceTypeDynamic?searchCriteria=' + criteria + '&orderBy=PriceTypeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_PriceType.PriceTypeName + ' already exists!', 'already', '5000');
                $('#txtPriceTypeName').focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    };
    $scope.foundChange = function () {
        $scope.found = true;
    };
    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ priceId: $scope.ad_PriceType.PriceTypeId });
                $http.post('/PriceType/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Price Type Deleted Successfully!', 'success', '5000');
                        Clear();
                        $scope.priceTypeEntryForm.$setPristine();
                        $scope.priceTypeEntryForm.$setUntouched();
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
        $scope.priceTypeEntryForm.$setPristine();
        $scope.priceTypeEntryForm.$setUntouched();
    };
});