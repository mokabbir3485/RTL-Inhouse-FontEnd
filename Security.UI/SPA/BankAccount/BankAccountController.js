app.controller("BankAccountController", function ($scope, $cookieStore, $http, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('BankAccountScreenId');

    function Clear() {
      
        $scope.AccountForList = [{ AccountFor: "Exporter" }, { AccountFor: "Customer" }, { AccountFor: "Salary" }];
        $scope.BankAccountList = [];
        $scope.CompanyList = [];
        $scope.CompanyDropdownList = [];
        $scope.ad_BankAccount = {};
        $scope.ad_BankAccount.BankAccountId = 0;
        //$scope.ddlAccountFor = '';
        //$scope.ddlAccountRef = '';
        $scope.ad_BankAccount.IsActive = true;
        $scope.btnDeleleShow = false;
        $scope.ConfirmationMessageForAdmin = false;
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0; 
        $scope.button = "Save";
        GetActiveCompany();
        GetAllBankAccount();
        GetUsersPermissionDetails();
        GetDesignationPaged($scope.currentPage);
        GetConfirmationMessageForAdmin();
    }
    Clear();
    function GetAllExporter() {

        $http({
            url: '/BankAccount/GetAllBankAccount',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.BankAccountList = data;
        });
    }
    function GetAllImporter() {

        $http({
            url: '/BankAccount/GetAllBankAccount',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.BankAccountList = data;
        });
    }
    
    function GetAllBankAccount() {
        
        $http({
            url: '/BankAccount/GetAllBankAccount',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.BankAccountList = data;
        });
    }
    function SaveBankAccount(Status) {
       
        var parms = JSON.stringify({ ad_BankAccount: $scope.ad_BankAccount });
        $http.post('/BankAccount/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Bank ' + Status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.bankAccountForm.$setPristine();
                $scope.bankAccountForm.$setUntouched();

            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
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
    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('DesignationScreenId');
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
    function GetActiveCompany() {
        var criteria = "C.IsActive=1";
        $http({
            url: '/Company/GetCompanyDynamic?searchCriteria=' + criteria + "&orderBy=CompanyName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CompanyList = data;
           
        })
    }

    $scope.GetAccountFor = function (AccountFor) {
        if (!angular.isUndefined($scope.ddlAccountFor) && $scope.ddlAccountFor != null) {
            var criteria = "C.IsActive=1";
            
            if (AccountFor == 'Customer')
            {
               
                $http({
                    url: '/Company/GetCompanyDynamic?searchCriteria=' + criteria + "&orderBy=CompanyName",
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {

                    angular.forEach(data, function (aData) {
                        $scope.CompanyDropdownList.push(aData);

                    });
                })
            }
            else if (AccountFor == 'Exporter') {

                $scope.CompanyDropdownList = [];
                
            }
           
           
        } 
    }
   function GetCompanyByAccountFor(AccountFor) {
        if (!angular.isUndefined($scope.ddlAccountFor) && $scope.ddlAccountFor != null) {
            var criteria = "C.IsActive=1";

            if (AccountFor == 'Customer') {

                $http({
                    url: '/Company/GetCompanyDynamic?searchCriteria=' + criteria + "&orderBy=CompanyName",
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {

                    angular.forEach(data, function (aData) {
                        $scope.CompanyDropdownList.push(aData);

                    });
                })
            }
            else if (AccountFor == 'Exporter') {

                $scope.CompanyDropdownList = [];

            }


        } 
    }
  
    $scope.SelBankAccount = function (aBankAccount) {
        $scope.ad_BankAccount = aBankAccount;
        $scope.ddlAccountFor = { AccountFor: aBankAccount.AccountFor };
        GetCompanyByAccountFor(aBankAccount.AccountFor);
        $scope.ddlAccountRef = { CompanyId: aBankAccount.AccountRefId}
        $scope.button = "Update";
        $scope.btnDeleleShow = false;
    };
    $scope.SaveBankAccount = function () {
        $scope.ad_BankAccount.UpdatorId = $scope.UserId;
       
        if ($scope.found) {
            $('#txtBankAccountName').focus();
        }
        else {
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_BankAccount.BankAccountId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SaveBankAccount('Saved');
                        }
                    })
                }
                else if ($scope.ad_BankAccount.BankAccountId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
              
                else if ($scope.ad_BankAccount.BankAccountId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SaveBankAccount('Updated');
                        }
                    })
                }
                else if ($scope.ad_BankAccount.BankAccountId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_BankAccount.BankAccountId == 0 && $scope.CreatePermission) {
                    SaveBankAccount('Saved');
                }
                else if ($scope.ad_BankAccount.BankAccountId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_BankAccount.BankAccountId > 0 && $scope.RevisePermission) {
                    SaveBankAccount('Updated');
                }
                else if ($scope.ad_BankAccount.BankAccountId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    };

    $scope.resetForm = function () {
        Clear();
        $scope.bankAccountForm.$setPristine();
        $scope.bankAccountForm.$setUntouched();
    }
    function GetDesignationPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/BankAccount/GetBankAccountPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.BankAccountList= data.ListData;
            $scope.total_count = data.TotalRecord;
           
        });
    }
  
    $scope.getData = function (curPage) {
     
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetDesignationPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
         
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetDesignationPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetDesignationPaged($scope.currentPage);
       
        }
    }

    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ roleId: $scope.s_Role.RoleId });
                $http.post('/BankAccount/Delete', parms).success(function (data) {
                    if (data > 0) {
                       
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

});
