app.controller("BranchEntryController", function ($scope, $cookieStore, $route, $http, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('BranchScreenId');
    $scope.ScreenLockInfo = [];
    Clear();
    function Clear() {
        CheckNet();
        $scope.BranchTypelist = [];
        $scope.BranchGrouplist = [];
        $scope.Branchlist = [];
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.found = false;
        $scope.foundShortName = false;
        $scope.ad_Branch = {};
        $scope.ad_Branch.BranchId = 0;
        $scope.ad_Branch.BranchTypeId = 0;
        $scope.ad_Branch.IsActive = true;
        $scope.ad_Branch.Fax = 'N/A';
        $scope.button = "Save";
        $scope.Show = false;
        $scope.ShowImage = false;
        $scope.ddlBranchGroup = null;
        $scope.ddlBranchType = null;
        GetAllBranchGroup();
        GetBranchType();
        //ScreenLock();
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        GetUsersPermissionDetails();
        GetBranchPaged($scope.currentPage);
        angular.forEach(angular.element("input[type='file']"), function (inputElem) {
            angular.element(inputElem).val(null);

           
        });
    }



    function CheckNet() {
        $http({
            url: '/Branch/CheckInternet',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (status) {
            var sta = status;
        })
    }
    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('BranchScreenId');
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
    function GetAllBranchGroup() {
        $http({
            url: '/Branch/GetAllBranchGroup',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.BranchGrouplist = data;
            $scope.ddlBranchGroup = { GroupId: data[0].GroupId };
            $scope.ad_Branch.GroupId = data[0].GroupId;
        });
    }
    function GetBranchType() {
        //$scope.showLoader = true;
        $http({
            url: '/BranchType/GetAllBranchType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.BranchTypelist = data;
            $scope.ddlBranchType = { BranchTypeId: data[0].BranchTypeId };
            $scope.ad_Branch.BranchTypeId = data[0].BranchTypeId;
            $scope.showLoader = false;
        });
    }
    function GetBranchPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/Branch/GetBranchPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Branchlist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }
    function AddTypeWiseBranch(data) {
        var parms = JSON.stringify({ ad_TypeWiseBranch: { BranchId: data, BranchTypeId: $scope.ddlBranchType.BranchTypeId } });
        $http.post('/Branch/SaveTypeWiseBranch', parms).success(function (data) {
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }
    function SaveBrance(status) {
        var parms = JSON.stringify({ ad_Branch: $scope.ad_Branch });
        $http.post('/Branch/Save', parms).success(function (data) {
            if (data > 0) {
                AddTypeWiseBranch(data);
                if ($scope.ad_Branch.Logo != null) {
                    UploadImage();
                }

                alertify.log('Branch ' + status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.branchEntryForm.$setPristine();
                $scope.branchEntryForm.$setUntouched();
                $("#txtBranchName").focus();
            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }
    function UploadImage(odlUrl) {
        var fd = new FormData();
        //Take the first selected file
        fd.append("file", $scope.UploadFile);
        fd.append("odlUrl", odlUrl);
        $http.post("/Branch/SaveFiles", fd, {
            withCredentials: true,
            headers: { 'Content-Type': undefined },
            transformRequest: angular.identity
        }).success(function (d) {
            //alert('succ');
        })
        .error(function () {
            //alert('err');
        });

    }

    $scope.uploadFile = function (file) {
        $scope.UploadFile = file[0];
        $scope.ad_Branch.Logo = "/UploadedFiles/" + file[0].name;
    }
    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetBranchPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetBranchPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetBranchPaged($scope.currentPage);
        }
    }
    $scope.CheckDuplicateBranchName = function () {
        var criteria = '1=1';
        if ($scope.ad_Branch.BranchId == 0) {
            criteria += ' AND BranchName=\'' + $scope.ad_Branch.BranchName.toLowerCase() + '\'';
        } else {
            criteria += ' AND BranchName=\'' + $scope.ad_Branch.BranchName.toLowerCase() + '\' AND BranchId<>' + $scope.ad_Branch.BranchId;
        }
        $http({
            url: '/Branch/GetDynamic?searchCriteria=' + criteria + '&orderBy=BranchName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_Branch.BranchName + ' already exists!', 'already', '5000');
                txtBranchName.focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    }
    $scope.CheckDuplicateBranchShortName = function () {
        if ($scope.ad_Branch.BranchShortName.charAt(0).toLowerCase() == 'u') {
            alertify.log('First letter of Branch Short Name cannot be U', 'error', '5000');
            
        }

        var criteria = "BranchShortName='" + $scope.ad_Branch.BranchShortName.toLowerCase() + "'";
        if ($scope.ad_Branch.BranchId > 0)
            criteria += " AND BranchId<>" + $scope.ad_Branch.BranchId;

        $http({
            url: '/Branch/GetDynamic?searchCriteria=' + criteria + '&orderBy=BranchShortName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_Branch.BranchShortName + ' already exists!', 'already', '5000');
                $('#txtBranchShortName').focus();
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
    $scope.AddBranch = function () {
        if ($scope.found) {
            $('#txtBranchName').focus();
        }
        else if ($scope.foundShortName) {
            $('#txtBranchShortName').focus();
        }
        else if ($scope.ad_Branch.BranchShortName.charAt(0).toLowerCase() == 'u') {
            alertify.log('First letter of Branch Short Name cannot be U', 'error', '5000');
            $('#txtBranchShortName').focus();
        }
        else {
            $scope.ad_Branch.GroupId = $scope.ddlBranchGroup.GroupId;
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_Branch.BranchId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?",
                        function(e) {
                            if (e) {
                                SaveBrance('Saved');
                            }
                        });
                }
                else if ($scope.ad_Branch.BranchId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_Branch.BranchId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SaveBrance('Updated');
                        }
                    })
                }
                else if ($scope.ad_Branch.BranchId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_Branch.BranchId == 0 && $scope.CreatePermission) {
                    SaveBrance('Saved');
                }
                else if ($scope.ad_Branch.BranchId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_Branch.BranchId > 0 && $scope.RevisePermission) {
                    SaveBrance('Updated');
                }
                else if ($scope.ad_Branch.BranchId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    }
    $scope.SelBranch = function (aBranch) {
        $scope.ad_Branch = aBranch;
        $scope.button = "Update";
        $scope.Show = false;
        $scope.ddlBranchGroup = { "GroupId": aBranch.GroupId };
        $scope.ddlBranchType = { "BranchTypeId": aBranch.BranchTypeId };
        $scope.ShowImage = true;
        $scope.ImageSRC = aBranch.Logo;
        $window.scrollTo(0, 0);
    }
    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ BranchId: $scope.ad_Branch.BranchId, oldUrl: $scope.ImageSRC });
                $http.post('/Branch/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Branch Deleted Successfully!', 'success', '5000');
                        Clear();
                        $scope.branchEntryForm.$setPristine();
                        $scope.branchEntryForm.$setUntouched();
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
        $scope.branchEntryForm.$setPristine();
        $scope.branchEntryForm.$setUntouched();
    }
});