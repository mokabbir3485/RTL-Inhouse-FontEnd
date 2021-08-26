app.controller("PurchaseBillController", function ($scope, $cookieStore, $http, $filter, $timeout, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');

    load();

    function load() {
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        
        GetPagedPB($scope.currentPage);

        $("#txtDateOfPB1").val("");
        $scope.inv_PurchaseBill = {};
       
        $scope.AddProductLbl = 'Add Product';
        $scope.AddOverHeadLbl = 'Add OverHead';
        $scope.inv_PurchaseBillDetail = {};
        $scope.supplierlist = [];
        $scope.supplierAddresList = [];
        $scope.supplierRegList = [];
        $scope.supplierlistSearch = [];
        $scope.inv_PurchaseBillDetaillst = [];
        $scope.inv_StockPBDetailAdAttributeLst = [];
        $scope.PurchaseBillList = [];
        $scope.ConfirmationMessageForAdmin = false;
        $scope.inv_PurchaseBillOverHead = {};
        $scope.inv_PurchaseBillOverHeadlst = [];
        $scope.HsCodeList = [];
        GetHsCode();
        GetPriceType();
        GetAllVariety();
        GetSupplier();
        GetAllEmployee();
        GetByCombinationand();
        GetConfirmationMessageForAdmin();
        GetAllItemUnit();
        GetOverhead();
        GetUsersPermissionDetails();
        GetAllSupplerAddress();
        ClearProductCtrl();
        $scope.invPBDetailsFiledHide = false;
       // $scope.rbButton = true;
        $scope.btnIcon = "+";
        $scope.SalesOrderTypeList = ["Local", "Export"];
        $scope.ddlCurrencyType = null;
        $scope.CurrencyList = [
            { Id: 1, CurrencyType: "BDT" }, { Id: 2, CurrencyType: "USD" }];
      
        $scope.inv_PurchaseBillLocal = {};
        $scope.inv_PurchaseBillLocal.IsRaw = "true";

        $scope.inv_PurchaseBill.isRawMaterials = "true";
      

        $scope.hiddenFiled = false;
        $scope.inv_PurchaseBillDetailsItemCombination = {}; 
       
    }

    $scope.hideBtnColapse = function () {
        $scope.invPBDetailsFiledHide == true;

        //ainv_PurchaseBill.ShipmentInfo = ainv_PurchaseBill.ShipmentInfo == null ? "" : ainv_PurchaseBill.ShipmentInfo;
        $scope.invPBDetailsFiledHide = $scope.invPBDetailsFiledHide == false ? true : false;
        //if ($scope.btnIcon == "+") {
        //    $scope.invDetailsFiledHide = true;
        //} 
    }



    $("#txtDateOfPB1").datepicker({
        dateFormat: "M d yy",
        onSelect: function () {

            // $("#txtDateOfPB2").change();       
            $scope.OnSelectdate = $("#txtDateOfPB1").val();
            var today = $scope.OnSelectdate;
            $scope.financial_year = "";

            // var today = $("#txtDateOfPB2").val();
            var getMonth = today.substring(0, 3);


            var getFullYear = today.substring(6, 11);
            var fullYear = parseInt(getFullYear);

            console.log('Day', today);
            console.log('month', getMonth);
            console.log('year', parseInt(getFullYear));

            if (getMonth > 6) {
                $scope.financial_year = (fullYear - 1) + "-" + fullYear;
            } else {
                $scope.financial_year = fullYear + "-" + (fullYear + 1)
            }

            var getYear1 = $scope.financial_year.substring(2, 4);
            var getYear2 = $scope.financial_year.substring(7, 9);
            $scope.getAllYear = getYear1 + "-" + getYear2;
            $http({
                url: '/PurchaseBill/GetMaxPurchaseBillNo',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.inv_PurchaseBilldate = data;
                $scope.inv_PurchaseBill.PBNo = "PB/"+ $scope.getAllYear+"/"+ parseInt(data);
                console.log('inv_PurchaseBill PBNo', $scope.inv_PurchaseBill.PBNo);


            });
            console.log('financial_year', $scope.getAllYear);
            console.log("Date Change all", $scope.OnSelectdate);

        }

    });

    $scope.PBDateChange = function () {
        $("#txtDateOfPB1").focus();
        $("#txtDateOfPB1").trigger("click");

    }


    $scope.CalendartxtChallanDueDate = function () {
        $("#txtChallanDueDate").focus();
        $("#txtChallanDueDate").trigger("click");
    }

    $("#txtChallanDueDate").datepicker({
        dateFormat: "M d, yy"
    });


    function GetByCombinationand() {
        $http({
            url: '/Item/GetCombinationWithPrice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AllCombinationlist = angular.fromJson(data);
            console.log('$scope.AllCombinationlist ',$scope.AllCombinationlist );
        })
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
        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('PurchaseBillScreenId');
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

    function GetAllVariety() {
        $http({
            url: "/Item/GetLimitedProperty",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.VarietyList = data;
        });
    }

    function GetPriceType() {
        $http({
            url: '/PriceType/GetAllPriceType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.pricetypeentrylist = data;
            if (data.length == 1)
                $scope.ddlPriceType = { PriceTypeId: data[0].PriceTypeId, PriceTypeName: data[0].PriceTypeName };
        })
    }

    function GetSupplier() {
        $http({
            url: '/Supplier/GetAllSuppler',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.supplierlist = data;
         
            $scope.supplierlistSearch = angular.copy(data);
            if (data.length == 1)
                $scope.ddlSupplier = { SupplierId: data[0].SupplierId, SupplierName: data[0].SupplierName };
        })
    }
    function GetAllSupplerAddress() {
        $http({
            url: '/Supplier/GetAllSupplerAddress',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
           
            $scope.supplierAddresList = data;
            console.log("$scope.supplierAddresList",$scope.supplierAddresList);
          
           
        })
    }



    $scope.SupplierCombineAddressAndRegNo = function (supId) {
       
        angular.forEach($scope.supplierlist, function (adata) {

            if (supId == adata.SupplierId) {
                $scope.inv_PurchaseBill.NID = adata.NID;
                $scope.inv_PurchaseBill.SuppilerTypeName = adata.SuppilerTypeName;
                //$scope.inv_PurchaseBill.Address = adata.Address;
            } else {
                $scope.inv_PurchaseBill.NID = "";
                $scope.inv_PurchaseBill.SuppilerTypeName = "";
            }
            
        });
        angular.forEach($scope.supplierAddresList, function (adata) {

            if (supId == adata.SupplierId) {
                $scope.inv_PurchaseBill.Port = adata.Port;
                $scope.inv_PurchaseBill.Address = adata.Address;
            }
            else {
                $scope.inv_PurchaseBill.Port = "";
                $scope.inv_PurchaseBill.Address ="";
            }
        });
    }


    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.employeeList = data;
            $scope.ddlEmployee = { EmployeeId: $scope.LoginUser.EmployeeId, FullName: $scope.LoginUser.FullName };
        });
    }

    function GetOverhead() {
        $http({
            url: '/OverHead/GetAllOverhead',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.OverheadList = data;
        });
    }

    function Pad(number, length) {
        if (number.length > length) {
            return number;
        }
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
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

    function UpdatePriceAndQuantity() {
        $http({
            url: '/StockValuation/GetByItemAndUnitAndDepartment?itemId=' + $scope.inv_PurchaseBillDetail.ItemId + '&unitId=' + $scope.inv_PurchaseBillDetail.PBUnitId + '&transactiontypeid=1&pricetypeId=' + $scope.ddlPriceType.PriceTypeId + '&departmentId=null',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            var res = data;
            $scope.inv_PurchaseBillDetail.CurrentQuantity = res.CurrentQuantity;
            $scope.inv_PurchaseBillDetail.Price = res.Price;
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

    function ClearProductCtrl() {

        $scope.inv_PurchaseBillDetail = {};
        $scope.AddProductLbl = 'Add Product';


    }

    function clearOverHead() {
        $scope.inv_PurchaseBillOverHead = {};
        $scope.AddOverHeadLbl = 'Add OverHead';
        $scope.ddlOverhead = null;
    }

    //$scope.getMaxPBIdByDate = function () {
    //    //var date = $("#txtDateOfPB1").val();
    //    $http({
    //        url: '/PurchaseBill/GetMaxPurchaseBillNo',
    //        method: 'GET',
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (data) {
    //        $scope.inv_PurchaseBilldate = data;
    //        $scope.inv_PurchaseBill.PBNo = parseInt(data);
    //    });
    //};

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

            $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).Where(SearchCriteria).Take(7).ToArray();
            $scope.AllCombinationSearchRaw = Enumerable.From($scope.AllCombinationSearch).Where(function (x) {
                return x.CategoryName == "Finished Goods";
            }).Take(7).ToArray();

          //  "Finished Goods"
            $scope.AllCombinationSearchHardware = Enumerable.From($scope.AllCombinationlist).Where(function (x) {
                return x.CategoryName =="Hardware";
            }).Take(7).ToArray();

            console.log('Hardware', $scope.AllCombinationSearch);

            $scope.VisibilityOfSuggession = true;
        }
        else {
            $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).Take(7).ToArray();
            $scope.VisibilityOfSuggession = false;
        }
    }

    $scope.LoadACombination = function (aCombination) {
        $scope.ItemCombination = aCombination;
        console.log("Load Combination", aCombination);
        $scope.VisibilityOfSuggession = false;
        $scope.ItemSearchCombination = $scope.ItemCombination.Combination;
        $scope.AllCombinationSearch = [];
        $scope.ddlMu = { ItemUnitId: $scope.ItemCombination.DefaultPurchaseMeasurementId }
        setTimeout(function () {
            $('#txtQty').focus();
        }, 200);

        $scope.PurchaseUnitPrice = 0;
        $scope.PurchaseUnitPrice = aCombination.PurchaseUnitPrice;
        console.log("PurchaseUnitPrice", $scope.PurchaseUnitPrice);
    }

   

    $scope.unitFilter = function (RawItem) {
        return function (pram) {
            return (pram.ItemUnitId == RawItem.UnitId) || (pram.ItemUnitId == RawItem.PackageId) || (pram.ItemUnitId == RawItem.ContainerId);
        };
    }


   
    $scope.AddPBDetail = function () {
       
       
        if (!angular.isUndefined($scope.ItemCombination) && (angular.isUndefined($scope.ItemCombination.AttributeQty) || $scope.ItemCombination.AttributeQty < 1)) {
            $scope.ItemCombination.AttributeQty = 1;
            alertify.log("Minimum 1 Quantity is required", "error", "5000");
            $('#txtQty').focus();
            return;
        }
        if (!angular.isUndefined($scope.ItemCombination) && (angular.isUndefined($scope.ItemCombination.PurchaseUnitPrice) || $scope.ItemCombination.PurchaseUnitPrice < 0)) {
            alertify.log("Minimum zero price is required", "error", "5000");
            $('#txtPurchasePrice').focus();
            return;
        }

        var itemType = {};
        itemType = Enumerable.From($scope.VarietyList).Where('$.ItemId==' + $scope.ItemCombination.ItemId).FirstOrDefault();
        if (!angular.isUndefined(itemType.CategoryName) && itemType.CategoryName == "Hardware") {
            if (!angular.isUndefined($scope.ItemCombination) && $scope.ItemCombination.AttributeQty > 999) {
                $scope.ItemCombination.AttributeQty = 1;
                alertify.log("Maximum Quantity is 999", "error", "5000");
                $('#txtQty').focus();
                return;
            }
        }

        var flag = true;
        angular.forEach($scope.inv_StockPBDetailAdAttributeLst, function (aDetailAdAttribute) {
            if (aDetailAdAttribute.Barcode == $scope.ItemCombination.Barcode) {
                flag = false;
            }
        });

        if (flag) {
            //var ValueOfAttribute = [];
            //var a = $scope.ItemCombination.AttributeNames.split(',');
            //for (var i = 0; i < a.length; i++) {
            //    var val = a[i].split(':');
            //    ValueOfAttribute.push(val[1].trim());
            //}
           
            $scope.ItemCombination.ValueOfAttribute = [$scope.ItemCombination.AttributeNames];
            var Attribute = $scope.ItemCombination;
            Attribute.PBUnitId = $scope.ddlMu.ItemUnitId;
            Attribute.UnitName = GetUnitNameById(Attribute.PBUnitId);
            Attribute.AttributeUnitPrice = $scope.ItemCombination.PurchaseUnitPrice;
           
            Attribute.BilledQty = 0;
            Attribute.POQuantity = 0;
            Attribute.ReceivedQty = 0;
            Attribute.PBQty = Attribute.AttributeQty;
            Attribute.PBPrice = $scope.ItemCombination.PurchaseUnitPrice;
            Attribute.Amount = Attribute.PBQty * Attribute.PBPrice;
            var itemDetailsByItemId = Enumerable.From($scope.VarietyList).Where('$.ItemId==' + Attribute.ItemId).FirstOrDefault();
            Attribute.ItemName = itemDetailsByItemId.ItemName;
            Attribute.ItemCode = itemDetailsByItemId.ItemCode;

            
          
          
            /// Abir Add Column
            Attribute.CurrentStock = $scope.ItemCombination.CurrentStock;
          
            //Attribute.CurrencyType = $scope.ddlCurrencyType;
            //Attribute.CurrencyTy= $scope.ddlCurrencyType;
          
            //$scope.ddlCurrencyType = { Id: Attribute.CurrencyTy };
            $scope.ItemCombination.CurrencyType = angular.copy({ Id: $scope.ddlCurrencyType });
            angular.forEach($scope.ItemCombination.CurrencyType, function (aData) {
                Attribute.CurrencyType = aData.CurrencyType;
            })
            
            Attribute.ConversionRate = $scope.ItemCombination.ConversionRate;
            Attribute.TotalConversion = $scope.ItemCombination.TotalConversion;

            Attribute.SdPercentage = $scope.ItemCombination.SdPercentage;
            Attribute.SdAmount = $scope.ItemCombination.SdAmount;
            Attribute.CdPercentage = $scope.ItemCombination.CdPercentage;
            Attribute.CdAmount = $scope.ItemCombination.CdAmount;
            Attribute.VatPercentage = $scope.ItemCombination.VatPercentage;
            Attribute.VatAmount = $scope.ItemCombination.VatAmount;
            Attribute.TaxPercentage = $scope.ItemCombination.TaxPercentage;
            Attribute.TaxAmount = $scope.ItemCombination.TaxAmount;
            Attribute.RdPercentage = $scope.ItemCombination.RdPercentage;
            Attribute.RdAmount = $scope.ItemCombination.RdAmount;
            Attribute.AitPercentage = $scope.ItemCombination.AitPercentage;
            Attribute.AitAmount = $scope.ItemCombination.AitAmount;
            Attribute.AtPercentage = $scope.ItemCombination.AtPercentage;

            Attribute.AtAmount = $scope.ItemCombination.AtAmount;
            Attribute.TtiPercentage = $scope.ItemCombination.TtiPercentage;
            Attribute.TtiAmount = $scope.ItemCombination.TtiAmount;

            Attribute.TotalCost = $scope.ItemCombination.TotalCost;
            Attribute.VDS = $scope.ItemCombination.VDS;

           

            Attribute.SerialAndWarrentyList = [];
            if (itemDetailsByItemId.CategoryName == "Hardware") {
                var SerialAndWarrentyList = [];
                var tableRowNo = 1;
                for (var i = 0; i < Attribute.PBQty; i++) {
                    var SerialAndWarrentyList = {};
                    SerialAndWarrentyList.ItemId = Attribute.ItemId;
                    SerialAndWarrentyList.TableRowNo = tableRowNo;
                    SerialAndWarrentyList.SerialNo = "";
                    SerialAndWarrentyList.WarrentyInDays = 0;
                    Attribute.SerialAndWarrentyList.push(SerialAndWarrentyList);
                    tableRowNo++;
                }
            }

            
           $scope.inv_StockPBDetailAdAttributeLst.push(Attribute);

            console.log('$scope.inv_StockPBDetailAdAttributeLst',$scope.inv_StockPBDetailAdAttributeLst);

            flag = true;
            angular.forEach($scope.inv_PurchaseBillDetaillst, function (aItem) {
                if (aItem.ItemId == $scope.ItemCombination.ItemId) {
                    flag = false;
                }
            });
            if (flag) {
                var Item = {};
                angular.forEach($scope.VarietyList, function (aItem) {
                    if (aItem.ItemId == $scope.ItemCombination.ItemId) {
                        Item = aItem;
                    }
                })
                Item.HeaderOfAttribute = [];
               
                Item.UnitName = GetUnitNameById(Attribute.PBUnitId);
                Item.HeaderOfAttribute = ["Description"];
                Item.PBQty = Attribute.AttributeQty;
                Item.TotalCost = Attribute.TotalCost;

                Item.PBPrice = $scope.ItemCombination.PurchaseUnitPrice;
               
                
                Item.TotalPBPrice = Attribute.PurchaseUnitPrice;
               // Item.TotalPBPrice = TotalPBPriceCal;

                Item.TotalExclusiveCost= Attribute.TotalCost;
                //Item.TotalExclusiveCost = TotalExclusiveCost;
               
                $scope.inv_PurchaseBillDetaillst.push(Item);
                $scope.TotalExclusiveCost = 0;
                $scope.TotalPBPriceCal = 0;
                $scope.TotalQty = 0;
                angular.forEach($scope.inv_PurchaseBillDetaillst, function (adata) {
                    $scope.TotalQty += adata.PBQty;
                    $scope.TotalExclusiveCost +=adata.TotalExclusiveCost;
                    $scope.TotalPBPriceCal += adata.TotalPBPrice;
                    
                });

            }

            $scope.ItemCombination = {};
            //$scope.inv_PurchaseBillDetail = {};
            $scope.ItemSearchCombination = null;
            //$scope.ddlCurrencyType = null;
            $('#SearchTextBox').focus();
        }
        else {
            alertify.log('This Combination already Exist, Try another one !!!', 'error', '5000');
        }

      
    }

    GetAllSerialAndWarrentyNumber();
    $scope.warrentySerialList = [];
    function GetAllSerialAndWarrentyNumber() {
        $http({
            url: '/PurchaseBill/GetAllWarrentyAndSerial',
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.warrentySerialList = data;
        });
    }


    $scope.GetPBDetails = function (aPurchaseBill) {
       // $scope.invDetailsFiledHide = true;
        $scope.ddlEmployee = { EmployeeId: aPurchaseBill.PreparedById };
        $scope.ddlSupplier = { SupplierId: aPurchaseBill.SupplierId };
        $scope.inv_PurchaseBill = aPurchaseBill;
        //$scope.inv_PurchaseBill.PBDate = aPurchaseBill.PBDate;
     //   $scope.inv_PurchaseBill.isRawMaterials = aPurchaseBill.isRawMaterials;
       // aPurchaseBill.isRawMaterials = aPurchaseBill.isRawMaterials == true ? false : false;
       
        var res = aPurchaseBill.PBDate.substring(0, 5);
        if (res == "/Date") {
            var parsedDate = new Date(parseInt(aPurchaseBill.PBDate.substr(6)));
            $scope.inv_PurchaseBill.PBDate = $filter('date')(parsedDate, 'MMM dd, yyyy');
        }
        
        angular.forEach($scope.supplierlist, function (adata) {
            if ($scope.ddlSupplier == adata.SupplierId) {
                $scope.inv_PurchaseBill.NID = adata.NID;
                //$scope.inv_PurchaseBill.SuppilerTypeName = adata.SuppilerTypeName="Not set";
            }
        });

        angular.forEach($scope.supplierAddresList, function (adata) {
            if ($scope.ddlSupplier == adata.SupplierId) {
                $scope.inv_PurchaseBill.Port = adata.Port;
                $scope.inv_PurchaseBill.Address = adata.Address;
            }

        });
        $scope.inv_PurchaseBillDetaillst = [];
        $scope.inv_StockPBDetailAdAttributeLst = [];
        $scope.inv_PurchaseBillOverHeadlst = [];
        $http({
            //url: "/PurchaseBill/PurchaseBillDetailGetByPBId?pbId+",
            url: '/PurchaseBill/PurchaseBillDetailGetByPBId?pbId=' + aPurchaseBill.PBId,
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            angular.forEach(data, function (aData) {

                //var ItemCombination = Enumerable.From($scope.AllCombinationlist).Where('$.ItemId==' + aData.ItemId).FirstOrDefault();
                //var checkCategory = Enumerable.From($scope.VarietyList).Where('$.ItemId==' + ItemCombination.ItemId).FirstOrDefault();


                //  $scope.ItemCombination.ValueOfAttribute = [$scope.ItemCombination.AttributeNames];
                var Attribute = {};

                Attribute.CurrentStock = aData.CurrentStock;

                Attribute.ConversionRate = aData.ConversionRate;
                Attribute.TotalConversion = aData.TotalConversion;

                Attribute.SdPercentage = aData.SdPercentage;
                Attribute.SdAmount = aData.SdAmount;
                Attribute.CdPercentage = aData.CdPercentage;
                Attribute.CdAmount = aData.CdAmount;
                Attribute.VatPercentage = aData.VatPercentage;
                Attribute.VatAmount = aData.VatAmount;
                Attribute.TaxPercentage = aData.TaxPercentage;
                Attribute.TaxAmount = aData.TaxAmount;
                Attribute.RdPercentage = aData.RdPercentage;
                Attribute.RdAmount = aData.RdAmount;
                Attribute.AitPercentage = aData.AitPercentage;
                Attribute.AitAmount = aData.AitAmount;
                Attribute.AtPercentage = aData.AtPercentage;

                Attribute.AtAmount = aData.AtAmount;
                Attribute.TtiPercentage = aData.TtiPercentage;
                Attribute.TtiAmount = aData.TtiAmount;

                Attribute.TotalCost = aData.TotalCost;
                Attribute.VDS = aData.VDS;
                Attribute.PBDetailId = aData.PBDetailId;
                Attribute.PBId = aData.PBId;
                Attribute.PBPrice = aData.PBPrice;
                Attribute.PBUnitId = aData.PBUnitId;
                Attribute.ItemName = aData.ItemName;
                Attribute.PackageId = aData.PackageId;
                Attribute.ContainerId = aData.ContainerId;
                Attribute.UnitName = aData.UnitName;
                
                //Attribute.isRawMaterials = aData.isRawMaterials;
                Attribute.ItemId = aData.ItemId;
                var itemDetailsByItemId = Enumerable.From($scope.VarietyList).Where('$.ItemId==' + aData.ItemId).FirstOrDefault();
                Attribute.SerialAndWarrentyList = [];
                //var Serial = Enumerable.From($scope.warrentySerialList).Where('$.PBDetailId==' + aData.PBDetailId).FirstOrDefault();
                //console.log('Serial', Serial);
                angular.forEach($scope.warrentySerialList, function (serialData) {
                    if (aData.PBDetailId == serialData.PBDetailId) {
                        $scope.pb
                    }
                });
                if (itemDetailsByItemId.CategoryName == "Hardware") {
                    
                    $http({
                        //url: "/PurchaseBill/PurchaseBillDetailGetByPBId?pbId+",
                        url: '/PurchaseBill/PurchaseBillDetailSerialSerialId?SerialId=' + aData.PBDetailId,
                        method: "GET",
                        headers: { 'Content-Type': "application/json" }
                    }).success(function (data) {
                       
                        angular.forEach(data,function (sdata) {
                            var SerialAndWarrentyList = [];
                            SerialAndWarrentyList.ItemId = sdata.ItemId;
                            SerialAndWarrentyList.SerialNo = sdata.SerialNo;
                            SerialAndWarrentyList.WarrentyInDays = sdata.WarrentyInDays;
                            Attribute.SerialAndWarrentyList.push(SerialAndWarrentyList);
                        });
                    });
                }

                $http({
                    url: '/PurchaseBill/PurchaseBillDetailGetByOverHead?PbId=' + aData.PBId,
                    method: "GET",
                    headers: { 'Content-Type': "application/json" }
                }).success(function (data) {
                    angular.forEach(data, function (overHeadData) {
                        var overheadAttrList = [];
                        overheadAttrList.Amount = overHeadData.Amount;
                        overheadAttrList.OverHeadName = overHeadData.OverHeadName;
                        overheadAttrList.OverHeadId = overHeadData.OverHeadId;
                        overheadAttrList.PBId = overHeadData.PBId;
                        overheadAttrList.OverHeadName = overHeadData.OverHeadName;
                        $scope.inv_PurchaseBillOverHeadlst.push(overheadAttrList);
                    })
                   

                });

                
                $scope.inv_StockPBDetailAdAttributeLst.push(Attribute);

                flag = true;
                angular.forEach($scope.inv_PurchaseBillDetaillst, function (aItem) {
                    if (aItem.ItemId == aData.ItemId) {
                        flag = false;
                    }
                });

                if (flag) {
                    var Item = {};
                    angular.forEach($scope.VarietyList, function (aItem) {
                        if (aItem.ItemId == aData.ItemId) {
                            Item = aItem;
                            console.log(aItem.ItemId);
                        }
                        
                    })
                    Item.HeaderOfAttribute = [];

                    Item.UnitName = GetUnitNameById(aData.PBUnitId);
                    Item.HeaderOfAttribute = ["Description"];
                    Item.PBQty = aData.PBQty;
                    Item.PBPrice = aData.PBPrice;

                    $scope.inv_PurchaseBillDetaillst.push(Item);
                }

            });

            // console.log('$scope.HsCodeList ', $scope.inv_PurchaseBillOverHeadlst);
        })



    }

    $scope.RawMatrialEmpty = function () {
        $scope.ItemCombination = {};
        //$scope.inv_PurchaseBillDetail = {};
        $scope.ItemSearchCombination = null;
    }

    $scope.AppendSerialAndWarrentyWhenQtyChange = function (stockReceiveDetailAdAttribute) {
        if (angular.isUndefined(stockReceiveDetailAdAttribute.AttributeQty) || stockReceiveDetailAdAttribute.AttributeQty < 1) {
            stockReceiveDetailAdAttribute.AttributeQty = 1;
            alertify.log("Minimum 1 Quantity is required.", "error", "5000");
            return;
        }

        if (stockReceiveDetailAdAttribute.AttributeQty > 999) {
            stockReceiveDetailAdAttribute.AttributeQty = 1;
            alertify.log("Maximum Quantity is 999.", "error", "5000");
            return;
        }

        var changegQty = Enumerable.From($scope.inv_StockPBDetailAdAttributeLst)
                        .Where('$.ItemId==' + stockReceiveDetailAdAttribute.ItemId + '&& $.ItemAddAttId==' + stockReceiveDetailAdAttribute.ItemAddAttId)
                        .FirstOrDefault();
        if (!angular.isUndefined(changegQty)) {
            changegQty.PBQty = stockReceiveDetailAdAttribute.AttributeQty;
            changegQty.Amount = changegQty.PBQty * changegQty.PBPrice;
        }
        if (stockReceiveDetailAdAttribute.SerialAndWarrentyList.length > 0) {
            var SerialAndWarrentyList = [];
            var tableRowNo = 1;
            for (var i = 0; i < stockReceiveDetailAdAttribute.AttributeQty; i++) {
                var SerialAndWarrenty = {
                    ItemAddAttId: stockReceiveDetailAdAttribute.ItemAddAttId,
                    TableRowNo: tableRowNo,
                    SerialNo: "",
                    WarrentyInDays: 0,
                };
                SerialAndWarrentyList.push(SerialAndWarrenty);
                tableRowNo++;
            }
            stockReceiveDetailAdAttribute.SerialAndWarrentyList = [];
            stockReceiveDetailAdAttribute.SerialAndWarrentyList = SerialAndWarrentyList;
        }



    };

    $scope.CheckItemQty = function () {

    }

    $scope.CheckPrice = function (pbDetailAdAttribute) {
        if (angular.isUndefined(pbDetailAdAttribute.AttributeUnitPrice) || pbDetailAdAttribute.AttributeUnitPrice < 0) {
            pbDetailAdAttribute.AttributeUnitPrice = 0;
            alertify.log("Minimum zero price is required", "error", "5000");
            return;
        }
    }

    $scope.CheckDuplicatePBNo = function () {

        var date = $("#txtDateOfPB1").val();
        if (date == "") {
            $("#txtDateOfPB1").focus();
            alertify.log('Please select date.', 'error', '5000');
            return;
        }

        if (angular.isUndefined($scope.inv_PurchaseBill.PBNo) || $scope.inv_PurchaseBill.PBNo == null) {
            $("#txtReceiveNo").focus();
            alertify.log('Purchase Bill No. is required.', 'error', '5000');
            return;
        }

        $http({
            url: '/PurchaseBill/CheckDuplicatePBNo?PBNo=' + $scope.inv_PurchaseBill.PBNo + "&date=" + date,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                $scope.found = true;
                alertify.log("P.B No. " + $scope.inv_PurchaseBill.PBNo + ' already exists!', 'error', '3000');
                $scope.inv_PurchaseBill.PBNo = "";
                $('#PbNo').focus();
            } else {
                $scope.found = false;
            }
        });


    }

    $scope.autoWarrantyInDaysValue = function (SerialDtAttri) {
        var WarrentyInDays = SerialDtAttri.WarrentyInDays;

        var ItemAddAttId = SerialDtAttri.ItemAddAttId;
        angular.forEach($scope.inv_StockPBDetailAdAttributeLst, function (adata) {
            {
                angular.forEach(adata.SerialAndWarrentyList, function (serial) {
                    if (serial.ItemAddAttId == ItemAddAttId) {
                        serial.WarrentyInDays = WarrentyInDays;
                    }

                    if (serial.WarrentyInDays == "" || serial.WarrentyInDays == null) {
                        serial.WarrentyInDays = 0;
                    }
                });

            }
        });
    }

    $scope.checkDuplicateSerialNo = function (SerialDtAttri) {
        if (SerialDtAttri.SerialNo == '' || angular.isUndefined(SerialDtAttri.SerialNo))
            return;

        var isFound = false;
        var serialNoFound = "";
        var serialListByItemAddAttr = {};
        serialListByItemAddAttr = Enumerable.From($scope.inv_StockPBDetailAdAttributeLst).Where('$.ItemAddAttId==' + SerialDtAttri.ItemAddAttId).FirstOrDefault();

        if (!serialListByItemAddAttr.SerialAndWarrentyList.length) {
            return;
        }

        for (var i = 0; i < serialListByItemAddAttr.SerialAndWarrentyList.length; i++) {
            if (serialListByItemAddAttr.SerialAndWarrentyList[i].SerialNo == SerialDtAttri.SerialNo && serialListByItemAddAttr.SerialAndWarrentyList[i].TableRowNo != SerialDtAttri.TableRowNo) {
                serialNoFound = SerialDtAttri.SerialNo;
                SerialDtAttri.SerialNo = "";
                isFound = true;
                break;
            }
        }
        if (isFound) {
            alertify.log('<b style="color:yellow;font-weight:bold;">' + serialNoFound + "</b> Found as a Duplicate Value.", "error", "5000");
            return;
        }

        var minTableRowNo = Enumerable.From(serialListByItemAddAttr.SerialAndWarrentyList)
                            .Min("$.TableRowNo");

        if (SerialDtAttri.TableRowNo == minTableRowNo) {
            //here we'll use alert for auto serial confirmation
            if (1 == 1) {
                var indexOfStr = -1;
                var serialNo = SerialDtAttri.SerialNo;

                for (var i = serialNo.length - 1; i >= 0; i--) {
                    if (parseInt(serialNo[i]) || serialNo[i] == "0") {
                        indexOfStr = i;
                    } else {
                        break;
                    }
                }

                if (indexOfStr > -1) {

                    var number = parseInt(serialNo.substring(indexOfStr, serialNo.length));
                    var numberLength = serialNo.substring(indexOfStr, serialNo.length).length;
                    var textPart = serialNo.substring(0, indexOfStr);

                    angular.forEach(serialListByItemAddAttr.SerialAndWarrentyList, function (adata) {
                        adata.SerialNo = textPart + Pad(number.toString(), numberLength);
                        number++;
                    })
                }
            }
        }
        var notEmptySerial = [];
        var pPurchaseBillDetailSerialList = [];
        notEmptySerial = Enumerable.From(serialListByItemAddAttr.SerialAndWarrentyList).Where('$.SerialNo!=""').ToArray();

        for (var i = 0; i < notEmptySerial.length; i++) {
            pPurchaseBillDetailSerial = {
                DepartmentId: 0,
                ItemAddAttId: notEmptySerial[i].ItemAddAttId,
                PBDetailId: notEmptySerial[i].PBDetailId,
                PBDetailSerialId: notEmptySerial[i].PBDetailSerialId,
                SerialNo: notEmptySerial[i].SerialNo,
                WarrentyInDays: notEmptySerial[i].WarrentyInDays
            }
            pPurchaseBillDetailSerialList.push(pPurchaseBillDetailSerial);
        }

        if (pPurchaseBillDetailSerialList.length) {
            $.ajax({
                url: "/WarrentyAndSerialNo/GetWarrantyAndSerialNoDynamic",
                contentType: "application/json;charset=utf-8",
                type: "POST",
                data: JSON.stringify({ pPurchaseBillDetailSerialList: pPurchaseBillDetailSerialList }),
                success: function (dataFound) {
                    if (dataFound.SerialNo == null)
                        return;

                    var duplicateCount = 0;
                    var isSerialExist = Enumerable.From($scope.inv_StockPBDetailAdAttributeLst).Where('$.ItemAddAttId==' + dataFound.ItemAddAttId).FirstOrDefault();

                    if (!angular.isUndefined(isSerialExist)) {
                        for (var i = 0; i < isSerialExist.SerialAndWarrentyList.length; i++) {
                            isSerialExist.SerialAndWarrentyList[i].SerialNo = "";
                            duplicateCount++;
                        }
                    }

                    if (duplicateCount > 0) {
                        var dupNo = 1;
                        if (duplicateCount > 1) {
                            dupNo = duplicateCount
                        }
                        alertify.log(dupNo + ' Duplicate Serial No Found., Try again !!!', 'error', '5000');
                    }
                }, error: function (msg) {
                    alertify.log('Server Save Errors!', 'error', '10000');
                }
            });
        }
    }

    $scope.setEmptyStringIfNull = function (SerialDtAttri) {
        if (angular.isUndefined(SerialDtAttri.SerialNo)) {
            SerialDtAttri.SerialNo = "";
        }
    }

    $scope.UpdatePriceAndQuantityFromddlMU = function () {
        if ($scope.ddlSalesMu) {
            $scope.inv_PurchaseBillDetail.PBUnitId = $scope.ddlSalesMu.ItemUnitId;
            $scope.inv_PurchaseBillDetail.ItemName = $scope.ddlSalesMu.UnitName;
            UpdatePriceAndQuantity();
        }
    }

    $scope.AddOverHead = function () {
        if (!$scope.inv_PurchaseBillOverHead.Amount) {
            alertify.log('Enter Amount', 'error', '10000');
        }
        else {
            if ($scope.AddOverHeadLbl == 'Add OverHead') {
                var flag = true;
                angular.forEach($scope.inv_PurchaseBillOverHeadlst, function (aDetails) {
                    if (aDetails.OverHeadId == $scope.ddlOverhead.OverHeadId) {
                        flag = false;
                    }
                });
                if (flag) {
                    $scope.inv_PurchaseBillOverHead.OverHeadId = $scope.ddlOverhead.OverHeadId;
                    $scope.inv_PurchaseBillOverHead.OverHeadName = $scope.ddlOverhead.OverHeadName;
                    $scope.inv_PurchaseBillOverHeadlst.push($scope.inv_PurchaseBillOverHead);
                    clearOverHead();
                }
                else {
                    alertify.log('OverHead alredy exist!', 'error', '10000');
                }
            }
            else {
                clearOverHead();
            }
        }
    }

    $scope.RemoveOverHead = function (index) {
        $scope.inv_PurchaseBillOverHeadlst.splice(index, 1);
        clearOverHead();
    }

    $scope.RowClickOninv_PurchaseBillOverHeadlst = function (ainv_PurchaseBillOverHead) {
        $scope.inv_PurchaseBillOverHead = ainv_PurchaseBillOverHead;
        $scope.ddlOverhead = { "OverHeadId": ainv_PurchaseBillOverHead.OverHeadId };
        $scope.AddOverHeadLbl = 'Update OverHead';
    }

    $scope.RemoveItemAttr = function (aDetail) {
        var ind = $scope.inv_StockPBDetailAdAttributeLst.indexOf(aDetail);
        $scope.inv_StockPBDetailAdAttributeLst.splice(ind, 1);
        angular.forEach($scope.inv_PurchaseBillDetaillst, function (ainv_PurchaseBillDetaillst) {
            if (Enumerable.From($scope.inv_StockPBDetailAdAttributeLst).Where('$.ItemId==' + ainv_PurchaseBillDetaillst.ItemId).ToArray().length < 1) {
                var ind = $scope.inv_PurchaseBillDetaillst.indexOf(ainv_PurchaseBillDetaillst);
                $scope.inv_PurchaseBillDetaillst.splice(ind, 1);
            }
        });
    }

    $scope.SavePB = function () {
        
        console.log('All Data',$scope.inv_PurchaseBill);

        var hasProblemWithSerialNo = false;
        var pbItemList = $scope.inv_StockPBDetailAdAttributeLst;
        console.log($scope.inv_StockPBDetailAdAttributeLst);

        for (var i = 0; i < pbItemList.length; i++) {
            if (pbItemList[i].SerialAndWarrentyList.length > 0) {
                var emptySerialNo = null;
                emptySerialNo = Enumerable.From(pbItemList[i].SerialAndWarrentyList).Where('$.SerialNo!=""').FirstOrDefault();

                if (!angular.isUndefined(emptySerialNo)) {
                    var count = Enumerable.From(pbItemList[i].SerialAndWarrentyList).Where('$.SerialNo!=""').Count();
                    if (count != pbItemList[i].SerialAndWarrentyList.length) {
                        hasProblemWithSerialNo = true;
                        break;
                    }
                }
            }
        }

        if (hasProblemWithSerialNo) {
            alertify.log("You've to fill all Serial No Where you already put some.", 'error', '10000');
            return;
        }

        //var from = $("#txtDateOfPB1").val().split("/");
        //if (from.length < 2) {
        //    alertify.log("Please select PB Date", 'error', '10000');
        //    return;
        //}

        alertify.confirm("Are you sure to save?", function (e) {
            if (e) {
                var warrentyAndSerialList = [];
                for (var i = 0; i < pbItemList.length; i++) {
                    var serialList = Enumerable.From(pbItemList[i].SerialAndWarrentyList).Where('$.SerialNo!=""').ToArray();
                    console.log(serialList);

                    if (serialList.length) {
                        angular.forEach(serialList, function (sData) {
                            serial = {
                                PBDetailId: 0,
                                DepartmentId: 0,
                                SerialNo: sData.SerialNo,
                                WarrentyInDays: sData.WarrentyInDays,
                                ItemId: sData.ItemId
                            }
                            warrentyAndSerialList.push(serial);
                        });
                    }
                }

                $scope.inv_PurchaseBill.IsApproved = false;
                $scope.inv_PurchaseBill.SupplierId = $scope.ddlSupplier.SupplierId;
                $scope.inv_PurchaseBill.SupplierName = $scope.ddlSupplier.SupplierName;
                $scope.inv_PurchaseBill.PreparedById = $scope.ddlEmployee.EmployeeId;
                $scope.inv_PurchaseBill.PreparedBy = $scope.ddlEmployee.FullName;
                $scope.inv_PurchaseBill.CreatorId = $scope.LoginUser.UserId;
                $scope.inv_PurchaseBill.UpdatorId = $scope.LoginUser.UserId;
                $scope.inv_PurchaseBill.PriceTypeId = $scope.ddlPriceType.PriceTypeId;
                $scope.inv_PurchaseBill.PriceTypeName = $scope.ddlPriceType.PriceTypeName;

                from = $("#txtDateOfPB1").val().split("/");
                var f = new Date(from[2], from[1] - 1, from[0]);
                $scope.inv_PurchaseBill.PBDate = f;
                $.ajax({
                    url: "/PurchaseBill/Save",
                    contentType: "application/json;charset=utf-8",
                    type: "POST",
                    data: JSON.stringify({ ainv_PurchaseBill: $scope.inv_PurchaseBill, inv_PurchaseBillDetailLst: $scope.inv_StockPBDetailAdAttributeLst, inv_PurchaseBillOverHeadLst: $scope.inv_PurchaseBillOverHeadlst, inv_PurchaseBillDetailSerial: warrentyAndSerialList }),
                    success: function (data) {
                        if (data > 0) {
                            //$window.open("#/Mushak6_1", "popup", "width=850,height=550,left=280,top=80");
                            //$cookieStore.put("PBId", data);
                            alertify.log('Purchase Bill Saved Successfully!', 'success', '5000');
                            load();
                            $scope.purchaseBillEntry.$setPristine();
                            $scope.purchaseBillEntry.$setUntouched();
                            $window.open("/ErpReports/RV_Inv_PurchaseBillByPBId.aspx?PBId=" + data, "_blank", "width=790,height=630,left=340,top=25");

                        }
                    }, error: function (msg) {
                        alertify.log('Server Save Errors!', 'error', '10000');
                    }
                });
            }
        })
    }

    $scope.Reset = function () {
        load();
        $scope.purchaseBillEntry.$setPristine();
        $scope.purchaseBillEntry.$setUntouched();
        $scope.ItemSearchCombination = null;
        $("#txtDateOfPB1").val("");
    }



    $("#txtFromDateForPB").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.FormDateChangeForPB = function () {
        $("#txtFromDateForPB").focus();
        $("#txtFromDateForPB").trigger("click");
    }


    $("#txtToDateForPB").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.ToDateChangeForPB = function () {
        $("#txtToDateForPB").focus();
        $("#txtToDateForPB").trigger("click");
    }

    $scope.reloadBtn = function () {
        $('#txtFromDateForPB').val('');
        $('#txtToDateForPB').val('');
        $('#PBAndCompany').val('');
        $scope.FromDate = "";
        $scope.ToDate = "";
        $scope.SearchPBAndCompanyName = null;
        GetPagedPB(1);
    }

    $scope.PBSearch = function () {
        GetPagedPB(1);

    }


    

   

    
    

    

   

    $scope.totalCalculationCD = function () {   
        $scope.inv_PurchaseBillDetail.RdAmount;
    }

    function GetHsCode() {

        $http({
            url: "/ItemHsCode/Get",
            method: "Get",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            $scope.HsCodeList = angular.copy(data);
            console.log('$scope.HsCodeList ',$scope.HsCodeList );
        })
    }

   

   

    $scope.CurrencyTypeConvertion = function (CurId) {
        $scope.ddlCurrencyType = { Id: CurId };
        AllCommonCurrencyCalculation();
    }

    $scope.itemCombinationCalculation = function (HsCodeId) {
        $scope.ItemCombination.ConversionRate = 85;
        $scope.ddlCurrencyType = { Id: 1 };
        //$scope.invDetailsFiledHide = true;
        AllCommonCurrencyCalculation();
   
  
        $scope.hasCode = angular.copy(HsCodeId);
      
        angular.forEach($scope.HsCodeList, function (adata) {
            if (HsCodeId == adata.HsCodeId) {

                $scope.ItemCombination.CdPercentage = adata.CD;

                $scope.ItemCombination.RdPercentage = adata.RD;

                $scope.ItemCombination.SdPercentage = adata.SD;

                $scope.ItemCombination.VatPercentage = adata.VAT;

                $scope.ItemCombination.AitPercentage = adata.AIT;

                $scope.ItemCombination.AtPercentage = adata.AT;

                $scope.ItemCombination.TtiPercentage = adata.TTI;

            } 
        })
        CurrencyCommonCalculation();
        
    }
   

    function AllCommonCurrencyCalculation() {
        
        
        if ($scope.ddlCurrencyType.Id == 2) {
          
            $scope.currencyCalculation = $scope.ItemCombination.PurchaseUnitPrice / $scope.ItemCombination.ConversionRate;
            $scope.ItemCombination.TotalConversion = $scope.currencyCalculation;
        }
        else {
            $scope.currencyCalculation = $scope.ItemCombination.PurchaseUnitPrice * $scope.ItemCombination.ConversionRate ;
            $scope.ItemCombination.TotalConversion = $scope.currencyCalculation;
            //$scope.ItemCombination.ConversionRate = 85;
        }

        $scope.PBsum = 0;
        var T1 = 0, T2 = 0, T3 = 0, T4 = 0;
        // var parcent = $scope.inv_PurchaseBillDetail.ConversionRate / 100;
        var parcent = 20 / 100;

        T1 = $scope.currencyCalculation;
        T2 = T1 * parcent;
        T3 = (T1 + T2) * parcent;
        T4 = (T1 + T2 + T3) * parcent;
        $scope.PBsum = T1 + T2 + T3 + T4;

        CurrencyCommonCalculation();
    }

    $scope.PBConversionRateMethod = function () {
        AllCommonCurrencyCalculation(); 
    }


    $scope.ConversionRateMethod = function () {
        AllCommonCurrencyCalculation(); 
       
    }

    function CurrencyCommonCalculation() {
       
       // $scope.itemList = [];
        angular.forEach($scope.HsCodeList, function (adata) {
            if ($scope.hasCode == adata.HsCodeId) {

                var CDTotal = 0;
                // $scope.inv_PurchaseBillDetail.CdPercentage = adata.CD;
                CDTotal = ($scope.PBsum) * ((adata.CD / 100)).toFixed(2);
                $scope.ItemCombination.CdAmount = CDTotal;
                var RDTotal = 0;
                // $scope.inv_PurchaseBillDetail.RdPercentage = adata.RD;
                RDTotal = ($scope.PBsum) * (adata.RD / 100);
                $scope.ItemCombination.RdAmount = RDTotal;

                var SDTotal = 0;
                // $scope.inv_PurchaseBillDetail.SdPercentage = adata.SD;
                SDTotal = ($scope.PBsum + CDTotal + RDTotal) * (adata.SD / 100);
                $scope.ItemCombination.SdAmount = SDTotal;

                var TotalVat = 0;
                // $scope.inv_PurchaseBillDetail.VatPercentage = adata.VAT;
                TotalVat = ($scope.PBsum + CDTotal + RDTotal + SDTotal) * (adata.VAT / 100);
                $scope.ItemCombination.VatAmount = TotalVat;

                var TotalAIT = 0;
                //$scope.inv_PurchaseBillDetail.AitPercentage = adata.AIT;
                TotalAIT = ($scope.PBsum) * (adata.AIT / 100);
                $scope.ItemCombination.AitAmount = TotalAIT;

                var TotalAT = 0;
                //  $scope.inv_PurchaseBillDetail.AtPercentage = adata.AT;
                TotalAT = ($scope.PBsum + CDTotal + RDTotal + SDTotal) * (adata.AT / 100);
                $scope.ItemCombination.AtAmount = TotalAT;

                var TotalTTI = 0;
                // $scope.inv_PurchaseBillDetail.TtiPercentage = adata.TTI;
                TotalTTI = (CDTotal + RDTotal + SDTotal + TotalVat + TotalAT + TotalAIT) * (adata.TTI / 100);
                $scope.ItemCombination.TtiAmount = TotalTTI;

                var totalCost = 0;
                $scope.ItemCombination.TotalCost = TotalVat + $scope.ItemCombination.PurchaseUnitPrice;
            }
        });

    }



   




    function GetPagedPB(curPage) {

        if (curPage == null) curPage = 1;
        var startRecordNo = ($scope.PerPage * (curPage - 1)) + 1;



        var formDateChange = $("#txtFromDateForPB").val();
        $scope.FromDate = formDateChange.split('/').reverse().join('-');

        var toDateChange = $("#txtToDateForPB").val();
        $scope.ToDate = toDateChange.split('/').reverse().join('-');

        var SearchCriteria = "";

       

        if ($scope.SearchPBAndCompanyName != undefined && $scope.SearchPBAndCompanyName != "" && $scope.FromDate != "" && $scope.ToDate != "") {
            SearchCriteria = "([PB].[PBDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "') and ([PB].[PBNo] LIKE '%" + $scope.SearchPBAndCompanyName + "%' OR [PB].[SupplierName] LIKE '%" + $scope.SearchPBAndCompanyName + "%')";
            
        }
        else if ($scope.SearchPBAndCompanyName !== undefined && $scope.SearchPBAndCompanyName != null && $scope.SearchPBAndCompanyName != "") {
            SearchCriteria = "[PB].[PBNo] LIKE '%" + $scope.SearchPBAndCompanyName + "%' OR [PB].[SupplierName] LIKE '%" + $scope.SearchPBAndCompanyName + "%'";
           
        }
        else if ($scope.FromDate != "" && $scope.ToDate != "") {
            SearchCriteria = "[PB].[PBDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "'";
           
        }

       
        $http({
            url: encodeURI('/PurchaseBill/GetPagedPB?startRecordNo=' + startRecordNo + '&rowPerPage=' + $scope.PerPage + "&whereClause=" + SearchCriteria + '&rows=' + 0),
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            $scope.PurchaseBillList = data.ListData;
            console.log('IWO Groi List Edit', $scope.PurchaseBillList);
            $scope.total_count = data.TotalRecord;

            if ($scope.PurchaseBillList.length > 0) {
                angular.forEach($scope.PurchaseBillList, function (aSd) {
                    var res1 = aSd.PBDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.PBDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aSd.PBDate = date1;
                    }
                })

            }
            else {
                alertify.log('Sales Order  Not Found', 'error', '5000');
            }



        });
    }

    $scope.getData = function (curPage) {

        // if ($scope.FromDate == "" || $scope.ToDate == "" ) {

        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetPagedPB($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetPagedPB($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetPagedPB($scope.currentPage);
        }
        //  }


    }


    $scope.OpenReportMusuk1 = function (pbId) {
        var pbId = pbId.PBId;
        if (pbId==true) {
            $window.open("#/Mushak6_1", "popup", "width=850,height=550,left=280,top=80");

            $cookieStore.put("PBId", pbId);
            event.stopPropagation();
        } else {
            $window.open("#/Mushak6_1", "popup", "width=850,height=550,left=280,top=80");

            $cookieStore.put("PBId", pbId);
            event.stopPropagation();
        }
      

    };

    $scope.purcheaseBillReport = function (pbId) {
        var pbId = pbId.PBId;
        $window.open("/ErpReports/RV_Inv_PurchaseBillByPBId.aspx?PBId=" + pbId, "_blank", "width=790,height=630,left=340,top=25");
    }

    
});

