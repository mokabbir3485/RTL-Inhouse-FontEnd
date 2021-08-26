app.controller("StockDeclarationEntryController", function ($scope, $cookieStore, $http, $filter) {
    $scope.LoginUser = $cookieStore.get('UserData');
    Clear();
    //#region  Function
    function Clear() {
        $scope.ddlDeclaredBy = { 'EmployeeId': $scope.LoginUser.EmployeeId };
        $scope.btnSave = "Save";
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 2);
        $scope.FromDate = $filter('date')(currentDate.toJSON().slice(0, 10), 'dd/MM/yyyy');
        $scope.ToDate = $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy');
        $scope.inv_StockDeclaration = new Object;
        $scope.inv_StockDeclaration.DeclarationId = 0;
        $scope.VarietyList = [];
        $scope.employeeList = [];
        $scope.inv_StockDeclarationDetailAdAttributeLst = [];
        $scope.Storelist = [];
        GetAllStore();
        GetAllEmployee();
        $scope.ItemSearchResultList = [];
        $scope.StockDeclaration = {};
        $scope.StockDeclarationDetailList = [];
        $scope.DelectedProductList = [];
        $scope.DelcerationSearchList = [];
        $scope.StockDeclarationDetailAdAttributeLst = [];
        $scope.stockDeclerationDetailAdAttributeDetailLst = [];
        $scope.ddlEmployee = null;
        //$scope.ddlStore = null;
        $scope.ddlStockAuditGroup = null;
        $scope.ddlStockAuditType = null;

        GetAllProduct();
        GetIsApprove();
        GetUnit();
        GetAllStockDeclarationType();
        GetAllVariety();
        ClearStockDeclarationDetail();
        GetUsersPermissionDetails();
    }
    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('StockDeclarationEntryScreenId');
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
                else if (aPermissionDetails.FunctionName == 'ListView') {
                    $scope.ListViewPermission = aPermissionDetails.CanExecute;
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
    function ClearStockDeclarationDetail() {
        $scope.inv_StockDeclarationDetail = {};
        $scope.ddlUnit = null;
        $scope.ddlStockDeclarationType = null;
        $scope.DetailAddBtn = "Add";
        $scope.Product = null;
        $scope.ItemCode = '';
        $scope.RemoveBtnShow = false;
        $scope.DetailRowIndex = '';
        $scope.DetailAddBtnDisabled = true;
        $scope.UnitId = 0;
        $scope.PackageId = 0;
        $scope.ContainerId = 0;
        $("#txtBarcode").removeAttr("disabled");
        $("#txtProduct").removeAttr("disabled");
        $('#txtBarcode').focus();
    }
    function GetAllProduct() {
        var SearchCriteria = '1=1';
        $http({
            url: '/Item/GetItemSearchResult?searchCriteria=' + SearchCriteria,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ItemList = angular.copy(data);
        });
    }
    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.employeeList = data;
            $scope.ddlDeclaredBy = { EmployeeId: $scope.LoginUser.EmployeeId };
            $scope.inv_StockDeclaration.DeclaredById = data[0].EmployeeId;
            $scope.inv_StockDeclaration.DeclaredBy = data[0].FullName;
        });
    }
    function GetAllStore() {
        $scope.LoginUser = $cookieStore.get('UserData');
        $http({
            url: '/User/GetUserDepartmentByUserId?userId=' + $scope.LoginUser.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (userOutletList) {
            $scope.Storelist = userOutletList;
            if ($scope.Storelist.length == 1) {
                $scope.ddlStore = { DepartmentId: $scope.Storelist[0].DepartmentId };
                $scope.inv_StockDeclaration.DepartmentId = $scope.Storelist[0].DepartmentId;
                $scope.inv_StockDeclaration.DepartmentName = $scope.Storelist[0].DepartmentName;
            }
        });
    }
    function GetUnit() {
        $http({
            url: '/Unit/GetAllUnit',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.unitlist = data;
        })
    }
    function GetAllStockDeclarationType() {
        $http({
            url: '/StockDeclaration/GetAllStockDeclarationType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.StockDeclarationTypeList = data;
        });
    }
    function GetItemDetailsByUnit(itemId, unitId, deptId) {
        $http({
            url: '/StockValuation/GetByItemAndUnitAndDepartment?itemId=' + itemId + '&unitId=' + unitId + '&departmentId=' + deptId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (stkValuation) {
            if (stkValuation != "") {
                $scope.inv_StockDeclarationDetail.StockQty = stkValuation.CurrentQuantity;
            }
            else {
                $scope.inv_StockDeclarationDetail.StockQty = 0;
            }
            $('#txtDeclarationQty').focus();
        });
    }
    function ItemDetails(Name, Code) {
        var SearchCriteria = "ItemName LIKE '%" + Name + "%' OR ItemCode LIKE '%" + Code + "%'";
        $http({
            url: '/Item/GetItemSearchResult',
            method: 'GET',
            params: { searchCriteria: SearchCriteria },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ItemSearchResultList = data;
            if ($scope.ItemSearchResultList.length == 1) {
                $scope.Product = $scope.ItemSearchResultList[0].ItemName;
                $scope.ddlUnit = { "ItemUnitId": $scope.ItemSearchResultList[0].PurchaseUnitId };
                angular.forEach($scope.unitlist, function (aUnit) {
                    if ($scope.ItemSearchResultList[0].PurchaseUnitId == aUnit.ItemUnitId) {
                        $scope.inv_StockDeclarationDetail.DeclarationUnitId = aUnit.ItemUnitId;
                        $scope.inv_StockDeclarationDetail.DeclarationUnitName = aUnit.UnitName;
                    }
                })

                GetItemDetailsByUnit($scope.ItemSearchResultList[0].PurchaseUnitId, $scope.ddlStore.DepartmentId);
            }
        });

    }
    function GetIsApprove() {
        $scope.ScreenId = $cookieStore.get('StockDeclarationEntryScreenId');
        $http({
            url: '/Approval/GetByScreenId?screenId=' + $scope.ScreenId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.HasApproval = data.IsRequired;
        })
    }
    //#endregion

    //#region Events
    $scope.Search = function () {
        $scope.criteria = '1=1';
        if ($scope.ddlStore != 0 || $scope.ddlStore != null) {
            $scope.criteria += " AND DepartmentId like '%" + $scope.ddlStore.DepartmentId + "%'";
        }
        if ($scope.DeclarationNo != null && $scope.DeclarationNo != '') {
            $scope.criteria += " AND DeclarationNo like '" + $scope.DeclarationNo + "%'";
        }
        if ($scope.FromDate != null && $scope.FromDate != '' && $scope.ToDate != null && $scope.ToDate != '') {
            var dateParts = $scope.FromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];

            var dateParts2 = $scope.ToDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
            var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
            $scope.criteria += " AND DeclarationDate between '" + from + "' AND '" + to + "'";
        }
        $http({
            url: '/StockDeclaration/GetStockDeclarationDynamic?searchCriteria=' + $scope.criteria + '&orderBy=DeclarationNo',
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            angular.forEach(data, function (adata) {
                var res1 = adata.DeclarationDate.substring(0, 5);
                if (res1 == "/Date") {
                    var parsedDate1 = new Date(parseInt(adata.DeclarationDate.substr(6)));
                    var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                    adata.DeclarationDate = date1;
                }
            })
            $scope.DelcerationSearchList = data;
        })
    }

    $scope.RowClick = function (aDelcerationSearch) {
        if (aDelcerationSearch.DeclarationId > 0) {
            $http({
                url: '/StockDeclaration/GetAllstockDeclaration',
                method: 'GET',
                params: { id: aDelcerationSearch.DeclarationId },
                headers: { 'Content-Type': 'application/json' }
            }).success(function (aStoclDeclaration) {
                $scope.inv_StockDeclaration = aStoclDeclaration[0];
                var res = $scope.inv_StockDeclaration.DeclarationDate.substring(0, 5);
                if (res == "/Date") {
                    var parsedDate = new Date(parseInt($scope.inv_StockDeclaration.DeclarationDate.substr(6)));
                    $scope.inv_StockDeclaration.DeclarationDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
                }

                $scope.ddlStore = { "DepartmentId": $scope.inv_StockDeclaration.DepartmentId };

                $scope.inv_StockDeclaration.DepartmentId = $scope.inv_StockDeclaration.DepartmentId;
                $scope.inv_StockDeclaration.DepartmentName = $scope.inv_StockDeclaration.DepartmentName;
                $scope.ddlDeclaredBy = { "EmployeeId": $scope.inv_StockDeclaration.DeclaredById };
                $scope.inv_StockDeclaration.DeclaredById = $scope.inv_StockDeclaration.DeclaredById;
                $scope.inv_StockDeclaration.DeclaredBy = $scope.inv_StockDeclaration.DeclaredBy;
                $scope.inv_StockDeclaration.Remarks = $scope.inv_StockDeclaration.Remarks;

                $http({
                    url: '/StockDeclaration/GetAllGetAllstockDeclarationDetailById',
                    method: 'GET',
                    params: { declarationId: $scope.inv_StockDeclaration.DeclarationId },
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (diclarationDetail) {
                    angular.forEach(diclarationDetail, function (adiclarationDetail) {
                        adiclarationDetail.ItemUnitId = adiclarationDetail.DeclarationUnitId;
                        $http({
                            url: '/StockDeclaration/GetAllDeclarationDetailAdAttributeByDeclarationDetailId?DeclarationDetailId=' + adiclarationDetail.DeclarationDetailId,
                            method: "GET",
                            headers: { 'Content-Type': 'application/json' }
                        }).success(function (DiclarationDetailAdAttributeList) {
                            adiclarationDetail.ItemAddAtt = [];
                            angular.forEach(DiclarationDetailAdAttributeList, function (aDiclarationDetailAdAttributeList) {
                                var obj = {};
                                obj.selected = true;
                                obj.AttributeQty = aDiclarationDetailAdAttributeList.AttributeQty
                                obj.Detatil = [];
                                $http({
                                    url: '/StockDeclaration/GetAllDeclarationDetailAdAttributeByDeclarationDetailAdAttId?DeclarationDetailAdAttId=' + aDiclarationDetailAdAttributeList.DeclarationDetailAdAttId,
                                    method: 'GET',
                                    headers: { 'Content-Type': 'application/json' }
                                }).success(function (DiclarationDetailAdAttDetailList) {
                                    angular.forEach(DiclarationDetailAdAttDetailList, function (aDiclarationDetailAdAttDetailList) {
                                        $http({
                                            url: '/Receive/GetItemAdditionalAttributeValueByItemAddAttId',
                                            method: "GET",
                                            params: { itemAddAttId: aDiclarationDetailAdAttDetailList.ItemAddAttId },
                                            headers: { 'Content-Type': 'application/json' }
                                        }).success(function (itemAdAttValues) {
                                            if (itemAdAttValues.length) {
                                                aDiclarationDetailAdAttDetailList.Values = itemAdAttValues;
                                                aDiclarationDetailAdAttDetailList.ValueSelect = { "Value": aDiclarationDetailAdAttDetailList.AttributeValue };
                                            }
                                        })
                                        obj.Detatil.push(aDiclarationDetailAdAttDetailList);
                                    })
                                })

                                adiclarationDetail.ItemAddAtt.push(obj);
                            })
                        })
                    })

                    $scope.StockDeclarationDetailList = diclarationDetail;
                    $scope.btnSave = "Revise";
                })
            })
        }
    }

    $scope.ItemSearch = function () {
        Itemsearch();
    }

    function Itemsearch() {
        if (typeof $scope.Product === 'object') {
            $scope.inv_StockDeclarationDetail = $scope.Product;
            $scope.PackageId = $scope.Product.PackageId;
            $scope.ContainerId = $scope.Product.ContainerId;
            $scope.ddlUnit = { "ItemUnitId": $scope.Product.PurchaseUnitId };
            angular.forEach($scope.unitlist, function (aUnit) {
                if ($scope.Product.PurchaseUnitId == aUnit.ItemUnitId) {
                    $scope.inv_StockDeclarationDetail.DeclarationUnitId = aUnit.ItemUnitId;
                    $scope.inv_StockDeclarationDetail.DeclarationUnitName = aUnit.UnitName;
                }
            })
            GetItemDetailsByUnit($scope.Product.ItemId, $scope.Product.PurchaseUnitId, $scope.ddlStore.DepartmentId);
        }
    }

    $scope.BarcodeSearch = function (e) {
        angular.forEach($scope.VarietyList, function (item) {
            if ($scope.ItemCode == item.ItemCode) {
                $scope.Product = item;

                $scope.UnitId = $scope.Product.UnitId;
                $scope.PackageId = $scope.Product.PackageId;
                $scope.ContainerId = $scope.Product.ContainerId;
                $scope.inv_StockDeclarationDetail.UnitPerPackage = $scope.Product.UnitPerPackage;
                $scope.ddlUnit = { "ItemUnitId": $scope.Product.PurchaseUnitId };
                angular.forEach($scope.unitlist, function (aUnit) {
                    if ($scope.Product.PurchaseUnitId == aUnit.ItemUnitId) {
                        $scope.inv_StockDeclarationDetail.DeclarationUnitId = aUnit.ItemUnitId;
                        $scope.inv_StockDeclarationDetail.DeclarationUnitName = aUnit.UnitName;
                    }
                })
                GetItemDetailsByUnit($scope.Product.ItemId, $scope.Product.PurchaseUnitId, $scope.ddlStore.DepartmentId);
            }
        });
    }

    $scope.unitFilter = function (item) {
        return function (pram) {
            return (pram.ItemUnitId == RawItem.UnitId) || (pram.ItemUnitId == RawItem.PackageId) || (pram.ItemUnitId == RawItem.ContainerId);
        };
    }

    $scope.GetItemDetails = function (unitId) {
        if (unitId != undefined) {
            GetItemDetailsByUnit($scope.Product.ItemId, unitId, $scope.ddlStore.DepartmentId);
        }
    }

    $scope.AddDetail = function () {
        if ($scope.DetailAddBtn == "Add") {
            var isExist = true;
            angular.forEach($scope.StockDeclarationDetailList, function (aStockDeclarationDetail) {
                if (aStockDeclarationDetail.ItemId == $scope.inv_StockDeclarationDetail.ItemId) {
                    isExist = false;
                }
            })
            if (isExist) {
                $http({
                    url: '/IssueWithoutRequisition/GetStockIssueDetailAdAttributeByDepartmentAndItemId?DepartmentId=' + $scope.ddlStore.DepartmentId + '&itemId=' + $scope.inv_StockDeclarationDetail.ItemId,
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (data) {
                    var Attdata = data;
                    $scope.inv_StockDeclarationDetail.HeaderOfAttribute = [];
                    if (data.length) {
                        var HeaderOfAttribute = [];
                        var a = data[0].Combination.split(',');
                        for (var i = 0; i < a.length; i++) {
                            var val = a[i].split(':');
                            HeaderOfAttribute.push(val[0].trim());
                        }
                        $scope.inv_StockDeclarationDetail.HeaderOfAttribute = HeaderOfAttribute;
                        angular.forEach(Attdata, function (adata) {
                            var ValueOfAttribute = [];
                            var a = adata.Combination.split(',');
                            for (var i = 0; i < a.length; i++) {
                                var val = a[i].split(':');
                                ValueOfAttribute.push(val[1].trim());
                            }
                            adata.ValueOfAttribute = ValueOfAttribute;
                            $scope.inv_StockDeclarationDetailAdAttributeLst.push(adata);
                        });
                    }

                    $scope.StockDeclarationDetailList.push($scope.inv_StockDeclarationDetail);
                    ClearStockDeclarationDetail();

                });
            }
            else {
                alertify.log($scope.inv_StockDeclarationDetail.ItemName + ' is already exists!', 'error', '5000');
            }
        } else {
            ClearStockDeclarationDetail();
        }
    }

    $scope.SelDetail = function (aStockDeclarationDetail, index) {
        if (!$scope.RemoveBtnShow) {
            $scope.UnitId = aStockDeclarationDetail.UnitId;
            $scope.PackageId = aStockDeclarationDetail.PackageId;
            $scope.ContainerId = aStockDeclarationDetail.ContainerId;
            $scope.inv_StockDeclarationDetail = aStockDeclarationDetail;
            $scope.inv_StockDeclarationDetail = aStockDeclarationDetail;
            $scope.ItemCode = aStockDeclarationDetail.ItemCode;
            $scope.Product = { "ItemId": aStockDeclarationDetail.ItemId, "ItemName": aStockDeclarationDetail.ItemName, "ItemCode": aStockDeclarationDetail.ItemCode, "UnitId": aStockDeclarationDetail.UnitId, "PackageId": aStockDeclarationDetail.PackageId, "ContainerId": aStockDeclarationDetail.ContainerId };
            $scope.ddlUnit = { 'ItemUnitId': aStockDeclarationDetail.DeclarationUnitId };
            $scope.inv_StockDeclarationDetail.DeclarationUnitId = aStockDeclarationDetail.DeclarationUnitId;
            $scope.inv_StockDeclarationDetail.DeclarationUnitName = aStockDeclarationDetail.DeclarationUnitName;
            $scope.inv_StockDeclarationDetail.DeclarationQuantity = aStockDeclarationDetail.DeclarationQuantity;
            $scope.ddlStockDeclarationType = { "DeclarationTypeId": aStockDeclarationDetail.DeclarationTypeId, "DeclarationTypeName": aStockDeclarationDetail.DeclarationTypeName };
            $scope.DetailAddBtn = "Change";
            $scope.RemoveBtnShow = true;
            $scope.DetailRowIndex = index;
            $scope.DetailAddBtnDisabled = false;
            $("#txtProduct").attr("disabled", "disabled");
            $("#txtBarcode").attr("disabled", "disabled");
        }
        else {
            alertify.log('At first update the selected Item.', 'error', '5000');
        }
    }

    $scope.RemoveDetail = function () {
        $scope.DelectedProductList.push(
                {
                    ItemId: $scope.inv_StockDeclarationDetail.ItemId,
                    PrvDeclarationQuantity: $scope.inv_StockDeclarationDetail.PrvDeclarationQuantity,
                    DeclarationQuantity: $scope.inv_StockDeclarationDetail.DeclarationQuantity,
                    DeclarationUnitId: $scope.inv_StockDeclarationDetail.DeclarationUnitId,
                });

        $scope.StockDeclarationDetailList.splice($scope.DetailRowIndex, 1);
        ClearStockDeclarationDetail();
    }

    //SAVE
    $scope.AddStockDeclaration = function () {
        if ($scope.found) {
            $('#txtDeclarationNo').focus();
        }
        else {
            var erroMsg = [];
            if ($scope.StockDeclarationDetailList.length) {
                angular.forEach($scope.StockDeclarationDetailList, function (aStockDeclarationDetail) {
                    if (aStockDeclarationDetail.DeclarationQuantity > 0) {
                        if (aStockDeclarationDetail.ItemAddAtt) {
                            var arr = [];
                            var totAttQty = 0;
                            angular.forEach(aStockDeclarationDetail.ItemAddAtt, function (aItemAddAtt) {
                                if (aItemAddAtt.selected) {
                                    totAttQty += aItemAddAtt.AttributeQty;

                                    var valuesConcat = '';
                                    if (aItemAddAtt.Detatil.length > 0) {
                                        angular.forEach(aItemAddAtt.Detatil, function (aDetatil) {
                                            valuesConcat += aDetatil.AttributeValue;
                                        })

                                        arr.push(valuesConcat);
                                    }
                                }
                            });
                            if (aStockDeclarationDetail.DeclarationQuantity != totAttQty && totAttQty != 0) {
                                erroMsg.push({
                                    msg: aStockDeclarationDetail.ItemName + " Diclaration Qty must be equal to Additional Attribute Qty"
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
                                        msg: aStockDeclarationDetail.ItemName + " has Duplicate Attribute Combination!"
                                    });
                                }
                            }
                            else if (totAttQty == 0) {
                                angular.forEach(aStockDeclarationDetail.ItemAddAtt, function (aItemAddAtt) {
                                    var attReq = '';
                                    angular.forEach(aItemAddAtt.Detatil, function (aDetatil) {
                                        if (aDetatil.IsStockMaintain)
                                            attReq += attReq == '' ? aDetatil.AttributeName : ', ' + aDetatil.AttributeName;
                                    })
                                    erroMsg.push({
                                        msg: aStockDeclarationDetail.ItemName + " need Attribute Qty for " + attReq
                                    });
                                })
                            }
                        }
                    }
                });
            }
            else {
                erroMsg.push({
                    msg: "Please Add Product"
                });
            }
            $scope.inv_StockDeclaration.CreatorId = $scope.LoginUser.UserId;
            $scope.inv_StockDeclaration.UpdatorId = $scope.LoginUser.UserId;
            $scope.inv_StockDeclaration.DeclaredById = $scope.LoginUser.EmployeeId;
            $scope.inv_StockDeclaration.DeclaredBy = $scope.LoginUser.Username;
            $scope.inv_StockDeclaration.IsApproved = $scope.HasApproval ? false : true;

            var id = 1;
            angular.forEach($scope.StockDeclarationDetailList, function (aStockDeclarationDetail) {
                aStockDeclarationDetail.DeclarationDetailId = id;
                if (aStockDeclarationDetail.ItemAddAtt) {
                    var addAttId = 1;
                    angular.forEach(aStockDeclarationDetail.ItemAddAtt, function (aItemAddAtt) {
                        if (aItemAddAtt.selected) {
                            aItemAddAtt.DeclarationDetailId = id;
                            aItemAddAtt.DeclarationDetailAdAttId = addAttId;
                            $scope.StockDeclarationDetailAdAttributeLst.push(aItemAddAtt);
                            angular.forEach(aItemAddAtt.Detatil, function (aDetail) {
                                aDetail.DeclarationDetailAdAttId = addAttId
                                $scope.stockDeclerationDetailAdAttributeDetailLst.push(aDetail);
                            })
                        }
                        addAttId += 1;
                    })
                }
                id += 1;
            })

            if ($scope.btnSave == 'Save' && $scope.CreatePermission) {
                alertify.confirm("Are you sure to save?", function (e) {
                    if (e) {
                        if ($scope.StockDeclarationDetailList.length < 1) {
                            erroMsg.push({
                                msg: "Please Add Product"
                            });
                        }
                        if (!erroMsg.length) {
                            var from = $("#txtDeclarationDate").val().split("/");
                            var f = new Date(from[2], from[1] - 1, from[0]);
                            $scope.inv_StockDeclaration.DeclarationDate = f;
                            //Save
                            var parms = JSON.stringify({ stockDeclaration: $scope.inv_StockDeclaration, stockDeclarationDetailList: $scope.StockDeclarationDetailList, stockDeclarationDetailAdAttribute: $scope.StockDeclarationDetailAdAttributeLst, stockDeclarationDetailAdAttributeDetail: $scope.stockDeclerationDetailAdAttributeDetailLst });
                            $http.post('/StockDeclaration/SaveStockDeclaration', parms).success(function (data) {
                                if (data > 0) {
                                    hub.server.stockQty();// SignalR: Post to server, OWIN class Method StockQty()
                                    Clear();
                                    $scope.stockDeclarationEntryForm.$setPristine();
                                    $scope.stockDeclarationEntryForm.$setUntouched();
                                    alertify.log('Stock Declaration Saved Successfully!', 'success', '5000');
                                }
                            }).error(function (data) {
                                alertify.log('Server Save Errors!', 'error', '5000');
                            });

                        } else {
                            angular.forEach(erroMsg, function (aErroMsg) {
                                alertify.log(aErroMsg.msg, 'error', '5000');
                            });
                        }
                    }
                    else {
                        return;
                    }
                });
            }
            else if ($scope.btnSave == 'Save' && !$scope.CreatePermission) {
                alertify.log('You do not have permission to save!', 'error', '5000');
            }
            else if ($scope.btnSave != 'Save' && $scope.RevisePermission) {
                alertify.confirm("Are you sure to revise?", function (e) {
                    if (e) {
                        if ($scope.StockDeclarationDetailList.length < 1) {
                            erroMsg.push({
                                msg: "Please Add Product"
                            });
                        }
                        if (!erroMsg.length) {
                            var from = $("#txtDeclarationDate").val().split("/");
                            var f = new Date(from[2], from[1] - 1, from[0]);
                            $scope.inv_StockDeclaration.DeclarationDate = f;
                            angular.forEach($scope.DelectedProductList, function (aDelectedProduct) {
                                $scope.StockDeclarationDetailList.push({
                                    ItemId: aDelectedProduct.ItemId,
                                    DeclarationQuantity: 0,
                                    PrvDeclarationQuantity: aDelectedProduct.PrvDeclarationQuantity,
                                    DeclarationUnitId: aDelectedProduct.DeclarationUnitId,
                                    ItemCode: 'NA',
                                    ItemName: 'NA',
                                    DeclarationUnitName: 'NA',
                                    DeclarationTypeName: 'NA'
                                });
                            });
                            //Save
                            var parms = JSON.stringify({ stockDeclaration: $scope.inv_StockDeclaration, stockDeclarationDetailList: $scope.StockDeclarationDetailList });
                            $http.post('/StockDeclaration/SaveStockDeclaration', parms).success(function (data) {
                                if (data > 0) {
                                    Clear();
                                    $scope.stockDeclarationEntryForm.$setPristine();
                                    $scope.stockDeclarationEntryForm.$setUntouched();
                                    alertify.log('Stock Declaration Revise Successfully!', 'success', '5000');
                                }
                            }).error(function (data) {
                                alertify.log('Server Save Errors!', 'error', '5000');
                            });
                        } else {
                            angular.forEach(erroMsg, function (aErroMsg) {
                                alertify.log(aErroMsg.msg, 'error', '5000');
                            });
                        }
                    }
                    else {
                        return;
                    }
                });
            }
            else if ($scope.btnSave != 'Save' && !$scope.RevisePermission) {
                alertify.log('You do not have permission to Update!', 'error', '5000');
            }
        }
    }

    $scope.resetForm = function () {
        Clear();
        $scope.stockDeclarationEntryForm.$setPristine();
        $scope.stockDeclarationEntryForm.$setUntouched();
    }

    $scope.expandAll = function (expanded) {
        $scope.$broadcast('onExpandAll', { expanded: expanded });
    }

    $scope.CheckDuplicateDeclerationNo = function () {
        var criteria = " [DeclarationNo]='" + $scope.inv_StockDeclaration.DeclarationNo + "'";
        $http({
            url: '/StockDeclaration/GetStockDeclarationDynamic?searchCriteria=' + criteria + '&orderBy=DeclarationNo',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                $scope.found = true;
                alertify.log($scope.inv_StockDeclaration.DeclarationNo + ' already exists!', 'already', '5000');
                $('#txtDeclarationNo').focus();
            } else {
                $scope.found = false;
            }
        });
    }

    $scope.foundChange = function () {
        $scope.found = true;
    }
});