app.controller("RoleEntryController", function ($scope, $cookieStore, $http, $window) {
    Clear();

    function Clear() {
        $scope.LoginUser = $cookieStore.get('UserData');
        $scope.UserId = $scope.LoginUser.UserId;
        $scope.ScreenId = $cookieStore.get('RoleScreenId');
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.ScreenLockInfo = [];
        $scope.found = true;
        $scope.rolelist = [];
        $scope.s_Role = {};
        $scope.s_Role.RoleId = 0;
        $scope.s_Role.IsActive = true;
        $scope.button = "Save";
        GetAllRolePaged($scope.currentPage);
        GetUsersPermissionDetails();
        GetHasPOS();
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        //ScreenLock();
        $scope.deleleBtnShow = false;
    }

    //No Need
    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('RoleScreenId');
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
            });
        });
    }

    //No Need
    function GetHasPOS() {
        $scope.GetHasPOS = false;
        $http({
            url: '/Sale/GetHasPOS',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.GetHasPOS = (data === 'true');
        });
    }

    //No Need
    function GetConfirmationMessageForAdmin() {
        $http({
            url: '/Role/GetConfirmationMessageForAdmin',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ConfirmationMessageForAdmin = (data === 'true');
        });
    }

    //No Need
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

    function GetAllRolePaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/Role/GetRolePaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.rolelist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    function SaveRole(status) {
        $scope.UserId = $scope.LoginUser.UserId;
        $scope.s_Role.CreatorId = $scope.UserId;
        $scope.s_Role.UpdatorId = $scope.UserId;
        var parms = JSON.stringify({ role: $scope.s_Role });
        $http.post('/Role/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('User Group ' + status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.roleEntryForm.$setPristine();
                $scope.roleEntryForm.$setUntouched();
                $('#txtRoleName').focus();
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
            GetAllRolePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetAllRolePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetAllRolePaged($scope.currentPage);
        }
    };

    //Duplicacy check start //No Need
    $scope.CheckDuplicateRoleName = function () {
        var criteria = "RoleName=" + $scope.s_Role.RoleName;
        if ($scope.s_Role.RoleId > 0) {
            criteria += " AND RoleId<>" + $scope.s_Role.RoleId;
        }

        $http({
            url: '/Role/GetRoleDynamic?searchCriteria=' + criteria + '&orderBy=RoleName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.s_Role.RoleName + ' already exists!', 'already', '5000');
                $('#txtRoleName').focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    };

    //No Need
    $scope.foundChange = function () {
        $scope.found = true;
    };
    //Duplicacy check end

    $scope.AddRole = function () {
        if ($scope.found) {
            $('#txtRoleName').focus();
        }
        else {
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.s_Role.RoleId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SaveRole('Saved');
                        }
                    })
                }
                else if ($scope.s_Role.RoleId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.s_Role.RoleId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SaveRole('Updated');
                        }
                    })
                }
                else if ($scope.s_Role.RoleId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.s_Role.RoleId == 0 && $scope.CreatePermission) {
                    SaveRole('Saved');
                }
                else if ($scope.s_Role.RoleId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.s_Role.RoleId > 0 && $scope.RevisePermission) {
                    SaveRole('Updated');
                }
                else if ($scope.s_Role.RoleId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    }

    $scope.SelRole = function (role) {
        $scope.found = false;
        $scope.s_Role = role;
        if (role.IsActive) {
            $scope.s_Role.IsActive = true;
        }

        $scope.button = "Update";
        $scope.deleleBtnShow = true;
    }

    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ roleId: $scope.s_Role.RoleId });
                $http.post('/Role/Delete', parms).success(function (data) {
                    if (data > 0) {
                        //myHub.server.shareLiveData();
                        alertify.log('Role Deleted Successfully!', 'success', '5000');
                        Clear();
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
        return;
        Clear();
        $scope.roleEntryForm.$setPristine();
        $scope.roleEntryForm.$setUntouched();
        $('#txtRoleName').focus();


        //$window.open("/ErpReports/RV_exp_ExpNoReqApplication.aspx?PaymentProcessId=1", "_blank", "width=770,height=630,left=340,top=25");

        //var excelList = [{ EmployeeId: 54, StartTime: "09:00", EndTime: "18:00" }, { EmployeeId: 55, StartTime: "09:00", EndTime: "18:00" },
        //    { EmployeeId: 56, StartTime: "09:00", EndTime: "18:00" }, { EmployeeId: 57, StartTime: "08:00", EndTime: "17:00" }, { EmployeeId: 58, StartTime: "08:00", EndTime: "17:00" }];

        //var timeRangeList = [{ ShiftTime: "09:00-18:00" }, { ShiftTime: "08:00-17:00" }];

        //$http({
        //    url: '/Setup/GetAllAttendancePolicy',
        //    method: 'GET',
        //    headers: { 'Content-Type': 'application/json' }
        //}).success(function (data) {
        //    var attPolicyList = data;

        //    for (var i = 0; i < timeRangeList.length; i++) {

        //        timeRangeList[i].StartTime = timeRangeList[i].ShiftTime.split('-')[0];
        //        timeRangeList[i].EndTime = timeRangeList[i].ShiftTime.split('-')[1];

        //        var where = "$.StartTime24=='" + timeRangeList[i].StartTime + "' && $.EndTime24=='" + timeRangeList[i].EndTime + "'";
        //        var attPolicy = Enumerable.From(attPolicyList).Where(where).FirstOrDefault();

        //        if (!angular.isUndefined(attPolicy))
        //            timeRangeList[i].AttendancePolicyId = attPolicy.AttendancePolicyId;
        //    }
        //    console.log(timeRangeList);

        //    for (var k = 0; k < timeRangeList.length; k++) {

        //        var empIds = "";

        //        for (var j = 0; j < excelList.length; j++) {

        //            if (excelList[j].StartTime == timeRangeList[k].StartTime && excelList[j].EndTime == timeRangeList[k].EndTime)
        //                empIds += j == 0 ? excelList[j].EmployeeId : ("," + excelList[j].EmployeeId);
        //        }
                
        //        var params = {};
        //        params.AttendancePolicyId = timeRangeList[k].AttendancePolicyId;
        //        params.EmpIds = empIds;
        //        console.log(params);
        //    }
        //});
    };
});