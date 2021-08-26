app.controller("ChartOfAccountsController", function ($scope, $http) {

    Clear();

    function Clear() {

        //$scope.LoginUser = $cookieStore.get('UserData');
        //$scope.UserId = $scope.LoginUser.UserId;
        // $scope.ScreenId = $cookieStore.get('ChartOfAccountsScreenId');
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.DuplicateAccTypeDetailNameFound = true;
        $scope.Title = "Chart Of Accounts Entry";
        $scope.ChartOfAccounts = {};
        $scope.ChartOfAccounts.AccountId = 0;
        $scope.ChartOfAccounts.ParentId = 0;
        $scope.ChartOfAccounts.IsActive = true;
        $scope.buttonLabel = "Save";
        $scope.ChartOfAccountsList = [];
        $scope.ddlAccountType = null;
        GetAllAccountType();
        $scope.ChartOfAccounts.AccountName = null;
        //GetAllAccountTypeDetailPaged($scope.currentPage);
        //GetUsersPermissionDetails();
        $scope.ConfirmationMessageForAdmin = false;
        //GetConfirmationMessageForAdmin();
        $scope.deleleBtnShow = false;
    }

    function GetAllAccountType() {
        var criteria = " [IsActive]=1";
        $http({
            url: '/AccountType/GetAccountTypeDynamic?searchCriteria=' + criteria + '&orderBy=AccountTypeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AccountTypeList = data;
            console.log($scope.AccountTypeList);
        });
    }

    $scope.CheckDuplicateAccountName = function () {
        var where = "AccountTypeName='" + $scope.AccountType.AccountTypeName + "'";
        if ($scope.AccountType.AccountTypeId > 0)
            where += " AND AccountTypeId<>" + $scope.AccountType.AccountTypeId;
        $http({
            url: "/AccountType/GetAccountNameDynamic?searchCriteria=" + where + "&orderBy=AccountTypeName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.AccountType.AccountTypeName + ' Account Type already exists!', 'already', '5000');
                txtAccountTypeName.focus();
                $scope.DuplicateAccTypeNameFound = true;
            } else {
                $scope.DuplicateAccTypeNameFound = false;
            }
        });
    };

    $scope.GetAccountTypeDetails = function () {
        var criteria = " [IsActive]=1 AND AccountTypeId=" + $scope.ddlAccountType.AccountTypeId;
        $http({
            url: '/AccountType/GetAccountTypeDetailDynamic?searchCriteria=' + criteria + '&orderBy=AccountTypeDetailName',


            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AccountTypeDetailList = data;
            console.log($scope.AccountTypeDetailList);
        });
    }

    $scope.SaveChartOfAcoounts = function () {
        var parms = JSON.stringify({ chartOfAccounts: $scope.ChartOfAccounts });
        $http.post('/ChartOfAccounts/SaveChartofAccounts', parms).success(function (data) {
            if (data > 0) {
                //Clear();
                // $scope.accountTypeForm.$setPristine();
                // $scope.accountTypeForm.$setUntouched();
                $scope.resetForm();
                alertify.log('Chart of Accounts ' + $scope.buttonLabel + 'd Successfully!', 'success', '5000');
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
            GetAllAccountPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetAllAccountTPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetAllAccountPaged($scope.currentPage);
        }
    };

    function GetAllAccountPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/ChartOfAccounts/GetAccountPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ChartOfAccountsList = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    $scope.resetForm = function () {
        Clear();
        $('#txtAccountTypeDetailName').focus();
        $scope.chartOfAccountsForm.$setPristine();
        $scope.chartOfAccountsForm.$setUntouched();
    }

    $scope.SelectAccount = function (chartOfAccount) {
        console.log('done');
    }

    $scope.GetAccounts = function () {
        var criteria = " [IsActive]=1 AND AccountTypeId=" + $scope.ddlAccountType.AccountTypeId;
        $http({
            url: '/AccountType/GetAccountTypeDetailDynamic?searchCriteria=' + criteria + '&orderBy=AccountTypeDetailName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AccountTypeDetailList = data;
            console.log($scope.AccountTypeDetailList);
        });
    }

});