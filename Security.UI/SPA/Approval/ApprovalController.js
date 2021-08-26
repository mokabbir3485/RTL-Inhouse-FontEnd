app.controller("ApprovalController", function ($scope, $http, $cookieStore) {
    $scope.GetForApprovalList = [];
    $scope.ModuleList = [];
    Clear();
    function Clear() {
        $scope.ddlModule = new Object();
        GetModuleExAdminSecurity();
        GetForApproval(null);
    }

    $scope.loadGridBasedOnModule = function () {
        GetForApproval($scope.ddlModule.ModuleId);
    }

    function GetModuleExAdminSecurity() {
        $http({
            url: '/Approval/GetModuleExAdminSecurity',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ModuleList = Enumerable.From(data).Where('$.ModuleName!="Common"').ToArray();
        });
    }

    function GetForApproval(moduleId) {
        var paramId = moduleId = undefined ? null : moduleId;
        $http({
            url: '/Approval/GetForApproval?moduleId=' + paramId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.GetForApprovalList = data;
        });
    }
    
    $scope.Save = function () {
        angular.forEach($scope.GetForApprovalList, function (aApprovalList) {
            $scope.LoginUser = $cookieStore.get('UserData');
            aApprovalList.CreatorId = $scope.LoginUser.UserId;
            aApprovalList.UpdatorId = $scope.LoginUser.UserId;
            var parms = JSON.stringify({ _ad_Approval: aApprovalList });
            $http.post('/Approval/Add', parms).success(function (ReturnId) {               
            }).error(function (data) {
                alertify.log('Server Save Errors!', 'error', '5000');
            });
        })
        alertify.success('Approval Configuration Updated !', 'error', '5000');        
        $state.reload();
    }
});