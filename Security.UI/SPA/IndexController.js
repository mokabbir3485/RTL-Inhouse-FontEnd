app.controller("IndexController", function ($scope, $cookieStore, MyService, $http, $filter) {
    load();

    function load() {
        $scope.LoginUser = [];
        $scope.NoticeList = [];
        $scope.UnreadMessageNo = 0;
        //All menu control hidden default ----Start
        $scope.AdminView = "menuViewHide";
        $scope.SecurityView = "menuViewHide";
        $scope.SyncView = "menuViewHide";
        $scope.HRView = "menuViewHide";
        $scope.InventoryView = "menuViewHide";
        $scope.POSView = "menuViewHide";
        $scope.ReportsView = "menuViewHide";
        $scope.ProductionMenuView = "menuViewHide";
        $scope.PurchaseMenuView = "menuViewHide";
        $scope.AccountsView = "menuViewHide";
        $scope.ExportView = "menuViewHide";

        $scope.AttendencePolicyView = "menuViewHide";
        $scope.PurchaseBillView = "menuViewHide";
        $scope.PurchaseOrderView = "menuViewHide";
        $scope.BarcodePrintView = "menuViewHide";
        $scope.BankEntryView = "menuViewHide";
        $scope.ReceivableView = "menuViewHide";
        $scope.PayableView = "menuViewHide";
        $scope.ReportView = "menuViewHide";
        $scope.CustomerTypeView = "menuViewHide";
        $scope.CustomerView = "menuViewHide";
        $scope.CompanyView = "menuViewHide";
        $scope.SupplierView = "menuViewHide";
        $scope.ItemAdditionalAttributeView = "menuViewHide";
        $scope.ItemAdditionalAttributeValueView = "menuViewHide";
        $scope.ItemAdditionalAttributePriceView = "menuViewHide";
        $scope.ProductView = "menuViewHide";
        $scope.CategoryView = "menuViewHide";
        $scope.SubcategoryView = "menuViewHide";
        $scope.BranchTypeCustomerView = "menuViewHide";
        $scope.BranchView = "menuViewHide";
        $scope.DepartmentTypeView = "menuViewHide";
        $scope.DepartmentView = "menuViewHide";
        $scope.DesignationView = "menuViewHide";
        $scope.EmployeeView = "menuViewHide";
        $scope.UnitView = "menuViewHide";
        $scope.PaymentTypeView = "menuViewHide";
        $scope.PaymentGroupView = "menuViewHide";
        $scope.PriceTypeView = "menuViewHide";
        $scope.FinalPriceConfigView = "menuViewHide";
        $scope.ModuleView = "menuViewHide";
        $scope.RoleView = "menuViewHide";
        $scope.ScreenView = "menuViewHide";
        $scope.PermisionView = "menuViewHide";
        $scope.ChangePasswordView = "menuViewHide";
        $scope.TerminalView = "menuViewHide";
        $scope.ChargeTypeView = "menuViewHide";
        $scope.StockReceiveView = "menuViewHide";
        $scope.RequisitionView = "menuViewHide";
        $scope.StockValuationSetupView = "menuViewHide";
        $scope.OpeningQuantityView = "menuViewHide";
        $scope.OverheadView = "menuViewHide";
        $scope.StockIssueView = "menuViewHide";
        $scope.StockIssueWithoutRequisitionView = "menuViewHide";
        $scope.IssueApproveView = "menuViewHide";
        $scope.InventoryAndSaleReportsView = "menuViewHide";
        $scope.InventoryAndSaleReportsMushakView = "menuViewHide";
        $scope.SaleView = "menuViewHide";
        $scope.ExchangeView = "menuViewHide";
        $scope.SaleVoidView = "menuViewHide";
        $scope.CashDepositView = "menuViewHide";
        $scope.OfferView = "menuViewHide";
        $scope.DeliveryView = "menuViewHide";
        $scope.StockDeclarationTypeView = "menuViewHide";
        $scope.ReorderLevelSetupView = "menuViewHide";
        $scope.ReturnToSupplierView = "menuViewHide";
        $scope.ReturnFromDepartmentView = "menuViewHide";
        $scope.StockAuditEntryView = "menuViewHide";
        $scope.StockDeclarationEntryView = "menuViewHide";
        $scope.RequisitionPurposeEntryView = "menuViewHide";
        $scope.ReturnReasonEntryView = "menuViewHide";
        $scope.AuditTypeView = "menuViewHide";
        $scope.InventoryApprovalsView = "menuViewHide";
        $scope.ApprovalSetupView = "menuViewHide";
        $scope.SalesOrderView = "menuViewHide";
        $scope.ReviseSalesOrderView = "menuViewHide";
        $scope.PurchaseRequisitionView = "menuViewHide";
        $scope.BillOfMaterialView = "menuViewHide";

        $scope.WarrentyAndSerialNoView = "menuViewHide";
        $scope.ImportPurchaseBillView = "menuViewHide";

        $scope.InternalWorkOrderView = "menuViewHide";
        $scope.ProductionEntryView = "menuViewHide";
        $scope.VoidReasonEntryView = "menuViewHide";
        $scope.CompanyAdvanceView = "menuViewHide";
        $scope.SaleAcknowledgementView = "menuViewHide";
        $scope.SaleAdjustmentView = "menuViewHide";
        $scope.SaleRealizationView = "menuViewHide";
        $scope.SupplierAdvanceView = "menuViewHide";
        $scope.PurchaseAcknowledgementView = "menuViewHide";
        $scope.PurchaseAdjustmentView = "menuViewHide";
        $scope.PurchaseRealizationView = "menuViewHide";
        $scope.AttendancePunchUploadView = "menuViewHide";
        $scope.BankAccountView = "menuViewHide";
        //Accounts
        $scope.ChartOfAccountsView = "menuViewHide";
        $scope.AccountTypeView = "menuViewHide";
        $scope.AccountTypeDetailView = "menuViewHide";
        $scope.ReceiptVoucherView = "menuViewHide";
        $scope.PaymentVoucherView = "menuViewHide";
        $scope.JournalVoucherView = "menuViewHide";
        $scope.ContraVoucherView = "menuViewHide";
        //$scope.AccountView = "menuViewHide";

        //Export
        $scope.ProformaInvoiceView = "menuViewHide"; // shahadat
        $scope.ExpGenerateView = "menuViewHide";
        $scope.CommercialInvoiceView = "menuViewHide";
        $scope.SalesOrderApproveView = "menuViewHide";
        $scope.ProformaInvoiceApproveView = "menuViewHide";
        $scope.ExpGenerateApproveView = "menuViewHide";
        $scope.CommercialInvoiceApproveView = "menuViewHide";
        $scope.PostCiProcessView = "menuViewHide";
        $scope.ExportDocumentUploadView = "menuViewHide";
        $scope.ReviseProformaInvoiceView = "menuViewHide";
        $scope.ReviseExpGenerateView = "menuViewHide";
        $scope.ReviseCommercialInvoiceView = "menuViewHide";
        $scope.ExportReportsView = "menuViewHide";
        $scope.LocalPurchaseBillView = "menuViewHide";
        $scope.SupplierPaymentView = "menuViewHide";
        $scope.SupplierPaymentAdjustmentView = "menuViewHide";
        $scope.SupplierLedgerView = "menuViewHide";


        $scope.TestView = "menuViewHide";

        //All menu control hidden default ----End
        GetUser(); //Get logged in user Info from cookies
    }

    function GetUser() {
        $scope.LoginUser = $cookieStore.get('UserData');
        $scope.UserId = $scope.LoginUser.UserId;
        $scope.UserName = $scope.LoginUser.Username;
        $scope.RoleId = $scope.LoginUser.RoleId;
        $scope.RoleName = $scope.LoginUser.RoleName;
        GetPermissionByRoleId($scope.RoleId);
    }

    function GetPermissionByRoleId(roleId) {
        $http({
            url: '/Permission/GetPermissionByRoleId?roleId=' + roleId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            MyService.data.permission = data;
            angular.forEach(data, function (aPermission) {
                //Set Sitebar and Page Permission
                if (aPermission.ScreenName == "Customer Type" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.CustomerTypeView = "menuViewShow";
                    $cookieStore.put('CustomerTypeScreenId', aPermission.ScreenId);
                    $cookieStore.put('CustomerTypePermission', 'true');
                }
                if (aPermission.ScreenName == "Test" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.CustomerTypeView = "menuViewShow";
                    $cookieStore.put('TestEntryScreenId', aPermission.ScreenId);
                    $cookieStore.put('TestPermission', 'true');
                }

                if (aPermission.ScreenName == "Customer" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.CustomerView = "menuViewShow";
                    $cookieStore.put('CustomerScreenId', aPermission.ScreenId);
                    $cookieStore.put('CustomerPermission', 'true');
                }
                if (aPermission.ScreenName == "Company" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.CompanyView = "menuViewShow";
                    $cookieStore.put('CompanyEntryScreenId', aPermission.ScreenId);
                    $cookieStore.put('CompanyEntryPermission', 'true');
                }


                if (aPermission.ScreenName == "Supplier" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.SupplierView = "menuViewShow";
                    $cookieStore.put('SupplierScreenId', aPermission.ScreenId);
                    $cookieStore.put('SupplierPermission', 'true');

                }
                if (aPermission.ScreenName == "Overhead" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.OverheadView = "menuViewShow";
                    $cookieStore.put('OverheadScreenId', aPermission.ScreenId);
                    $cookieStore.put('OverheadPermission', 'true');
                }
                if (aPermission.ScreenName == "Product" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.ProductView = "menuViewShow";
                    $cookieStore.put('ProductScreenId', aPermission.ScreenId);
                    $cookieStore.put('ProductPermission', 'true');
                }
                if (aPermission.ScreenName == "Barcode Print" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.BarcodePrintView = "menuViewShow";
                    $cookieStore.put('BarcodePrintScreenId', aPermission.ScreenId);
                    $cookieStore.put('BarcodePrintPermission', 'true');
                }
                if (aPermission.ScreenName == "Category" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.CategoryView = "menuViewShow";
                    $cookieStore.put('CategoryScreenId', aPermission.ScreenId);
                    $cookieStore.put('CategoryPermission', 'true');

                }
                if (aPermission.ScreenName == "Subcategory" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.SubcategoryView = "menuViewShow";
                    $cookieStore.put('SubcategoryScreenId', aPermission.ScreenId);
                    $cookieStore.put('SubcategoryPermission', 'true');
                }
                if (aPermission.ScreenName == "Branch Type" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.BranchTypeCustomerView = "menuViewShow";
                    $cookieStore.put('BranchTypeScreenId', aPermission.ScreenId);
                    $cookieStore.put('BranchTypePermission', 'true');

                }
                if (aPermission.ScreenName == "Bank" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.BankEntryView = "menuViewShow";
                    $cookieStore.put('BankEntryScreenId', aPermission.ScreenId);
                    $cookieStore.put('BankEntryPermission', 'true');

                }
                if (aPermission.ScreenName == "Branch" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.BranchView = "menuViewShow";
                    $cookieStore.put('BranchScreenId', aPermission.ScreenId);
                    $cookieStore.put('BranchPermission', 'true');

                }
                if (aPermission.ScreenName == "Department Type" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.DepartmentTypeView = "menuViewShow";
                    $cookieStore.put('DepartmentTypeScreenId', aPermission.ScreenId);
                    $cookieStore.put('DepartmentTypePermission', 'true');

                }
                if (aPermission.ScreenName == "Department" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.DepartmentView = "menuViewShow";
                    $cookieStore.put('DepartmentScreenId', aPermission.ScreenId);
                    $cookieStore.put('DepartmentPermission', 'true');

                }
                if (aPermission.ScreenName == "Designation" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.DesignationView = "menuViewShow";
                    $cookieStore.put('DesignationScreenId', aPermission.ScreenId);
                    $cookieStore.put('DesignationPermission', 'true');

                }
                if (aPermission.ScreenName == "Employee" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.EmployeeView = "menuViewShow";
                    $cookieStore.put('EmployeeScreenId', aPermission.ScreenId);
                    $cookieStore.put('EmployeePermission', 'true');

                }
                if (aPermission.ScreenName == "Unit" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.UnitView = "menuViewShow";
                    $cookieStore.put('UnitScreenId', aPermission.ScreenId);
                    $cookieStore.put('UnitPermission', 'true');
                }
                if (aPermission.ScreenName == "Price Type" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.PriceTypeView = "menuViewShow";
                    $cookieStore.put('PriceTypeScreenId', aPermission.ScreenId);
                    $cookieStore.put('PriceTypePermission', 'true');
                }

                if (aPermission.ScreenName == "Payment Type" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.PaymentTypeView = "menuViewShow";
                    $cookieStore.put('PaymentTypeScreenId', aPermission.ScreenId);
                    $cookieStore.put('PaymentTypePermission', 'true');
                }

                if (aPermission.ScreenName == "Module" && aPermission.CanView) {
                    $scope.SecurityView = "menuViewShow";
                    $scope.ModuleView = "menuViewShow";
                    $cookieStore.put('ModuleScreenId', aPermission.ScreenId);
                    $cookieStore.put('ModulePermission', 'true');
                }
                if (aPermission.ScreenName == "Role" && aPermission.CanView) {
                    $scope.SecurityView = "menuViewShow";
                    $scope.RoleView = "menuViewShow";
                    $cookieStore.put('RoleScreenId', aPermission.ScreenId);
                    $cookieStore.put('RolePermission', 'true');
                }
                if (aPermission.ScreenName == "Screen" && aPermission.CanView) {
                    $scope.SecurityView = "menuViewShow";
                    $scope.ScreenView = "menuViewShow";
                    $cookieStore.put('ScreenScreenId', aPermission.ScreenId);
                    $cookieStore.put('ScreenPermission', 'true');
                }
                if (aPermission.ScreenName == "Permission" && aPermission.CanView) {
                    $scope.SecurityView = "menuViewShow";
                    $scope.PermisionView = "menuViewShow";
                    $cookieStore.put('PermissionScreenId', aPermission.ScreenId);
                    $cookieStore.put('PermissionPermission', 'true');
                }
                if (aPermission.ScreenName == "Change Password" && aPermission.CanView) {
                    $scope.SecurityView = "menuViewShow";
                    $scope.ChangePasswordView = "menuViewShow";
                    $cookieStore.put('ChangePasswordScreenId', aPermission.ScreenId);
                    $cookieStore.put('ChangePasswordPermission', 'true');

                }
                if (aPermission.ScreenName == "Terminal" && aPermission.CanView) {
                    $scope.SecurityView = "menuViewShow";
                    $scope.TerminalView = "menuViewShow";
                    $cookieStore.put('TerminalScreenId', aPermission.ScreenId);
                    $cookieStore.put('TerminalPermission', 'true');
                }
                if (aPermission.ScreenName == "Sync" && aPermission.CanView) {
                    $scope.SecurityView = "menuViewShow";
                    $scope.SyncView = "menuViewShow";
                    $cookieStore.put('SyncScreenId', aPermission.ScreenId);
                    $cookieStore.put('SyncPermission', 'true');
                }
                if (aPermission.ScreenName == "Charge Type" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.ChargeTypeView = "menuViewShow";
                    $cookieStore.put('ChargeTypeScreenId', aPermission.ScreenId);
                    $cookieStore.put('ChargeTypePermission', 'true');
                }
                if (aPermission.ScreenName == "Payment Group" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.PaymentGroupView = "menuViewShow";
                    $cookieStore.put('PaymentGroupScreenId', aPermission.ScreenId);
                    $cookieStore.put('PaymentGroupPermission', 'true');
                }
                if (aPermission.ScreenName == "Final Price Configuration" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.FinalPriceConfigView = "menuViewShow";
                    $cookieStore.put('FinalPriceConfigScreenId', aPermission.ScreenId);
                    $cookieStore.put('FinalPriceConfigPermission', 'true');
                }
                if (aPermission.ScreenName == "Audit Type" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.AuditTypeView = "menuViewShow";
                    $cookieStore.put('AuditTypeScreenId', aPermission.ScreenId);
                    $cookieStore.put('AuditTypePermission', 'true');
                }
                if (aPermission.ScreenName == "Additional Attribute" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.ItemAdditionalAttributeView = "menuViewShow";
                    $cookieStore.put('ItemAdditionalAttributeScreenId', aPermission.ScreenId);
                    $cookieStore.put('ItemAdditionalAttributePermission', 'true');
                }
                if (aPermission.ScreenName == "Additional Attribute Value" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.ItemAdditionalAttributeValueView = "menuViewShow";
                    $cookieStore.put('ItemAdditionalAttributeValueScreenId', aPermission.ScreenId);
                    $cookieStore.put('ItemAdditionalAttributeValuePermission', 'true');
                }
                if (aPermission.ScreenName == "Product Combination Price" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.ItemAdditionalAttributePriceView = "menuViewShow";
                    $cookieStore.put('ItemAdditionalAttributePriceScreenId', aPermission.ScreenId);
                    $cookieStore.put('ItemAdditionalAttributePricePermission', 'true');
                }
                if (aPermission.ScreenName == "Stock Declaration Type" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.StockDeclarationTypeView = "menuViewShow";
                    $cookieStore.put('StockDeclarationTypeScreenId', aPermission.ScreenId);
                    $cookieStore.put('StockDeclarationTypePermission', 'true');
                }
                if (aPermission.ScreenName == "Requisition Purpose" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.RequisitionPurposeEntryView = "menuViewShow";
                    $cookieStore.put('RequisitionPurposeEntryScreenId', aPermission.ScreenId);
                    $cookieStore.put('RequisitionPurposeEntryPermission', 'true');
                }
                if (aPermission.ScreenName == "Return Reason" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.ReturnReasonEntryView = "menuViewShow";
                    $cookieStore.put('ReturnReasonEntryScreenId', aPermission.ScreenId);
                    $cookieStore.put('ReturnReasonEntryPermission', 'true');
                }
                if (aPermission.ScreenName == "Void Reason" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.VoidReasonEntryView = "menuViewShow";
                    $cookieStore.put('VoidReasonEntryScreenId', aPermission.ScreenId);
                    $cookieStore.put('VoidReasonEntryPermission', 'true');
                }
                if (aPermission.ScreenName == "Approval Setup" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.ApprovalSetupView = "menuViewShow";
                    $cookieStore.put('ApprovalSetupScreenId', aPermission.ScreenId);
                    $cookieStore.put('ApprovalSetupPermission', 'true');
                }
                if (aPermission.ScreenName == "Stock Receive" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.StockReceiveView = "menuViewShow";
                    $cookieStore.put('StockReceiveScreenId', aPermission.ScreenId);
                    $cookieStore.put('StockReceivePermission', 'true');
                }
                if (aPermission.ScreenName == "Requisition" && aPermission.CanView) {
                    $scope.ProductionMenuView = "menuViewShow";
                    $scope.RequisitionView = "menuViewShow";
                    $cookieStore.put('RequisitionScreenId', aPermission.ScreenId);
                    $cookieStore.put('RequisitionPermission', 'true');
                }
                //if (aPermission.ScreenName == "Purchase Bill" && aPermission.CanView) {
                //    $scope.PurchaseMenuView = "menuViewShow";
                //    $scope.PurchaseBillView = "menuViewShow";
                //    $cookieStore.put('PurchaseBillScreenId', aPermission.ScreenId);
                //    $cookieStore.put('PurchaseBillPermission', 'true');
                //}
                if (aPermission.ScreenName == "Import Purchase" && aPermission.CanView) {
                    $scope.PurchaseMenuView = "menuViewShow";
                    $scope.ImportPurchaseBillView = "menuViewShow";
                    $cookieStore.put('ImportPurchaseBillScreenId', aPermission.ScreenId);
                    $cookieStore.put('ImportPurchaseBillPermission', 'true');
                }

                if (aPermission.ScreenName == "Local Purchase Bill" && aPermission.CanView) {
                    $scope.PurchaseMenuView = "menuViewShow";
                    $scope.LocalPurchaseBillView = "menuViewShow";
                    $cookieStore.put('LocalPurchaseBillScreenId', aPermission.ScreenId);
                    $cookieStore.put('LocalPurchaseBillPermission', 'true');
                }
                if (aPermission.ScreenName == "Supplier Payment" && aPermission.CanView) {
                    $scope.PurchaseMenuView = "menuViewShow";
                    $scope.SupplierPaymentView = "menuViewShow";
                    $cookieStore.put('SupplierPaymentScreenId', aPermission.ScreenId);
                    $cookieStore.put('SupplierPaymentPermission', 'true');
                }

                if (aPermission.ScreenName == "Warrenty And Serial No" && aPermission.CanView) {
                    $scope.PurchaseMenuView = "menuViewShow";
                    $scope.WarrentyAndSerialNoView = "menuViewShow";
                    $cookieStore.put('WarrentyAndSerialNoScreenId', aPermission.ScreenId);
                    $cookieStore.put('WarrentyAndSerialNoPermission', 'true');
                }

                if (aPermission.ScreenName == "Supplier Payment Adjustment" && aPermission.CanView) {
                    $scope.PurchaseMenuView = "menuViewShow";
                    $scope.SupplierPaymentAdjustmentView = "menuViewShow";
                    $cookieStore.put('SupplierPaymentAdjustmentScreenId', aPermission.ScreenId);
                    $cookieStore.put('SupplierPaymentAdjustmentPermission', 'true');
                }

                if (aPermission.ScreenName == "Supplier Ledger" && aPermission.CanView) {
                    $scope.PurchaseMenuView = "menuViewShow";
                    $scope.SupplierLedgerView = "menuViewShow";
                    $cookieStore.put('SupplierLedgerScreenId', aPermission.ScreenId);
                    $cookieStore.put('SupplierLedgerPermission', 'true');
                }


                
                if (aPermission.ScreenName == "Stock Valuation Setup" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.StockValuationSetupView = "menuViewShow";
                    $cookieStore.put('StockValuationSetupScreenId', aPermission.ScreenId);
                    $cookieStore.put('StockValuationSetupPermission', 'true');
                }

                if (aPermission.ScreenName == "Opening Quantity" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.OpeningQuantityView = "menuViewShow";
                    $cookieStore.put('OpeningQuantityScreenId', aPermission.ScreenId);
                    $cookieStore.put('OpeningQuantityPermission', 'true');
                }
                if (aPermission.ScreenName == "Stock Issue" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.StockIssueView = "menuViewShow";
                    $cookieStore.put('StockIssueScreenId', aPermission.ScreenId);
                    $cookieStore.put('StockIssuePermission', 'true');
                }
                if (aPermission.ScreenName == "Issue Without Requisition" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.StockIssueWithoutRequisitionView = "menuViewShow";
                    $cookieStore.put('StockIssueWithoutRequisitionScreenId', aPermission.ScreenId);
                    $cookieStore.put('StockIssueWithoutRequisitionPermission', 'true');
                }
                if (aPermission.ScreenName == "Issue Receive" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.IssueApproveView = "menuViewShow";
                    $cookieStore.put('IssueApproveScreenId', aPermission.ScreenId);
                    $cookieStore.put('IssueApprovePermission', 'true');
                }
                if (aPermission.ScreenName == "Inventory And Sale Reports" && aPermission.CanView) {
                    $scope.ReportsView = "menuViewShow";
                    $scope.InventoryAndSaleReportsView = "menuViewShow";
                    $cookieStore.put('InventoryAndSaleReportsScreenId', aPermission.ScreenId);
                    $cookieStore.put('InventoryAndSaleReportsPermission', 'true');
                }
                if (aPermission.ScreenName == "Inventory And Sale Reports Mushak" && aPermission.CanView) {
                    $scope.ReportsView = "menuViewShow";
                    $scope.InventoryAndSaleReportsMushakView = "menuViewShow";
                    $cookieStore.put('InventoryAndSaleReportsMushakScreenId', aPermission.ScreenId);
                    $cookieStore.put('InventoryAndSaleReportsMushakPermission', 'true');
                }
                if (aPermission.ScreenName == "Export Reports" && aPermission.CanView) {
                    $scope.ReportsView = "menuViewShow";
                    $scope.ExportReportsView = "menuViewShow";
                    $cookieStore.put('ExportReportsScreenId', aPermission.ScreenId);
                    $cookieStore.put('ExportReportsPermission', 'true');
                }
                if (aPermission.ScreenName == "Delivery" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.DeliveryView = "menuViewShow";
                    $cookieStore.put('DeliveryScreenId', aPermission.ScreenId);
                    $cookieStore.put('DeliveryPermission', 'true');
                }
                if (aPermission.ScreenName == "Sale" && aPermission.CanView) {
                    $scope.POSView = "menuViewShow";
                    $scope.SaleView = "menuViewShow";
                    $cookieStore.put('SaleScreenId', aPermission.ScreenId);
                    $cookieStore.put('SalePermission', 'true');
                }
                if (aPermission.ScreenName == "Exchange" && aPermission.CanView) {
                    $scope.POSView = "menuViewShow";
                    $scope.ExchangeView = "menuViewShow";
                    $cookieStore.put('ExchangeScreenId', aPermission.ScreenId);
                    $cookieStore.put('ExchangePermission', 'true');
                }
                if (aPermission.ScreenName == "Offer" && aPermission.CanView) {
                    $scope.POSView = "menuViewShow";
                    $scope.OfferView = "menuViewShow";
                    $cookieStore.put('OfferScreenId', aPermission.ScreenId);
                    $cookieStore.put('OfferPermission', 'true');
                }
                if (aPermission.ScreenName == "Sale Void" && aPermission.CanView) {
                    $scope.POSView = "menuViewShow";
                    $scope.SaleVoidView = "menuViewShow";
                    $cookieStore.put('SaleVoidScreenId', aPermission.ScreenId);
                    $cookieStore.put('SaleVoidPermission', 'true');
                }
                if (aPermission.ScreenName == "Cash Deposit" && aPermission.CanView) {
                    $scope.POSView = "menuViewShow";
                    $scope.CashDepositView = "menuViewShow";
                    $cookieStore.put('CashDepositScreenId', aPermission.ScreenId);
                    $cookieStore.put('CashDepositPermission', 'true');
                }
                if (aPermission.ScreenName == "Purchase Order" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.PurchaseOrderView = "menuViewShow";
                    $cookieStore.put('PurchaseOrderScreenId', aPermission.ScreenId);
                    $cookieStore.put('PurchaseOrderPermission', 'true');
                }

                if (aPermission.ScreenName == "Reorder Level Setup" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.ReorderLevelSetupView = "menuViewShow";
                    $cookieStore.put('ReorderLevelSetupScreenId', aPermission.ScreenId);
                    $cookieStore.put('ReorderLevelSetupPermission', 'true');
                }
                if (aPermission.ScreenName == "Return To Supplier" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.ReturnToSupplierView = "menuViewShow";
                    $cookieStore.put('ReturnToSupplierScreenId', aPermission.ScreenId);
                    $cookieStore.put('ReturnToSupplierPermission', 'true');
                }
                if (aPermission.ScreenName == "Return From Department" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.ReturnFromDepartmentView = "menuViewShow";
                    $cookieStore.put('ReturnFromDepartmentScreenId', aPermission.ScreenId);
                    $cookieStore.put('ReturnFromDepartmentPermission', 'true');
                }
                if (aPermission.ScreenName == "Stock Audit" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.StockAuditEntryView = "menuViewShow";
                    $cookieStore.put('StockAuditEntryScreenId', aPermission.ScreenId);
                    $cookieStore.put('StockAuditEntryPermission', 'true');
                }
                if (aPermission.ScreenName == "Stock Declaration" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.StockDeclarationEntryView = "menuViewShow";
                    $cookieStore.put('StockDeclarationEntryScreenId', aPermission.ScreenId);
                    $cookieStore.put('StockDeclarationEntryPermission', 'true');
                }
                if (aPermission.ScreenName == "Inventory Approvals" && aPermission.CanView) {
                    $scope.POSView = "menuViewShow";
                    $scope.InventoryApprovalsView = "menuViewShow";
                    $cookieStore.put('InventoryApprovalsScreenId', aPermission.ScreenId);
                    $cookieStore.put('InventoryApprovalsPermission', 'true');
                }
                if (aPermission.ScreenName == "Purchase Requisition" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.PurchaseRequisitionView = "menuViewShow";
                    $cookieStore.put('PurchaseRequisitionScreenId', aPermission.ScreenId);
                    $cookieStore.put('PurchaseRequisitionPermission', 'true');
                }
                if (aPermission.ScreenName == "Bill Of Material" && aPermission.CanView) {
                    $scope.InventoryView = "menuViewShow";
                    $scope.BillOfMaterialView = "menuViewShow";
                    $cookieStore.put('BillOfMaterialScreenId', aPermission.ScreenId);
                    $cookieStore.put('BillOfMaterialPermission', 'true');
                }
              
                if (aPermission.ScreenName == "Sales Order" && aPermission.CanView) {
                    $scope.POSView = "menuViewShow";
                    $scope.SalesOrderView = "menuViewShow";
                    $cookieStore.put('SalesOrderScreenId', aPermission.ScreenId);
                    $cookieStore.put('SalesOrderPermission', 'true');
                }
                if (aPermission.ScreenName == "Revise Sales Order" && aPermission.CanView) {
                    $scope.POSView = "menuViewShow";
                    $scope.ReviseSalesOrderView = "menuViewShow";
                    $cookieStore.put('ReviseSalesOrderScreenId', aPermission.ScreenId);
                    $cookieStore.put('ReviseSalesOrderPermission', 'true');
                }

                if (aPermission.ScreenName == "Internal Work Order" && aPermission.CanView) {
                    $scope.POSView = "menuViewShow";
                    $scope.InternalWorkOrderView = "menuViewShow";
                    $cookieStore.put('InternalWorkOrderScreenId', aPermission.ScreenId);
                    $cookieStore.put('InternalWorkOrderPermission', 'true');
                }


                if (aPermission.ScreenName == "Production Entry" && aPermission.CanView) {
                    $scope.ProductionMenuView = "menuViewShow";
                    $scope.ProductionEntryView = "menuViewShow";
                    $cookieStore.put('ProductionEntryScreenId', aPermission.ScreenId);
                    $cookieStore.put('ProductionEntryPermission', 'true');
                }

                if (aPermission.ScreenName == "Attendance Policy" && aPermission.CanView) {
                    $scope.HRView = "menuViewShow";
                    $scope.AttendancePolicyView = "menuViewShow";
                    $cookieStore.put('AttendancePolicyScreenId', aPermission.ScreenId);
                    $cookieStore.put('AttendancePolicyPermission', 'true');
                }

                if (aPermission.ScreenName == "Company Advance" && aPermission.CanView) {
                    $scope.ReceivableView = "menuViewShow";
                    $scope.CompanyAdvanceView = "menuViewShow";
                    $cookieStore.put('CompanyAdvanceScreenId', aPermission.ScreenId);
                    $cookieStore.put('CompanyAdvancePermission', 'true');
                }
                if (aPermission.ScreenName == "Sale Acknowledgement" && aPermission.CanView) {
                    $scope.ReceivableView = "menuViewShow";
                    $scope.SaleAcknowledgementView = "menuViewShow";
                    $cookieStore.put('SaleAcknowledgementScreenId', aPermission.ScreenId);
                    $cookieStore.put('SaleAcknowledgementPermission', 'true');
                }
                if (aPermission.ScreenName == "Sale Adjustment" && aPermission.CanView) {
                    $scope.ReceivableView = "menuViewShow";
                    $scope.SaleAdjustmentView = "menuViewShow";
                    $cookieStore.put('SaleAdjustmentScreenId', aPermission.ScreenId);
                    $cookieStore.put('SaleAdjustmentPermission', 'true');
                }
                if (aPermission.ScreenName == "Sale Realization" && aPermission.CanView) {
                    $scope.ReceivableView = "menuViewShow";
                    $scope.SaleRealizationView = "menuViewShow";
                    $cookieStore.put('SaleRealizationScreenId', aPermission.ScreenId);
                    $cookieStore.put('SaleRealizationPermission', 'true');
                }

                if (aPermission.ScreenName == "Supplier Advance" && aPermission.CanView) {
                    $scope.PayableView = "menuViewShow";
                    $scope.SupplierAdvanceView = "menuViewShow";
                    $cookieStore.put('SupplierAdvanceScreenId', aPermission.ScreenId);
                    $cookieStore.put('SupplierAdvancePermission', 'true');
                }
                if (aPermission.ScreenName == "Purchase Acknowledgement" && aPermission.CanView) {
                    $scope.PayableView = "menuViewShow";
                    $scope.PurchaseAcknowledgementView = "menuViewShow";
                    $cookieStore.put('PurchaseAcknowledgementScreenId', aPermission.ScreenId);
                    $cookieStore.put('PurchaseAcknowledgementPermission', 'true');
                }
                if (aPermission.ScreenName == "Purchase Adjustment" && aPermission.CanView) {
                    $scope.PayableView = "menuViewShow";
                    $scope.PurchaseAdjustmentView = "menuViewShow";
                    $cookieStore.put('PurchaseAdjustmentScreenId', aPermission.ScreenId);
                    $cookieStore.put('PurchaseAdjustmentPermission', 'true');
                }
                if (aPermission.ScreenName == "Purchase Realization" && aPermission.CanView) {
                    $scope.PayableView = "menuViewShow";
                    $scope.PurchaseRealizationView = "menuViewShow";
                    $cookieStore.put('PurchaseRealizationScreenId', aPermission.ScreenId);
                    $cookieStore.put('PurchaseRealizationPermission', 'true');
                }
                if (aPermission.ScreenName == "Attendance Punch Upload" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.AttendancePunchUploadView = "menuViewShow";
                    $cookieStore.put('AttendancePunchUploadScreenId', aPermission.ScreenId);
                    $cookieStore.put('AttendancePunchUploadPermission', 'true');
                }

                if (aPermission.ScreenName == "Chart of Accounts" && aPermission.CanView) {
                    $scope.AccountsView = "menuViewShow";
                    $scope.ChartOfAccountsView = "menuViewShow";
                    $cookieStore.put('ChartOfAccountsScreenId', aPermission.ScreenId);
                    $cookieStore.put('ChartOfAccountsPermission', 'true');
                }
                if (aPermission.ScreenName == "Account Type" && aPermission.CanView) {
                    $scope.AccountsView = "menuViewShow";
                    $scope.AccountTypeView = "menuViewShow";
                    $cookieStore.put('AccountTypeScreenId', aPermission.ScreenId);
                    $cookieStore.put('AccountTypePermission', 'true');
                }

                if (aPermission.ScreenName == "Account Type Detail" && aPermission.CanView) {
                    $scope.AccountsView = "menuViewShow";
                    $scope.AccountTypeDetailView = "menuViewShow";
                    $cookieStore.put('AccountTypeDetailScreenId', aPermission.ScreenId);
                    $cookieStore.put('AccountTypeDetailPermission', 'true');
                }

                if (aPermission.ScreenName == "Receipt Voucher" && aPermission.CanView) {
                    $scope.AccountsView = "menuViewShow";
                    $scope.ReceiptVoucherView = "menuViewShow";
                    $cookieStore.put('ReceiptVoucherScreenId', aPermission.ScreenId);
                    $cookieStore.put('ReceiptVoucherPermission', 'true');
                }

                if (aPermission.ScreenName == "Payment Voucher" && aPermission.CanView) {
                    $scope.AccountsView = "menuViewShow";
                    $scope.PaymentVoucherView = "menuViewShow";
                    $cookieStore.put('PaymentVoucherScreenId', aPermission.ScreenId);
                    $cookieStore.put('PaymentVoucherPermission', 'true');
                }

                if (aPermission.ScreenName == "Journal Voucher" && aPermission.CanView) {
                    $scope.AccountsView = "menuViewShow";
                    $scope.JournalVoucherView = "menuViewShow";
                    $cookieStore.put('JournalVoucherScreenId', aPermission.ScreenId);
                    $cookieStore.put('JournalVoucherPermission', 'true');
                }

                if (aPermission.ScreenName == "Contra Voucher" && aPermission.CanView) {
                    $scope.AccountsView = "menuViewShow";
                    $scope.ContraVoucherView = "menuViewShow";
                    $cookieStore.put('ContraVoucherScreenId', aPermission.ScreenId);
                    $cookieStore.put('ContraVoucherPermission', 'true');
                }

                if (aPermission.ScreenName == "Proforma Invoice" && aPermission.CanView) {
                    $scope.ProformaInvoiceView = "menuViewShow";
                    $scope.ExportView = "menuViewShow";
                    $cookieStore.put('ProformaInvoiceScreenId', aPermission.ScreenId);
                    $cookieStore.put('ProformaInvoicePermission', 'true');
                }

                if (aPermission.ScreenName == "Exp Generate" && aPermission.CanView) {
                    $scope.ExpGenerateView = "menuViewShow";
                    $scope.ExportView = "menuViewShow";
                    $cookieStore.put('ExpGenerateScreenId', aPermission.ScreenId);
                    $cookieStore.put('ExpGeneratePermission', 'true');
                }

                if (aPermission.ScreenName == "Commercial Invoice" && aPermission.CanView) {
                    $scope.CommercialInvoiceView = "menuViewShow";
                    $scope.ExportView = "menuViewShow";
                    $cookieStore.put('CommercialInvoiceScreenId', aPermission.ScreenId);
                    $cookieStore.put('CommercialInvoicePermission', 'true');
                }

                if (aPermission.ScreenName == "Sales Order Approve" && aPermission.CanView) {
                    $scope.SalesOrderApproveView = "menuViewShow";
                    $scope.POSView = "menuViewShow";
                    $cookieStore.put('SalesOrderApproveScreenId', aPermission.ScreenId);
                    $cookieStore.put('SalesOrderApprovePermission', 'true');
                }
                if (aPermission.ScreenName == "Proforma Invoice Approve" && aPermission.CanView) {
                    $scope.ProformaInvoiceApproveView = "menuViewShow";
                    $scope.ExportView = "menuViewShow";
                    $cookieStore.put('ProformaInvoiceApproveScreenId', aPermission.ScreenId);
                    $cookieStore.put('ProformaInvoiceApprovePermission', 'true');
                }
                if (aPermission.ScreenName == "Exp Generate Approve" && aPermission.CanView) {
                    $scope.ExpGenerateApproveView = "menuViewShow";
                    $scope.ExportView = "menuViewShow";
                    $cookieStore.put('ExpGenerateApproveScreenId', aPermission.ScreenId);
                    $cookieStore.put('ExpGenerateApprovePermission', 'true');
                }
                if (aPermission.ScreenName == "Commercial Invoice Approve" && aPermission.CanView) {
                    $scope.CommercialInvoiceApproveView = "menuViewShow";
                    $scope.ExportView = "menuViewShow";
                    $cookieStore.put('CommercialInvoiceApproveScreenId', aPermission.ScreenId);
                    $cookieStore.put('CommercialInvoiceApprovePermission', 'true');
                }
                if (aPermission.ScreenName == "After CI Process" && aPermission.CanView) {
                    $scope.PostCiProcessView = "menuViewShow";
                    $scope.ExportView = "menuViewShow";
                    $cookieStore.put('PostCiProcessScreenId', aPermission.ScreenId);
                    $cookieStore.put('PostCiProcessPermission', 'true');
                }
                if (aPermission.ScreenName == "Document Upload" && aPermission.CanView) {
                    $scope.ExportDocumentUploadView = "menuViewShow";
                    $scope.ExportView = "menuViewShow";
                    $cookieStore.put('ExportDocumentUploadScreenId', aPermission.ScreenId);
                    $cookieStore.put('ExportDocumentUploadPermission', 'true');
                }
                if (aPermission.ScreenName == "Revise Proforma Invoice" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.ReviseProformaInvoiceView = "menuViewShow";
                    $cookieStore.put('ReviseProformaInvoiceScreenId', aPermission.ScreenId);
                    $cookieStore.put('ReviseProformaInvoicePermission', 'true');
                }
                if (aPermission.ScreenName == "Revise Commercial Invoice" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.ReviseCommercialInvoiceView = "menuViewShow";
                    $cookieStore.put('ReviseCommercialInvoiceScreenId', aPermission.ScreenId);
                    $cookieStore.put('ReviseCommercialInvoicePermission', 'true');
                }
                if (aPermission.ScreenName == "Revise Exp Generate" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.ReviseExpGenerateView = "menuViewShow";
                    $cookieStore.put('ReviseExpGenerateScreenId', aPermission.ScreenId);
                    $cookieStore.put('ReviseExpGeneratePermission', 'true');
                }

                if (aPermission.ScreenName == "Bank Account" && aPermission.CanView) {
                    $scope.AdminView = "menuViewShow";
                    $scope.BankAccountView = "menuViewShow";
                    $cookieStore.put('BankAccountScreenId', aPermission.ScreenId);
                    $cookieStore.put('BankAccountPermission', 'true');
                }
                //if (aPermission.ScreenName == "Accounts" && aPermission.CanView) {
                //    $scope.AccountView = "menuViewShow";
                //    $cookieStore.put('AccountsPermission', 'true');
                //}
                if (aPermission.ModuleName == "Sale") {
                    $scope.SaleView = "menuViewShow";
                }
                if (aPermission.ModuleName == "Report") {
                    $scope.ReportView = "menuViewShow";
                }

            });
        })
    }

    function RemoveCookies() {
        //User Info remove
        $cookieStore.remove('UserData');
        $cookieStore.remove('ValuationSetupCurrent');
        //Permission remove
        $cookieStore.remove('UnitPermission');
        $cookieStore.remove('SubcategoryPermission');
        $cookieStore.remove('ScreenPermission');
        $cookieStore.remove('RolePermission');
        $cookieStore.remove('SyncPermission');
        $cookieStore.remove('PermissionPermission');
        $cookieStore.remove('ModulePermission');
        $cookieStore.remove('ProductPermission');
        $cookieStore.remove('EmployeePermission');
        $cookieStore.remove('DesignationPermission');
        $cookieStore.remove('DepartmentTypePermission');
        $cookieStore.remove('DepartmentPermission');
        $cookieStore.remove('ChangePasswordPermission');
        $cookieStore.remove('CategoryPermission');
        $cookieStore.remove('BranchTypePermission');
        $cookieStore.remove('BranchPermission');
        $cookieStore.remove('SupplierPermission');
        $cookieStore.remove('PaymentTypePermission');
        $cookieStore.remove('PaymentGroupPermission');
        $cookieStore.remove('BarcodePrintPermission');

        $cookieStore.remove('CustomerTypePermission');
        $cookieStore.remove('CustomerPermission');
        $cookieStore.remove('CompanyEntryPermission');
        $cookieStore.remove('TerminalPermission');
        $cookieStore.remove('ChargeTypePermission');
        $cookieStore.remove('RequisitionPurposeEntryPermission');
        $cookieStore.remove('ReturnReasonEntryPermission');
        $cookieStore.remove('VoidReasonEntryPermission');
        $cookieStore.remove('OverheadPermission');
        $cookieStore.remove('PurchaseBillPermission');
        $cookieStore.remove('LocalPurchaseBillPermission');
        $cookieStore.remove('SupplierPaymentPermission');
        $cookieStore.remove('SupplierPaymentAdjustmentPermission');
        $cookieStore.remove('SupplierLedgerPermission');
        
        $cookieStore.remove('StockReceivePermission');
        $cookieStore.remove('StockValuationSetupPermission');
        $cookieStore.remove('OpeningQuantityPermission');
        $cookieStore.remove('RequisitionPermission');
        $cookieStore.remove('StockIssuePermission');
        $cookieStore.remove('StockIssueWithoutRequisitionPermission');
        $cookieStore.remove('IssueApprovePermission');
        $cookieStore.remove('InventoryAndSaleReportsPermission');
        $cookieStore.remove('InventoryAndSaleReportsMushakPermission');
        $cookieStore.remove('SalePermission');
        $cookieStore.remove('ExchangePermission');
        $cookieStore.remove('OfferPermission');
        $cookieStore.remove('SaleVoidPermission');
        $cookieStore.remove('CashDepositPermission');
        $cookieStore.remove('DeliveryPermission');
        $cookieStore.remove('FinalPriceConfigPermission');
        $cookieStore.remove('StockDeclarationTypePermission');
        $cookieStore.remove('PurchaseOrderPermission');
        $cookieStore.remove('ReorderLevelSetupPermission');
        $cookieStore.remove('ReturnToSupplierPermission');
        $cookieStore.remove('ReturnFromDepartmentPermission');
        $cookieStore.remove('StockAuditEntryPermission');
        $cookieStore.remove('StockDeclarationEntryPermission');
        $cookieStore.remove('AuditTypePermission');
        $cookieStore.remove('ItemAdditionalAttributePermission');
        $cookieStore.remove('ItemAdditionalAttributeValuePermission');
        $cookieStore.remove('ItemAdditionalAttributePricePermission');
        $cookieStore.remove('InventoryApprovalsPermission');
        $cookieStore.remove('ApprovalSetupPermission');
        $cookieStore.remove('SalesOrderPermission');
        $cookieStore.remove('ReviseSalesOrderPermission');
        $cookieStore.remove('PurchaseRequisitionPermission');
        $cookieStore.remove('BillOfMaterialPermission');
        $cookieStore.remove('WarrentyAndSerialNoPermission');
        $cookieStore.remove('InternalWorkOrderPermission');
        $cookieStore.remove('AttendancePolicyPermission');
        $cookieStore.remove('CompanyAdvancePermission');
        $cookieStore.remove('SaleAcknowledgementPermission');
        $cookieStore.remove('SaleAdjustmentPermission');
        $cookieStore.remove('SaleRealizationPermission');
        $cookieStore.remove('SupplierAdvancePermission');
        $cookieStore.remove('PurchaseAcknowledgementPermission');
        $cookieStore.remove('PurchaseAdjustmentPermission');
        $cookieStore.remove('PurchaseRealizationPermission');
        $cookieStore.remove('BankAccountPermission');
        //$cookieStore.remove('AccountsPermission');
        $cookieStore.remove('AttendancePunchUploadPermission');
        $cookieStore.remove('TestPermission');

        //Account
        $cookieStore.remove('ChartOfAccountsPermission');
        $cookieStore.remove('AccountTypePermission');
        $cookieStore.remove('AccountTypeDetailPermission');
        $cookieStore.remove('ReceiptVoucherPermission');
        $cookieStore.remove('PaymentVoucherPermission');
        $cookieStore.remove('JournalVoucherPermission');
        $cookieStore.remove('ContraVoucherPermission');
        $cookieStore.remove('AttendancePolicyScreenId');
        $cookieStore.remove('UnitScreenId');
        $cookieStore.remove('SubcategoryScreenId');
        $cookieStore.remove('ScreenScreenId');
        $cookieStore.remove('RoleScreenId');
        $cookieStore.remove('SyncScreenId');
        $cookieStore.remove('PermissionScreenId');
        $cookieStore.remove('ModuleScreenId');
        $cookieStore.remove('ProductScreenId');
        $cookieStore.remove('EmployeeScreenId');
        $cookieStore.remove('DesignationScreenId');
        $cookieStore.remove('DepartmentScreenId');
        $cookieStore.remove('DepartmentScreenId');
        $cookieStore.remove('ChangePasswordScreenId');
        $cookieStore.remove('CategoryScreenId');
        $cookieStore.remove('BranchTypeScreenId');
        $cookieStore.remove('BranchScreenId');
        $cookieStore.remove('SupplierScreenId');
        $cookieStore.remove('PaymentTypeScreenId');
        $cookieStore.remove('PaymentGroupScreenId');
        $cookieStore.remove('BarcodePrintScreenId');
        $cookieStore.remove('CustomerTypeScreenId');
        $cookieStore.remove('CustomerScreenId');
        $cookieStore.remove('CompanyEntryScreenId');
        $cookieStore.remove('TerminalScreenId');
        $cookieStore.remove('ChargeTypeScreenId');
        $cookieStore.remove('RequisitionPurposeEntryScreenId');
        $cookieStore.remove('ReturnReasonEntryScreenId');
        $cookieStore.remove('VoidReasonEntryScreenId');
        $cookieStore.remove('OverheadScreenId');
        $cookieStore.remove('PurchaseBillScreenId');
        $cookieStore.remove('LocalPurchaseBillScreenId');
        $cookieStore.remove('SupplierPaymentScreenId');

        $cookieStore.remove('SupplierPaymentAdjustmentScreenId');
        $cookieStore.remove('SupplierLedgerScreenId');

        $cookieStore.remove('StockReceiveScreenId');
        $cookieStore.remove('RequisitionScreenId');
        $cookieStore.remove('StockValuationSetupScreenId');
        $cookieStore.remove('OpeningQuantityScreenId');
        $cookieStore.remove('StockIssueScreenId');
        $cookieStore.remove('StockIssueWithoutRequisitionScreenId');
        $cookieStore.remove('IssueApproveScreenId');
        $cookieStore.remove('InventoryAndSaleReportsScreenId');
        $cookieStore.remove('InventoryAndSaleReportsMushakScreenId');
        $cookieStore.remove('SaleScreenId');
        $cookieStore.remove('ExchangeScreenId');
        $cookieStore.remove('SaleVoidScreenId');
        $cookieStore.remove('CashDepositScreenId');
        $cookieStore.remove('OfferScreenId');
        $cookieStore.remove('DeliveryScreenId');
        $cookieStore.remove('FinalPriceConfigScreenId');
        $cookieStore.remove('StockDeclarationTypeScreenId');
        $cookieStore.remove('PurchaseOrderScreenId');
        $cookieStore.remove('ReorderLevelSetupScreenId');
        $cookieStore.remove('ReturnToSupplierScreenId');
        $cookieStore.remove('ReturnFromDepartmentScreenId');
        $cookieStore.remove('StockAuditEntryScreenId');
        $cookieStore.remove('StockDeclarationEntryScreenId');
        $cookieStore.remove('AuditTypeScreenId');
        $cookieStore.remove('ItemAdditionalAttributeScreenId');
        $cookieStore.remove('ItemAdditionalAttributeValueScreenId');
        $cookieStore.remove('ItemAdditionalAttributePriceScreenId');
        $cookieStore.remove('InventoryApprovalsScreenId');
        $cookieStore.remove('ApprovalSetupScreenId');
        $cookieStore.remove('SalesOrderScreenId');
        $cookieStore.remove('ReviseSalesOrderScreenId');
        $cookieStore.remove('PurchaseRequisitionScreenId');
        $cookieStore.remove('BillOfMaterialScreenId');
        $cookieStore.remove('WarrentyAndSerialNoScreenId');
        $cookieStore.remove('InternalWorkOrderScreenId');
        $cookieStore.remove('ProductionEntryScreenId');
        $cookieStore.remove('CompanyAdvanceScreenId');
        $cookieStore.remove('SaleAcknowledgementScreenId');
        $cookieStore.remove('SaleAdjustmentScreenId');
        $cookieStore.remove('SaleRealizationScreenId');
        $cookieStore.remove('SupplierAdvanceScreenId');
        $cookieStore.remove('PurchaseAcknowledgementScreenId');
        $cookieStore.remove('PurchaseAdjustmentScreenId');
        $cookieStore.remove('PurchaseRealizationScreenId');
        $cookieStore.remove('AttendancePunchUploadScreenId');
        $cookieStore.remove('BankAccountScreenId');
        $cookieStore.remove('TestEntryScreenId');
        //account
        $cookieStore.remove('ChartOfAccountsScreenId');
        $cookieStore.remove('AccountTypeScreenId');
        $cookieStore.remove('AccountTypeDetailScreenId');

        $cookieStore.remove('ReceiptVoucherScreenId');
        $cookieStore.remove('PaymentVoucherScreenId');
        $cookieStore.remove('JournalVoucherScreenId');
        $cookieStore.remove('ContraVoucherScreenId');

        $cookieStore.remove('ProformaInvoicePermission');// shahadat
        $cookieStore.remove('ExpGeneratePermission');
        $cookieStore.remove('CommercialInvoicePermission');
        $cookieStore.remove('ExportReportsPermission');//rakin
        
        $cookieStore.remove('ExportReportsScreenId');

        $cookieStore.remove('ProformaInvoiceScreenId');
        $cookieStore.remove('ExpGenerateScreenId');
        $cookieStore.remove('CommercialInvoiceScreenId');

        $cookieStore.remove('SalesOrderApprovePermission');
        $cookieStore.remove('ProformaInvoiceApprovePermission');
        $cookieStore.remove('ExpGenerateApprovePermission');
        $cookieStore.remove('CommercialInvoiceApprovePermission');
        $cookieStore.remove('PostCiProcessPermission');
        $cookieStore.remove('ExportDocumentUploadPermission');
        $cookieStore.remove('ReviseCommercialInvoicePermission');
        $cookieStore.remove('ReviseExpGeneratePermission');
        $cookieStore.remove('ReviseProformaInvoicePermission');
        $cookieStore.remove('ReviseProformaInvoiceScreenId');
        $cookieStore.remove('ReviseExpGenerateScreenId');
        $cookieStore.remove('ReviseCommercialInvoiceScreenId');



        $cookieStore.remove('SalesOrderApproveScreenId');
        $cookieStore.remove('ProformaInvoiceApproveScreenId');
        $cookieStore.remove('ExpGenerateApproveScreenId');
        $cookieStore.remove('CommercialInvoiceApproveScreenId');
        $cookieStore.remove('PostCiProcessScreenId');
        $cookieStore.remove('ExportDocumentUploadScreenId');

        //Error Log
        $cookieStore.remove('errorMassage');
    }

    $scope.SignOut = function () {
        $scope.User = $cookieStore.get('UserData');
        $cookieStore.put('UserData', null);
        $scope.ad_LoginLogoutLog = new Object();
        $scope.ad_LoginLogoutLog.UserId = $scope.User.UserId;
        $scope.ad_LoginLogoutLog.LogOutTime = new Date();
        $scope.ad_LoginLogoutLog.IsLoggedIn = false;
        var parms = JSON.stringify({ logInLogOutLog: $scope.ad_LoginLogoutLog });
        $http.post('/User/UpdateLoginInfo', parms).success(function (data) { });
        RemoveAllScreenLock();
        RemoveCookies();
        window.location = '/Home/Login#/';
    }

    function RemoveAllScreenLock() {
        var parms = JSON.stringify({ userId: $scope.UserId });
        $http.post('/Permission/RemoveScreenLock', parms).success(function (data) {
        });
    }

    $scope.RemoveScreenLock = function () {
        RemoveAllScreenLock();
        window.location = '/Home/Index#/Home';
    }

    // Proxy created on the fly StudentHub NotificationHub
    var job = $.connection.notificationHub;
    $.connection.hub.start();
    //// Declare a function on the job hub so the server can invoke it
    job.client.displayStatus = function () {
        getData();
    };

    // Start the connection
    getData();

    function getData() {
        $http({
            url: '/Notice/GetNotice?UserId=' + $scope.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.NoticeList = data;
            $scope.UnreadMessageNo = data.length;
            angular.forEach($scope.NoticeList, function (aNot) {
                res = aNot.CreateDate.substring(0, 5);
                if (res == "/Date") {
                    var parsedDate = new Date(parseInt(aNot.CreateDate.substr(6)));
                    aNot.Time = parsedDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

                    var parsedDate2 = new Date(parseInt(aNot.CreateDate.substr(6)));
                    aNot.CreateDate = $filter('date')(parsedDate2, 'dd-MMM-yyyy');
                }
            })
        });
    }
});

app.run(function ($window, $rootScope) {
    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function () {
        $rootScope.$apply(function () {
            $rootScope.online = false;
        });
    }, false);

    $window.addEventListener("online", function () {
        $rootScope.$apply(function () {
            $rootScope.online = true;
        });
    }, false);
});