app.controller("DeclarationTypeEntryController", function ($scope, $cookieStore, $route, $http, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('StockDeclarationTypeScreenId');
    Clear();
    function Clear() {
        $scope.DeclarationTypelist = [];
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.found = false;
        $scope.ad_StockDeclarationType = {};
        $scope.ad_StockDeclarationType.DeclarationTypeId = 0;
        $scope.ad_StockDeclarationType.IsActive = true;
        $scope.ddlAddOrDeduct = null;
        //$('#txtDeclarationType').focus();
        $scope.button = "Save";
        $scope.Show = false;
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        $scope.ScreenLockInfo = [];
        //ScreenLock();
        GetUsersPermissionDetails();
        GetDeclarationTypePaged($scope.currentPage);
    }

    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('StockDeclarationTypeScreenId');
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
    function GetDeclarationTypePaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/DeclarationType/GetDeclarationTypePaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DeclarationTypelist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }
    function SaveDeclarationType(Status) {
        var parms = JSON.stringify({ stockDeclarationType: $scope.ad_StockDeclarationType });
        $http.post('/DeclarationType/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Stock Out Type '+Status+' Successfully!', 'success', '5000');
                Clear();
                $scope.declarationTypeEntryForm.$setPristine();
                $scope.declarationTypeEntryForm.$setUntouched();
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
            GetDeclarationTypePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetDeclarationTypePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetDeclarationTypePaged($scope.currentPage);
        }
    }
    $scope.CheckDuplicateDeclarationTypeName = function () {
        var criteria = ' DeclarationTypeName=\'' + $scope.ad_StockDeclarationType.DeclarationTypeName + '\'';
        if ($scope.ad_StockDeclarationType.DeclarationTypeId != 0) {
            criteria += ' AND DeclarationTypeId<>' + $scope.ad_StockDeclarationType.DeclarationTypeId;
        }

        $http({
            url: '/DeclarationType/GetDeclarationTypeDynamic?searchCriteria=' + criteria + '&orderBy=DeclarationTypeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_StockDeclarationType.DeclarationTypeName + ' already exists!', 'already', '5000');
                tbxDeclarationTypeName.focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    }
    $scope.foundChange = function () {
        $scope.found = true;
    }
    $scope.AddDeclarationType = function () {
        if ($scope.found) {
            $('#txtDeclarationType').focus();
        }
        else {
            $scope.ad_StockDeclarationType.CreatorId = $scope.UserId;
            $scope.ad_StockDeclarationType.UpdatorId = $scope.UserId;
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_StockDeclarationType.DeclarationTypeId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SaveDeclarationType('Saved');
                        }
                    })
                }
                else if ($scope.ad_StockDeclarationType.DeclarationTypeId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_StockDeclarationType.DeclarationTypeId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SaveDeclarationType('Updated');
                        }
                    })
                }
                else if ($scope.ad_StockDeclarationType.DeclarationTypeId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_StockDeclarationType.DeclarationTypeId == 0 && $scope.CreatePermission) {
                    SaveDeclarationType('Saved');
                }
                else if ($scope.ad_StockDeclarationType.DeclarationTypeId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_StockDeclarationType.DeclarationTypeId > 0 && $scope.RevisePermission) {
                    SaveDeclarationType('Updated');
                }
                else if ($scope.ad_StockDeclarationType.DeclarationTypeId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    }
    $scope.SelDeclarationType = function (DeclarationType) {
        $scope.ad_StockDeclarationType = DeclarationType;
        $scope.button = "Update";
        $scope.Show = false;
    }
    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ declarationTypeId: $scope.ad_StockDeclarationType.DeclarationTypeId });
                $http.post('/DeclarationType/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Stock Out Type Deleted Successfully!', 'success', '5000');
                        Clear();
                        $scope.declarationTypeEntryForm.$setPristine();
                        $scope.declarationTypeEntryForm.$setUntouched();
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
        $scope.declarationTypeEntryForm.$setPristine();
        $scope.declarationTypeEntryForm.$setUntouched();
    }
});