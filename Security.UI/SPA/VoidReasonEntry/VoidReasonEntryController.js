app.controller("VoidReasonEntryController", function ($scope, $cookieStore, $http, $window) { 
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('VoidReasonEntryScreenId');
    Clear();
    function Clear() {
        $scope.ad_VoidReason = {};
        $scope.found = false;
        $scope.ad_VoidReason.VoidReasonId = 0;
        $scope.ad_VoidReason.IsActive = true;
        $scope.VoidReasonlist = [];
        $scope.ScreenLockInfo = [];
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        $scope.button = "Save";
        //$('#txtVoidReasonName').focus();
        $scope.Show = false;
        GetVoidReasonPaged($scope.currentPage);
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

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('VoidReasonEntryScreenId');
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
    function GetVoidReasonPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/VoidReason/GetVoidReasonPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.VoidReasonlist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }
    function SaveVoidReson(Status) {
        var parms = JSON.stringify({ voidReason: $scope.ad_VoidReason });
        $http.post('/VoidReason/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Void Reason ' + Status + ' Successfully!', 'success', '5000');
                Clear();
                $('#txtVoidReasonName').focus();
                $scope.VoidReasonEntryForm.$setPristine();
                $scope.VoidReasonEntryForm.$setUntouched();

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
            GetVoidReasonPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetVoidReasonPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetVoidReasonPaged($scope.currentPage);
        }
    };
    $scope.AddVoidReason = function() {
        if ($scope.found) {
            $('#txtVoidReasonName').focus();
        }
        else {
            $scope.ad_VoidReason.CreatorId = $scope.UserId;
            $scope.ad_VoidReason.UpdatorId = $scope.UserId;
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_VoidReason.VoidReasonId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SaveVoidReson('Saved');
                        }
                    })
                }
                else if ($scope.ad_VoidReason.VoidReasonId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_VoidReason.VoidReasonId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SaveVoidReson('Updated');
                        }
                    })
                }
                else if ($scope.ad_VoidReason.VoidReasonId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_VoidReason.VoidReasonId == 0 && $scope.CreatePermission) {
                    SaveVoidReson('Saved');
                }
                else if ($scope.ad_VoidReason.VoidReasonId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_VoidReason.VoidReasonId > 0 && $scope.RevisePermission) {
                    SaveVoidReson('Updated');
                }
                else if ($scope.ad_VoidReason.VoidReasonId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    };
    $scope.SelVoidReason = function(returnReason) {
        $scope.ad_VoidReason = returnReason;
        if (returnReason.IsActive) {
            $scope.ad_VoidReason.IsActive = true;
        }
        $scope.button = "Update";
        $scope.Show = false;
        $window.scrollTo(0, 0);
    };
    $scope.CheckDuplicateVoidReasonName = function () {
        var criteria = ' VoidReasonName=\'' + $scope.ad_VoidReason.VoidReasonName + '\'';
        if ($scope.ad_VoidReason.VoidReasonId != 0) {
            criteria += ' AND VoidReasonId<>' + $scope.ad_VoidReason.VoidReasonId;
        }

        $http({
            url: '/VoidReason/GetVoidReasonDynamic?searchCriteria=' + criteria + '&orderBy=VoidReasonName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_VoidReason.VoidReasonName + ' already exists!', 'already', '5000');
                txtVoidReasonName.focus();
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
                var parms = JSON.stringify({ returnReasonId: $scope.ad_VoidReason.VoidReasonId });
                $http.post('/VoidReason/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Void Reason Deleted Successfully!', 'success', '5000');
                        Clear();
                        $scope.VoidReasonEntryForm.$setPristine();
                        $scope.VoidReasonEntryForm.$setUntouched();
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
        $('#txtVoidReasonName').focus();
        $scope.VoidReasonEntryForm.$setPristine();
        $scope.VoidReasonEntryForm.$setUntouched();

    };
});