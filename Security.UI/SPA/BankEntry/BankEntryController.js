app.controller("BankEntryController", function ($scope, $cookieStore, $http, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('BankEntryScreenId');
    Clear();
    
    function Clear() {
        $scope.ScreenLockInfo = [];
        $scope.Banklist = [];
        //ScreenLock();
        $scope.found = false;
        $scope.btnDeleleShow = false;
        $scope.ConfirmationMessageForAdmin = false;        
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        $scope.ad_Bank= {};
        $scope.ad_Bank.BankId = 0
        $scope.ad_Bank.IsActive = true;
        $scope.button = "Save";
        GetUsersPermissionDetails();
        GetDesignationPaged($scope.currentPage);
        GetConfirmationMessageForAdmin();
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
    $scope.Selbank = function (aBank) {
        $scope.ad_Bank = aBank;
        $scope.button = "Update";
        $scope.btnDeleleShow = false;
    };
    $scope.CheckDuplicateBankName = function () {
        var criteria = '1=1';
        if ($scope.ad_Bank.BankId == 0) {
            criteria += ' AND BankName=\'' + $scope.ad_Bank.BankName + '\'';
        } else {
            criteria += ' AND BankName=\'' + $scope.ad_Bank.BankName + '\' AND BankId<>' + $scope.ad_Bank.BankId;
        }
        $http({
            url: '/BankEntry/GetBankDynamic?searchCriteria=' + criteria + '&orderBy=BankName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_Bank.BankName + ' already exists!', 'already', '5000');
                $('#txtBankName').focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    };

    $scope.foundChange = function () {
        $scope.found = true;
    };

    function GetDesignationPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/BankEntry/GetBankPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Banklist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }
    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('DesignationScreenId');
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
    function SaveBank(Status) {
        var parms = JSON.stringify({ _ad_Bank: $scope.ad_Bank });
        $http.post('/BankEntry/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Bank ' + Status + ' successfully!', 'success', '5000');
                Clear();
                $scope.bankEntryForm.$setUntouched();
                $scope.bankEntryForm.$setPristine();

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
            GetDesignationPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetDesignationPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetDesignationPaged($scope.currentPage);
        }
    };

    $scope.SaveBank = function () {
        $scope.ad_Bank.CreatorId = $scope.UserId;
        $scope.ad_Bank.UpdatorId = $scope.UserId;
        //$scope.ad_Bank.DepartmentId = $scope.ddlDepartment.DepartmentId;
        //$scope.ad_Bank.DepartmentName = $scope.ddlDepartment.DepartmentName;

        if ($scope.found) {
            $('#txtBankName').focus();
        }
        else {
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_Bank.BankId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SaveBank('Saved');
                        }
                    })
                }
                else if ($scope.ad_Bank.BankId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_Bank.BankId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SaveBank('Updated');
                        }
                    })
                }
                else if ($scope.ad_Bank.BankId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_Bank.BankId == 0 && $scope.CreatePermission) {
                    SaveBank('Saved');
                }
                else if ($scope.ad_Bank.BankId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_Bank.BankId > 0 && $scope.RevisePermission) {
                    SaveBank('Updated');
                }
                else if ($scope.ad_Bank.BankId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    };
    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ bankId: $scope.ad_Bank.bankId });
                $http.post('/BankEntry/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Bank Entry Deleted Successfully!', 'success', '5000');
                        Clear();
                    } else {
                        alertify.log('Delete Failed!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '5000');
                });
            }
        })
    };
    $scope.resetForm = function () {
        Clear();
        $scope.bankEntryForm.$setPristine();
        $scope.bankEntryForm.$setUntouched();
    };
})