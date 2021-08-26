app.controller("RequisitionController", function ($scope, $cookieStore, $http, $filter, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');

    

    Clear();

    //#region Function
    function Clear() {
        $scope.SelectListDdl ="true";
        //#region local variables
        $scope.ddlRequestionDdl = null;
        $scope.VarietyList = [];
        $scope.Storelist = [];
        $scope.DepartmentList = [];
        $scope.ItemSearchResultList = [];
        $scope.EmployeeList = [];
        $scope.RequisitionPurposeList = [];
        $scope.SearchBtnDisable = false;
        $scope.ScreenId = $cookieStore.get('RequisitionScreenId');
        $scope.ItemUnitlist = [];
        $scope.buttonAddIssue = "Add";
        $scope.unitname = '';
        $scope.RequisitionPurposename = '';
        //#endregion

        $scope.iwolist = [];
        $scope.inv_InternalOrderDetailList = [];
        $scope.AllCombinationlist = [];
        $scope.RequisitionDetailList = [];
        $scope.SingleIssuelist = [];
        $scope._inv_StockIssueDetailAdAttribute = [];
        $scope.inv_Requisition = {};
        $scope.inv_Requisition.RequisitionId = 0;
        $scope.inv_Requisition.InternalWorkOrderId = 0;
        $scope.RequisitionType = "IWO";
        $scope.inv_RequisitionDetail = {};
        $scope.ProductionRequisitionPurpose = {};
        $scope.SearchBtnDisable = false;
        $scope.ddlStoreDisable = false;        
        GetAllVariety();
    
        GetAllStore();
        GetAllUserDepartment();
        GetAllEmployee();
        $scope.ddlStore = new Object();
        $scope.reqDate = '';
        $scope.ddlDepartment = null;
        $scope.ddlPreparedBy = {};
        $scope.ddlRequisitionPurpose = null;
        $scope.Product = '';
        $scope.ddlSalesMu = null;
        $scope.ReqNo = '';
        $scope.Quantity = '';
        $scope.ddlProduct = null;
        $scope.btnSave = "Save";
        $scope.btnDeleteShow = false;
        GetAllItemUnit();
        GetInternalWorkOrderDynamic();
        GetByCombinationand();
        angular.element("input[type='file']").val("");
        GetAllRequisitionPurpose();
    }

    $scope.ClearDDl1 = function () {
        $("#requestionDDl").val("");
    }
    $scope.ClearDDl2 = function () {
        $("#ReqDdlCl").val("");
    }

    function GetByCombinationand() {
        $http({
            url: '/Item/GetCombinationWithPrice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AllCombinationlistWithPriceList = JSON.parse(data);
            console.log('AllCombinationlistWithPrice List 00',$scope.AllCombinationlistWithPriceList);
            //$scope.AllCombinationlistWithPriceList = Enumerable.From($scope.AllCombinationlistWithPrice).Distinct(function (c) {
            //    return c.Combination;
            //}).Where(function (x) {
            //    return x.CategoryName != "Hardware";
            //}).ToArray();

         
            console.log('AllCombinationlistWithPrice', $scope.AllCombinationlistWithPriceList);
            })

    }

    function GetInternalWorkOrderDynamic() {
        //var criteria = "(IWO.IsApproved=1) AND (IWO.[InternalWorkOrderId] NOT IN (SELECT DISTINCT [InternalWorkOrderId] FROM inv_Requisition)) AND ((SELECT COUNT(*) FROM inv_InternalWorkOrderDetail D WHERE D.InternalWorkOrderId=IWO.InternalWorkOrderId AND D.ItemId>0)>0)";
          var criteria = `(IWO.IsApproved=1) 
                AND(IWO.[InternalWorkOrderId] NOT IN(SELECT DISTINCT[InternalWorkOrderId] FROM inv_Requisition))
                AND((SELECT COUNT(*) FROM inv_InternalWorkOrderDetail D WHERE D.InternalWorkOrderId = IWO.InternalWorkOrderId AND D.ItemId > 0) > 0)
                AND(IWO.[InternalWorkOrderId] NOT IN
                (SELECT[InternalWorkOrderId] FROM inv_InternalWorkOrderDetail IWOD 
			    INNER JOIN ad_Item I ON I.ItemId = IWOD.ItemId
			    INNER JOIN ad_ItemSubCategory ISC ON ISC.SubCategoryId = I.SubCategoryId
			    WHERE ISC.CategoryId = 2
                ))`;

        $http({
            url: '/InternalWorkOrder/GetInternalWorkOrderDynamic?searchCriteria=' + criteria + "&orderBy='InternalWorkOrderDate'",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                angular.forEach(data, function (aSd) {
                    var res1 = aSd.InternalWorkOrderDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.InternalWorkOrderDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aSd.InternalWorkOrderDate = date1;
                    }
                })
            }
            
            $scope.iwolist = data;
            //$scope.iwolist = Enumerable.From($scope.AllCombinationlistWith).Distinct(function (c) {
            //    return c.Combination;
            //}).Where(function (x) {
            //    return x.CategoryName != "Hardware";
            //}).ToArray();
            console.log('Load $scope.iwolist list',$scope.iwolist);
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

    function DetailClear() {
        $scope.inv_RequisitionDetail = new Object();
        $scope.BarCode = '';
        $scope.VarietyName = '';
        $scope.ddlRequisitionPurpose = null;
        $scope.ddlSalesMu = null;
        $scope.inv_RequisitionDetail.RequisitionQuantity = "";
        $scope.btnDeleteShow = false;
    }

    function GetAllStore() {
        $http({
            url: '/Department/GetAllStore',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Storelist = data;
        });
    }

    function GetAllUserDepartment() {
        $http({
            url: '/Department/GetAllDepartment',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DepartmentList = data;
        });
    }

    function GetAllRequisitionPurpose() {
        $http({
            url: '/RequisitionPurpose/GetAllRequisitionPurpose',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.RequisitionPurposeList = data;
            requisitionTypeChange();
        });
    }

    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.EmployeeList = data;
            $scope.ddlPreparedBy = { EmployeeId: $scope.LoginUser.EmployeeId };
        });
    }

    function GetAllItemUnit() {
        $http({
            url: '/Unit/GetAllUnit',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            //Delete unuse property 
            data.forEach(function (aData) {
                delete aData.CreatorId;
                delete aData.CreateDate;
                delete aData.UpdatorId;
                delete aData.UpdateDate;
            });
            $scope.ItemUnitlist = data;
        });
    }

    function GetAllProduct() {
        var SearchCriteria = '1=1';
        if ($scope.categoryId != 0 && $scope.categoryId != undefined) {
            SearchCriteria += ' AND C.CategoryId=' + $scope.categoryId;
        }
        if ($scope.subcategoryId != 0 && $scope.subcategoryId != undefined) {
            SearchCriteria += ' AND I.SubCategoryId=' + $scope.subcategoryId;
            $scope.subcategoryId = 0;
        }
        $http({
            url: '/Item/GetItemSearchResult?searchCriteria=' + SearchCriteria,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ItemSearchResultList = data;
        });
    }

    function GetUnit(id) {
        angular.forEach($scope.unitlist, function (unit) {
            if (unit.ItemUnitId == id) {
                $scope.unitname = unit.UnitName;
            }
        })
    }

    function requisitionTypeChange() {
        if ($scope.RequisitionType == 'IWO') {
            $scope.inv_Requisition.RequisitionDate = $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy');
            $scope.ProductionRequisitionPurpose = Enumerable.From($scope.RequisitionPurposeList).Where("$.RequisitionPurposeName == 'For Production'").FirstOrDefault();
        }
        else {
            $scope.inv_Requisition.RequisitionDate = "";
            $scope.ProductionRequisitionPurpose = {};
        }

        $scope.inv_Requisition.RequisitionNo = ""
        $scope.inv_InternalOrderDetailList = [];
        $scope.ddlDepartment = null;
        $scope.ddlStore = null;
        $scope.SingleIssuelist = [];
        $scope._inv_StockIssueDetailAdAttribute = [];
    }

    //#endregion

    $scope.getMaxRequNoByDate = function () {        
        if ($scope.RequisitionType == "General") {
            var date = $("#txtDate").val();
            $http({
                url: '/Requisition/GetMaxRequNoByDate?requDate=' + date,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.inv_Requisition.RequisitionNo = parseInt(data);
            });
        } 
        
    };

    $scope.getWorkOrderDetails = function (iwo) {
        //$scope.ddlDepartment = { DepartmentId: iwo.DepartmentId };
        //$scope.inv_Requisition.FromDepartmentId = $scope.ddlDepartment.DepartmentId;
        //$scope.inv_Requisition.FromDepartmentName = $scope.ddlDepartment.DepartmentName;

      //  Change

        if (angular.isUndefined($scope.ddlDepartment) || $scope.ddlDepartment == null) {
            alertify.log("Select From Department First.", "error", "5000");
            GetInternalWorkOrderDynamic();
            return;
        }
        if (angular.isUndefined($scope.ddlStore) || $scope.ddlStore == null) {
            alertify.log("Select To Department First.", "error", "5000");
            GetInternalWorkOrderDynamic();
            return;
        }

        else {
            $http({
                url: '/InternalWorkOrder/GetInternalWorkOrderDetailByInternalWorkOrderIdForRequisition?internalWorkId=' + iwo.InternalWorkOrderId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.inv_InternalOrderDetailList = [];
                $scope.inv_Requisition.RequisitionNo = "";
                //$scope.ddlDepartment = null;
                if (data.length > 0) {
                    $scope.inv_Requisition.RequisitionNo = iwo.InternalWorkOrderNo.replace("IWO", "RQI");
                    $scope.inv_Requisition.InternalWorkOrderId = iwo.InternalWorkOrderId;
                    data = Enumerable.From(data).Where("$.ItemId>0").ToArray();
                    //var deptName = Enumerable.From($scope.DepartmentList).Where("$.DepartmentId==" + iwo.DepartmentId).FirstOrDefault();
                    //$scope.ddlDepartment = { DepartmentId: iwo.DepartmentId, DepartmentName: deptName.DepartmentName };
                    //$scope.FromDepartmentId = iwo.DepartmentId;
                    //$scope.FromDepartmentName = deptName.DepartmentName;
                    angular.forEach(data, function (adata) {
                        var res1 = adata.DeliveryDate.substring(0, 5);
                        if (res1 == "/Date") {
                            var parsedDate1 = new Date(parseInt(adata.DeliveryDate.substr(6)));
                            var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                            adata.DeliveryDate = date1;
                        }

                        var finishedItem = Enumerable.From($scope.AllCombinationlistWithPriceList).Where('$.ItemId==' + adata.FinishedItemId).FirstOrDefault();
                        var rawItem = Enumerable.From($scope.AllCombinationlistWithPriceList).Where('$.ItemId==' + adata.ItemId).FirstOrDefault();
                        console.log('rawItem', rawItem);

                        var _internalOrderDetail = {
                            FinishedItemName: finishedItem.Combination,
                            Barcode: rawItem.Barcode,
                            RawItemName: rawItem.Combination,
                            Core: adata.Core,
                            OrderQty: adata.OrderQty,
                            QtyPerRoll: adata.QtyPerRoll,
                            RollDirection: adata.RollDirection,
                            DeliveryDate: adata.DeliveryDate,
                            DetailRemarks: adata.DetailRemarks
                        }
                        $scope.inv_InternalOrderDetailList.push(_internalOrderDetail);
                    });
                    
                    $scope.SingleIssuelist = [];
                    $scope._inv_StockIssueDetailAdAttribute = [];
                }
            });
      }
    }

    $scope.RequisitionTypeChange = function () {
        requisitionTypeChange();
    };

    $scope.GetVarietyDetail = function () {
        if (typeof $scope.VarietyName === 'object' && $scope.VarietyName != null && $scope.VarietyName != undefined) {
            $scope.inv_RequisitionDetail = $scope.VarietyName;
            $scope.BarCode = $scope.inv_RequisitionDetail.ItemCode;
            $scope.inv_RequisitionDetail.RequisitionUnitId = $scope.inv_RequisitionDetail.PurchaseUnitId;
            $scope.inv_RequisitionDetail.RequisitionUnitName = GetUnitNameById($scope.inv_RequisitionDetail.PurchaseUnitId);
            $scope.ddlSalesMu = { ItemUnitId: $scope.inv_RequisitionDetail.PurchaseUnitId };
            $('#tbxQuantity').focus();
        }
        else {
            angular.forEach($scope.VarietyList, function (item) {
                if ($scope.VarietyName == item.ItemName) {
                    $scope.inv_RequisitionDetail = item;
                    $scope.BarCode = $scope.inv_RequisitionDetail.ItemCode;
                    $scope.inv_RequisitionDetail.RequisitionUnitId = $scope.inv_RequisitionDetail.PurchaseUnitId;
                    $scope.inv_RequisitionDetail.RequisitionUnitName = GetUnitNameById($scope.inv_RequisitionDetail.PurchaseUnitId);
                    $scope.ddlSalesMu = { ItemUnitId: $scope.inv_RequisitionDetail.PurchaseUnitId };
                }
            });
        }
    }


    $scope.unitFilter = function (RawItem) {
        return function (pram) {
            return (pram.ItemUnitId == RawItem.UnitId) || (pram.ItemUnitId == RawItem.PackageId) || (pram.ItemUnitId == RawItem.ContainerId);
        };
    }

    $scope.BarcodeSearch = function (e) {
        $scope.inv_RequisitionDetail = {};
        angular.forEach($scope.VarietyList, function (item) {
            if ($scope.BarCode == item.ItemCode) {
                $scope.inv_RequisitionDetail = item;
                $scope.VarietyName = $scope.inv_RequisitionDetail.ItemName;
                $scope.inv_RequisitionDetail.RequisitionUnitId = $scope.inv_RequisitionDetail.PurchaseUnitId;
                $scope.inv_RequisitionDetail.RequisitionUnitName = GetUnitNameById($scope.inv_RequisitionDetail.PurchaseUnitId);
                $scope.ddlSalesMu = { ItemUnitId: $scope.inv_RequisitionDetail.PurchaseUnitId };
                $('#tbxQuantity').focus();
            }
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

    //$scope.AddRequisitionDetail = function () {
    //    if ($scope.btnAdd == "Add") {
    //        var valid = true;
    //        angular.forEach($scope.RequisitionDetailList, function (chkItem) {
    //            if (chkItem.ItemName == $scope.Product) {
    //                alertify.log($scope.Product + ' already added to list!', 'error', '5000');
    //                valid = false;
    //            }
    //        });

    //        if (valid) {
    //            angular.forEach($scope.ItemSearchResultList, function (item) {
    //                if (item.ItemName == $scope.Product) {
    //                    $scope.inv_RequisitionDetail = item;
    //                    $scope.inv_RequisitionDetail.UnitId = $scope.UnitId;
    //                    $scope.inv_RequisitionDetail.PackageId = $scope.PackageId;
    //                    $scope.inv_RequisitionDetail.ContainerId = $scope.ContainerId;
    //                }
    //            })
    //            $scope.RequisitionDetailList.push($scope.inv_RequisitionDetail);
    //            DetailClear();
    //            $('#txtBarCode').focus();
    //        }
    //        DetailClear();
    //    }
    //    else {
    //        DetailClear();
    //    }
    //};


    $scope.removeRequisitionEntry = function () {
        $scope.RequisitionDetailList.splice($scope.REIndex, 1);
        DetailClear();
    }

    $scope.SelRequisitionEntry = function (aReqEntry, index) {
        $scope.UnitId = aReqEntry.UnitId;
        $scope.PackageId = aReqEntry.PackageId;
        $scope.ContainerId = aReqEntry.ContainerId;
        $scope.inv_RequisitionDetail = aReqEntry;
        $scope.ddlRequisitionPurpose = { "RequisitionPurposeId": aReqEntry.RequisitionPurposeId };
        $scope.ddlRequisitionPurpose.RequisitionPurposeName = aReqEntry.RequisitionPurposeName;
        $scope.ddlSalesMu = { "ItemUnitId": aReqEntry.UnitId };
        $scope.inv_RequisitionDetail.RequisitionUnitId = aReqEntry.UnitId;
        $scope.inv_RequisitionDetail.RequisitionUnitName = aReqEntry.UnitName;
        $scope.BarCode = aReqEntry.ItemCode;
        $scope.VarietyName = { "ItemId": aReqEntry.ItemId, "ItemName": aReqEntry.ItemName, "ItemCode": aReqEntry.ItemCode };
        $scope.inv_RequisitionDetail.RequisitionQuantity = aReqEntry.RequisitionQuantity;
        $scope.btnAdd = "Change";
        $scope.btnDeleteShow = true;
        $scope.REIndex = index;
    }

    $scope.resetForm = function () {
        Clear();
        $scope.requisitionEntryForm.$setPristine();
        $scope.requisitionEntryForm.$setUntouched();
    };

    $scope.SaveRequsition = function () {
        var erroMsg = [];
        console.log($scope._inv_StockIssueDetailAdAttribute);
        angular.forEach($scope.SingleIssuelist, function (aItem) {
            aItem.RequisitionDetailId = aItem.ItemId;

            if (Enumerable.From($scope._inv_StockIssueDetailAdAttribute).Where("$.ItemId == '" + aItem.ItemId + "'").ToArray().length) {
                aItem.ItemName = Enumerable.From($scope._inv_StockIssueDetailAdAttribute).Where("$.ItemId == '" + aItem.ItemId + "'").FirstOrDefault().Combination;
            }
        });

        angular.forEach($scope._inv_StockIssueDetailAdAttribute, function (aItem) {
            aItem.RequisitionDetailId = aItem.ItemId;
            if (aItem.RequisitionPurposeId == 0 || aItem.RequisitionPurposeName == "" || aItem.RequisitionPurposeName == null) {
                erroMsg.push({ msg: "Please select Requisition Purpose!" });
                return
            }
        });

        if (erroMsg.length > 0) {
            angular.forEach(erroMsg, function (aErroMsg) {
                alertify.log(aErroMsg.msg, 'error', '5000');
            });
        }
        else {
            if ($scope.btnSave == "Save") {
                alertify.confirm("Are you sure to save ?", function (e) {
                    if (e) {
                        $scope.inv_Requisition.CreatorId = $scope.LoginUser.UserId;
                        $scope.inv_Requisition.UpdatorId = $scope.LoginUser.UserId;
                        $scope.inv_Requisition.IsApproved = $scope.HasApproval ? false : true;
                        $scope.inv_Requisition.PreparedById = $scope.ddlPreparedBy.EmployeeId;
                        $scope.inv_Requisition.PreparedBy = $scope.LoginUser.FullName;;
                        var a = $scope.inv_Requisition.RequisitionDate;
                        //$scope.inv_Requisition.ToDepartmentName = $scope.ddlStore.DepartmentName;
                        //$scope.inv_Requisition.ToDepartmentId = $scope.ddlStore.DepartmentId;
                        var from = a.split("/");
                        var f = new Date(from[2], from[1] - 1, from[0]);
                        $scope.inv_Requisition.RequisitionDate = f;

                        var parms = JSON.stringify({ requisition: $scope.inv_Requisition, requisitionDetail: $scope.SingleIssuelist, _inv_RequisitionDetailAdAttribute: $scope._inv_StockIssueDetailAdAttribute });
                        $http.post('/Requisition/Save', parms).success(function (data) {
                            if (data > 0) {
                                $scope.RequisitionType = "General";
                                Clear();
                                $scope.requisitionEntryForm.$setPristine();
                                $scope.requisitionEntryForm.$setUntouched();
                                alertify.log('Requisition saved successfully!', 'success', '5000');
                            }
                            else {
                                alertify.log('Server Errors!', 'error', '5000');
                            }
                        });
                    }
                });
            }
        }
    }

    function SumAttQty() {
        angular.forEach($scope._inv_StockIssueDetailAdAttribute, function (aDetailAdAttribute) {
            if (aDetailAdAttribute.AttributeQty < 0.01  || aDetailAdAttribute.AttributeQty == undefined || aDetailAdAttribute.AttributeQty == null)
            { aDetailAdAttribute.AttributeQty = 0.01; }
        });
        angular.forEach($scope.SingleIssuelist, function (aStockReceiveDetail) {
            aStockReceiveDetail.RequisitionUnitId = 1;
            aStockReceiveDetail.RequisitionUnitName = "Pcs";
            aStockReceiveDetail.IssueQuantity = Enumerable.From($scope._inv_StockIssueDetailAdAttribute).Where("$.ItemId == '" + aStockReceiveDetail.ItemId + "'").Sum('$.AttributeQty');
        });
        $scope.SingleIssuelist = Enumerable.From($scope.SingleIssuelist).Where("$.IssueQuantity != 0").ToArray();
    }

    function GetByCombinationandDepertment() {
        if ($scope.ddlDepartment) {
            $http({
                url: '/Item/GetByDepartmentAndAllCombinationLikeWithCurrent?departmentId=' + $scope.ddlDepartment.DepartmentId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.AllCombination = [];
                $scope.AllCombination = JSON.parse(data);
                $scope.AllCombinationlist = Enumerable.From($scope.AllCombination).Distinct(function (x) {
                    return x.Combination;
                }).ToArray();

            })
        }
        else {
            $scope.ItemSearchCombination = null;
        }
    }

    $scope.RemoveItemAttr = function (aAttribute) {
        var ind = $scope._inv_StockIssueDetailAdAttribute.indexOf(aAttribute);
        $scope._inv_StockIssueDetailAdAttribute.splice(ind, 1);
        SumAttQty();
    }

    $scope.AddRequisitionDetail = function () {
        var flag = true;
        angular.forEach($scope._inv_StockIssueDetailAdAttribute, function (aDetailAdAttribute) {
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
            $scope._inv_StockIssueDetailAdAttribute.push(Attribute);

            flag = true;
            angular.forEach($scope.SingleIssuelist, function (aItem) {
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

                //var HeaderOfAttribute = [];
                //var a = $scope.ItemCombination.AttributeNames.split(',');
                //for (var i = 0; i < a.length; i++) {
                //    var val = a[i].split(':');
                //    HeaderOfAttribute.push(val[0].trim());
                //}

                Item.HeaderOfAttribute = ["Description"];
                Item.IssueQuantity = Attribute.AttributeQty;
                $scope.SingleIssuelist.push(Item);
            }

            $scope.ItemCombination = {};
            $scope.ItemSearchCombination = null;
            SumAttQty();
            $('#SearchTextBox').focus();
        }
        else {
            alertify.log('This Combination already Exist, Try another one !!!', 'error', '5000');
        }
    }

    $scope.GetByCombinationLike = function () {
        if ($scope.RequisitionType == "General") {
            $scope.ddlStore = { DepartmentId: "" };
           
        }        
        GetByCombinationandDepertment();
    }

    //$scope.CheckItemQuantity = function (CurrentQuantity, AttributeQty) {
    //    if (1 > AttributeQty) {
    //        return 1;
    //    }
    //    else {
    //        return AttributeQty;
    //    }
    //}

    $scope.SumAttQty = function () {
        SumAttQty();
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



            $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).Where(SearchCriteria).ToArray();
            console.log('AllCombinationSearch', $scope.AllCombinationSearch);

            $scope.VisibilityOfSuggession = true;
        }
        else {
            $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).ToArray();
            $scope.VisibilityOfSuggession = false;
        }
    }

    $scope.LoadACombination = function (aCombination) {
        console.log(aCombination);
      
        $scope.ItemCombination = aCombination;
       // ItemCombination.CurrentQuantity = aCombination;
        $scope.VisibilityOfSuggession = false;
       $scope.ItemSearchCombination = $scope.ItemCombination.Combination;
        $scope.AllCombinationSearch = [];
        $('#txtIssueQty').focus();
    }


    $scope.OpenReport = function (iwoId) {
        $window.open("#/IWOReport", "popup", "width=850,height=550,left=280,top=80");

        $cookieStore.put("IWOID", iwoId);
        event.stopPropagation();

    };


});