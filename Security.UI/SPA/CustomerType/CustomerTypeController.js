app.controller("CustomerTypeController", function ($scope, $cookieStore, $http, $filter, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('CustomerTypeScreenId');
    Clear();
    function Clear() {
        //ScreenLock();
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        $scope.customerTyoeList = [];
        $scope.ad_CustomerType = {};
        $scope.ad_CustomerType.CustomerTypeId = 0;
        $scope.ad_CustomerType.IsActive = true;
        $scope.btnSave_Revise = 'Save';
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        //$("#txtCustomerTypeName").focus();
        GetCustomerTypePaged($scope.currentPage);
        GetUsersPermissionDetails();
        $scope.btnShowDelete = false;
    }

    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('CustomerTypeScreenId');
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
    function GetCustomerTypePaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/CustomerType/GetCustomerTypePaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.customerTyoeList = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }
    function SaveCustomerType(Status) {
        var param = JSON.stringify({ _ad_CustomerType: $scope.ad_CustomerType })
        $http.post('/CustomerType/Save', param).success(function (cusstomerTypeId) {
            if (cusstomerTypeId > 0) {
                Clear();
                $scope.CustomerTypeform.$setPristine();
                $scope.CustomerTypeform.$setUntouched();
                alertify.log('Customer Type ' + Status + ' Successfully!', 'success', '5000');
                $("#txtCustomerTypeName").focus();
            }
            else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    $scope.CheckDuplicateCustomertypeName = function () {
        var criteria = '1=1';
        if ($scope.ad_CustomerType.CustomerTypeId == 0) {
            criteria += ' AND CustomerTypeName=\'' + $scope.ad_CustomerType.CustomerTypeName + '\'';
        } else {
            criteria += ' AND CustomerTypeName=\'' + $scope.ad_CustomerType.CustomerTypeName + '\' AND CustomerTypeId<>' + $scope.ad_CustomerType.CustomerTypeId;
        }
        $http({
            url: '/CustomerType/GetCustomertypeDynamic?searchCriteria=' + criteria + '&orderBy=CustomerTypeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_CustomerType.CustomerTypeName + ' already exists!', 'already', '5000');
                $("#txtCustomerTypeName").focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    }
    $scope.foundChange = function () {
        $scope.found = true;
    }
    $scope.SaveCustromerType = function () {
        if ($scope.found) {
            $('#txtCustomerTypeName').focus();
        }
        if ($('#txtCustomerTypeName').val() == 'Un-Registered') {
            alertify.log('Un-Registered Type Not allowed!', 'error', '5000');
        }
        else {
            $scope.ad_CustomerType.CreatorId = $scope.UserId;
            $scope.ad_CustomerType.UpdatorId = $scope.UserId;
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_CustomerType.CustomerTypeId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SaveCustomerType('Saved');
                        }
                    })
                }
                else if ($scope.ad_CustomerType.CustomerTypeId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_CustomerType.CustomerTypeId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SaveCustomerType('Updated');
                        }
                    })
                }
                else if ($scope.ad_CustomerType.CustomerTypeId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_CustomerType.CustomerTypeId == 0 && $scope.CreatePermission) {
                    SaveCustomerType('Saved');
                }
                else if ($scope.ad_CustomerType.CustomerTypeId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_CustomerType.CustomerTypeId > 0 && $scope.RevisePermission) {
                    SaveCustomerType('Updated');
                }
                else if ($scope.ad_CustomerType.CustomerTypeId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    }
    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ customerTypeId: $scope.ad_CustomerType.CustomerTypeId });
                $http.post('/CustomerType/Delete', parms).success(function (data) {
                    if (data > 0) {
                        Clear();
                        $scope.btnShowDelete = false;
                        alertify.log('Customer Type Deleted Successfully!', 'success', '5000');

                    } else {
                        alertify.log('Delete Failed!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '5000');
                });
            }
        });
    }
    $scope.RowClickCustomerType = function (cudtomerType) {
        $scope.ad_CustomerType = cudtomerType;
        $scope.btnSave_Revise = "Update";
        $scope.btnShowDelete = false;
    }
    $scope.getData = function (curPage) {
        if ($scope.itemsPerPage > 100) {
            $scope.itemsPerPage = 100;
            $scope.currentPage = curPage;
            GetCustomerTypePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.itemsPerPage < 1) {
            $scope.itemsPerPage = 1;
            $scope.currentPage = curPage;
            GetCustomerTypePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetCustomerTypePaged($scope.currentPage);
        }
    }
    $scope.resetForm = function () {
        Clear()
        $scope.CustomerTypeform.$setPristine();
        $scope.CustomerTypeform.$setUntouched();
    }
});