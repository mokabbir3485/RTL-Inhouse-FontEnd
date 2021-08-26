app.controller("IssueApproveController", function ($scope, $cookieStore, $http, $filter) {

    //#region variable
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.userId = $scope.LoginUser.UserId;
    $scope.inv_StockIssue = new Object;
    $scope.inv_StockIssueDetail = new Object;
    $scope.UnApproveIssueList = [];
    $scope.IssueDetailList = [];
    $scope.employeeList = [];
    $scope.showContent = false;
    //#endregion

    //#region call Function
    GetAllEmployee();
    GetAllUnApprovedIssue();
    //#endregion

    //#region Functions or Methods
    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.employeeList = data;
            $scope.UserData = $cookieStore.get('UserData');
            $scope.ddlApproveBy = { "EmployeeId": $scope.UserData.EmployeeId };
        });
    }

    function GetAllUnApprovedIssue() {
        var SearchCriteria = '[IsApproved]=0 and IssueToDepartmentId IN (select DepartmentId from s_UserDepartment where UserId=' + $scope.userId + ')';
        $http({
            url: '/IssueWithoutRequisition/GetIssueDynamic?searchCriteria=' + SearchCriteria + '&orderBy=IssueToDepartmentName,[IssueDate]',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (unApproveIssueList) {
            angular.forEach(unApproveIssueList, function (aIssue) {
                var dateString = aIssue.IssueDate.substr(6);
                var currentTime = new Date(parseInt(dateString));
                var month = currentTime.getMonth() + 1;
                var day = currentTime.getDate();
                var year = currentTime.getFullYear();
                var date = day + "/" + month + "/" + year;
                aIssue.IssueDate = date;
            })
            $scope.UnApproveIssueList = unApproveIssueList;
        });
    }

    function GetIssueDetailByIssueId(issueId) {
        $http({
            url: '/IssueWithoutRequisition/GetIssueDetailByIssueId?IssueId=' + issueId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (issueDetailList) {
            $scope.IssueDetailList = issueDetailList;
        });
    }

    //#endregion

    //#region Events
    $scope.CellClick = function (unApproveIssue) {
        $scope.issueId = unApproveIssue.IssueId;
        GetIssueDetailByIssueId($scope.issueId);
        $scope.showContent = true;
        GetAllUnApprovedIssue();
        $scope.Date = '';
        //$scope.ddlApproveBy = [0];
    }

    $scope.Approve = function () {
        var from = $("#txtDate").val().split("/");
        var f = new Date(from[2], from[1] - 1, from[0]);
        $scope.inv_StockIssue.ApprovedDate = f;

        $scope.inv_StockIssue.IssueId = $scope.issueId;
        $scope.inv_StockIssue.ApprovedBy = $scope.ddlApproveBy.EmployeeId;
        $scope.inv_StockIssue.IsApproved = true;
        var parms = JSON.stringify({ stockIssue: $scope.inv_StockIssue });
        $http.post('/IssueWithoutRequisition/IssueApproveWithoutRequesition', parms).success(function (issueApprove) {
            //if (issueApprove > 0) {
                angular.forEach($scope.IssueDetailList, function (issueDetailApprove) {
                    var parms = JSON.stringify({ issueDetailApprove: issueDetailApprove });
                    $http.post('/IssueApprove/IssueApproveDetail', parms).success(function (success) {
                            alertify.log('Issue Receive successfully!', 'success', '5000');
                    })
                })
            
            GetAllUnApprovedIssue();
            $scope.showContent = false;
           
        })


    }
    //#endregion

});