app.controller("ReviseSalesOrderEntryController", function ($scope, $cookieStore, $http, $window, $filter) {

    $scope.LoginUser = $cookieStore.get('UserData');

    Clear();

    //#region function region
    function Clear() {
        $scope.POReference = {};
        $scope.POReferencelist = [];

        $scope.found = false;
        $scope.HsCodeList = [];
        $scope.ItemSearchList = [];
        $scope.pos_SaleOrderBillDetaillst = [];
        $scope.pos_SalesOrderDetailAdAttributeLst = [];
        $scope.prictTypeList = [];
        $scope.pos_SalesOrderDetai = 0;
        $scope.SalesOrderTypeList = ["Local", "Export"];
        $scope.CurrencyList = ["BDT", "USD"];
        $scope.CompanyListSearch = [];
        $scope.SalesOrderList = [];
        $scope.SalesOrderType = null;
        $scope.CurrencyType = null,
        $scope.ddlPreparedBy = null;
        $scope.ddlCompany = null;
        $scope.company = {}; 
        $scope.ddlCompanySearch = null;
        $scope.ddlPriceTypeBy = null;
        $scope.salesOrder = {};
        $scope.pos_SalesOrderDetail = {};
        $scope.salesOrder.SalesOrderId = 0;
        $scope.AddProductLbl = 'Add';
        $scope.AddOverHeadLbl = 'Add OverHead';
        $scope.btnSave = 'Save';
        $scope.OrderNoSearch = null;
        GetUsersPermissionDetails();
        //ScreenLock();
        GetAllEmployee();
        GetActiveCompany();
        GetAllPriceType();
        GetAllVariety();
        GetAllItemUnit();
        GetHsCode();
        GetAllItem();
        GetByCombinationand();
        $scope.UserData = $cookieStore.get('UserData');
        $scope.salesOrder.PreparedById = $scope.UserData.EmployeeId;


          

        //$scope.FromDate = $filter('date')(new Date().toJSON().slice(0, 10), 'yyyy-MM-dd');
        //$scope.ToDate = $filter('date')(new Date().toJSON().slice(0, 10), 'yyyy-MM-dd');


        $scope.salesOrder.SalesOrderDate = $filter('date')(new Date().toJSON().slice(0, 10), 'MMM dd, yyyy');
        GetSalerOrderNo();
        $scope.pos_SalesOrderDetail.DueDate = "";
        $scope.pos_SalesOrderDetail.DueDate = $filter('date')(new Date().toJSON().slice(0, 10), 'MMM dd, yyyy');



        $scope.Mood = "Revise";
        $scope.disblePo = false;
        $scope.btnPackageWeight = "Roll Weight";
        $scope.btnPackagePerContainer = "Package Per Container";
        $scope.btnContainerWeight = "Carton Weight";
        $scope.btnContainerSize = "Carton Size";
        GetAllCategory();
        GetAllSubCategory();
        ClearItem();
        ClearCompany();

    }

    function ClearItem() {
        $scope.ad_Item = {};
        $scope.ad_Item.ItemId = 0;
        $scope.ad_Item.ContainerSize = "";
        $scope.ad_Item.UnitPerPackage = 1;
        $scope.ddlCategory = null;
        $scope.ddlSubCategory = null;
        $scope.ItemMainlist = [];
        $scope.AllItemSearch = [];
        $scope.FirstAttributeList = [];
        $scope.ItemSelected = false;
        GetByCombinationValue();
    }
    $scope.ListClear = function () {
        $scope.pos_SalesOrderDetail = {};
        $scope.ItemSearchCombination = null;
        $scope.pos_SalesOrderDetail.DueDate = "";
        $scope.HSCode = "";
        $scope.pos_SalesOrderDetail.DueDate = $filter('date')(new Date().toJSON().slice(0, 10), 'MMM dd, yyyy');
        $('#SearchTextBox').focus();
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
    function GetAllCategory() {
        $http({
            url: '/Category/GetAllCategory',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CategoryList = data;
        });
    }

    $("#txtFromDateForSO").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.FormDateChangeForSO = function () {
        $("#txtFromDateForSO").focus();
        $("#txtFromDateForSO").trigger("click");
    }


    $("#txtToDateForSO").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.ToDateChangeForSO = function () {
        $("#txtToDateForSO").focus();
        $("#txtToDateForSO").trigger("click");
    }




    $("#txtDueDate").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.CalendartxtDueDate = function () {
        $("#txtDueDate").focus();
        $("#txtDueDate").trigger("click");
    }


    $("#txtInvoiceDueDate").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.CalendartxtInvoiceDueDate = function () {
        $("#txtInvoiceDueDate").focus();
        $("#txtInvoiceDueDate").trigger("click");
    }

    $("#txtSalesOrderDate").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.CalendartxtSalesOrderDate = function () {
        $("#txtSalesOrderDate").focus();
        $("#txtSalesOrderDate").trigger("click");
    }


    $("#txtPoDate").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.CalendartxttxtPoDate = function () {
        $("#txtPoDate").focus();
        $("#txtPoDate").trigger("click");
    }

    $("#txtPO_Date").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.CalendartxtPO_Date = function () {
        $("#txtPO_Date").focus();
        $("#txtPO_Date").trigger("click");
    }


    function GetAllSubCategory() {
        $http({
            url: '/Subcategory/GetAllSubategory',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.SubcategoryList = data;
        });
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

    function SetDeliveryQunatity(aSOrederListDetailAdAttribute) {
        var totalQty = Enumerable.From($scope.pos_SalesOrderDetailAdAttributeLst).Where('$.ItemId==' + aSOrederListDetailAdAttribute.ItemId).Sum('$.OrderQty');

        var deliveryQty = Enumerable.From($scope.pos_SaleOrderBillDetaillst)
            .Where('$.ItemId==' + aSOrederListDetailAdAttribute.ItemId).FirstOrDefault();

        deliveryQty.OrderQuantity = totalQty;
    }

    function GetAllVariety() {
        $http({
            url: "/Item/GetLimitedProperty",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.VarietyList = data;
        });
    }
    //#endregion
    function GetSalerOrderNo() {
        if ($scope.salesOrder.SalesOrderId == 0) {
            // var date = $("#txtSalesOrderDate").val();
            if ($scope.salesOrder.SalesOrderDate != "") {
                var dateParts = ($filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy')).split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
                $http({
                    url: '/SalesOrder/GetSalesOrderNo?SalesOrderDate=' + from,
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    $scope.salesOrder.SalesOrderNo = data;
                });
            } else {
                $("#txtSalesOrderDate").focus();
            }
        }
        else {
            var currentDate = $scope.salesOrder.CurrentSalesOrderDate.split("/");
            var currentFiscalYrRange = Number(currentDate[1]) > 6 ? (currentDate[2] + '-' + (Number(currentDate[2]) + 1)) : ((currentDate[2] - 1) + '-' + currentDate[2]);

            var changedDate = $("#txtSalesOrderDate").val().split("/");
            var changedFiscalYrRange = Number(changedDate[1]) > 6 ? (changedDate[2] + '-' + (Number(changedDate[2]) + 1)) : ((changedDate[2] - 1) + '-' + changedDate[2]);

            if (currentFiscalYrRange != changedFiscalYrRange) {
                alertify.log('Cannot change Fiscal Year from ' + currentFiscalYrRange + ' to ' + changedFiscalYrRange, 'error', '5000');
                $("#txtSalesOrderDate").val($scope.salesOrder.CurrentSalesOrderDate);
            }
        }
    }

    function GetAllPriceType() {
        $http({
            url: '/PriceType/GetAllPriceType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.prictTypeList = data;

            angular.forEach($scope.prictTypeList,
                function (aActivePriceType) {
                    if (aActivePriceType.IsDefault == true) {
                        $scope.salesOrder.PriceTypeId = aActivePriceType.PriceTypeId;
                        $scope.ddlPriceTypeBy = { PriceTypeId: aActivePriceType.PriceTypeId }
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
        }).success(function (companyList) {
            $scope.companyList = companyList;
            $scope.CompanyListSearch = angular.copy(companyList);
        })
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

    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('SalesOrderScreenId');
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
            });
        });
    }

    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.employeeList = data;
            $scope.EmployeeListForAdd = angular.copy(data);
            $scope.ddlEmployeeRef = { "EmployeeId": $scope.UserData.EmployeeId };
        });
    }

    function SaveOrder(status) {
        $scope.UserId = $scope.LoginUser.UserId;
        $scope.salesOrder.CreatorId = $scope.UserId;
        $scope.salesOrder.UpdatorId = $scope.UserId;
        var erroMsg = [];
        if (!erroMsg.length) {

            //var from = $("#txtSalesOrderDate").val();
            //$scope.salesOrder.SalesOrderDate = from.split("/").reverse().join("-");
            //var iDD = $("#txtInvoiceDueDate").val();
            //$scope.salesOrder.InvoiceDueDate = iDD.split("/").reverse().join("-");

            //if ($scope.salesOrder.PODate != null) {
            //    var txtPoDate = $("#txtPoDate").val()
            //    $scope.salesOrder.PODate = txtPoDate.split("/").reverse().join("-");
            //}
            var IsAmendment = true;
            $scope.salesOrder.IsAmendment = IsAmendment;
            //$scope.salesOrder.CreateDate = null;
            //$scope.salesOrder.UpdateDate = null; 
            //var res1 = $scope.salesOrder.CurrentSalesOrderDate.substring(0, 5);
            //if (res1 == "/Date") {
            //    var parsedDate1 = new Date(parseInt($scope.salesOrder.CurrentSalesOrderDate.substr(6)));
            //    var date1 = ($filter("date")(parsedDate1, "yyyy-MM-dd")).toString();
            //    $scope.salesOrder.CurrentSalesOrderDate = date1;
            //}
            //if ($scope.salesOrder.CreateDate != null) {
            //    var res2 = $scope.salesOrder.CreateDate.substring(0, 5);
            //if (res2 == "/Date") {
            //    var parsedDate2 = new Date(parseInt($scope.salesOrder.CreateDate.substr(6)));
            //    var date2 = ($filter("date")(parsedDate2, "yyyy-MM-dd")).toString();
            //    $scope.salesOrder.CreateDate = date2;
            //}
            //}
            

            var parms = JSON.stringify({ salesOrder: $scope.salesOrder, pos_SaleOrderBillDetaillst: $scope.pos_SalesOrderDetailAdAttributeLst, POReferencelist: $scope.POReferencelist });

            $http.post('/SalesOrder/Save', parms).success(function (data) {
                if (data > 0) {
                    alertify.log('Sales Order ' + status + ' Successfully!', 'success', '5000');
                    $window.open("/ErpReports/RV_Pos_SalesOrderBySalesOrderId.aspx?SalesOrderId=" + data, "_blank", "width=790,height=630,left=340,top=25");

                    Clear();
                    $scope.reviseSalesOrderForm.$setPristine();
                    $scope.reviseSalesOrderForm.$setUntouched();


                } else {
                    alertify.log('Server Errors!', 'error', '5000');
                }
            }).error(function (data) {
                alertify.log('Server Errors!', 'error', '5000');
            });
        }

        else {
            alertify.log(erroMsg[0].msg, 'error', '5000');
        }

    }

    //Report Button
    $scope.OpenReport = function (salesOrderNo) {
        $window.open("/ErpReports/RV_Pos_SalesOrderBySalesOrderId.aspx?SalesOrderId=" + salesOrderNo, "_blank", "width=790,height=630,left=340,top=25");
        event.stopPropagation();
    }
    function GetByCombinationand() {
        $http({
            url: '/Item/GetCombinationWithPrice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AllCombinationlist = JSON.parse(data);
        })
    }

    function GetUnitNameById(id) {
        var UnitName = '';
        angular.forEach($scope.ItemUnitlist, function (aUnit) {
            if (aUnit.ItemUnitId == id) { UnitName = aUnit.UnitName; }
        });
        return UnitName;
    }

    function GetAllCompanyType() {
        var criteria = " [IsActive]=1";
        $http({
            url: '/Company/GetCompanyType?searchCriteria=' + criteria + '&orderBy=CompanyTypeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CompanyTypeList = data;
        });
    }
    //Company Entry Start Form Here.
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
                alertify.log("Company Details Updated Successfully.", "success", "5000");
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
    $scope.GetEmpId = function () {
        GetEmpId();
        
    }
    function GetEmpId() {
        var val = $('#CompanySearchInput').val()
        var xyz = $('#CompanySearch option').filter(function () {
            return this.value == val;
        }).data('xyz');


        $scope.CompanyId = xyz;

        $scope.ddlCompany = Enumerable.From($scope.companyList).Where('$.CompanyId==' + $scope.CompanyId).FirstOrDefault();
    }

    $scope.GetEmployeeByCompany = function () {
        if ($scope.ddlCompany == undefined) {
            return;
        }
        var refEmpId = $scope.ddlCompany.RefEmployeeId;
        var refEmployee = Enumerable.From($scope.employeeList).Where('$.EmployeeId==' + refEmpId).FirstOrDefault();
        $scope.ddlPreparedBy = { EmployeeId: refEmployee.EmployeeId };
    }
    $scope.GetCompanyAddress = function () {
        if (!angular.isUndefined($scope.ddlCompany) && $scope.ddlCompany != null) {
            $scope.salesOrder.CompanyNameOnBill = $scope.ddlCompany.CompanyName;

            $http({
                url: '/Company/GetCompanyAddressByCompanyId',
                method: "GET",
                params: { companyId: $scope.ddlCompany.CompanyId },
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                angular.forEach(data, function (aData) {
                    if (aData.IsDefault && aData.AddressType === 'Billing') {
                        $scope.salesOrder.BillingAddress = aData.Address;
                    }
                });
            });

        } else {
            $scope.salesOrder.CompanyNameOnBill = null;
            $scope.salesOrder.BillingAddress = null;
        }
    }
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
    };
    $scope.LoadCompanyDetails = function () {
        $('#companyModal').modal('show');
        ClearCompany();
    }
    $scope.AddItem = function () {
        $('#itemModal').modal('show'); 
    }
    //Address Add, Edit, Delete starts from here
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

    $scope.CheckDuplicateCompanyCode = function () {
        var criteria = " [CompanyCode]='" + $scope.ad_Company.CompanyCode + "'";
        if ($scope.ad_Company.CompanyId > 0) {
            criteria += " AND CompanyId<>" + $scope.ad_Company.CompanyId;
        }

        $http({
            url: '/Company/GetCompanyDynamic?searchCriteria=' + criteria + '&orderBy=CompanyId',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                $scope.duplicateCompCode = true;
                alertify.log('Code "' + $scope.ad_Company.CompanyCode + '" No. already exists!', 'already', '5000');
                $('#txtCompanyCode').focus();
            } else {
                $scope.duplicateCompCode = false;
            }
        });
    }

    $scope.AddCompany = function (companyModal) {
        if ($scope.companyAddresslist.length < 1) {
            alertify.log('At least one address is required with default!', 'error', '5000');
            return;
        }

        var hasDefaultAddress = Enumerable.From($scope.companyAddresslist).Where('$.IsDefault').FirstOrDefault();
        if (hasDefaultAddress == null || angular.isUndefined(hasDefaultAddress)) {
            alertify.log('One default address is required!', 'error', '5000');
            return;
        }
        $scope.ad_Company.CreatorId = $scope.LoginUser.UserId;
        $scope.ad_Company.UpdatorId = $scope.LoginUser.UserId;
        $scope.ad_Company.RefEmployeeId = $scope.ddlEmployeeRef.EmployeeId;
        $scope.ad_Company.CompanyTypeId = $scope.ddlCompanyType.CompanyTypeId;
        alertify.confirm("Are you sure to Save?", function (e) {
            if (e) {
                SaveCompany(companyModal);
            }
        });


    }

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

    $scope.CheckDefault = function (defaultAdd) {
        if (defaultAdd) {
            angular.forEach($scope.companyAddresslist, function (address) {
                if ($scope.ad_CompanyAddress.AddressType == 'Mailing') {
                    if (address.Status == 'Yes' && address.AddressType == 'Mailing') {
                        alertify.log('One Default Mailing Address Accepted!', 'error', '5000');
                        $scope.ad_CompanyAddress.IsDefault = false;
                        return;
                    }
                }
                if ($scope.ad_CompanyAddress.AddressType == 'Billing') {
                    if (address.Status == 'Yes' && address.AddressType == 'Billing') {
                        alertify.log('One Default Billing Address Accepted!', 'error', '5000');
                        $scope.ad_CompanyAddress.IsDefault = false;
                        return;
                    }
                }
            });
        }
    };

    $scope.SelCompanyAddress = function (customerAddress) {
        $("#tbxCompanyAddressHidden").val(customerAddress.Address);
        $scope.ad_CompanyAddress = customerAddress;
        $scope.buttonComAddress = "Update";
    };

    $scope.removeAddress = function (aCompanyAddress) {
        var ind = $scope.companyAddresslist.indexOf(aCompanyAddress);
        $scope.companyAddresslist.splice(ind, 1);
        ClearCompanyAddress();
    }
    //Bill Policy Add, Edit, Delete starts from here
    $scope.AddCompanyBillPolicy = function () {

        if ($scope.buttonBillPolicy == "Add") {

            if (!$scope.companyBillPolicylist.length) {
                $scope.ad_CompanyBillPolicy.SlNo = 1;
            } else {
                $scope.ad_CompanyBillPolicy.SlNo = Enumerable.From($scope.companyBillPolicylist).Max('$.SlNo') + 1;
            }
            var checkPolicy = Enumerable.From($scope.companyBillPolicylist).Where('$.PolicyDescription =="' + $scope.ad_CompanyBillPolicy.PolicyDescription + '"').FirstOrDefault();
            if (checkPolicy != null || !angular.isUndefined(checkPolicy)) {
                alertify.log('Bill Policy <b style="color:yellow">' + $scope.ad_CompanyBillPolicy.PolicyDescription + '</b> Already Added!', 'error', '5000');
                $("#tbxPolicy").focus();
                return;
            }
            $scope.companyBillPolicylist.push($scope.ad_CompanyBillPolicy);

            $scope.companyEntryForm.$setPristine();
            $scope.companyEntryForm.$setUntouched();
        } else {
            var checkUpdateBPolicy = Enumerable.From($scope.companyBillPolicylist).Where('$.PolicyDescription =="' + $scope.ad_CompanyBillPolicy.PolicyDescription + '" && $.SlNo!=' + $scope.ad_CompanyBillPolicy.SlNo).FirstOrDefault();
            var updateBillPolicy = Enumerable.From($scope.companyBillPolicylist).Where('$.SlNo==' + $scope.ad_CompanyBillPolicy.SlNo).FirstOrDefault();
            if (checkUpdateBPolicy == null || angular.isUndefined(checkUpdateBPolicy)) {
                updateBillPolicy.PolicyDescription = $scope.ad_CompanyBillPolicy.PolicyDescription;
            } else {
                updateBillPolicy.PolicyDescription = $("#tbxPolicyHidden").val();
                alertify.log('Bill Policy <b style="color:yellow">' + checkUpdateBPolicy.PolicyDescription + '</b> Already Added!', 'error', '5000');
                $("#tbxPolicy").focus();
            }
        }
        $("#tbxPolicyHidden").val("");
        ClearCompanyBillPolicy();

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
    }
    //End Company Address 
    $scope.getMaxSalesOrderByDate = function () {
        GetSalerOrderNo();
    }
    //$scope.changePoDate = function () {
    //    if ($scope.salesOrder.IsNonSO) {
    //        $('#ReferenceNo').val('');
    //        $('#txtPoDate').val('');
    //        $scope.disblePo = true;

    //        $scope.salesOrder.ReferenceNo = "";
    //        $scope.salesOrder.PODate = "";
    //    }
    //    else {
    //        $scope.disblePo = false;
    //    }
    //}
    $scope.SaveSalesOrder = function () {
        SaveSalesOrder();
    }
    function SaveSalesOrder() {
        //if ($scope.salesOrder.IsNonSO) {
        //    if ($scope.salesOrder.Remarks === undefined || $scope.salesOrder.Remarks == null || $scope.salesOrder.Remarks == '') {
        //        alertify.log('Type Your Remarks', 'error', '5000');
        //        $('#Remarks').focus();
        //        return;
        //    }
        //    if ($scope.salesOrder.PODate === undefined || $scope.salesOrder.PODate == null || $scope.salesOrder.PODate == '') {
        //        $scope.salesOrder.PODate = null;
        //    }
        //}
        //else {
        //    if ($scope.salesOrder.ReferenceNo === undefined || $scope.salesOrder.ReferenceNo == null || $scope.salesOrder.ReferenceNo == '') {
        //        alertify.log('Type P.O No', 'error', '5000');
        //        $('#ReferenceNo').focus();
        //        return;
        //    }
        //    if ($scope.salesOrder.PODate === undefined || $scope.salesOrder.PODate == null || $scope.salesOrder.PODate == '') {
        //        alertify.log('Enter P.O Date', 'error', '5000');
        //        $('#txtPoDate').focus();
        //        return;
        //    }
        //}

        angular.forEach($scope.pos_SalesOrderDetailAdAttributeLst, function (aSO) {
            if (isNaN(parseFloat(aSO.OrderPrice)) || !isFinite(aSO.OrderPrice)) {
                alertify.log('Enter correct price for ' + aSO.Combination, 'error', '5000');
                return;
            }
        })

        var criteria = "SO.SalesOrderNo='" + $scope.salesOrder.SalesOrderNo + "'";
        if ($scope.salesOrder.SalesOrderId > 0) {
            criteria += " AND SO.SalesOrderId<>" + $scope.salesOrder.SalesOrderId;
        }

        $http({
            url: '/SalesOrder/GetSalesOrderDynamic?searchCriteria=' + criteria + '&orderBy=SO.SalesOrderNo',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log('Sales Order No: ' + $scope.salesOrder.SalesOrderNo + ' already exists!', 'already', '5000');
            } else {
                GetEmpId();
                $scope.salesOrder.CompanyId = $scope.ddlCompany.CompanyId;
                $scope.salesOrder.PriceTypeId = $scope.ddlPriceTypeBy.PriceTypeId;
                $scope.salesOrder.PreparedById = $scope.ddlPreparedBy.EmployeeId;
                $scope.salesOrder.RefEmployeeId = $scope.ddlPreparedBy.EmployeeId;
                if ($scope.CreatePermission) {
                    if ($scope.salesOrder.SalesOrderId == 0) {
                        alertify.confirm("Are you sure to save?", function (e) {
                            if (e) {
                                SaveOrder('Saved');
                            }
                        })
                    }
                    else {
                        alertify.confirm("Are you sure to revise?", function (e) {
                            if (e) {
                                SaveOrder('Revised');
                            }
                        })
                    }
                }
                else {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
            }
        });
    }

    $scope.ItemSearchCombinationTextChange = function () {
        if ($scope.ItemSearchCombination != undefined && $scope.ItemSearchCombination != null && $scope.ItemSearchCombination != "") {
            var SingleSearchItem = $scope.ItemSearchCombination.split(" ");
            var SearchCriteria = "";
            myHilitor = new Hilitor2("SearchResults");
            myHilitor.remove();
            for (var i = 0; i < SingleSearchItem.length; i++) {
                myHilitor.setMatchType("open");
                if (SearchCriteria == "") {
                    SearchCriteria = "~($.Combination).toUpperCase().indexOf('" + SingleSearchItem[i] + "'.toUpperCase())";
                } else {
                    SearchCriteria += " && ~($.Combination).toUpperCase().indexOf('" + SingleSearchItem[i] + "'.toUpperCase())";
                }

                myHilitor.apply(SingleSearchItem[i]);
            }

            $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).Where(SearchCriteria).Take(10).ToArray();
            $scope.VisibilityOfSuggession = true;
        }
        else {
            $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).Take(10).ToArray();
            $scope.VisibilityOfSuggession = false;
        }
    }

    $scope.LoadACombination = function (aCombination) {
        $scope.pos_SalesOrderDetail = aCombination;
        $scope.pos_SalesOrderDetail.DueDate = "";
        $scope.pos_SalesOrderDetail.DueDate = $filter('date')(new Date().toJSON().slice(0, 10), 'MMM dd, yyyy');
        //$scope.pos_SalesOrderDetail.DueDate = $scope.pos_SalesOrderDetail.DueDate.split("/").reverse().join("-");

       // var Due = ($scope.pos_SalesOrderDetail.DueDate.split("-").reverse().join("/")).toString();
       // var input = $("#txtDueDate ");
       //input.val(Due);
       // input.trigger('input'); // Use for Chrome/Firefox/Edge
       // //input.trigger('change')
       // //$("#txtDueDate").val('Due');

        $scope.VisibilityOfSuggession = false;
        $scope.ItemSearchCombination = $scope.pos_SalesOrderDetail.Combination;
        $scope.pos_SalesOrderDetail.ItemDescription = $scope.pos_SalesOrderDetail.NameAndDesc;

        $scope.AllCombinationSearch = [];
        $scope.ddlMu = { ItemUnitId: $scope.pos_SalesOrderDetail.DefaultSaleMeasurementId }
        $scope.pos_SalesOrderDetail.CurrentQuantity = $scope.pos_SalesOrderDetail.StockQty;
        $('#txtOrderQty').focus();
    }

    $scope.RemoveItemAttr = function (aDetail) {
        $scope.pos_SalesOrderDetailAdAttributeLst.splice(aDetail, 1);
    }

    $scope.setCurrency = function (Currency) {
        if (Currency == "Local") {
            $scope.salesOrder.CurrencyType = "BDT";
        }
        if (Currency == "Export") {
            $scope.salesOrder.CurrencyType = "USD";
        }
    }

    //$scope.AddSalesOrderDetail = function () {
    //    if (isNaN(parseFloat($scope.pos_SalesOrderDetail.OrderPrice)) || !isFinite($scope.pos_SalesOrderDetail.OrderPrice)) {
    //        alertify.log('Enter correct price for ' + $scope.pos_SalesOrderDetail.ItemDescription, 'error', '5000');
    //        return;
    //    }

    //    var flag = true;
    //    angular.forEach($scope.pos_SalesOrderDetailAdAttributeLst, function (aDetailAdAttribute) {
    //        if (aDetailAdAttribute.Barcode == $scope.pos_SalesOrderDetail.Barcode) {
    //            flag = false;
    //        }
    //    });
    //    if (flag) {
    //        var Attribute = $scope.pos_SalesOrderDetail;
    //        Attribute.OrderUnitId = $scope.ddlMu.ItemUnitId;
    //        Attribute.UnitName = GetUnitNameById(Attribute.OrderUnitId);
    //        var fromDueDate = "";
    //        fromDueDate = $("#txtDueDate").val();
    //        $scope.pos_SalesOrderDetail.DueDate = "";
    //        $scope.pos_SalesOrderDetail.DueDate = fromDueDate.split("/").reverse().join("-");
    //        Attribute.DueDate = $scope.pos_SalesOrderDetail.DueDate;
    //        Attribute.OrderPrice = $scope.pos_SalesOrderDetail.OrderPrice;
    //        Attribute.CurrentQuantity = $scope.pos_SalesOrderDetail.CurrentQuantity;
    //        Attribute.OrderQty = $scope.pos_SalesOrderDetail.OrderQty;
    //        Attribute.ItemAddAttId = Attribute.ItemId;

    //        if ($scope.pos_SalesOrderDetail.BuyerName == null) {
    //            Attribute.BuyerName = "";
    //        }
    //        else {
    //            Attribute.BuyerName = $scope.pos_SalesOrderDetail.BuyerName;
    //        }



    //        Attribute.ItemName = Enumerable.From($scope.VarietyList).Where('$.ItemId==' + Attribute.ItemId).Select('$.ItemName').FirstOrDefault();
    //        Attribute.ItemCode = Enumerable.From($scope.VarietyList).Where('$.ItemId==' + Attribute.ItemId).Select('$.ItemCode').FirstOrDefault();
    //        $scope.pos_SalesOrderDetailAdAttributeLst.push(Attribute);

    //        flag = true;

    //        angular.forEach($scope.pos_SaleOrderBillDetaillst, function (aItem) {
    //            if (aItem.ItemId == $scope.pos_SalesOrderDetail.ItemId) {
    //                flag = false;
    //            }
    //        });
    //        if (flag) {
    //            var Item = {};
    //            angular.forEach($scope.VarietyList, function (aItem) {
    //                if (aItem.ItemId == $scope.pos_SalesOrderDetail.ItemId) {
    //                    Item = aItem;
    //                }
    //            })
    //            Item.OrderQuantity = $scope.pos_SalesOrderDetail.OrderQty;
    //            Item.HeaderOfAttribute = ["Description"];

    //            $scope.pos_SaleOrderBillDetaillst.push(Item);

    //        } else {
    //            var item = Enumerable.From($scope.pos_SaleOrderBillDetaillst)
    //                .Where('$.ItemId==' + $scope.pos_SalesOrderDetail.ItemId).FirstOrDefault();

    //            item.OrderQuantity += $scope.pos_SalesOrderDetail.OrderQty;
    //        }

    //        $scope.pos_SalesOrderDetail = {};
    //        $scope.ItemSearchCombination = null;
    //        $scope.pos_SalesOrderDetail.DueDate = "";
    //        $scope.pos_SalesOrderDetail.DueDate = $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy');
    //        $('#SearchTextBox').focus();
    //    }
    //    else {
    //        alertify.log('This Product already Exist, Try another one !!!', 'error', '5000');
    //        $('#SearchTextBox').val('');
    //        $scope.pos_SalesOrderDetail.DueDate = "";
    //        $scope.pos_SalesOrderDetail.DueDate = $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy');
    //        $('#SearchTextBox').focus();
    //    }
    //    $scope.reviseSalesOrderForm.$setPristine();
    //    $scope.reviseSalesOrderForm.$setUntouched();
    //}

    $scope.ChangeDeliveryQty = function (aSOrederListDetailAdAttribute) {
        SetDeliveryQunatity(aSOrederListDetailAdAttribute);
    }

    $scope.foundChange = function () {
        $scope.found = true;
    };

    $scope.resetForm = function () {
        Clear();
        $scope.reviseSalesOrderForm.$setPristine();
        $scope.reviseSalesOrderForm.$setUntouched();
        $scope.ItemSearchCombination = '';
        $("#txtSalesOrderDate").focus();
    }



    $scope.SearchSalesOrder = function () {
        var fromDate = $("#txtFromDateForSO").val();
        var toDate = $("#txtToDateForSO").val();
        var companyId;
        fromDate = fromDate.split("/");
        fromDate = fromDate[1] + "-" + fromDate[2] + "-" + fromDate[0];
        toDate = toDate.split("/");
        toDate = toDate[1] + "-" + toDate[2] + "-" + toDate[0];

        if ($scope.ddlCompanySearch !== undefined && $scope.ddlCompanySearch != null) {
            companyId = $scope.ddlCompanySearch.CompanyId;
        }
        $http({
            url: '/SalesOrder/GetSalesOrderForEdit?fromDate=' + fromDate + '&toDate=' + toDate + '&companyId=' + companyId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                angular.forEach(data, function (aSd) {
                    var res1 = aSd.SalesOrderDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.SalesOrderDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                        aSd.SalesOrderDate = date1;
                    }
                })
            }
            else
                alertify.log('No Sales Order Found', 'error', '5000');

            $scope.SalesOrderList = data;
            
        });
    }

    //$scope.GetSalesOrderDetails = function (aSO) {
    //    $scope.btnSave = "Update";
    //    $scope.salesOrder = aSO;
    //    if (aSO.IsNonSO == 1) {
    //        $scope.salesOrder.IsNonSO = true;
    //    }
    //    $scope.salesOrder.CurrentSalesOrderDate = aSO.SalesOrderDate;
    //    $scope.salesOrder.SalesOrderNo = aSO.SalesOrderNo.split('/')[2];
    //    $("#txtSalesOrderDate").val(aSO.SalesOrderDate);
    //    // $("#txtPoDate").val(aSO.PODate);
    //    // $scope.PODate = aSO.PODate;

    //    var res1 = aSO.InvoiceDueDate.substring(0, 5);
    //    if (res1 == "/Date") {
    //        var parsedDate1 = new Date(parseInt(aSO.InvoiceDueDate.substr(6)));
    //        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
    //        aSO.InvoiceDueDate = date1;
    //    }

    //    if (aSO.PODate) {
    //        var res1 = aSO.PODate.substring(0, 5);
    //        if (res1 == "/Date") {
    //            var parsedDate1 = new Date(parseInt(aSO.PODate.substr(6)));
    //            var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
    //            aSO.PODate = date1;
    //        }
    //    }
    //    $scope.ddlCompany = { "CompanyId": aSO.CompanyId };
    //    $scope.ddlPriceTypeBy = { "PriceTypeId": aSO.PriceTypeId };
    //    $scope.ddlPreparedBy = { "EmployeeId": aSO.PreparedById };
    //    var criteria = "[SalesOrderId]=" + aSO.SalesOrderId;
    //    $http({
    //        url: '/SalesOrder/GetSalesOrderDetailDynamic?searchCriteria=' + criteria + "&orderBy='SalesOrderId'",
    //        method: 'GET',
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (data) {
    //        if (data.length) {
    //            $scope.pos_SaleOrderBillDetaillst = [];
    //            $scope.pos_SalesOrderDetailAdAttributeLst = [];

    //            angular.forEach(data, function (aSoDetail) {
    //                $scope.pos_SalesOrderDetail = Enumerable.From($scope.AllCombinationlist).Where('$.ItemAddAttId==' + aSoDetail.ItemAddAttId).FirstOrDefault();
    //                $scope.pos_SalesOrderDetail.BuyerName = aSoDetail.BuyerName;

    //                //var ValueOfAttribute = [];
    //                //var a = $scope.pos_SalesOrderDetail.AttributeNames.split(',');
    //                //for (var i = 0; i < a.length; i++) {
    //                //    var val = a[i].split(':');
    //                //    ValueOfAttribute.push(val[1].trim());
    //                //}

    //                $scope.pos_SalesOrderDetail.ValueOfAttribute = [$scope.pos_SalesOrderDetail.AttributeNames];
    //                var Attribute = $scope.pos_SalesOrderDetail;
    //                Attribute.OrderUnitId = aSoDetail.OrderUnitId;
    //                Attribute.UnitName = GetUnitNameById(Attribute.OrderUnitId);
    //                Attribute.ItemDescription = aSoDetail.ItemDescription;
    //                var res2 = aSoDetail.DueDate.substring(0, 5);
    //                if (res2 == "/Date") {
    //                    var parsedDate1 = new Date(parseInt(aSoDetail.DueDate.substr(6)));
    //                    var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
    //                    Attribute.DueDateFormated = date1;

    //                    var dueDateValue = date1.split("/");
    //                    Attribute.DueDate = new Date(dueDateValue[2], dueDateValue[1] - 1, dueDateValue[0]);
    //                }

    //                //var dueDateValue = '17/04/2018'.split("/");
    //                //var salesOrderDate = new Date(dueDateValue[2], dueDateValue[1] - 1, dueDateValue[0]);
    //                //$scope.pos_SalesOrderDetail.DueDate = salesOrderDate;
    //                //Attribute.DueDate = salesOrderDate;
    //                //Attribute.DueDateFormated = '17/04/2018';

    //                Attribute.OrderPrice = aSoDetail.OrderPrice;
    //                Attribute.CurrentQuantity = $scope.pos_SalesOrderDetail.StockQty;
    //                Attribute.OrderQty = aSoDetail.OrderQty;
    //                Attribute.ItemName = Enumerable.From($scope.VarietyList).Where('$.ItemId==' + Attribute.ItemId).Select('$.ItemName').FirstOrDefault();
    //                Attribute.ItemCode = Enumerable.From($scope.VarietyList).Where('$.ItemId==' + Attribute.ItemId).Select('$.ItemCode').FirstOrDefault();
    //                $scope.pos_SalesOrderDetailAdAttributeLst.push(Attribute);

    //                var itemExist = false;
    //                if ($scope.pos_SaleOrderBillDetaillst.length) {
    //                    angular.forEach($scope.pos_SaleOrderBillDetaillst, function (aItem) {
    //                        if (aItem.ItemId == $scope.pos_SalesOrderDetail.ItemId) {
    //                            aItem.OrderQuantity += $scope.pos_SalesOrderDetail.OrderQty;
    //                            itemExist = true;
    //                        }
    //                    });
    //                }

    //                if (!itemExist) {
    //                    var Item = {};
    //                    angular.forEach($scope.VarietyList, function (aItem) {
    //                        if (aItem.ItemId == $scope.pos_SalesOrderDetail.ItemId) {
    //                            Item = aItem;
    //                        }
    //                    })
    //                    Item.OrderQuantity = $scope.pos_SalesOrderDetail.OrderQty;

    //                    //Item.HeaderOfAttribute = [];
    //                    //var HeaderOfAttribute = [];
    //                    //var a = $scope.pos_SalesOrderDetail.AttributeNames.split(',');
    //                    //for (var i = 0; i < a.length; i++) {
    //                    //    var val = a[i].split(':');
    //                    //    HeaderOfAttribute.push(val[0].trim());
    //                    //}

    //                    Item.HeaderOfAttribute = ["Description"];
    //                    $scope.pos_SaleOrderBillDetaillst.push(Item);

    //                }
    //            })
    //        }
    //        $scope.pos_SalesOrderDetail = {};
    //        $scope.Mood = "Revise";
    //        $window.scrollTo(0, 0);

    //    });
    //}

    $scope.priceOrAmountChange = function (fromPriceChange) {
        if (fromPriceChange) {
            if (angular.isUndefined($scope.pos_SalesOrderDetail.OrderPrice) || $scope.pos_SalesOrderDetail.OrderPrice == null) {
                if ($("#txtPrice").val() === "" && event.data === ".")
                    return;
                else
                    $scope.pos_SalesOrderDetail.OrderPrice = 0;
                $scope.pos_SalesOrderDetail.Amount = 0;
            }
            else
                $scope.pos_SalesOrderDetai = 0;
            $scope.pos_SalesOrderDetail.Amount = 0;
            $scope.pos_SalesOrderDetai = ($scope.pos_SalesOrderDetail.OrderPrice) * ($scope.pos_SalesOrderDetail.OrderQty);
            $scope.pos_SalesOrderDetail.Amount = $scope.pos_SalesOrderDetai.toFixed(2);
        }
    }
    $scope.priceOrAmountChangeForQty = function () {
        if (angular.isUndefined($scope.pos_SalesOrderDetail.OrderPrice) || $scope.pos_SalesOrderDetail.OrderPrice == null) {
            if ($("#txtPrice").val() === "" && event.data === ".")
                return;

            $scope.pos_SalesOrderDetail.Amount = 0;
        } else
            $scope.pos_SalesOrderDetai = 0;
        $scope.pos_SalesOrderDetail.Amount = 0;
        $scope.pos_SalesOrderDetai = ($scope.pos_SalesOrderDetail.OrderPrice) * ($scope.pos_SalesOrderDetail.OrderQty);
        $scope.pos_SalesOrderDetail.Amount = $scope.pos_SalesOrderDetai.toFixed(2);
    }

    //Add Item
    $scope.CategoryChange = function () {
        $scope.AllItemSearch = [];
        $scope.FirstAttributeList = [];
        $scope.ad_Item.ItemName = null;
        $scope.ad_Item.ItemDescription = null;
        $scope.itemEntryNewForm.$setUntouched();
        $scope.itemEntryNewForm.$setPristine();
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

    $scope.LoadAnItem = function (aItem) {
        $scope.ad_Item.ItemName = aItem.ItemName;
        $scope.ShowItemSearch = false;
        $scope.AllItemSearch = [];
        $('#txtFirstDescription').focus();
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

   $scope.ItemUnitFilter = function (itemUnit) {
        return itemUnit.ItemUnitId > 1;
    };
    $scope.PackageUnitFilter = function (itemUnit) {
        return itemUnit.ItemUnitId > 1 || itemUnit.ItemUnitId > 2;
    };

    $scope.SaveItem = function () {
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

        $scope.ad_Item.SubCategoryId = $scope.ddlSubCategory.SubCategoryId;
        $scope.ad_Item.ItemName = $scope.ad_Item.ItemName;
        $scope.ad_Item.UnitId = $scope.ddlItemUnit.ItemUnitId;
        $scope.ad_Item.PackageId = 0;
        $scope.ad_Item.CreatorId = $scope.UserId;
        $scope.ad_Item.UpdatorId = $scope.UserId;

        

        if ($scope.ad_Item.ContainerSize == "") {
            $scope.ad_Item.ContainerSize = " ";
        }

        var parms = JSON.stringify({ item: $scope.ad_Item });

        $http.post('/Item/SaveNew', parms).success(function (data) {
            if (data > 0) {
                alertify.log("Product Saved Successfully", 'success', '5000');
                ClearItem();
                $scope.CategoryChange();

                $http({
                    url: '/Item/GetCombinationWithPrice',
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (lst) {
                    $http({
                        url: "/Item/GetAllItem",
                        method: "GET",
                        headers: { 'Content-Type': "application/json" }
                    }).success(function (data) {
                        $scope.pos_SalesOrderDetail = {};
                        $scope.pos_SalesOrderDetail.TempItemName = 0;
                        $scope.ItemSearchList = data;
                        var lastItem = _.last($scope.ItemSearchList);
                        $scope.pos_SalesOrderDetail.TempItemName = lastItem.ItemName +
                            " ~ " +
                            lastItem.ItemDescription +
                            " ~ " +
                            lastItem.ItemDescriptionTwo +
                            " ~ " +
                            lastItem.ItemCode +
                            " ~ " +
                            lastItem.UnitPerPackage +
                            " ~ " +
                            lastItem.PackagePerContainer +
                            " ~ " +
                            lastItem.HsCode +
                            " ~ " +
                            lastItem.ItemId;

                        $scope.pos_SalesOrderDetail.ItemDescription = lastItem.ItemDescription;
                        $scope.pos_SalesOrderDetail.ItemUnitId = lastItem.UnitId;
                        $scope.ddlMu = { ItemUnitId: lastItem.UnitId };
                        $scope.pos_SalesOrderDetail.DueDate = "";
                        $scope.pos_SalesOrderDetail.DueDate = $filter('date')(new Date().toJSON().slice(0, 10), 'MMM dd, yyyy');
                        $scope.pos_SalesOrderDetail.ItemAddAttId = lastItem.ItemId;
                      
                    });
                    
                    


                    $scope.AllCombinationlist = JSON.parse(lst);
                    var aCombination = Enumerable.From($scope.AllCombinationlist).Where('$.ItemAddAttId==' + data).FirstOrDefault();
                    //$scope.LoadACombination(aCombination);
                })

                GetAllVariety();
                //Clear();
                $scope.reviseSalesOrderForm.$setPristine();
                $scope.reviseSalesOrderForm.$setUntouched();

                $('#itemModal').modal('toggle');

            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    };


     
    $scope.CloseItemModal = function () {
        setTimeout(function () {
            if (angular.isUndefined($scope.ItemSearchCombination) || $scope.ItemSearchCombination == null)
                $('#SearchTextBox').focus();
            else
                $('#txtOrderQty').focus();
        }, 1000);
    };

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
                        aData.UnitPerPackage +
                        " ~ " +
                        aData.HsCode +
                        " ~ " +
                        aData.ItemCode +
                        " ~ " +
                        aData.PackagePerContainer +
                        " ~ " +

                        aData.ItemId;
                });
        });
    };
    $scope.loadItemDetails = function (aItem) {
        var splitItem = aItem.split("~");

        if (splitItem[7] != undefined) {
            $scope.pos_SalesOrderDetail.ItemAddAttId = splitItem[7].trim();
        }
        if (splitItem[4] != undefined) {
            $scope.HSCode = splitItem[4].trim();
        }

        var ItemNamelist = Enumerable.From($scope.ItemSearchList).Where('$.ItemId==' + $scope.pos_SalesOrderDetail.ItemAddAttId).FirstOrDefault();
        //$scope.ddlMu = { ItemUnitId: ItemNamelist.UnitId };
        $scope.ddlMu = { ItemUnitId: 2 };
        $scope.pos_SalesOrderDetail.ItemDescription = ItemNamelist.ItemName +" "+ ItemNamelist.ItemDescription;

    }
    $scope.AddSalesOrderDetail = function () {
        if (isNaN(parseFloat($scope.pos_SalesOrderDetail.OrderPrice)) || !isFinite($scope.pos_SalesOrderDetail.OrderPrice)) {
            alertify.log('Enter correct price for ' + $scope.pos_SalesOrderDetail.ItemDescription, 'error', '5000');
            return;
        }

        var flag = true;
        if (flag) {
            var Attribute = $scope.pos_SalesOrderDetail;
            Attribute.OrderUnitId = $scope.ddlMu.ItemUnitId;
            Attribute.UnitName = GetUnitNameById(Attribute.OrderUnitId);
            //var fromDueDate = "";
            //fromDueDate = $("#txtDueDate").val();
            //$scope.pos_SalesOrderDetail.DueDate = "";
            //$scope.pos_SalesOrderDetail.DueDate = fromDueDate.split("/").reverse().join("-");
            Attribute.DueDate = $scope.pos_SalesOrderDetail.DueDate;
            Attribute.OrderPrice = $scope.pos_SalesOrderDetail.OrderPrice;
            Attribute.CurrentQuantity = $scope.pos_SalesOrderDetail.CurrentQuantity;
            Attribute.OrderQty = $scope.pos_SalesOrderDetail.OrderQty;
            Attribute.ItemAddAttId = Attribute.ItemAddAttId;

            if ($scope.pos_SalesOrderDetail.BuyerName == null) {
                Attribute.BuyerName = "";
            }
            else {
                Attribute.BuyerName = $scope.pos_SalesOrderDetail.BuyerName;
            }



            Attribute.ItemName = Enumerable.From($scope.ItemSearchList).Where('$.ItemId==' + Attribute.ItemAddAttId).Select('$.ItemName').FirstOrDefault();
            Attribute.ItemCode = Enumerable.From($scope.ItemSearchList).Where('$.ItemId==' + Attribute.ItemAddAttId).Select('$.ItemCode').FirstOrDefault();
            $scope.pos_SalesOrderDetailAdAttributeLst.push(Attribute);

            flag = true;

            angular.forEach($scope.pos_SaleOrderBillDetaillst, function (aItem) {
                if (aItem.ItemId == $scope.pos_SalesOrderDetail.ItemId) {
                    flag = false;
                }
            });
            if (flag) {
                var Item = {};
                angular.forEach($scope.ItemSearchList, function (aItem) {
                    if (aItem.ItemId == $scope.pos_SalesOrderDetail.ItemId) {
                        Item = aItem;
                    }
                })
                Item.OrderQuantity = $scope.pos_SalesOrderDetail.OrderQty;
                Item.HeaderOfAttribute = ["Description"];

                $scope.pos_SaleOrderBillDetaillst.push(Item);

            } else {
                var item = Enumerable.From($scope.pos_SaleOrderBillDetaillst)
                    .Where('$.ItemId==' + $scope.pos_SalesOrderDetail.ItemId).FirstOrDefault();

                item.OrderQuantity += $scope.pos_SalesOrderDetail.OrderQty;
            }

            $scope.pos_SalesOrderDetail = {};
            $scope.ItemSearchCombination = null;
            $scope.pos_SalesOrderDetail.DueDate = "";
            $scope.pos_SalesOrderDetail.DueDate = $filter('date')(new Date().toJSON().slice(0, 10), 'MMM dd, yyyy');
            $('#SearchTextBox').focus();
        }
        else {
            alertify.log('This Product already Exist, Try another one !!!', 'error', '5000');
            $('#SearchTextBox').val('');
            $scope.pos_SalesOrderDetail.DueDate = "";
            $scope.pos_SalesOrderDetail.DueDate = $filter('date')(new Date().toJSON().slice(0, 10), 'MMM dd, yyyy');
            $('#SearchTextBox').focus();
        }
        $scope.reviseSalesOrderForm.$setPristine();
        $scope.reviseSalesOrderForm.$setUntouched();
    }

    $scope.GetSalesOrderDetails = function (aSO) {
        if (aSO.DocStatus !== 'Draft') {
            alertify.log('This SO can not be modified', 'error', '2000');
            return;
        }
        $scope.btnSave = "Update";
        $scope.salesOrder = aSO;
        if (aSO.Remarks != "") {
            $scope.salesOrder.IsNonSO = true;
        }
        $scope.salesOrder.CurrentSalesOrderDate = aSO.SalesOrderDate;
        $scope.salesOrder.SalesOrderNo = aSO.SalesOrderNo.split('/')[2];
        $("#txtSalesOrderDate").val(aSO.SalesOrderDate);
        // $("#txtPoDate").val(aSO.PODate);
        // $scope.PODate = aSO.PODate;

        var res1 = aSO.InvoiceDueDate.substring(0, 5);
        if (res1 == "/Date") {
            var parsedDate1 = new Date(parseInt(aSO.InvoiceDueDate.substr(6)));
            var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
            aSO.InvoiceDueDate = date1;
        }

        if (aSO.PODate) {
            var res1 = aSO.PODate.substring(0, 5);
            if (res1 == "/Date") {
                var parsedDate1 = new Date(parseInt(aSO.PODate.substr(6)));
                var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                aSO.PODate = date1;
            }
        }
        
        $scope.company.CompanyName = aSO.CompanyName;
        GetEmpId();

        var obj = $scope.ddlCompany;
        $scope.ddlPriceTypeBy = { "PriceTypeId": aSO.PriceTypeId };
        $scope.ddlPreparedBy = { "EmployeeId": aSO.PreparedById };
        var criteria = "[SOD].[SalesOrderId]=" + aSO.SalesOrderId;
        $http({
            url: '/SalesOrder/GetSalesOrderDetailDynamic?searchCriteria=' + criteria + "&orderBy='SalesOrderId'",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length) {
                
                
                $scope.pos_SalesOrderDetailAdAttributeLst = [];
                angular.forEach(data, function (aSoDetail) {
                    var res2 = aSoDetail.DueDate.substring(0, 5);
                    if (res2 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSoDetail.DueDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                        aSoDetail.DueDate = date1;
                    }

                    $scope.pos_SalesOrderDetailAdAttributeLst.push(aSoDetail);
                }) 
            }
            $scope.Mood = "Revise";
            $window.scrollTo(0, 0); 

        });
    }

    $scope.LoadSalesOrder = function (password) {

        $http({
            url: '/SalesOrder/pos_SalesOrderAmendment_GetForEdit?approvalType=SOAmendment&approvalPassword=' + password,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (aSO) {
            if (aSO.length > 0) {
                $scope.btnSave = "Update";
                $scope.salesOrder = aSO[0];
                //if (aSO.Remarks != "") {
                //    $scope.salesOrder.IsNonSO = true;
                //}
                $scope.salesOrder.CurrentSalesOrderDate = aSO[0].SalesOrderDate;
                $scope.salesOrder.SalesOrderNo = aSO[0].SalesOrderNo.split('/')[2];

                var res1 = aSO[0].SalesOrderDate.substring(0, 5);
                if (res1 == "/Date") {
                    var parsedDate1 = new Date(parseInt(aSO[0].SalesOrderDate.substr(6)));
                    var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                    aSO[0].SalesOrderDate = date1;
                }

                $("#txtSalesOrderDate").val(aSO[0].SalesOrderDate);
                // $("#txtPoDate").val(aSO.PODate);
                // $scope.PODate = aSO.PODate;

                var res1 = aSO[0].InvoiceDueDate.substring(0, 5);
                if (res1 == "/Date") {
                    var parsedDate1 = new Date(parseInt(aSO[0].InvoiceDueDate.substr(6)));
                    var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                    aSO[0].InvoiceDueDate = date1;
                }

                //if (aSO[0].PODate) {
                //    var res1 = aSO[0].PODate.substring(0, 5);
                //    if (res1 == "/Date") {
                //        var parsedDate1 = new Date(parseInt(aSO[0].PODate.substr(6)));
                //        var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                //        aSO[0].PODate = date1;
                //    }
                //}
                if (aSO[0].CurrentSalesOrderDate) {
                    var res1 = aSO[0].CurrentSalesOrderDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSO[0].CurrentSalesOrderDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                        aSO[0].CurrentSalesOrderDate = date1;
                    }
                }

                $scope.company.CompanyName = aSO[0].CompanyName;
                GetEmpId();

                var obj = $scope.ddlCompany;
                $scope.ddlPriceTypeBy = { "PriceTypeId": aSO[0].PriceTypeId };
                $scope.ddlPreparedBy = { "EmployeeId": aSO[0].PreparedById };
                var criteria = "[SOD].[SalesOrderId]=" + aSO[0].SalesOrderId;
                $http({
                    url: '/SalesOrder/GetSalesOrderDetailDynamic?searchCriteria=' + criteria + "&orderBy='SalesOrderId'",
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    if (data.length) {
                        $scope.pos_SalesOrderDetailAdAttributeLst = [];
                        angular.forEach(data, function (aSoDetail) {
                            var res2 = aSoDetail.DueDate.substring(0, 5);
                            if (res2 == "/Date") {
                                var parsedDate1 = new Date(parseInt(aSoDetail.DueDate.substr(6)));
                                var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                                aSoDetail.DueDate = date1;
                            }

                            $scope.pos_SalesOrderDetailAdAttributeLst.push(aSoDetail);
                        })

                    }
                    //$scope.Mood = "Revise";
                    //$window.scrollTo(0, 0);

                });
                $http({
                    url: '/SalesOrder/GetPOReference?DocType=SO' + "&DocumentId=" + $scope.salesOrder.SalesOrderId,
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
                            $scope.salesOrder.isPO = true;
                        }
                    }
                    $scope.Mood = "Revise";
                    $window.scrollTo(0, 0);

                });
            }
            else {
                alertify.log(' Password is not matched!', 'already', '5000');
                $('#txtOtP').val('');
                $scope.reviseSalesOrderForm.$setUntouched();

            }

            
        });
    }

    $scope.remarkDisable = function () {
        if ($scope.salesOrder.ReferenceNo == "") {
            $scope.Disableremark = false;
        } else {
            $scope.Disableremark = true;
            $('#Remarks').val('');
        }
        
    }


    $scope.AddPOReference = function () {
        $scope.POReference.DocType = "SO";
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
