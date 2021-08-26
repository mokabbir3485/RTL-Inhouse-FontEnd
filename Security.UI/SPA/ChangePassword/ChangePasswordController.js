app.controller("ChangePasswordController", function ($scope, $cookieStore, $route, $http) {
    $scope.message = "Hello!";

    $scope.roleList = [];
    $scope.roleList2 = [];
    $scope.roleList3 = [];
    //$scope.roleList4 = [];

    $scope.level1 = {};
    $scope.level1.roleName = 'L1';
    $scope.level1.collapsed = true;
    $scope.level1.children = $scope.roleList2;

    $scope.level2 = {};
    $scope.level2.roleName = 'L2';
    $scope.level2.collapsed = true;
    $scope.level2.children = $scope.roleList3;

    $scope.level3 = {};
    $scope.level3.roleName = 'L3'

    $scope.roleList3.push($scope.level3);
    $scope.roleList2.push($scope.level2);
    $scope.roleList.push($scope.level1);

    //For Screen lock
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('ChangePasswordScreenId');
    $scope.ScreenLockInfo = [];

    //ScreenLock();
    //Lock Screen by user
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

    //User configuration start
    $scope.ConfirmationMessageForAdmin = false;
    function GetConfirmationMessageForAdmin() {
        $http({
            url: '/Role/GetConfirmationMessageForAdmin',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ConfirmationMessageForAdmin = (data === 'true');
        });
    }
    GetConfirmationMessageForAdmin();
    //User configuration end

    function Clear() {
        txtNewPassword.focus();
        //For Creator details Start
        $scope.LoginUser = $cookieStore.get('UserData');
        $scope.UserId = $scope.LoginUser.UserId;

        $scope.s_User = new Object();
        $scope.s_User.UserId = $scope.UserId;
        
        //End
        $scope.s_User.CreatorId = $scope.UserId;
        $scope.s_User.UpdatorId = $scope.UserId;

    }

    Clear();
    $scope.ChangePassword = function () {
        $scope.s_User.Password = $scope.s_User.ReNewPassword;
        if ($scope.ConfirmationMessageForAdmin) {
            alertify.confirm("Are you sure to change?", function(e) {
                if (e) {
                    var parms = JSON.stringify({ s_User: $scope.s_User });
                    $http.post('/ChangePassword/ChangePasswordByUserId', parms).success(function(data) {
                        if (data == 1) {
                            alertify.log('Password Changed Successfully!', 'success', '5000');
                            Clear();

                            $scope.changePasswordForm.$setPristine();
                            $scope.changePasswordForm.$setUntouched();

                        } else {
                            alertify.log('Password Change Failed!', 'error', '5000');
                        }
                    }).error(function(data) {
                        alertify.log('Server Errors!', 'error', '5000');
                    });
                }
            });
        }
        else {
            var parms = JSON.stringify({ s_User: $scope.s_User });
            $http.post('/ChangePassword/ChangePasswordByUserId', parms).success(function (data) {
                if (data == 1) {
                    alertify.log('Password Changed Successfully!', 'success', '5000');
                    Clear();

                    $scope.changePasswordForm.$setPristine();
                    $scope.changePasswordForm.$setUntouched();

                } else {
                    alertify.log('Password Change Failed!', 'error', '5000');
                }
            }).error(function (data) {
                alertify.log('Server Errors!', 'error', '5000');
            });
        }
    };

    $scope.resetForm = function () {
        Clear();
        $scope.changePasswordForm.$setPristine();
        $scope.changePasswordForm.$setUntouched();
        $route.reload();
        //$scope.branchTypeEntryForm.BranchTypeName.$error = new Object();
    };
    ////SignalR start

    //var myHub = $.connection.getCurrentQuantity;

    //myHub.client.sharedLiveQuantity = function () {
    //    Focus();
    //    $scope.$apply();
    //}
    //$.connection.hub.start().done(function () {

    //});
    ////SignalR end
    //$scope.currentQtyList = '';
    //function GetCurrentQty() {
    //    $http({
    //        url: '/Setup/GetCurrentQty',
    //        method: 'GET',
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (data) {
    //        $scope.currentQtyList = data;
    //        $scope.inv_StockValuation = data;
    //        $scope.display = $scope.inv_StockValuation.CurrentQuantity;
    //    })
    //}
    //function Focus() {
    //    $scope.inv_StockValuation = new Object();
    //    GetCurrentQty();
    //}
    //Focus();
    ////For Test

    ////insert data into DB
    //$scope.buttonTitle = "Save";
    //$scope.ad_BranchType = new Object();
    //$scope.AddBranchType = function () {
    //    var parms = JSON.stringify({ branchType: $scope.ad_BranchType });
    //    $http.post('/BranchType/Save', parms).success(function () {
    //        alertify.log('Save Successfully!', 'success', '5000');
    //        getAllBranch();
    //        $scope.buttonTitle = "Save";
    //        $scope.showButton = false;
    //        $scope.ad_BranchType.BranchTypeName = "";
    //    })
    //};
    ////retrive data from db
    //$scope.BrancTypeList = [];
    //function getAllBranch() {
    //    $http({
    //        url: '/BranchType/GetAllBranchType',
    //        method: 'GET',
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (data) {
    //        $scope.BrancTypeList = data;
    //    });
    //};
    //getAllBranch();
    //$scope.showButton = false;
    ////table row click
    //$scope.selBranch = function (branchtype) {
    //    $scope.ad_BranchType = branchtype;
    //    window.scrollTo(0, 0);//scroll along the x-axis (horizontal),in pixels & Required. The coordinate to scroll to, along the y-axis (vertical), in pixels
    //    $scope.buttonTitle = "Update";
    //    $scope.showButton = true;
    //};
    //$scope.Delete = function () {
    //    var parms = JSON.stringify({ BranchTypeId: $scope.ad_BranchType.BranchTypeId });
    //    $http.post('/BranchType/Delete', parms).success(function () {
    //        alertify.log('Delete Successfully!', 'success', '5000');
    //        getAllBranch();
    //        $scope.buttonTitle = "Save";
    //        $scope.showButton = false;
    //        $scope.ad_BranchType.BranchTypeName = "";
    //    }); 
    //};
    //end test

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