app.controller("DepartmentEntryController", function ($scope, $cookieStore, $http, $filter, $window) {
    //For Screen lock
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('DepartmentScreenId');

    Clear();
    function Clear() {
        $scope.ScreenLockInfo = [];
        $scope.DepartmentTypelist = [];
        $scope.TypeWiseDepartmentlist = [];
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.found = false;
        $scope.foundShortName = false;
        $scope.ad_Department = {};
        $scope.ad_Department.DepartmentId = 0;
        $scope.ad_Department.IsActive = true;
        $scope.ad_Department.OpeningDate = $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy');
        $scope.button = "Save";
        $scope.Show = false;
        $scope.ddlBranch = null;
        GetAllBranch();
        GetDepartmentPaged($scope.currentPage);
        GetDepartmentType();
        //ScreenLock();
        GetUsersPermissionDetails();
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
    }
    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('DepartmentScreenId');
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
    function GetDepartmentType() {
        $http({
            url: '/Department/GetAllDepartmentType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DepartmentTypelist = data;
            angular.forEach($scope.DepartmentTypelist, function (aDeptType) {
                if (aDeptType.DepartmentTypeName == 'Inventory') {
                    aDeptType.selected = true;
                }
            })
        });
    }
    function GetAllBranch() {
        $http({
            url: '/Branch/GetAllBranch',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Branchlist = data;
        });
    }
    function GetDepartmentPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/Department/GetDepartmentPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Departmentlist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }
    function AddTypeWiseDepartment(data) {
        $scope.TypeWiseDepartmentlist_save = [];
        angular.forEach($scope.DepartmentTypelist, function (aDepartmentType) {
            if (aDepartmentType.selected) {
                $scope.TypeWiseDepartmentlist_save.push({ DepartmentId: data, DepartmentTypeId: aDepartmentType.DepartmentTypeId });
            }
        });

        var parms = JSON.stringify({ ad_TypeWiseDepartmentlist: $scope.TypeWiseDepartmentlist_save });
        $http.post('/Department/SaveTypeWiseDepartment', parms).success(function (data) {
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }
    function GetTypeWiseDepartmentByDepartmentId(data) {
        //angular.forEach($scope.DepartmentTypelist, function (aDepartmentType) {
        //    aDepartmentType.selected = false;
        //});

        $http({
            url: '/Department/GetTypeWiseDepartmentByDepartmentId?depId=' + data,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.TypeWiseDepartmentlist = data;
            angular.forEach($scope.DepartmentTypelist, function (aDepartmentType) {

                angular.forEach($scope.TypeWiseDepartmentlist, function (aTypeWiseDepartment) {
                    if (aDepartmentType.DepartmentTypeId == aTypeWiseDepartment.DepartmentTypeId) {
                        aDepartmentType.selected = true;
                    }
                });

            });
        });

    }


    function SaveDepertment(Status) {
        var parms = JSON.stringify({ ad_Department: $scope.ad_Department });
        $http.post('/Department/Save', parms).success(function (data) {
            if (data > 0) {
                AddTypeWiseDepartment(Status == 'Saved' ? data : $scope.ad_Department.DepartmentId);
                alertify.log('Store ' + Status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.departmentEntryForm.$setPristine();
                $scope.departmentEntryForm.$setUntouched();
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
            GetDepartmentPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetDepartmentPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetDepartmentPaged($scope.currentPage);
        }
    }
    $scope.CheckDuplicateDepartmentName = function () {
        var criteria = '1=1';
        if ($scope.ad_Department.DepartmentId == 0) {
            criteria += ' AND DepartmentName=\'' + $scope.ad_Department.DepartmentName + '\'';
        } else {
            criteria += ' AND DepartmentName=\'' + $scope.ad_Department.DepartmentName + '\' AND DepartmentId<>' + $scope.ad_Department.DepartmentId;
        }
        $http({
            url: '/Department/GetDepartmentDynamic?searchCriteria=' + criteria + '&orderBy=DepartmentName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_Department.DepartmentName + ' already exists!', 'already', '5000');
                txtDepartmentName.focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    }
    $scope.CheckDuplicateDepartmentShortName = function () {
        var criteria = '1=1';
        if ($scope.ad_Department.DepartmentId == 0) {
            criteria += ' AND DepartmentShortName=\'' + $scope.ad_Department.DepartmentShortName + '\'';
        } else {
            criteria += ' AND DepartmentShortName=\'' + $scope.ad_Department.DepartmentShortName + '\' AND DepartmentId<>' + $scope.ad_Department.DepartmentId;
        }
        $http({
            url: '/Department/GetDepartmentDynamic?searchCriteria=' + criteria + '&orderBy=DepartmentShortName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_Department.DepartmentShortName + ' already exists!', 'already', '5000');
                txtDepartmentShortName.focus();
                $scope.foundShortName = true;
            } else {
                $scope.foundShortName = false;
            }
        });
    }

    $scope.foundChange = function () {
        $scope.found = true;
    }
    $scope.foundChangeShortName = function () {
        $scope.foundShortName = true;
    }
    $scope.AddDepartment = function () {
        $scope.ad_Department.CreatorId = $scope.UserId;
        $scope.ad_Department.UpdatorId = $scope.UserId;
        var fLg = false;
        angular.forEach($scope.DepartmentTypelist, function (aDepartmentType) {
            if (aDepartmentType.selected) {
                fLg = true;
            }
        });
        if ($scope.found) {
            $('#txtDepartmentName').focus();
        }
        else if ($scope.foundShortName) {
            $('#txtDepartmentShortName').focus();
        }
        else {
            if (fLg) {
                var from = $("#txtOpeningDate").val().split("/");
                var f = new Date(from[2], from[1] - 1, from[0]);
                $scope.ad_Department.OpeningDate = f;
                $scope.ad_Department.BranchId = $scope.ddlBranch.BranchId;
                $scope.ad_Department.ManagerName = 'A';
                if ($scope.ConfirmationMessageForAdmin) {
                    if ($scope.ad_Department.DepartmentId == 0 && $scope.CreatePermission) {
                        alertify.confirm("Are you sure to save?", function (e) {
                            if (e) {
                                SaveDepertment('Saved');
                            }
                        })
                    }
                    else if ($scope.ad_Department.DepartmentId == 0 && !$scope.CreatePermission) {
                        alertify.log('You do not have permission to save!', 'error', '5000');
                    }
                    else if ($scope.ad_Department.DepartmentId > 0 && $scope.RevisePermission) {
                        alertify.confirm("Are you sure to update?", function (e) {
                            if (e) {
                                SaveDepertment('Updated');
                            }
                        })
                    }
                    else if ($scope.ad_Department.DepartmentId > 0 && !$scope.RevisePermission) {
                        alertify.log('You do not have permission to Update!', 'error', '5000');
                    }
                }
                else {
                    if ($scope.ad_Department.DepartmentId == 0 && $scope.CreatePermission) {
                        SaveDepertment('Saved');
                    }
                    else if ($scope.ad_Department.DepartmentId == 0 && !$scope.CreatePermission) {
                        alertify.log('You do not have permission to save!', 'error', '5000');
                    }
                    else if ($scope.ad_Department.DepartmentId > 0 && $scope.RevisePermission) {
                        SaveDepertment('Updated');
                    }
                    else if ($scope.ad_Department.DepartmentId > 0 && !$scope.RevisePermission) {
                        alertify.log('You do not have permission to Update!', 'error', '5000');
                    }
                }
            } else {
                alertify.log('Please Select Store Type!', 'already', '5000');
            }
        }
    }

    $scope.SelDepartment = function (aDepartment) {
        $scope.found = false;
        //$scope.ddlBranch = new Object();
        //$scope.ddlManager = new Object();

        var res = aDepartment.OpeningDate.substring(0, 5);
        if (res == "/Date") {
            var parsedDate = new Date(parseInt(aDepartment.OpeningDate.substr(6)));
            aDepartment.OpeningDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
        }

        $scope.ad_Department = aDepartment;
        GetTypeWiseDepartmentByDepartmentId(aDepartment.DepartmentId);
        $scope.button = "Update";
        $scope.Show = false;
        $scope.ddlBranch = { BranchId: aDepartment.BranchId };
        //$scope.ddlManager.manager = { "EmployeeId": aDepartment.ManagerId };
        $window.scrollTo(0, 0);
    }
    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ DepartmentId: $scope.ad_Department.DepartmentId });
                $http.post('/Department/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Store Deleted Successfully!', 'success', '5000');
                        Clear();
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
        $scope.departmentEntryForm.$setPristine();
        $scope.departmentEntryForm.$setUntouched();
    }
});