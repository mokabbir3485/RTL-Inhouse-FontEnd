app.controller("ReturnReasonEntryController", function ($scope, $cookieStore, $http, $window) { 
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('ReturnReasonEntryScreenId');
    Clear();
    function Clear() {
        $scope.ReturnReasonlist = [];
        $scope.ScreenLockInfo = [];
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.found = false;
        $scope.ad_ReturnReason = {};
        $scope.ad_ReturnReason.ReturnReasonId = 0;
        $scope.ad_ReturnReason.IsActive = true;
        $scope.button = "Save";
        //$('#txtReturnReasonName').focus();
        $scope.Show = false;
        GetReturnReasonPaged($scope.currentPage);
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        //ScreenLock();
        GetUsersPermissionDetails();
    }
    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('ReturnReasonEntryScreenId');
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
    function GetConfirmationMessageForAdmin() {
        $http({
            url: '/Role/GetConfirmationMessageForAdmin',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ConfirmationMessageForAdmin = (data === 'true');
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
    function GetReturnReasonPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/ReturnReason/GetReturnReasonPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ReturnReasonlist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }
    function SaveReturnReson(Status) {
        var parms = JSON.stringify({ returnReason: $scope.ad_ReturnReason });
        $http.post('/ReturnReason/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Return Reason ' + Status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.returnReasonEntryForm.$setPristine();
                $scope.returnReasonEntryForm.$setUntouched();
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
            GetReturnReasonPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetReturnReasonPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetReturnReasonPaged($scope.currentPage);
        }
    };
    $scope.AddReturnReason = function() {
        if ($scope.found) {
            $('#txtReturnReasonName').focus();
        }
        else {
            $scope.ad_ReturnReason.CreatorId = $scope.UserId;
            $scope.ad_ReturnReason.UpdatorId = $scope.UserId;
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_ReturnReason.ReturnReasonId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SaveReturnReson('Saved');
                        }
                    })
                }
                else if ($scope.ad_ReturnReason.ReturnReasonId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_ReturnReason.ReturnReasonId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SaveReturnReson('Updated');
                        }
                    })
                }
                else if ($scope.ad_ReturnReason.ReturnReasonId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_ReturnReason.ReturnReasonId == 0 && $scope.CreatePermission) {
                    SaveReturnReson('Saved');
                }
                else if ($scope.ad_ReturnReason.ReturnReasonId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_ReturnReason.ReturnReasonId > 0 && $scope.RevisePermission) {
                    SaveReturnReson('Updated');
                }
                else if ($scope.ad_ReturnReason.ReturnReasonId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    };
    $scope.SelReturnReason = function(returnReason) {
        $scope.ad_ReturnReason = returnReason;
        if (returnReason.IsActive) {
            $scope.ad_ReturnReason.IsActive = true;
        }
        $scope.button = "Update";
        $scope.Show = false;
        $window.scrollTo(0, 0);
    };
    $scope.CheckDuplicateReturnReasonName = function () {
        var criteria = ' ReturnReasonName=\'' + $scope.ad_ReturnReason.ReturnReasonName + '\'';
        if ($scope.ad_ReturnReason.ReturnReasonId != 0) {
            criteria += ' AND ReturnReasonId<>' + $scope.ad_ReturnReason.ReturnReasonId;
        }

        $http({
            url: '/ReturnReason/GetReturnReasonDynamic?searchCriteria=' + criteria + '&orderBy=ReturnReasonName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_ReturnReason.ReturnReasonName + ' already exists!', 'already', '5000');
                txtReturnReasonName.focus();
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
                var parms = JSON.stringify({ returnReasonId: $scope.ad_ReturnReason.ReturnReasonId });
                $http.post('/ReturnReason/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Return Reason Deleted Successfully!', 'success', '5000');
                        Clear();
                        $scope.returnReasonEntryForm.$setPristine();
                        $scope.returnReasonEntryForm.$setUntouched();
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
        $scope.returnReasonEntryForm.$setPristine();
        $scope.returnReasonEntryForm.$setUntouched();
    };
});