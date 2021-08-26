app.controller("EmployeeController", function ($scope, $cookieStore, $http, $filter, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('EmployeeScreenId');

    Clear();

    function Clear() {
        $scope.ScreenLockInfo = [];
        //ScreenLock();
        $scope.Branchlist = [];
        $scope.BranchlistForUser = [];
        $scope.DepartmentList = [];
        $scope.DepartmentListForUser = [];
        $scope.DesignationList = [];
        $scope.AllEmployee = [];
        $scope.Designation = [];
        $scope.User = [];
        $scope.RoleList = [];
        $scope.employeeList = [];
        $scope.ddlSection = [];
        $scope.hideSignetureBrowse = true;
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        GetAllContractType();
        $scope.GetAllContractTypeList = [];
        $scope.found = false;
        $scope.foundCode = false;
        $scope.ad_Employee = {};
        $("#txtDateOfBirth").val('');
        $("#txtJoiningDate").val('');
        $("#txtFinishDate").val('');
        $scope.ddlBranch = null;
        $scope.ddlBranchUser = null;
        $scope.ddlDepartment = null;
        $scope.ddlDepartmentUser = null;
        $scope.ddlDesignation = null;
        $scope.ddlRole = null;
        $scope.ad_Employee.EmployeeId = 0;
        $scope.ad_Employee.IsActive = true;
        $scope.btnSave = "Save";
        $scope.ad_Employee.Gender = 'male';
        $scope.IsUserAccount = false;
        $scope.btnDeleleShow = false;
        $scope.userAccount = false;
        $scope.reqSmsCode = false;
        GetAllBranch();
        GetAllRole();
        GetEmployeePaged($scope.currentPage);
        $scope.s_User = {};
        $scope.RemoveBtnShow = false;
        $scope.SelectedUserDepartmentIndex = -1;
        $scope.AddBtnLabel = "Add";
        $scope.UserDepartmentList = [];
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        GetUsersPermissionDetails();
        GetActiveDesignationByDepartmentId(0);
        GetAllEmployee();
        $scope.GradeList = [{ GradeId: 1, GradeName: 'Staff' }, { GradeId: 2, GradeName: 'Labour' }, { GradeId: 3, GradeName: 'Labour EPZ' }];
    }

    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('EmployeeScreenId');
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

    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AllEmployee = Enumerable.From(data)
                                .Where("$.DesignationName =='Marketing Manager' && $.DepartmentName=='Marketing'")
                                .Select(function (x) {
                                    return {
                                        'FullName': x['FullName'],
                                        'EmployeeId': x['EmployeeId']
                                    };
                                })
                                .ToArray();

        });
    }
    function GetAllContractType() {
        $http({
            url: '/Employee/GetAllContractType',
            method: 'get',
            headers: { 'Content-Type': 'application/json' }

        }).success(function (data) {
            $scope.GetAllContractTypeList = data;
        })
    }
    $scope.GetEmpSearch = function () {
        GetEmployeePaged(1);
    }

    function GetEmployeePaged(curPage) {
        var SearchCriteria = "1=1";
        if ($scope.SearchName != null && $scope.SearchName != '' && $scope.SearchName != undefined) {
            SearchCriteria += " AND (E.FirstName LIKE '%" + $scope.SearchName + "%' OR E.MiddleName LIKE '%" + $scope.SearchName + "%' OR E.LastName LIKE '%" + $scope.SearchName + "%') ";
        }
        if ($scope.SearchCode != null && $scope.SearchCode != '' && $scope.SearchCode != undefined) {
            SearchCriteria += " AND E.EmployeeCode LIKE '" + $scope.SearchCode + "%'";
        }
        if ($scope.SearchOutlet != null && $scope.SearchOutlet != '' && $scope.SearchOutlet != undefined) {
            SearchCriteria += " AND B.BranchName LIKE '" + $scope.SearchOutlet + "%'";
        }
        if ($scope.SearchPhone != null && $scope.SearchPhone != '' && $scope.SearchPhone != undefined) {
            SearchCriteria += " AND E.ContactNo LIKE '" + $scope.SearchPhone + "%'";
        }

        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/Employee/GetEmployeePaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + "&whClause=" + SearchCriteria + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.employeeList = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    function GetAllBranch() {
        $http({
            url: '/Branch/GetAllBranch',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Branchlist = data;
            $scope.BranchlistForUser = angular.copy(data);
        });
    }

    function GetGradeDynamic() {
        $http({
            url: '/Employee/GetGradeDynamic?where=IsActive=1&orderBy=GradeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.GradeList = data;
        });
    }

    function GetAllActiveDepartmentByBranchId(branchId, departmentId) {
        $http({
            url: '/Department/GetAllActiveByBranchId?branchId=' + branchId + '&departmentId=' + departmentId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DepartmentList = data;
        });
    }

    function GetAllActiveDepartmentByBranchIdForUser(branchId, departmentId) {
        $http({
            url: '/Department/GetAllActiveByBranchId?branchId=' + branchId + '&departmentId=' + departmentId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DepartmentListForUser = data;
        });
    }

    function GetDesignationByDepartmentId(departmentId) {
        $http({
            url: '/Designation/GetAllByDepartmentId?departmentId=' + departmentId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DesignationList = data;
        });
    }

    function GetActiveDesignationByDepartmentId(departmentId) {
        $http({
            url: '/Designation/GetAllActiveByDepartmentId?departmentId=' + departmentId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DesignationList = data;
        });
    }

    function GetUserByEmployeeId(employeeId) {
        $http({
            url: '/User/GetUserByEmployeeId?employeeId=' + employeeId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.s_User = data;
            $scope.s_User.rtyPassword = data.Password
            $scope.reqSmsCode = $scope.s_User.IsReqSmsCode;
            $scope.ddlRole = { "RoleId": $scope.s_User.RoleId };

            $http({
                url: '/User/GetUserDepartmentByUserId?userId=' + $scope.s_User.UserId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (userDepartmentList) {
                if (userDepartmentList.length) {
                    angular.forEach(userDepartmentList, function (aUserDept) {
                        if (aUserDept.DepartmentId != $scope.ad_Employee.DepartmentId) {
                            $scope.UserDepartmentList.push(aUserDept);
                        }
                    })
                }
                if ($scope.UserDepartmentList.length)
                    $scope.allowToOtherBr = true;
                else
                    $scope.allowToOtherBr = false;
            })
        })
    }

    function GetAllRole() {
        $http({
            url: '/Role/GetAllRole',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.RoleList = data;
        })
    }

    function BindUserBranch(departmentId) {
        $scope.allowToOtherBr = false;
        $scope.ddlBranchUser = null;
        $scope.DepartmentListForUser = [];
        $scope.UserDepartmentList = [];
        $scope.SectionList = [];

        var dept = Enumerable.From($scope.DepartmentList).Where("$.DepartmentId === " + departmentId).FirstOrDefault();

        if ($scope.ddlDepartment != null && !angular.isUndefined(dept) && dept.IsUnit) {
            $http({
                url: '/Employee/GetSectionByDepartmentId?departmentId=' + departmentId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.SectionList = data;
                if (IsEdit) {
                    var objUnit = Enumerable.From($scope.SectionList).Where("$.SectionId ==" + $scope.ad_Employee.SectionId).FirstOrDefault();
                    $scope.ddlSection = objUnit;
                }

            });
        }
    }
    function SaveEmployee() {
        var parms = JSON.stringify({ employee: $scope.ad_Employee });
        $http.post('/Employee/SaveEmployee', parms).success(function (data) {
            if (data > 0) {
                if ($scope.userAccount) {
                    $scope.s_User.EmployeeId = data;
                    $scope.s_User.RoleId = $scope.ddlRole.RoleId;
                    $scope.s_User.IsActive = $scope.ad_Employee.IsActive;
                    var parms = JSON.stringify({ user: $scope.s_User, userDepartmentList: $scope.UserDepartmentList });
                    $http.post('/User/SaveUser', parms).success(function (data) {
                        $scope.userAccount = false;
                    }).error(function (data) {
                        alertify.log('Server Errors!', 'error', '5000');
                    });
                }
                alertify.log('Employee Saved Successfully!', 'success', '5000');

                Clear();
                $('.nav-tabs a:first').tab('show');
                $scope.userForm.$setPristine();
                $scope.userForm.$setUntouched();
            } else {
                alertify.log('Save Failed!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    function UpdateEmployee() {
        var parms = JSON.stringify({ employee: $scope.ad_Employee });
        $http.post('/Employee/SaveEmployee', parms).success(function (data) {
            if (data > 0) {
                if ($scope.userAccount) {
                    $scope.s_User.EmployeeId = $scope.ad_Employee.EmployeeId;
                    $scope.s_User.RoleId = $scope.ddlRole.RoleId;
                    $scope.s_User.IsActive = $scope.ad_Employee.IsActive;
                    var parms = JSON.stringify({ user: $scope.s_User, userDepartmentList: $scope.UserDepartmentList });
                    if ($scope.userFlag) {
                        $http.post('/User/UpdateUser', parms).success(function (data) {
                            $scope.userAccount = false;
                        }).error(function (data) {
                            alertify.log('Server Errors!', 'error', '5000');
                        });
                    } else {
                        $http.post('/User/SaveUser', parms).success(function (data) {
                            $scope.userAccount = false;
                        }).error(function (data) {
                            alertify.log('Server Errors!', 'error', '5000');
                        });
                    }
                }
                else {
                    var parms = JSON.stringify({ employeeId: $scope.ad_Employee.EmployeeId });
                    $http.post('/User/DeleteUser', parms).success(function (data) {
                    }).error(function (data) {
                        alertify.log('Server Errors!', 'error', '5000');
                    });
                }
                alertify.log('Employee Updated Successfully!', 'success', '5000');
                Clear();
                $scope.userForm.$setPristine();
                $scope.userForm.$setUntouched();
            } else {
                alertify.log('Update Failed!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }


    $scope.flexibleOnDateChange = function () {

        $scope.ad_Employee.IsFlexibleOnTime = $scope.ad_Employee.IsFlexibleOnDate

    }

    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetEmployeePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetEmployeePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetEmployeePaged($scope.currentPage);
        }
    }

    $scope.SecureLoginChange = function () {
        if ($scope.reqSmsCode) {
            $scope.s_User.SmsMobileNo = $scope.ad_Employee.ContactNo;
        }
        else {
            $scope.s_User.SmsMobileNo == '';
        }
    }

    $scope.BindUserBranch = function (branchId) {
        BindUserBranch(branchId);
    }

    $scope.RefreshDepartmentDdl = function (branchId) {
        $scope.ad_Employee.EmployeeCode = "";
        $scope.DepartmentList = [];
        GetAllActiveDepartmentByBranchId(branchId, null);
    }

    $scope.RefreshDepartmentUserDdl = function (branchId) {
        $scope.DepartmentListForUser = [];
        GetAllActiveDepartmentByBranchIdForUser(branchId, null);
    }

    $scope.RefreshDesignationDdl = function (deptId) {
        //$scope.DesignationList = [];
        //GetActiveDesignationByDepartmentId(deptId);
    }

    $scope.CheckUser = function (user) {
        if (user) {
            $scope.IsUserAccount = true;
            $scope.s_User.SmsMobileNo = $scope.ad_Employee.ContactNo;
        }
        else {
            $scope.IsUserAccount = false;
        }
    }

    $scope.AddEmployee = function () {
        if ($scope.foundCode) {
            $('#tbxEmployeeCode').focus();
        }
        else {
            if($('#txtJoiningDate').val() === ''){
                alertify.log('Please Select Joining Date', 'error', '5000');
                return;
            }
            if ($scope.ad_Employee.Gender != "Male" && $scope.ad_Employee.Gender != "Female") {
                alertify.log('Please Select Gender', 'error', '5000');
                return;
            }
            $scope.ad_Employee.CreatorId = $scope.UserId; //Add Unit DDL in Page & get value from it
            $scope.ad_Employee.UpdatorId = $scope.UserId;
            $scope.ad_Employee.DepartmentId = $scope.ddlDepartment.DepartmentId;
            $scope.ad_Employee.DesignationId = $scope.ddlDesignation.DesignationId;

            if ($scope.ddlDesignation.DesignationName == 'Marketing Executive') {
                if (angular.isUndefined($scope.ddlMktManger) || $scope.ddlMktManger == null || $scope.ddlMktManger == "") {
                    $("#ddlMktManger").focus();
                    alertify.log("Please Select a Manager.", "error", 5000);
                    return;
                } else {
                    $scope.ad_Employee.ManagerId = $scope.ddlMktManger.EmployeeId;
                }
            } else {
                $scope.ad_Employee.ManagerId = 0;
            }


            if ($scope.userAccount) {
                $scope.ad_Employee.IsUser = true;
                if ($scope.s_User.Username == undefined || $scope.s_User.Username == '' || $scope.s_User.Password == undefined || $scope.s_User.Password == '' || $scope.s_User.rtyPassword == undefined || $scope.s_User.rtyPassword == '' || $scope.ddlRole == undefined || $scope.ddlRole == null) {
                    alertify.log('Please provide all User Information!', 'error', '5000');
                    return;
                }
                else if ($scope.reqSmsCode) {
                    if ($scope.s_User.SmsMobileNo == undefined || $scope.s_User.SmsMobileNo == '') {
                        alertify.log('Please provide Mobile No for Secure login', 'error', '5000');
                        return;
                    }
                    $scope.s_User.IsReqSmsCode = true;
                }
                else {
                    $scope.s_User.IsReqSmsCode = false;
                }
            }
            else {
                $scope.ad_Employee.IsUser = false;
            }

            var dob = $("#txtDateOfBirth").val().split("/");
            var dobf = new Date(dob[2], dob[1] - 1, dob[0]);
            $scope.ad_Employee.DateOfBirth = dobf;

            var joiningDate = $("#txtJoiningDate").val().split("/");
            var joiningDatef = new Date(joiningDate[2], joiningDate[1] - 1, joiningDate[0]);
            $scope.ad_Employee.JoiningDate = joiningDatef;

            if ($("#txtFinishDate").val() != "") {
                var finishDate = $("#txtFinishDate").val().split("/");
                var finishDatef = new Date(finishDate[2], finishDate[1] - 1, finishDate[0]);
                $scope.ad_Employee.FinishDate = finishDatef;
            }
            else
                $scope.ad_Employee.FinishDate = null;

            if ($scope.userAccount && $scope.found) {
                $('#txtUsername').focus();
            }
            else {
                var dept = { BranchId: $scope.ddlBranch.BranchId, BranchName: $scope.ddlBranch.BranchName, DepartmentId: $scope.ddlDepartment.DepartmentId, DepartmentName: $scope.ddlDepartment.DepartmentName };
                $scope.UserDepartmentList.push(dept);
                if ($scope.ConfirmationMessageForAdmin) {



                    if ($scope.ad_Employee.EmployeeId == 0 && $scope.CreatePermission) {
                        alertify.confirm("Are you sure to save?", function (e) {
                            if (e) {
                                SaveEmployee();
                            }
                        })
                    }
                    else if ($scope.ad_Employee.EmployeeId == 0 && !$scope.CreatePermission) {
                        alertify.log('You do not have permission to save!', 'error', '5000');
                    }
                    else if ($scope.ad_Employee.EmployeeId > 0 && $scope.RevisePermission) {
                        alertify.confirm("Are you sure to update?", function (e) {
                            if (e) {
                                UpdateEmployee();
                            }
                        })
                    }
                    else if ($scope.ad_Employee.EmployeeId > 0 && !$scope.RevisePermission) {
                        alertify.log('You do not have permission to Update!', 'error', '5000');
                    }
                }




                else {
                    if ($scope.ad_Employee.EmployeeId == 0 && $scope.CreatePermission) {
                        SaveEmployee();
                    }
                    else if ($scope.ad_Employee.EmployeeId == 0 && !$scope.CreatePermission) {
                        alertify.log('You do not have permission to save!', 'error', '5000');
                    }
                    else if ($scope.ad_Employee.EmployeeId > 0 && $scope.RevisePermission) {
                        UpdateEmployee();
                    }
                    else if ($scope.ad_Employee.EmployeeId > 0 && !$scope.RevisePermission) {
                        alertify.log('You do not have permission to Update!', 'error', '5000');
                    }
                }
            }
        }
    }

    $scope.SelEmployee = function (employee) {
        $scope.ad_Employee = employee;
        if ($scope.ad_Employee.IsUser) {
            $scope.userAccount = true;
            $scope.userFlag = true;
            GetUserByEmployeeId($scope.ad_Employee.EmployeeId);
        } else {
            $scope.userAccount = false;
            $scope.userFlag = false;
        }
        $scope.btnSave = "Update";
        $scope.btnDeleleShow = false;
        $window.scrollTo(0, 0);
        var res = employee.DateOfBirth.substring(0, 5);
        if (res == "/Date") {
            var parsedDate = new Date(parseInt($scope.ad_Employee.DateOfBirth.substr(6)));
            //$scope.ad_Employee.DateOfBirth = $filter('date')(parsedDate, 'dd/MM/yyyy');
            $("#txtDateOfBirth").val($filter('date')(parsedDate, 'dd/MM/yyyy'));
        }

        var res2 = employee.JoiningDate.substring(0, 5);
        if (res2 == "/Date") {
            var parsedDate = new Date(parseInt($scope.ad_Employee.JoiningDate.substr(6)));
            $("#txtJoiningDate").val($filter('date')(parsedDate, 'dd/MM/yyyy'));
        }

        if (employee.FinishDate != null) {
            var res3 = employee.FinishDate.substring(0, 5);
            if (res3 == "/Date") {
                var parsedDate = new Date(parseInt($scope.ad_Employee.FinishDate.substr(6)));
                $("#txtFinishDate").val($filter('date')(parsedDate, 'dd/MM/yyyy'));
            }
        }
        
        GetAllActiveDepartmentByBranchId($scope.ad_Employee.BranchId, $scope.ad_Employee.DepartmentId);
        GetDesignationByDepartmentId(0);
        BindUserBranch($scope.ad_Employee.BranchId);
        $scope.ddlBranch = { "BranchId": $scope.ad_Employee.BranchId };
        $scope.ddlDepartment = { "DepartmentId": $scope.ad_Employee.DepartmentId };
        $scope.ddlDesignation = { "DesignationId": $scope.ad_Employee.DesignationId };
        $scope.ddlMktManger = { "EmployeeId": $scope.ad_Employee.ManagerId };
        $scope.ddlGrade = { "GradeId": $scope.ad_Employee.GradeId };
        $scope.ddlContract = { "ContractTypeId": $scope.ad_Employee.ContractTypeId };
    }

    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ EmployeeId: $scope.ad_Employee.EmployeeId });
                $http.post('/Employee/DeleteEmployee', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Employee Deleted Successfully!', 'success', '5000');
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
        $('.nav-tabs a:first').tab('show');
        $scope.userForm.$setPristine();
        $scope.userForm.$setUntouched();
        $('#tbxTitle').focus(100)
    }

    //Duplicacy check start
    $scope.CheckDuplicateUsername = function () {
        var criteria = ' Username=\'' + $scope.s_User.Username + '\'';
        if ($scope.ad_Employee.EmployeeId != 0) {
            criteria += ' AND EmployeeId<>' + $scope.ad_Employee.EmployeeId;
        }

        $http({
            url: '/User/GetUserDynamic?searchCriteria=' + criteria + '&orderBy=Username',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.s_User.Username + ' already exists!', 'already', '5000');
                $('#txtUsername').focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    }

    $scope.CheckDuplicateEmployeeCode = function () {
        var criteria = " EmployeeCode='" + $scope.ad_Employee.EmployeeCode + "' AND D.BranchId=" + $scope.ddlBranch.BranchId;
        if ($scope.ad_Employee.EmployeeId != 0) {
            criteria += ' AND EmployeeId<>' + $scope.ad_Employee.EmployeeId;
        }

        $http({
            url: '/Employee/GetUserDynamic?searchCriteria=' + criteria + '&orderBy=FirstName ',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_Employee.EmployeeCode + ' already exists!', 'already', '5000');
                $('#tbxEmployeeCode').focus();
                $scope.foundCode = true;
            } else {
                $scope.foundCode = false;
            }
        });
    }

    $scope.foundChange = function () {
        $scope.found = true;
    }

    $scope.foundChangeCode = function () {
        $scope.foundCode = true;
    }
    //Duplicacy check end

    $scope.ValidateDate = function (dob) {
        var invalidDate = false;
        var dobArray = dob.split("/");
        if ((dobArray[0] > 31) || (dobArray[1] > 12)) {
            invalidDate = true;
        }
        else if ((dobArray[1] == 2) && (dobArray[0] > 29)) {
            invalidDate = true;
        }
        else if ((dobArray[1] == 2) && (dobArray[0] > 28) && ((dobArray[2] % 4) > 0)) {
            invalidDate = true;
        }
        else if (((dobArray[1] == 4) || (dobArray[1] == 6) || (dobArray[1] == 9) || (dobArray[1] == 11)) && (dobArray[0] > 30)) {
            invalidDate = true;
        }
        if (invalidDate) {
            alertify.log('Valid Date of Birth is required', 'error', '5000');
            txtDateOfBirth.focus();
        }
    }

    $scope.AddDepartmentForUser = function () {
        var added = false;
        var dept = { BranchId: $scope.ddlBranchUser.BranchId, BranchName: $scope.ddlBranchUser.BranchName, DepartmentId: $scope.ddlDepartmentUser.DepartmentId, DepartmentName: $scope.ddlDepartmentUser.DepartmentName };
        if ($scope.UserDepartmentList.length) {
            angular.forEach($scope.UserDepartmentList, function (aDept) {
                if (aDept.DepartmentId == dept.DepartmentId) {
                    alertify.log('This Store already added to list', 'error', '5000');
                    added = true;
                }
            })
            if (!added)
                $scope.UserDepartmentList.push(dept);
        }
        else
            $scope.UserDepartmentList.push(dept);
    }

    $scope.SelectUserDepartment = function (index) {
        $scope.SelectedUserDepartmentIndex = index;
        $scope.RemoveBtnShow = true;
    }

    $scope.RemoveDepartmentForUser = function () {
        $scope.UserDepartmentList.splice($scope.SelectedUserDepartmentIndex, 1);
        $scope.SelectedUserDepartmentIndex = -1;
        $scope.RemoveBtnShow = false;
    }
});

app.directive('nxEqualEx', function () {
    return {
        require: 'ngModel',
        link: function (scope, elem, attrs, model) {
            if (!attrs.nxEqualEx) {
                console.error('nxEqualEx expects a model as an argument!');
                return;
            }
            scope.$watch(attrs.nxEqualEx, function (value) {
                // Only compare values if the second ctrl has a value.
                if (model.$viewValue !== undefined && model.$viewValue !== '') {
                    model.$setValidity('nxEqualEx', value === model.$viewValue);
                }
            });
            model.$parsers.push(function (value) {
                // Mute the nxEqual error if the second ctrl is empty.
                if (value === undefined || value === '') {
                    model.$setValidity('nxEqualEx', true);
                    return value;
                }
                var isValid = value === scope.$eval(attrs.nxEqualEx);
                model.$setValidity('nxEqualEx', isValid);
                return isValid ? value : undefined;
            });
        }
    };
});