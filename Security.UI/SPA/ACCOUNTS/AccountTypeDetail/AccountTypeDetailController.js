app.controller("AccountTypeDetailController", function ($scope, $cookieStore, $http) {

    Clear();
    $scope.Title = "Account Type Detail Entry";

    function GetAllAccountType() {
        var criteria = " [IsActive]=1";
        $http({
            url: '/AccountType/GetAccountTypeDynamic?searchCriteria=' + criteria + '&orderBy=AccountTypeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AccountTypeList = data;
        });
    }

    function Clear() {
        $scope.LoginUser = $cookieStore.get('UserData');
        $scope.UserId = $scope.LoginUser.UserId;
        $scope.ScreenId = $cookieStore.get('AccountTypeScreenId');

        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.DuplicateAccTypeDetailNameFound = true;
        $scope.Title = "Account Type Detail Entry";
        $scope.AccountTypeDetail = {};
        $scope.AccountTypeDetail.AccountTypeDetailId = 0;
        $scope.AccountTypeDetail.IsActive = true;
        $scope.buttonLabel = "Save";
        $scope.AccountTypeDetailList = [];
        $scope.ddlAccountType = null;
        GetAllAccountType();
        GetAllAccountTypeDetailPaged($scope.currentPage);
        GetUsersPermissionDetails();
        $scope.ConfirmationMessageForAdmin = false;
        //GetConfirmationMessageForAdmin();
        $scope.deleleBtnShow = false;
    }

    function GetUsersPermissionDetails() {

    }

    function GetAllAccountTypeDetailPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/AccountType/GetAccountTypeDetailPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AccountTypeDetailList = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    $scope.CheckDuplicateAccTypeDetailName = function () {
        var where = "AccountTypeDetailName='" + $scope.AccountTypeDetail.AccountTypeDetailName + "'";
        if ($scope.AccountTypeDetail.AccountTypeId > 0)
            where += " AND AccountTypeId<>" + $scope.AccountTypeDetail.AccountTypeId;
        $http({
            url: "/AccountType/GetAccountTypeDetailDynamic?searchCriteria=" + where + "&orderBy=AccountTypeDetailName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.AccountTypeDetail.AccountTypeDetailName + ' Account Type Detail already exists!', 'already', '5000');
                txtAccountTypeDetailName.focus();
                $scope.DuplicateAccTypeDetailNameFound = true;
            } else {
                $scope.DuplicateAccTypeDetailNameFound = false;
            }
        });
    };

    $scope.AccTypeDetailNameChange = function () {
        $scope.DuplicateAccTypeDetailNameFound = true;
    };

    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetAllAccountTypeDetailPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetAllAccountTypeDetailPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetAllAccountTypeDetailPaged($scope.currentPage);
        }
    };

    $scope.SelectAccountTypeDetail = function (accountTypeDetail) {
        $scope.found = false;
        $scope.AccountTypeDetail = accountTypeDetail;
        $scope.ddlAccountType = { "AccountTypeId": accountTypeDetail.AccountTypeId };
        $scope.buttonLabel = "Update";
        $scope.deleleBtnShow = false;
    }

    $scope.SaveAccountTypeDetail = function () {

        if ($scope.DuplicateAccTypeDetailNameFound) {
            txtAccountTypeDetailName.focus();
            return;
        }
        var parms = JSON.stringify({ accountTypeDetail: $scope.AccountTypeDetail });
        $http.post('/AccountType/SaveAccountTypeDetail', parms).success(function (data) {
            if (data > 0) {
                //Clear();
                // $scope.accountTypeForm.$setPristine();
                // $scope.accountTypeForm.$setUntouched();
                $scope.resetForm();
                alertify.log('Account Type Detail ' + $scope.buttonLabel + 'd Successfully!', 'success', '5000');
            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    $scope.resetForm = function () {
        Clear();
        $('#txtAccountTypeDetailName').focus();
        $scope.accountTypeDetailForm.$setPristine();
        $scope.accountTypeDetailForm.$setUntouched();
    }


});