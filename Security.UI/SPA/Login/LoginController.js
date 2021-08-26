app.controller("LoginController", function ($scope, $cookieStore, $http) {
    $scope.UserStatus = [];
    $scope.Ip = '';
    $scope.SmsCode = '';
    $scope.LoginUser = [];
    $scope.s_User = new Object();
    $scope.ValuationSetupCurrent = {};
    $scope.IsReqSmsCode = false;

    function RemoveAllScreenLock(UserId) {
        var parms = JSON.stringify({ userId: UserId });
        $http.post('/Permission/RemoveScreenLock', parms).success(function (data) {
        });
    }

    function GetUser(UserName, Password) {
        try {
            $http({
                url: '/User/GetUserForLogin',
                method: "GET",
                params: { userName: UserName, password: Password },
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.LoginUser = data;
                if ($scope.LoginUser != "" && !$scope.LoginUser.IsReqSmsCode) {
                    if ($scope.LoginUser.IsActive) {
                        $cookieStore.put('UserData', $scope.LoginUser); // Remove cookies into the function 'RemoveCookies' of IndexController
                        RemoveAllScreenLock($scope.LoginUser.UserId);
                        GetUserCurrentStatus($scope.LoginUser.UserId);
                    }
                    else {
                        alertify.log('User is Inactive!', 'error', '5000');
                        // alertify.log(data, 'error', '5000');
                    }
                }
                else if ($scope.LoginUser != "" && $scope.LoginUser.IsReqSmsCode) {
                    $scope.IsReqSmsCode = true;
                    txtLoginCode.focus();
                    $scope.SmsCode = Math.floor(1000 + Math.random() * 9000);
                    document.getElementById("myText2").value = $scope.SmsCode;
                    //Send $scope.SmsCode to $scope.LoginUser.SmsMobileNo
                }
                else {
                    alertify.log('Invalid Login Information!', 'error', '5000');
                }
            })
        }
        catch (e) {
            console.log("Got an error!", e.description);
        }

    }

    function GetHasReceivable() {
        $scope.GetHasReceivable = false;
        $http({
            url: '/Setup/GetHasReceivable',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.GetHasReceivable = (data === 'true');
            if ($scope.GetHasReceivable) {
                $http({
                    url: '/Setup/GetCurrentValuationSetup',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    $scope.ValuationSetupCurrent = data;
                    if ($scope.ValuationSetupCurrent != "") {
                        $cookieStore.put('Valuation', $scope.ValuationSetupCurrent);
                    }
                });
            }
        });
    }

    function GetUserCurrentStatus(UserId) {
        $http({
            url: '/LoginLogoutLog/GetUserCurrentStatus',
            method: "GET",
            params: { userId: UserId },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.UserStatus = data;
            if ($scope.UserStatus.IsLoggedIn) {
                //if ($scope.UserStatus.IpAddress == $scope.Ip) {
                //force log out
                $scope.ad_LoginLogoutLog = new Object();
                $scope.ad_LoginLogoutLog.UserId = $scope.UserStatus.UserId;
                $scope.ad_LoginLogoutLog.LogOutTime = new Date();
                $scope.ad_LoginLogoutLog.IsLoggedIn = false;
                var parms = JSON.stringify({ logInLogOutLog: $scope.ad_LoginLogoutLog });
                $http.post('/User/UpdateLoginInfo', parms).success(function (data) { });
                //log in
                var userStatus = $cookieStore.get('UserData');
                $scope.ad_LoginLogoutLog = new Object();
                $scope.ad_LoginLogoutLog.UserId = userStatus.UserId;
                $scope.ad_LoginLogoutLog.LogInTime = new Date();
                $scope.ad_LoginLogoutLog.IpAddress = $scope.Ip;
                $scope.ad_LoginLogoutLog.IsLoggedIn = true;
                var parms = JSON.stringify({ logInLogOutLog: $scope.ad_LoginLogoutLog });
                $http.post('/User/SaveLoginInfo', parms).success(function (data) { });
                window.location = '/Home/Index#/Home';

                //}
                //else {
                //    alertify.log('Already Logged In At IP: ' + $scope.UserStatus.IpAddress, 'error', '5000');
                //}
            }
            else {
                // log in
                var userStatus = $cookieStore.get('UserData');
                $scope.ad_LoginLogoutLog = new Object();
                $scope.ad_LoginLogoutLog.UserId = userStatus.UserId;
                $scope.ad_LoginLogoutLog.LogInTime = new Date();
                $scope.ad_LoginLogoutLog.IpAddress = $scope.Ip;
                $scope.ad_LoginLogoutLog.IsLoggedIn = true;
                var parms = JSON.stringify({ logInLogOutLog: $scope.ad_LoginLogoutLog });
                $http.post('/User/SaveLoginInfo', parms).success(function (data) { });
                window.location = '/Home/Index#/Home';
            }
        });
    }

    function RemoveCookies() {
        //User Info remove
        $cookieStore.remove('UserData');
        $cookieStore.remove('ValuationSetupCurrent');
        //Permission remove
        //Security
        $cookieStore.remove('UnitPermission');
        $cookieStore.remove('SubcategoryPermission');
        $cookieStore.remove('ScreenPermission');
        $cookieStore.remove('RolePermission');
        $cookieStore.remove('PermissionPermission');
        $cookieStore.remove('ModulePermission');
        //admin
        $cookieStore.remove('ProductPermission');
        $cookieStore.remove('BankEntryPermission');
        $cookieStore.remove('EmployeePermission');
        $cookieStore.remove('DesignationPermission');
        $cookieStore.remove('DepartmentTypePermission');
        $cookieStore.remove('DepartmentPermission');
        $cookieStore.remove('ChangePasswordPermission');
        $cookieStore.remove('CategoryPermission');
        $cookieStore.remove('BranchTypePermission');
        $cookieStore.remove('BranchPermission');
        $cookieStore.remove('PaymentTypePermission');
        $cookieStore.remove('PaymentGroupPermission');
        $cookieStore.remove('SupplierPermission');
        $cookieStore.remove('CustomerTypePermission');
        $cookieStore.remove('CustomerPermission');
        $cookieStore.remove('TerminalPermission');
        $cookieStore.remove('RequisitionPurposePermission');
        $cookieStore.remove('ReturnReasonPermission');
        $cookieStore.remove('FinalPriceConfigPermission');
        $cookieStore.remove('AdjustmentNamePermission');
        $cookieStore.remove('AdjustmentPermission');
        $cookieStore.remove('AuditTypePermission');
        $cookieStore.remove('BarcodePrintPermission');
        $cookieStore.remove('ItemAdditionalAttributePermission');
        $cookieStore.remove('ItemAdditionalAttributeValuePermission');
        $cookieStore.remove('ItemAdditionalAttributePricePermission');
        $cookieStore.remove('ApprovalSetupPermission');//added by touhid
        $cookieStore.remove('AttendancePunchUploadPermission');
        $cookieStore.remove('BankAccountPermission');
        //Accounts
        $cookieStore.remove('ChartOfAccountsPermission');
        $cookieStore.remove('AccountTypePermission');
        $cookieStore.remove('AccountTypeDetailPermission');

        $cookieStore.remove('ReceiptVoucherPermission');
        $cookieStore.remove('PaymentVoucherPermission');
        $cookieStore.remove('JournalVoucherPermission');
        $cookieStore.remove('ContraVoucherPermission');

        $cookieStore.remove('AttendancePolicyPermission');

        $cookieStore.remove('SetupPermission');
        $cookieStore.remove('ReorderLevelSetupPermission');
        $cookieStore.remove('OpeningQuantityPermission');
        $cookieStore.remove('PurchaseOrderPermission');
        $cookieStore.remove('ReceivePermission');
        $cookieStore.remove('RequisitionPermission');
        $cookieStore.remove('IssuePermission');
        $cookieStore.remove('StockIssueWithoutRequisitionPermission');
        $cookieStore.remove('IssueApprovePermission'); //added by Tofael 26102016
        $cookieStore.remove('InventoryReportsPermission'); //added by Tofael 28102016 
        $cookieStore.remove('InventoryAndSaleReportsMushakPermission'); 
        $cookieStore.remove('DeliveryPermission'); //added by Tofael 09112016 
        $cookieStore.remove('ReturnToSupplierPermission');
        $cookieStore.remove('ReturnFromDepartmentPermission');
        $cookieStore.remove('StockAuditEntryPermission');
        $cookieStore.remove('StockDeclarationEntryPermission');
        $cookieStore.remove('InventoryApprovalsPermission');//added by touhid
        $cookieStore.remove('PurchaseRequisitionPermission');
        $cookieStore.remove('BillOfMaterialPermission');
        $cookieStore.remove('WarrentyAndSerialNoPermission');
        $cookieStore.remove('InternalWorkOrderPermission');//added by touhid
        $cookieStore.remove('PurchaseBillPermission');
        $cookieStore.remove('LocalPurchaseBillPermission');
        $cookieStore.remove('SupplierPaymentPermission');

        $cookieStore.remove('SupplierPaymentAdjustmentPermission');
        $cookieStore.remove('SupplierLedgerPermission');

        
        $cookieStore.remove('ImportPurchaseBillPermission');
        $cookieStore.remove('ProductionEntryPermission');
        //POS
        $cookieStore.remove('OfferPermission');
        $cookieStore.remove('SalePermission');
        $cookieStore.remove('SaleVoidPermission');
        $cookieStore.remove('CashDepositPermission');
        $cookieStore.remove('SalesOrderPermission');
        $cookieStore.remove('ReviseSalesOrderPermission');
        //Receivable
        $cookieStore.remove('CompanyAdvancePermission');
        $cookieStore.remove('SaleAcknowledgementPermission');
        $cookieStore.remove('SaleAdjustmentPermission');
        $cookieStore.remove('SaleRealizationPermission');
        //Payable
        $cookieStore.remove('SupplierAdvancePermission');
        $cookieStore.remove('PurchaseAcknowledgementPermission');
        $cookieStore.remove('PurchaseAdjustmentPermission');
        $cookieStore.remove('PurchaseRealizationPermission');
        $cookieStore.remove('AccountsPermission');
        //Accounts
        $cookieStore.remove('ChartOfAccountsPermission');

        $cookieStore.remove('TestPermission');

        //ScreenId remove
        //Security
        $cookieStore.remove('UnitScreenId');
        $cookieStore.remove('SubcategoryScreenId');
        $cookieStore.remove('ScreenScreenId');
        $cookieStore.remove('RoleScreenId');
        $cookieStore.remove('PermissionScreenId');
        $cookieStore.remove('ModuleScreenId');
        //admin
        $cookieStore.remove('ProductScreenId');
        $cookieStore.remove('EmployeeScreenId');
        $cookieStore.remove('DesignationScreenId');
        $cookieStore.remove('DepartmentScreenId');
        $cookieStore.remove('DepartmentScreenId');
        $cookieStore.remove('ChangePasswordScreenId');
        $cookieStore.remove('CategoryScreenId');
        $cookieStore.remove('BranchTypeScreenId');
        $cookieStore.remove('BranchScreenId');
        $cookieStore.remove('PaymentTypeScreenId');
        $cookieStore.remove('PaymentGroupScreenId');
        $cookieStore.remove('SupplierScreenId');
        $cookieStore.remove('BarcodePrintScreenId');
        $cookieStore.remove('TestEntryScreenId');
        $cookieStore.remove('');

        $cookieStore.remove('CustomerTypeScreenId');
        $cookieStore.remove('CustomerScreenId');
        $cookieStore.remove('TerminalScreenId');
        $cookieStore.remove('RequisitionPurposeScreenId');
        $cookieStore.remove('ReturnReasonScreenId');
        $cookieStore.remove('FinalPriceConfigScreenId');
        $cookieStore.remove('AdjustmentScreenId');
        $cookieStore.remove('AdjustmentNameScreenId');
        $cookieStore.remove('AuditTypeScreenId');
        $cookieStore.remove('ItemAdditionalAttributeScreenId');
        $cookieStore.remove('ItemAdditionalAttributeValueScreenId');
        $cookieStore.remove('ItemAdditionalAttributePriceScreenId');
        $cookieStore.remove('ApprovalSetupScreenId');
        $cookieStore.remove('AttendancePunchUploadScreenId');
        $cookieStore.remove('BankAccountScreenId');
        //Account 
        $cookieStore.remove('ChartOfAccountsScreenId');
        $cookieStore.remove('AccountTypeScreenId');
        $cookieStore.remove('AccountTypeDetailScreenId');

        $cookieStore.remove('ReceiptVoucherScreenId');
        $cookieStore.remove('PaymentVoucherScreenId');
        $cookieStore.remove('JournalVoucherScreenId');
        $cookieStore.remove('ContraVoucherScreenId');


        //HR added by Raju 31/12/17
        $cookieStore.remove('AttendancePolicyScreenId');

        //inventory
        $cookieStore.remove('ReceiveScreenId');
        $cookieStore.remove('RequisitionScreenId');
        $cookieStore.remove('SetupScreenId');
        $cookieStore.remove('OpeningQuantityScreenId');
        $cookieStore.remove('IssueScreenId');
        $cookieStore.remove('StockIssueWithoutRequisitionScreenId');
        $cookieStore.remove('IssueApproveScreenId');//added by Tofael 26102016  
        $cookieStore.remove('InventoryReportsScreenId');//added by Tofael 28102016  
        $cookieStore.remove('InventoryAndSaleReportsMushakScreenId');
        $cookieStore.remove('DeliveryScreenId');//added by Tofael 09112016  
        $cookieStore.remove('ReorderLevelSetupScreenId');
        $cookieStore.remove('ReturnToSupplierScreenId');
        $cookieStore.remove('ReturnFromDepartmentScreenId');
        $cookieStore.remove('StockAuditEntryScreenId');
        $cookieStore.remove('StockDeclarationEntryScreenId');
        $cookieStore.remove('InventoryApprovalsScreenId');
        $cookieStore.remove('PurchaseRequisitionScreenId');
        $cookieStore.remove('BillOfMaterialScreenId');
        $cookieStore.remove('BillOfMaterialScreenId');
        $cookieStore.remove('BillOfMaterialPermission');
        $cookieStore.remove('WarrentyAndSerialNoScreenId');
        $cookieStore.remove('InternalWorkOrderScreenId');
        $cookieStore.remove('ProductionEntryScreenId');
        $cookieStore.remove('PurchaseBillScreenId');
        //POS
        $cookieStore.remove('OfferScreenId');
        $cookieStore.remove('SaleScreenId');
        $cookieStore.remove('SaleVoidScreenId');
        $cookieStore.remove('CashDepositScreenId');
        $cookieStore.remove('SalesOrderScreenId');
        $cookieStore.remove('ReviseSalesOrderScreenId');
        //Receivable
        $cookieStore.remove('CompanyAdvanceScreenId');
        $cookieStore.remove('SaleAcknowledgementScreenId');
        $cookieStore.remove('SaleAdjustmentScreenId');
        $cookieStore.remove('SaleRealizationScreenId');
        //Payable
        $cookieStore.remove('SupplierAdvanceScreenId');
        $cookieStore.remove('PurchaseAcknowledgementScreenId');
        $cookieStore.remove('PurchaseAdjustmentScreenId');
        $cookieStore.remove('PurchaseRealizationScreenId');
        //Export
        $cookieStore.remove('ProformaInvoicePermission');
        $cookieStore.remove('ExpGeneratePermission');
        $cookieStore.remove('CommercialInvoicePermission');
        $cookieStore.remove('ReviseProformaInvoicePermission');
        $cookieStore.remove('ReviseExpGeneratePermission');
        $cookieStore.remove('ReviseCommercialInvoicePermission');
        $cookieStore.remove('ExportReportsPermission');
        $cookieStore.remove('ExportReportsScreenId');

        $cookieStore.remove('ProformaInvoiceScreenId');
        $cookieStore.remove('ExpGenerateScreenId');
        $cookieStore.remove('CommercialInvoiceScreenId');
        $cookieStore.remove('ReviseProformaInvoiceScreenId');
        $cookieStore.remove('ReviseExpGenerateScreenId');
        $cookieStore.remove('ReviseCommercialInvoiceScreenId');

        $cookieStore.remove('SalesOrderApprovePermission');
        $cookieStore.remove('ProformaInvoiceApprovePermission');
        $cookieStore.remove('ExpGenerateApprovePermission');
        $cookieStore.remove('CommercialInvoiceApprovePermission');
        $cookieStore.remove('PostCiProcessPermission');
        $cookieStore.remove('ExportDocumentUploadPermission');

        $cookieStore.remove('SalesOrderApproveScreenId');
        $cookieStore.remove('ProformaInvoiceApproveScreenId');
        $cookieStore.remove('ExpGenerateApproveScreenId');
        $cookieStore.remove('CommercialInvoiceApproveScreenId');
        $cookieStore.remove('PostCiProcessScreenId');
        $cookieStore.remove('ExportDocumentUploadScreenId');
        $cookieStore.remove('LocalPurchaseBillScreenId');
        $cookieStore.remove('SupplierPaymentScreenId');
        $cookieStore.remove('ImportPurchaseBillScreenId');
        $cookieStore.remove('SupplierPaymentAdjustmentScreenId');
        $cookieStore.remove('SupplierLedgerScreenId');
 

        //Error Log
        $cookieStore.remove('errorMassage');
    }

    window.onpopstate = function (e) { window.history.forward(1); }

    $scope.Login = function () {
        var value = $("#myText").val();
        $scope.Ip = value;
        RemoveCookies();
        $scope.LoginUser = [];
        GetUser($scope.s_User.Username, $scope.s_User.Password);
        GetHasReceivable();
    };

    $scope.MatchCode = function () {
        if ($scope.s_User.SmsCodeIn == $scope.SmsCode) {
            $cookieStore.put('UserData', $scope.LoginUser);
            RemoveAllScreenLock($scope.LoginUser.UserId);
            GetUserCurrentStatus($scope.LoginUser.UserId);
        }
        else {
            alertify.log('Incorrect Code', 'error', '5000');
        }
    }
});
