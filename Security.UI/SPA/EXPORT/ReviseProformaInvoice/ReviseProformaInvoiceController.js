app.controller("ReviseProformaInvoiceController", function ($scope, hotkeys, $cookieStore, $http, $filter, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.AccountForList = [{ AccountFor: "Exporter" }, { AccountFor: "Customer" }, { AccountFor: "Salary" }];
    getAllExporter();
    getAllActiveImporter();
    GetAllAmendmentReason();
    dateTimePicker();
    clear();

    //Methods
    function dateTimePicker() {
        $('#txtInvoiceDate').datetimepicker({
            format: 'MMM DD, YYYY',
            timepicker: false,

        });

        $scope.CalendarOpenInvoiceDate = function () {
            $("#txtInvoiceDate").focus();
            $("#txtInvoiceDate").trigger("click");
        }

        $('#txtSalesFromDate').datetimepicker({
            format: 'MMM DD, YYYY',
            timepicker: false,

        });

        $scope.CalendarOpenSalesFromDate = function () {
            $("#txtSalesFromDate").focus();
            $("#txtSalesFromDate").trigger("click");
        }

        $('#txtSalesToDate').datetimepicker({
            format: 'MMM DD, YYYY',
            timepicker: false,

        });

        $scope.CalendarOpenSalesToDate = function () {
            $("#txtSalesToDate").focus();
            $("#txtSalesToDate").trigger("click");
        }

        $('#txtInvoiceFromDate').datetimepicker({
            format: 'MMM DD, YYYY',
            timepicker: false,
        });

        $scope.CalendarOpenInvoiceFromDate = function () {
            $("#txtInvoiceFromDate").focus();
            $("#txtInvoiceFromDate").trigger("click");
        }

        $('#txtInvoiceToDate').datetimepicker({
            format: 'MMM DD, YYYY',
            timepicker: false,
        });

        $scope.CalendarOpenInvoiceToDate = function () {
            $("#txtInvoiceToDate").focus();
            $("#txtInvoiceToDate").trigger("click");
        }

        $("#txtPO_Date").datepicker({
            dateFormat: "M d, yy"
        });

        $scope.CalendartxtPO_Date = function () {
            $("#txtPO_Date").focus();
            $("#txtPO_Date").trigger("click");
        }
    }

    function clear() {
        $scope.POReference = {};
        $scope.POReferencelist = [];
        $scope.POReferencelistTemp = [];

        $scope.datarow = [];
        $scope.ItemTableDataRow1 = [];
        $scope.ItemRow = [];
        $scope.exportInvoice = { InvoiceId: 0, InvoiceDate: new Date() };
        $scope.ddlExporter = null;
        $scope.ddlImporter = null;
        $scope.ddlExporterBank = null;
        $scope.ddlImporterBank = null;
        $scope.row_numP1 = null;
        $scope.SalesOrderList = [];
        $scope.invoiceDetailList = [];
        $scope.margeProduct = [];
        $scope.thArray = [];
        $scope.ItemTableHeaders =
            [
                "SalesOrderId", "ItemId", "SlNo", "Item Name", "Description Of Goods", "Qty", "Unit Price", "Amount"
            ]; //used for dynamic table headers
        $scope.ItemTableFooter = ["", "", "", "", "", "0", "", "0"];
        $scope.ItemTableDataRow = [];
        $scope.ItemTableData = [];
        $scope.ItemCategory = [];
        $scope.amendment = {};
        $scope.PerPage = 10;
        $scope.total_count = 0;
        $scope.distCount = 1;
        $scope.QtySumForItem = 0;
        $scope.UnitpriceSumForItem = 0;
        $scope.AmountSumForItem = 0;
        $scope.TableHtmlData = {};
        $scope.index = {};
        $scope.salesOrderId = {};
        $scope.EmailList = [];
        $scope.ItemSearchResultList = [];
        $scope.tdData = [];
        $scope.CustomiseTableData = {};
        $scope.previousDataList = [];
        $scope.isFinalized = false;
        $scope.IsPreviousData = false;
        $scope.IsTableShow = false;
        $scope.isInfoShow = false;
        $scope.isEnableIput = false;
        $scope.disBank = true;
        $scope.itemFlag = false;
        $("#itemNameDisable").attr("disabled", true);
        $scope.ddlFactory = "";
        $scope.ddlInvoiceType = "";
        $scope.ddlEmail = "";
        $scope.InvoiceNoTemp = "";
        $scope.saveButtonLabel = "Save";
        $scope.termsandConbtn = "Add";
        $scope.isRemoved = false;
        $scope.totalAmount = 0;
        $scope.exportInvoice.InvoiceDate = $filter("date")(new Date().toJSON().slice(0, 10), "MMM dd, yyyy");
        $("#txtInvoiceDate").val($scope.exportInvoice.InvoiceDate);
        //$scope.InvoiceTypeList = [{ InvoiceTypeId: 1, InvoiceType: "PI" }, { InvoiceTypeId: 2, InvoiceType: "SC/TT" }, { InvoiceTypeId: 3, InvoiceType: "SC/FDD" }];
        $scope.InvoiceTypeList = [];
        GetAllInvoiceType();

        $scope.packingInfo = {
            TotalCarton: 0,
            LabelNetWeight: 0,
            LabelGrossWeight: 0,
            RibonNetWeight: 0,
            RibonGrossWeight: 0,
            CartonMeasurement: ""
        };
        $scope.TermsAndConditionList =
            "<ol><li>Payment: Letter of Credit&nbsp;<b> 90 days&nbsp;</b>From the date of Delivery Challan to be opened in favor of Retail Technologies Ltd.</li><li>Payment Should be made in U.S Dollar through LC.</li><li>Partial Shipment Allowed.</li><li>&nbsp;Quantity &amp; Value may vary +/- 10% of total Quantity &amp; Value of the Proforma Invoice.</li><li>Delivery Challan Should be treated as transport/Truck Challan.</li><li>Maturity date should be calculated from the date of goods delivery Challan.</li><li>All Banking Charges inside openers Bank counter on account of opener and outside openers bank counter on account of beneficiary.</li><li>Payment after Export Realization clause not allowed in the LC.</li><li>LC must incorporate delivery validity 30 days from the date of LC.</li><li>Presentation period: 15 days from the date of delivery.</li><li>L/C should be freely negotiable.</li><li>PI Validity 65 days from the date of issue.</li><li>Discrepancy charge should be mentioned between 25-30 Dollars.<br></li></ol>";
        $scope.TermsAndConditionListForTT =
            "<ol><li>This Sales Contract has been issued in relation to the Purchase Order Presented by the buyer/customer.</li><li>Payment Should Be Made in U.S Dollar Through TT.</li><li>Partial Shipment: Allowed.</li><li>All Banks Charges (Local &amp; overseas) and from customer’s account.</li><li>Delivery Challan should be treated as transport/Truck Challan.</li><li>Utilization Declaration (UD) has to be in place within 3 working days.</li><li>Sales Contract Validity 30 days from issuing date.</li></ol>";
        $scope.TermsAndConditionListForFDD =
            "<ol><li>This sales contract has been issued in relation to the purchase presented by the buyer/customer.</li><li>Payment Mode: FDD in favor of Retail Technologies Ltd.</li><li>Payment should be made <b>At Sight&nbsp;</b> after the date of delivery.</li><li>Payment should be made in U.S Dollar.</li><li>Partial Shipment: Allowed.</li><li>Delivery Challan should be treated as transport/truck challan.</li><li>Quantity &amp; value may vary +/- 10 % of total value & quantity of sales contract.</li><li>Sales Contract validity 30 days from issuing date.</li></ol>";

        $(".summernote").summernote("code", $scope.TermsAndConditionList);
        GetAllProformaInvoiceList();
        getAllExporter();
        GetAllSPCase();
        ClearItem();
        ClearCompany();
    }

    function GetAllInvoiceType() {
        $http({
            url: "/ExpInvoice/GetAllInvoiceType",
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.InvoiceTypeList = data;
            $scope.InvoiceTypeList.pop();
        })
    }

    $scope.invoiceTypeChange = function () {
        invoiceTypeChange();
    }

    function invoiceTypeChange() {
        if ($scope.exportInvoice.PaymentProcessTypeId == 1) {
            $scope.TermsAndConditionList =
                "<ol><li>Payment: Letter of Credit&nbsp;<b> 90 days&nbsp;</b>From the date of Delivery Challan to be opened in favor of Retail Technologies Ltd.</li><li>Payment Should be made in U.S Dollar through LC.</li><li>Partial Shipment Allowed.</li><li>&nbsp;Quantity &amp; Value may vary +/- 10% of total Quantity &amp; Value of the Proforma Invoice.</li><li>Delivery Challan Should be treated as transport/Truck Challan.</li><li>Maturity date should be calculated from the date of goods delivery Challan.</li><li>All Banking Charges inside openers Bank counter on account of opener and outside openers bank counter on account of beneficiary.</li><li>Payment after Export Realization clause not allowed in the LC.</li><li>LC must incorporate delivery validity 30 days from the date of LC.</li><li>Presentation period: 15 days from the date of delivery.</li><li>L/C should be freely negotiable.</li><li>PI Validity 65 days from the date of issue.</li><li>Discrepancy charge should be mentioned between 25-30 Dollars.<br></li></ol>";
            $(".summernote").summernote("code", $scope.TermsAndConditionList);
        } else if ($scope.exportInvoice.PaymentProcessTypeId == 2) {
            $scope.TermsAndConditionList = $scope.TermsAndConditionListForTT;
            $(".summernote").summernote("code", $scope.TermsAndConditionList);
        } else if ($scope.exportInvoice.PaymentProcessTypeId == 3) {
            $scope.TermsAndConditionList = $scope.TermsAndConditionListForFDD;
            $(".summernote").summernote("code", $scope.TermsAndConditionList);
        }
        $scope.ddlFactory = {};
    }

    function ClearCompany() {
        $scope.companyAddresslist = [];
        $scope.companyBillPolicylist = [];
        $scope.companyTypeList = [];
        $scope.Branchlist = [];
        $scope.msgAlert = "Save";
        $scope.hidePayable = true;
        $scope.duplicateCompName = false;
        $scope.duplicateCompCode = false;

        $scope.ad_Company = {};
        $scope.ddlCompanyType = null;
        $scope.ddlBranch = null;
        $scope.ad_Company.CompanyId = 0;
        $scope.ad_Company.IsActive = true;
        $scope.buttonSupp = "Save";
        $scope.btnDeleteShow = false;

        $scope.ddlEmployeeRef = { "EmployeeId": $scope.LoginUser.EmployeeId };
        $scope.CompanyTypeList = [];
        $scope.EmployeeListForAdd = [];
        ClearCompanyAddress();
        ClearCompanyBillPolicy();
        GetAllCompanyType();
        GetAllEmployee();
    }

    function ClearCompanyAddress() {
        $scope.ad_CompanyAddress = new Object();
        $scope.ad_CompanyAddress.AddressType = "Billing";
        $scope.buttonSuppAddress = "Add";
        $scope.ad_CompanyAddress.IsDefault = true;
        $scope.buttonComAddress = "Add";
        $scope.btnSuppAddressDeleteShow = false;
        $scope.addressRowIndex = "";
    }

    function ClearCompanyBillPolicy() {
        $scope.ad_CompanyBillPolicy = new Object();
        $scope.buttonBillPolicy = "Add";
        $scope.btnSuppBillPolicyDeleteShow = false;
        $scope.billRowIndex = "";
    }

    function ClearItem() {
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        $scope.SearchCriteria = "1=1";
        $scope.ad_Item = {};
        $scope.ad_Item.ItemId = 0;
        $scope.btnSaveItem = "Save";
        $scope.btnImport = "Import";
        $scope.checkIsImport = false;
        $scope.ad_Item.ContainerSize = "";
        $scope.ad_Item.UnitPerPackage = 1;
        $scope.btnPackageWeight = "Roll Weight";
        $scope.btnPackagePerContainer = "Package Per Container";
        $scope.btnContainerWeight = "Carton Weight";
        $scope.btnContainerSize = "Carton Size";
        $scope.Package = false;
        $scope.Container = false;
        $scope.ad_Item.IsActive = true;
        $scope.ddlCategory = null;
        $scope.ddlHsCode = null;
        $scope.ddlItemUnit = null;
        $scope.ddlItemPackage = null;
        $scope.ddlItemContainer = null;
        $scope.ddlSubCategory = null;
        $scope.ItemMainlist = [];
        $scope.ItemSearchList = [];
        $scope.AllItemSearch = [];
        $scope.FirstAttributeList = [];
        $scope.CustomiseTableDataList = [];
        $scope.ItemSelected = false;
        GetItemSearchResultPaged($scope.currentPage, $scope.SearchCriteria);
        GetAllCategory();
        GetAllSubCategory();
        GetAllItemUnit();
        GetAllItem();
        GetHsCode();
        GetByCombinationValue();
        $scope.btnUnitPackage = $scope.ddlItemPackage;
    }
    function getAllExporter() {
        $http({
            url: '/ExpInvoice/GetAllExporter',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ExporterList = data;
        })
    };

    function getAllActiveImporter() {
        $http({
            url: '/Company/GetCompanyDynamic?searchCriteria=C.IsActive=1&orderBy=CompanyName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.companyList = data;
        })
    };

    function GetAllProformaInvoiceList() {

        $http({
            url: '/ExpInvoice/GetAllInvoice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.invoiceList = data;
        });
    }
    function dynamictable() {

        $("#mofiz").on("click",
            function (e) {

                e.preventDefault();
                e.stopPropagation();
                //$(e).toggleClass("red-cell");
                if ($(e.target).is("#mofiz tbody tr td")) {
                    $("#mofiz tbody tr td").each(function () {
                        $(this).css("background", "#F5F5F5");
                    });
                    $(e.target).css("background", "yellow");


                    var column_num = parseInt($(e.target).index()) + 1; //need this one
                    $scope.row_numP1 = parseInt($(e.target).parent().index()) + 1;

                    $("#result").html("<h3>Row Number: " + $scope.row_numP1 + "  ,  Column Number: " + column_num + "</h3>");
                    $("#left").unbind().click(function () {

                        var column = column_num - 1;

                        //alert(column);
                        $("#mofiz thead tr th:eq(" + column + ")").before($(
                            '<th class="t-cell-center col"  style="width:11%;" contentEditable="true">Left</th>'));

                        $("#mofiz tbody tr").each(function () {
                            $(this).children("td:eq(" + column + ")")
                                .before($('<td   class="t-cell-center col" contentEditable="true"></td>'));
                        });
                        $("#mofiz tfoot tr td:eq(" + column + ")").before($(
                            '<td  style="text-align:right;padding-right: 4px;" class="col" contentEditable="true"></td>'));


                    });

                    $("#right").unbind().click(function () {
                        var column = column_num - 1;

                        $("#mofiz thead tr th:eq(" + column + ")").after($(
                            '<th  style="width:11%;"  class="t-cell-center col" contentEditable="true">Right</th>'));
                        $("#mofiz tbody tr").each(function () {
                            //$('td:first').after($("<td>Value</td>"));
                            $(this).children("td:eq(" + column + ")")
                                .after($('<td    class="t-cell-center col" contentEditable="true"></td>'));
                        });
                        $("#mofiz tfoot tr td:eq(" + column + ")").after($(
                            '<td  style="text-align:right;padding-right: 4px;" class="col" contentEditable="true"></td>'));

                    });
                    $("#hide").unbind().click(function () {
                        var column = column_num;

                        $("#mofiz thead tr th:nth-child(" + column + ")").hide();
                        $("#mofiz tbody tr td:nth-child(" + column + ")").hide();
                        $("#mofiz tfoot tr td:nth-child(" + column + ")").hide();
                        $scope.isRemoved = true;
                    });
                    $("#unhide").unbind().click(function () {
                        $("#mofiz thead tr").each(function () {
                            $("th").show();
                        });

                        $("#mofiz tbody tr").each(function () {
                            $("td").show();
                        }
                        );
                        //$("#mofiz").colResizable({
                        //    liveDrag: true,
                        //    resizeMode: 'flex',
                        //});
                        $scope.isRemoved = false;
                    });


                }
                return false;
            });


        $("#sort").unbind().click(function () {
            var r = confirm("Please change your cloumn header before sort.Once you sort you cant change it");
            if (r == true) {
                $("#mofiz").trigger("updateAll");
                //$('#mofiz thead th').removeClass('sorter-false');
                $("#mofiz").tablesorter({
                    widgets: ["resizable"],
                    widgetOptions: {
                        // storage_useSessionStorage : true, deprecated in v2.28.8
                        // use first letter (s)ession
                        resizable_addLastColumn: true

                    }
                });
                $scope.isRemoved = true;
            } else {
                alertify.confirm().destroy();
            }


        });

    }
     function GetSalesOrderListByCompanyForUpdate(obj) {

         $http({
             url: "/SalesOrder/GetSalesOrderForPiUpdate?InvoiceId=" + obj.InvoiceId + "&CompanyId=" + obj.CompanyId,
             method: "GET",
             headers: { 'Content-Type': "application/json" }
         }).success(function (data) {
             $scope.SalesOrderList = [];
             if (data) {
                 var amount = 0.00;
                 angular.forEach(data,
                     function (e) {
                         //Date Format
                         var parsedDate1 = new Date(parseInt(e.SalesOrderDate.substr(6)));
                         var date1 = ($filter("date")(parsedDate1, "dd/MM/yyyy")).toString();
                         e.SalesOrderDate = date1;
                         e.disabled = true;
                         if (e.IsChecked) {
                             amount += e.Amount;
                         }
                     });

                 $scope.SalesOrderList = data;
                 $scope.totalAmount = amount;
             }
         });
         if ($scope.isLoadItemCategory) {
             GetInvoiceDetailByInvoiceId(obj.InvoiceId);

         }
     }


    function GetInvoiceDetailByInvoiceId(invoiceId) {
        $http({
            url: '/ExpInvoice/InvoiceDetailGetByInvoiceId?invoiceId=' + invoiceId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.invoiceDetailList = [];
            $scope.invoiceDetailSplittedList = [];
            if (data.length) {
                angular.forEach(data, function (adata) {
                    adata.PreAmountOfLcCoppyItem = adata.UnitPrice;
                    //adata.IsOverride = false;

                    $scope.invoiceDetailList.push(adata);
                    QuantityAndAmountSum();
                    $scope.invoiceDetailSplittedList = angular.copy($scope.invoiceDetailList);
                });
            }
            else {
                $scope.totalAmount = 0;
                $scope.ItemCategory = [];
                for (var i = 0; i < $scope.SalesOrderList.length; i++) {
                    $scope.SalesOrderList[i].IsChecked = false;

                };
                $scope.flagForAmendAfterReset = true;
            }

        });
    }
    function GetSubCategoryByItemIds() {
        var idsConcat = "";
        if (!$scope.isLoadItemCategory) {
            angular.forEach($scope.invoiceDetailList, function (aitem) {
                idsConcat += idsConcat === '' ? ('' + aitem.ItemId) : (',' + aitem.ItemId);
            });
            $scope.ItemCategory = [];
            $http({
                url: '/Item/GetSubCategoryByItemIds?itemIds=' + idsConcat,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (subItem) {

                $scope.ItemCategory = subItem;
            });
        }
        else if ($scope.flagForAmendAfterReset) {
            angular.forEach($scope.invoiceDetailList, function (aitem) {
                idsConcat += idsConcat === '' ? ('' + aitem.ItemId) : (',' + aitem.ItemId);
            });
            $scope.ItemCategory = [];
            $http({
                url: '/Item/GetSubCategoryByItemIds?itemIds=' + idsConcat,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (subItem) {

                $scope.ItemCategory = subItem;
            });
        }

    }

    function GetAllAmendmentReason() {

        $http({
            url: '/ExpAmendmentReason/GetAllAmendmentReason',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AmendmentReasonList = data;

        });
    }
    function ckeckValidData() {
        $("#mofiz tbody td").find(":input").each(function () {
            var IsNaN = parseFloat($(this).val());

            if (isNaN(IsNaN)) {
                alert("Invalid Qty & Unit Price !!!");
                alertify.confirm().destroy();
                return;
            }
        });
    }

    function savePI(isAmendment, type) {
        if (!$scope.invoiceDetailList.length) {
            alertify.log("Please select atleast one SO", "error", "5000");
            return;
        }
         
       
        ckeckValidData();
        alertify.confirm("Are you sure to " + type + "?", function (e) {
            if (e) {
                $("#mofiz tbody tr td").each(function () {
                    $(this).css("background", "#F5F5F5");
                });

                //input replace
                $("#mofiz tbody td").find(":input").each(function () {
                    $(this).replaceWith(this.value);
                });
                newFun();
                $('#mofiz td:nth-child(1)').remove();
                $('#mofiz th:nth-child(1)').remove();
                $scope.TableHtmlData.HtmlData = String($("#mofiz")[0].outerHTML);
                var termsAndCondition = $('.summernoteRv').summernote('code');
                $scope.exportInvoice.TermsAndCondition = termsAndCondition;

                $scope.exportInvoice.IsAmendment = isAmendment;
                $scope.exportInvoice.IsSubmit = isAmendment;
                $scope.exportInvoice.UpdatedBy = $scope.LoginUser.UserId;

                if ($scope.exportInvoice.PONo == "" || $scope.exportInvoice.PONo == undefined || $scope.exportInvoice.PONo == null) {
                    $scope.exportInvoice.PONo = "";
                    $scope.exportInvoice.PODate = null;
                }

                if ($scope.exportInvoice.PODate == undefined || $scope.exportInvoice.PODate == "" || $scope.exportInvoice.PODate == null) {
                    $scope.exportInvoice.PODate = null;
                }

                var params = JSON.stringify({
                    exp_Invoice: $scope.exportInvoice, invoiceDetailList: $scope.invoiceDetailList, exp_PackingInfo: $scope.packingInfo, modifiedDataList: $scope.CustomiseTableDataList,
                    tableHtmlData: $scope.TableHtmlData, POReferencelist: $scope.POReferencelist });

                $http.post('/ExpInvoice/Post', params).success(function (data) {
                    if (data !== "") {
                        alertify.log(data, 'success', '5000');
                        $(".summernoteRv").summernote("reset");
                        clear();
                        $scope.ReviseProformaInvoiceForm.$setPristine();
                        $scope.ReviseProformaInvoiceForm.$setUntouched();
                    }
                }).error(function (msg) {
                    alertify.log('Save failed, refresh page and try again', 'error', '5000');
                });
            }
        })
    }
    function GetItemSearchResultPaged(curPage, SearchCriteria) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: "/Item/GetItemSearchResultPaged?StartRecordNo=" +
                StartRecordNo +
                "&RowPerPage=" +
                $scope.PerPage +
                "&whClause=" +
                encodeURIComponent(SearchCriteria) +
                "&rows=" +
                0,
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.ItemSearchResultList = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }
    function GetEmployeeEmailByDocumentRef() {
        $http({
            url: "/Employee/GetEmployeeEmailByDocumentRef?refEmployeeId=" +
                $scope.exportInvoice.RefEmployeeId +
                "&PaymentProcessTypeId=" +
                $scope.exportInvoice.PaymentProcessTypeId,
            method: "GET",
            headers: { 'Content-type': "application/json" }
        }).success(function (data) {
            if (data.length > 0) {
                var isManagerRef = data[0].IsManagerRef;
                angular.forEach(data,
                    function (emp) {
                        if (isManagerRef) {
                            emp.IsSelected = emp.EmployeeId === $scope.exportInvoice.RefEmployeeId ? false : true;
                        } else {
                            emp.IsSelected = emp.EmployeeId === $scope.exportInvoice.RefEmployeeId ? true : false;
                        }
                    });
                $scope.EmailList = data;
                $scope.refEmail = $scope.EmailList[0].Email;

            }
            if ($scope.saveButtonLabel == "Save") {
                angular.forEach($scope.EmailList,
                    function (email) {
                        if (email.IsSelected == true) {
                            $scope.ddlEmail = { EmployeeId: email.EmployeeId };
                        }
                    });
            }

        });
    }


    $scope.resetFormModal = function () {
        $("#companyEntryForm").empty();
        $scope.companyEntryForm.$setPristine();
        $scope.companyEntryForm.$setUntouched();

    };
    $scope.Finalized = function () {
        $scope.isFinalized = true;
        $("#itemNameDisable").attr("disabled", false);
        for (var i = 0; i < $scope.SalesOrderList.length; i++) {

            $scope.SalesOrderList[i].disabled = true;
        }
        //$('#itemNameDisable').attr("disabled", true);
        //$scope.ad_Item.TempItemName = '';
    }
    function QuantityAndAmountSum() {
        $scope.QuantitySum = 0;
        $scope.AmountSum = 0;
        angular.forEach($scope.invoiceDetailList, function (aItem) {
            $scope.QuantitySum += aItem.Quantity.toFixed(2);
            $scope.AmountSum += aItem.Amount.toFixed(2);
        });

    }
    $scope.GetEmail = function () {
        GetEmployeeEmailByDocumentRef();

    }
    $scope.LoadInvoice = function () {

        $scope.SalesOrderList = [];
        $scope.invoiceDetailList = [];
        $http({
            url: '/ExpApproval/exp_PiAmendment_GetForEdit?approvalType=PiAmendment&approvalPassword=' + ($scope.exportInvoice.Password),
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                $scope.disBank = false;
                var invNo = data[0].InvoiceNo;
                $scope.InvoiceNoTemp = data[0].InvoiceNo;
                $scope.exportInvoice = data[0];
                dynamictable();
                getAllExporter();
                $scope.ddlExporter = { ExporterId: 1 };
                GetExporterBankAccount(data[0].MasterContactNo);
                $scope.GetInvoiceAndFactoryList();

                $scope.ddlExporterBank = { "BankAccountId": data[0].ExporterBankId };
                $scope.ddlImporter = { "CompanyId": data[0].CompanyId };
                $scope.ddlInvoiceType = { "InvoiceType": data[0].InvoiceType };
                $scope.ddlFactory = { "ExporterId": data[0].ExporterId };
                $scope.ddlEmail = { "EmployeeId": data[0].DocRefId };
                $scope.isLoadItemCategory = true;
                $scope.exportInvoice.InvoiceNo = invNo;
                $('.summernoteRv').summernote('code', data[0].TermsAndCondition);
                

                
                if (data.InvoiceDate != undefined) {
                    var res1 = data[0].InvoiceDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(data[0].InvoiceDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                        data[0].InvoiceDate = date1;
                    }
                }

                if (data.PODate != undefined) {
                    var res2 = data[0].PODate.substring(0, 5);
                    if (res2 == "/Date") {
                        var parsedDate2 = new Date(parseInt(data[0].PODate.substr(6)));
                        var date2 = ($filter("date")(parsedDate2, "MMM dd, yyyy")).toString();
                        data[0].PODate = date2;
                    }
                }
                GetEmployeeEmailByDocumentRef();
                GetSalesOrderListByCompanyForUpdate(data[0]);
                $scope.ItemTableDataRow = [];
                getItemDetailModifiedDataForUpdate(data[0].InvoiceId);
                $http({
                    url: '/ExpInvoice/InvoiceDetailGetByInvoiceId?invoiceId=' + data[0].InvoiceId,
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (aData) {
                    if (aData > 1) {
                        angular.forEach(aData, function (theData) {
                            $scope.invoiceDetailList.push(theData);
                        });
                    } else {
                        $scope.totalAmount = 0;
                        $scope.ItemCategory = [];
                    }
                   

                });

                $http({
                    url: '/ExpInvoice/PackingInfoGetByInvoiceId?invoiceId=' + data[0].InvoiceId,
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (packInfo) {
                    if (packInfo.length) {
                        $scope.packingInfo = packInfo[0];
                    }
                });
                $http({
                    url: '/ExpInvoice/GetPOReference?DocType=PI' + "&DocumentId=" + data[0].InvoiceId,
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    if (data.length) {


                        $scope.POReferencelist = [];
                        angular.forEach(data, function (aPODetail) {
                            var res2 = aPODetail.PODate.substring(0, 5);
                            if (res2 == "/Date") {
                                var parsedDate1 = new Date(parseInt(aPODetail.PODate.substr(6)));
                                var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                                aPODetail.PODate = date1;
                            }

                            $scope.POReferencelist.push(aPODetail);
                        })
                        if ($scope.POReferencelist.length) {
                            $scope.exportInvoice.isPO = true;
                        }
                    }

                });
                $window.scrollTo(0, 0);
            }
            else {
                alertify.log(' Password is not matched!', 'already', '5000');
                $('#txtOTP').val('');
            }
            $scope.ReviseProformaInvoiceForm.$setUntouched();
        });


    };


    $scope.GetExporterBankAccount = function () {
        GetExporterBankAccount();
    }
    function GetExporterBankAccount(MasterContactNo) {
        var searchCriteria = "";
        searchCriteria = "AccountFor = 'Exporter'";
        if ($scope.ddlFactory.ExporterId != undefined) {
            searchCriteria = "AccountFor = 'Exporter' and AccountRefId=" + $scope.ddlFactory.ExporterId;
        }
        if (MasterContactNo != undefined) {
            searchCriteria = "AccountFor = 'Exporter' and AccountRefId=" + parseInt(MasterContactNo);
        }

        $http({
            url: "/BankAccount/GetBankAccountByTypeAndRefId?searchCriteria=" + searchCriteria,
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.ExporterBankList = data;
        });
    };


    $scope.GetSalesOrderByCompany = function () {
        $scope.invoiceDetailList = [];
        $scope.ItemTableDataRow = [];
        $scope.ItemTableFooter[$scope.ItemTableFooter.length - 1] = 0;
        $scope.ItemTableFooter[$scope.ItemTableFooter.length - 3] = 0;
        $scope.QtySumForItem = 0;
        $scope.AmountSumForItem = 0;
        $scope.ItemCategory = [];
        var company = Enumerable.From($scope.companyList).Where("$.CompanyId === " + $scope.ddlImporter.CompanyId)
            .FirstOrDefault();

        if (!angular.isUndefined(company) && company !== null) {
            $scope.exportInvoice.CompanyNameBilling = company.CompanyNameBilling;
            $scope.exportInvoice.AddressBilling = company.AddressBilling;
            $scope.exportInvoice.CompanyNameDelivery = company.CompanyNameDelivery;
            $scope.exportInvoice.AddressDelivery = company.AddressDelivery;
            $scope.exportInvoice.RefEmployeeId = company.RefEmployeeId;
        }

        $http({
            url: "/SalesOrder/GetSalesOrderForPI?companyId=" + $scope.ddlImporter.CompanyId,
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            if (data) {
                $scope.SalesOrderList = [];
                angular.forEach(data,
                    function (e) {
                        if (e.SalesOrderType != "Local") {
                            e.IsCheck = false;
                            //Date Format
                            var parsedDate1 = new Date(parseInt(e.SalesOrderDate.substr(6)));
                            var date1 = ($filter("date")(parsedDate1, "dd/MM/yyyy")).toString();
                            e.SalesOrderDate = date1;
                            $scope.SalesOrderList.push(e);
                        }
                    });
            }
        });
        if (angular.isDefined($scope.ddlInvoiceType)) {
            delete $scope.ddlInvoiceType;
        }
        if (angular.isDefined($scope.ddlEmail)) {
            delete $scope.ddlEmail;
        }
    };
    $scope.GetInvoiceNo = function () {
        if ($scope.exportInvoice.InvoiceDate != "") {
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

            var datePart = $scope.exportInvoice.InvoiceDate.split(",");
            var year = datePart[1].replace(" ", "");
            var dateAndMonth = datePart[0].split(" ");
            var date = dateAndMonth[1];
            var month = Number(months.indexOf(dateAndMonth[0])) + 1;

            var yearTwoDigit = Number(year.slice(-2));
            var finYear = month < 3
                ? ((yearTwoDigit - 1) + "-" + yearTwoDigit)
                : (yearTwoDigit + "-" + (yearTwoDigit + 1));

            var monthString = month < 10 ? ("0" + month) : ("" + month);
            var from = year + "-" + monthString + "-" + date;

            $http({
                url: "/ExpInvoice/GetInvoiceNo?InvoiceDate=" + from + "&ExporterId=" + $scope.ddlFactory.ExporterId,
                method: "GET",
                headers: { 'Content-Type': "application/json" }
            }).success(function (data) {
                $scope.Number = data;
                if ($scope.InvoiceNoTemp == "") {
                    if ($scope.exportInvoice.PaymentProcessTypeId == 2 || $scope.exportInvoice.PaymentProcessTypeId == 3) {
                        $scope.exportInvoice.InvoiceNo = $scope.ddlFactory.ExporterId == 1
                            ? ("RTLE/" + finYear + "/SC-" + $scope.Number)
                            : ("RTL/" + finYear + "/SC-" + $scope.Number);
                    }
                    else {
                        $scope.exportInvoice.InvoiceNo = $scope.ddlFactory.ExporterId == 1
                            ? ("RTLE/" + finYear + "/PI-" + $scope.Number)
                            : ("RTL/" + finYear + "/PI-" + $scope.Number);
                    }
                } else {
                    var arr = [];
                    arr = $scope.InvoiceNoTemp.split('-');
                    if ($scope.exportInvoice.PaymentProcessTypeId == 2 || $scope.exportInvoice.PaymentProcessTypeId == 3) {
                        $scope.exportInvoice.InvoiceNo = $scope.ddlFactory.ExporterId === 1
                            ? ("RTLE/" + finYear + "/SC-" + arr[2])
                            : ("RTL/" + finYear + "/SC-" + arr[2]);
                    }
                    else {
                        $scope.exportInvoice.InvoiceNo = $scope.ddlFactory.ExporterId === 1
                            ? ("RTLE/" + finYear + "/PI-" + arr[2])
                            : ("RTL/" + finYear + "/PI-" + arr[2]);
                    }
                }
            });


        }
        if ($scope.ddlFactory.ExporterId === 1) {
            $scope.ddlExporterBank = { BankAccountId: 2 };
            $scope.exportInvoice.ExporterBankId = 2;
        }
        else {
            $scope.ddlExporterBank = { BankAccountId: 1 };
            $scope.exportInvoice.ExporterBankId = 1;
        }
    };


    $scope.SalesOrderCheck = function (row) {
        $(".summernote").summernote("reset");
        $(".summernote").summernote("code", $scope.TermsAndConditionList);
        $scope.insertItemCount = undefined;
        dynamictable();
        if (row.IsChecked) {
            $("#mofiz thead tr th:nth-child(-n+2)").each(function () {
                $(this).attr("contenteditable", "false");
            });

            if ($scope.ItemCategory.length) {
                for (var i = 0; i < $scope.ItemCategory.length; i++) {
                    $scope.ItemCategory[i].IsChecked = false;
                };
                $scope.invoiceDetailList = angular.copy($scope.invoiceDetailSplittedList);
            }
            $http({
                url: "/ExpInvoice/InvoiceDetailGetBySalesOrderId?salesOrerId=" + row.SalesOrderId,
                method: "GET",
                headers: { 'Content-Type': "application/json" }
            }).success(function (data) {
                angular.forEach(data,
                    function (adata) {
                        adata.PreAmountOfLcCoppyItem = adata.UnitPrice;
                        $scope.invoiceDetailList.push(adata);
                        QuantityAndAmountSum();
                        adata.IsOverride = false;

                        if (adata.SubCategoryId === 1) {
                            //adata.ItemName = adata.DescriptionOne;
                            adata.DescriptionOne = adata.DescriptionOne +
                                //"\n" +
                                //adata.DescriptionTwo +
                                "\n" +
                                "(" +
                                adata.UnitPerPackage +
                                " " +
                                "Pcs" +
                                "/" +
                                "Rolls" +
                                ")";
                        } else {
                            adata.DescriptionOne = adata.DescriptionOne + "\n" + adata.DescriptionTwo;
                        }
                        adata.DescriptionTwo = "";
                        $scope.invoiceDetailSplittedList = angular.copy($scope.invoiceDetailList);
                    });
                itemLoadDynamicTable($scope.invoiceDetailList);

                GetSubCategoryByItemIds();
            });
            
            $http({
                url: '/ExpInvoice/GetPOReference?DocType=SO' + "&DocumentId=" + row.SalesOrderId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                if (data.length) {
                    
                    angular.forEach(data, function (aPODetail) {
                        aPODetail.DocType = 'PI';
                        var res2 = aPODetail.PODate.substring(0, 5);
                        if (res2 == "/Date") {
                            var parsedDate1 = new Date(parseInt(aPODetail.PODate.substr(6)));
                            var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                            aPODetail.PODate = date1;
                        }

                        var POCheckList = $scope.POReferencelist.filter(aPO => aPO.PONo === aPODetail.PONo);
                        if (POCheckList.length > 0) {

                        } else {
                            $scope.POReferencelist.push(aPODetail);
                            //$scope.POReferencelistTemp.push(aPODetail);

                            //$scope.POReferencelist = angular.copy($scope.POReferencelistTemp);
                        }
                    });

                }

            });
        
        } else {
            /////////////////////////////////////////////////
            var dtlList = Enumerable.From($scope.POReferencelist).Where("$.DocumentId === " + row.SalesOrderId)
                .ToArray();

            angular.forEach(dtlList,
                function (aDetail) {
                    var detail = Enumerable.From($scope.POReferencelist)
                        .Where("$.DocumentId === " + aDetail.DocumentId).FirstOrDefault();
                    var index = $scope.POReferencelist.indexOf(detail);
                    $scope.POReferencelist.splice(index, 1);
                    $scope.POReferencelistTemp = angular.copy($scope.POReferencelist);
                });
            
            ////////////////////////////////////

            var dtlList = Enumerable.From($scope.invoiceDetailList).Where("$.SalesOrderId === " + row.SalesOrderId)
                .ToArray();

            $scope.TempQty = 0;
            angular.forEach(dtlList,
                function (aDetail) {
                    $scope.TempQty += aDetail.Quantity;
                    var detail = Enumerable.From($scope.invoiceDetailList)
                        .Where("$.SalesOrderId === " + aDetail.SalesOrderId).FirstOrDefault();
                    var index = $scope.invoiceDetailList.indexOf(detail);
                    $scope.invoiceDetailList.splice(index, 1);
                    $scope.ItemTableDataRow.splice(index, 1);
                    $scope.invoiceDetailSplittedList = angular.copy($scope.invoiceDetailList);
                });
            $scope.AmountSumForItem -= row.Amount.toFixed(2);
            $scope.QtySumForItem -= $scope.TempQty.toFixed(2);
            $scope.ItemTableFooter = ["", "", "", "", "", $scope.QtySumForItem.toFixed(2), "", $scope.AmountSumForItem.toFixed(2)];
            var dtlListForExtraItem = Enumerable.From($scope.invoiceDetailList).Where("$.SalesOrderId !==" + 0)
                .ToArray();
            if (dtlListForExtraItem.length == 0) {
                $scope.invoiceDetailList = [];
                $scope.ItemTableDataRow = [];
                //$scope.POReference = {};
                //$scope.POReferencelist = [];
                //$scope.POReferencelistTemp = [];
            }
            rearrangeSerial();
            QuantityAndAmountSum();
            GetSubCategoryByItemIds();
        }

        var amount = 0.00;
        $scope.exportInvoice.SalesOrderIds = "";

        angular.forEach($scope.SalesOrderList,
            function (salesOrder) {
                if (salesOrder.IsChecked) {
                    amount += salesOrder.Amount;
                    $scope.exportInvoice.SalesOrderIds += $scope.exportInvoice.SalesOrderIds === ""
                        ? salesOrder.SalesOrderId
                        : ("," + salesOrder.SalesOrderId);
                }
            });

        $scope.totalAmount = amount.toFixed(2);
    };
    //$scope.SalesOrderCheck = function (row) {
    //    SalesOrderCheck(row);
    //};

    $scope.overRide = function (anItem, isOverride) {
        anItem.IsOverride = isOverride;

    }
    $scope.hideButton = function () {
        if ($scope.isInvoiceNo == true) {
            $scope.isInvoiceNo = false;
        }
        else {
            $scope.isInvoiceNo = true;
        }

    }
    $scope.mergeInvoiceDetailsByItemname = function (subcategoryRow) {
        if (subcategoryRow.IsChecked) {
            if ($scope.invoiceDetailList.length) {
                var SubItemWiseItemList = angular.copy($scope.invoiceDetailList);
                $scope.TempArray = [];
                $scope.invoiceDetailList = [];

                for (var i = 0; i < $scope.SalesOrderList.length; i++) {
                    if (($scope.SalesOrderList[i].IsChecked) == true) {
                        $scope.SalesOrderList[i].disabled = true;
                    };
                };
                angular.forEach(SubItemWiseItemList, function (aItem) {
                    if (!aItem.IsMerge) {
                        aItem.IsMerge = false;
                    }
                    if (subcategoryRow.SubCategoryId === aItem.SubCategoryId && SubItemWiseItemList.filter(e => e.ItemId === aItem.ItemId).length > 1) {
                        aItem.IsMerge = true;
                        var isExist = Enumerable.From($scope.TempArray).Where('$.ItemId==' + aItem.ItemId).FirstOrDefault();
                        if (isExist) {
                            aItem.Quantity += isExist.Quantity;
                            aItem.Amount += isExist.Amount;
                            var indexDelete = $scope.TempArray.indexOf(isExist);
                            $scope.TempArray.splice(indexDelete, 1);
                        }
                        $scope.TempArray.push(aItem);
                    }
                    else {
                        $scope.invoiceDetailList.push(aItem);
                        QuantityAndAmountSum();
                    }
                });
                angular.forEach($scope.TempArray,
                    function (dataObj) {
                        $scope.invoiceDetailList.push(dataObj);
                        QuantityAndAmountSum();
                    });
            }

        }
        else {
            if ($scope.invoiceDetailList.length) {
                var SubItemWiseItemList = angular.copy($scope.invoiceDetailList);
                $scope.decreaseIndex = 0;
                angular.forEach(SubItemWiseItemList, function (aItem) {
                    if (aItem.SubCategoryId == subcategoryRow.SubCategoryId && aItem.IsMerge == true) {
                        var indexDelete = SubItemWiseItemList.indexOf(aItem);

                        $scope.decreaseIndex == 0 ? $scope.invoiceDetailList.splice(indexDelete, 1) : $scope.invoiceDetailList.splice((indexDelete - $scope.decreaseIndex), 1);
                        $scope.decreaseIndex++;

                    }
                });
                var SubItemWiseItemList = angular.copy($scope.invoiceDetailSplittedList);
                angular.forEach($scope.invoiceDetailSplittedList, function (aItem) {
                    if (aItem.SubCategoryId === subcategoryRow.SubCategoryId && SubItemWiseItemList.filter(e => e.ItemId === aItem.ItemId).length > 1) {
                        $scope.invoiceDetailList.push(aItem);
                        QuantityAndAmountSum();
                    }
                });

                var isExist = Enumerable.From($scope.ItemCategory).Where('$.IsChecked==true').FirstOrDefault();
                if (!isExist) {
                    for (var i = 0; i < $scope.SalesOrderList.length; i++) {
                        if (($scope.SalesOrderList[i].IsChecked) == true) {
                            $scope.SalesOrderList[i].disabled = false;
                        };
                    };
                }
            }

        }
    }

    $scope.getItemInfo = function () {
        $scope.isInfoShow = !$scope.isInfoShow;
    };

    $scope.GenerateDynamic = function () {
        $scope.ItemTableData = [[]];

        for (var i = 0; i < 10; i++) {
            $scope.headers.push("Col " + (i + 1));
            var rowData = [];

            for (var j = 0; j < 10; j++) {
                rowData.push("Row-" + (i + 1) + " - Col " + (j + 1));
            }
            data.push(rowData);
        }
    };

    $scope.removeItem = function (index, salesOrderId) {
        var salesOrderItemList = Enumerable.From($scope.invoiceDetailList).Where("$.SalesOrderId !== 0").ToArray();
        if (salesOrderItemList.length > 1) {
            $scope.invoiceDetailList.splice(index, 1);
            QuantityAndAmountSum();

        }
        else if (salesOrderId == undefined || salesOrderId == 0) {
            $scope.invoiceDetailList.splice(index, 1);
            QuantityAndAmountSum();

        }
        else {
            alertify.log('Shouldn\'t remove Last Item!!!', 'error', '5000');
        }

    };

    $scope.changeAmountForLcCoppyItemQuantity = function (adata) {
        if (adata.Quantity != undefined && adata.UnitPrice != undefined) {
            adata.Amount = adata.Quantity * adata.UnitPrice;
            QuantityAndAmountSum();
        }

    };
   
    

    $scope.GetItemValueForAmountCalculation = function (itemName, row, index) {
        //$scope.AmountSumForItem = 0;
        $("#mofiz tbody tr td input").focus(function () {
            $(this).addClass('red');
        }).blur(function () {
            $(this).removeClass('red');
        });

        var itemType = typeof (itemName);
        var item;
        var isConverted = 0;
        var hasDot;
        var num = Number(itemName);
        if ((num % 1) == 0.00) {
            if (row.length - 3 == index && itemType == 'string') {
                row[index] = parseInt(itemName);
            }
            else {
                if (itemType == 'string') {
                    row[index] = parseFloat(itemName);
                }
                else {
                    row[index] = parseFloat(itemName);
                }

                if (row.length - 2 == index) {
                    row[row.length - 2] = (row[row.length - 2]).toFixed(2);
                }
                else {
                    row[row.length - 1] = (row[row.length - 1]).toFixed(2);
                    //$scope.Amount = parseFloat(row[row.length - 1]);
                    //$scope.AmountSumForItem += $scope.Amount;

                }
                if (row.length - 1 == index) {
                    $scope.Amount = parseFloat(row[row.length - 1]);
                    $scope.AmountSumForItem += $scope.Amount;
                }
            }
        } else {
            if (row.length - 1 == index) {
                $scope.Amount = parseFloat(row[row.length - 1]);
                $scope.AmountSumForItem += $scope.Amount;
            }
        }


        if (itemType != 'number') {
            hasDot = itemName.indexOf(".");
            var itemNameForDotRemove = itemName;
            if (hasDot != -1) {
                var divArray = itemNameForDotRemove.split(".");
                if (divArray.length > 2) {
                    $scope.isInvalidData = 1;
                    $scope.ItemTableDataRow = [];
                    $scope.DataRow = [];
                    alertify.log('Please insert valid data after reset', 'error', '5000');
                    return;
                }
            }
        }

        if (hasDot != -1) {
            if (itemType != 'number') {
                //var patt = /[^(\d+)\.(\d+)]/g;
                //var itemNameFiltered = itemName.replace(patt, "");
                item = parseFloat(itemName);
            }
            else {
                item = itemName;
            }
            isConverted = 1;
        }
        if (isConverted == 0) {
            if (itemType != 'number') {
                //var itemNameFiltered = itemName.toString().replace(/\D/g, "");
                item = parseFloat(itemName);
            }
            else {
                item = itemName;
            }
        }
        if ($scope.insertItemCount == undefined) {
            if (index >= row.length - 3) {
                if ($scope.distCount == 1) {
                    $scope.Qty = item;
                    $scope.QtySumForItem += item;
                    $scope.distCount++;
                } else if ($scope.distCount == 2) {
                    $scope.UnitPrice = item;
                    $scope.UnitpriceSumForItem += item;
                    $scope.distCount++;
                } else if ($scope.distCount == 3) {
                    //$scope.Amount = $scope.Qty * $scope.UnitPrice;
                    //$scope.AmountSumForItem += $scope.Amount;
                    //if (row.length - 1 == index) {
                    //    $scope.Amount = parseFloat(row[row.length - 1]);
                    //    $scope.AmountSumForItem += $scope.Amount;
                    //}
                    $scope.distCount++;
                }

            }
            if ($scope.distCount == 4) {
                var integerPartQty = parseInt($scope.QtySumForItem);
                var decimalPartQty = $scope.QtySumForItem - integerPartQty;

                if (decimalPartQty == 0) {
                    $scope.ItemTableFooter[$scope.ItemTableFooter.length - 3] = $scope.QtySumForItem;
                }
                else {
                    $scope.ItemTableFooter[$scope.ItemTableFooter.length - 3] = parseFloat($scope.QtySumForItem).toFixed(2);
                }
                $scope.ItemTableFooter[$scope.ItemTableFooter.length - 1] = parseFloat($scope.AmountSumForItem).toFixed(2);
                $scope.distCount = 1;
            }
        }
    };

    $scope.GetChengedFieldValue = function (itemName, row, index) {
        if (itemName == '') {
            alertify.log("Please enter valid Number!!!", "error", "5000");
            return;
        }
        if (itemName == '.') {
            alertify.log("Can't input just dot !!!", "error", "5000");
            return;
        }
        var qtyTemp = row[row.length - 3];
        var unitPriceTemp = row[row.length - 2];

        var item;
        item = parseFloat(itemName);

        if (isNaN(item)) {

            alertify.log("Can't Enter Any Alphabet and Special Character Before Number !!!", "error", "5000");
            return;
        }
        else {
            if (row.length - 1 != index) {
                $scope.QtySumForItem -= parseFloat(row[row.length - 3]);
                $scope.AmountSumForItem -= parseFloat(row[row.length - 1]);
                if (index >= (row.length - 3)) {
                    row[index] = item;
                }
                else {
                    row[index] = item;
                }
                var qtyConvert = parseFloat(row[row.length - 3]);
                var amountConvert = parseFloat(row[row.length - 2]);
                row[row.length - 1] = (qtyConvert * amountConvert).toFixed(2);
                $scope.AmountSumForItem += parseFloat(row[row.length - 1]);
                $scope.QtySumForItem += parseFloat(row[row.length - 3]);
            }
            else {
                $scope.AmountSumForItem -= row[row.length - 1];
                row[index] = item;
                $scope.AmountSumForItem += item;
            }

            var integerPartQty = parseInt($scope.QtySumForItem);
            var decimalPartQty = $scope.QtySumForItem - integerPartQty;

            if (decimalPartQty == 0) {
                $scope.ItemTableFooter[$scope.ItemTableFooter.length - 3] = $scope.QtySumForItem;
            }
            else {
                $scope.ItemTableFooter[$scope.ItemTableFooter.length - 3] = parseFloat($scope.QtySumForItem).toFixed(2);
            }
            $scope.ItemTableFooter[$scope.ItemTableFooter.length - 1] = parseFloat($scope.AmountSumForItem).toFixed(2);

            angular.forEach($scope.invoiceDetailList, function (invoiceDetail) {
                if (invoiceDetail.ItemId == row[1] && invoiceDetail.Quantity == qtyTemp && invoiceDetail.UnitPrice == unitPriceTemp) {
                    var objectIndex = $scope.invoiceDetailList.indexOf(invoiceDetail);
                    if (objectIndex != -1 && objectIndex + 1 == row[2]) {
                        invoiceDetail.ItemName = row[3];
                        invoiceDetail.DescriptionOne = row[4];
                        invoiceDetail.Quantity = row[row.length - 3];
                        invoiceDetail.UnitPrice = row[row.length - 2];
                        invoiceDetail.Amount = row[row.length - 1];
                    }

                }
            });
            row[index] = item;
        }
    }
    $scope.changeAmountForLcCoppyItemAmount = function (adata) {
        QuantityAndAmountSum();
    }
   
    //Search Start
    $scope.searchProformaInvoice = function () {
        var fromDate = $("#txtInvoiceFromDate").val();
        var toDate = $("#txtInvoiceToDate").val();
        $scope.FromDate = fromDate;
        $scope.ToDate = toDate;

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var dateSplit = $scope.FromDate.split(' ');
        var date = dateSplit[1].replace(',', '');
        var year = dateSplit[2];

        var month;
        for (var j = 0; j < months.length; j++) {
            if (dateSplit[0] == months[j]) {
                month = months.indexOf(months[j]) + 1;
            }
        }
        var fromDate = year + "/" + month + "/" + date;

        dateSplit = $scope.ToDate.split(' ');
        date = dateSplit[1].replace(',', '');
        year = dateSplit[2];
        for (var j = 0; j < months.length; j++) {
            if (dateSplit[0] == months[j]) {
                month = months.indexOf(months[j]) + 1;
            }
        }
        var toDate = year + "/" + month + "/" + date;

        if ($scope.ddlInvoiceCompany !== undefined && $scope.ddlInvoiceCompany != null) {
            companyId = $scope.ddlInvoiceCompany.CompanyId;
        }
        else {
            companyId = null;
        }

        $http({
            url: '/ExpInvoice/ExpInvoiceGetForEdit?fromDate=' + fromDate + '&toDate=' + toDate + '&companyId=' + companyId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length < 0) {
                alertify.log('No Invoice Found', 'error', '5000');
            }
            $scope.invoiceList = data;
        });
    };
    //Search End

    $scope.post = function () {
        savePI(true, 'Amendment');
    };

    $scope.lockAndSubmit = function () {
        savePI(true, 'Lock & Submit');
    };

    $scope.resetForm = function () {
        $(".summernoteRv").summernote("reset");
        clear();
        $scope.ReviseProformaInvoiceForm.$setPristine();
        $scope.ReviseProformaInvoiceForm.$setUntouched();
    };

    $scope.stopPropagation = function () {
        $("#AmendmentModal").modal('show');
        event.stopPropagation();
    };

    $scope.postAmendmentRequest = function () {
        $scope.amendment.ApprovalType = "PiAmendment";

        alertify.confirm("Are you sure to Amendment Request?",
            function (e) {
                if (e) {
                    var params = JSON.stringify({ expApproval: $scope.amendment });
                    $http.post('/ExpApproval/Save', params).success(function (data) {
                        if (data > 0) {
                            alertify.log('Amendment Request Saved Successfully!', 'success', '5000');
                            clear();
                            $scope.exportInvoiceForm.$setPristine();
                            $scope.exportInvoiceForm.$setUntouched();
                        }
                    }).error(function (msg) {
                        alertify.log('Save failed, refresh page and try again', 'error', '5000');
                    });
                }
            });

    };

    function GetAllSPCase() {

        $http({
            url: "/Item/GetAllSPCase",
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.SPItemList = data;
        });
    }
    Array.prototype.unique = function () {
        var a = this.concat();
        for (var i = 0; i < a.length; ++i) {
            for (var j = i + 1; j < a.length; ++j) {
                if (a[i] === a[j])
                    a.splice(j--, 1);
            }
        }

        return a;
    };
    $scope.getPackingInfo = function () {
        $scope.packingInfoCombind = {};
        $scope.packingInfoCombind.TotalCarton = 0;
        $scope.packingInfoCombind.LabelNetWeight = 0;
        $scope.packingInfoCombind.LabelGrossWeight = 0;
        $scope.packingInfoCombind.RibonNetWeight = 0;
        $scope.packingInfoCombind.RibonGrossWeight = 0;
        $scope.packingInfoCombind.CartonMeasurement = "";
        $scope.packingInfoCombind.RibonNetWeight = 0;

        $scope.productListForRibbon = [];
        $scope.productListForLabel = [];

        $scope.packingInfo = {};
        $scope.packingInfo.TotalCarton = 0;
        $scope.packingInfo.LabelNetWeight = 0;
        $scope.packingInfo.LabelGrossWeight = 0;
        $scope.packingInfo.RibonNetWeight = 0;
        $scope.packingInfo.RibonGrossWeight = 0;
        $scope.packingInfo.CartonMeasurement = "";
        $scope.packingInfo.RibonNetWeight = 0;
        if (!$scope.invoiceDetailList.length) {
            alertify.log("No item in item list", "error", "5000");
            return;
        }
        $scope.invoiceDetailListWithFlag = [];
        angular.forEach($scope.invoiceDetailList,
            function (adata) {
                if (adata.IdenticalFlag != 0) {
                    $scope.itemFlag = true;
                    $scope.invoiceDetailListWithFlag.push(adata);
                }
            });

        ///////////////////////////////
        var listToDelete = [];
        for (var i = 0; i < $scope.invoiceDetailListWithFlag.length; i++) {
            listToDelete.push($scope.invoiceDetailListWithFlag[i].ItemId);
        }
        $scope.invoiceDetailListWithoutFlag = $scope.invoiceDetailList.filter(el => (listToDelete.indexOf(el.ItemId) == -1));
        /////////////////////////////


        $scope.margeProduct = [];
        $scope.margeProductWithFlag = [];
        $scope.margeProductWithoutFlag = [];
        /////////////////////////////////////
        if ($scope.itemFlag == true) {
            $scope.margeProductWithFlag = $scope.invoiceDetailListWithFlag.reduce((r, { Amount, ContainerId, ContainerSize, ContainerWeight, DescriptionOne, DescriptionTwo, HsCode, InvoiceDetailId, InvoiceId, ItemId, IdenticalFlag, ItemName, OrderUnitId, PackageId, PackagePerContainer, PackageWeight, Quantity, SalesOrderId, SubCategoryId, SubCategoryName, UnitId, UnitPerPackage, UnitPrice }) => {
                var temp = r.find(o => o.IdenticalFlag === IdenticalFlag);
                if (!temp) {
                    r.push({ Amount, ContainerId, ContainerSize, ContainerWeight, DescriptionOne, DescriptionTwo, HsCode, InvoiceDetailId, InvoiceId, ItemId, IdenticalFlag, ItemName, OrderUnitId, PackageId, PackagePerContainer, PackageWeight, Quantity, SalesOrderId, SubCategoryId, SubCategoryName, UnitId, UnitPerPackage, UnitPrice });
                } else {
                    temp.Quantity += Quantity;
                }
                return r;
            }, []);

            $scope.margeProductWithoutFlag = $scope.invoiceDetailListWithoutFlag.reduce((r, { Amount, ContainerId, ContainerSize, ContainerWeight, DescriptionOne, DescriptionTwo, HsCode, InvoiceDetailId, InvoiceId, ItemId, IdenticalFlag, ItemName, OrderUnitId, PackageId, PackagePerContainer, PackageWeight, Quantity, SalesOrderId, SubCategoryId, SubCategoryName, UnitId, UnitPerPackage, UnitPrice }) => {
                var temp = r.find(o => o.ItemId === ItemId);
                if (!temp) {
                    r.push({ Amount, ContainerId, ContainerSize, ContainerWeight, DescriptionOne, DescriptionTwo, HsCode, InvoiceDetailId, InvoiceId, ItemId, IdenticalFlag, ItemName, OrderUnitId, PackageId, PackagePerContainer, PackageWeight, Quantity, SalesOrderId, SubCategoryId, SubCategoryName, UnitId, UnitPerPackage, UnitPrice });
                } else {
                    temp.Quantity += Quantity;
                }
                return r;
            }, []);
            $scope.margeProduct = $scope.margeProductWithFlag;
            for (var i = 0; i < $scope.margeProductWithoutFlag.length; i++) {
                $scope.margeProduct.push($scope.margeProductWithoutFlag[i]);
            }


        } else {
            $scope.margeProduct = $scope.invoiceDetailList.reduce((r, { Amount, ContainerId, ContainerSize, ContainerWeight, DescriptionOne, DescriptionTwo, HsCode, InvoiceDetailId, InvoiceId, ItemId, ItemName, OrderUnitId, PackageId, PackagePerContainer, PackageWeight, Quantity, SalesOrderId, SubCategoryId, SubCategoryName, UnitId, UnitPerPackage, UnitPrice }) => {
                var temp = r.find(o => o.ItemId === ItemId);
                if (!temp) {
                    r.push({ Amount, ContainerId, ContainerSize, ContainerWeight, DescriptionOne, DescriptionTwo, HsCode, InvoiceDetailId, InvoiceId, ItemId, ItemName, OrderUnitId, PackageId, PackagePerContainer, PackageWeight, Quantity, SalesOrderId, SubCategoryId, SubCategoryName, UnitId, UnitPerPackage, UnitPrice });
                } else {
                    temp.Quantity += Quantity;
                }
                return r;
            }, []);
        }

        ////////////////////////////////
        /////////////////// separated Combind Item
        angular.forEach($scope.SPItemList,
            function (adata) {
                var tempSPRibbon = $scope.margeProduct.filter(product => product.ItemId === adata.RibbonId);
                $scope.productListForRibbon = $scope.productListForRibbon.concat(tempSPRibbon).unique();
                var tempSPLabel = $scope.margeProduct.filter(product => product.ItemId === adata.LabelId);
                $scope.productListForLabel = $scope.productListForLabel.concat(tempSPLabel).unique();

                tempSPRibbon = [];
                tempSPLabel = [];
            })


        //////////////////Label + Ribbon = OneList
        $scope.CombindItem = $scope.productListForLabel;

        for (var i = 0; i < $scope.productListForRibbon.length; i++) {
            $scope.CombindItem.push($scope.productListForRibbon[i]);
        }
        /////////////////////////////////////// Calculetion Combind
        angular.forEach($scope.CombindItem,
            function (adata) {
                var objCombind = {};
                objCombind.itemW8 = 0;
                objCombind.noOfCrtn = 0;
                objCombind.crtnW8 = 0;
                var noOfCrtn1 = 0;
                $scope.ExtraQtyForRibbon = 0;
                //////////////////////////// Calculetion Combind Ribbon New way
                if (adata.SubCategoryName == 'Barcode Ribbon' || adata.SubCategoryName == 'Barcode Ribbon (R)') {
                    if (adata.Quantity > $scope.packingInfoCombind.TotalCarton) {
                        $scope.ExtraQtyForRibbon = Number(adata.Quantity) - Number($scope.packingInfoCombind.TotalCarton);
                    }

                    if (adata.PackagePerContainer != 0) {
                        noOfCrtn1 = $scope.ExtraQtyForRibbon / adata.PackagePerContainer;
                        objCombind.noOfCrtn = Math.ceil(noOfCrtn1);
                    } else {
                        if (adata.UnitPerPackage != 0) {
                            noOfCrtn1 = $scope.ExtraQtyForRibbon / adata.UnitPerPackage;
                            objCombind.noOfCrtn = Math.ceil(noOfCrtn1);
                        } else {
                            objCombind.noOfCrtn = 0;
                        }
                    }
                    $scope.packingInfoCombind.TotalCarton = Number($scope.packingInfoCombind.TotalCarton) + Number(objCombind.noOfCrtn);

                    objCombind.SalesOrderId = adata.SalesOrderId;
                    objCombind.Qty = adata.Quantity;
                    objCombind.SubCategoryName = adata.SubCategoryName;
                    objCombind.itemW8 = adata.Quantity * adata.PackageWeight;
                    objCombind.crtnW8 = objCombind.noOfCrtn * adata.ContainerWeight;
                    objCombind.Measurement = adata.ContainerSize;

                    var itmW8 = objCombind.itemW8;
                    $scope.packingInfoCombind.RibonNetWeight =
                        (Number($scope.packingInfoCombind.RibonNetWeight) + Number(itmW8)).toFixed(2);
                    var RibbonGrsWeight = objCombind.itemW8 + objCombind.crtnW8;
                    $scope.packingInfoCombind.RibonGrossWeight =
                        (Number($scope.packingInfoCombind.RibonGrossWeight) + Number(RibbonGrsWeight)).toFixed(2);


                    $scope.packingInfoCombind.CartonMeasurement += $scope.packingInfoCombind.CartonMeasurement === ""
                        ? objCombind.Measurement
                        : ("," + objCombind.Measurement);

                }
                else {
                    /////////////////////////// Calculetion Combind Label previous way
                    if (adata.PackagePerContainer != 0) {
                        noOfCrtn1 = adata.Quantity / adata.PackagePerContainer;
                        objCombind.noOfCrtn = Math.ceil(noOfCrtn1);
                    } else {
                        if (adata.UnitPerPackage != 0) {
                            noOfCrtn1 = adata.Quantity / adata.UnitPerPackage;
                            objCombind.noOfCrtn = Math.ceil(noOfCrtn1);
                        } else {
                            objCombind.noOfCrtn = 0;
                        }
                    }
                    objCombind.SalesOrderId = adata.SalesOrderId;
                    objCombind.Qty = adata.Quantity;
                    objCombind.SubCategoryName = adata.SubCategoryName;
                    objCombind.itemW8 = adata.Quantity * adata.PackageWeight;
                    objCombind.crtnW8 = objCombind.noOfCrtn * adata.ContainerWeight;
                    objCombind.Measurement = adata.ContainerSize;

                    $scope.packingInfoCombind.TotalCarton = Number($scope.packingInfoCombind.TotalCarton) + Number(objCombind.noOfCrtn);

                    var lblitmW8 = objCombind.itemW8;
                    $scope.packingInfoCombind.LabelNetWeight =
                        (Number($scope.packingInfoCombind.LabelNetWeight) + Number(lblitmW8)).toFixed(2);
                    var LabelGrsWeight = objCombind.itemW8 + objCombind.crtnW8;
                    $scope.packingInfoCombind.LabelGrossWeight =
                        (Number($scope.packingInfoCombind.LabelGrossWeight) + Number(LabelGrsWeight)).toFixed(2);

                    $scope.packingInfoCombind.CartonMeasurement += $scope.packingInfoCombind.CartonMeasurement === ""
                        ? objCombind.Measurement
                        : ("," + objCombind.Measurement);
                }
            });
        ////////////////////////////////////// Remove Combind Item
        var listToDelete = [];
        for (var i = 0; i < $scope.CombindItem.length; i++) {
            listToDelete.push($scope.CombindItem[i].ItemId);
        }
        console.log(listToDelete);
        $scope.ExtraItem = $scope.margeProduct.filter(el => (listToDelete.indexOf(el.ItemId) == -1));
        console.log($scope.ExtraItem);

        //////////////////////////////////////Calculetion Extra previous way
        angular.forEach($scope.ExtraItem,
            function (adata) {
                var objExtra = {};
                objExtra.itemW8 = 0;
                objExtra.noOfCrtn = 0;
                objExtra.crtnW8 = 0;
                var noOfCrtn1 = 0;

                if (adata.PackagePerContainer != 0) {
                    noOfCrtn1 = adata.Quantity / adata.PackagePerContainer;
                    objExtra.noOfCrtn = Math.ceil(noOfCrtn1);
                } else {
                    if (adata.UnitPerPackage != 0) {
                        noOfCrtn1 = adata.Quantity / adata.UnitPerPackage;
                        objExtra.noOfCrtn = Math.ceil(noOfCrtn1);
                    } else {
                        objExtra.noOfCrtn = 0;
                    }
                }

                objExtra.SalesOrderId = adata.SalesOrderId;
                objExtra.Qty = adata.Quantity;
                objExtra.SubCategoryName = adata.SubCategoryName;
                objExtra.itemW8 = adata.Quantity * adata.PackageWeight;
                objExtra.crtnW8 = objExtra.noOfCrtn * adata.ContainerWeight;
                objExtra.Measurement = adata.ContainerSize;

                $scope.packingInfo.TotalCarton = Number($scope.packingInfo.TotalCarton) + Number(objExtra.noOfCrtn);

                var res = (objExtra.SubCategoryName).match(/Barcode Ribbon/);
                if (res) {
                    var itmW8 = objExtra.itemW8;
                    $scope.packingInfo.RibonNetWeight =
                        (Number($scope.packingInfo.RibonNetWeight) + Number(itmW8)).toFixed(2);
                    var RibbonGrsWeight = objExtra.itemW8 + objExtra.crtnW8;
                    $scope.packingInfo.RibonGrossWeight =
                        (Number($scope.packingInfo.RibonGrossWeight) + Number(RibbonGrsWeight)).toFixed(2);
                } else {
                    var lblitmW8 = objExtra.itemW8;
                    $scope.packingInfo.LabelNetWeight =
                        (Number($scope.packingInfo.LabelNetWeight) + Number(lblitmW8)).toFixed(2);
                    var LabelGrsWeight = objExtra.itemW8 + objExtra.crtnW8;
                    $scope.packingInfo.LabelGrossWeight =
                        (Number($scope.packingInfo.LabelGrossWeight) + Number(LabelGrsWeight)).toFixed(2);
                }

                $scope.packingInfo.CartonMeasurement += $scope.packingInfo.CartonMeasurement === ""
                    ? objExtra.Measurement
                    : ("," + objExtra.Measurement);
            });
        //////////////////////////////////////Combind + Extra Item
        $scope.packingInfo.TotalCarton = Number($scope.packingInfo.TotalCarton) + Number($scope.packingInfoCombind.TotalCarton);
        $scope.packingInfo.RibonNetWeight = Number($scope.packingInfo.RibonNetWeight) + Number($scope.packingInfoCombind.RibonNetWeight);
        $scope.packingInfo.RibonNetWeight = Number($scope.packingInfo.RibonNetWeight.toFixed(2));
        $scope.packingInfo.RibonGrossWeight = (Number($scope.packingInfo.RibonGrossWeight) + Number($scope.packingInfoCombind.RibonGrossWeight)).toFixed(2);
        $scope.packingInfo.LabelNetWeight = Number($scope.packingInfo.LabelNetWeight) + Number($scope.packingInfoCombind.LabelNetWeight);
        $scope.packingInfo.LabelNetWeight = Number($scope.packingInfo.LabelNetWeight.toFixed(2));
        $scope.packingInfo.LabelGrossWeight = (Number($scope.packingInfo.LabelGrossWeight) + Number($scope.packingInfoCombind.LabelGrossWeight)).toFixed(2);
        $scope.packingInfo.CartonMeasurement += $scope.packingInfoCombind.CartonMeasurement === ""
            ? $scope.packingInfoCombind.CartonMeasurement
            : ("," + $scope.packingInfoCombind.CartonMeasurement);
        var MeasurementArray = [];
        MeasurementArray = $scope.packingInfo.CartonMeasurement.split(',');
        MeasurementArray = Array.from(new Set(MeasurementArray));
        $scope.packingInfo.CartonMeasurement = MeasurementArray.join(',');
        $scope.packingInfo.CartonMeasurement = $scope.packingInfo.CartonMeasurement + " cm";
    };



    //Start popup
    function GetAllCategory() {
        $http({
            url: '/Category/GetAllCategory',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CategoryList = data;
        });
    }
    function GetAllItem() {
        $http({
            url: "/Item/GetAllItem",
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.ItemSearchList = data;
            angular.forEach($scope.ItemSearchList,
                function (aData) {
                    aData.TempItemName = aData.ItemName +
                        " ~ " +
                        aData.ItemDescription +
                        " ~ " +
                        aData.ItemDescriptionTwo +
                        " ~ " +
                        aData.ItemCode +
                        " ~ " +
                        aData.UnitPerPackage +
                        " ~ " +
                        aData.PackagePerContainer +
                        " ~ " +
                        aData.HsCode +
                        " ~ " +
                        aData.ItemId;
                });
        });
    };
    function GetAllSubCategory() {
        $http({
            url: '/Subcategory/GetAllSubategory',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.SubcategoryList = data;
        });
    }
    function GetAllItemUnit() {
        $http({
            url: '/Unit/GetAllUnit',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            data.forEach(function (aData) {
                delete aData.CreatorId;
                delete aData.CreateDate;
                delete aData.UpdatorId;
                delete aData.UpdateDate;
            });
            $scope.ItemUnitlist = data;
            $scope.ItemUnitlistM = angular.copy(data);
        });
    }
    function GetHsCode() {

        $http({
            url: "/ItemHsCode/Get",
            method: "Get",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.HsCodeList = data;
        })
    }
    function GetByCombinationValue() {
        $http({
            url: '/Item/GetByCombinationValue',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ItemMainlist = data;
        });
    }
    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetItemSearchResultPaged($scope.currentPage, $scope.SearchCriteria);
            alertify.log("Maximum record  per page is 100", "error", "5000");
        } else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetItemSearchResultPaged($scope.currentPage, $scope.SearchCriteria);
            alertify.log("Minimum record  per page is 1", "error", "5000");
        } else {
            $scope.currentPage = curPage;
            GetItemSearchResultPaged($scope.currentPage, $scope.SearchCriteria);
        }
    };
    $scope.Search = function () {
        $scope.SearchCriteria = "1=1";
        if ($scope.SrcCode != null && $scope.SrcCode != "") {
            $scope.SearchCriteria += " AND ItemCode LIKE '%" + $scope.SrcCode + "%'";
        }
        if ($scope.SrcName != null && $scope.SrcName != "") {
            $scope.SearchCriteria += " AND I.ItemName LIKE '%" + $scope.SrcName + "%'";
        }
        if ($scope.ddlSrcCategory != null) {
            $scope.SearchCriteria += " AND C.CategoryId=" + $scope.ddlSrcCategory.CategoryId;
        }
        if ($scope.ddlSrcSubategory != null) {
            $scope.SearchCriteria += " AND I.SubCategoryId=" + $scope.ddlSrcSubategory.SubCategoryId;
        }

        GetItemSearchResultPaged($scope.currentPage, $scope.SearchCriteria);
        $scope.SrcCode = '';
        $scope.SrcName = '';
        $scope.ddlSrcCategory = '';
        $scope.ddlSrcSubategory = '';
    };
    function CategoryChange() {
        $scope.AllItemSearch = [];
        $scope.FirstAttributeList = [];
        $scope.ad_Item.ItemName = null;
        $scope.ad_Item.ItemDescription = null;
        $scope.itemEntryNewForm.$setUntouched();
        $scope.itemEntryNewForm.$setPristine();
    }
    $("#dataacess").click(function () {
        $("#hideme").hide();
        newFun();
    });
    function newFun() {
        $scope.CustomiseTableDataList = [];
        var table = document.getElementById("mofiz");

        var x = 1, m = 0, l = 0;
        for (var s = 0; s < $scope.ItemTableHeaders.length; s++) {
            for (l = 0; l < $scope.ItemTableDataRow.length; l++) {
                for (m = 0; m < 1; m++) {
                    if (m === s) {
                        $scope.CustomiseTableData.Id = x++;
                        $scope.CustomiseTableData.ColName = $scope.ItemTableHeaders[s];
                        $scope.CustomiseTableData.ColValue = $scope.ItemTableDataRow[l][s];

                        $scope.CustomiseTableDataList.push($scope.CustomiseTableData);
                        $scope.CustomiseTableData = {};

                    }

                }
            }
        }
        var pb = [[]];
        for (var i = 0, row; row = table.rows[i]; i++) {
            pb[i] = [];
            //rows would be accessed using the "row" variable assigned in the for loop
            for (var j = 0, col; col = row.cells[j]; j++) {

                pb[i][j] = (col.innerText);
                if (j == 0) {
                    //col.text(i);
                    $("#mofiz tbody tr td:first").val(i);
                }
            }
        }

        var y = 0;
        var z = 0;
        pb.splice(pb.length - 1, 1);
        for (var p = 0; p < pb[0].length; p++) {
            //rows would be accessed using the "row" variable assigned in the for loop
            for (var k = 0; k < pb.length - 1; k++) {
                $scope.CustomiseTableData.Id = x++;
                $scope.CustomiseTableData.ColName = pb[y][z];
                $scope.CustomiseTableData.ColValue = pb[k + 1][p];

                $scope.CustomiseTableDataList.push($scope.CustomiseTableData);
                $scope.CustomiseTableData = {};
            }
            z++;
        }
    }
    $scope.ItemSearchTextChange = function (subCategoryId) {
        $scope.ad_Item.ItemDescription = null;
        var ItemSearchList = Enumerable.From($scope.ItemMainlist).Where("$.SubCategoryId==" + subCategoryId).ToArray();

        if ($scope.ad_Item.ItemName != undefined && $scope.ad_Item.ItemName != null && $scope.ad_Item.ItemName != "") {
            var SingleSearchItem = $scope.ad_Item.ItemName.split(" ");
            var SearchCriteria = "";
            myHilitor = new Hilitor2("SearchResults");
            myHilitor.remove();
            for (var i = 0; i < SingleSearchItem.length; i++) {
                myHilitor.setMatchType("open");
                if (SearchCriteria == "") {
                    SearchCriteria = "~($.ItemName).toUpperCase().indexOf('" + SingleSearchItem[i] + "'.toUpperCase())";
                } else {
                    SearchCriteria += " && ~($.ItemName).toUpperCase().indexOf('" + SingleSearchItem[i] + "'.toUpperCase())";
                }

                myHilitor.apply(SingleSearchItem[i]);
            }

            $scope.AllItemSearch = Enumerable.From(ItemSearchList).Where(SearchCriteria).Take(8).ToArray();
            $scope.ShowItemSearch = true;
        }
        else
            $scope.ShowItemSearch = false;

        var firstAttribute = Enumerable.From((Enumerable.From(ItemSearchList).Select("x => { FirstAttribute: x['FirstAttribute'] }").ToArray())).Distinct("$.FirstAttribute").ToArray();
        for (var i = 0; i < firstAttribute.length; i++) {
            var obj = {};
            obj.AttributeValue = firstAttribute[i].FirstAttribute;
            $scope.FirstAttributeList.push(obj);
        }
    }


    $scope.FirstDescriptionTextChange = function () {
        if ($scope.ad_Item.ItemDescription != undefined && $scope.ad_Item.ItemDescription != null && $scope.ad_Item.ItemDescription != "") {
            $scope.FirstAttributeSearch = Enumerable.From($scope.FirstAttributeList).Where("~($.AttributeValue).toUpperCase().indexOf('" + $scope.ad_Item.ItemDescription + "'.toUpperCase())").Take(8).ToArray();
            $scope.ShowFirstAttribute = true;
        }
        else
            $scope.ShowFirstAttribute = false;
    }

    $scope.LoadFirstAttributeValue = function (attributeValue) {
        $scope.ad_Item.ItemDescription = attributeValue;
        $scope.ShowFirstAttribute = false;
        $('#txtItemCode').focus();
    }

    $scope.CheckDuplicateBarcode = function () {
        var where = "ItemCode='" + $scope.ad_Item.ItemCode + "' ";
        if ($scope.ad_Item.ItemId > 0)
            where += "AND ItemId<>" + $scope.ad_Item.ItemId;
        $http({
            url: "/Item/GetItemSearchResult?searchCriteria=" + where,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_Item.ItemCode + ' Item Code already exists!', 'already', '5000');
                txtItemCode.focus();
                $scope.DuplicateBarcodeFound = true;
            } else {
                $scope.DuplicateBarcodeFound = false;
            }
        });
    };

    $scope.ItemCodeChange = function () {
        $scope.DuplicateBarcodeFound = true;
    };
    $scope.CheckCompanyAddress = function (IsCompany) {

        if (IsCompany) {
            //alert(IsCompany + " IsCompany");
            $scope.ad_CompanyAddress.AddressCompanyName = $scope.ad_Company.CompanyName;

        }
        if (!IsCompany) {
            //alert(IsCompany + " IsCompany");
            $("#AddressCompanyName").focus();
            $scope.ad_CompanyAddress.AddressCompanyName = "";
        }


    }

    function LoadItem(aItem) {


        $scope.ad_Item = {};
        $scope.ddlCategory = '';
        $scope.ddlSubCategory = '';
        $scope.ddlHsCode = '';
        $scope.ddlItemPackage = '';
        $scope.ddlItemUnit = '';
        $scope.ddlItemContainer = '';
        var itemFlag = 0;
        var splitItem = aItem.split('~');

        var itemId = splitItem[7].trim();

        angular.forEach($scope.ItemSearchList, function (aData) {
            if (itemId == aData.ItemId) {
               
                $scope.btnSaveItem = 'Update';
                if (aItem == aData.TempItemName) {
                    $scope.ad_Item = aData;
                    $scope.ddlCategory = { "CategoryId": aData.CategoryId };
                    $scope.ddlSubCategory = { "SubCategoryId": aData.SubCategoryId };
                    $scope.ddlHsCode = { "HsCodeId": aData.HsCodeId };

                    var objUnit = Enumerable.From($scope.ItemUnitlist).Where("$.ItemUnitId ==" + aData.UnitId).FirstOrDefault();
                    $scope.ddlItemUnit = objUnit;

                    var objPackage = Enumerable.From($scope.ItemUnitlist).Where("$.ItemUnitId ==" + aData.PackageId)
                        .FirstOrDefault();
                    $scope.ddlItemPackage = objPackage;

                    var objContainer = Enumerable.From($scope.ItemUnitlist).Where("$.ItemUnitId ==" + aData.ContainerId)
                        .FirstOrDefault();
                    $scope.ddlItemContainer = objContainer;

                    itemFlag = 1;

                }

            }

        });
        if (itemFlag == 0) {
            alertify.log('Please insert valid product!', 'error', '5000');
        }
    }
    $scope.LoadItem = function (aItem) {
        LoadItem(aItem);
    }

    $scope.resetTermsRv = function () {
        $(".summernoteRv").summernote("reset");
        $('.summernoteRv').summernote('code', $scope.ReviceTermsAndConditionList);
    }
    $scope.invoiceRowClick = function (data) {

        $scope.QtySumForItem = 0;
        $scope.UnitpriceSumForItem = 0;
        $scope.AmountSumForItem = 0;
        // $scope.ItemTableFooter[$scope.ItemTableFooter.length - 1]
        dynamictable();

        $scope.isRemoved = false;

        $scope.IsPreviousData = true;
        $scope.isEnableIput = false;
        $scope.isFinalized = true;
        $("#itemNameDisable").attr("disabled", false);
        $("#itemName").attr("disabled", false);
        if (data.DocStatus !== "Draft") {
            alertify.log("Cannot modify this invoice", "error", "5000");
            return;
        }
        $scope.InvoiceId = data.InvoiceId;
        var invNo = data.InvoiceNo;
        $scope.saveButtonLabel = "Update";
        $scope.exportInvoice = data;
        $scope.ddlExporter = { ExporterId: 1 };
        GetExporterBankAccount();
        /*GetFactoryList();*/
        $scope.ddlExporterBank = { "BankAccountId": data.ExporterBankId };
        $scope.ddlImporter = { "CompanyId": data.CompanyId };
        $scope.ddlInvoiceType = { "InvoiceType": data.InvoiceType };
        $scope.ddlFactory = { "ExporterAddress2": data.Factory };
        GetEmployeeEmailByDocumentRef();
        $scope.ddlEmail = { "EmployeeId": data.DocRefId };

        $scope.exportInvoice.InvoiceNo = invNo;
        var termsAndCondition = data.TermsAndCondition;
        $(".summernote").summernote("code", termsAndCondition);
        var res1 = data.InvoiceDate.substring(0, 5);
        if (res1 == "/Date") {
            var parsedDate1 = new Date(parseInt(data.InvoiceDate.substr(6)));
            var date1 = ($filter("date")(parsedDate1, "MMM dd, yyyy")).toString();
            data.InvoiceDate = date1;
        }
        GetSalesOrderListByCompanyForUpdate(data);
        $scope.ItemTableDataRow = [];

        getItemDetailModifiedDataForUpdate(data.InvoiceId);

        $http({
            url: "/ExpInvoice/InvoiceDetailGetByInvoiceId?invoiceId=" + data.InvoiceId,
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.invoiceDetailList = [];
            $scope.invoiceDetailSplittedList = [];
            if (data.length) {
                angular.forEach(data,
                    function (adata) {
                        adata.PreAmountOfLcCoppyItem = adata.UnitPrice;                       
                        $scope.invoiceDetailList.push(adata);
                        QuantityAndAmountSum();
                        $scope.invoiceDetailSplittedList = angular.copy($scope.invoiceDetailList);
                    });
            } else {
                $scope.totalAmount = 0;
                $scope.ItemCategory = [];
                for (var i = 0; i < $scope.SalesOrderList.length; i++) {
                    $scope.SalesOrderList[i].IsChecked = false;
                    $scope.SalesOrderList[i].disabled = false;
                };
            }
        });
        $http({
            url: "/ExpInvoice/PackingInfoGetByInvoiceId?invoiceId=" + data.InvoiceId,
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (packInfo) {
            if (packInfo.length) {
                $scope.packingInfo = packInfo[0];
            }
        });
        $("#itemNameDisable").keypress(function (event) {
            if (event.keyCode === 13) {
                $("#importBtn").click();
                event.preventDefault();
                return false;
            }
        });
        $window.scrollTo(0, 0);
    };

    $scope.ImportItem = function (aItem) {
        LoadItem(aItem);
        if ($scope.ad_Item.SubCategoryId === 1) {
            $scope.ad_Item.DescriptionOne = $scope.ad_Item.ItemDescription +
                //"\n" +
                //$scope.ad_Item.ItemDescriptionTwo +
                "\n" +
                "(" +
                $scope.ad_Item.UnitPerPackage +
                " " +
                "Pcs" +
                "/" +
                "Rolls" +
                ")";
        } else {
            $scope.ad_Item.DescriptionOne =
                $scope.ad_Item.ItemDescription + "\n" + $scope.ad_Item.ItemDescriptionTwo + "\n";
        }

        $scope.ad_Item.DescriptionTwo = "";
        if ($scope.ad_Item.Quantity == undefined || $scope.ad_Item.Quantity == "") {
            $scope.ad_Item.Quantity = 0;
        }
        if ($scope.ad_Item.UnitPrice == undefined || $scope.ad_Item.UnitPrice == "") {
            $scope.ad_Item.UnitPrice = 0;
        }
        if ($scope.ad_Item.Amount == undefined || $scope.ad_Item.Amount == "") {
            $scope.ad_Item.Amount = 0;
        }
        $scope.ad_Item.SalesOrderId = 0;
        $scope.invoiceDetailList.push($scope.ad_Item);
        tableImportItem($scope.ad_Item);
        QuantityAndAmountSum();
        ClearItem();
        alertify.log("Product Imported Successfully", "success", "5000");
    };
    $scope.SaveItem = function () {
        if ($scope.ad_Item.ItemId == 0) {
            SaveItem('Saved and Imported');
        }
        else if ($scope.ad_Item.ItemId != 0) {
            SaveItem('Updated and Imported');

        }
    };
    function SaveItem(status) {
        if ($scope.DuplicateBarcodeFound) {
            txtItemCode.focus();
            return;
        }

        var where = "$.FirstAttribute.toLowerCase()=='" + $scope.ad_Item.ItemDescription.toLowerCase() + "' && $.ItemName.toLowerCase()=='" + $scope.ad_Item.ItemName.toLowerCase() + "'";
        if ($scope.ad_Item.ItemId > 0)
            where += " && $.ItemId != " + $scope.ad_Item.ItemId;

        var itemCombinationExists = Enumerable.From($scope.ItemMainlist).Where(where).FirstOrDefault();
        if (itemCombinationExists != null || !angular.isUndefined(itemCombinationExists)) {
            alertify.log($scope.ad_Item.ItemName + " with Description " + $scope.ad_Item.ItemDescription + " already exists", 'error', '5000');
            return;
        }

        var subCategory = Enumerable.From($scope.SubcategoryList).Where('$.SubCategoryId == ' + $scope.ddlSubCategory.SubCategoryId).FirstOrDefault();
        $scope.ad_Item.SubCategoryName = subCategory.SubCategoryName;
        $scope.ad_Item.SubCategoryId = $scope.ddlSubCategory.SubCategoryId;
        $scope.ad_Item.ItemName = $scope.ad_Item.ItemName;
        $scope.ad_Item.UnitId = $scope.ddlItemUnit.ItemUnitId;
        $scope.ad_Item.IsActive = true;
        $scope.ad_Item.CreatorId = $scope.UserId;
        $scope.ad_Item.UpdatorId = $scope.UserId;

        if ($scope.ddlItemPackage == undefined) {
            $scope.ad_Item.PackageId = 0;
        }
        else {
            $scope.ad_Item.PackageId = $scope.ddlItemPackage.ItemUnitId;
        }
        if ($scope.ddlItemContainer == undefined) {
            $scope.ad_Item.ContainerId = 0;
        }
        else {
            $scope.ad_Item.ContainerId = $scope.ddlItemContainer.ItemUnitId;
        }


        if ($scope.ad_Item.ContainerSize == undefined) {
            $scope.ad_Item.ContainerSize = "";
        }
        if ($scope.ad_Item.PackageWeight == undefined) {
            $scope.ad_Item.PackageWeight = 0;
        }
        if ($scope.ad_Item.PackagePerContainer == undefined) {
            $scope.ad_Item.PackagePerContainer = 0;
        }
        if ($scope.ad_Item.ContainerWeight == undefined) {
            $scope.ad_Item.ContainerWeight = 0;
        }
        if ($scope.ad_Item.Quantity == undefined) {
            $scope.ad_Item.Quantity = 0;
        }
        if ($scope.ad_Item.UnitPrice == undefined) {
            $scope.ad_Item.UnitPrice = 0;
        }
        if ($scope.ad_Item.Amount == undefined) {
            $scope.ad_Item.Amount = 0;
        }
        $scope.ad_Item.DescriptionOne = $scope.ad_Item.ItemDescription;
        $scope.ad_Item.DescriptionTwo = $scope.ad_Item.ItemDescriptionTwo;

        var parms = JSON.stringify({ item: $scope.ad_Item });
        $http.post('/Item/SaveNew', parms).success(function (data) {
            if (data > 0) {
                alertify.log("Product " + status + " Successfully", 'success', '5000');
                if ($scope.ad_Item.ItemId == 0) {
                    $scope.ad_Item.ItemId = Number(data);
                }
                if ($scope.ad_Item.SubCategoryId === 1) {
                    $scope.ad_Item.DescriptionOne = $scope.ad_Item.ItemDescription +
                        /*'\n' + $scope.ad_Item.ItemDescriptionTwo +*/
                        '\n' +
                        '(' + $scope.ad_Item.UnitPerPackage + ' ' + 'Pcs' + '/' + 'Rolls' + ')';
                }
                else {
                    $scope.ad_Item.DescriptionOne = $scope.ad_Item.ItemDescription + '\n' + $scope.ad_Item.ItemDescriptionTwo;

                }

                $scope.ad_Item.DescriptionTwo = '';
                $scope.invoiceDetailList.push($scope.ad_Item);
                QuantityAndAmountSum();
                ClearItem();
                CategoryChange();

                $http({
                    url: '/Item/GetCombinationWithPrice',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (lst) {
                    $scope.AllCombinationlist = JSON.parse(lst);
                    var aCombination = Enumerable.From($scope.AllCombinationlist).Where('$.ItemAddAttId==' + data).FirstOrDefault();
                    $scope.LoadACombination(aCombination);
                })

                GetAllVariety();

                $scope.salesOrderForm.$setPristine();
                $scope.salesOrderForm.$setUntouched();

                $('#itemModal').modal('toggle');

            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });

    }

    $scope.CloseItemModal = function () {
        setTimeout(function () {
            if (angular.isUndefined($scope.ItemSearchCombination) || $scope.ItemSearchCombination == null)
                $('#SearchTextBox').focus();
            else
                $('#txtOrderQty').focus();
        }, 1000);
    };
    //End popup

    //Start Company popup

    function GetAllCompanyType() {
        var criteria = " [IsActive]=1";
        $http({
            url: "/Company/GetCompanyType?searchCriteria=" + criteria + "&orderBy=CompanyTypeName",
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.CompanyTypeList = data;
        });
    }

    function GetAllEmployee() {
        $http({
            url: "/Employee/GetAllEmployee",
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.employeeList = data;
            $scope.EmployeeListForAdd = angular.copy(data);
            $scope.ddlEmployeeRef = { "EmployeeId": $scope.LoginUser.EmployeeId };
        });
    }

    function GetCompanyAddress(code) {
        $http({
            url: "/Company/GetCompanyAddressByCompanyId",
            method: "GET",
            params: { companyId: code },
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.companyAddresslist = [];
            var slNo = 1;
            angular.forEach(data,
                function (aData) {
                    var companyAddress = {};
                    companyAddress = aData;
                    companyAddress.Status = "No";
                    if (aData.IsDefault) {
                        companyAddress.Status = "Yes";
                    }
                    companyAddress.SlNo = slNo;
                    $scope.companyAddresslist.push(aData);
                    slNo++;
                });
        });
    }

    function GetCompanyBillPolicy(companyId) {
        $http({
            url: "/Company/GetCompanyBillPolicyByCompanyId",
            method: "GET",
            params: { companyId: companyId },
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.companyBillPolicylist = [];
            var slNo = 1;
            angular.forEach(data,
                function (aData) {
                    var companyBillPolicy = {};
                    companyBillPolicy = aData;
                    companyBillPolicy.SlNo = slNo;
                    $scope.companyBillPolicylist.push(aData);
                    slNo++;
                });

            $scope.companyBillPolicylist = data;
        });
    }

    function SaveCompany() {
        $.ajax({
            url: "/Company/SaveCompany",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({
                _ad_Company: $scope.ad_Company,
                _ad_CompanyAddressList: $scope.companyAddresslist,
                ad_CompanyBillPolicyList: $scope.companyBillPolicylist
            }),
            success: function (data) {
                if ($scope.ad_Company.CompanyId > 0) {
                    $http({
                        url: "/Company/GetCompanyDynamic?searchCriteria=C.IsActive=1&orderBy=CompanyName",
                        method: "GET",
                        headers: { 'Content-Type': "application/json" }
                    }).success(function (companyData) {
                        $scope.companyList = companyData;
                        $http({
                            url: "/Company/GetCompanyAddressByCompanyId",
                            method: "GET",
                            params: { companyId: $scope.ad_Company.CompanyId },
                            headers: { 'Content-Type': "application/json" }
                        }).success(function (comAddData) {
                            $scope.companyAddresslist = [];
                            var slNo = 1;
                            angular.forEach(comAddData,
                                function (aData) {
                                    var companyAddress = {};
                                    companyAddress = aData;
                                    companyAddress.Status = "No";
                                    if (aData.IsDefault) {
                                        companyAddress.Status = "Yes";
                                    }
                                    companyAddress.SlNo = slNo;
                                    $scope.companyAddresslist.push(aData);
                                    slNo++;
                                });
                            $scope.ddlCompany = { "CompanyId": $scope.ad_Company.CompanyId };
                            $scope.ddlCompany.CompanyName = $scope.ad_Company.CompanyName;
                            var company = Enumerable.From($scope.companyList)
                                .Where("$.CompanyId === " + $scope.ddlImporter.CompanyId).FirstOrDefault();

                            if (!angular.isUndefined(company) && company !== null) {
                                $scope.exportInvoice.CompanyNameBilling = company.CompanyNameBilling;
                                $scope.exportInvoice.AddressBilling = company.AddressBilling;
                                $scope.exportInvoice.CompanyNameDelivery = company.CompanyNameDelivery;
                                $scope.exportInvoice.AddressDelivery = company.AddressDelivery;
                                $scope.exportInvoice.RefEmployeeId = company.RefEmployeeId;
                            }
                            $scope.ddlPreparedBy = { EmployeeId: $scope.ad_Company.RefEmployeeId };

                            if (data > 0) {
                                if ($scope.ad_Company.CompanyId > 0) {
                                    alertify.log("Company Details Updated Successfully.", "success", "5000");
                                }
                                if ($scope.ad_Company.CompanyId == 0) {
                                    alertify.log("Company Details Saved Successfully.", "success", "5000");
                                }

                                ClearCompany();
                                $scope.companyEntryForm.$setPristine();
                                $scope.companyEntryForm.$setUntouched();
                                $("#companyModal").modal("hide");
                            } else {
                                alertify.log("Server Errors!", "error", "5000");
                            }
                        });
                    });
                }
            },
            error: function () {
                alertify.log("Server Errors!", "error", "5000");
            }
        });
    }

    $scope.AddItem = function () {
        $("#itemModal").modal("show");
    };
    $scope.preData = function () {

        GetHtmlTable($scope.InvoiceId);
        $scope.IsTableShow = true;
    };

    function GetHtmlTable(invoiceId) {
        $http({
            url: "/ExpInvoice/GetTableHtml?invoiceId=" + invoiceId,
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.previousDataList = data;

            $("#HtmlTable").html("");

            $("#HtmlTable").append($scope.previousDataList[0].HtmlData);
            $("#HtmlTable table").attr("id", "viewTable");

        });
    }

    $scope.AddCompanyBillPolicy = function () {
        if ($scope.buttonBillPolicy == "Add") {
            if (!$scope.companyBillPolicylist.length) {
                $scope.ad_CompanyBillPolicy.SlNo = 1;
            } else {
                $scope.ad_CompanyBillPolicy.SlNo = Enumerable.From($scope.companyBillPolicylist).Max("$.SlNo") + 1;
            }
            var checkPolicy = Enumerable.From($scope.companyBillPolicylist)
                .Where('$.PolicyDescription =="' + $scope.ad_CompanyBillPolicy.PolicyDescription + '"')
                .FirstOrDefault();
            if (checkPolicy != null || !angular.isUndefined(checkPolicy)) {
                alertify.log('Bill Policy <b style="color:yellow">' +
                    $scope.ad_CompanyBillPolicy.PolicyDescription +
                    "</b> Already Added!",
                    "error",
                    "5000");
                $("#tbxPolicy").focus();
                return;
            }
            $scope.companyBillPolicylist.push($scope.ad_CompanyBillPolicy);

            $scope.companyEntryForm.$setPristine();
            $scope.companyEntryForm.$setUntouched();
        } else {
            var checkUpdateBPolicy = Enumerable.From($scope.companyBillPolicylist)
                .Where('$.PolicyDescription =="' +
                    $scope.ad_CompanyBillPolicy.PolicyDescription +
                    '" && $.SlNo!=' +
                    $scope.ad_CompanyBillPolicy.SlNo).FirstOrDefault();
            var updateBillPolicy = Enumerable.From($scope.companyBillPolicylist)
                .Where("$.SlNo==" + $scope.ad_CompanyBillPolicy.SlNo).FirstOrDefault();
            if (checkUpdateBPolicy == null || angular.isUndefined(checkUpdateBPolicy)) {
                updateBillPolicy.PolicyDescription = $scope.ad_CompanyBillPolicy.PolicyDescription;
            } else {
                updateBillPolicy.PolicyDescription = $("#tbxPolicyHidden").val();
                alertify.log('Bill Policy <b style="color:yellow">' +
                    checkUpdateBPolicy.PolicyDescription +
                    "</b> Already Added!",
                    "error",
                    "5000");
                $("#tbxPolicy").focus();
            }
        }
        $("#tbxPolicyHidden").val("");
        ClearCompanyBillPolicy();
    };
    $scope.LoadCompanyDetails = function () {
        $("#companyModal").modal("show");
        var companyDetails = Enumerable.From($scope.companyList)
            .Where("$.CompanyId === " + $scope.ddlImporter.CompanyId).FirstOrDefault();
        $scope.ad_Company = companyDetails;
        $scope.ad_CompanyAddress.IsCompany = true;
        $scope.ddlCompanyType = { "CompanyTypeId": $scope.ad_Company.CompanyTypeId };

        $scope.ddlEmployeeRef = { "EmployeeId": $scope.ad_Company.RefEmployeeId };

        GetCompanyAddress($scope.ad_Company.CompanyId);
        GetCompanyBillPolicy($scope.ad_Company.CompanyId);
        $scope.buttonSupp = "Update";
        $scope.btnDeleteShow = false;

        $window.scrollTo(0, 0);
    };
    $scope.SaveCompany = function () {
        $scope.ad_Company.CreatorId = $scope.LoginUser.UserId;
        $scope.ad_Company.UpdatorId = $scope.LoginUser.UserId;
       // $scope.ad_Company.RefEmployeeId = $scope.ddlEmployeeRef.EmployeeId;
        $scope.ad_Company.CompanyTypeId = $scope.ddlCompanyType.CompanyTypeId;
        if ($scope.ad_Company.CompanyId == 0) {
            SaveCompany();
        } else if ($scope.ad_Company.CompanyId != 0) {
            SaveCompany();
        }
    };
    $scope.AddCompanyAddress = function () {
        var isExistDefaultBilling;
        var isExistDefaultDelivery;

        if ($scope.ad_CompanyAddress.IsDefault) {
            $scope.ad_CompanyAddress.Status = "Yes";
        } else {
            $scope.ad_CompanyAddress.Status = "No";
        }

        if ($scope.buttonComAddress == "Add") {
            if (!$scope.companyAddresslist.length) {
                $scope.ad_CompanyAddress.SlNo = 1;
            } else {
                $scope.ad_CompanyAddress.SlNo = Enumerable.From($scope.companyAddresslist).Max("$.SlNo") + 1;
            }
            var checkAddress = Enumerable.From($scope.companyAddresslist)
                .Where('$.Address =="' + $scope.ad_CompanyAddress.Address + '"').FirstOrDefault();
            if (checkAddress != null || !angular.isUndefined(checkAddress)) {
                alertify.log('Company Address <b style="color:yellow">' +
                    $scope.ad_CompanyAddress.Address +
                    "</b> Already Added!",
                    "error",
                    "5000");
                $("#tbxCompanyAddress").focus();
                return;
            }
            if (!$scope.companyAddresslist.length) {
                $scope.companyAddresslist.push($scope.ad_CompanyAddress);
            } else {
                if (!$scope.isDefaultBilling) {
                    angular.forEach($scope.companyAddresslist,
                        function (aAddress) {
                            if (aAddress.AddressType == $scope.ad_CompanyAddress.AddressType &&
                                aAddress.IsDefault == $scope.ad_CompanyAddress.IsDefault) {
                                if ($scope.ad_CompanyAddress.AddressType == "Billing") {
                                    isExistDefaultBilling = aAddress;
                                }
                            }
                        });
                    //isExistDefaultBilling = Enumerable.From($scope.companyAddresslist).Where('$.AddressType == "' + $scope.ad_CompanyAddress.AddressType + '" && $.IsDefault == "' + $scope.ad_CompanyAddress.IsDefault +'" ').FirstOrDefault();
                    if (isExistDefaultBilling && $scope.ad_CompanyAddress.IsDefault) {
                        $scope.isDefaultBilling = true;
                    }
                }
                if (!$scope.isDefaultDelivery) {
                    angular.forEach($scope.companyAddresslist,
                        function (aAddress) {
                            if (aAddress.AddressType == $scope.ad_CompanyAddress.AddressType &&
                                aAddress.IsDefault == $scope.ad_CompanyAddress.IsDefault) {
                                if ($scope.ad_CompanyAddress.AddressType == "Delivery") {
                                    isExistDefaultDelivery = aAddress;
                                }
                            }
                        });
                    //isExistDefaultDelivery = Enumerable.From($scope.companyAddresslist).Where('$.AddressType == "' + $scope.ad_CompanyAddress.AddressType + '" && $.IsDefault == "' + $scope.ad_CompanyAddress.IsDefault +'" ').FirstOrDefault();
                    if (isExistDefaultDelivery && $scope.ad_CompanyAddress.IsDefault) {
                        $scope.isDefaultDelivery = true;
                    }
                }
                if ($scope.isDefaultBilling) {
                    alertify.log("Already billing address has default value", "error", "5000");
                    $scope.isDefaultBilling = false;
                    return;
                } else if ($scope.isDefaultDelivery) {
                    alertify.log("Already delivery address has default value", "error", "5000");
                    $scope.isDefaultDelivery = false;
                    return;
                }
                if (!$scope.isDefaultBilling || !$scope.isDefaultDelivery) {
                    $scope.companyAddresslist.push($scope.ad_CompanyAddress);
                }
            }

            $scope.companyEntryForm.$setPristine();
            $scope.companyEntryForm.$setUntouched();
        } else {
            var checkAddressForUpdate = Enumerable.From($scope.companyAddresslist)
                .Where('$.Address =="' +
                    $scope.ad_CompanyAddress.Address +
                    '" && $.SlNo!=' +
                    $scope.ad_CompanyAddress.SlNo).FirstOrDefault();
            var updateAddress = Enumerable.From($scope.companyAddresslist)
                .Where("$.SlNo==" + $scope.ad_CompanyAddress.SlNo).FirstOrDefault();
            if (checkAddressForUpdate == null || angular.isUndefined(checkAddressForUpdate)) {
                updateAddress.Address = $scope.ad_CompanyAddress.Address;
            }

            $scope.companyEntryForm.$setPristine();
            $scope.companyEntryForm.$setUntouched();
        }
        $("#tbxCompanyAddressHidden").val("");
        ClearCompanyAddress();
    };
    $scope.CheckDuplicateCompanyName = function () {
        var criteria = " [CompanyName]='" + $scope.ad_Company.CompanyName + "'";
        if ($scope.ad_Company.CompanyId > 0) {
            criteria += " AND CompanyId<>" + $scope.ad_Company.CompanyId;
        }

        $http({
            url: "/Company/GetCompanyDynamic?searchCriteria=" + criteria + "&orderBy=CompanyId",
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            if (data.length > 0) {
                $scope.duplicateCompName = true;
                alertify.log($scope.ad_Company.CompanyName + " Name No. already exists!", "already", "5000");
                $("#txtCompanyName").focus();
            } else {
                $scope.duplicateCompName = false;
            }
        });
    };
    $scope.foundChange = function () {
        $scope.found = true;
    };
    $scope.CheckDuplicateCompanyCode = function () {
        var criteria = " [CompanyCode]='" + $scope.ad_Company.CompanyCode + "'";
        if ($scope.ad_Company.CompanyId > 0) {
            criteria += " AND CompanyId<>" + $scope.ad_Company.CompanyId;
        }

        $http({
            url: "/Company/GetCompanyDynamic?searchCriteria=" + criteria + "&orderBy=CompanyId",
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            if (data.length > 0) {
                $scope.duplicateCompCode = true;
                alertify.log('Code "' + $scope.ad_Company.CompanyCode + '" No. already exists!', "already", "5000");
                $("#txtCompanyCode").focus();
            } else {
                $scope.duplicateCompCode = false;
            }
        });
    };
    $scope.SelCompanyAddress = function (companyAddress) {
        $("#tbxCompanyAddressHidden").val(companyAddress.Address);
        $scope.ad_CompanyAddress = companyAddress;
        $scope.buttonComAddress = "Update";
    };
    $scope.removeAddress = function (aCompanyAddress) {
        var ind = $scope.companyAddresslist.indexOf(aCompanyAddress);
        $scope.companyAddresslist.splice(ind, 1);
        ClearCompanyAddress();
    };

    $scope.SelCompanyBillPolicy = function (customerbillpolicy, index) {
        $("#tbxPolicyHidden").val(customerbillpolicy.PolicyDescription);
        $scope.ad_CompanyBillPolicy = customerbillpolicy;
        $scope.buttonBillPolicy = "Change";
        $scope.btnSuppBillPolicyDeleteShow = true;
    };

    $scope.removeBillPolicy = function (aBillPolicy) {
        var ind = $scope.companyBillPolicylist.indexOf(aBillPolicy);
        $scope.companyBillPolicylist.splice(ind, 1);
        ClearCompanyBillPolicy();
    },
        $scope.stopProp = function () {
            event.stopPropagation();
        };

        //End Company popup

    //table manupulation new table change
    function insertAtTable(index, insertItem) {
        $scope.insertItemCount = insertItem;
        $scope.ItemTableHeaders.splice(index, 0, insertItem);
        angular.forEach($scope.ItemTableDataRow,
            function (item, idx) {
                item.splice(Number(index), 0, "new data");
            });
        $scope.ItemTableFooter.splice(index, 0, "");
    }

    $scope.tableInsertCol = function () {
        var index = prompt("Please enter index No");
        var name = prompt("Enter column name here");
        if (Number(index) > ($scope.ItemTableHeaders.length - 3) ||
            Number(index) <= 4 ||
            name == null ||
            index == null || isNaN(Number(index)))
            alert("Can't insert here");
        else {
            $scope.AmountSumForItem = 0;
            insertAtTable(Number(index), name);
            //$scope.mergeTableData();
        }
    };
    $scope.tableInsertRow = function () {
        //  $scope.ItemTableDataRow.push([1, 'Des', 'q', 'u', 'a']);
        var myarray = [];
        angular.forEach($scope.ItemTableHeaders,
            function (item) {
                if (item == "Description") {
                    myarray.push("Descripton");

                } else {
                    myarray.push("R");
                }
                $("#mofiz td").attr("contentEditable", true);


            });
        $scope.ItemTableDataRow.push(myarray);

    };

    function tableImportItem(aItem) {
        var myarray = [];
        angular.forEach($scope.ItemTableHeaders,
            function (i, idx) {
                if (idx == 0) {
                    myarray.push(aItem.SalesOrderId);
                }
                else if (idx == 1) {
                    myarray.push(aItem.ItemId);
                }
                else if (idx == 2) {
                    myarray.push($scope.ItemTableDataRow.length + 1);
                } else if (idx == 3) {
                    myarray.push(aItem.ItemName + "\n HS Code: " + aItem.HsCode);
                } else if (idx == 4) {
                    myarray.push(aItem.DescriptionOne);
                } else if (idx == $scope.ItemTableHeaders.length - 3) {
                    myarray.push(0);
                } else if (idx == $scope.ItemTableHeaders.length - 2) {
                    myarray.push(0);
                } else if (idx == $scope.ItemTableHeaders.length - 1) {
                    myarray.push(0);
                } else {
                    myarray.push("New Data");
                }
                //$("#mofiz td").attr("contentEditable", true);


            });
        $scope.ItemTableDataRow.push(myarray);

    }

    $scope.restMergeInvoiceDetails = function () {
        var result = confirm("Are you sure to reset all data?");
        if (result) {
            //Logic to delete the item
            if ($scope.invoiceDetailList.length == 0) {
                $scope.ItemCategory = [];
                $scope.invoiceDetailList = [];
                $("#mofiz  tr th:nth-child(n)").each(function () {
                    $(this).attr("contenteditable", "false");

                });
                $scope.ItemTableHeaders =
                    [
                        "SalesOrderId", "ItemId", "SlNo", "Item Name", "Description Of Goods", "Qty/Rolls", "Unit Price", "Amount"
                    ];
                $scope.ItemTableFooter = ["", "", "", "", "", 0, "", 0];
                $scope.ItemTableDataRow = [];
                $scope.invoiceDetailList = [];
                $scope.margeProduct = [];
                //$scope.POReference = {};
                //$scope.POReferencelist = [];
                //$scope.POReferencelistTemp = [];
                $scope.AmountSumForItem = 0;
                $scope.QtySumForItem = 0;
                $scope.QuantitySum = 0;
                $scope.AmountSum = 0;
                $scope.isFinalized = false;
                $("#itemNameDisable").attr("disabled", true);
                $scope.itemNameDisable = true;
                $scope.isEnableIput = false;
                $scope.isRemoved = false;
                $scope.isRemoved = false;
                $scope.isFinalized = false;
                $scope.itemFlag = false;
                $scope.totalAmount = 0;
                $scope.ad_Item.TempItemName = "";
                $scope.InvoiceNoTemp = "";
                for (var i = 0; i < $scope.SalesOrderList.length; i++) {
                    $scope.SalesOrderList[i].IsChecked = false;
                    $scope.SalesOrderList[i].disabled = false;
                }
                //if ($scope.invoiceDetailList[0].InvoiceId == undefined || $scope.invoiceDetailList[0].InvoiceId == 0) {
                $scope.ItemCategory = [];
                $scope.invoiceDetailList = [];
                //}
                return;
            }
            restMergeInvoiceDetails();
        }
    }


    function restMergeInvoiceDetails() {
        $scope.ItemCategory = [];
        $scope.invoiceDetailList = [];
        $("#mofiz  tr th:nth-child(n)").each(function () {
            $(this).attr("contenteditable", "false");

        });
        $scope.ItemTableHeaders =
            [
                "SalesOrderId", "ItemId", "SlNo", "Item Name", "Description Of Goods", "Qty/Rolls", "Unit Price", "Amount"
            ];
        $scope.ItemTableFooter = ["", "", "", "", "", 0, "", 0];
        $scope.ItemTableDataRow = [];
        $scope.invoiceDetailList = [];
        $scope.AmountSumForItem = 0;
        $scope.QtySumForItem = 0;
        $scope.QuantitySum = 0;
        $scope.AmountSum = 0;
        $scope.isFinalized = false;
        $("#itemNameDisable").attr("disabled", true);
        $scope.itemNameDisable = true;
        $scope.isEnableIput = false;
        $scope.isRemoved = false;
        $scope.isRemoved = false;
        $scope.isFinalized = false;
        $scope.totalAmount = 0;
        $scope.ad_Item.TempItemName = "";

        for (var i = 0; i < $scope.SalesOrderList.length; i++) {
            $scope.SalesOrderList[i].IsChecked = false;
            $scope.SalesOrderList[i].disabled = false;
        }
        $scope.ItemCategory = [];
        $scope.invoiceDetailList = [];





    };
    $scope.tableInputDisable = function () {
        editAble();
        $scope.isEnableIput = true;
        $("#itemNameDisable").attr("disabled", true);
    }
    $scope.tableRemoveCol = function () {
        var index = prompt("Please enter Column No");
        var col = Number(index);

        var firstVisualElementNumber = 3;
        if (col <= 4)
            alert("Can't Remove this Column");
        else if ((col) >= ($scope.ItemTableHeaders.length - 3))
            alert("Can't Remove this Column");
        else {
            $scope.ItemTableHeaders.splice(col, 1);

            angular.forEach($scope.ItemTableDataRow, function (item, idx) {
                item.splice(col, 1);
            });

            $scope.ItemTableFooter.splice(col, 1);
        }
    };
    hotkeys.add({
        combo: 'ctrl+backspace',
        description: 'This one goes to 11',
        callback: function () {
            if (!$scope.isFinalized) {
                alertify.log("Can't remove at this time !!!", "error", "5000");
                return;
            } else {
                if ($scope.row_numP1 != null) {

                    tableRemoveRow();
                } else {
                    alertify.log("Please select a item !!!", "error", "5000");
                    $scope.row_numP1 = null;
                }
            }


        }
    });
    $scope.tableRemoveRow = function () {
        tableRemoveRow();
    };
    function tableRemoveRow() {
        if ($scope.row_numP1 != null) {

            var r = confirm("Are you sure to remove " + $scope.row_numP1 + " SL number item ?");
            if (r == true) {
                //var rowNo = prompt("Please enter a row number");
                if ($scope.row_numP1 != null) {
                    var salesOrderItemList =
                        Enumerable.From($scope.invoiceDetailList).Where("$.SalesOrderId !== 0").ToArray();
                    var row = $scope.ItemTableDataRow[Number($scope.row_numP1 - 1)];

                    if (salesOrderItemList.length > 1) {
                        $scope.GetChengedFieldValue("0", row, Number(row.length - 3));
                        //remove item table data row here
                        $scope.invoiceDetailList.splice(Number($scope.row_numP1 - 1), 1);
                        $scope.ItemTableDataRow.splice(Number($scope.row_numP1 - 1), 1);

                        QuantityAndAmountSum();
                        rearrangeSerial();

                    }
                    else if (row[0] == 0) {
                        $scope.GetChengedFieldValue("0", row, Number(row.length - 3));
                        //remove item table data row here
                        $scope.ItemTableDataRow.splice(Number($scope.row_numP1 - 1), 1);
                        $scope.invoiceDetailList.splice(Number($scope.row_numP1 - 1), 1);
                        QuantityAndAmountSum();
                        rearrangeSerial();
                    }
                    else {
                        alertify.log("Shouldn't remove Last Item!!!", "error", "5000");
                    }
                } else {
                    alertify.confirm().destroy();
                }
            }
        } else {
            alertify.log("Please select a item !!!", "error", "5000");
            $scope.row_numP1 = null;
        }
    }
    function editAble() {
        var rowNumber = $scope.ItemTableHeaders.length - 4;

        $("#mofiz tbody tr td:nth-child(-n+" + rowNumber + ")").each(function () {
            $(this).attr("contenteditable", "true");
        });
        $("#mofiz tfoot tr th").each(function () {
            $(this).attr("contenteditable", "true");
        });
        //$("#mofiz tbody tr td:nth-child(n + 6)").each(function () {
        //    $(this).attr("contenteditable", "false");
        //});
        $("#mofiz  tr th:nth-child(n)").each(function () {
            $(this).attr("contenteditable", "true");
        });
        $("#mofiz tbody tr td:nth-child(1),#mofiz tbody tr td:nth-child(2)").each(function () {
            $(this).attr("contenteditable", "false");
        });
        $("#mofiz  tr th:nth-child(1),#mofiz tr th:nth-child(2)").each(function () {
            $(this).attr("contenteditable", "false");
        });
        $("#mofiz tbody td").find(":input").each(function () {
            $(this).attr("disabled", false);
        });
    }
    function rearrangeSerial() {
        var serial = 1;
        angular.forEach($scope.ItemTableDataRow,
            function (aRow) {
                for (var i = 0; i < aRow.length; i++) {
                    if (i === 2) {
                        aRow[2] = serial++;
                    }
                }
            });
    }
    function getItemDetailModifiedDataForUpdate(invoiceId) {
        $scope.ItemTableDataRow = [];
        $scope.ItemRow = [];

        $http({
            url: "/ExpInvoice/GetInvoiceDetailModifiedDataForUpdate?invoiceId=" + invoiceId,
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.itemDetailDataForUpdate = data;

            angular.forEach(data,
                function (item, idx) {
                    $scope.ItemRow = Object.keys(item).map(e => item[e]);
                    $scope.ItemTableDataRow.push($scope.ItemRow);
                    $scope.ItemTableHeaders = Object.getOwnPropertyNames(item);
                });
            $scope.ItemTableFooter = [];
            for (var i = 0; i < $scope.ItemTableHeaders.length; i++) {
                if (i == $scope.ItemTableHeaders.length - 3 || i == $scope.ItemTableHeaders.length - 1) {
                    $scope.ItemTableFooter.push(0);
                } else {
                    $scope.ItemTableFooter.push("");
                }

            }
            

        });
    }

    function itemLoadDynamicTable(incomingData) {
        //$scope.itemDetailDataForUpdate = data;
        $scope.TrimmedTableData = [];
        var sl = 0;
        angular.forEach(incomingData,
            function (iData) {
                $scope.TrimmedTableRow = {};

                $scope.TrimmedTableRow.SalesOrderId = iData.SalesOrderId;
                $scope.TrimmedTableRow.ItemId = iData.ItemId;

                $scope.TrimmedTableRow.Sl = ++sl;
                $scope.TrimmedTableRow.ItemName = iData.ItemName + '\n HS Code: ' + iData.HsCode;
                $scope.TrimmedTableRow.Description = iData.DescriptionOne;
                $scope.TrimmedTableRow.Qty = iData.Quantity;
                $scope.TrimmedTableRow.UnitPrice = iData.UnitPrice;
                $scope.TrimmedTableRow.Amount = iData.Amount;

                $scope.TrimmedTableData.push($scope.TrimmedTableRow);
            });

        $scope.ItemTableHeaders = [];
        $scope.ItemTableDataRow = [];
        $scope.ItemTableFooter = [];
        angular.forEach($scope.TrimmedTableData,
            function (item, idx) {
                $scope.ItemRow = Object.keys(item).map(e => item[e]);
                $scope.ItemTableDataRow.push($scope.ItemRow);
                //$scope.ItemTableHeaders = Object.getOwnPropertyNames(item);
                $scope.ItemTableHeaders =
                    [
                        "SalesOrderId", "ItemId", "SlNo", "Item Name", "Description Of Goods", "Qty", "Unit Price", "Amount"
                    ];
            });

        for (var i = 0; i < $scope.ItemTableHeaders.length; i++) {
            if (i == $scope.ItemTableHeaders.length - 3 || i == $scope.ItemTableHeaders.length - 1) {
                $scope.ItemTableFooter.push(0);
            } else {
                $scope.ItemTableFooter.push("");
            }

        }
    }



    $scope.tableSpanValueSet = function (parentIndex, index, item) {
        $scope.ItemTableDataRow[parentIndex][index] = item;
    };
    //------------------------------------------------------------------------------------------------------------


    $scope.AddPOReference = function () {
        $scope.POReference.DocType = "PI";
        $scope.POReference.DocumentId = 0;
        $scope.POReferencelist.push($scope.POReference);
        $scope.POReference = {};
    }
    $scope.removePOReference = function (aPOReference) {
        var ind = $scope.POReferencelist.indexOf(aPOReference);
        $scope.POReferencelist.splice(ind, 1);
        $scope.POReference = {};
    }
});