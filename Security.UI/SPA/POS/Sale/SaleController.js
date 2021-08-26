app.controller("SaleController", function ($scope,$rootScope, $cookieStore, $http, $filter) {
    var SaleDetailIdTemp = 100;
    var PaymentChkIdTemp = 100;
    $scope.LoginUser = $cookieStore.get('UserData');
    load();
    var OfferProduct = [{ ItemId: 13, ItemName: 'Punjabi', OfferOn: 1850 }, { ItemId: 19, ItemName: 'POLO T-Shirt (Thai)', OfferOn: 1550 }, { ItemId: 20, ItemName: 'U2 T-Shirt (Thai)', OfferOn: 1650 }]
    function load() {
            $scope.CustomerDetails = {};
            $scope.pos_Sale = { InvoiceNo: new Date().getFullYear().toString() + (new Date().getMonth() + 1).toString() + new Date().getDate().toString() + new Date().getHours().toString() + new Date().getMinutes().toString() + new Date().getSeconds().toString(), MemoNo: 'N/A', SalesmanName: $scope.LoginUser.FullName, RefCustomerId: 0, OfferId: 0, OfferName: 'Non-Coupon', OffPercentage: 0, CustomerTypeName: 'Un-Registered' };
            $scope.nonRegCustomer = { CustomerId: 0, Title: '', FirstName: '', MiddleName: '', LastName: '', Mobile: '', BranchId: 0 };
            $scope.tbDate = $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy');
            $('#txtDate').val($filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy'));
            $scope.pos_SaleDetail = {};
            $scope.pos_SaleDetailLst = [];
            $scope.pos_SaleDetailFreeLst = [];
            $scope.PaymentTypeList = [];
            $scope.ItemUnitlist = [];
            $scope.ActivePriceTypeList = [];
            $scope.VarietyName = '';
            $scope.BarCode = '';
            $scope.AddProductLbl = 'Add Product';
            $scope.ProductRemoveBtnShow = false;
            $scope.pos_SalePayment = {};
            $scope.pos_SalePaymentList = [];
            $scope.ActiveCustomerById = [];
            $scope.PaymentAddBtnLabel = "Add Payment";
            $scope.PaymentRemoveBtnShow = false;
            GetAllItemUnit();
            GetAllPaymentType();
            CalculatTotalCalculation();
            $scope.ActiveCustomerList = [];
            $scope.VarietyList = [];
            GetAllVariety();
            GetActivePriceType();
            $scope.SaleSaveLbl = 'Save Sale';
            $('#SaleMasterInfo :input').removeAttr('disabled');
            ClearCustomentCtrl();
            PosScnFull();
            $scope.userOutletList = [];
            GetAllUserOutLet();
            GetUsersPermissionDetails();            
            CheckHoldSale();
    }
    function GetPcInfo() {
        $http({
            url: '/Terminal/GetPcInfo',
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            var Terminal = data;
            if (Terminal == '') {
                window.location = '/Home/Index#/Home';
                alertify.log(data.ComputerName + ' Terminal Not Found', 'error', '5000');
            }
            else {
                $scope.pos_Sale.PCINfo = Terminal.TerminalName;
                $scope.pos_Sale.TerminalId = Terminal.TerminalId;
                GetAllInvoiceNumber();
            }
        })
    }
    function PosScnFull() {
        $scope.PosScnFull = false;
        $http({
            url: '/Sale/GetPOSScreenFull',
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.PosScnFull = data;
        })
    }
    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('SaleScreenId');
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
            });
        });
    }
    function GetAllInvoiceNumber() {
        if ($scope.ddlOutLet) {
            var dateParts = ($filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy')).split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
            $http({
                url: '/Sale/GetInvoiceNo?terminalId=' + $scope.pos_Sale.TerminalId + '&saleDate=' + from,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.pos_Sale.InvoiceNo = data[0].Column1;
            });
        }
    }
    function GetAllUserOutLet() {
        $http({
            url: '/User/GetUserDepartmentByUserId?userId=' + $scope.LoginUser.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (userOutletList) {
            $scope.userOutletList = userOutletList;
            var criteria = '1=1 AND S.UserId=' + $scope.LoginUser.UserId + ' AND IsClose = 0';
            $http({
                url: '/Shift/GetUsersShift?searchCriteria=' + criteria + '&orderBy=UserId',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                if (data.length) {
                   // $scope.ShiftDepartmentId = data[0].DepartmentId;
                    $scope.ddlOutLet = { DepartmentId: data[0].DepartmentId, BranchId: data[0].BranchId };
                    //$scope.ddlOutLet = { BranchId: data[0].BranchId };
                    $scope.pos_Sale.DepartmentId = data[0].DepartmentId;
                    $scope.pos_Sale.ShiftId = data[0].ShiftId;
                    GetActiveCustomer();
                    GetPcInfo();

                  //  GetAllInvoiceNumber();
                } else {
                    window.location = '/Home/Index#/Home';
                    alertify.log('Please Start Shift First!', 'error', '10000');
                }
            });
            //if ($scope.userOutletList.length == 1) {
            //    $scope.ddlOutLet = { DepartmentId: $scope.userOutletList[0].DepartmentId };
            //    $scope.ddlOutLet.BranchId = $scope.userOutletList[0].BranchId;
            //    $scope.pos_Sale.DepartmentId = $scope.userOutletList[0].DepartmentId;
            //    GetActiveCustomer();
            //    GetRegisteredCustomer();
            //    GetAllInvoiceNumber();
            //}
        });
    }
    function GetActivePriceType() {
        var criteria = "IsActive=1";
        $http({
            url: '/PriceType/GetPriceTypeDynamic?searchCriteria=' + criteria + '&orderBy=PriceTypeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (activePriceTypeList) {
            $scope.ActivePriceTypeList = activePriceTypeList;
            angular.forEach($scope.ActivePriceTypeList, function (aActivePriceType) {
                if (aActivePriceType.IsDefault == true) {
                    $scope.pos_Sale.PriceTypeId = aActivePriceType.PriceTypeId;
                    $scope.ddlPriceType = { PriceTypeId: aActivePriceType.PriceTypeId }
                }
            })
        })
    }
    function GetActiveCustomer() {
        var criteria = "C.IsActive=1 AND C.BranchId =" + $scope.ddlOutLet.BranchId;
        $http({
            url: '/CustomerEntry/GetAllCustomerDynamic?searchCriteria=' + criteria + "&orderBy=CustomerTypeName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (activecustomerList) {
            $scope.ActiveCustomerList = activecustomerList;
            if ($scope.ActiveCustomerList.length > 0) {
                angular.forEach($scope.ActiveCustomerList, function (aCustomer) {
                    aCustomer.FullName = aCustomer.Title + ' ' + aCustomer.FirstName + ' ' + aCustomer.MiddleName + ' ' + aCustomer.LastName;
                });

                var DefaultCust = Enumerable.From($scope.ActiveCustomerList).Where("$.FirstName == 'General'").ToArray();
                $scope.pos_Sale.CustomerId = DefaultCust[0].CustomerId;
                $scope.pos_Sale.CustomerCode = DefaultCust[0].CustomerCode;
                $scope.CustomerName = DefaultCust[0].FullName;
                $scope.BarCodeCustomer = DefaultCust[0].CustomerCode;
                $scope.CustomerMobile = DefaultCust[0].Mobile;
            }
        })
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
    function GetUnitNameById(id) {
        var UnitName = '';
        angular.forEach($scope.ItemUnitlist, function (aUnit) {
            if (aUnit.ItemUnitId == id)
            { UnitName = aUnit.UnitName; }
        });
        return UnitName;
    }
    function GetAllPaymentType() {
        $http({
            url: '/PaymentType/GetAllActivePaymentType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.PaymentTypeList = Enumerable.From(data).Where('$.IsAdjustment != true').ToArray();
            if ($scope.PaymentTypeList.length == 1) {
                $scope.ddlPaymentType = { PaymentTypeId: $scope.PaymentTypeList[0].PaymentTypeId };
                $scope.pos_SalePayment.PaymentTypeId = $scope.PaymentTypeList[0].PaymentTypeId;
                $scope.pos_SalePayment.PaymentTypeName = $scope.PaymentTypeList[0].PaymentTypeName;
            }
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
        });
    }
    function CalculatTotalCalculation() {
        $scope.pos_Sale.GrandTotal = 0;
        $scope.pos_Sale.Discount = 0;
        $scope.pos_Sale.NetPayable = 0;
        $scope.pos_Sale.TotalChargeAmount = 0;
        angular.forEach($scope.pos_SaleDetailLst, function (apos_SaleDetail) {
            apos_SaleDetail.TotalUnitChargeAmount = Enumerable.From(apos_SaleDetail.ChargeDetails).Sum('$.ChargeAmount');
            $scope.pos_Sale.TotalChargeAmount += apos_SaleDetail.TotalUnitChargeAmount * apos_SaleDetail.Quantity;
            $scope.pos_Sale.GrandTotal += (apos_SaleDetail.Quantity * apos_SaleDetail.UnitPrice) + (apos_SaleDetail.TotalUnitChargeAmount * apos_SaleDetail.Quantity);
            $scope.pos_Sale.Discount += apos_SaleDetail.UnitDiscount * apos_SaleDetail.Quantity;
            $scope.pos_Sale.NetPayable += (apos_SaleDetail.Quantity * apos_SaleDetail.UnitPrice) + (apos_SaleDetail.TotalUnitChargeAmount * apos_SaleDetail.Quantity) - (apos_SaleDetail.UnitDiscount * apos_SaleDetail.Quantity);
        });
        $scope.pos_Sale.PaidAmount = 0;
        angular.forEach($scope.pos_SalePaymentList, function (aPayment) {
            $scope.pos_Sale.PaidAmount += aPayment.Amount;
        });
        $scope.pos_Sale.ChangeAmount = ($scope.pos_Sale.PaidAmount - $scope.pos_Sale.NetPayable);
        $scope.pos_Sale.GrandTotal = parseFloat($scope.pos_Sale.GrandTotal).toFixed(2);
        $scope.pos_Sale.Discount = parseFloat($scope.pos_Sale.Discount).toFixed(2);
        $scope.pos_Sale.NetPayable = parseFloat($scope.pos_Sale.NetPayable).toFixed(2);
        $scope.pos_Sale.PaidAmount = parseFloat($scope.pos_Sale.PaidAmount).toFixed(2);
        $scope.pos_Sale.ChangeAmount = parseFloat($scope.pos_Sale.ChangeAmount).toFixed(2);
    }
    $scope.GetAllInvoiceNumberFromddl = function () {
        if ($scope.ddlOutLet != undefined && $scope.ddlOutLet != null && $scope.ddlOutLet != '') {
            GetPcInfo();
        }
    }
    $scope.unitFilter = function (RawItem) {
        return function (pram) {
            return (pram.ItemUnitId == RawItem.UnitId) || (pram.ItemUnitId == RawItem.PackageId) || (pram.ItemUnitId == RawItem.ContainerId);
        };
    }
    $scope.BarcodeCustomerSearch = function (e) {
        $scope.CustomerDetails = {};
        angular.forEach($scope.ActiveCustomerList, function (aActiveCustomer) {
            if ($scope.BarCodeCustomer == aActiveCustomer.CustomerCode) {
                $scope.CustomerDetails = aActiveCustomer;
                $scope.CustomerName = aActiveCustomer.FullName;
                $scope.CustomerMobile = aActiveCustomer.Mobile;
                $scope.BarCodeCustomer = aActiveCustomer.CustomerCode;
            }
        });
        if ($scope.CustomerDetails.hasOwnProperty('CustomerTypeId')) {
            $scope.pos_Sale.CustomerId = $scope.CustomerDetails.CustomerId;
            $scope.pos_Sale.CustomerCode = $scope.CustomerDetails.CustomerCode;
            $scope.nonRegCustomer = { CustomerId: 0, Title: '', FirstName: '', MiddleName: '', LastName: '', Mobile: '', BranchId: 0 };
        }
        else {
            ClearCustomentCtrl();
        }
    }
    $scope.CustomerDetail = function () {
        if (typeof $scope.CustomerName === 'object' && $scope.CustomerName != null && $scope.CustomerName != undefined) {
            $scope.CustomerDetails = {};
            $scope.CustomerDetails = $scope.CustomerName;
            $scope.BarCodeCustomer = $scope.CustomerName.CustomerCode;
            $scope.CustomerMobile = $scope.CustomerName.Mobile;
            $scope.CustomerName = $scope.CustomerName.FullName;
        }
        else {
            $scope.CustomerDetails = {};
            angular.forEach($scope.ActiveCustomerList, function (aActiveCustomer) {
                if ($scope.CustomerName == aActiveCustomer.FullName) {
                    $scope.CustomerDetails = aActiveCustomer;
                    $scope.BarCodeCustomer = aActiveCustomer.CustomerCode;
                    $scope.CustomerMobile = aActiveCustomer.Mobile;
                }
            });
        }
        if ($scope.CustomerDetails.hasOwnProperty('CustomerTypeId')) {
            $scope.pos_Sale.CustomerId = $scope.CustomerDetails.CustomerId;
            $scope.pos_Sale.CustomerCode = $scope.CustomerDetails.CustomerCode;
            $scope.nonRegCustomer = { CustomerId: 0, Title: '', FirstName: '', MiddleName: '', LastName: '', Mobile: '', BranchId: 0 };
        }
        else {
            $scope.nonRegCustomer = { CustomerId: 0, Title: '', FirstName: $scope.CustomerName, MiddleName: '', LastName: '', Mobile: $scope.CustomerMobile };
        }
    }
    $scope.CustomerMobileSearchDetail = function () {
        if (typeof $scope.CustomerMobile === 'object' && $scope.CustomerMobile != null && $scope.CustomerMobile != undefined) {
            $scope.CustomerDetails = {};
            $scope.CustomerDetails = $scope.CustomerMobile;
            $scope.BarCodeCustomer = $scope.CustomerMobile.CustomerCode;
            $scope.CustomerName = $scope.CustomerMobile.FullName;
            $scope.CustomerMobile = $scope.CustomerMobile.Mobile;
        }
        else {
            $scope.CustomerDetails = {};
            angular.forEach($scope.ActiveCustomerList, function (aActiveCustomer) {
                if ($scope.CustomerMobile == aActiveCustomer.Mobile) {
                    $scope.CustomerDetails = aActiveCustomer;
                    $scope.BarCodeCustomer = aActiveCustomer.CustomerCode;
                    $scope.CustomerName = aActiveCustomer.FullName;
                    $scope.CustomerMobile = aActiveCustomer.Mobile;
                }
            });
        }
        if ($scope.CustomerDetails.hasOwnProperty('CustomerTypeId') && $scope.CustomerDetails.CustomerTypeId >= 0) {
            $scope.pos_Sale.CustomerId = $scope.CustomerDetails.CustomerId;
            $scope.pos_Sale.CustomerCode = $scope.CustomerDetails.CustomerCode;
        }
        else {
            $scope.nonRegCustomer = { CustomerId: 0, Title: '', FirstName: $scope.CustomerName, MiddleName: '', LastName: '', Mobile: $scope.CustomerMobile };
        }
    }
    function ClearCustomentCtrl() {
        $scope.CustomerDetails = {};
        $scope.nonRegCustomer = { CustomerId: 0, Title: '', FirstName: '', MiddleName: '', LastName: '', Mobile: '', BranchId: 0 };
        $scope.CustomerName = null;
        $scope.BarCodeCustomer = null;
        $scope.CustomerMobile = null;
    }
    $scope.BarcodeSearch = function (e) {
        try {
            $http({
                url: '/Sale/SaleDetailAdAttributeGetByDepartmentAndBarcode?departmentId=' + $scope.ddlOutLet.DepartmentId + '&barcode=' + $scope.BarCode,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                if (data.length > 0) {
                    $scope.AdAttributeDetails = data[0];
                    $scope.pos_SaleDetail = Enumerable.From($scope.VarietyList).Where("$.ItemId==" + $scope.AdAttributeDetails.ItemId).FirstOrDefault();
                    if ($scope.pos_SaleDetail.hasOwnProperty('ItemId')) {
                        $scope.VarietyName = $scope.pos_SaleDetail.ItemName;
                        $scope.pos_SaleDetail.SaleUnitId = $scope.pos_SaleDetail.DefaultSaleUnitId;
                        $scope.pos_SaleDetail.SaleUnitName = GetUnitNameById($scope.pos_SaleDetail.DefaultSaleUnitId);
                        $scope.ddlSalesMu = { ItemUnitId: $scope.pos_SaleDetail.DefaultSaleUnitId };
                        UpdatePriceAndQuantity();
                    }
                    else {
                        ClearProductCtrl();
                    }
                }
                else {
                    alertify.log('Product Not Found', 'error', '10000');
                }
            });
        } catch (err) {
            alertify.log(err.message, 'error', '5000');
        }
    }
    $scope.GetVarietyDetail = function () {
        if (typeof $scope.VarietyName === 'object' && $scope.VarietyName != null && $scope.VarietyName != undefined) {
            $scope.pos_SaleDetail = {};
            $scope.pos_SaleDetail = $scope.VarietyName;
            $scope.BarCode = $scope.pos_SaleDetail.ItemCode;
            $scope.pos_SaleDetail.SaleUnitId = $scope.pos_SaleDetail.DefaultSaleUnitId;
            $scope.pos_SaleDetail.SaleUnitName = GetUnitNameById($scope.pos_SaleDetail.DefaultSaleUnitId);
            $scope.ddlSalesMu = { ItemUnitId: $scope.pos_SaleDetail.DefaultSaleUnitId };
        }
        else {
            $scope.pos_SaleDetail = {};
            angular.forEach($scope.VarietyList, function (item) {
                if ($scope.VarietyName == item.ItemName) {
                    $scope.pos_SaleDetail = item;
                    $scope.BarCode = $scope.pos_SaleDetail.ItemCode;
                    $scope.pos_SaleDetail.SaleUnitId = $scope.pos_SaleDetail.DefaultSaleUnitId;
                    $scope.pos_SaleDetail.SaleUnitName = GetUnitNameById($scope.pos_SaleDetail.DefaultSaleUnitId);
                    $scope.ddlSalesMu = { ItemUnitId: $scope.pos_SaleDetail.DefaultSaleUnitId };
                }
            });
        }
        if ($scope.pos_SaleDetail.hasOwnProperty('ItemId')) {
            UpdatePriceAndQuantity();
        }
        else {
            ClearProductCtrl();
        }
    }
    function UpdatePriceAndQuantity() {
        $http({
            url: '/Item/GetSinglePrice?transactionTypeId=2&priceTypeId=' + $scope.ddlPriceType.PriceTypeId + '&ItemAddAttId=' + $scope.AdAttributeDetails.ItemAddAttId + '&unitId=' + $scope.ddlSalesMu.ItemUnitId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.pos_SaleDetail.ChargeDetails = angular.copy(data);
            $scope.pos_SaleDetail.UnitPrice = data[0].UnitPrice;
            $scope.pos_SaleDetail.CurrentQuantity = $scope.AdAttributeDetails.CurrentQuantity;
            $scope.pos_SaleDetail.Combination = $scope.AdAttributeDetails.Combination;
            $scope.pos_SaleDetail.ItemAddAttId = $scope.AdAttributeDetails.ItemAddAttId;
            var flag = true;
            angular.forEach($scope.pos_SaleDetailLst, function (apos_SaleDetailLst) {
                if (apos_SaleDetailLst.ItemAddAttId == $scope.pos_SaleDetail.ItemAddAttId) {
                    flag = false;
                    apos_SaleDetailLst.Quantity += 1;
                    if (apos_SaleDetailLst.Quantity > apos_SaleDetailLst.CurrentQuantity) {
                        apos_SaleDetailLst.Quantity -= 1;
                        alertify.log('Dont have Sufficient Quantity', 'error', '10000');
                        ClearProductCtrl();
                    } else {
                        ClearProductCtrl();
                    }
                }
            });
            if (flag && $scope.pos_SaleDetail.CurrentQuantity > 0) {
                $scope.pos_SaleDetail.Quantity = 1;
                AddProductDetails();
            }
            else if (flag)
            {
                alertify.log('Dont have Sufficient Quantity', 'error', '10000');
                ClearProductCtrl();
            }
            /*
            $http({
                url: '/StockValuation/GetByItemAndUnitAndDepartment?itemId=' + $scope.pos_SaleDetail.ItemId + '&unitId=' + $scope.ddlSalesMu.ItemUnitId + '&departmentId=' + $scope.ddlOutLet.DepartmentId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                if (data != '' && data != null && data != undefined && data.CurrentQuantity > 0) {
                    $scope.pos_SaleDetail.CurrentQuantity = data.CurrentQuantity;
                    var flag = true;
                    angular.forEach($scope.pos_SaleDetailLst, function (apos_SaleDetailLst) {
                        if (apos_SaleDetailLst.ItemName == $scope.pos_SaleDetail.ItemName) {
                            flag = false;
                            apos_SaleDetailLst.Quantity += 1;
                            if (apos_SaleDetailLst.Quantity > apos_SaleDetailLst.CurrentQuantity)
                            {
                                apos_SaleDetailLst.Quantity -= 1;
                                alertify.log('Dont have Sufficient Quantity', 'error', '10000');
                                ClearProductCtrl();
                            } else {
                                ClearProductCtrl();
                            }
                        }
                    });
                    if (flag) {
                        $scope.pos_SaleDetail.Quantity = 1;
                        AddProductDetails();
                    }
                }
                else {
                    alertify.log('Dont have Sufficient Quantity', 'error', '10000');
                    ClearProductCtrl();
                }
            });
            */
        });
    }
    function UpdatePriceAndQuantitys() {
        if ($scope.ddlPriceType != undefined && $scope.ddlPriceType != null && $scope.ddlSalesMu != undefined && $scope.ddlSalesMu != null && $scope.ddlOutLet != undefined && $scope.ddlOutLet != null && $scope.pos_SaleDetail.ItemId != undefined && $scope.pos_SaleDetail.ItemId != null && $scope.pos_SaleDetail.ItemId != '') {
            $http({
                url: '/Item/GetSinglePrice?transactionTypeId=2&priceTypeId=' + $scope.ddlPriceType.PriceTypeId + '&ItemAddAttId=' + $scope.pos_SaleDetail.ItemAddAttId + '&unitId=' + $scope.ddlSalesMu.ItemUnitId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.pos_SaleDetail.ChargeDetails = angular.copy(data);
                $scope.pos_SaleDetail.UnitPrice = data[0].UnitPrice;
                $http({
                    url: '/StockValuation/GetByItemAndUnitAndDepartment?itemId=' + $scope.pos_SaleDetail.ItemId + '&unitId=' + $scope.ddlSalesMu.ItemUnitId + '&departmentId=' + $scope.ddlOutLet.DepartmentId,
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    if (data != '' && data != null && data != undefined && data.CurrentQuantity > 0) {
                        $scope.pos_SaleDetail.CurrentQuantity = data.CurrentQuantity;
                        if ($scope.pos_SaleDetail.CurrentQuantity < $scope.pos_SaleDetail.Quantity) {
                            $scope.pos_SaleDetail.Quantity = $scope.pos_SaleDetail.CurrentQuantity;
                        }

                        $('#txtSaleQty').focus();
                    }
                    else {
                        alertify.log('Dont have Sufficient Quantity', 'error', '10000');
                        ClearProductCtrl();
                    }
                });
            });
        }
    }
    $scope.UpdatePriceQuantityInfo = function () {
        UpdatePriceAndQuantitys();
    }
    $scope.AddProduct = function () {
        if ($scope.ddlSalesMu == undefined || $scope.ddlSalesMu == null || $scope.ddlSalesMu == '') {
            alertify.log('Select Sale Unit', 'error', '10000');
        }
        else if ($scope.pos_SaleDetail == undefined || $scope.pos_SaleDetail == null || $scope.pos_SaleDetail == '') {
            alertify.log('Enter Product Information', 'error', '10000');
        }
        else if ($scope.pos_SaleDetail.CurrentQuantity == undefined || $scope.pos_SaleDetail.CurrentQuantity == null || $scope.pos_SaleDetail.CurrentQuantity == '') {
            alertify.log('Select Valid Product for Sale', 'error', '10000');
        }
        else if ($scope.pos_SaleDetail.Quantity == undefined || $scope.pos_SaleDetail.Quantity == null || $scope.pos_SaleDetail.Quantity == '') {
            alertify.log('Enter Product Sale Quantity', 'error', '10000');
        }
        else if ($scope.pos_SaleDetail.Quantity < 1) {
            alertify.log('Enter Valid Sale Quantity', 'error', '10000');
        }
        else if ($scope.pos_SaleDetail.Quantity > $scope.pos_SaleDetail.CurrentQuantity) {
            alertify.log('Insufficient Current Stock for Sale', 'error', '10000');
        }
        else {
            if ($scope.AddProductLbl == 'Add Product') {
                var flag = true;
                angular.forEach($scope.pos_SaleDetailLst, function (apos_SaleDetailLst) {
                    if (apos_SaleDetailLst.ItemName == $scope.pos_SaleDetail.ItemName) {
                        flag = false;
                    }
                });
                if (flag) {
                    AddProductDetails();
                }
                else {
                    alertify.log('Product alredy exist!', 'error', '10000');
                }
            }
            else {
                var flag = true;
                angular.forEach($scope.pos_SaleDetailLst, function (apos_SaleDetailLst) {
                    if (apos_SaleDetailLst.Combination == $scope.pos_SaleDetail.Combination && apos_SaleDetailLst.SaleDetailId != $scope.pos_SaleDetail.SaleDetailId) {
                        flag = false;
                    }
                });
                if (flag) {
                    //ClearProductCtrl();
                    angular.forEach($scope.pos_SaleDetailFreeLst, function (apos_SaleDetailFree) {
                        if (apos_SaleDetailFree.SaleDetailId == $scope.pos_SaleDetail.SaleDetailId) {
                            $scope.pos_SaleDetailFreeLst.splice(apos_SaleDetailFree, 1);
                        }
                    });
                    $scope.pos_SaleDetailLst.splice($scope.pos_SaleDetail.Iindex, 1);
                    AddProductDetails();
                }
                else {
                    alertify.log('Product alredy exist!', 'error', '10000');
                }
            }
        }
    }
    function AddProductDetails() {
        $scope.pos_SaleDetail.SaleDetailId = SaleDetailIdTemp;
        $scope.pos_SaleDetail.UnitDiscount = 0;
        $scope.pos_SaleDetailLst.push($scope.pos_SaleDetail);
        SaleDetailIdTemp += 100;
        ClearProductCtrl();
    }
    $scope.RowClickOnProductList = function (apos_SaleDetail,ind) {
        if (!$scope.ProductRemoveBtnShow) {
            $scope.pos_SaleDetail = apos_SaleDetail;
            $scope.pos_SaleDetail.Iindex = ind;
            $scope.BarCode = apos_SaleDetail.ItemCode;
            $scope.VarietyName = apos_SaleDetail.ItemName;
            $("#txtVarietyName").attr("disabled", "disabled");
            $("#txtBarCode").attr("disabled", "disabled");
            $scope.ddlSalesMu = { ItemUnitId: apos_SaleDetail.SaleUnitId };
            $scope.AddProductLbl = "Update Product";
            $scope.ProductRemoveBtnShow = true;
        } else {
            alertify.log('Update Product First', 'error', '10000');
        }
    }
    $scope.RemoveProduct = function () {
        angular.forEach($scope.pos_SaleDetailFreeLst, function (apos_SaleDetailFree) {
            if (apos_SaleDetailFree.SaleDetailId == $scope.pos_SaleDetail.SaleDetailId) {
                $scope.pos_SaleDetailFreeLst.splice(apos_SaleDetailFree, 1);
            }
        });
        $scope.pos_SaleDetailLst.splice($scope.pos_SaleDetail.Iindex, 1);
        ClearProductCtrl();
    }
    function ClearProductCtrl() {
        $scope.BarCode = null;
        $scope.VarietyName = null;
        $("#txtBarCode").removeAttr("disabled");
        $("#txtVarietyName").removeAttr("disabled");
        $scope.pos_SaleDetail = {};
        $scope.ddlSalesMu = null;
        $scope.AddProductLbl = 'Add Product';
        $scope.ProductRemoveBtnShow = false;
        GetAllVariety();

        $scope.pos_SaleDetailFreeLst = [];
        angular.forEach($scope.pos_SaleDetailLst, function (aSaleDetail) {
            if (aSaleDetail.FifteenChecked) {
                aSaleDetail.UnitDiscount = aSaleDetail.UnitPrice * 15 / 100;
            }
            else {
                aSaleDetail.UnitDiscount = 0;
            }
            var flag = Enumerable.From(OfferProduct).Where('$.ItemId==' + aSaleDetail.ItemId).ToArray();
            if (aSaleDetail.Quantity >= 2 && flag.length > 0 && aSaleDetail.UnitPrice <= flag[0].OfferOn && aSaleDetail.UnitDiscount == 0) {
                var pos_SaleDetailFree = {
                    SaleDetailId: SaleDetailIdTemp,
                    ItemAddAttId:aSaleDetail.ItemAddAttId,
                    ItemId: aSaleDetail.ItemId,
                    ItemName: aSaleDetail.ItemName,
                    FreeQuantity: Math.floor(aSaleDetail.Quantity / 2),
                    FreeUnitId: aSaleDetail.UnitId,
                    FreeUnitName: aSaleDetail.UnitName,
                    // UnitPrice: $scope.pos_SaleDetail.UnitPrice
                }
                $scope.pos_SaleDetailFreeLst.push(pos_SaleDetailFree);
            }
        });

        CalculatTotalCalculation();
    }
    $scope.ClearProductCtrls = function () {
        ClearProductCtrl();
    }
    $scope.AddPayment = function () {
        if ($scope.ddlPaymentType == undefined || $scope.ddlPaymentType == null || $scope.ddlPaymentType == '') {
            alertify.log('Select Payment Type', 'error', '10000');
        }
        else if ($scope.pos_SalePayment == undefined || $scope.pos_SalePayment == null || $scope.pos_SalePayment.Amount == undefined || $scope.pos_SalePayment.Amount == null || $scope.pos_SalePayment.Amount == '') {
            alertify.log('Enter Pay amount', 'error', '10000');
        }
        else if ($scope.pos_SalePayment == undefined || $scope.pos_SalePayment == null || $scope.pos_SalePayment.Amount < 1) {
            alertify.log('Enter Valid Pay amount', 'error', '10000');
        }
        else {
            if ($scope.PaymentAddBtnLabel == 'Add Payment') {
                var flag = true;
                angular.forEach($scope.pos_SalePaymentList, function (pos_SalePaymentList) {
                    if (pos_SalePaymentList.PaymentTypeName == $scope.pos_SalePayment.PaymentTypeName) {
                        flag = false;
                    }
                });
                if (flag) {
                    $scope.pos_SalePayment.PaymentChkId = PaymentChkIdTemp;
                    $scope.pos_SalePaymentList.push($scope.pos_SalePayment);
                    PaymentChkIdTemp += 100;
                    ClearPaymentCtrl();
                }
                else {
                    alertify.log('Payment type alredy exist!', 'error', '10000');
                }
            }
            else {
                var flag = true;
                angular.forEach($scope.pos_SalePaymentList, function (pos_SalePaymentList) {
                    if (pos_SalePaymentList.PaymentTypeName == $scope.pos_SalePayment.PaymentTypeName && pos_SalePaymentList.PaymentChkId != $scope.pos_SalePayment.PaymentChkId) {
                        flag = false;
                    }
                });
                if (flag) {
                    ClearPaymentCtrl();
                }
                else {
                    alertify.log('Payment type alredy exist!', 'error', '10000');
                }
            }
        }
    }
    $scope.RowClickOnPaymantList = function (apos_SalePayment,index) {
        if (!$scope.PaymentRemoveBtnShow) {
            $scope.pos_SalePayment = apos_SalePayment; index
            $scope.pos_SalePayment.index = index;
            $scope.ddlPaymentType = { PaymentTypeId: apos_SalePayment.PaymentTypeId };
            $scope.PaymentAddBtnLabel = "Update Payment";
            $scope.PaymentRemoveBtnShow = true;
        } else {
            alertify.log('Update Payment First', 'error', '10000');
        }
    }
    $scope.RemovePayment = function () {
        $scope.pos_SalePaymentList.splice($scope.pos_SalePayment.index, 1);
        ClearPaymentCtrl();
    }
    function ClearPaymentCtrl() {
        $scope.pos_SalePayment = {};
        $scope.ddlPaymentType = null;
        $scope.PaymentAddBtnLabel = 'Add Payment';
        $scope.PaymentRemoveBtnShow = false;
        GetAllPaymentType();
        CalculatTotalCalculation();
    }
    $scope.SaveSale = function () {
        try {
            var erroMsg = [];
            if ($("#txtDate").val() == '' || $("#txtDate").val() == undefined || $("#txtDate").val() == null) {
                erroMsg.push({
                    msg: "Please Select Date "
                });
            }
            else {
                var from = $("#txtDate").val().split("/");
                var f = new Date(from[2], from[1] - 1, from[0]);
                $scope.pos_Sale.SaleDate = f;
            }
            if (($scope.CustomerName == undefined || $scope.CustomerName == '' || $scope.CustomerName == null || $scope.CustomerMobile == undefined || $scope.CustomerMobile == '' || $scope.CustomerMobile == null)) {
                erroMsg.push({ msg: "Please Provide Customer Information" });
            }
            else if ($scope.SaleSaveLbl == 'Save Sale') {
                if ($scope.nonRegCustomer.FirstName != undefined && $scope.nonRegCustomer.FirstName != '' && $scope.nonRegCustomer.FirstName != null) { $scope.nonRegCustomer.FirstName = $scope.nonRegCustomer.FirstName.trim(); } if ($scope.nonRegCustomer.Mobile != undefined && $scope.nonRegCustomer.Mobile != '' && $scope.nonRegCustomer.Mobile != null) { $scope.nonRegCustomer.Mobile = $scope.nonRegCustomer.Mobile.trim(); } if ($scope.ddlOutLet != undefined && $scope.ddlOutLet != '' && $scope.ddlOutLet != null) { $scope.nonRegCustomer.BranchId = $scope.ddlOutLet.BranchId; }
                if ($scope.nonRegCustomer.FirstName == 'General') {
                    erroMsg.push({ msg: "Can't Entry New Customer named General" });
                }
            }
            if (!$scope.ddlOutLet) {
                erroMsg.push({ msg: "Select Out Let" });
            }
            else if (!$scope.tbDate) {
                erroMsg.push({ msg: "Select Date" });
            }
            else if (!$scope.pos_SaleDetailLst.length) {
                erroMsg.push({ msg: "Please Add Product" });
            }
            else if (!$scope.pos_SalePaymentList.length) {
                erroMsg.push({ msg: "Please Add Payment" });
            }
            else if ($scope.pos_Sale.ChangeAmount < 0) {
                erroMsg.push({ msg: "Need to increase amount of payment" });
            }
            else if ($scope.ProductRemoveBtnShow) {
                erroMsg.push({ msg: "Update Product First" });
            }
            else if ($scope.PaymentRemoveBtnShow) {
                erroMsg.push({ msg: "Update Payment First" });
            }
            else {
                $scope.pos_SaleDetailChargeLst = [];
                angular.forEach($scope.pos_SaleDetailLst, function (aSaleDetails) {
                    if (aSaleDetails.ChargeDetails.length) {
                        angular.forEach(aSaleDetails.ChargeDetails, function (aCharge) {
                            var aChargeDetails = {
                                SaleDetailId: aSaleDetails.SaleDetailId,
                                ChargeTypeId: aCharge.ChargeTypeId,
                                ChargeAmount: aCharge.ChargeAmount //* aSaleDetails.Quantity
                            }
                            $scope.pos_SaleDetailChargeLst.push(aChargeDetails);
                        })
                    }
                    if (aSaleDetails.Quantity > aSaleDetails.CurrentQuantity) {
                        erroMsg.push({ msg: aSaleDetails.ItemName + " don't have Enough Quantity for Sale" });
                    }
                });
            }
            if (erroMsg.length > 0) {
                angular.forEach(erroMsg, function (aErroMsg) {
                    alertify.log(aErroMsg.msg, 'error', '5000');
                });
            }
            else {
                $scope.pos_Sale.CreatorId = $scope.LoginUser.UserId;
                $scope.pos_Sale.UpdatorId = $scope.LoginUser.UserId;

                if ($scope.SaleSaveLbl == 'Save Sale') {
                    if ($scope.CreatePermission) {
                        alertify.confirm("Are you sure to Save?", function (e) {
                            if (e) {
                                if ($scope.nonRegCustomer.FirstName != undefined && $scope.nonRegCustomer.FirstName != '' && $scope.nonRegCustomer.FirstName != null) { $scope.nonRegCustomer.FirstName = $scope.nonRegCustomer.FirstName.trim(); } if ($scope.nonRegCustomer.Mobile != undefined && $scope.nonRegCustomer.Mobile != '' && $scope.nonRegCustomer.Mobile != null) { $scope.nonRegCustomer.Mobile = $scope.nonRegCustomer.Mobile.trim(); } if ($scope.ddlOutLet != undefined && $scope.ddlOutLet != '' && $scope.ddlOutLet != null) { $scope.nonRegCustomer.BranchId = $scope.ddlOutLet.BranchId; }
                                var SaleDetailLst = [];
                                angular.forEach($scope.pos_SaleDetailLst, function (apos_SaleDetailLst) {
                                    apos_SaleDetailLst.AttributeQty = apos_SaleDetailLst.Quantity;
                                    var flg = true;
                                    angular.forEach(SaleDetailLst, function (aSale) {
                                        if (apos_SaleDetailLst.ItemId == aSale.ItemId) {
                                            flg = false;
                                        }
                                    });
                                    if (flg) {
                                        SaleDetailLst.push(apos_SaleDetailLst);
                                    }
                                });

                                $.ajax({
                                    url: "/Sale/SaveSale",
                                    contentType: "application/json;charset=utf-8",
                                    type: "POST",
                                    data: JSON.stringify({ _pos_Sale: $scope.pos_Sale, pos_SaleDetailLst: SaleDetailLst, pos_SaleDetailChargeLst: $scope.pos_SaleDetailChargeLst, pos_SaleDetailFreeLst: $scope.pos_SaleDetailFreeLst, pos_SalePaymentLst: $scope.pos_SalePaymentList, nonRegCustomer: $scope.nonRegCustomer, pos_SaleDetailAdAttributeLst: $scope.pos_SaleDetailLst }),
                                    success: function (data) {
                                        if (data != null && data != '' && data != 0) {
                                            $scope.SaleInvoiceNo = data;
                                            alertify.log('Sale Saved Successfully', 'success', '10000');
                                            PrintInvoice();
                                            load();
                                        } else { alertify.log('Server Save Errors!', 'error', '10000'); }
                                    }, error: function (msg) {
                                        alertify.log('Server Save Errors!', 'error', '10000');
                                    }
                                });
                            }
                        });
                    }
                    else {
                        alertify.log('You do not have permission to Sale!', 'error', '5000');
                    }
                }
            }
        } catch (err) {
            alertify.log(err.message, 'error', '5000');
        }
    }
    $scope.ResetSale = function () {
        alertify.confirm("Are you Confirm to Reset?", function (e) {
            if (e) {
                load();
            }
        });
    }
    $scope.SalePrintInvoice = function () {
        PrintInvoice();
    }
    function PrintInvoice() {
        if ($scope.SaleInvoiceNo) {
            $http({
                url: "/Sale/GetInvoiceMasterBy?InvoiceNo=" + $scope.SaleInvoiceNo,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                try {
                    if (data != null && data != '' && data != undefined) {
                        $scope.InvoiceMaster = JSON.parse(data.InvoiceMaster)[0];
                        $scope.Exchangedetails = data.Exchangedetails;
                        $scope.FreeDetails = data.FreeDetails;
                        $scope.InvoiceDetails = data.InvoiceDetails;
                        if ($scope.InvoiceDetails.length > 0) {
                            var printContents = '<div style="font-family:Verdana !important;"><div><div><div style="text-align: center"><img src="http://localhost:3365/UploadedImages/logo.jpg" style="width:100px; height:60px;"  alt="Muslim" /><br> <strong>'
                                + $scope.InvoiceMaster.BranchTypeName + '</strong><br>' + $scope.InvoiceMaster.BranchName + '</div><hr><div style="font-size:10px !important;"> <div> <span> <strong>Date : </strong> ' + $scope.InvoiceMaster.SaleDate + '<br><strong>Invoice No : </strong> ' + $scope.InvoiceMaster.InvoiceNo + '<br> <strong>Customer Name : </strong> ' + $scope.InvoiceMaster.CustomerName + '<br> <strong>Mobile No : </strong> ' + $scope.InvoiceMaster.CustomerMobile + '<br></span></div></div></div></div><div><div><div><div><div><table style="font-size:9px !important; width:100%;"> <thead  style="font-size:10px !important;"><tr><td colspan="4"><hr></td></tr><tr><td style="text-align: left;"><strong>Product</strong></td> <td style="text-align: center;"><strong>Qty</strong></td> <td style="text-align: right;"><strong>Price</strong></td> <td style="text-align: right;"><strong>Amount</strong></td> </tr> </thead> <tbody>';
                            var index = 1;
                            angular.forEach($scope.InvoiceDetails, function (aInvoiceProduct) {
                                printContents += '<tr><td>' + aInvoiceProduct.ItemName + '</td> <td style="text-align: center">' + aInvoiceProduct.Quantity + '</td> <td style="text-align:right;">' + parseFloat(aInvoiceProduct.UnitPrice).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td> <td style="text-align:right;">' + parseFloat((aInvoiceProduct.Quantity * aInvoiceProduct.UnitPrice)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td></tr>';
                                index += 1;
                            });
                            printContents += '<tr><td colspan="4"><hr></td></tr>';
                            if ($scope.InvoiceMaster.ExchangeAmount > 0) {
                                printContents += '<tr><td colspan="3" style="text-align:right;"><strong>Invoice Total :</strong></td> <td style="text-align:right;">' + parseFloat($scope.InvoiceMaster.InvoiceTotal).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td> </tr>';
                            }
                            if ($scope.InvoiceMaster.ExchangeAmount > 0) {
                                printContents += '<tr><td colspan="3" style="text-align:right;"><strong>Exchange Amount :</strong></td> <td style="text-align:right;">' + parseFloat($scope.InvoiceMaster.ExchangeAmount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td> </tr>';
                            }

                            printContents += '<tr><td colspan="3" style="text-align:right;"><strong>Total Including VAT :</strong></td> <td style="text-align:right;">' + parseFloat($scope.InvoiceMaster.TotalIncludingVAT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td> </tr>';
                            printContents += '<tr><td colspan="3" style="text-align:right;"><strong>VAT :</strong></td> <td style="text-align:right;">' + parseFloat($scope.InvoiceMaster.VAT).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td> </tr>';
                            if ($scope.InvoiceMaster.DiscountTotal > 0) {
                                printContents += '<tr><td colspan="3" style="text-align:right;"><strong>Discount Total :</strong></td> <td style="text-align:right;">' + parseFloat($scope.InvoiceMaster.DiscountTotal).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td> </tr>';
                            }
                            if ($scope.InvoiceMaster.ExchangeAmount > 0 || $scope.InvoiceMaster.DiscountTotal > 0) {
                                printContents += '<tr><td colspan="3" style="text-align:right;"><strong>Net Payable :</strong></td> <td style="text-align:right;">' + parseFloat($scope.InvoiceMaster.NetPayable).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td> </tr>';
                            }
                            printContents += ' <tr><td colspan="3" style="text-align:right;"><strong>Paid Amount :</strong></td> <td style="text-align:right;">' + parseFloat($scope.InvoiceMaster.PaidAmount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td> </tr>';
                            printContents += ' <tr><td colspan="3" style="text-align:right;"><strong>Change Amount :</strong></td> <td style="text-align:right;">' + parseFloat($scope.InvoiceMaster.ChangeAmount).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td> </tr>';
                            if ($scope.FreeDetails.length > 0) {
                                printContents += '<tr><td colspan="4"><hr></td></tr><tr><td style="text-align: left;"><strong>Free Product</strong></td> <td style="text-align: center;"><strong>Qty</strong></td> <td style="text-align: right;"><strong>Price</strong></td> <td style="text-align: right;"><strong>Amount</strong></td> </tr>';
                                index = 1;
                                angular.forEach($scope.FreeDetails, function (aInvoiceProduct) {
                                    printContents += '<tr><td>' + aInvoiceProduct.ItemName + '</td> <td style="text-align: center">' + aInvoiceProduct.Quantity + '</td> <td style="text-align:right;">' + parseFloat(aInvoiceProduct.UnitPrice).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td> <td style="text-align:right;">' + parseFloat((aInvoiceProduct.Quantity * aInvoiceProduct.UnitPrice)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td></tr>';
                                    index += 1;
                                    aInvoiceProduct.Totalamount = aInvoiceProduct.Quantity * aInvoiceProduct.UnitPrice;
                                });
                                printContents += '<tr><td colspan="3" style="text-align:right;"><strong>Free Total :</strong></td> <td style="text-align:right;">' + parseFloat(Enumerable.From($scope.FreeDetails).Sum('$.Totalamount')).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td> </tr>';
                            }
                            if ($scope.Exchangedetails.length > 0) {
                                printContents += '<tr><td colspan="4"><hr></td></tr><tr><td style="text-align: left;"><strong>Exchange Product</strong></td> <td style="text-align: center;"><strong>Qty</strong></td> <td style="text-align: right;"><strong>Price</strong></td> <td style="text-align: right;"><strong>Amount</strong></td> </tr>';
                                index = 1;
                                angular.forEach($scope.Exchangedetails, function (aInvoiceProduct) {
                                    printContents += '<tr><td>' + aInvoiceProduct.ItemName + '</td> <td style="text-align: center">' + aInvoiceProduct.Quantity + '</td> <td style="text-align:right;">' + parseFloat(aInvoiceProduct.UnitPrice).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td> <td style="text-align:right;">' + parseFloat((aInvoiceProduct.Quantity * aInvoiceProduct.UnitPrice)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td></tr>';
                                    index += 1;
                                    aInvoiceProduct.Totalamount = aInvoiceProduct.Quantity * aInvoiceProduct.UnitPrice;
                                });
                                printContents += '<tr><td colspan="3" style="text-align:right;"><strong>Exchange Total :</strong></td> <td style="text-align:right;">' + parseFloat(Enumerable.From($scope.Exchangedetails).Sum('$.Totalamount')).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td> </tr>';
                            }

                            printContents += '</tbody><tfoot style="font-size:9px !important;">';
                            if ($scope.InvoiceMaster.PromotionalNotes.length > 0) {
                                printContents += '<tr><td colspan="4" style="text-align:center;"><hr>' + $scope.InvoiceMaster.PromotionalNotes + ' </td></tr>';
                            }
                            if ($scope.InvoiceMaster.TermsAndConditions.length > 0) {
                                printContents += '<tr><td colspan="4" style="text-align:center;"><strong>' + $scope.InvoiceMaster.TermsAndConditions + ' </strong></td></tr>';
                            }

                            printContents += '</tfoot></table></div></div></div></div></div></div>';
                            myWindow = window.open('Muslim Mart', 'Muslim Mart | Sale Invoice', 'width=900,height=600');
                            myWindow.document.write(printContents);
                            setTimeout(function () {
                                myWindow.focus();
                                myWindow.print();
                                myWindow.close();
                            }, 250);
                        }
                        else {
                            alertify.log('Invoice Not Found', 'error', '5000');
                        }
                    }
                    else {
                        alertify.log('Invoice Not Found', 'error', '5000');
                    }
                }
                catch (err) {
                    alertify.log(err.message, 'error', '5000');
                }
            });
        }
    }
    $scope.LoadtoReIssue = function () {

        var jsonArray = [
    { "user": { "id": 100, "screen_name": "d_linq" }, "text": "to objects" },
    { "user": { "id": 130, "screen_name": "c_bill" }, "text": "g" },
    { "user": { "id": 155, "screen_name": "b_mskk" }, "text": "kabushiki kaisha" },
    { "user": { "id": 301, "screen_name": "a_xbox" }, "text": "halo reach" }
        ]

        var res1 = Enumerable.From(jsonArray).Where(function (a) { return a.user.id > 150 }).Select(function (x) { return x.user.screen_name + ' ' + x.user.id }).ToJSON();
        var res2 = Enumerable.From(jsonArray).Where("$.user.id==301").ToArray();
        var res3 = Enumerable.From(jsonArray).Where("$.user.id==301").ToJSON();
        var IdSum = Enumerable.From(jsonArray).Sum('$.user.id');
        var IdAvg = Enumerable.From(jsonArray).Average('$.user.id');
        var IdMax = Enumerable.From(jsonArray).Max('$.user.id');
        var IdMin = Enumerable.From(jsonArray).Min('$.user.id');

        alert('b');


        /*
        // ["b_mskk:kabushiki kaisha", "c_bill:g", "d_linq:to objects"]
        var queryResult = Enumerable.From(jsonArray)
            .Where(function (x) { return x.user.id < 200 })
            .OrderBy(function (x) { return x.user.screen_name })
            .Select(function (x) { return x.user.screen_name + ':' + x.text })
            .ToArray();
        // shortcut! string lambda selector
        var queryResult2 = Enumerable.From(jsonArray)
            .Where("$.user.id < 200")
            .OrderBy("$.user.screen_name")
            .Select("$.user.screen_name + ':' + $.text")
            .ToArray();
        */


















        /*
        if ($scope.RevisePermission) {
            if ($scope.SaleInvoiceNo) {
                $http({
                    url: "/Sale/GetSaleAndDetailsByInvoiceNo?InvoiceNo=" + $scope.SaleInvoiceNo + "&DepertmentId=" + $scope.ddlOutLet.DepartmentId,
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    if (data.SaleDetails != null && data.SaleDetails.length > 0) {
                        var SaleMaster = JSON.parse(data.SaleMaster)[0];
                        $scope.pos_SaleDetailLst = data.SaleDetails;
                        $scope.pos_SalePaymentList = data.SalePayment;
                        $scope.PreSaleMaster = SaleMaster;
                        $scope.PreSaleDetails = angular.copy(data.SaleDetails);

                        $scope.ddlOutLet = { DepartmentId: SaleMaster.DepartmentId }
                        $scope.pos_Sale.DepartmentId = SaleMaster.DepartmentId;
                        $scope.ddlPriceType = { PriceTypeId: SaleMaster.PriceTypeId }
                        $scope.pos_Sale.PriceTypeId = SaleMaster.PriceTypeId;

                        if (SaleMaster.OfferName == "Coupon") {
                            $scope.pos_Sale.Coupon = true;
                            if (SaleMaster.RefCustomerCode == '') {
                                $scope.CouponCustomerMobile = SaleMaster.Mobile;
                                $scope.CouponCustomerName = SaleMaster.CustomerName;
                            }
                            else {
                                $scope.CouponCustomerMobile = SaleMaster.RefMobile;
                                $scope.CouponCustomerName = SaleMaster.RefCustomerName;
                            }
                        }
                        else {
                            $scope.pos_Sale.Coupon = false;
                        }

                     //   $scope.ExistingCustomer = true;
                        $scope.CustomerMobile = SaleMaster.Mobile;
                        $scope.CustomerName = SaleMaster.CustomerName;

                        $scope.pos_Sale.RefCustomerCode = SaleMaster.RefCustomerCode;
                        $scope.pos_Sale.CustomerCode = SaleMaster.CustomerCode;
                        $scope.pos_Sale.OffPercentage = SaleMaster.OffPercentage;
                        $scope.pos_Sale.OfferName = SaleMaster.OfferName;
                        $scope.pos_Sale.RefInvoiceNo = SaleMaster.InvoiceNo;

                        angular.forEach($scope.pos_SaleDetailLst, function (aSaleDetails) {
                            aSaleDetails.CurrentQuantity += aSaleDetails.Quantity;
                        });

                        $('#SaleMasterInfo :input').attr('disabled', true);
                        $scope.SaleSaveLbl = 'ReIssue Sale';
                        CalculatTotalCalculation();
                    }
                    else {
                        alertify.log('Invoice Not Found', 'error', '5000');
                    }
                })
            }
            else {
                alertify.log('Invoice Not Found', 'error', '5000');
            }
        }
        else {
            alertify.log('You do not have permission to ReIssue!', 'error', '5000');
        }
        */
    }
    function GetMyDateTime() {
        var text = '';
        someday = new Date();
        if (someday.getHours() > 12) { text = (someday.getHours() - 12) + ':' + someday.getMinutes() + ':' + someday.getSeconds(); text += ' PM'; } else { text = someday.getHours() + ':' + someday.getMinutes() + ':' + someday.getSeconds(); text += ' AM'; }
        return text;
    }
    $scope.HoldSale = function () {
        if ($scope.pos_SaleDetailLst.length || $scope.pos_SalePaymentList.length) {
            var key = GetMyDateTime() + ' (' + $scope.pos_SaleDetailLst.length + ')';
            var value = JSON.stringify($scope.pos_SaleDetailLst) + '*' + JSON.stringify($scope.pos_SaleDetailFreeLst) + '*' + JSON.stringify($scope.pos_SalePaymentList);
            localStorage.setItem(key, value);
            load();
            alertify.log('Sale Holded Successfully', 'success', '10000');
        }
        else {
            alertify.log('You have nothing to hold', 'error', '10000');
        }
    }
    $scope.LoadHoldedSale = function (key) {
        if (key.name != 'No Sale holded') {
            var aSale = localStorage.getItem(key.name);
            var detailName = aSale.split("*");
            $scope.pos_SaleDetailLst = JSON.parse(detailName[0]);
            $scope.pos_SaleDetailFreeLst = JSON.parse(detailName[1]);
            $scope.pos_SalePaymentList = JSON.parse(detailName[2]);
            CalculatTotalCalculation();
            localStorage.removeItem(key.name);
            CheckHoldSale();
            alertify.log('Sale Unholded Successful', 'success', '10000');
        }
    }
    function CheckHoldSale() {
        $scope.HoldSaleList = [{ name: 'No Sale holded' }];
        if (localStorage.length) { $scope.HoldSaleList = []; }
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            $scope.HoldSaleList.push({ name: key });
        }
    }
    $scope.CalculateShift = function () {
        CalCulateShiftInfo();
    }
    function CalCulateShiftInfo() {
        $scope.pos_Shift.SystemCloseBalance = Enumerable.From($scope.ShiftAmountDetails).Sum('$.Amount');
        $scope.pos_Shift.InputCloseBalance = Enumerable.From($scope.ShiftAmountDetails).Sum('$.InputAmount');
        $scope.pos_Shift.SystemCloseCash = (Enumerable.From($scope.ShiftAmountDetails).Where("$.PaymentTypeName == 'Cash'").Sum('$.Amount')) + $scope.pos_Shift.InputOpenCash;
        $scope.pos_Shift.InputCloseCash = (Enumerable.From($scope.ShiftAmountDetails).Where("$.PaymentTypeName == 'Cash'").Sum('$.InputAmount')) + $scope.pos_Shift.InputOpenCash;
    }
    $scope.loadShiftInfo = function () {
        $http({
            url: "/Shift/GetSalePaymentByShift?shiftId=" + $scope.pos_Sale.ShiftId + '&UserId=' + $scope.LoginUser.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.pos_Shift = data.Shift[0];
            $scope.ShiftAmountDetails = JSON.parse(data.ShiftDetails);
            CalCulateShiftInfo();
        })
    }
    $scope.ShiftClose = function () {
        alertify.confirm("Are you sure to Clock Out?", function (e) {
            if (e) {
                $.ajax({
                    url: "/Shift/CloseShift",
                    contentType: "application/json;charset=utf-8",
                    type: "POST",
                    data: JSON.stringify({ _pos_Shift: $scope.pos_Shift }),
                    success: function (data) {
                        if (data != null && data != '' && data != 0) {
                            alertify.log('Clock Out Successful', 'success', '10000');
                            PrintCounterClose($scope.pos_Shift.ShiftId);
                            window.location = '/Home/Index#/Home';
                        } else { alertify.log('Server Save Errors!', 'error', '10000'); }
                    }, error: function (msg) {
                        alertify.log('Server Save Errors!', 'error', '10000');
                    }
                });
            }
        });
    }
    function PrintCounterClose(ShiftId) {
        var criteria = 'ShiftId=' + ShiftId;
        $http({
            url: '/Shift/GetUsersShift?searchCriteria=' + criteria + '&orderBy=UserId',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            var ShiftDetails = data[0];
            var OpenTime = "";
            var CloseTime = "";
            res = ShiftDetails.OpenTime.substring(0, 5);
            if (res == "/Date") {
                var parsedDate = new Date(parseInt(ShiftDetails.OpenTime.substr(6)));
                OpenTime = parsedDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            }

            res = ShiftDetails.CloseTime.substring(0, 5);
            if (res == "/Date") {
                var parsedDate = new Date(parseInt(ShiftDetails.CloseTime.substr(6)));
                CloseTime = parsedDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            }

            res = ShiftDetails.CloseTime.substring(0, 5);
            if (res == "/Date") {
                var parsedDate = new Date(parseInt(ShiftDetails.CloseTime.substr(6)));
                ShiftDetails.CloseTime = $filter('date')(parsedDate, 'dd-MMM-yyyy');
            }

            var printContents = '<div style="font-family:Verdana !important;"><div style="text-align: center"><strong>' + ShiftDetails.GroupName + '</strong><br>' + ShiftDetails.BranchName + '</div><hr>' + '<div style="font-size:10px !important;"><span><strong>Cashier : </strong>' + ShiftDetails.EmployeeName + '<br>' + '<strong>Date : </strong> ' + ShiftDetails.CloseTime + '</span><br><span> <strong>From : </strong> ' + OpenTime + '</span> <span> <strong>To : </strong> ' + CloseTime + '<br></span></div><hr />';
            printContents += '<table style="font-size:10px !important; width:100%;"><tr><td style="text-align:left" colspan="3">Opening Cash :' + ShiftDetails.InputOpenCash + '</td></tr><tr><td style="text-align:center" colspan="3">Closing Balance</td></tr><tr style="text-align:center"><td>System</td><td>Input</td><td>Difference</td></tr><tr style="text-align:center"><td>' + ShiftDetails.SystemCloseBalance + '</td><td>' + ShiftDetails.InputCloseBalance + '</td><td>' + (ShiftDetails.SystemCloseBalance - ShiftDetails.InputCloseBalance) + '</td></tr><tr><td style="text-align:center" colspan="3">Closing Cash</td></tr><tr style="text-align:center"><td>System</td><td>Input</td><td>Difference</td></tr><tr style="text-align:center"><td>' + ShiftDetails.SystemCloseCash + '</td><td>' + ShiftDetails.InputCloseCash + '</td><td>' + (ShiftDetails.SystemCloseCash - ShiftDetails.InputCloseCash) + '</td></tr><tr><td style="text-align:center" colspan="3">Own Cash</td></tr><tr style="text-align:center"><td>System</td><td>Input</td><td>Difference</td></tr><tr style="text-align:center"><td>' + ShiftDetails.OwnCashIn + '</td><td>' + ShiftDetails.OwnCashOut + '</td><td>' + (ShiftDetails.OwnCashIn - ShiftDetails.OwnCashOut) + '</td></tr></table></div>';
            myWindow = window.open('Apon', 'Apon Plastic Pvt Ltd | Clock Out Report', 'width=900,height=600');
            myWindow.document.write(printContents);
            myWindow.focus();
            myWindow.print();
            myWindow.close();
        });
    }
});
