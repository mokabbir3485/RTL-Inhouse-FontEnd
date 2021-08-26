app.controller("DesignationEntryController", function ($scope, $cookieStore, $http, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('DesignationScreenId');

    Clear();

    function Clear() {
        $scope.ScreenLockInfo = [];
        //ScreenLock();
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.designationlist = [];
        $scope.found = false;
        $scope.ad_Designation = {};
        $scope.ad_Designation.DesignationId = 0;
        $scope.ad_Designation.IsActive = true;
        selDepartment.focus();
        $scope.ddlDepartment = null;
        $scope.button = "Save";
        $scope.btnDeleleShow = false;
        //GetAllDepartment();
        GetDesignationPaged($scope.currentPage);
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        GetUsersPermissionDetails();
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

    function GetAllDepartment() {
        $http({
            url: '/Department/GetAllDepartment',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.departmentlist = data;
        });
    }

    function GetDesignationPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/Designation/GetDesignationPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.designationlist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    function SaveDesignation(Status) {
        var parms = JSON.stringify({ ad_Designation: $scope.ad_Designation });
        $http.post('/Designation/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Designation ' + Status + ' successfully!', 'success', '5000');
                Clear();
                $scope.designationEntryForm.$setUntouched();
                $scope.designationEntryForm.$setPristine();

            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    $scope.CheckDuplicateDesignationName = function () {
        var criteria = '1=1';
        if ($scope.ad_Designation.DesignationId == 0) {
            criteria += ' AND DesignationName=\'' + $scope.ad_Designation.DesignationName + '\'';
        } else {
            criteria += ' AND DesignationName=\'' + $scope.ad_Designation.DesignationName + '\' AND DesignationId<>' + $scope.ad_Designation.DesignationId;
        }
        $http({
            url: '/Designation/GetDesignationDynamic?searchCriteria=' + criteria + '&orderBy=DesignationName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_Designation.DesignationName + ' already exists!', 'already', '5000');
                $('#txtDesignationName').focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    };

    $scope.foundChange = function () {
        $scope.found = true;
    };

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

    $scope.AddDesignation = function () {
        $scope.ad_Designation.CreatorId = $scope.UserId;
        $scope.ad_Designation.UpdatorId = $scope.UserId;
        //$scope.ad_Designation.DepartmentId = $scope.ddlDepartment.DepartmentId;
        //$scope.ad_Designation.DepartmentName = $scope.ddlDepartment.DepartmentName;

        if ($scope.found) {
            $('#txtDesignationName').focus();
        }
        else {
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_Designation.DesignationId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SaveDesignation('Saved');
                        }
                    })
                }
                else if ($scope.ad_Designation.DesignationId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_Designation.DesignationId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SaveDesignation('Updated');
                        }
                    })
                }
                else if ($scope.ad_Designation.DesignationId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_Designation.DesignationId == 0 && $scope.CreatePermission) {
                    SaveDesignation('Saved');
                }
                else if ($scope.ad_Designation.DesignationId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_Designation.DesignationId > 0 && $scope.RevisePermission) {
                    SaveDesignation('Updated');
                }
                else if ($scope.ad_Designation.DesignationId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    };

    $scope.SelDesignation = function (aDesignation) {
        $scope.ad_Designation = aDesignation;
        $scope.button = "Update";
        $scope.btnDeleleShow = false;
        $scope.ddlDepartment = { "DepartmentId": aDesignation.DepartmentId };
    };

    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ DesignationId: $scope.ad_Designation.DesignationId });
                $http.post('/Designation/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Designation Deleted Successfully!', 'success', '5000');
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
        $scope.designationEntryForm.$setPristine();
        $scope.designationEntryForm.$setUntouched();
    };
});