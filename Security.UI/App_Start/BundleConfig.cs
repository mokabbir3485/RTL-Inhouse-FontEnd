using System.Web.Optimization;

namespace Security.UI
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"
                        ));
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));
            bundles.Add(new ScriptBundle("~/bundles/vendors").Include(
                "~/Scripts/sitebar.js",
                 "~/Scripts/jquery.signalR-2.2.1.min.js",
                 "~/Scripts/multiple-select.js",
                "~/Scripts/angular.min.js",
                "~/Scripts/angular-route.min.js",
                "~/Scripts/angular-cookies.js",
                "~/Scripts/angular-animate.js",
                "~/Scripts/angularjs-dropdown-multiselect.js",
                "~/Scripts/moment.min.js",
                "~/Scripts/bootstrap-datetimepicker.js",
                "~/Scripts/pikaday.js",
                "~/Scripts/alertify.js",
                "~/Scripts/awesomplete.js",
                "~/Scripts/ui-bootstrap-tpls-1.3.3.min.js",
                "~/Scripts/Chart.min.js",
                "~/Scripts/Custom.js",
                "~/Scripts/typeahead.js",
                "~/Scripts/CommonScript.js",
                "~/Scripts/xlsx.full.min.js",
                "~/Scripts/ods.js",
                "~/Scripts/linq.js",
                "~/Scripts/select2.min.js",
                "~/Scripts/alasql.min.js",
                "~/Scripts/jquery-3.5.1.min",
                "~/Scripts/jquery-ui.js",

                "~/Scripts/summernote.min.js",
                "~/Scripts/hotkeys.js",
                "~/Scripts/mousetrap.js",
                "~/Scripts/dataTables.bootstrap.min.js",
                "~/Scripts/jquery.rowspanizer.js",
                "~/Scripts/kendo.all.min.js",
                "~/Scripts/bootstrap3.4.1.js"
                  //"~/Scripts/mergeRow.js",
                  // "~/Scripts/mergeCell.js",

                 // "~/Scripts/dataTables.min.js",
                 //"~/Scripts/Dist/js/select2.js",
                 //"~/Scripts/Dist/dist/js/select2.min.js"
                ));

            bundles.Add(new ScriptBundle("~/bundles/spa").Include(
                "~/SPA/app.js",
                "~/Scripts/dirPagination.js",
                "~/SPA/Attendee/AttendeeController.js",
                "~/SPA/PaymentType/PaymentTypeController.js",
                "~/SPA/CustomerType/CustomerTypeController.js",
                "~/SPA/CustomerEntry/CustomerEntryController.js",
                "~/SPA/CompanyEntry/CompanyEntryController.js",
                "~/SPA/OverheadEntry/OverheadEntryController.js",
                "~/SPA/SupplierEntry/SupplierEntryController.js",
                "~/SPA/BranchEntry/BranchEntryController.js",
                "~/SPA/BranchTypeEntry/BranchTypeEntryController.js",
                "~/SPA/BankEntry/BankEntryController.js",
                "~/SPA/CategoryEntry/CategoryEntryController.js",
                "~/SPA/ChangePassword/ChangePasswordController.js",
                "~/SPA/Sync/Sync.js",
                "~/SPA/DepartmentEntry/DepartmentEntryController.js",
                "~/SPA/DepartmentTypeEntry/DepartmentTypeEntryController.js",
                "~/SPA/ItemAdditionalAttribute/ItemAdditionalAttributeController.js",
                "~/SPA/ItemAdditionalAttributeValue/ItemAdditionalAttributeValueController.js",
                "~/SPA/ItemAdditionalAttributePrice/ItemAdditionalAttributePriceController.js",
                "~/SPA/ItemEntry/ItemEntryNewController.js",
                "~/SPA/ItemEntry/ItemEntryTwoController.js",
                "~/SPA/ModiulEntry/ModiulEntryController.js",
                "~/SPA/PermissionEntry/PermissionEntryController.js",
                "~/SPA/RoleEntry/RoleEntryController.js",
                "~/SPA/BarcodePrint/BarcodePrintControlloer.js",
                "~/SPA/ScreenEntry/ScreenEntryController.js",
                "~/SPA/SubcategoryEntry/SubcategoryEntryController.js",
                "~/SPA/Unit/UnitController.js",
                "~/SPA/PaymentGroup/PaymentGroupController.js",
                "~/SPA/VoidReasonEntry/VoidReasonEntryController.js",
                "~/SPA/DesignationEntry/DesignationEntryController.js",
                "~/SPA/EmployeeEntry/EmployeeController.js",
                "~/SPA/TerminalEntry/TerminalEntryController.js",
                "~/SPA/DeclarationTypeEntry/DeclarationTypeEntryController.js",
                "~/SPA/PriceTypeEntry/PriceTypeEntryController.js",
                "~/SPA/ChargeTypeEntry/ChargeTypeEntryController.js",
                "~/SPA/FinalPriceConfig/FinalPriceConfigController.js",
                "~/SPA/RequisitionPurposeEntry/RequisitionPurposeEntryController.js",
                "~/SPA/ReturnReasonEntry/ReturnReasonEntryController.js",
                "~/SPA/AuditTypeEntry/AuditTypeEntryController.js",
                "~/SPA/Approval/ApprovalController.js",
                "~/SPA/BankAccount/BankAccountController.js",
                "~/SPA/AttendancePunchUpload/AttendancePunchUploadController.js",

                "~/SPA/ACCOUNTS/ChartOfAccounts/ChartOfAccountsController.js",
                "~/SPA/ACCOUNTS/AccountTypeDetail/AccountTypeDetailController.js",
                "~/SPA/ACCOUNTS/AccountType/AccountTypeController.js",
                "~/SPA/ACCOUNTS/ReceiptVoucher/ReceiptVoucherController.js",
                "~/SPA/ACCOUNTS/PaymentVoucher/PaymentVoucherController.js",
                "~/SPA/ACCOUNTS/JournalVoucher/JournalVoucherController.js",
                "~/SPA/ACCOUNTS/ContraVoucher/ContraVoucherController.js",

                "~/SPA/INVENTORY/PurchaseBillEntry/PurchaseBillEntryController.js",
                "~/SPA/INVENTORY/PurchaseOrder/PurchaseOrderEntryController.js",
                "~/SPA/INVENTORY/ReceiveEntry/ReceiveEntryController.js",
                "~/SPA/INVENTORY/StockReceive/StockReceiveController.js",
                "~/SPA/INVENTORY/RequisitionEntry/RequisitionEntryController.js",
                "~/SPA/INVENTORY/Setup/SetupController.js",
                "~/SPA/INVENTORY/OpeningQtyEntry/OpeningQtyEntryController.js",
                "~/SPA/INVENTORY/IssueEntry/IssueEntryController.js",
                "~/SPA/INVENTORY/IssueWithoutRequisition/IssueWithoutRequisitionController.js",
                "~/SPA/INVENTORY/IssueApprove/IssueApproveController.js",
                "~/SPA/INVENTORY/InventoryReports/InventoryReportsController.js",
                "~/SPA/INVENTORY/InventoryReportsMushak/InventoryReportsMushakController.js",
                "~/SPA/INVENTORY/ExportReports/ExportReportsController.js",//rakin
                "~/SPA/INVENTORY/CIFReport/CIFReportController.js",
                "~/SPA/INVENTORY/Delivery/DeliveryController.js",
                "~/SPA/INVENTORY/AdjustmentEntry/AdjustmentEntryController.js",
                "~/SPA/INVENTORY/ReorderLevelSetup/ReorderLevelSetupController.js",
                "~/SPA/INVENTORY/ReturnToSupplier/ReturnToSupplierController.js",
                "~/SPA/INVENTORY/ReturnFromDepartment/ReturnFromDepartmentController.js",
                "~/SPA/INVENTORY/StockAuditEntry/StockAuditEntryController.js",
                "~/SPA/INVENTORY/StockDeclarationEntry/StockDeclarationEntryController.js",
                "~/SPA/INVENTORY/InventoryApprovals/InventoryApprovalsController.js",
                "~/SPA/INVENTORY/PurchaseRequisition/PurchaseRequisitionEntryController.js",

                 "~/SPA/INVENTORY/ImportPurchaseBill/ImportPurchaseBillEntryController.js",
                "~/SPA/INVENTORY/PurchaseBillEntry/PurchaseBillEntryController.js",
                "~/SPA/INVENTORY/LocalPurchaseBillEntry/LocalPurchaseBillController.js",

                "~/SPA/INVENTORY/WarrentyAndSerialNo/WarrentyAndSerialNoEntryController.js",
                "~/SPA/INVENTORY/InternalWorkOrder/InternalWorkOrderEntryController.js",
                "~/SPA/INVENTORY/ProductionEntry/ProductionEntryController.js",
                "~/SPA/INVENTORY/CIFReport/CIFReportController.js",
                "~/SPA/POS/Sale/SaleController.js",
                "~/SPA/POS/Exchange/ExchangeController.js",
                "~/SPA/POS/Offer/OfferController.js",
                "~/SPA/POS/SaleVoid/SaleVoidController.js",
                "~/SPA/POS/CashTransfer/CashTransferController.js",
                "~/SPA/Home/HomeController.js",
                "~/SPA/POS/SalesOrder/SalesOrderEntryController.js",
                "~/SPA/POS/ReviseSalesOrder/ReviseSalesOrderEntryController.js",
				"~/SPA/POS/SalesOrderApprove/SalesOrderApproveController.js",
                "~/SPA/HR/AttendancePolicy/AttendancePolicyController.js",
                "~/SPA/RECEIVABLE/CompanyAdvance/CompanyAdvanceEntryController.js",
                "~/SPA/RECEIVABLE/SaleAcknowledgement/SaleAcknowledgementController.js",
                "~/SPA/RECEIVABLE/SaleAdjustment/SaleAdjustmentController.js",
                "~/SPA/RECEIVABLE/SaleRealization/SaleRealizationController.js",
                "~/SPA/PAYABLE/SupplierAdvance/SupplierAdvanceEntryController.js",
                "~/SPA/PAYABLE/PurchaseAcknowledgement/PurchaseAcknowledgementController.js",
                "~/SPA/PAYABLE/PurchaseAdjustment/PurchaseAdjustmentController.js",
                "~/SPA/PAYABLE/PurchaseRealization/PurchaseRealizationController.js",
                "~/SPA/ACCOUNTS/AccountsWindow/AccountsWindowController.js",

                "~/SPA/EXPORT/ProformaInvoice/ProformaInvoiceController.js",
                "~/SPA/EXPORT/ExpGenerate/ExpGenerateController.js",
                "~/SPA/EXPORT/CommercialInvoice/CommercialInvoiceController.js",
                "~/SPA/EXPORT/ProformaInvoiceApprove/ProformaInvoiceApproveController.js",
                "~/SPA/EXPORT/ExpGenerateApprove/ExpGenerateApproveController.js",
                "~/SPA/EXPORT/CommercialInvoiceApprove/CommercialInvoiceApproveController.js",
                "~/SPA/EXPORT/PostCiProcess/PostCiProcessController.js",
                "~/SPA/EXPORT/ExportDocumentUpload/ExportDocumentUploadController.js",
                "~/SPA/EXPORT/ReviseProformaInvoice/ReviseProformaInvoiceController.js",
                "~/SPA/EXPORT/ReviseExpGenerate/ReviseExpGenerateController.js",
                "~/SPA/EXPORT/ReviseCommercialInvoice/ReviseCommercialInvoiceController.js",
                "~/SPA/EXPORT/ProformaInvoiceReport/ProformaInvoiceReportController.js",
                "~/SPA/EXPORT/CommercialInvoiceReport/CommercialInvoiceReportController.js",
                "~/SPA/EXPORT/DeliveryChallanReport/DeliveryChallanReportController.js",
                "~/SPA/EXPORT/PackingReport/PackingReportController.js",
                "~/SPA/EXPORT/PackingDocumentReport/PackingDocumentReportController.js",
                "~/SPA/EXPORT/TruckChallanReport/TruckChallanReportController.js",
                "~/SPA/EXPORT/BankReport/BankReportController.js",

                "~/SPA/EXPORT/BillOfExchangeReport/BillOfExchangeReportController.js",
                "~/SPA/EXPORT/BillOfExchangeReport2/BillOfExchangeReport2Controller.js",
                "~/SPA/EXPORT/BeneficiaryCertificateReport/BeneficiaryCertificateReportController.js",
                "~/SPA/EXPORT/ConsumptionCertificateReport/ConsumptionCertificateReportController.js",
                 "~/SPA/EXPORT/CertificateReport/CertificateOfOriginController.js",
                 "~/SPA/EXPORT/CertificatePreReport/CertifaciateOfPreInspectionController.js",
                "~/SPA/EXPORT/DeliveryChalan/DeliveryChalanController.js",

                  "~/SPA/INVENTORY/IWOReport/InternalWorkOrderReportController.js",
                 "~/SPA/INVENTORY/DeliveryReport/DeliveryReportController.js",
                 "~/SPA/INVENTORY/BillOfMaterial/BillOfMaterialController.js",

                  "~/SPA/CustomTarrif/Mushak4_3/Mushak4_3ReportController.js",
                 "~/SPA/CustomTarrif/Mushak6_1/Mushak6_1ReportController.js",
                "~/SPA/CustomTarrif/Mushak6_2/Mushak6_2ReportController.js",

                 "~/SPA/INVENTORY/LocalPurchaseReport/LocalPBReportController.js",

                  "~/SPA/Procurement/SupplierPaymentEntry/SuppilerPaymentController.js",

                   "~/SPA/Procurement/SupplierAdjustment/SupplierAdjustmentController.js",
                   "~/SPA/Procurement/SupplierLedgerReport/SupplierLedgerReportController.js",
                   "~/SPA/Procurement/SupplierLedger/SupplierLedgersController.js",

                 "~/SPA/IndexController.js",
                 "~/SPA/Test/TestEntryController.js"
                ));
            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      //"~/Scripts/bootstrap-timepicker.min.js",
                      "~/Scripts/respond.js"

                     ));
            bundles.Add(new StyleBundle("~/Content/css").Include(

                      "~/Content/bootstrap.css",
                      "~/Content/bootstrap3.4.1.min.css",
                      "~/Content/bootstrap-datetimepicker.css",
                       "~/Content/summernote.min.css",
                      //"~/Content/bootstrap-timepicker.min.css",
                      "~/Content/multiple-select.css",
                      "~/Content/font-awesome.min.css",
                       "~/Content/pikaday.css",
                       "~/Content/jquery-ui.css",
                      "~/Content/theme.css",
                      "~/Content/skins.css",
                      "~/Content/sitebar.css",
                      "~/Content/alertify.core.css",
                      "~/Content/alertify.default.css",
                      "~/Content/select2.css",
                      "~/Content/awesomplete.css",
                       "~/Content/dataTables.min.css",
                        "~/Content/dataTables.bootstrap.min.css",
                           "~/Content/kendo.common.min.css",
                              "~/Content/kendo.blueopal.min.css",
                          "~/Content/Custom.css"
                         //"~/Content/dist/css/select2.css",
                         //"~/Content/dist/css/select2.min.css"
                      ));
            BundleTable.EnableOptimizations = false;
        }
    }
}