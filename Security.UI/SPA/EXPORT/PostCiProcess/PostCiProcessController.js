app.controller("PostCiProcessController", function ($scope, $cookieStore, $http, $filter, $window) {

    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    ClearForCC();
    clearForDC();
    clearForTC();
    clearForBD();
    Clear();
    function Clear() {
        $scope.button = "Save";
        $scope.CommercialInvoiceListForReport = [];
        $scope.ddlConsCommercialInvoiceForReport = null;
        GetAllCommercialInvoiceForReport();
    }
    function clearForTC() {
        //TruckChallan

        $scope.ddlPage = {};
        $scope.PageList = [
            { PageId: 1, PageNo: '10', PageNoShow: '10' },
            { PageId: 2, PageNo: '20', PageNoShow: '20' },
            { PageId: 3, PageNo: '30', PageNoShow: '30' },
            { PageId: 4, PageNo: '40', PageNoShow: '40' },
            { PageId: 5, PageNo: '50', PageNoShow: '50' },
            { PageId: 6, PageNo: '100', PageNoShow: '100' },
            { PageId: 7, PageNo: '500', PageNoShow: '500' },
            { PageId: 7, PageNo: '10000000', PageNoShow: 'All' }
        ]
        $scope.ddlPage.PageNo = '10';

        $scope.ddlConsCommercialInvoiceForTC = null;
        $scope.TCFooterSorting = 0;
        $scope.TCId = 0;
        $scope.CommercialInvoiceListForTC = [];
        $scope.TruckChallanList = [];
        $scope.TruckChallanUniqueList = [];
        $scope.exp_TruckChallan = [];
        $scope.TruckChallanSingle = [];
        $scope.TruckOriginalList = [];
        $scope.OrginalCiListForTC = [];
        $scope.disDDLForTC = false;
        GetAllTruckChallan();
        GetAllCommercialInvoiceForTruckChallan();
    }
    function clearForBD() {
        //Bank
        $scope.ddlCommercialInvoiceForBankDoc = null;
        $scope.CommercialInvoiceForBankDocList = [];
        $scope.BankDocumentlist = [
            { NameOfDocument: 'BILL OF EXCHANGE', OriginSet: '01 + 02 Copies', Sets: '01' },
            { NameOfDocument: 'BILL OF EXCHANGE', OriginSet: '01 + 02 Copies', Sets: '01' },
            { NameOfDocument: 'DELIVERY CHALLAN', OriginSet: '01', Sets: '01' },
            { NameOfDocument: 'PACKING LIST', OriginSet: '01 + 04 Copies', Sets: '01' },
            { NameOfDocument: 'COMMERCIAL INVOICE', OriginSet: '01 + 08 Copies', Sets: '01' },
            { NameOfDocument: "BENEFICIARY'S CERTIFICATE", OriginSet: '01', Sets: '01' },
            { NameOfDocument: 'CERTIFICATE OF ORIGIN', OriginSet: '01', Sets: '01' },
            { NameOfDocument: 'LC COPY', OriginSet: '01', Sets: '01' },
            { NameOfDocument: 'PROFORMA INVOICE', OriginSet: '01', Sets: '01' },
            { NameOfDocument: 'BILL OF ENTRY/ EXPORT', OriginSet: '01', Sets: '01' },
            { NameOfDocument: 'EXP ORIGINAL', OriginSet: '01', Sets: '01' },
            { NameOfDocument: 'EXPORT PERMIT', OriginSet: '01', Sets: '01' }
        ];
        //$('#DocTable').dragtable();

        $scope.BankDocumentDetaillist = [];
        $scope.BankdocNamelist = [];
        $scope.CommercialInvoiceForBankDocListOrginal = [];
        $scope.BankDocument = {};
        $scope.BankDocument.BankApplicationTo = 'Manager';
        $scope.BankDocument.BankDocumentToDepartment = 'Trade & Finance Department';
        $scope.disDDLForBD = false;
        $scope.hideAddBtn = false;
        GetBankdoc();
        GetAllCommercialInvoiceForBankDoc();
        ClearBankDocumentDetail();
        $('#txtApplicationDate').datetimepicker({
            format: 'MMM DD, YYYY',
            timepicker: false,

        });
        $scope.CalendarOpenApplicationDate = function () {
            $("#txtApplicationDate").focus();
            $("#txtApplicationDate").trigger("click");
        }
    }
    function clearForDC() {
        $scope.ddlConsCommercialInvoiceForDC = null;
        $scope.CommercialInvoiceListForDC = [];
        $scope.CommercialInvoiceListForDCGrid = [];
        $scope.CommercialInvoiceListForDCOriginal = [];
        $scope.disDDLForDC = false;
        GetAllCommercialInvoiceForDC();
    }
    //==========Abir====>>
    function ClearForCC() {
        $scope.button = "Save";
        document.getElementById("ddlConsCommercialInvoiceDisabled").disabled = false;
        $scope.consuptionCertificateForTable = [];
        $scope.consuptionCertificateForTableOrginal = [];
        $scope.consuptionCertificateForddl = [];
        $scope.ConsumptionCertificateList = [];
        $scope.ddlConsumptionCertificate = null;
        $scope.ddlChalanComInvoice = null;
        $scope.ddlOthersCommercialInvoice = null;
        $scope.ExportGoodslist = [];
        $scope.RawMateriallist = [];
        $scope.RawMaterial = {};
        $scope.RawMaterial.ImportBondNo = " (Raw Materials)";
        $scope.ConsumptionCertificate = {};
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        GetAllConsumptionCertificate();
        GetConsumptionCertificateForDrop();
        $("#txtStatementDate").datepicker({
            dateFormat: "dd/mm/yy"
        });
        $scope.CalendartxtDueDate = function () {
            $("#txtStatementDate").focus();
            $("#txtStatementDate").trigger("click");
        }

        $('#txtBillOfEntryDate').datepicker({
            dateFormat: "dd/mm/yy"
        });
        $scope.CalendarOpenBillOfEntryDate = function () {
            $("#txtBillOfEntryDate").focus();
            $("#txtBillOfEntryDate").trigger("click");
        }

        $('#txtEpzPermissionDate').datepicker({
            dateFormat: "dd/mm/yy"

        });

        $scope.CalendarOpenDEPZDate = function () {
            $("#txtEpzPermissionDate").focus();
            $("#txtEpzPermissionDate").trigger("click");
        }

    }
   //==========Abir====>>


    function GetAllCommercialInvoiceForReport() {
        $http({
            url: '/ExpCommercialInvoice/GetAllCommercialInvoice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data) {
                angular.forEach(data, function (e) {
                    var isDate = isNaN(e.CommercialInvoiceDate);
                    if (isDate) {
                        var res1 = e.CommercialInvoiceDate.substring(0, 5);
                        if (res1 == "/Date") {
                            var parsedDate1 = new Date(parseInt(e.CommercialInvoiceDate.substr(6)));
                            var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                            e.CommercialInvoiceDate = date1;

                        }
                    }
                    if (e.IsSubmitted == true && e.DocStatus != 'New Approval Pending') {
                        $scope.CommercialInvoiceListForReport.push(e);
                    }
                });
            }
        });
    }
    //Delivery challan Part
    $("#txtFromDateForDC").datepicker({
        dateFormat: "dd/mm/yy"
    });

    $scope.FormDateChangeForDC = function () {
        $("#txtFromDateForDC").focus();
        $("#txtFromDateForDC").trigger("click");
    }
    $("#txtToDateForDC").datepicker({
        dateFormat: "dd/mm/yy"
    });

    $scope.ToDateChangeForDC = function () {
        $("#txtToDateForDC").focus();
        $("#txtToDateForDC").trigger("click");
    }
    $scope.reloadBtnDC = function () {
        $('#txtFromDateForDC').val('');
        $('#txtToDateForDC').val('');
        $('#textInvoiceNoAndCompany').val('');
        $scope.FromDate = "";
        $scope.ToDate = "";
        $scope.SearchInvoiceAndCompanyName = null;
        GetAllCommercialInvoiceForDC(1);
    }
    function GetAllCommercialInvoiceForDC() {

        $http({
            url:'/ExpCommercialInvoice/GetAllCommercialInvoice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data) {
                angular.forEach(data, function (e) {
                    var isDate = isNaN(e.CommercialInvoiceDate);
                    if (isDate) {
                        var res1 = e.CommercialInvoiceDate.substring(0, 5);
                        if (res1 == "/Date") {
                            var parsedDate1 = new Date(parseInt(e.CommercialInvoiceDate.substr(6)));
                            var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                            e.CommercialInvoiceDate = date1;

                        }
                    }
                    if (e.IsSubmitted == true && e.DocStatus != 'New Approval Pending') {
                        $scope.CommercialInvoiceListForDCOriginal.push(e);
                    }

                    if (e.IsSubmitted == true && e.DocStatus != 'New Approval Pending' && e.DcGateNo == "" && e.VehicleRegNo == "") {
                        $scope.CommercialInvoiceListForDC.push(e);
                    }

                    if (e.IsSubmitted == true && e.DocStatus != 'New Approval Pending' && e.DcGateNo != "" && e.VehicleRegNo != "") {
                        $scope.CommercialInvoiceListForDCGrid.push(e);
                    }

                });
            }
        });
    }
    $scope.SaveDeliveryChallan = function () {
        $scope.disDDLForDC = false;
        alertify.confirm("Are you sure to save?", function (e) {
            if (e) {
                var params = JSON.stringify({ exp_CommercialInvoice: $scope.exp_CommercialInvoice });

                $http.post('/ExpCommercialInvoice/Update', params).success(function (data) {
                    if (data > 0) {
                        alertify.log(' saved successfully!', 'success', '5000');
                        clearForDC();
                        $scope.exp_CommercialInvoice.DcGateNo = "";
                        $scope.exp_CommercialInvoice.VehicleRegNo = "";
                        $scope.consumptionCertificateForm.$setPristine();
                        $scope.consumptionCertificateForm.$setUntouched();
                    }
                }).error(function (msg) {
                    alertify.log('Save failed, refresh page and try again', 'error', '5000');
                });
                window.scrollTo(0, 0);
            }
        })
    }
    $scope.UpdateDeliveryGet = function (aCommercialInvoice) {
        $scope.disDDLForDC = true;
        $scope.exp_CommercialInvoice = aCommercialInvoice;
        $scope.CommercialInvoiceListForDC = $scope.CommercialInvoiceListForDCOriginal;

        $scope.ddlConsCommercialInvoiceForDC = { CommercialInvoiceId: aCommercialInvoice.CommercialInvoiceId };
        window.scrollTo(0, 0);
    }
    $scope.DeliveryChalanOneBtnTable = function (delChalanOne) {
        $window.open("#/DeliveryChalan", "popup", "width=850,height=550,left=280,top=80");
        //  var deliveryChalanOne = delChalanOne.CommercialInvoiceId;
        $cookieStore.put("CommercialInvoiceId", delChalanOne);
        event.stopPropagation();

    };
    $scope.resetChallanGateForm = function () {
        document.getElementById("btnResetForDC").disabled = true;
        setTimeout(function () {
            document.getElementById("btnResetForDC").disabled = false;
        }, 1500);
        $scope.exp_CommercialInvoice.DcGateNo = "";
        $scope.exp_CommercialInvoice.VehicleRegNo = "";
        clearForDC();
        $scope.consumptionCertificateForm.$setPristine();
        $scope.consumptionCertificateForm.$setUntouched();
        //$timeout(function () {
        //    document.getElementById("btnResetForDC").disabled = false;
        //}, 3000);
        
    }
    $scope.DeliveryChalanOneBtn = function (delChalanOne) {
        $window.open("#/DeliveryChalan", "popup", "width=850,height=550,left=280,top=80");
        var deliveryChalanOne = delChalanOne.CommercialInvoiceId;
        $cookieStore.put("CommercialInvoiceId", deliveryChalanOne);
        event.stopPropagation();

    };
    //TruckChllan Part
    function GetAllCommercialInvoiceForTruckChallan() {
        $http({
            url: '/ExpCommercialInvoice/GetAllCommercialInvoice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data) {
                angular.forEach(data, function (e) {
                    var isDate = isNaN(e.CommercialInvoiceDate);
                    if (isDate) {
                        var res1 = e.CommercialInvoiceDate.substring(0, 5);
                        if (res1 == "/Date") {
                            var parsedDate1 = new Date(parseInt(e.CommercialInvoiceDate.substr(6)));
                            var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                            e.CommercialInvoiceDate = date1;

                        }
                    }
                    if (e.IsSubmitted == true && e.DocStatus != 'New Approval Pending') {
                        $scope.CommercialInvoiceListForTC.push(e);
                    }
                    $scope.OrginalCiListForTC = $scope.CommercialInvoiceListForTC;
                });
                GetUpdateCIForTC();
            }
        });
    }
    $scope.UpdateTruckChallanDetails = function (aTruckChallan) {
        $scope.TruckChallanSingle = [];
        $scope.Result = [];

        $scope.CommercialInvoiceListForTC = [];
        $scope.CommercialInvoiceListForTC = $scope.OrginalCiListForTC;
        $scope.TruckChallanSingle.push(aTruckChallan);
        $scope.Result = $scope.TruckChallanList.filter(o1 => $scope.TruckChallanSingle.some(o2 => o1.CommercialInvoiceId == o2.CommercialInvoiceId));

        angular.forEach($scope.Result, function (data) {

            if (data.Sort == 1) {
                $scope.TCId1 = data.TruckChallanId;
                $scope.ddlConsCommercialInvoiceForTC = { CommercialInvoiceId: aTruckChallan.CommercialInvoiceId };
                $scope.exp_TruckChallan.TruckNo = data.TruckNo;
                $scope.exp_TruckChallan.TCFooter1 = data.Footers;
            }
            if (data.Sort == 2) {
                $scope.TCId2 = data.TruckChallanId;
                $scope.exp_TruckChallan.TCFooter2 = data.Footers;
            }
            if (data.Sort == 3) {
                $scope.TCId3 = data.TruckChallanId;
                $scope.exp_TruckChallan.TCFooter3 = data.Footers;
            }
            if (data.Sort == 4) {
                $scope.TCId4 = data.TruckChallanId;
                $scope.exp_TruckChallan.TCFooter4 = data.Footers;
            }
            if (data.Sort == 5) {
                $scope.TCId5 = data.TruckChallanId;
                $scope.exp_TruckChallan.TCFooter5 = data.Footers;
            }
            
            
        });
        
        $scope.exp_TruckChallan.CommercialInvoiceId = $scope.ddlConsCommercialInvoiceForTC.CommercialInvoiceId;
        $scope.disDDLForTC = true;
        window.scrollTo(0, 0);
    }
    function GetAllTruckChallan() {
        $http({
            url: '/ExpCommercialInvoice/GetAllTruckChallan',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.TruckOriginalList = data;
            $scope.TruckChallanList = data;
            GetUpdateCIForTC();
        });

    }
    function GetUpdateCIForTC() {
        var CINumbers = [];
        var key = 'CommercialInvoiceId';
        if ($scope.TruckChallanList.length != 0 && $scope.CommercialInvoiceListForTC.length != 0) {
            $scope.TruckChallanUniqueList = [...new Map($scope.TruckChallanList.map(item =>
                [item[key], item])).values()];

            var listToDelete = [];
            for (var i = 0; i < $scope.TruckChallanUniqueList.length; i++) {
                listToDelete.push($scope.TruckChallanUniqueList[i].CommercialInvoiceId);
            }

            $scope.CommercialInvoiceListForTC = $scope.CommercialInvoiceListForTC.filter(el => (listToDelete.indexOf(el.CommercialInvoiceId) == -1));
        }
        else {
            return;
        }

        
    }
    //Truck challan save 
    $scope.SaveTruckChallan = function () {
        $scope.TCFooter = {};
        $scope.TCInfo = [];

        $scope.UpdatedDate = new Date().toISOString().slice(0, 10)

        if ($scope.TCId1) {
            if ($scope.exp_TruckChallan.TCFooter1) {
                $scope.TCFooter.TruckChallanId = $scope.TCId1;
                $scope.TCFooter.CommercialInvoiceId = $scope.exp_TruckChallan.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = $scope.exp_TruckChallan.TCFooter1;
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            } else {
                $scope.TCFooter.TruckChallanId = $scope.TCId1;
                $scope.TCFooter.CommercialInvoiceId = $scope.exp_TruckChallan.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = "";
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            }
            if ($scope.exp_TruckChallan.TCFooter2) {
                $scope.TCFooter.TruckChallanId = $scope.TCId2;
                $scope.TCFooter.CommercialInvoiceId = $scope.exp_TruckChallan.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = $scope.exp_TruckChallan.TCFooter2;
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            } else {
                $scope.TCFooter.TruckChallanId = $scope.TCId2;
                $scope.TCFooter.CommercialInvoiceId = $scope.exp_TruckChallan.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = "";
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            }
            if ($scope.exp_TruckChallan.TCFooter3) {
                $scope.TCFooter.TruckChallanId = $scope.TCId3;
                $scope.TCFooter.CommercialInvoiceId = $scope.exp_TruckChallan.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = $scope.exp_TruckChallan.TCFooter3;
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            } else {
                $scope.TCFooter.TruckChallanId = $scope.TCId3;
                $scope.TCFooter.CommercialInvoiceId = $scope.exp_TruckChallan.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = "";
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            }
            if ($scope.exp_TruckChallan.TCFooter4) {
                $scope.TCFooter.TruckChallanId = $scope.TCId4;
                $scope.TCFooter.CommercialInvoiceId = $scope.exp_TruckChallan.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = $scope.exp_TruckChallan.TCFooter4;
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            } else {
                $scope.TCFooter.TruckChallanId = $scope.TCId4;
                $scope.TCFooter.CommercialInvoiceId = $scope.exp_TruckChallan.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = "";
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            }
            if ($scope.exp_TruckChallan.TCFooter5) {
                $scope.TCFooter.TruckChallanId = $scope.TCId5;
                $scope.TCFooter.CommercialInvoiceId = $scope.exp_TruckChallan.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = $scope.exp_TruckChallan.TCFooter5;
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            } else {
                $scope.TCFooter.TruckChallanId = $scope.TCId5;
                $scope.TCFooter.CommercialInvoiceId = $scope.exp_TruckChallan.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = "";
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            }
        }
        else {
            if ($scope.exp_TruckChallan.TCFooter1) {
                $scope.TCFooter.TruckChallanId = 0;
                $scope.TCFooter.CommercialInvoiceId = $scope.ddlConsCommercialInvoiceForTC.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = $scope.exp_TruckChallan.TCFooter1;
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            }
            else {
                $scope.TCFooter.TruckChallanId = 0;
                $scope.TCFooter.CommercialInvoiceId = $scope.ddlConsCommercialInvoiceForTC.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = "";
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            }
            if ($scope.exp_TruckChallan.TCFooter2) {
                $scope.TCFooter.TruckChallanId = 0;
                $scope.TCFooter.CommercialInvoiceId = $scope.ddlConsCommercialInvoiceForTC.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = $scope.exp_TruckChallan.TCFooter2;
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            } else {
                $scope.TCFooter.TruckChallanId = 0;
                $scope.TCFooter.CommercialInvoiceId = $scope.ddlConsCommercialInvoiceForTC.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = "";
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            }
            if ($scope.exp_TruckChallan.TCFooter3) {
                $scope.TCFooter.TruckChallanId = 0;
                $scope.TCFooter.CommercialInvoiceId = $scope.ddlConsCommercialInvoiceForTC.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = $scope.exp_TruckChallan.TCFooter3;
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            } else {
                $scope.TCFooter.TruckChallanId = 0;
                $scope.TCFooter.CommercialInvoiceId = $scope.ddlConsCommercialInvoiceForTC.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = "";
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            }
            if ($scope.exp_TruckChallan.TCFooter4) {
                $scope.TCFooter.TruckChallanId = 0;
                $scope.TCFooter.CommercialInvoiceId = $scope.ddlConsCommercialInvoiceForTC.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = $scope.exp_TruckChallan.TCFooter4;
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            } else {
                $scope.TCFooter.TruckChallanId = 0;
                $scope.TCFooter.CommercialInvoiceId = $scope.ddlConsCommercialInvoiceForTC.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = "";
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            }
            if ($scope.exp_TruckChallan.TCFooter5) {
                $scope.TCFooter.TruckChallanId = 0;
                $scope.TCFooter.CommercialInvoiceId = $scope.ddlConsCommercialInvoiceForTC.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = $scope.exp_TruckChallan.TCFooter5;
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            }else {
                $scope.TCFooter.TruckChallanId = 0;
                $scope.TCFooter.CommercialInvoiceId = $scope.ddlConsCommercialInvoiceForTC.CommercialInvoiceId;
                $scope.TCFooter.TruckNo = $scope.exp_TruckChallan.TruckNo;
                $scope.TCFooter.UpdatedBy = $scope.LoginUser.UserId;
                $scope.TCFooter.UpdatedDate = $scope.UpdatedDate;
                $scope.TCFooter.Footers = "";
                $scope.TCFooter.Sort = ++$scope.TCFooterSorting;
                $scope.TCInfo.push($scope.TCFooter);
                $scope.TCFooter = {};
            }
        }

        
        alertify.confirm("Are you sure to save?", function (e) {
            if (e) {
                var params = JSON.stringify({ exp_TruckChallan: $scope.TCInfo });

                $http.post('/ExpCommercialInvoice/SaveTruckChallan', params).success(function (data) {
                    if (data > 0) {
                        alertify.log(' saved successfully!', 'success', '5000');
                        clearForTC();
                        $scope.exp_TruckChallan.TruckNo = "";
                        $scope.exp_TruckChallan.TCFooter1 = "";
                        $scope.exp_TruckChallan.TCFooter2 = "";
                        $scope.exp_TruckChallan.TCFooter3 = "";
                        $scope.exp_TruckChallan.TCFooter4 = "";
                        $scope.exp_TruckChallan.TCFooter5 = "";
                        $scope.consumptionCertificateForm.$setPristine();
                        $scope.consumptionCertificateForm.$setUntouched();
                    }
                }).error(function (msg) {
                    alertify.log('Save failed, refresh page and try again', 'error', '5000');
                    clearForTC();
                    $scope.exp_TruckChallan.TruckNo = "";
                    $scope.exp_TruckChallan.TCFooter1 = "";
                    $scope.exp_TruckChallan.TCFooter2 = "";
                    $scope.exp_TruckChallan.TCFooter3 = "";
                    $scope.exp_TruckChallan.TCFooter4 = "";
                    $scope.exp_TruckChallan.TCFooter5 = "";
                    $scope.consumptionCertificateForm.$setPristine();
                    $scope.consumptionCertificateForm.$setUntouched();
                    return;
                });
            }
        })
        window.scrollTo(0, 0);
    }
    $scope.resetTruckChallanForm = function () {
        document.getElementById("btnResetForTC").disabled = true;
        setTimeout(function () {
            document.getElementById("btnResetForTC").disabled = false;
        }, 1500);
        $scope.exp_TruckChallan.TruckNo = "";
        $scope.exp_TruckChallan.TCFooter1 = "";
        $scope.exp_TruckChallan.TCFooter2 = "";
        $scope.exp_TruckChallan.TCFooter3 = "";
        $scope.exp_TruckChallan.TCFooter4 = "";
        $scope.exp_TruckChallan.TCFooter5 = "";
        clearForTC();
        $scope.consumptionCertificateForm.$setPristine();
        $scope.consumptionCertificateForm.$setUntouched();
    }
    $scope.TrackChalanBtn = function (trackChalan) {
        $window.open("#/TruckChallanReport", "popup", "width=850,height=550,left=280,top=80");
        var trackChalanObj = trackChalan.CommercialInvoiceId;
        $cookieStore.put("CommercialInvoiceId", trackChalanObj);
        event.stopPropagation();

    }; 
        // BankDocument part
    function GetAllCommercialInvoiceForBankDoc() {
        $http({
            url: '/ExpCommercialInvoice/GetAllCommercialInvoice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data) {
                angular.forEach(data, function (e) {
                    var isDate = isNaN(e.CommercialInvoiceDate);
                    if (isDate) {
                        var res1 = e.CommercialInvoiceDate.substring(0, 5);
                        if (res1 == "/Date") {
                            var parsedDate1 = new Date(parseInt(e.CommercialInvoiceDate.substr(6)));
                            var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                            e.CommercialInvoiceDate = date1;

                        }
                    }
                    if (e.IsSubmitted == true && e.DocStatus != 'New Approval Pending') {
                        $scope.CommercialInvoiceForBankDocList.push(e);
                    }
                    $scope.CommercialInvoiceForBankDocListOrginal = $scope.CommercialInvoiceForBankDocList;
                });
                GetUpdateCIForBD();
            }

        });
    }
    function GetBankdoc() {
        $http({
            url: '/BankDocument/GetAllBankDocument',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.BankDocumentDetaillist = data;
            GetUpdateCIForBD();
        });
    }

    function GetUpdateCIForBD() {
        if ($scope.BankDocumentDetaillist.length != 0 && $scope.CommercialInvoiceForBankDocList.length != 0) {
            var listToDelete = [];
            for (var i = 0; i < $scope.BankDocumentDetaillist.length; i++) {
                listToDelete.push($scope.BankDocumentDetaillist[i].CommercialInvoiceId);
            }

            $scope.CommercialInvoiceForBankDocList = $scope.CommercialInvoiceForBankDocList.filter(el => (listToDelete.indexOf(el.CommercialInvoiceId) == -1));

        } else {
            return;
        }

        
    }

    function GetBankdocName(BankDocumentId) {
        $http({
            url: '/BankDocument/GetAllBankDocumentDetail?BankDocumentId=' + BankDocumentId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.BankdocNamelist = [];
            var slNo = 1;
            angular.forEach(data, function (aData) {
                var documentName = {};
                documentName = aData;
                documentName.SlNo = slNo;
                $scope.BankdocNamelist.push(aData);
                slNo++;
            });

            $scope.BankdocNamelist = data;
            $scope.BankDocumentlist = $scope.BankdocNamelist;
        });
    }
    $scope.UpdateBankDocument = function (aBankDocumentDetail) {
        $scope.disDDLForBD = true;
        $scope.CommercialInvoiceForBankDocList = $scope.CommercialInvoiceForBankDocListOrginal;
        GetBankdocName(aBankDocumentDetail.BankDocumentId);
        $scope.BankDocument = aBankDocumentDetail;
        $scope.ddlCommercialInvoiceForBankDoc = { CommercialInvoiceId: aBankDocumentDetail.CommercialInvoiceId };
        window.scrollTo(0, 0);
    }
    $scope.UpdateDocumentName = function (aDocumentName) {
        $("#txtNameOfDocumentHidden").val(aDocumentName.NameOfDocument);
        $("#txtOriginSetHidden").val(aDocumentName.OriginSet);
        $("#txtSetsHidden").val(aDocumentName.Sets);
        $scope.BankDocumentDetail = aDocumentName;
    } 
    $scope.removeDocumentName = function (aBankDocument) {
            if (aBankDocument.BankDocumentDetailId == undefined) {
                var ind = $scope.BankDocumentlist.indexOf(aBankDocument);
                $scope.BankDocumentlist.splice(ind, 1);
                //alertify.confirm().destroy();
                return;
            }
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var ind = $scope.BankDocumentlist.indexOf(aBankDocument);
                $scope.BankDocumentlist.splice(ind, 1);
                $http.post('/BankDocument/DeleteBankDocumentName?BankDocumentDetailId=' + aBankDocument.BankDocumentDetailId).success(function (data) {
                    if (data > 0) {
                        alertify.log('Deleted Successfully!', 'success', '5000');
                    } else {
                        alertify.log('Delete Failed!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '5000');
                });
            }
        });
    };
    //Bank doc  and detail save
    $scope.SaveBankDocuments = function () {

        alertify.confirm("Are you sure to save?", function (e) {
            if (e) {
                var params = JSON.stringify({ exp_BankDocument: $scope.BankDocument, exp_BankDocumentDetail: $scope.BankDocumentlist });

                $http.post('/BankDocument/Save', params).success(function (data) {
                    if (data > 0) {
                        alertify.log(' saved successfully!', 'success', '5000');
                        clearForBD();
                        $scope.BankDocument.BankApplicationTo = "";
                        $scope.BankDocument.BankDocumentToDepartment = "";
                        $scope.BankDocument.ApplicationDate = "";
                        $scope.consumptionCertificateForm.$setPristine();
                        $scope.consumptionCertificateForm.$setUntouched();
                    }
                }).error(function (msg) {
                    alertify.log('Save failed, refresh page and try again', 'error', '5000');
                });
                window.scrollTo(0, 0);
            }
        })
    }
    $scope.AddBankDocumentDetail = function () {

        if (!$scope.BankDocumentlist.length) {
            $scope.BankDocumentDetail.SlNo = 1;
        } else {
            $scope.BankDocumentDetail.SlNo = Enumerable.From($scope.BankDocumentlist).Max('$.SlNo') + 1;
        }
        $scope.BankDocumentlist.push($scope.BankDocumentDetail);

        $scope.consumptionCertificateForm.$setPristine();
        $scope.consumptionCertificateForm.$setUntouched();
        ClearBankDocumentDetail();

    };
    function ClearBankDocumentDetail() {
        $scope.BankDocumentDetail = new Object();
    }
    $scope.ResetBankDetailForm = function () {
        document.getElementById("btnResetForBD").disabled = true;
        setTimeout(function () {
            document.getElementById("btnResetForBD").disabled = false;
        }, 1000);
        clearForBD();
        $scope.BankDocument.BankApplicationTo = "";
        $scope.BankDocument.BankDocumentToDepartment = "";
        $scope.BankDocument.ApplicationDate = "";
        $scope.consumptionCertificateForm.$setPristine();
        $scope.consumptionCertificateForm.$setUntouched();
    }
    $scope.bankDocumentBtn = function (bankDoc) {
        $window.open("#/BankReport", "popup", "width=850,height=550,left=280,top=80");
        var bankDocument = bankDoc.CommercialInvoiceId;
        $cookieStore.put("CommercialInvoiceId", bankDocument);
        event.stopPropagation();

    };
    //Report Btn List
    function showCoPisReport(coOrpi) {

        $scope.CData = {};
        $scope.CData.CommercialInvoiceId = $scope.ddlConsCommercialInvoiceForReport.CommercialInvoiceId;
        $scope.CData.CertificateType = coOrpi;
        $window.open("#/CertificateReport", "popup", "width=850,height=550,left=280,top=80");
        $cookieStore.put("CiData", $scope.CData);
        event.stopPropagation();
    }
    $scope.CofOriginDdl = function () {
        showCoPisReport('co');
    };
    $scope.CertificateOfPreInspectionBtn = function () {
        showCoPisReport('pi')
    };
    $scope.BinificaryCertificateBtn = function (binificaryCertificate) {
        $window.open("#/BeneficiaryCertificateReport", "popup", "width=850,height=550,left=280,top=80");
        var binificaryObj = binificaryCertificate.CommercialInvoiceId;
        $cookieStore.put("CommercialInvoiceId", binificaryObj);
        event.stopPropagation();

    };
    $scope.ConsuptionCertificateBtn = function (consuptionCertificate) {
        $window.open("#/ConsumptionCertificateReport", "popup", "width=850,height=550,left=280,top=80");
        var consuptionObj = consuptionCertificate.CommercialInvoiceId;
        $cookieStore.put("CommercialInvoiceId", consuptionObj);
        event.stopPropagation();

    };
    $scope.BillOfExchangeCertificateBtn = function (billOfExchange) {
        $window.open("#/BillOfExchangeReport", "popup", "width=850,height=550,left=280,top=80");
        var billOfExc = billOfExchange.CommercialInvoiceId;
        $cookieStore.put("CommercialInvoiceId", billOfExc);
        event.stopPropagation();

    };
    $scope.BillOfExchange2CertificateBtn = function (billOfExchange) {
        $window.open("#/BillOfExchangeReport2", "popup", "width=850,height=550,left=280,top=80");
        var billOfExc = billOfExchange.CommercialInvoiceId;
        $cookieStore.put("CommercialInvoiceId", billOfExc);
        event.stopPropagation();

    };
    $scope.DeliveryChalanTwoBtn = function (delChalanTwo) {
        $window.open("#/DeliveryChallanReport", "popup", "width=850,height=550,left=280,top=80");
        var deliveryChalanTwo = delChalanTwo.CommercialInvoiceId;
        $cookieStore.put("CommercialInvoiceId", deliveryChalanTwo);
        event.stopPropagation();

    };
    $scope.PackingListBtn = function (packingList) {
        $window.open("#/PackingReport", "popup", "width=850,height=550,left=280,top=80");
        var packingListObj = packingList.CommercialInvoiceId;
        $cookieStore.put("CommercialInvoiceId", packingListObj);
        event.stopPropagation();

    };
    $scope.PackingDocumentReportBtn = function (PackingDocument) {
        $window.open("#/PackingDocumentReport", "popup", "width=850,height=550,left=280,top=80");
        var PackingDocumentObj = PackingDocument.CommercialInvoiceId;
        $cookieStore.put("CommercialInvoiceId", PackingDocumentObj);
        event.stopPropagation();

    };
    $scope.OpenReportsForConsumptionCertificate = function (CommercialInvoiceId) {
        $window.open("#/ConsumptionCertificateReport", "popup", "width=850,height=550,left=280,top=80");

        $cookieStore.put("CommercialInvoiceId", CommercialInvoiceId);
        event.stopPropagation();

    };



    ///============Abir Start =======================>>>>>

    $scope.GetDescriptionOfGoods = function (CiId) {
        $http({
            url: '/CertificateOfOrigin/GetDescriptionOfGoods?ciId=' + CiId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ExportGoodslist = data;
        });
    }
    $scope.GetDescriptionOfGoodsUpdate = function (ConsumptionCertificateId) {
        $http({
            url: '/CertificateOfOrigin/GetDescriptionOfGoodsUpdate?ConsumptionCertificateId=' + ConsumptionCertificateId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ExportGoodslist = data;
            console.log('All Description List', $scope.ExportGoodslist);
        });
    }

    $scope.ConsumptionCertificateBtn = function (CiId) {
        $http({
            url: '/CertificateOfOrigin/ConsuptionCertificate?CommercialInvoiceId=' + CiId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                angular.forEach(data, function (adata) {
                    var res1 = adata.StatementDate.substring(0, 5);
                    var res2 = adata.EpzPermissionDate.substring(0, 5);
                    var res3 = adata.BillOfEntryDate.substring(0, 5);
                    if (res1 == "/Date" || res2 == "/Date" || res3 == "/Date") {
                        var parseDate1 = new Date(parseInt(adata.StatementDate.substr(6)));
                        var parseDate2 = new Date(parseInt(adata.EpzPermissionDate.substr(6)));
                        var parseDate3 = new Date(parseInt(adata.BillOfEntryDate.substr(6)));
                        var date1 = ($filter('date')(parseDate1, 'dd/MM/yyyy')).toString();
                        var date2 = ($filter('date')(parseDate2, 'dd/MM/yyyy')).toString();
                        var date3 = ($filter('date')(parseDate3, 'dd/MM/yyyy')).toString();
                        adata.StatementDate = date1;
                        adata.EpzPermissionDate = date2;
                        adata.BillOfEntryDate = date3;
                    }
                });
            }
            var Certificate = Enumerable.From(data).FirstOrDefault();
            $scope.ConsumptionCertificate = Certificate;

        });
    }
    $scope.GetRawMetrialUpdateBtn = function (CiId) {

        $http({
            url: '/CertificateOfOrigin/ConsuptionCertificateRawMatrial?CommercialInvoiceId=' + CiId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.RawMateriallist = data;

        });
    }

    $scope.RawMatrialSRemove = function (rawMatrialId) {

        for (var i = 0; i < $scope.RawMateriallist.length; i++) {
            if ($scope.RawMateriallist[i].ConsumptionCertificateRawMaterialsId == undefined) {
                var ind = $scope.RawMateriallist.indexOf(rawMatrialId);
                $scope.RawMateriallist.splice(ind, 1);
                alertify.confirm().destroy();
                return;
            }
        }
        alertify.confirm("This Data Will Be Remove?", function (e) {
            if (e) {
                var ind = $scope.RawMateriallist.indexOf(rawMatrialId);
                $scope.RawMateriallist.splice(ind, 1);
                $http({
                    url: "/CertificateOfOrigin/ConsumptionCertificateRawMatrialDelete?ConsumptionCertificateRawMatrialId=" + rawMatrialId,
                    method: "GET",
                }).success(function (data) {
                    if (data > 0) {
                        alertify.log('Deleted Successfully!', 'success');
                    } else {
                        alertify.log('Delete Failed!', 'error', '5000');
                    }
                });

            }

        });

    }

    $scope.SaveConsumptionCertificate = function () {

        var type;
        var errorMsg = [];

        if ($scope.RawMateriallist.length < 1) {
            alertify.log('At least one Raw Material list is required with default!', 'error', '5000');
            return;
        }

        $scope.ddlConsumptionCertificate.CommercialInvoiceId;

        if ($scope.ConsumptionCertificate.StatementDate != null) {
            var txtPoDate = $("#txtStatementDate").val()
            $scope.ConsumptionCertificate.StatementDate = txtPoDate.split("/").reverse().join("-");
        }

        if ($scope.ConsumptionCertificate.BillOfEntryDate != null) {
            var txtPoDate = $("#txtBillOfEntryDate").val()
            $scope.ConsumptionCertificate.BillOfEntryDate = txtPoDate.split("/").reverse().join("-");
        }
        if ($scope.ConsumptionCertificate.EpzPermissionDate != null) {
            var txtPoDate = $("#txtEpzPermissionDate").val()
            $scope.ConsumptionCertificate.EpzPermissionDate = txtPoDate.split("/").reverse().join("-");
        }

        if (!errorMsg.length) {
            alertify.confirm("Are you sure to save?", function (e) {
                if (e) {
                    var params = JSON.stringify({ exp_ConsumptionCertificate: $scope.ConsumptionCertificate, _exp_ConsumptionCertificateDescription: $scope.ExportGoodslist, exp_ConsumptionCertificateRawMaterials: $scope.RawMateriallist });

                    $http.post('/CertificateOfOrigin/SaveCc', params).success(function (aData) {
                        if (aData > 0) {
                            alertify.log(' saved successfully!', 'success', '5000');
                            ClearForCC();
                            $scope.consumptionCertificateForm.$setPristine();
                            $scope.consumptionCertificateForm.$setUntouched();
                            document.getElementById("ddlConsCommercialInvoiceDisabled").disabled = false;
                        }

                    }).error(function (msg) {
                        alertify.log('Save failed, refresh page and try again', 'error', '5000');
                    });
                }
            });
        }

        else {
            alertify.log(errorMsg[0].msg, 'error', '5000');
            $scope.consumptionCertificateForm.$setPristine();
            $scope.consumptionCertificateForm.$setUntouched();
        }
    }


    function ClearRawMaterials() {
        $scope.RawMaterial = {};
        $scope.RawMaterial.ImportBondNo = " (Raw Materials)";
        $scope.rawMatrialBtn = "Add";
        $scope.rawMatrialRemoveBtn = "Remove";
    }

    $scope.UpdateConsumptionCertificateDetails = function (aConsumptionCertificate) {
        $scope.consuptionCertificateForddl = $scope.consuptionCertificateForTableOrginal;
        $scope.ddlConsumptionCertificate = { CommercialInvoiceId: aConsumptionCertificate.CommercialInvoiceId };
        $scope.ConsumptionCertificate = aConsumptionCertificate;

        document.getElementById("ddlConsCommercialInvoiceDisabled").disabled = true;


        var res = aConsumptionCertificate.StatementDate.substring(0, 5);
        if (res == "/Date") {
            var parsedDate = new Date(parseInt($scope.ConsumptionCertificate.StatementDate.substr(6)));
            $scope.ConsumptionCertificate.StatementDate = $filter('date')(parsedDate, 'MMM dd, yyyy');

        }
        var res1 = aConsumptionCertificate.BillOfEntryDate.substring(0, 5);
        if (res1 == "/Date") {
            var parsedDate = new Date(parseInt($scope.ConsumptionCertificate.BillOfEntryDate.substr(6)));
            $scope.ConsumptionCertificate.BillOfEntryDate = $filter('date')(parsedDate, 'MMM dd, yyyy');
        }
        var res2 = aConsumptionCertificate.EpzPermissionDate.substring(0, 5);
        if (res2 == "/Date") {
            var parsedDate = new Date(parseInt($scope.ConsumptionCertificate.EpzPermissionDate.substr(6)));
            $scope.ConsumptionCertificate.EpzPermissionDate = $filter('date')(parsedDate, 'MMM dd, yyyy');
        }


    }

    $scope.AddRawMaterials = function () {

        if (!$scope.RawMateriallist.length) {
            $scope.RawMaterial.SlNo = 1;
        } else {
            $scope.RawMaterial.SlNo = Enumerable.From($scope.RawMateriallist).Max('$.SlNo') + 1;
        }
        $scope.RawMateriallist.push($scope.RawMaterial);
        $scope.consumptionCertificateForm.$setPristine();
        $scope.consumptionCertificateForm.$setUntouched();
        ClearRawMaterials();


    };

    function GetConsumptionCertificateForDrop() {
        $http({
            url: '/ExpCommercialInvoice/GetAllCommercialInvoice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data) {
                angular.forEach(data, function (e) {
                    var isDate = isNaN(e.CommercialInvoiceDate);
                    if (isDate) {
                        var res1 = e.CommercialInvoiceDate.substring(0, 5);
                        if (res1 == "/Date") {
                            var parsedDate1 = new Date(parseInt(e.CommercialInvoiceDate.substr(6)));
                            var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                            e.CommercialInvoiceDate = date1;

                        }
                    }
                    if (e.IsSubmitted == true && e.DocStatus != 'New Approval Pending') {

                        $scope.consuptionCertificateForTable.push(e);

                    }
                });
                $scope.consuptionCertificateForTableOrginal = $scope.consuptionCertificateForTable;
                CCCombine();
            }


        });
    }
    $scope.reloadBtnCC = function () {
        $('#txtFromDateForCC').val('');
        $('#txtToDateForCC').val('');
        $('#textInvoiceNoAndCompanyCC').val('');
        $scope.FromDate = "";
        $scope.ToDate = "";
        $scope.SearchInvoiceAndCompanyNameCC = null;
        GetAllConsumptionCertificatePaged(1);
    }

    $scope.getCCData = function (curPage) {

        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetAllConsumptionCertificatePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetAllConsumptionCertificatePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetAllConsumptionCertificatePaged($scope.currentPage);
        }


    }


    $scope.ConsumptionCertificateSearch = function () {
        GetAllConsumptionCertificatePaged(1);

    }

    function GetAllConsumptionCertificate() {
            $http({
            url: '/CertificateOfOrigin/GetDynamic?whereCondition=1=1&orderByExpression=ConsumptionCertificateId',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ConsumptionCertificateList = data;
            CCCombine();
        });
    }

    
    function CCCombine() {
        if ($scope.ConsumptionCertificateList.length == 0) {
            $scope.consuptionCertificateForddl = $scope.consuptionCertificateForTableOrginal;
            return;
        }
        if ($scope.ConsumptionCertificateList.length != 0 && $scope.consuptionCertificateForTable.length != 0) {
            var listToDelete = [];
            for (var i = 0; i < $scope.ConsumptionCertificateList.length; i++) {
                listToDelete.push($scope.ConsumptionCertificateList[i].CommercialInvoiceId);
            }
            $scope.consuptionCertificateForddl = $scope.consuptionCertificateForTable.filter(el => (listToDelete.indexOf(el.CommercialInvoiceId) == -1));
        }
        else {
            return;
        }

    }

    $scope.ResetCommercialOrders = function () {
        ClearForCC();
        document.getElementById("ResetCommercialOrdersBtn").disabled = true;
        setTimeout(function () {

            document.getElementById("ResetCommercialOrdersBtn").disabled = false;
        }, 1500);
        $scope.consumptionCertificateForm.$setPristine();
        $scope.consumptionCertificateForm.$setUntouched();
    }

    $scope.raMatrialSubstraction = function () {
        $scope.RawMaterial.ClosingBalance = parseFloat($scope.RawMaterial.PreviousBalance - $scope.RawMaterial.ExportQty).toFixed(2);
    }
    ///<<<=======Abir End======================>>>>


  
   



});