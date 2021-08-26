app.controller("AccountTypeController", function ($scope, $cookieStore, $http) {

    Clear();

    $scope.Title = "Account Type Entry";

    $scope.ClassList = [
        { ClassId: 1, ClassName: 'Asset' },
        { ClassId: 2, ClassName: 'Liability' },
        { ClassId: 3, ClassName: 'Income' },
        { ClassId: 4, ClassName: 'Expense' }
    ];

    function Clear() {
        $scope.LoginUser = $cookieStore.get('UserData');
        $scope.UserId = $scope.LoginUser.UserId;
        $scope.ScreenId = $cookieStore.get('AccountTypeScreenId');
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.DuplicateAccTypeNameFound = false;
        $scope.Title = "Account Type Entry";
        $scope.AccountType = {};
        $scope.AccountType.AccountTypeId = 0;
        $scope.AccountType.IsActive = true;
        $scope.buttonLabel = "Save";
        $scope.AccountTypeList = [];
        $scope.ddlClass = null;
        GetAllAccountTypePaged($scope.currentPage);
        GetUsersPermissionDetails();
        $scope.ConfirmationMessageForAdmin = false;
        //GetConfirmationMessageForAdmin();
        $scope.deleleBtnShow = false;
    }

    function GetUsersPermissionDetails() {

    }

    function GetAllAccountTypePaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/AccountType/GetAccountTypePaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AccountTypeList = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetAllAccountTypePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetAllAccountTypePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetAllAccountTypePaged($scope.currentPage);
        }
    };

    $scope.SelectAccountType = function (accountType) {
        $scope.found = false;
        $scope.AccountType = accountType;
        $scope.ddlClass = { "ClassId": accountType.ClassId };

        $scope.buttonLabel = "Update";
        $scope.deleleBtnShow = false;
    }

    $scope.CheckDuplicateAccTypeName = function () {
        var where = "AccountTypeName='" + $scope.AccountType.AccountTypeName + "'";
        if ($scope.AccountType.AccountTypeId > 0)
            where += " AND AccountTypeId<>" + $scope.AccountType.AccountTypeId;
        $http({
            url: "/AccountType/GetAccountTypeDynamic?searchCriteria=" + where + "&orderBy=AccountTypeName",
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

    $scope.AccTypeNameChange = function () {
        $scope.DuplicateAccTypeNameFound = true;
    };

    $scope.SaveAccountType = function () {
        if ($scope.DuplicateAccTypeNameFound) {
            txtAccountTypeName.focus();
            return;
        }

        var parms = JSON.stringify({ accountType: $scope.AccountType });
        $http.post('/AccountType/SaveAccountType', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Account Type ' + $scope.buttonLabel + 'd Successfully!', 'success', '5000');
                $scope.resetForm();
            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    $scope.resetForm = function () {
        Clear();
        $('#txtAccountTypeName').focus();
        $scope.accountTypeForm.$setPristine();
        $scope.accountTypeForm.$setUntouched();
    }


});