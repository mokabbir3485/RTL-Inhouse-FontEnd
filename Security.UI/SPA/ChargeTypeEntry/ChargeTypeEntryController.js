app.controller("ChargeTypeEntryController", function ($scope, $cookieStore, $http, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('ChargeTypeScreenId');
    Clear();
    function Clear() {
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.ScreenLockInfo = [];
        //ScreenLock();
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        $scope.ChargeTypelist = [];
        $scope.found = false;
        $scope.ad_ChargeType = {};
        $scope.ad_ChargeType.ChargeTypeId = 0;
        $scope.ad_ChargeType.IsActive = true;
        //$('#txtChargeTypeName').focus();
        $scope.button = "Save";
        $scope.Show = false;
        GetUsersPermissionDetails();
        GetChargeTypePaged($scope.currentPage);
    }

    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('ChargeTypeScreenId');
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
    function GetChargeTypePaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/ChargeType/GetChargeTypePaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ChargeTypelist = data.ListData;
            $scope.total_count = data.TotalRecord;
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
    function SaveChargeType(Status) {
        var parms = JSON.stringify({ ChargeType: $scope.ad_ChargeType });
        $http.post('/ChargeType/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Charge Type ' + Status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.chargeTypeEntryForm.$setPristine();
                $scope.chargeTypeEntryForm.$setUntouched();
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
            GetChargeTypePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetChargeTypePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetChargeTypePaged($scope.currentPage);
        }
    }
    $scope.AddChargeType = function () {
        if ($scope.found) {
            $('#txtChargeTypeName').focus();
        }
        else {
            $scope.ad_ChargeType.CreatorId = $scope.UserId;
            $scope.ad_ChargeType.UpdatorId = $scope.UserId;
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_ChargeType.ChargeTypeId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SaveChargeType('Saved');
                        }
                    })
                }
                else if ($scope.ad_ChargeType.ChargeTypeId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_ChargeType.ChargeTypeId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SaveChargeType('Updated');
                        }
                    })
                }
                else if ($scope.ad_ChargeType.ChargeTypeId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_ChargeType.ChargeTypeId == 0 && $scope.CreatePermission) {
                    SaveChargeType('Saved');
                }
                else if ($scope.ad_ChargeType.ChargeTypeId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_ChargeType.ChargeTypeId > 0 && $scope.RevisePermission) {
                    SaveChargeType('Updated');

                }
                else if ($scope.ad_ChargeType.ChargeTypeId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    }
    $scope.SelChargeType = function (ChargeType) {
        $scope.ad_ChargeType = ChargeType;
        if (ChargeType.IsActive) {
            $scope.ad_ChargeType.IsActive = true;
        }
        $scope.button = "Update";
        $scope.Show = false;
        $window.scrollTo(0, 0);
    }
    $scope.CheckDuplicateChargeTypeName = function () {
        var criteria = ' ChargeTypeName=\'' + $scope.ad_ChargeType.ChargeTypeName + '\'';
        if ($scope.ad_ChargeType.ChargeTypeId != 0) {
            criteria += ' AND ChargeTypeId<>' + $scope.ad_ChargeType.ChargeTypeId;
        }

        $http({
            url: '/ChargeType/GetChargeTypeDynamic?searchCriteria=' + criteria + '&orderBy=ChargeTypeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_ChargeType.ChargeTypeName + ' already exists!', 'already', '5000');
                $('#txtChargeTypeName').focus();
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
                var parms = JSON.stringify({ ChargeTypeId: $scope.ad_ChargeType.ChargeTypeId });
                $http.post('/ChargeType/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Charge Type Deleted Successfully!', 'success', '5000');
                        Clear();
                        $scope.chargeTypeEntryForm.$setPristine();
                        $scope.chargeTypeEntryForm.$setUntouched();
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
        $scope.chargeTypeEntryForm.$setPristine();
        $scope.chargeTypeEntryForm.$setUntouched();
    }
});