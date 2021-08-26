app.controller("PaymentGroupController", function ($scope, $cookieStore, $route, $http, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('PaymentGroupScreenId');
    Clear();
    function Clear() {
        //Server side pagination
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.total_count = 0;

        $scope.ScreenLockInfo = [];
        //ScreenLock();
        $scope.button = "Save";
        $scope.Show = false;
        $scope.paymentGroupList = [];
        $scope.ad_PaymentGroup = {};
        $scope.ad_PaymentGroup.PaymentGroupId = 0;
        $scope.ad_PaymentGroup.IsActive = true;
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        GetUsersPermissionDetails();
        GetAllPaymentTypePaged($scope.currentPage);
    }

    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('PaymentTypeScreenId');
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
    function GetAllPaymentTypePaged(curPage) {
        if (curPage == null) {
            curPage = 1;
        }

        var StartRecordNo = ($scope.itemsPerPage * (curPage - 1)) + 1;
        $http({
            url: '/PaymentGroup/GetAllPaymentGroupPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.itemsPerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.paymentGroupList = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }
    function SavePaymentGroup(Status) {
        var parms = JSON.stringify({ paymentGroup: $scope.ad_PaymentGroup });
        $http.post('/PaymentGroup/Save', parms).success(function (data) {
            if (data > 0) {
                Clear();
                $scope.paymentGroupForm.$setPristine();
                $scope.paymentGroupForm.$setUntouched();
                alertify.log('Payment Group ' + Status + ' Successfully!', 'success', '5000');
            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    $scope.getData = function (curPage) {
        if ($scope.itemsPerPage > 100) {
            $scope.itemsPerPage = 100;
            $scope.currentPage = curPage;
            GetAllPaymentTypePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.itemsPerPage < 1) {
            $scope.itemsPerPage = 1;
            $scope.currentPage = curPage;
            GetAllPaymentTypePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetAllPaymentTypePaged($scope.currentPage);
        }
    }
    $scope.Save = function () {
        $scope.ad_PaymentGroup.CreatorId = $scope.UserId;
        $scope.ad_PaymentGroup.UpdatorId = $scope.UserId;
        if ($scope.found) {
            $('#txtBranchTypeName').focus();
        }
        else {
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_PaymentGroup.PaymentGroupId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SavePaymentGroup('Saved');
                        }
                    })
                }
                else if ($scope.ad_PaymentGroup.PaymentGroupId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_PaymentGroup.PaymentGroupId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SavePaymentGroup('Update');
                        }
                    })
                }
                else if ($scope.ad_PaymentGroup.PaymentGroupId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_PaymentGroup.PaymentGroupId == 0 && $scope.CreatePermission) {
                    SavePaymentGroup('Saved');
                }
                else if ($scope.ad_PaymentGroup.PaymentGroupId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_PaymentGroup.PaymentGroupId > 0 && $scope.RevisePermission) {
                    SavePaymentGroup('Update');
                }
                else if ($scope.ad_PaymentGroup.PaymentGroupId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    }
    $scope.RowClickPaymentType = function (paymentGroup) {
        if (paymentGroup.IsDefault != true) {
            $scope.ad_PaymentGroup = paymentGroup;
            $scope.button = "Update";
            $scope.Show = false;
        }
        else {
            alertify.log('This Payment Group Cannot be Changed/Deleted!', 'error', '5000');
        }
    }
    $scope.CheckDuplicateBranchTypeName = function () {
        var criteria = '1=1';
        if ($scope.ad_PaymentGroup.PaymentGroupId == 0) {
            criteria += ' AND PaymentGroupName=\'' + $scope.ad_PaymentGroup.PaymentGroupName + '\'';
        } else {
            criteria += ' AND PaymentGroupName=\'' + $scope.ad_PaymentGroup.PaymentGroupName + '\' AND PaymentGroupId<>' + $scope.ad_PaymentGroup.PaymentGroupId;
        }
        $http({
            url: '/PaymentGroup/GetPaymentGroupDynamic?searchCriteria=' + criteria + '&orderBy=PaymentGroupName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_PaymentGroup.PaymentGroupName + ' already exists!', 'already', '5000');
                $('#txtBranchTypeName').focus();
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
                var parms = JSON.stringify({ paymentGroupId: $scope.ad_PaymentGroup.PaymentGroupId });
                $http.post('/PaymentGroup/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Payment Group Deleted Successfully!', 'success', '5000');
                        Clear();
                        $scope.paymentGroupForm.$setPristine();
                        $scope.paymentGroupForm.$setUntouched();
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
        $scope.paymentGroupForm.$setPristine();
        $scope.paymentGroupForm.$setUntouched();
    }
});