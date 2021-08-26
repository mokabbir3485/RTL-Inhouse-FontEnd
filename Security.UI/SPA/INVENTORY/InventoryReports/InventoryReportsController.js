app.controller("InventoryReportsController", function ($scope, $cookieStore, $cookies, $http, $filter, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    load();

    //Functions
    function load() {
        $scope.company = {};
        $(document).ready(function () {
            $('.basic-select2').select2({ placeholder: "Select Employee" });
        });
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        $scope.IsMultiSelect = false;
        $scope.CategoriesSelected = [];
        $scope.Categories = [];
        $scope.dropdownSetting = {
            scrollable: true,
            scrollableHeight: '200px'
        }
        $scope.ActiveBankList = [];
        $scope.ShowReportDetailsGrid = false;
        $scope.ReportHeader = [];
        $scope.ReportDetailList = [];
        $scope.ViewReportDetails = null;
        $scope.BarCodeCustomer = {};
        $scope.Branchlist = [];
        $scope.supplierlist = [];
        $scope.companyList = [];
        $scope.companyMainList = [];
        $scope.deptlist = [];
        $scope.sectionList = [];
        $scope.ddlDepartment = null;
        $scope.departmentlist = [];
        $scope.Categorylist = [];
        $scope.SubcategoryList = [];
        $scope.VarietyList = [];
        $scope.ProductModelList = [];
        $scope.customerTypeList = [];
        $scope.ItemUnitlist = [];
        $scope.saleComparisonDataList = [];
        $scope.ActiveCustomerList = [];
        $scope.ActiveCustomerListForMultiSelect = [];
        $scope.PurchaseBillList = [];
        $scope.SalesOrderList = [];
        $scope.DeliveryChallanList = [];
        $scope.SalesBillList = [];
        $scope.InternalWorkOrderList = [];
        $scope.MonthYearList = [];
        $scope.rbReport = 'AttSum';
        $scope.rbReturnType = 'NonReturnable';
        $scope.ReportTableHeader = " ";
        GetAllBranch();
        GetAllStore();
        GetAllBank();
        GetAllCategory();
        GetAllSubCategory();
        GetAllCustomertype();
        GetAllItemUnit();
        GetUsersPermissionDetails();
        GetAllSalesOrder();
        GetDeliverChallan();
        GetSalesBill();
        GetPurchaseBill();
        GetInternalWorkOrder();
        GetSupplier();
        GetActiveCompany('');
        GetAllActiveCompany();
        $scope.CompanyList = []
        GetAllCompanyType();
        GetAllEmployee('');
        setTodayToDateRange();
        $scope.GradeList = [{ GradeId: 1, GradeName: 'Staff' }, { GradeId: 2, GradeName: 'Labour' }, { GradeId: 3, GradeName: 'Labour EPZ' }];
        $scope.MonthList = [
            { MonthId: 1, MonthName: 'January' },
            { MonthId: 2, MonthName: 'Februray' },
            { MonthId: 3, MonthName: 'March' },
            { MonthId: 4, MonthName: 'April' },
            { MonthId: 5, MonthName: 'May' },
            { MonthId: 6, MonthName: 'June' },
            { MonthId: 7, MonthName: 'July' },
            { MonthId: 8, MonthName: 'August' },
            { MonthId: 9, MonthName: 'September' },
            { MonthId: 10, MonthName: 'October' },
            { MonthId: 11, MonthName: 'November' },
            { MonthId: 12, MonthName: 'December' }
        ];
        getYearList();
        GetMonthYear();

        $scope.departmentIds = '';
        $scope.departmentIdList = [{ id: 1 }, {id: 2}];
        $scope.example8data = [{ id: 1, label: 'Shuvo' }, { id: 2, label: 'Mokabbir' }];
        $scope.example8settings = {
            checkBoxes: true,
            scrollableHeight: '200px',
            scrollable: true,
            dynamicTitle: true,
            selectionOf: true,
            showUncheckAll: true,
            showCheckAll: true,
            enableSearch: true
        };
    }

    $scope.RedioBtnChange = function () {
        $scope.CIFReport = 'CIFReportFalse';

    }
    $scope.CIFRedioBtnChange = function () {
        $scope.CIFReport = 'CIFReport';

    }
    function GetAllActiveCompany() {
        var criteria = "C.IsActive=1";
        $http({
            url: '/Company/GetCompanyDynamic?searchCriteria=' + criteria + "&orderBy=CompanyName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.companyList = data;

        })

    }
    $scope.CIFReportBtn = function (companyId) {
        $window.open("#/CIFReport", "popup", "width=850,height=550,left=280,top=80");
        //var companyId = company.CompanyId;
        $scope.company = {};
        if ($scope.CIFFromDate != undefined && $scope.CIFToDate != undefined) {
            $scope.CIFFromDate = $scope.CIFFromDate.split("/").reverse().join("-");
            $scope.CIFToDate = $scope.CIFToDate.split("/").reverse().join("-");
        }



        $scope.company['companyId'] = companyId;
        $scope.company['CIFFromDate'] = $scope.CIFFromDate;
        $scope.company['CIFToDate'] = $scope.CIFToDate;
        $cookies.remove("Company");
        $cookies.putObject("Company", $scope.company);
        event.stopPropagation();

    };
    function GetMonthYear() {
        $http({
            url: '/Rpt_MonthYear/Get',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.MonthYearList = data;
            console.log($scope.MonthYearList);
        });
    }

    function getYearList() {
        var today = new Date();
        var thisMonth = today.getMonth();
        var thisYear = today.getFullYear();
        var lastYear = thisYear - 1;

        $scope.YearList = [
            { YearId: thisYear, YearName: ('' + thisYear) },
            { YearId: lastYear, YearName: ('' + lastYear) }
        ];

        $scope.ddlYear = { YearId: thisYear, YearName: ('' + thisYear) };
        $scope.ddlMonth = Enumerable.From($scope.MonthList).Where("$.MonthId ===" + thisMonth).FirstOrDefault();
    }

    function setTodayToDateRange() {
        var today = new Date();
        var yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        var date = (yesterday.getDate()) < 10 ? ('0' + yesterday.getDate()) : ('' + yesterday.getDate());
        var monInt = (yesterday.getMonth() + 1);
        var mon = monInt < 10 ? ('0' + monInt) : ('' + monInt);
        var todayFormat = date + '/' + mon + '/' + yesterday.getFullYear();
        $scope.FromDate = todayFormat;
        $scope.ToDate = todayFormat;
    }

    function Reset() {
        $scope.ddlBuyer = { value: 'Both', name: 'Both' };
        $scope.ddlSaleType = { id: 2, name: 'All' }
        $scope.ddlItemUnit = { id: 1, name: 'KG' };
        $scope.CategoriesSelected = [];
        $scope.ddlBank = null;
        $scope.ddlCategory = null;
        $scope.ddlSubCategory = null;
        $scope.ddlVariety = null;
        $scope.ddlCustomerType = null;
        $scope.ddlCustomer = null;
        $scope.ReportTableHeader = " ";
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

    function GetActiveCompany(criteria2) {
        var criteria = "C.IsActive=1" + criteria2;
        $http({
            url: '/Company/GetCompanyDynamic?searchCriteria=' + criteria + "&orderBy=CompanyName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (companyList) {
            $scope.companyList = companyList;
            if (criteria2 == '')
                $scope.companyMainList = companyList;
        })
    }

    function GetAllEmployee(criteria2) {
        var criteria = "E.IsActive=1" + criteria2;
        $http({
            url: '/Employee/GetUserDynamic?searchCriteria=' + criteria + "&orderBy=FullName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.employeeList = data;
        });
    }

    function GetSupplier() {
        var criteria = "IsActive=1";
        $http({
            url: '/Supplier/GetDynamic?searchCriteria=' + criteria,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.supplierlist = data;
            if (data.length == 1)
                $scope.ddlSupplier = { SupplierId: data[0].SupplierId, SupplierName: data[0].SupplierName };
        })
    }

    function GetPurchaseBill() {
        var criteria = "1=1";
        $http({
            url: '/PurchaseBill/GetPBDynamic',
            params: { where: criteria, orderBy: "PBId DESC" },
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.PurchaseBillList = data;
        })
    }

    function GetSalesBill() {
        var criteria = "1=1";
        $http({
            url: '/Delivery/GetDeliveryNoDynamic',
            params: { searchCriteria: criteria, orderBy: "DeliveryId DESC" },
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.SalesBillList = data;
        })

    }

    function GetInternalWorkOrder() {
        var criteria = "1=1";
        $http({
            url: '/InternalWorkOrder/GetInternalWorkOrderDynamic',
            params: { searchCriteria: criteria, orderBy: "InternalWorkOrderId DESC" },
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.InternalWorkOrderList = data;
        })

    }

    function GetDeliverChallan() {
        var criteria = "1=1";
        $http({
            url: '/Delivery/GetDeliveryNoDynamic',
            params: { searchCriteria: criteria, orderBy: "DeliveryId DESC" },
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DeliveryChallanList = data;
        })

    }

    function GetAllSalesOrder() {
        var criteria = "1=1";
        $http({
            url: '/SalesOrder/GetSalesOrderDynamic',
            params: { searchCriteria: criteria, orderBy: "SalesOrderId DESC" },
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            $scope.SalesOrderList = data;
        })
    }

    function GetAllBranch() {
        $http({
            //url: '/Branch/GetAllBranchByUserID?userId=' + $scope.LoginUser.UserId,
            url: '/Branch/GetAllBranch',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if ($scope.LoginUser.RoleName === "Admin" || $scope.LoginUser.RoleName === "HR Admin") {
                $scope.Branchlist = data;
            } else {
                var branchForUser = Enumerable.From(data).Where("$.BranchId==" + $scope.LoginUser.BranchId).ToArray();
                $scope.Branchlist = branchForUser;
            }

            //$scope.ddlBrunch = { BranchId: $scope.Branchlist[0].BranchId, BranchName: $scope.Branchlist[0].BranchName };
            //GetAllStore();
            GetCustomers();
            angular.forEach(data, function (aBrnch) {
                $scope.Categories.push({ id: aBrnch.BranchId, label: aBrnch.BranchName });
            })
        });
    }

    function GetAllStore() {
        $http({
            //url: '/User/GetUserStoreByUserId?userId=' + $scope.LoginUser.UserId,
            url: '/Department/GetAllStore',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (userOutletList) {
            $scope.deptlist = userOutletList;

            //keepGoing = true;
            //angular.forEach($scope.departmentlist, function (adpt) {
            //    if (keepGoing) {
            //        if (adpt.BranchId == $scope.ddlBrunch.BranchId) {
            //            $scope.ddlDepartment = { DepartmentId: adpt.DepartmentId }
            //            keepGoing = false;
            //        }
            //    }
            //});
        });
    }

    function GetAllCategory() {
        $http({
            url: '/Category/GetAllCategory',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Categorylist = data;
        });
    }

    function GetAllCustomertype() {
        $http({
            url: '/CustomerEntry/GetAllCustomertype',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (customerTyoeList) {
            $scope.customerTypeList = customerTyoeList;
            $scope.customerTypeList.push({ CustomerTypeId: 0, CustomerTypeName: 'Un-Registered' });

        })
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

    function GetAllItemUnit() {
        $http({
            url: '/Unit/GetAllUnit',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ItemUnitlist = data;
        });
    }

    function GetAllBank() {
        var criteria = "IsActive=1";
        $http({
            url: '/BankEntry/GetBankDynamic?searchCriteria=' + criteria + "&orderBy=BankName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ActiveBankList = data;
        })
    }

    function GetUsersPermissionDetails() {
        $scope.CurrentStock = false;
        $scope.CurrentStockByAttribute = false;
        $scope.StockReceiveReport = false;
        $scope.ReorderLevel = false;
        $scope.SaleByDateReport = false;
        $scope.SaleByQuantityReport = false;
        $scope.StockLedger = false;
        $scope.SaleInvoice = false;
        $scope.VarietyWiseCustomerSalesReport = false;
        $scope.LeadingCustomerWiseSalesReport = false;
        $scope.PaymentReport = false;
        $scope.BalanceReport = false;
        $scope.SaleComparisonReport = false;
        $scope.VarietywiseSalesReport = false;
        $scope.StockIssueReport = false;
        $scope.ReceiptNote = false;
        $scope.SalesOrder = false;
        $scope.DeliveryChallan = false;
        $scope.SalesBill = false;
        $scope.ProductSerialNo = false;
        $scope.InternalWorkOrderReport = false;
        $scope.DateWiseProductionStatus = false;
        $scope.PurchaseBySupplier = false;
        $scope.SaleReportByCompany = false;
        $scope.StockSummary = false;
        $scope.GatePass = false;
        $scope.ArDue = false;
        $scope.ArSummary = false;
        $scope.AcLedger = false;
        $scope.AttSum = false;
        $scope.AttSumWithOT = false;
        $scope.AttDtl = false;
        $scope.SalSheet = false;
        $scope.LeaveBalance = false;
        $scope.SalaryHistory = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('InventoryAndSaleReportsScreenId');
        $http({
            url: '/Permission/GetUsersPermissionDetails?searchCriteria=' + searchCriteria + '&orderBy=PermissionDetailId',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.PermissionDetails = data;
            angular.forEach($scope.PermissionDetails, function (aPermissionDetails) {
                if (aPermissionDetails.FunctionName == 'Current Stock Report') {
                    $scope.CurrentStock = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Current Stock Report By Attribute') {
                    $scope.CurrentStockByAttribute = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Stock Receive Report') {
                    $scope.StockReceiveReport = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Stock VS Reorder Level Report') {
                    $scope.ReorderLevel = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Sale By Date Report') {
                    $scope.SaleByDateReport = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Sale By Quantity Report') {
                    $scope.SaleByQuantityReport = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Stock Ledger Report') {
                    $scope.StockLedger = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Variety Wise Customer Sales Report') {
                    $scope.VarietyWiseCustomerSalesReport = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Leading Customer Wise Sales Report') {
                    $scope.LeadingCustomerWiseSalesReport = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Payment Report') {
                    $scope.PaymentReport = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Balance Report') {
                    $scope.BalanceReport = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Sale Comparison') {
                    $scope.SaleComparisonReport = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Variety Wise Sales Report') {
                    $scope.VarietywiseSalesReport = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Stock Issue Report') {
                    $scope.StockIssueReport = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Sales By Invoice Report') {
                    $scope.SaleInvoice = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Receipt Note') {
                    $scope.ReceiptNote = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Sales Order') {
                    $scope.SalesOrder = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Delivery Challan') {
                    $scope.DeliveryChallan = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Sales Bill') {
                    $scope.SalesBill = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Product Serial No') {
                    $scope.ProductSerialNo = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Internal Work Order Report') {
                    $scope.InternalWorkOrderReport = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Production Status By Date') {
                    $scope.DateWiseProductionStatus = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Purchase By Supplier') {
                    $scope.PurchaseBySupplier = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Sale By Company') {
                    $scope.SaleReportByCompany = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Stock Summary') {
                    $scope.StockSummary = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Gate Pass') {
                    $scope.GatePass = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Accounts Receivable Due') {
                    $scope.ArDue = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Accounts Receivable Summary') {
                    $scope.ArSummary = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Account Ledger') {
                    $scope.AcLedger = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Attendance Summary') {
                    $scope.AttSum = aPermissionDetails.CanExecute;
                }

                else if (aPermissionDetails.FunctionName == 'Attendance Summary With OT') {
                    $scope.AttSumWithOT = aPermissionDetails.CanExecute;
                }

                else if (aPermissionDetails.FunctionName == 'Attendance Detail') {
                    $scope.AttDtl = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Salary Sheet') {
                    $scope.SalSheet = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Leave Balance') {
                    $scope.LeaveBalance = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Salary History') {
                    $scope.SalaryHistory = aPermissionDetails.CanExecute;
                }
                //else if (aPermissionDetails.FunctionName == 'Salary History') {
                //    $scope.CIFReport = aPermissionDetails.CanExecute;
                //}
            });
        });
    }

    function GetCustomers() {
        $scope.ActiveCustomerList = [];
        var criteria = "C.IsActive=1";
        if ($scope.rbReport == 'SaleByFarmer' || $scope.rbReport == 'VarietyWiseCustomerSalesReport') {
            var outletList = '';
            angular.forEach($scope.CategoriesSelected, function (aOutletList) {
                outletList += outletList == '' ? aOutletList.id : (',' + aOutletList.id);
            })

            if (outletList != '')
                criteria += " AND C.BranchId IN (" + outletList + ")";
            if ($scope.ddlCustomerType != null && $scope.ddlCustomerType != undefined && $scope.ddlCustomerType != '') {
                criteria += " AND C.CustomerTypeId=" + $scope.ddlCustomerType.CustomerTypeId;
            }

            if (criteria != 'C.IsActive=1') {
                $http({
                    url: '/CustomerEntry/GetAllCustomerDynamic?searchCriteria=' + criteria + "&orderBy=CustomerTypeName",
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (activecustomerList) {
                    $scope.ActiveCustomerListForMultiSelect = activecustomerList;
                    angular.forEach($scope.ActiveCustomerListForMultiSelect, function (aCustomer) {
                        aCustomer.FullName = aCustomer.Title + ' ' + aCustomer.FirstName + ' ' + aCustomer.MiddleName + ' ' + aCustomer.LastName;
                    });
                })
            }
        }
        else {
            if ($scope.ddlBrunch != null && $scope.ddlBrunch != undefined && $scope.ddlBrunch != '') {
                criteria += " AND C.BranchId =" + $scope.ddlBrunch.BranchId;
            }
            if ($scope.ddlCustomerType != null && $scope.ddlCustomerType != undefined && $scope.ddlCustomerType != '') {
                criteria += " AND C.CustomerTypeId=" + $scope.ddlCustomerType.CustomerTypeId;
            }

            if (criteria != 'C.IsActive=1') {
                $http({
                    url: '/CustomerEntry/GetAllCustomerDynamic?searchCriteria=' + criteria + "&orderBy=CustomerTypeName",
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (activecustomerList) {
                    $scope.ActiveCustomerList = activecustomerList;
                    angular.forEach($scope.ActiveCustomerList, function (aCustomer) {
                        aCustomer.FullName = aCustomer.Title + ' ' + aCustomer.FirstName + ' ' + aCustomer.MiddleName + ' ' + aCustomer.LastName;
                    });
                })
            }
        }

    }

    // MultiSelect Drop down select - Event
    function onItemSelect(property) {
        //console.log('select > ' + property);
        $scope.IsMultiSelect = true;
        GetCustomers();
    }

    function onItemDeselect(property) {
        //console.log('deselect : ' + property);
        $scope.IsMultiSelect = true;
        GetCustomers();
        $scope.ddlCustomerType = null;
        $scope.selCustomerForMultiSelect = null;
    }

    function onSelectAll() {
        //console.log('select all');
        $scope.IsMultiSelect = true;
        GetCustomers();

    }

    function onDeselectAll() {
        //console.log('deselect all');
        $scope.IsMultiSelect = true;
        GetCustomers();
        $scope.ddlCustomerType = null;
        $scope.selCustomerForMultiSelect = null;

    }

    function GetReportTablePaged(url, curPage, fromDate, toDate, wildCard, sortColumn, headerValue, reportName) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: url + "?startRecordNo=" + StartRecordNo + "&rowPerPage=" + $scope.PerPage + "&fromDate=" + fromDate + "&toDate=" + toDate + "&wildCard=" + wildCard + "&sortColumn=" + sortColumn,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ReportHeader = headerValue;
            $scope.ReportDetailList = [];
            var ListData = data.ListData;
            if (reportName == "ReceiptNote") {
                for (var i = 0; i < ListData.length; i++) {
                    var res1 = ListData[i].PBDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDueDate1 = new Date(parseInt(ListData[i].PBDate.substr(6)));
                        var date1 = ($filter('date')(parsedDueDate1, 'dd/MM/yyyy')).toString();
                        ListData[i].PBDate = date1;
                    }
                    var reportObj = {
                        column1: ListData[i].PBId,
                        column2: reportName,
                        column3: ListData[i].PBNo,
                        column4: ListData[i].PBDate,
                        column5: ListData[i].SupplierName,
                        column6: ListData[i].ShipmentInfo

                    }
                    $scope.ReportDetailList.push(reportObj);
                }
            } else if (reportName == "SalesOrder") {
                for (var i = 0; i < ListData.length; i++) {
                    var res1 = ListData[i].SalesOrderDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDueDate1 = new Date(parseInt(ListData[i].SalesOrderDate.substr(6)));
                        var date1 = ($filter('date')(parsedDueDate1, 'dd/MM/yyyy')).toString();
                        ListData[i].SalesOrderDate = date1;
                    }
                    var reportObj = {
                        column1: ListData[i].SalesOrderId,
                        column2: reportName,
                        column3: ListData[i].SalesOrderNo,
                        column4: ListData[i].SalesOrderDate,
                        column5: ListData[i].CompanyName,
                        column6: ListData[i].ReferenceNo
                    }
                    $scope.ReportDetailList.push(reportObj);
                }
            } else if (reportName == "DeliveryChallan") {
                for (var i = 0; i < ListData.length; i++) {
                    var res1 = ListData[i].DeliveryDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDueDate1 = new Date(parseInt(ListData[i].DeliveryDate.substr(6)));
                        var date1 = ($filter('date')(parsedDueDate1, 'dd/MM/yyyy')).toString();
                        ListData[i].DeliveryDate = date1;
                    }
                    var reportObj = {
                        column1: ListData[i].DeliveryId,
                        column2: reportName,
                        column3: ListData[i].DeliveryNo,
                        column4: ListData[i].DeliveryDate,
                        column5: ListData[i].CompanyName,
                        column6: ListData[i].DeliveryFromDepartmentName
                    }
                    $scope.ReportDetailList.push(reportObj);
                }
            } else if (reportName == "SalesBill") {
                for (var i = 0; i < ListData.length; i++) {
                    var res1 = ListData[i].DeliveryDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDueDate1 = new Date(parseInt(ListData[i].DeliveryDate.substr(6)));
                        var date1 = ($filter('date')(parsedDueDate1, 'dd/MM/yyyy')).toString();
                        ListData[i].DeliveryDate = date1;
                    }
                    var reportObj = {
                        column1: ListData[i].DeliveryId,
                        column2: reportName,
                        column3: ListData[i].DeliveryNo,
                        column4: ListData[i].DeliveryDate,
                        column5: ListData[i].CompanyName,
                        column6: ListData[i].ReferenceNo
                    }
                    $scope.ReportDetailList.push(reportObj);
                }
            } else if (reportName == "InternalWorkOrderReport") {
                for (var i = 0; i < ListData.length; i++) {
                    var res1 = ListData[i].InternalWorkOrderDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDueDate1 = new Date(parseInt(ListData[i].InternalWorkOrderDate.substr(6)));
                        var date1 = ($filter('date')(parsedDueDate1, 'dd/MM/yyyy')).toString();
                        ListData[i].InternalWorkOrderDate = date1;
                    }
                    var reportObj = {
                        column1: ListData[i].InternalWorkOrderId,
                        column2: reportName,
                        column3: ListData[i].InternalWorkOrderNo,
                        column4: ListData[i].InternalWorkOrderDate,
                        column5: ListData[i].CompanyName,
                        column6: ListData[i].DepartmentName
                    }
                    $scope.ReportDetailList.push(reportObj);
                }
            }

            $scope.total_count = data.TotalRecord;
            //$scope.designationlist = data.ListData;
            //$scope.total_count = data.TotalRecord;
        });
    }

    $scope.buyerList = [{ value: 'Both', name: 'Both' }, { value: 'OnlyCustomer', name: 'Only Customer' }, { value: 'OnlyOnBehalf', name: 'Only On Behalf' }];
    $scope.ddlBuyer = { value: 'Both', name: 'Both' };
    $scope.saleTypeList = [{ id: 2, name: 'All' }, { id: 0, name: 'Sale' }, { id: 1, name: 'Canceled' }];
    $scope.ddlSaleType = { id: 2, name: 'All' }
    $scope.unitList = [{ id: 1, name: 'KG' }, { id: 2, name: 'Pack' }];
    $scope.ddlItemUnit = { id: 1, name: 'KG' };

    //$scope.ResetGrade = function() {
    //    $scope.ddlGrade = undefined;
    //    $scope.SalarySheetHeader1 = '';
    //    $scope.SalarySheetHeader2 = '';
    //    $scope.SalarySheetHeader3 = '';
    //}

    $scope.GetHeaders = function () {
        if (angular.isUndefined($scope.ddlGrade)) {
            return;
        }

        var month = angular.isUndefined($scope.ddlMonth) ? "" : $scope.ddlMonth.MonthName;
        var year = angular.isUndefined($scope.ddlYear) ? "" : $scope.ddlYear.YearName;

        if ($scope.ddlGrade.GradeName === 'Staff') {
            $scope.SalarySheetHeader1 = 'B/142, Road-22, New DOHS, Mohakhali, Dhaka-1206';
            $scope.SalarySheetHeader2 = 'PAY SHEET';
            $scope.SalarySheetHeader3 = 'For the Month of ' + month + ', ' + year;
        }
        else if ($scope.ddlGrade.GradeName === 'Labour') {
            $scope.SalarySheetHeader1 = 'Word-04, House-02, Road-01, Block-A, Nolvoge, Nishatnagar, Turag, Dhaka.';
            $scope.SalarySheetHeader2 = "Monthly Salary and Wages Sheet Workers";
            $scope.SalarySheetHeader3 = 'For the Month of ' + month + ', ' + year;
        }
        else {
            $scope.SalarySheetHeader1 = 'FSSFB-7, (Ground Floor East Wing) Dhaka Extension area-Bangladesh';
            $scope.SalarySheetHeader2 = 'Salary and Wages Sheet Worker';
            $scope.SalarySheetHeader3 = 'For the Month of ' + month + ', ' + year;
        }
    }

    $scope.UnitInLoad = function () {
        if ($scope.rbReport == 'SaleByOutlet') {
            $scope.ddlItemUnit = { id: 2, name: 'Pack' };
        }
        else {
            $scope.ddlItemUnit = { id: 1, name: 'KG' };
        }

        if ($scope.rbReport == 'SaleByQuantity') {
            $scope.rbSort = 'DESC';
        }
        Reset();
    }

    $scope.GetDepartmentByBranch = function () {
        if ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) {
            $scope.departmentlist = [];
            $scope.employeeByBranchList = [];
            $scope.UnitList = [];
        }
        else {
            $http({
                url: '/Department/GetAllActiveByBranchId?branchId=' + $scope.ddlBrunch.BranchId + '&departmentId=' + null,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.departmentlist = data;
                angular.forEach(data, function (adept) {
                    $scope.example8data.push({ id: adept.DepartmentId, label: adept.DepartmentName });
                })
            });

            $http({
                url: '/Employee/GetUserDynamic?searchCriteria=D.BranchId=' + $scope.ddlBrunch.BranchId + "&orderBy=FullName",
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.employeeByBranchList = data;
            });

            //if ($scope.ddlBrunch.BranchName !== 'Head Office')
            //    $scope.UnitList = [{ UnitName: 'Office' }, { UnitName: 'Label' }, { UnitName: 'Offset' }];
            //else
            //    $scope.UnitList = [];
        }
    }
    $scope.resetGrade = function () {
        $scope.ddlGrade.GradeId = '';
    }
    $scope.GetDepartmentByBranchAndGrade = function () {
        if ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) {
            $scope.departmentlist = [];
            $scope.employeeByBranchList = [];
            $scope.UnitList = [];
        }
        else {
            $http({
                url: '/Department/GetByBranchAndGrade?branchId=' + $scope.ddlBrunch.BranchId + '&gradeId=' + $scope.ddlGrade.GradeId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.departmentlist = [];
                $scope.example8data = [];
                $scope.departmentlist = data;
                angular.forEach(data,
                    function (adept) {
                        $scope.example8data.push({ id: adept.DepartmentId, label: adept.DepartmentName });
                    });
            });

            $http({
                url: '/Employee/GetUserDynamic?searchCriteria=D.BranchId=' + $scope.ddlBrunch.BranchId + "&orderBy=FullName",
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.employeeByBranchList = data;
            });

            //if ($scope.ddlBrunch.BranchName !== 'Head Office')
            //    $scope.UnitList = [{ UnitName: 'Office' }, { UnitName: 'Label' }, { UnitName: 'Offset' }];
            //else
            //    $scope.UnitList = [];
        }
    }


    $scope.GetActiveCustomer = function () {
        var criteria = "C.IsActive=1 AND C.BranchId =" + $scope.ddlOutLet.BranchId;
        $http({
            url: '/CustomerEntry/GetAllCustomerDynamic?searchCriteria=' + criteria + "&orderBy=CustomerTypeName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (activecustomerList) {
            $scope.ActiveCustomerList = activecustomerList;
            angular.forEach($scope.ActiveCustomerList, function (aCustomer) {
                aCustomer.FullName = aCustomer.Title + ' ' + aCustomer.FirstName + ' ' + aCustomer.MiddleName + ' ' + aCustomer.LastName;
            });
        })
    }

    $scope.CustomerDetail = function () {
        $scope.BarCodeCustomer = {};
        if (typeof $scope.CustomerName === 'object') {
            $scope.CustomerMobile = $scope.CustomerName.Mobile;
            $scope.BarCodeCustomer = $scope.CustomerName;
            $scope.CustomerName = $scope.CustomerName.FullName;
        }
        else {
            angular.forEach($scope.ActiveCustomerList, function (aActiveCustomer) {
                if ($scope.CustomerName == aActiveCustomer.FullName) {
                    $scope.BarCodeCustomer = aActiveCustomer;
                    $scope.CustomerMobile = aActiveCustomer.Mobile;
                    $scope.CustomerName = aActiveCustomer.FullName;
                }
            });
        }
        if (!$scope.BarCodeCustomer.hasOwnProperty('CustomerTypeId')) {
            $scope.BarCodeCustomer = {};
            $scope.CustomerName = '';
            $scope.CustomerMobile = '';
        }
    }

    $scope.GetRegisteredCustomer = function () {
        //$scope.BarCodeCustomer = {};
        //$scope.CustomerName = '';
        //$scope.CustomerMobile = '';

        keepGoing = true;
        angular.forEach($scope.departmentlist, function (adpt) {
            if (keepGoing) {
                if (adpt.BranchId == $scope.ddlBrunch.BranchId) {
                    $scope.ddlDepartment = { DepartmentId: adpt.DepartmentId }
                    keepGoing = false;
                }
            }
        });

        $scope.IsMultiSelect = false;
        GetCustomers();
    }

    $scope.CustomerTypeChange = function () {
        GetCustomers();
        $scope.selCustomerForMultiSelect = null;
    }

    $scope.SelectDefault = function () {
        //if ($scope.ddlBrunch == null || 0 || undefined) {
        //    $scope.ddlDepartment = null;
        //    $scope.ddlVariety = null;
        //}
        if ($scope.ddlCategory == null || 0 || undefined) {
            $scope.ddlSubCategory = null;
        }
        if ($scope.ddlSubCategory == null || 0 || undefined) {
            $scope.ddlVariety = null;
        }
    }

    $scope.GetVariety = function (subCategory) {
        if ($scope.ddlSubCategory == null || 0 || undefined) {
            $scope.ddlVariety = null;
        }

        var searchCriteria = 'I.SubCategoryId=' + subCategory.SubCategoryId;
        $http({
            url: '/Item/GetItemDynamic?searchCriteria=' + searchCriteria + '&orderBy=ItemName',
            Methode: 'GET',
            headers: { 'content-type': 'application/json' }
        }).success(function (varietyList) {
            $scope.VarietyList = varietyList;
        })
    }

    $scope.GetModelList = function (ddlVariety) {
        if ($scope.ddlVariety == null || 0 || undefined) {
            $scope.ddlProductModel = null;
        }

        $http({
            url: '/ItemAdditionalAttributeValue/GetByItemId?itemId=' + ddlVariety.ItemId,
            Methode: 'GET',
            headers: { 'content-type': 'application/json' }
        }).success(function (productModelList) {
            $scope.ProductModelList = productModelList;
        })
    }

    $scope.myEventListeners = {
        onItemSelect: onItemSelect,
        onItemDeselect: onItemDeselect,
        onSelectAll: onSelectAll,
        onDeselectAll: onDeselectAll
    };

    $scope.loadDataForReportGrid = function () {
        var fromDate = $("#txtFromDate").val();
        var toDate = $("#txtToDate").val();
        $scope.ReportHeader = [];
        $scope.ReportDetailList = [];


        if (fromDate == "" || toDate == "") {
            $scope.ShowReportDetailsGrid = false;
            alertify.log("From Date and To Date Both Are Required.  ", "error", 5000);
            return;
        }
        fromDate = fromDate.split("/");
        fromDate = fromDate[2] + "-" + fromDate[1] + "-" + fromDate[0];

        toDate = toDate.split("/");
        toDate = toDate[2] + "-" + toDate[1] + "-" + toDate[0] + " 23:59:59.000";

        $scope.ShowReportDetailsGrid = true;

        var wildCard = "";
        var headerValue = []
        if ($("#transId").val() != "") {
            wildCard += $("#transId").val();
        }

        if ($scope.rbReport == "ReceiptNote") {
            $scope.ReportTableHeader = "Receipt Note ";
            headerValue = ['PB No.', 'Date', 'Supplier', 'Ref No.'];
            GetReportTablePaged("/PurchaseBill/GetPaged", $scope.currentPage, fromDate, toDate, wildCard, 'PBDate', headerValue, "ReceiptNote");
        }
        else if ($scope.rbReport == "SalesOrder") {
            $scope.ReportTableHeader = "Sales Order ";
            headerValue = ['SO No.', 'Date', 'Company', 'Ref No'];
            GetReportTablePaged("/SalesOrder/GetPaged", $scope.currentPage, fromDate, toDate, wildCard, 'SalesOrderDate, SalesOrderNo', headerValue, "SalesOrder");
        }
        else if ($scope.rbReport == "DeliveryChallan") {
            $scope.ReportTableHeader = "Delivery Challan ";
            headerValue = ['Cha. No.', 'Date', 'Company', 'Delivery From'];
            GetReportTablePaged("/Delivery/GetPaged", $scope.currentPage, fromDate, toDate, wildCard, 'DeliveryDate', headerValue, "DeliveryChallan");
        }
        else if ($scope.rbReport == "SalesBill") {
            $scope.ReportTableHeader = "Sales Bill ";
            headerValue = ['Bill No.', 'Date', 'Company', 'Ref. No.'];
            GetReportTablePaged("/Delivery/GetPaged", $scope.currentPage, fromDate, toDate, wildCard, 'DeliveryDate', headerValue, "SalesBill");
        }
        else if ($scope.rbReport == "InternalWorkOrderReport") {
            $scope.ReportTableHeader = "IWO Report ";
            headerValue = ['IWO No.', 'Date', 'Company', 'Factory'];
            GetReportTablePaged("/InternalWorkOrder/GetPaged", $scope.currentPage, fromDate, toDate, wildCard, 'InternalWorkOrderDate', headerValue, "InternalWorkOrderReport");
        }
        else if ($scope.rbReport == "GatePass") {
            $scope.ReportTableHeader = "Gate Pass Report ";
            headerValue = ['Cha. No.', 'Date', 'Company', 'Delivery From'];
            GetReportTablePaged("/Delivery/GetPaged", $scope.currentPage, fromDate, toDate, wildCard, 'DeliveryDate', headerValue, "DeliveryChallan");
        }

    }

    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            //GetReportTablePaged($scope.currentPage, url, whereClause);
            $scope.loadDataForReportGrid();
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            //GetReportTablePaged($scope.currentPage, url, whereClause);
            $scope.loadDataForReportGrid();
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            //GetReportTablePaged($scope.currentPage, url, whereClause);
            $scope.loadDataForReportGrid();
        }
    };

    $scope.SelSingleReport = function (details) {
        $scope.ViewReportDetails = {};
        $scope.ViewReportDetails = details;
    }

    $scope.BindEmployeeByCompanyType = function (companyTypeId) {
        var criteria = "";
        if (!angular.isUndefined(companyTypeId) && companyTypeId != null)
            criteria += " AND EmployeeId IN (SELECT DISTINCT RefEmployeeId FROM ad_Company WHERE CompanyTypeId=" + companyTypeId + ")";
        GetAllEmployee(criteria);
    }

    $scope.BindCompanyByCompanyTypeAndEmployee = function (companyTypeId, employeeId) {
        var criteria = "";

        if (!angular.isUndefined(companyTypeId) && companyTypeId != null && companyTypeId != '')
            criteria += " AND C.CompanyTypeId=" + companyTypeId;

        if (!angular.isUndefined(employeeId) && employeeId != null && employeeId != '')
            criteria += " AND C.RefEmployeeId=" + employeeId;

        GetActiveCompany(criteria);
    }

    $scope.ReportViewButton = function () {
        var outletList = '';
        $scope.departmentIds = '';
        angular.forEach($scope.departmentIdList, function (data) {
            $scope.departmentIds += $scope.departmentIds == '' ? data.id : (',' + data.id)

        });
        if ($scope.rbReport == 'PaymentReport' || $scope.rbReport == 'PaymentReport' || $scope.rbReport == 'BalanceReport' || $scope.rbReport == 'SaleByOutlet' || $scope.rbReport == 'SaleByFarmer' || $scope.rbReport == 'VarietywiseSalesReport' || $scope.rbReport == 'VarietyWiseCustomerSalesReport') {
            $scope.ActiveCustomerList = [];
            if ($scope.CategoriesSelected.length == 0) {
                alertify.log('Select minimum One Outlet!', 'error', '5000');
                return
            }
            angular.forEach($scope.CategoriesSelected, function (aOutletList) {
                outletList += outletList == '' ? aOutletList.id : (',' + aOutletList.id);
            })
        }

        var fromDate = $('#txtFromDate').val();
        var toDate = $('#txtToDate').val();
        if (fromDate == "" || undefined || null) {
            fromDate = '01/01/2017';
        }
        if (toDate == "" || undefined || null) {
            toDate = $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy');
        }

        if ($scope.rbReport == 'CurrentStockAttribute') {
            var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
            var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
            var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
            var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
            var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
            $window.open("/ErpReports/RVStockCurrentByAttribute.aspx?DepartmentId=" + departmentId + "&CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&ItemId=" + itemId, "_blank", "width=1115,height=630,left=125,top=25");
        }

        if ($scope.rbReport == 'CurrentStock') {
            var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
            var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
            var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
            var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
            var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
            $window.open("/ErpReports/RVStockCurrent.aspx?BranchId=" + branchId + "&DepartmentId=" + departmentId + "&CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&ItemId=" + itemId, "_blank", "width=1115,height=630,left=125,top=25");
        }
        else if ($scope.rbReport == 'CurrentStockByAttribute') {
            var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
            var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
            var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
            var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
            var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
            $window.open("/ErpReports/RVStockCurrentByAdAttribute.aspx?BranchId=" + branchId + "&DepartmentId=" + departmentId + "&CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&ItemId=" + itemId, "_blank", "width=750,height=630,left=125,top=25");
        }
        else if ($scope.rbReport == 'StockLedger') {
            if ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) {
                alertify.log('Please select Branch!', 'error', '5000');
            }
            else {
                var dateParts = fromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = toDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];

                var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
                var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
                var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
                var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
                var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
                $window.open("/ErpReports/RVStockLedger.aspx?BranchId=" + branchId + "&DepartmentId=" + departmentId + "&CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&ItemId=" + itemId + "&FromDate=" + from + "&ToDate=" + to, "_blank", "width=1115,height=630,left=125,top=25");
            }
        }
        else if ($scope.rbReport == 'StockLedgerAttribute') {
            if ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) {
                alertify.log('Please select Store!', 'error', '5000');
            }
            else {
                var dateParts = fromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = toDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];

                var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
                var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
                var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
                var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
                $window.open("/ErpReports/RVStockLedgerAttribute.aspx?DepartmentId=" + departmentId + "&CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&ItemId=" + itemId + "&FromDate=" + from + "&ToDate=" + to, "_blank", "width=1115,height=630,left=125,top=25");
            }
        }
        else if ($scope.rbReport == 'StockReorderLevel') {
            if ($scope.ddlItemUnit === undefined || $scope.ddlItemUnit == null) {
                alertify.log('Please select unit!', 'error', '5000');
            }
            else {
                var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
                var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
                var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
                var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
                var unitName = ($scope.ddlItemUnit === undefined || $scope.ddlItemUnit == null) ? null : $scope.ddlItemUnit.name;
                var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
                $window.open("/ErpReports/RVStockVsReorderLevel.aspx?BranchId=" + branchId + "&DepartmentId=" + departmentId + "&CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&UnitName=" + unitName + "&ItemId=" + itemId, "_blank", "width=1115,height=630,left=125,top=25");
            }
        }
        else if ($scope.rbReport == 'StockReceive') {
            var dateParts = fromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
            var dateParts2 = toDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
            var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
            var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
            var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
            var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
            var unitName = ($scope.ddlItemUnit === undefined || $scope.ddlItemUnit == null) ? null : $scope.ddlItemUnit.name;
            var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
            $window.open("/ErpReports/RVReceiveByDate.aspx?CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&FromDate=" + from + "&ToDate=" + to + "&BranchId=" + branchId + "&DepartmentId=" + departmentId + "&UnitName=" + unitName + "&ItemId=" + itemId, "_blank", "width=1115,height=630,left=125,top=25");
        }
        else if ($scope.rbReport == 'SaleByDate') {
            if ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) {
                alertify.log('Please select Branch!', 'error', '5000');
            }
            else {
                var dateParts = fromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = toDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];

                var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
                var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
                var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
                var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
                var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
                $window.open("/ErpReports/RVSaleByDate.aspx?BranchId=" + branchId + "&DepartmentId=" + departmentId + "&CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&ItemId=" + itemId + "&FromDate=" + from + "&ToDate=" + to, "_blank", "width=1115,height=630,left=125,top=25");
            }
        }
        else if ($scope.rbReport == 'SalesInvoiceReport') {
            var dateParts = fromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

            var dateParts2 = toDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
            var saleType = ($scope.ddlSaleType === undefined || $scope.ddlSaleType == null || $scope.ddlSaleType.name == "All") ? null : $scope.ddlSaleType.id;
            var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
            var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
            $window.open("/ErpReports/RVSalesInvoice.aspx?BranchId=" + branchId + "&DepartmentId=" + departmentId + "&FromDate=" + from + "&ToDate=" + to + "&IsVoid=" + saleType, "_blank", "width=1115px,height=630,left=150,top=25");

        }
        else if ($scope.rbReport == 'SaleByQuantity') {
            if ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) {
                alertify.log('Please select Branch!', 'error', '5000');
            }
            else {
                var dateParts = fromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = toDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];

                var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
                var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
                var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
                var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
                var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
                var sort = $scope.rbSort;
                $window.open("/ErpReports/RVSaleByQuantity.aspx?BranchId=" + branchId + "&DepartmentId=" + departmentId + "&CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&ItemId=" + itemId + "&SortDirection=" + sort + "&FromDate=" + from + "&ToDate=" + to, "_blank", "width=800px,height=630,left=340,top=25");
            }
        }
        else if ($scope.rbReport == 'StockIssue') {
            if ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) {
                alertify.log('Please select Branch!', 'error', '5000');
            }
            else {
                var dateParts = fromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = toDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];

                var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
                var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
                var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
                var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
                var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
                $window.open("/ErpReports/RVStockIssueByDate.aspx?BranchId=" + branchId + "&DepartmentId=" + departmentId + "&CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&ItemId=" + itemId + "&FromDate=" + from + "&ToDate=" + to, "_blank", "width=1115px,height=630,left=125,top=25");
            }
        }
        else if ($scope.rbReport == 'SaleByFarmer') {
            var dateParts = fromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
            var dateParts2 = toDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
            var branchId = outletList;
            var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
            var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
            var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
            var unitName = ($scope.ddlItemUnit === undefined || $scope.ddlItemUnit == null) ? null : $scope.ddlItemUnit.name;
            var saleType = ($scope.ddlSaleType === undefined || $scope.ddlSaleType == null || $scope.ddlSaleType.name == "All") ? null : $scope.ddlSaleType.id;
            var customertypeId = ($scope.ddlCustomerType === undefined || $scope.ddlCustomerType == null) ? null : $scope.ddlCustomerType.CustomerTypeId;
            var cusCode = ($scope.selCustomerForMultiSelect === undefined || $scope.selCustomerForMultiSelect == null) ? null : $scope.selCustomerForMultiSelect.CustomerCode;
            $window.open("/ErpReports/RVSaleByFarmer.aspx?BranchId=" + branchId + "&CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&FromDate=" + from + "&ToDate=" + to + "&UnitName=" + unitName + "&SaleType=" + saleType + "&ItemId=" + itemId + "&CustomertypeId=" + customertypeId + "&CustomerCode=" + cusCode, "_blank", "width=1366,height=630,left=125,top=25");
        }
        else if ($scope.rbReport == 'VarietywiseSalesReport') {
            var dateParts = fromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
            var dateParts2 = toDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
            var branchId = outletList;
            var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
            var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
            var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
            var unitName = ($scope.ddlItemUnit === undefined || $scope.ddlItemUnit == null) ? null : $scope.ddlItemUnit.name;
            var saleType = ($scope.ddlSaleType === undefined || $scope.ddlSaleType == null || $scope.ddlSaleType.name == "All") ? null : $scope.ddlSaleType.id;
            $window.open("/ErpReports/RVSaleByItem.aspx?BranchId=" + branchId + "&CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&FromDate=" + from + "&ToDate=" + to + "&UnitName=" + unitName + "&SaleType=" + saleType + "&ItemId=" + itemId, "_blank", "width=1366,height=630,left=125,top=25");
        }
        else if ($scope.rbReport == 'VarietyWiseCustomerSalesReport') {
            var dateParts = fromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
            var dateParts2 = toDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
            var branchId = outletList;
            var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
            var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
            var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
            var unitName = ($scope.ddlItemUnit === undefined || $scope.ddlItemUnit == null) ? null : $scope.ddlItemUnit.name;
            var saleType = ($scope.ddlSaleType === undefined || $scope.ddlSaleType == null || $scope.ddlSaleType.name == "All") ? null : $scope.ddlSaleType.id;
            var customertypeId = ($scope.ddlCustomerType === undefined || $scope.ddlCustomerType == null) ? null : $scope.ddlCustomerType.CustomerTypeId;
            var cusCode = ($scope.selCustomerForMultiSelect === undefined || $scope.selCustomerForMultiSelect == null) ? null : $scope.selCustomerForMultiSelect.CustomerCode;
            $window.open("/ErpReports/RVSaleByCustomerItem.aspx?BranchId=" + branchId + "&CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&FromDate=" + from + "&ToDate=" + to + "&UnitName=" + unitName + "&SaleType=" + saleType + "&ItemId=" + itemId + "&CustomertypeId=" + customertypeId + "&CustomerCode=" + cusCode, "_blank", "width=1366,height=630,left=125,top=25");
        }
        else if ($scope.rbReport == 'LeadingCustomerWiseSalesReport') {
            var dateParts = fromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
            var dateParts2 = toDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
            var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
            var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
            var catId = ($scope.ddlCategory === undefined || $scope.ddlCategory == null) ? null : $scope.ddlCategory.CategoryId;
            var subcatId = ($scope.ddlSubCategory === undefined || $scope.ddlSubCategory == null) ? null : $scope.ddlSubCategory.SubCategoryId;
            var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
            var unitName = ($scope.ddlItemUnit === undefined || $scope.ddlItemUnit == null) ? null : $scope.ddlItemUnit.name;
            var saleType = ($scope.ddlSaleType === undefined || $scope.ddlSaleType == null || $scope.ddlSaleType.name == "All") ? null : $scope.ddlSaleType.id;
            var customertypeId = ($scope.ddlCustomerType === undefined || $scope.ddlCustomerType == null) ? null : $scope.ddlCustomerType.CustomerTypeId;
            var buyerType = ($scope.ddlBuyer === undefined || $scope.ddlBuyer == null) ? null : $scope.ddlBuyer.value;
            var cusCode = ($scope.ddlCustomer === undefined || $scope.ddlCustomer == null) ? null : $scope.ddlCustomer.CustomerCode;
            $window.open("/ErpReports/RVSaleByCustomerWithRef.aspx?BranchId=" + branchId + "&DepartmentId=" + departmentId + "&CategoryId=" + catId + "&SubcategoryId=" + subcatId + "&FromDate=" + from + "&ToDate=" + to + "&UnitName=" + unitName + "&SaleType=" + saleType + "&ItemId=" + itemId + "&CustomertypeId=" + customertypeId + "&BuyerType=" + buyerType + "&CustomerCode=" + cusCode, "_blank", "width=1366,height=630,left=125,top=25");
        }
        else if ($scope.rbReport == 'PaymentReport') {
            var dateParts = fromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

            var dateParts2 = toDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
            var branchId = outletList;;
            var bankId = ($scope.ddlBank === undefined || $scope.ddlBank == null) ? null : $scope.ddlBank.BankId;
            $window.open("/ErpReports/RV_pos_PaymentToBank.aspx?BranchId=" + branchId + "&FromDate=" + from + "&ToDate=" + to + "&BankId=" + bankId, "_blank", "width=790,height=630,left=340,top=25");
        }
        else if ($scope.rbReport == 'BalanceReport') {
            var dateParts = fromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

            var dateParts2 = toDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
            var branchId = outletList;
            $window.open("/ErpReports/RV_pos_SaleBalance.aspx?BranchId=" + branchId + "&FromDate=" + from + "&ToDate=" + to, "_blank", "width=790,height=630,left=340,top=25");
        }
        else if ($scope.rbReport == 'SaleComparison') {
            $window.open("/ErpReports/RV_pos_SaleComparison.aspx", "_blank", "width=770,height=630,left=340,top=25");
        }
        else if ($scope.rbReport == 'ReceiptNote') {
            if (!$scope.ReportDetailList.length) {
                alertify.log('Please Search for Receipt Note.', 'error', '5000');
                return;
            }
            if ($scope.ViewReportDetails == null) {
                alertify.log('Please select Receipt Note.', 'error', '5000');
                return;
            }
            $window.open("/ErpReports/RV_Inv_PurchaseBillByPBId.aspx?PBId=" + $scope.ViewReportDetails.column1, "_blank", "width=790,height=630,left=340,top=25");
        }
        else if ($scope.rbReport == 'SalesOrder') {
            if (!$scope.ReportDetailList.length) {
                alertify.log('Please Search for Sales Order.', 'error', '5000');
                return;
            }
            if ($scope.ViewReportDetails == null) {
                alertify.log('Please select Sales Order No.', 'error', '5000');
                return;
            }

            $window.open("/ErpReports/RV_Pos_SalesOrderBySalesOrderId.aspx?SalesOrderId=" + $scope.ViewReportDetails.column1, "_blank", "width=790,height=630,left=340,top=25");
        }
        else if ($scope.rbReport == 'DeliveryChallan') {
            if (!$scope.ReportDetailList.length) {
                alertify.log('Please Search for Delivery Challan.', 'error', '5000');
                return;
            }
            if ($scope.ViewReportDetails == null) {
                alertify.log('Please select Delivery No.', 'error', '5000');
                return;
            }

            $window.open("/ErpReports/RV_Pos_DeliveryChallanByDeliveryId.aspx?DeliveryId=" + $scope.ViewReportDetails.column1, "_blank", "width=790,height=630,left=340,top=25");
        }
        else if ($scope.rbReport == 'GatePass') {
            if (!$scope.ReportDetailList.length) {
                alertify.log('Please Search for Gate Pass List.', 'error', '5000');
                return;
            }
            if ($scope.ViewReportDetails == null) {
                alertify.log('Please select Gate Pass.', 'error', '5000');
                return;
            }

            if ($scope.rbReturnType == 'Returnable')
                $window.open("/ErpReports/RV_inv_GatePass.aspx?DeliveryId=" + $scope.ViewReportDetails.column1, "_blank", "width=790,height=630,left=340,top=25");
            else
                $window.open("/ErpReports/RV_inv_GatePass2.aspx?DeliveryId=" + $scope.ViewReportDetails.column1, "_blank", "width=790,height=630,left=340,top=25");
        }
        else if ($scope.rbReport == 'ArDue') {
            var comTypeId = (angular.isUndefined($scope.ddlCompanyType) || $scope.ddlCompanyType == null) ? null : $scope.ddlCompanyType.CompanyTypeId;
            var empId = (angular.isUndefined($scope.ddlEmployee) || $scope.ddlEmployee == null) ? null : $scope.ddlEmployee.EmployeeId;
            var comId = (angular.isUndefined($scope.ddlCompany) || $scope.ddlCompany == null) ? null : $scope.ddlCompany.CompanyId;


            $window.open("/ErpReports/RV_rcv_AllCustomerDue.aspx?CompanyTypeId=" + comTypeId + "&EmployeeId=" + empId + "&CompanyId=" + comId, "_blank", "width=790,height=630,left=340,top=25");
        }
        else if ($scope.rbReport == 'ArSummary') {
            if (angular.isUndefined($scope.FromDate) || $scope.FromDate == null || angular.isUndefined($scope.ToDate) || $scope.ToDate == null) {
                alertify.log('From Date & To Date Both are Required.', 'error', '5000');
            } else {
                var dateParts = $scope.FromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = $scope.ToDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];

                var comTypeId = (angular.isUndefined($scope.ddlCompanyType) || $scope.ddlCompanyType == null) ? null : $scope.ddlCompanyType.CompanyTypeId;
                var empId = (angular.isUndefined($scope.ddlEmployee) || $scope.ddlEmployee == null) ? null : $scope.ddlEmployee.EmployeeId;
                var comId = (angular.isUndefined($scope.ddlCompany) || $scope.ddlCompany == null) ? null : $scope.ddlCompany.CompanyId;

                $window.open("/ErpReports/RV_rcv_CustomerSaleVsCollection.aspx?CompanyTypeId=" + comTypeId + "&EmployeeId=" + empId + "&CompanyId=" + comId + "&FromDate=" + from + "&ToDate=" + to, "_blank", "width=1115,height=630,left=125,top=25");
            }
        }
        else if ($scope.rbReport == 'AcLedger') {
            if (angular.isUndefined($scope.FromDate) || $scope.FromDate == null || angular.isUndefined($scope.ToDate) || $scope.ToDate == null) {
                alertify.log('From Date & To Date Both are Required.', 'error', '5000');
            } else {
                var dateParts = $scope.FromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = $scope.ToDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];

                var comId = (angular.isUndefined($scope.ddlCompany) || $scope.ddlCompany == null) ? null : $scope.ddlCompany.CompanyId;

                $window.open("/ErpReports/RV_rcv_CustomerLedger.aspx?CompanyId=" + comId + "&FromDate=" + from + "&ToDate=" + to, "_blank", "width=790,height=630,left=340,top=25");
            }
        }
        else if ($scope.rbReport == 'AttDtl') {
            if ($scope.ddlEmployeeByBranch === undefined || $scope.ddlEmployeeByBranch == null) {
                alertify.log('Please select Employee!', 'error', '5000');
                return;
            }

            if (angular.isUndefined($scope.FromDate) || $scope.FromDate == null || angular.isUndefined($scope.ToDate) || $scope.ToDate == null) {
                alertify.log('From Date & To Date Both are Required.', 'error', '5000');
            } else {
                var dateParts = $scope.FromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = $scope.ToDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];

                $window.open("/ErpReports/RV_hr_AttendanceDetail.aspx?EmployeeId=" + $scope.ddlEmployeeByBranch.EmployeeId + "&FromDate=" + from + "&ToDate=" + to, "_blank", "width=790,height=630,left=340,top=25");
            }
        }
        else if ($scope.rbReport == 'AttSum') {
            if ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) {
                alertify.log('Please select Branch!', 'error', '5000');
                return;
            }
            if (angular.isUndefined($scope.FromDate) || $scope.FromDate == null || angular.isUndefined($scope.ToDate) || $scope.ToDate == null) {
                alertify.log('From Date & To Date Both are Required.', 'error', '5000');
            } else {
                var dateParts = $scope.FromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = $scope.ToDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];

                var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
                var gradeId = ($scope.ddlGrade === undefined || $scope.ddlGrade == null) ? null : $scope.ddlGrade.GradeId;
                var departmentId = ($scope.departmentIdList === undefined || $scope.departmentIdList == null) ? null : $scope.departmentIds;
                var sectionId = ($scope.ddlSection === undefined || $scope.ddlSection == null) ? null : $scope.ddlSection.SectionId;

                $window.open("/ErpReports/RV_hr_AttendanceSummary.aspx?BranchId=" + branchId + "&GradeId=" + gradeId + "&fdt=" + from + "&tdt=" + to + "&EmployeeId=" + 0 + "&DepartmentId=" + departmentId + "&SectionId=" + sectionId, "_blank", "width=1115,height=630,left=125,top=25");
            }
        }

        else if ($scope.rbReport == 'AttSumWithOT') {
            if ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) {
                alertify.log('Please select Branch!', 'error', '5000');
                return;
            }

            if (angular.isUndefined($scope.FromDate) || $scope.FromDate == null || angular.isUndefined($scope.ToDate) || $scope.ToDate == null) {
                alertify.log('From Date & To Date Both are Required.', 'error', '5000');
            }
            else {
                var dateParts = $scope.FromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = $scope.ToDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];

                var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;

                $window.open("/ErpReports/RV_hr_AttendanceSummaryWithOT.aspx?BranchId=" + branchId + "&GradeId=" + 0 + "&FromDate=" + from + "&ToDate=" + to + "&EmployeeId=" + 0 + "&DepartmentId=" + 0 + "&SectionId=" + 0, "_blank", "width=1115,height=630,left=125,top=25");
            }
        }
        else if ($scope.rbReport == 'SalesBill') {
            if (!$scope.ReportDetailList.length) {
                alertify.log('Please Search for Sales Bill.', 'error', '5000');
                return;
            }
            if ($scope.ViewReportDetails == null) {
                alertify.log('Please select Bill No.', 'error', '5000');
                return;
            }

            $window.open("/ErpReports/RV_Pos_SalesBillByDeliveryId.aspx?DeliveryId=" + $scope.ViewReportDetails.column1, "_blank", "width=790,height=630,left=340,top=25");
        }
        else if ($scope.rbReport == 'InternalWorkOrderReport') {
            if (!$scope.ReportDetailList.length) {
                alertify.log('Please Search for Internal Work Order No.', 'error', '5000');
                return;
            }
            if ($scope.ViewReportDetails == null) {
                alertify.log('Please select an Internal Work Order No.', 'error', '5000');
                return;
            }

            $window.open("/ErpReports/RV_inv_InternalWorkOrderByInternalWorkOrderId.aspx?internalWorkOrderId=" + $scope.ViewReportDetails.column1, "_blank", "width=1150,height=630,left=125,top=25");
        }
        else if ($scope.rbReport == 'ProductSerialNo') {
            var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
            var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
            var itemId = ($scope.ddlVariety === undefined || $scope.ddlVariety == null) ? null : $scope.ddlVariety.ItemId;
            var value = ($scope.ddlProductModel === undefined || $scope.ddlProductModel == null) ? null : $scope.ddlProductModel.Value;
            $window.open("/ErpReports/RV_inv_StockBySerialNo.aspx?BranchId=" + branchId + "&DepartmentId=" + departmentId + "&ItemId=" + itemId + "&Value=" + value, "_blank", "width=1366,height=630,left=125,top=25");
        }
        else if ($scope.rbReport == 'DateWiseProductionStatus') {
            if (angular.isUndefined($scope.FromDate) || $scope.FromDate == null || angular.isUndefined($scope.ToDate) || $scope.ToDate == null) {
                alertify.log('From Date & To Date Both are Required.', 'error', '5000');
            } else {
                var dateParts = $scope.FromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = $scope.ToDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];

                $window.open("/ErpReports/RV_pro_DateWiseProductionStatus.aspx?fromDate=" + from + "&toDate=" + to, "_blank", "width=1115,height=630,left=125,top=25");
            }
        }
        else if ($scope.rbReport == 'PurchaseBySupplier') {
            if (angular.isUndefined($scope.FromDate) || $scope.FromDate == null || angular.isUndefined($scope.ToDate) || $scope.ToDate == null) {
                alertify.log('From Date & To Date Both are Required.', 'error', '5000');
            } else {
                var dateParts = $scope.FromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = $scope.ToDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
                var supplierId;
                if (angular.isUndefined($scope.ddlSupplier) || $scope.ddlSupplier == null) {
                    supplierId = null;
                } else {
                    supplierId = $scope.ddlSupplier.SupplierId;
                }
                $window.open("/ErpReports/RV_inv_PurchaseBySupplier.aspx?SupplierId=" + supplierId + "&FromDate=" + from + "&ToDate=" + to, "_blank", "width=790,height=630,left=125,top=25");
            }
        }
        else if ($scope.rbReport == 'SaleReportByCompany') {
            if (angular.isUndefined($scope.FromDate) || $scope.FromDate == null || angular.isUndefined($scope.ToDate) || $scope.ToDate == null) {
                alertify.log('From Date & To Date Both are Required.', 'error', '5000');
            } else {
                var dateParts = $scope.FromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = $scope.ToDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
                var CompanyId;
                if (angular.isUndefined($scope.ddlCompany) || $scope.ddlCompany == null) {
                    CompanyId = null;
                } else {
                    CompanyId = $scope.ddlCompany.CompanyId;
                }
                $window.open("/ErpReports/RV_pos_SaleByCompany.aspx?CompanyId=" + CompanyId + "&FromDate=" + from + "&ToDate=" + to, "_blank", "width=790,height=630,left=125,top=25");
            }
        }
        else if ($scope.rbReport == 'StockSummary') {
            if (angular.isUndefined($scope.FromDate) || $scope.FromDate == null || angular.isUndefined($scope.ToDate) || $scope.ToDate == null) {
                alertify.log('From Date & To Date Both are Required.', 'error', '5000');
            } else {
                var dateParts = $scope.FromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

                var dateParts2 = $scope.ToDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
                console.log(from + '' + to);
                var ItemId;
                if (angular.isUndefined($scope.ddlVariety) || $scope.ddlVariety == null) {
                    ItemId = null;
                } else {
                    ItemId = $scope.ddlVariety.ItemId;
                }
                //$window.open("/ErpReports/RV_inv_StockLedgerSummary.aspx?FromDate=" + from + "&ToDate=" + to + "&ItemId=" + ItemId, "_blank", "width=1115,height=630,left=125,top=25");
                $window.open("/ErpReports/RV_inv_StockLedgerSummary.aspx?FromDate=" + from + "&ToDate=" + to + "&ItemId=" + ItemId, "_blank", "width=1115,height=630,left=125,top=25");

            }
        }
        else if ($scope.rbReport == 'SalSheet') {
            if ($scope.ddlYear === undefined || $scope.ddlYear == null) {
                alertify.log('Please select Year!', 'error', '5000');
                return;
            }
            if ($scope.ddlMonth === undefined || $scope.ddlMonth == null) {
                alertify.log('Please select Month!', 'error', '5000');
                return;
            }
            if ($scope.ddlGrade === undefined || $scope.ddlGrade == null) {
                alertify.log('Please select Grade!', 'error', '5000');
                return;
            }
            var branchName = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchName;
            var departmentName = ($scope.departmentIdList === undefined || $scope.departmentIdList == null) ? null : $scope.departmentIds;
            var sectionName = ($scope.ddlSection === undefined || $scope.ddlSection == null) ? null : $scope.ddlSection.SectionName;

            if ($scope.ddlBrunch.BranchName == 'Savar EPZ' && ($scope.ddlGrade.GradeName == 'Staff' || $scope.ddlGrade.GradeName == 'Labour EPZ')) {
                $window.open("/ErpReports/RV_hr_SalarySheetEPZ.aspx?MonthId=" + $scope.ddlMonth.MonthId +
                    "&YearId=" + $scope.ddlYear.YearId +
                    "&GradeId=" + $scope.ddlGrade.GradeId +
                    "&BranchName=" + branchName +
                    "&UnitName=" + sectionName +
                    "&DepartmentName=" + departmentName +
                    "&Header1=" + $scope.SalarySheetHeader1 +
                    "&Header2=" + $scope.SalarySheetHeader2 +
                    "&Header3=" + $scope.SalarySheetHeader3, "_blank", "width=1200,height=630,left=125,top=25");
            }
            else if ($scope.ddlGrade.GradeName == 'Staff') {
                $window.open("/ErpReports/RV_hr_SalarySheet.aspx?MonthId=" + $scope.ddlMonth.MonthId +
                    "&YearId=" + $scope.ddlYear.YearId +
                    "&GradeId=" + $scope.ddlGrade.GradeId +
                    "&BranchName=" + branchName +
                    "&UnitName=" + sectionName +
                    "&DepartmentName=" + departmentName +
                    "&Header1=" + $scope.SalarySheetHeader1 +
                    "&Header2=" + $scope.SalarySheetHeader2 +
                    "&Header3=" + $scope.SalarySheetHeader3, "_blank", "width=1200,height=630,left=125,top=25");
            }
            else if ($scope.ddlGrade.GradeName == 'Labour') {
                $window.open("/ErpReports/RV_hr_SalarySheetNonEPZ.aspx?MonthId=" +
                    $scope.ddlMonth.MonthId +
                    "&YearId=" + $scope.ddlYear.YearId +
                    "&GradeId=" + $scope.ddlGrade.GradeId +
                    "&BranchName=" + branchName +
                    "&UnitName=" + sectionName +
                    "&DepartmentName=" + departmentName +
                    "&Header1=" + $scope.SalarySheetHeader1 +
                    "&Header2=" + $scope.SalarySheetHeader2 +
                    "&Header3=" + $scope.SalarySheetHeader3, "_blank", "width=1200,height=630,left=125,top=25");
            } else {
                alertify.log('Please select Branch and Grade Correctly !', 'error', '5000');
                return;
            }
        }
        else if ($scope.rbReport == 'LeaveBalance') {
            if ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) {
                alertify.log('Please select Branch!', 'error', '5000');
                return;
            }

            var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
            var gradeId = ($scope.ddlGrade === undefined || $scope.ddlGrade == null) ? null : $scope.ddlGrade.GradeId;
            var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
            var sectionId = ($scope.ddlSection === undefined || $scope.ddlSection == null) ? null : $scope.ddlSection.SectionId;
            var employeeId = ($scope.ddlEmployeeByBranch === undefined || $scope.ddlEmployeeByBranch == null) ? null : $scope.ddlEmployeeByBranch.EmployeeId;


            $window.open("/ErpReports/RV_hr_LeaveBalance.aspx?YearId=" + $scope.ddlYear.YearId +
                "&BranchId=" + branchId +
                "&GradeId=" + gradeId +
                "&DepartmentId=" + departmentId +
                "&SectionId=" + sectionId +
                "&EmployeeId=" + employeeId, "_blank", "width=1200,height=630,left=125,top=25");

        }
        else if ($scope.rbReport == 'SalaryHistory') {
            if ($scope.ddlFromMonthYear === undefined || $scope.ddlFromMonthYear == null) {
                alertify.log('Please select Month Year From!', 'error', '5000');
                return;
            }
            if ($scope.ddlToMonthYear === undefined || $scope.ddlToMonthYear == null) {
                alertify.log('Please select Month Year To!', 'error', '5000');
                return;
            }

            var branchId = ($scope.ddlBrunch === undefined || $scope.ddlBrunch == null) ? null : $scope.ddlBrunch.BranchId;
            var gradeId = ($scope.ddlGrade === undefined || $scope.ddlGrade == null) ? null : $scope.ddlGrade.GradeId;
            var departmentId = ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) ? null : $scope.ddlDepartment.DepartmentId;
            var sectionId = ($scope.ddlSection === undefined || $scope.ddlSection == null) ? null : $scope.ddlSection.SectionId;
            var employeeId = ($scope.ddlEmployeeByBranch === undefined || $scope.ddlEmployeeByBranch == null) ? null : $scope.ddlEmployeeByBranch.EmployeeId;


            $window.open("/ErpReports/RV_hr_SalaryHistory.aspx?FromMonthYear=" + $scope.ddlFromMonthYear.MonthYearId +
                "&ToMonthYear=" + $scope.ddlToMonthYear.MonthYearId +
                "&BranchId=" + branchId +
                "&GradeId=" + gradeId +
                "&DepartmentId=" + departmentId +
                "&SectionId=" + sectionId +
                "&EmployeeId=" + employeeId, "_blank", "width=1200,height=630,left=125,top=25");

        }
    }

    $scope.SaleComparison = function () {
        $http({
            url: '/Sale/GetMonthlyComparison',
            Methode: 'GET',
            headers: { 'content-type': 'application/json' }
        }).success(function (saleComparisonList) {
            $scope.saleComparisonDataList = saleComparisonList;
            var labelsList = [];
            var firstBarList = [];
            var secondBarList = [];
            var thirdBarList = [];
            angular.forEach($scope.saleComparisonDataList, function (aselComparison) {
                labelsList.push(aselComparison.DepartmentName);
                firstBarList.push(aselComparison.SaleToday);
                secondBarList.push(aselComparison.SaleThisMonth);
                thirdBarList.push(aselComparison.SaleLastMonth);
            })
            var comparisonBarChartData = {
                labels: labelsList,
                datasets: [{
                    legendText: 'Last Month',
                    fillColor: "rgba(100,100,100,0.5)",
                    strokeColor: "rgba(100,100,100,1)",
                    data: firstBarList
                },
                {
                    label: 'Current Month',
                    fillColor: "rgba(220,220,220,0.5)",
                    strokeColor: "rgba(220,220,220,1)",
                    data: secondBarList
                },
                {
                    label: 'Previus Month',
                    fillColor: "rgba(0,60,100,1)",
                    strokeColor: "black",
                    data: thirdBarList
                }]
            }

            $('#modChart').on('shown.bs.modal', function (event) {
                var ctx = document.getElementById("canvas").getContext("2d");
                var barChart = new Chart(ctx).Bar(comparisonBarChartData, {
                    responsive: true,
                    barValueSpacing: 0
                })
            }).on('hidden.bs.modal', function (event) {
                var modal = $(this);
                var canvas = modal.find('.modal-body canvas');
                $(this).data('bs.modal', null);
            });
        })
    }

    $(document).on("click", "input[type='radio']", function () {
        var data = $(this).val();

        if (data == "Returnable" || data == "NonReturnable") {
            return;
        }

        $scope.ShowReportDetailsGrid = false;
        $scope.ReportHeader = [];
        $scope.ReportDetailList = [];
        $scope.ViewReportDetails = null;

        setTodayToDateRange();

        if (data == "ReceiptNote" || data == "SalesOrder" || data == "DeliveryChallan" || data == "InternalWorkOrderReport" || data == "SalesBill" || data == "GatePass")
            $scope.loadDataForReportGrid();

        var fixeText = "Type Exact or Part of ";
        if (data == "ReceiptNote") {
            $("#transId").attr("placeholder", fixeText + "Recipet Note No.");
        }
        else if (data == "SalesOrder") {
            $("#transId").attr("placeholder", fixeText + "Sales Order No.");
        }
        else if (data == "DeliveryChallan" || data == "GatePass" || data == "Returnable" || data == "NonReturnable") {
            $("#transId").attr("placeholder", fixeText + "Delivery Chalan No.");
        }
        else if (data == "InternalWorkOrderReport") {
            $("#transId").attr("placeholder", fixeText + "IWO No.");
        }
        else if (data == "SalesBill") {
            $("#transId").attr("placeholder", fixeText + "Sales Bill No.");
        }
        else {
            $("#transId").attr("placeholder", "");
        }

        if ((data == "ArDue" || data == "ArSummary" || data == "AcLedger") && $scope.companyList.length < $scope.companyMainList.length)
            $scope.companyList = $scope.companyMainList;
    });

    //$scope.BindUserBranch = function () {
    //   // $scope.UserDepartmentList = [];
    //    $scope.sectionList = [];
    //    console.log($scope.departmentlist);
    //    var dept = Enumerable.From($scope.departmentlist).Where("$.DepartmentId === " + $scope.ddlDepartment.DepartmentId).FirstOrDefault();

    //    if ($scope.ddlDepartment != null && !angular.isUndefined(dept) && dept.IsUnit) {
    //        $http({
    //            url: '/Employee/GetSectionByDepartmentId?departmentId=' + $scope.ddlDepartment.DepartmentId,
    //            method: 'GET',
    //            headers: { 'Content-Type': 'application/json' }
    //        }).success(function (data) {
    //            $scope.sectionList = data;
    //        });
    //    }

    //}

    $scope.GetSectionByDepartment = function () {
        if ($scope.ddlDepartment === undefined || $scope.ddlDepartment == null) {
            $scope.sectionList = [];
        }
        else {
            $http({
                url: '/Employee/GetSectionByDepartmentId?departmentId=' + $scope.ddlDepartment.DepartmentId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.sectionList = data;
            });
        }
    }
});
