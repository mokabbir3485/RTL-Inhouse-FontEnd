app.controller("PurchaseOrderEntryController", function ($scope, $cookieStore, $http, $filter) {

    //#region Valiables
    $scope.ItemSearchCriteria = [];
    $scope.ItemSearchResultList = [];
    $scope.ScreenId = $cookieStore.get('PurchaseOrderScreenId');
    $scope.FromScreenId = $cookieStore.get('PurchaseOrderScreenId');
    //#endregion

    //#region Function Call
    Clear();
    GetAllSupplier();
    GetAllEmployee();
    GetPriceType();
    GetUnit();
    //#endregion

    //#region Functions
    function Clear() {
        $scope.ItemAdvanceSearch = false;
        $scope.inv_PurchaseOrder = new Object();
        $scope.inv_PurchaseOrder.POId = 0;
        $scope.inv_PurchaseOrderDetailList = [];
        $scope.inv_PurchaseOrderDetail = new Object();
        $scope.ddlSupplier = null;
        $scope.ddlEmployee = null;
        $scope.ddlUnit = null;
        $scope.RemoveBtnShow = false;
        $scope.Product = '';
        $scope.DetailAddBtn = "Add";
        $scope.TotalPOAmount = 0;
        $scope.buttonSave = "Save";
        $scope.btnDeleleShow = false;
        $scope.UserData = $cookieStore.get('UserData');
        $scope.ddlPriceType = { "PriceTypeId": 1 }
        $scope.inv_PurchaseOrder.PriceTypeId = 1;
        $scope.inv_PurchaseOrder.PriceTypeName = "Regular";
        $scope.ddlEmployee = { "EmployeeId": $scope.UserData.EmployeeId };
        $scope.inv_PurchaseOrder.PreparedById = $scope.UserData.EmployeeId;
        txtPoNo.focus();
    }

    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.EmployeeList = data;
            angular.forEach($scope.EmployeeList, function (aEmployee) {
                if (aEmployee.EmployeeId == $scope.inv_PurchaseOrder.PreparedById) {
                    $scope.inv_PurchaseOrder.PreparedBy = aEmployee.FullName;
                }
            })
        });
    }

    function GetAllSupplier() {
        $http({
            url: '/Supplier/GetAllSuppler',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Supplierlist = data;
        });
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

    function GetAllSubCategory() {
        $http({
            url: '/Subcategory/GetAllSubategory',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.SubcategoryList = data;
        });
    }

    function GetAllItem() {
        var SearchCriteria = '1=1';
        $http({
            url: '/Item/GetItemSearchResult?searchCriteria=' + SearchCriteria,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ItemSearchResultList = data;
        });
    }

    function GetUnit() {
        $http({
            url: '/Unit/GetAllUnit',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.unitlist = data;
        });
    }

    function GetPriceType() {
        $http({
            url: '/PriceType/GetAllPriceType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.pricetypeentrylist = data;
        })
    }

    function ClearPurchaseOrderDetail() {
        $scope.inv_PurchaseOrderDetail = new Object();
        $scope.ddlUnit = null;
        $scope.Product = '';
        $scope.DetailAddBtn = "Add";
        $scope.RemoveBtnShow = false;
        $scope.DetailRowIndex = '';
        $scope.UnitId = 0;
        $scope.PackageId = 0;
        $scope.ContainerId = 0;
    };

    function SaveDetails(POId) {
        angular.forEach($scope.inv_PurchaseOrderDetailList, function (aPurchaseOrderDetail) {
            var parms = JSON.stringify({ inv_PurchaseOrderDetail: aPurchaseOrderDetail, pOId: POId });
            $http.post('/PurchaseOrder/SavePurchaseOrderDetail', parms).success(function (data) {
                //chk if add att is or not
                if (aPurchaseOrderDetail.ItemAddAtt.length) {
                    angular.forEach(aPurchaseOrderDetail.ItemAddAtt, function (aItemAddAtt) {
                        //chk if add att is valid or not
                        if (aItemAddAtt.selected) {
                            var parms = JSON.stringify({ inv_PurchaseOrderDetailAdAttribute: aItemAddAtt, pODetailId: data });
                            $http.post('/PurchaseOrder/SavePurchaseOrderDetailAdAttribute', parms).success(function (data) {
                                //in method param aItemAddAtt.Detatil
                                angular.forEach(aItemAddAtt.Detatil, function (aDetatil) {
                                    var parms = JSON.stringify({ inv_PurchaseOrderDetailAdAttributeDetail: aDetatil, pODetailAdAttId: data });
                                    $http.post('/PurchaseOrder/SavePurchaseOrderDetailAdAttributeDetail', parms).success(function (data) {

                                    }).error(function (data) {
                                        alertify.log('Server Errors!', 'error', '5000');
                                    });
                                });
                                //in method
                            }).error(function (data) {
                                alertify.log('Server Errors!', 'error', '5000');
                            });
                        }
                    });
                }
            }).error(function (data) {
                alertify.log('Server Errors!', 'error', '5000');
            });
        });
    }
    //#endregion

    //#region Events
    // Item search 
    $scope.unitFilter = function (item) {
        if (item.ItemUnitId === $scope.UnitId || item.ItemUnitId === $scope.PackageId || item.ItemUnitId === $scope.ContainerId) {
            return item;
        }
    };

    $scope.FilterUnit = function () {
        angular.forEach($scope.ItemSearchResultList, function (item) {
            if ($scope.Product == item.ItemName) {
                $scope.UnitId = item.UnitId;
                $scope.PackageId = item.PackageId;
                $scope.ContainerId = item.ContainerId;
            }
        })
    }

    $scope.ItemSearch = function () {
        if ($scope.Product == '') {
            $scope.ItemSearchResultList = [];
        }
        else {
            $scope.SearchCriteria = "ItemName LIKE '%" + $scope.Product + "%' OR ItemCode LIKE '%" + $scope.Product + "%'";
            $http({
                url: '/Item/GetItemSearchResult',
                method: 'GET',
                params: { searchCriteria: $scope.SearchCriteria },
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.ItemSearchResultList = data;
                if ($scope.ItemSearchResultList.length == 1) {
                    $scope.Product = $scope.ItemSearchResultList[0].ItemName;
                    $scope.ddlUnit = { "ItemUnitId": $scope.ItemSearchResultList[0].PurchaseUnitId };

                    angular.forEach($scope.unitlist, function (aUnit) {
                        if ($scope.ItemSearchResultList[0].PurchaseUnitId == aUnit.ItemUnitId) {
                            $scope.inv_PurchaseOrderDetail.ItemUnitId = aUnit.ItemUnitId;
                            $scope.inv_PurchaseOrderDetail.UnitName = aUnit.UnitName;
                        }
                    })

                    GetItemDetailsByUnit($scope.ItemSearchResultList[0].PurchaseUnitId);
                }
            });
        }
        $scope.ddlUnit = null;
    }

    $scope.ForItemSearch = function () {
        $scope.ItemAdvanceSearch = true;
        if (!$scope.ddlSupplier) {
            alertify.log('Select Supplier first', 'error', '5000');
            return;
        }
        $scope.ItemScreenId = $cookieStore.get('ProductScreenId');
        $http({
            url: "/AdvancedSearch/AddScreenId?screenId=" + $scope.ItemScreenId,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            document.getElementById('AdSearch').contentDocument.location.reload(true);
        });
    }

    $scope.GetItemDetails = function (unitId, dptId) {
        GetItemDetailsByUnit(unitId, dptId);
    }

    function GetItemDetailsByUnit(unitId, dptId) {
        angular.forEach($scope.ItemSearchResultList, function (item) {
            if ($scope.Product == item.ItemName) {
                $http({
                    url: '/StockValuation/GetByItemAndUnitAndDepartment?itemId=' + item.ItemId + '&unitId=' + unitId,
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (stkValuation) {
                    if (stkValuation != "") {
                        $scope.inv_PurchaseOrderDetail.StockQty = stkValuation.CurrentQuantity;
                        if (stkValuation.ValuationPrice > 0) {
                            $scope.inv_PurchaseOrderDetail.POUnitPrice = stkValuation.ValuationPrice;
                            txtPOQty.focus();
                        }
                        else {
                            $scope.inv_PurchaseOrderDetail.POUnitPrice = 0;
                            txtPrice.focus();
                        }
                    }
                    else {
                        $scope.inv_PurchaseOrderDetail.StockQty = 0;
                        $scope.inv_PurchaseOrderDetail.POUnitPrice = 0;
                        txtPrice.focus();
                    }
                });
            }
        })
    };
    //End

    $scope.FromSearch = function () {
        angular.forEach($scope.inv_PurchaseOrderDetailList, function (aPurchaseOrderDetail) {
            angular.forEach(aPurchaseOrderDetail.ItemAddAtt, function (aItemAddAtt) {
                angular.forEach(aItemAddAtt.Detatil, function (aDetatil) {
                    if (aDetatil.Values.length) {
                        aDetatil.ValueSelect = { "Value": aDetatil.AttributeValue };
                    }
                    //else {
                    //    aDetatil.AttributeValue = '123';
                    //}
                    //aDetatil.ValueSelect = { "Value": aDetatil.AttributeValue };
                })
            })
        })
    }

    function LoadAttValueList(aItemAddAtt, obj) {
        $http({
            url: '/Receive/GetItemAdditionalAttributeValueByItemAddAttId',
            method: "GET",
            params: { itemAddAttId: aItemAddAtt.ItemAddAttId },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length) {
                aItemAddAtt.Values = data;
            }
            obj.Detatil.push(aItemAddAtt);
        });
    };

    //Add OR Change
    $scope.AddPODetail = function () {
        if ($scope.DetailAddBtn == "Add") {
            var valid = true;
            angular.forEach($scope.inv_PurchaseOrderDetailList, function (aData) {
                if (aData.ItemName == $scope.Product) {
                    alertify.log($scope.Product + ' already added to list!', 'error', '5000');
                    valid = false;
                }
            });
            if (valid) {
                angular.forEach($scope.ItemSearchResultList, function (item) {
                    if (item.ItemName == $scope.Product) {
                        $scope.inv_PurchaseOrderDetail.ItemId = item.ItemId;
                        $scope.inv_PurchaseOrderDetail.ItemName = item.ItemName;
                        $scope.inv_PurchaseOrderDetail.ItemCode = item.ItemCode;

                        $scope.inv_PurchaseOrderDetail.UnitId = $scope.UnitId;
                        $scope.inv_PurchaseOrderDetail.PackageId = $scope.PackageId;
                        $scope.inv_PurchaseOrderDetail.ContainerId = $scope.ContainerId;

                        $scope.inv_PurchaseOrderDetail.HasAddAttOperational = item.HasAddAttOperational;
                    }
                })

                //Add Att
                if ($scope.inv_PurchaseOrderDetail.HasAddAttOperational) {
                    $scope.inv_PurchaseOrderDetail.ItemAddAtt = [];
                    var obj = {};
                    $http({
                        url: '/Receive/GetItemAdditionalAttributeOperationalByItemId?itemId=' + $scope.inv_PurchaseOrderDetail.ItemId,
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    }).success(function (data) {
                        if (data.length) {
                            obj.AttributeQty = 0;
                            obj.Detatil = [];
                            angular.forEach(data, function (aData) {
                                LoadAttValueList(aData, obj);
                            });
                        }
                    })

                    $scope.inv_PurchaseOrderDetail.ItemAddAtt.push(obj);
                }

                $scope.inv_PurchaseOrderDetailList.push($scope.inv_PurchaseOrderDetail);

                ClearPurchaseOrderDetail();
            }

        }
        else {
            var valid = true;
            angular.forEach($scope.ItemSearchResultList, function (item) {
                if (item.ItemName == $scope.inv_PurchaseOrderDetail.ItemName) {
                    $scope.inv_PurchaseOrderDetail.ItemId = item.ItemId;
                    $scope.inv_PurchaseOrderDetail.ItemName = item.ItemName;
                    $scope.inv_PurchaseOrderDetail.ItemCode = item.ItemCode;

                    $scope.inv_PurchaseOrderDetail.UnitId = $scope.UnitId;
                    $scope.inv_PurchaseOrderDetail.PackageId = $scope.PackageId;
                    $scope.inv_PurchaseOrderDetail.ContainerId = $scope.ContainerId;
                }
                else {
                    var valid = false;
                }
            });
            if (valid) {

                ClearPurchaseOrderDetail();
                var tot = 0;
                angular.forEach($scope.inv_PurchaseOrderDetailList, function (aPoDetail) {
                    tot += aPoDetail.POUnitPrice * aPoDetail.POQuantity;
                })
                $scope.TotalPOAmount = tot;
            }
            else {
                alertify.log($scope.Product + ' is already added to list!', 'error', '5000');
            }
        }
        txtProduct.focus();
    }

    //Save
    $scope.AddPO = function () {
        //#region Validation
        var erroMsg = [];
        if ($scope.inv_PurchaseOrderDetailList.length) {
            angular.forEach($scope.inv_PurchaseOrderDetailList, function (aPurchaseOrderDetail) {
                if (aPurchaseOrderDetail.POQuantity > 0) {
                    aPurchaseOrderDetail.POUnitId = aPurchaseOrderDetail.ItemUnitId;
                    if (aPurchaseOrderDetail.UnitName == null) {
                        erroMsg.push({
                            msg: aPurchaseOrderDetail.ItemName + " Please Select Unit for PO Qty"
                        });
                    }
                    else if (aPurchaseOrderDetail.ItemAddAtt) {
                        var arr = [];
                        var POQty = 0;
                        angular.forEach(aPurchaseOrderDetail.ItemAddAtt, function (aItemAddAtt) {
                            if (aItemAddAtt.selected) {
                                POQty += aItemAddAtt.AttributeQty;

                                var valuesConcat = '';
                                if (aItemAddAtt.Detatil.length > 1) {
                                    angular.forEach(aItemAddAtt.Detatil, function (aDetatil) {
                                        valuesConcat += aDetatil.AttributeValue;
                                    })

                                    arr.push(valuesConcat);
                                }
                            }
                        });
                        if (aPurchaseOrderDetail.POQuantity != POQty && POQty != 0) {
                            erroMsg.push({
                                msg: aPurchaseOrderDetail.ItemName + " PO Qty must be equal to Additional Attribute Qty"
                            });
                        }
                        else if (arr.length) {
                            var sorted_arr = arr.slice().sort();
                            var results = [];
                            for (var i = 0; i < arr.length - 1; i++) {
                                if (sorted_arr[i + 1] == sorted_arr[i]) {
                                    results.push(sorted_arr[i]);
                                }
                            }
                            if (results.length) {
                                erroMsg.push({
                                    msg: aPurchaseOrderDetail.ItemName + " has Duplicate Attribute Combination!"
                                });
                            }
                        }
                        else if (POQty == 0) {
                            angular.forEach(aPurchaseOrderDetail.ItemAddAtt, function (aItemAddAtt) {
                                var attReq = '';
                                angular.forEach(aItemAddAtt.Detatil, function (aDetatil) {
                                    if (aDetatil.IsStockMaintain)
                                        attReq += attReq == '' ? aDetatil.AttributeName : ', ' + aDetatil.AttributeName;
                                })
                                erroMsg.push({
                                    msg: aPurchaseOrderDetail.ItemName + " need Attribute Qty for " + attReq
                                });
                            })
                        }
                    }
                }
                else {
                    erroMsg.push({
                        msg: aPurchaseOrderDetail.ItemName + " PO Qty not Provided"
                    });
                }
            });
        }
        else {
            erroMsg.push({
                msg: "Please Add Product"
            });
        }
        //#endregion

        if (!erroMsg.length) {
            var from = $("#txtPODate").val().split("/");
            var f = new Date(from[2], from[1] - 1, from[0]);
            $scope.inv_PurchaseOrder.PODate = f;
            var from2 = $("#txtDeliveryDate").val().split("/");
            var f2 = new Date(from2[2], from2[1] - 1, from2[0]);
            $scope.inv_PurchaseOrder.DeliveryDate = f2;

            $scope.inv_PurchaseOrder.CreatorId = $scope.UserData.UserId;
            $scope.inv_PurchaseOrder.UpdatorId = $scope.UserData.UserId;
            $scope.inv_PurchaseOrder.IsApproved = false;


            if ($scope.inv_PurchaseOrder.POId == 0) {
                alertify.confirm("Are you sure to save?", function (e) {
                    if (e) {
                        var parms = JSON.stringify({ inv_PurchaseOrder: $scope.inv_PurchaseOrder });
                        $http.post('/PurchaseOrder/SavePurchaseOrder', parms).success(function (POId) {
                            if (POId > 0) {
                                SaveDetails(POId);
                                Clear();
                                $scope.purchaseOrderEntryForm.$setPristine();
                                $scope.purchaseOrderEntryForm.$setUntouched();
                                alertify.log('Purchase Order Saved Successfully!', 'success', '5000');
                            }
                        }).error(function (data) {
                            alertify.log('Server Save Errors!', 'error', '5000');
                        });
                    }
                })
            }

            else {
                alertify.confirm("Are you sure to revise?", function (e) {
                    if (e) {
                        var parms = JSON.stringify({ inv_PurchaseOrder: $scope.inv_PurchaseOrder });
                        $http.post('/PurchaseOrder/UpdatePurchaseOrder', parms).success(function (data) {
                            if (data > 0) {
                                SaveDetails($scope.inv_PurchaseOrder.POId);
                                Clear();
                                $scope.purchaseOrderEntryForm.$setPristine();
                                $scope.purchaseOrderEntryForm.$setUntouched();
                                alertify.log('Purchase Order Revised Successfully!', 'success', '5000');
                            }
                            else {
                                alertify.log('Server Errors!', 'error', '5000');
                            }
                        }).error(function (data) {
                            alertify.log('Server Errors!', 'error', '5000');
                        });
                    }
                })
            }
        }

        else {
            angular.forEach(erroMsg, function (aErroMsg) {
                alertify.log(aErroMsg.msg, 'error', '5000');
            });
        }
    };

    //Search
    $scope.ForAdvanceSearch = function () {
        $scope.ItemAdvanceSearch = false;
        $http({
            url: "/AdvancedSearch/SetScreenIdsToSession?screenId=" + $scope.ScreenId + '&fromScreenId=' + $scope.FromScreenId,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            document.getElementById('AdSearch').contentDocument.location.reload(true);
        });
    }

    $scope.AdvanceSearch = function (POId) {
        if ($scope.ItemAdvanceSearch) {
            $http({
                url: '/AdvancedSearch/GetItemSearchCriteria',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.ItemSearchCriteria = data;
                if ($scope.ItemSearchCriteria != "") {
                    $http({
                        url: '/Item/GetItemSearchResult?searchCriteria=' + $scope.ItemSearchCriteria,
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    }).success(function (data) {
                        $scope.ItemSearchResultList = data;
                    });
                }
            })
        }
        else {
            $http({
                url: '/AdvancedSearch/GetSearchId',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.SearchId = data;
                if ($scope.SearchId != "") {
                    $scope.inv_PurchaseOrder.POId = $scope.SearchId;
                    $http({
                        url: '/PurchaseOrder/GetPOById',
                        method: 'GET',
                        params: { id: $scope.SearchId },
                        headers: { 'Content-Type': 'application/json' }
                    }).success(function (data) {
                        $scope.TotalPOAmount = 0;
                        $scope.inv_PurchaseOrderList = data;
                        var res = data.PODate.substring(0, 5);
                        if (res == "/Date") {
                            var parsedDate = new Date(parseInt($scope.inv_PurchaseOrderList.PODate.substr(6)));
                            $scope.inv_PurchaseOrderList.PODate = $filter('date')(parsedDate, 'dd/MM/yyyy');
                        }

                        var ress = data.DeliveryDate.substring(0, 5);
                        if (ress == "/Date") {
                            var parsedDate = new Date(parseInt($scope.inv_PurchaseOrderList.DeliveryDate.substr(6)));
                            $scope.inv_PurchaseOrderList.DeliveryDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
                        }
                        $scope.inv_PurchaseOrder.PONo = data.PONo;
                        $scope.inv_PurchaseOrder.PODate = data.PODate;

                        $scope.ddlSupplier = { "SupplierId": data.SupplierId };
                        $scope.inv_PurchaseOrder.SupplierId = data.SupplierId;
                        $scope.inv_PurchaseOrder.SupplierName = data.SupplierName;

                        $scope.ddlEmployee = { "EmployeeId": data.PreparedById };
                        $scope.inv_PurchaseOrder.PreparedById = data.PreparedById;
                        $scope.inv_PurchaseOrder.PreparedBy = data.PreparedBy;

                        $scope.ddlPriceType = { "PriceTypeId": data.PriceTypeId };
                        $scope.inv_PurchaseOrder.PriceTypeId = data.PriceTypeId
                        $scope.inv_PurchaseOrder.PriceTypeName = data.PriceTypeName;

                        $scope.inv_PurchaseOrder.ShipmentInfo = data.ShipmentInfo;
                        $scope.inv_PurchaseOrder.DeliveryDate = data.DeliveryDate;
                        $scope.inv_PurchaseOrder.Remarks = data.Remarks;
                    }).success(function (data) {
                        $scope.poId = data;
                        if ($scope.poId != null) {
                            $http({
                                url: '/PurchaseOrder/GetPurchaseOrderDetailByPOId',
                                method: 'GET',
                                params: { pOId: $scope.inv_PurchaseOrderList.POId },
                                headers: { 'content-Type': 'application/json' }
                            }).success(function (pODetailList) {
                                angular.forEach(pODetailList, function (aPODetail) {
                                    aPODetail.ItemUnitId = aPODetail.POUnitId;
                                    //Get PODetailAdAttId FROM PODetailAdAttribute inv_PurchaseOrderDetailAdAttribute (pODetailAdAttribute) By PODetailId
                                    $http({
                                        url: '/PurchaseOrder/GetPurchaseOrderDetailAdAttributeByPODetailId?PODetailId=' + aPODetail.PODetailId,
                                        method: "GET",
                                        headers: { 'Content-Type': 'application/json' }
                                    }).success(function (PurchaseOrderDetailAdAttributeList) {
                                        aPODetail.ItemAddAtt = [];

                                        angular.forEach(PurchaseOrderDetailAdAttributeList, function (aPurchaseOrderDetailAdAttribute) {
                                            var obj = {};
                                            obj.selected = true;
                                            obj.AttributeQty = aPurchaseOrderDetailAdAttribute.AttributeQty
                                            obj.Detatil = [];

                                            $http({
                                                url: '/PurchaseOrder/GetPurchaseOrderDetailAdAttributeDetailByPODetailAdAttId?PODetailAdAttId=' + aPurchaseOrderDetailAdAttribute.PODetailAdAttId,
                                                method: 'GET',
                                                headers: { 'Content-Type': 'application/json' }
                                            }).success(function (poDetailAdAttDetailList) {
                                                angular.forEach(poDetailAdAttDetailList, function (aPoDetailAdAttDetail) {
                                                    $http({
                                                        url: '/Receive/GetItemAdditionalAttributeValueByItemAddAttId',
                                                        method: "GET",
                                                        params: { itemAddAttId: aPoDetailAdAttDetail.ItemAddAttId },
                                                        headers: { 'Content-Type': 'application/json' }
                                                    }).success(function (itemAdAttValues) {
                                                        if (itemAdAttValues.length) {
                                                            aPoDetailAdAttDetail.Values = itemAdAttValues;
                                                            aPoDetailAdAttDetail.ValueSelect = { "Value": aPoDetailAdAttDetail.AttributeValue };
                                                        }
                                                    })
                                                    obj.Detatil.push(aPoDetailAdAttDetail);
                                                })
                                            })

                                            aPODetail.ItemAddAtt.push(obj);
                                        })
                                    })
                                })

                                $scope.inv_PurchaseOrderDetailList = pODetailList;

                                $scope.btnDeleleShow = true;
                                $scope.buttonSave = "Revise";
                            })
                        }
                    })
                }
            });
        }
    }

    $scope.Cancel = function () {
        alertify.confirm("Are you sure to Cancel?", function (e) {
            if (e) {
                var parms = JSON.stringify({ POId: $scope.SearchId });
                $http.post('/PurchaseOrder/CancelPurchaseOrder', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('PO( ' + $scope.inv_PurchaseOrder.PONo + ' ) Cancel Successfully!', 'success', '5000');
                        Clear();
                        $scope.purchaseOrderEntryForm.$setPristine();
                        $scope.purchaseOrderEntryForm.$setUntouched();
                    } else {
                        alertify.log('Cancel Failed!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '5000');
                });
            }
        });
    };

    $scope.AddPODetailValidationChk = function (inv_PurchaseOrderDetail) {
        // alert(345);
        if (inv_PurchaseOrderDetail.ItemId && inv_PurchaseOrderDetail.POUnitPrice && inv_PurchaseOrderDetail.POQuantity && inv_PurchaseOrderDetail.POUnitId) {
            $scope.DetailAddBtnDisabled = false;
        } else {
            $scope.DetailAddBtnDisabled = true;
        }
    };

    //Row Click
    $scope.SelPODetail = function (aPurchaseOrderDetail, index) {
        //alert(345);
        $scope.inv_PurchaseOrderDetail = aPurchaseOrderDetail;

        $scope.UnitId = aPurchaseOrderDetail.UnitId;
        $scope.PackageId = aPurchaseOrderDetail.PackageId;
        $scope.ContainerId = aPurchaseOrderDetail.ContainerId;

        $scope.Product = { "ItemId": aPurchaseOrderDetail.ItemId, "ItemName": aPurchaseOrderDetail.ItemName, "ItemCode": aPurchaseOrderDetail.ItemCode };
        $scope.inv_PurchaseOrderDetail.StockQty = aPurchaseOrderDetail.StockQty;
        $scope.inv_PurchaseOrderDetail.POQuantity = aPurchaseOrderDetail.POQuantity;
        $scope.ddlUnit = { "ItemUnitId": aPurchaseOrderDetail.ItemUnitId };
        $scope.inv_PurchaseOrderDetail.ItemUnitId = aPurchaseOrderDetail.ItemUnitId;
        $scope.inv_PurchaseOrderDetail.UnitName = aPurchaseOrderDetail.UnitName;
        $scope.inv_PurchaseOrderDetail.POUnitPrice = aPurchaseOrderDetail.POUnitPrice;

        $scope.DetailAddBtn = "Change";
        $scope.RemoveBtnShow = true;
        $scope.DetailRowIndex = index;
        $scope.DetailAddBtnDisabled = false;
    };

    $scope.RemovePODetail = function () {
        $scope.inv_PurchaseOrderDetailList.splice($scope.DetailRowIndex, 1);
        ClearPurchaseOrderDetail();
        var tot = 0;
        angular.forEach($scope.inv_PurchaseOrderDetailList, function (aPoDetail) {
            tot += aPoDetail.POUnitPrice * aPoDetail.POQuantity;
        })
        $scope.TotalPOAmount = tot;
        txtProduct.focus();
    };

    $scope.AddAttValidationChk = function (aItemAddAtt) {
        var flag = true;
        if (aItemAddAtt.AttributeQty <= 0 || aItemAddAtt.AttributeQty == undefined)
            flag = false;
        var invalidCount = 0;
        angular.forEach(aItemAddAtt.Detatil, function (aDetatil) {
            if (!aDetatil.AttributeValue && aDetatil.IsStockMaintain)
                invalidCount += 1;
        });
        if (invalidCount > 0)
            flag = false;
        aItemAddAtt.selected = flag;
    };

    $scope.PushAddAtt = function (index, AddAttlist, aAddAtt) {
        var stp = angular.copy(aAddAtt);
        stp.selected = false;
        stp.AttributeQty = 0;
        angular.forEach(stp.Detatil, function (aDetatil) {
            aDetatil.AttributeValue = "";
            aDetatil.ValueSelect = "";

        });
        AddAttlist.splice(index + 1, 0, stp);
    };

    $scope.RemoveAtt = function (index, list) {
        list.splice(index, 1);        
    };

    $scope.PushAdd = function (index, list) {
        // alert(index);
        // list.splice(index, 1);
        list.splice(index + 1, 0, {});
    };

    $scope.expandAll = function (expanded) {
        // $scope is required here, hence the injection above, even though we're using "controller as" syntax
        $scope.$broadcast('onExpandAll', { expanded: expanded });
    };

    $scope.SelPO = function (PO, index) {
        $scope.Product = PO.ItemName;
        $scope.Price = PO.POUnitPrice;
        $scope.POQty = PO.POQuantity;
        $scope.StockQty = PO.StockQty;
        $scope.ddlUnit = { "ItemUnitId": PO.UnitId };
        $scope.ddlUnit.unit = PO.UnitName;
        $scope.buttonAddPO = "Change";
        $scope.btnPODeleleShow = true;
        $scope.PORowIndex = index;
    }

    $scope.resetForm = function () {
        Clear();
        ClearPurchaseOrderDetail();
        $scope.purchaseOrderEntryForm.$setPristine();
        $scope.purchaseOrderEntryForm.$setUntouched();
        GetAllStore();
        GetAllSupplier();
        GetAllEmployee();
        GetPriceType();
        GetUnit();
    };
    //#endregion
});

