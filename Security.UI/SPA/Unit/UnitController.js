app.controller("UnitController", function ($scope, $cookieStore, $http, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('UnitScreenId');
    Clear();
    function Clear() {
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.unitlist = [];
        $scope.ScreenLockInfo = [];
        //ScreenLock();
        $scope.found = false;
        $scope.ad_ItemUnit = new Object();
        $scope.ad_ItemUnit.ItemUnitId = 0;
        $scope.ad_ItemUnit.IsActive = true;
        $scope.button = "Save";
        //$('#txtUnitName').focus();
        $scope.Show = false;
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        GetUsersPermissionDetails();
        GetUnitPaged($scope.currentPage);
    }
    
   $scope.Backup= function () {
        $http({
            url: '/Unit/Backup',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ConfirmationMessageForAdmin = data;
        });
    }
    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('UnitScreenId');
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
    function GetUnitPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/Unit/GetUnitPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.unitlist = data.ListData;
            $scope.total_count = data.TotalRecord;
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
    function SaveUnit(Status) {
        var parms = JSON.stringify({ unit: $scope.ad_ItemUnit });
        $http.post('/Unit/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Unit ' + Status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.unitForm.$setPristine();
                $scope.unitForm.$setUntouched();
            } else {
                alertify.log('Save Failed!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetUnitPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetUnitPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetUnitPaged($scope.currentPage);
        }
    }
    $scope.AddUnit = function () {
        $scope.ad_ItemUnit.CreatorId = $scope.UserId;
        $scope.ad_ItemUnit.UpdatorId = $scope.UserId;
        if ($scope.found) {
            $('#txtUnitName').focus();
        }
        else {
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_ItemUnit.ItemUnitId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SaveUnit('Saved');
                        }
                    })
                }
                else if ($scope.ad_ItemUnit.ItemUnitId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_ItemUnit.ItemUnitId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                             SaveUnit('Updated');
                        }
                    })
                }
                else if ($scope.ad_ItemUnit.ItemUnitId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_ItemUnit.ItemUnitId == 0 && $scope.CreatePermission) {
                    SaveRole('Saved');
                }
                else if ($scope.ad_ItemUnit.ItemUnitId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_ItemUnit.ItemUnitId > 0 && $scope.RevisePermission) {
                     SaveUnit('Updated');
                }
                else if ($scope.ad_ItemUnit.ItemUnitId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    }
    $scope.SelUnit = function (unit) {
        $scope.ad_ItemUnit = unit;
        if (unit.IsActive) {
            $scope.ad_ItemUnit.IsActive = true;
        }

        $scope.button = "Update";
        $scope.Show = false;
    }
    $scope.CheckDuplicateUnitName = function () {
        var criteria = ' UnitName=\'' + $scope.ad_ItemUnit.UnitName + '\'';
        if ($scope.ad_ItemUnit.ItemUnitId != 0) {
            criteria += ' AND ItemUnitId<>' + $scope.ad_ItemUnit.ItemUnitId;
        }

        $http({
            url: '/Unit/GetUnitDynamic?searchCriteria=' + criteria + '&orderBy=UnitName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_ItemUnit.UnitName + ' already exists!', 'already', '5000');
                $('#txtUnitName').focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    }
    $scope.foundChange = function () {
        $scope.found = true;
    }
    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ ItemUnitId: $scope.ad_ItemUnit.ItemUnitId });
                $http.post('/Unit/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Unit Deleted Successfully!', 'success', '5000');
                        Clear();
                        $scope.unitForm.$setPristine();
                        $scope.unitForm.$setUntouched();
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
        $scope.unitForm.$setPristine();
        $scope.unitForm.$setUntouched();
    }
});