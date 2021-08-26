app.controller("PaymentTypeController", function ($scope, $cookieStore, $route, $http, $window) {
    //#region VARIABLES
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('PaymentTypeScreenId');
    //#endregion

    Clear(); 

    //#region METHODS
    function Clear() {
        //Server side pagination
        $scope.currentPage = 1;
        $scope.itemsPerPage = 10;
        $scope.total_count = 0;

        $scope.ConfirmationMessageForAdmin = false;
        $scope.ddlPaymentGroup = null;
        $scope.saveButtonLabel = "Save";
        $scope.deleteButtonShow = false;

        $scope.ad_PaymentType = {};
        $scope.ad_PaymentType.PaymentTypeId = 0;
        $scope.ad_PaymentType.IsActive = true;

        $scope.ScreenLockInfo = [];
        $scope.PaymentGroupList = [];
        $scope.PaymentTypelist = [];

        //ScreenLock();
        GetConfirmationMessageForAdmin();
        GetUsersPermissionDetails();
        GetAllPaymentGroup();
        GetAllPaymentTypePaged($scope.currentPage);
    }

    function GetAllPaymentGroup() {
        $http({
            url: '/PaymentGroup/GetAllActivePaymentGroup',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            angular.forEach(data, function (adata) {
                if (!adata.IsAdjustment) {
                    $scope.PaymentGroupList.push(adata);
                }
            })
        });
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
            url: '/PaymentType/GetAllPaymentTypePaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.itemsPerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.PaymentTypelist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    function SavePaymentType(Status) {
        var parms = JSON.stringify({ paymentType: $scope.ad_PaymentType });
        $http.post('/PaymentType/Save', parms).success(function (data) {
            if (data > 0) {
                Clear();
                $scope.paymentTypeEntryForm.$setPristine();
                $scope.paymentTypeEntryForm.$setUntouched();
                alertify.log('Payment Type ' + Status + ' Successfully!', 'success', '5000');
            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }
    //#endregion

    //#region EVENTS
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
        $scope.ad_PaymentType.CreatorId = $scope.UserId;
        $scope.ad_PaymentType.UpdatorId = $scope.UserId;
        if ($scope.found) {
            $('#txtBranchTypeName').focus();
        }
        else {
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_PaymentType.PaymentTypeId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SavePaymentType('Saved');
                        }
                    })
                }
                else if ($scope.ad_PaymentType.PaymentTypeId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_PaymentType.PaymentTypeId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SavePaymentType('Update');
                        }
                    })
                }
                else if ($scope.ad_PaymentType.PaymentTypeId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_PaymentType.PaymentTypeId == 0 && $scope.CreatePermission) {
                    SavePaymentType('Saved');
                }
                else if ($scope.ad_PaymentType.PaymentTypeId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_PaymentType.PaymentTypeId > 0 && $scope.RevisePermission) {
                    SavePaymentType('Update');
                }
                else if ($scope.ad_PaymentType.PaymentTypeId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    }

    $scope.RowClickPaymentType = function (paymentType) {
        if (paymentType.IsFixed != true) {
            $scope.ad_PaymentType = paymentType;
            $scope.ddlPaymentGroup = { PaymentGroupId: paymentType.PaymentGroupId };
            $scope.saveButtonLabel = "Update";
            $scope.deleteButtonShow = true;
        }
        else {
            alertify.log('This Payment Type Cannot be Changed/Deleted!', 'error', '5000');
        }
    }

    $scope.CheckDuplicateBranchTypeName = function () {
        var criteria = '1=1';
        if ($scope.ad_PaymentType.PaymentTypeId == 0) {
            criteria += ' AND PaymentTypeName=\'' + $scope.ad_PaymentType.PaymentTypeName + '\'';
        } else {
            criteria += ' AND PaymentTypeName=\'' + $scope.ad_PaymentType.PaymentTypeName + '\' AND PaymentTypeId<>' + $scope.ad_PaymentType.PaymentTypeId;
        }
        $http({
            url: '/PaymentType/GetPaymentTypeDynamic?searchCriteria=' + criteria + '&orderBy=PaymentTypeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_PaymentType.PaymentTypeName + ' already exists!', 'already', '5000');
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
                var parms = JSON.stringify({ paymentTypeId: $scope.ad_PaymentType.PaymentTypeId });
                $http.post('/PaymentType/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Payment Type Deleted Successfully!', 'success', '5000');
                        Clear();
                        $scope.paymentTypeEntryForm.$setPristine();
                        $scope.paymentTypeEntryForm.$setUntouched();
                    } else {
                        alertify.log('Delete Failed!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '5000');
                });
            }
        });
    }

    $scope.ResetForm = function () {
        Clear();
        $scope.paymentTypeEntryForm.$setPristine();
        $scope.paymentTypeEntryForm.$setUntouched();
    }
    //#endregion
});