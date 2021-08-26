app.controller("ReturnToSupplierController", function ($scope, $cookieStore, $http, $filter) {

    //#region Function/Method
    $scope.SearchItem = [
        {
            FromDate: "",
            ToDate: "",
            ddlStore: "",
            PBNo: "",
            ReceiveNo: "",
            ChallanNo: "",
            ddlSupplier: "",
            ddlProduct: "",
            ddlReceivedBy: "",
        }
    ];

    Clear();

    function Clear() {
        GetAllStore();
        GetAllProduct();
        GetAllEmployee();
        GetAllSupplier();
        GetAllDepartment();
        //$scope.inv_ReturnToSupplier = {};
        $scope.inv_ReturnToSupplierDetailList = [];
        $scope.inv_StockReceiveList = [];
        $scope.DepartmentList = [];
        GetAllReturnReasonList();
        $scope.inv_ReturnToSupplier = new Object();
        $scope.inv_ReturnToSupplier.receiveId = 0;
        $scope.fromScreenId = $cookieStore.get('ReturnToSupplierScreenId');
        $scope.ScreenId = $cookieStore.get('ReturnToSupplierScreenId');
        $scope.IsSearchReceive = true;
        $scope.HasApprovalForReturn = false;
        GetIsApproveForReturntosupplier();
    }

    function GetIsApproveForReturntosupplier() {
        $http({
            url: '/Approval/GetByScreenId?screenId=' + $scope.ScreenId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.HasApprovalForReturn = data.IsRequired;
        })
    }

    function GetAllDepartment() {
        $http({
            url: '/Department/GetAllDepartment',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DepartmentList = data;
        });
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

    function GetAllProduct() {
        var SearchCriteria = '1=1';
        $http({
            url: '/Item/GetItemSearchResult?searchCriteria=' + SearchCriteria,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ItemList = data;
        });
    }

    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.EmployeeList = data;
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

    function GetSearchResult() {
        var SearchCriteria = '1=1';
        if ($scope.SearchItem.FromDate != undefined) {
            if ($scope.SearchItem.ToDate != undefined) {
                var dateParts = $scope.SearchItem.FromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
                var dateParts2 = $scope.SearchItem.ToDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
                SearchCriteria += " AND [ReceiveDate] BETWEEN '" + from + "' AND '" + to + "'";
            }
            else {
                alertify.log("Please Enter To Date also !!!", "Error", "5000");
                return;
            }
        }
        if ($scope.SearchItem.ddlStore != undefined) {
            SearchCriteria += " AND [DepartmentId]=" + $scope.SearchItem.ddlStore.DepartmentId;
        }
        if ($scope.SearchItem.PBNo != undefined && $scope.SearchItem.PBNo != "") {
            SearchCriteria += " AND [PBNo]='" + $scope.SearchItem.PBNo + "'";
        }
        if ($scope.SearchItem.ReceiveNo != undefined && $scope.SearchItem.ReceiveNo != "") {
            SearchCriteria += " AND [ReceiveNo]='" + $scope.SearchItem.ReceiveNo + "'";
        }
        if ($scope.SearchItem.ChallanNo != undefined && $scope.SearchItem.ChallanNo != "") {
            SearchCriteria += " AND [ChallanNo]='" + $scope.SearchItem.ChallanNo + "'";
        }
        if ($scope.SearchItem.ddlSupplier != undefined) {
            SearchCriteria += " AND [SupplierId]=" + $scope.SearchItem.ddlSupplier.SupplierId;
        }
        if ($scope.SearchItem.ddlReceivedBy != undefined) {
            SearchCriteria += " AND [ReceivedById]=" + $scope.SearchItem.ddlReceivedBy.EmployeeId;
        }
        //if ($scope.SearchItem.ddlProduct != undefined) {
        //    SearchCriteria += " AND [IssueFromDepartmentId]=" + $scope.SearchItem.ddlProduct.ItemId;
        //}
        $http({
            url: '/ReturnToSupplier/GetSearchResult?searchCriteria=' + SearchCriteria,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                angular.forEach(data, function (aData) {
                    var res = aData.ReceiveDate.substring(0, 5);
                    if (res == "/Date") {
                        var parsedDate = new Date(parseInt(aData.ReceiveDate.substr(6)));
                        aData.ReceiveDate = $filter('date')(parsedDate, 'dd-MMM-yyyy');
                    }
                });
                $scope.inv_StockReceiveList = angular.copy(data);
            } else {
                alertify.log("No Data Found", "Error", "5000");
            }
        });
    }

    function GetReceiveMaster(aStockReceive) {
        var res = aStockReceive.ReceiveDate.substring(0, 5);
        if (res == "/Date") {
            var parsedDate = new Date(parseInt(aStockReceive.ReceiveDate.substr(6)));
            aStockReceive.ReceiveDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
        }
        $scope.inv_ReturnToSupplier.SRId = aStockReceive.SRId;
        $scope.inv_ReturnToSupplier.ReceiveNo = aStockReceive.ReceiveNo;
        $scope.inv_ReturnToSupplier.ChallanNo = aStockReceive.ChallanNo;
        $scope.inv_ReturnToSupplier.ReceiveDate = aStockReceive.ReceiveDate;
        $scope.ddlSupplier = { 'SupplierId': aStockReceive.SupplierId };
        $scope.inv_ReturnToSupplier.SupplierId = aStockReceive.SupplierId;        
        $scope.inv_ReturnToSupplier.SupplierName = aStockReceive.SupplierName;
        $scope.ddlDepartment = { 'DepartmentId': aStockReceive.DepartmentId };
        $scope.inv_ReturnToSupplier.DepartmentId = aStockReceive.DepartmentId;
        $scope.inv_ReturnToSupplier.DepartmentName = aStockReceive.DepartmentName;
  
        $scope.LoginUser = $cookieStore.get('UserData');
        $scope.inv_ReturnToSupplier.CreatorId = $scope.LoginUser.UserId;
        $scope.inv_ReturnToSupplier.UpdatorId = $scope.LoginUser.UserId;

        $http({
            url: '/Receive/GetReceiveDetailBySRId',
            method: "GET",
            params: { srId: aStockReceive.SRId },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (ReceiveDetailList) {
            angular.forEach(ReceiveDetailList, function (aReceiveDetail) {
                $http({
                    url: '/ReturnToSupplier/GetStockReceiveDetailAdAttributeByDetailId',
                    method: 'GET',
                    params: { reciveDetailId: aReceiveDetail.SRDetailId },
                    headers: { 'content-Type': 'application/json' }
                }).success(function (ReceiveDetailAddAttributelist) {
                    aReceiveDetail.ItemAddAtt = [];

                    angular.forEach(ReceiveDetailAddAttributelist, function (aReceiveDetailAddAttribute) {
                        var obj = {};
                        obj.selected = true;
                        obj.AttributeQty = aReceiveDetailAddAttribute.AttributeQty;
                        obj.Detatil = [];

                        $http({
                            url: '/ReturnToSupplier/GetStockReceiveDetailAdAttributeDetailByAddAttId',
                            method: 'GET',
                            params: { reciveDetaiAddAttlId: aReceiveDetailAddAttribute.SRDetailAdAttId },
                            headers: { 'content-Type': 'application/json' },
                        }).success(function (ReceiveDetailAddAttList) {
                            angular.forEach(ReceiveDetailAddAttList, function (aReceiveDetailAddAtt) {
                                $http({
                                    url: '/Receive/GetItemAdditionalAttributeValueByItemAddAttId',
                                    method: "GET",
                                    params: { itemAddAttId: aReceiveDetailAddAtt.ItemAddAttId },
                                    headers: { 'Content-Type': 'application/json' }
                                }).success(function (itemAdAttValues) {
                                    if (itemAdAttValues.length) {
                                        aReceiveDetailAddAtt.Values = itemAdAttValues;
                                        aReceiveDetailAddAtt.ValueSelect = { "Value": aReceiveDetailAddAtt.AttributeValue };
                                    }
                                })
                                obj.Detatil.push(aReceiveDetailAddAtt);
                            })
                        })
                        aReceiveDetail.ItemAddAtt.push(obj);
                    })
                })
            })
            $scope.inv_ReturnToSupplierDetailList = ReceiveDetailList;
        });
    }

    function GetAllReturnReasonList() {
        $http({
            url: '/ReturnToSupplier/GetAllReturnReason',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ReturnReasonList = data;
        });
    }

    function ReturnToSupplierAdvanceSearch() {
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
                        $scope.AdvanceItemSearchResultList = data;
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
                if ($scope.SearchId > 0) {
                    $http({
                        url: '/ReturnToSupplier/GetReturnToSupplierById',
                        method: 'GET',
                        params: { Id: $scope.SearchId },
                        headers: { 'Content-Type': 'application/json' }
                    }).success(function (aReturnToSupplier) {
                        $scope.inv_ReturnToSupplier = aReturnToSupplier[0];
                        var res = $scope.inv_ReturnToSupplier.ReturnDate.substring(0, 5);
                        if (res == "/Date") {
                            var parsedDate = new Date(parseInt($scope.inv_ReturnToSupplier.ReturnDate.substr(6)));
                            $scope.inv_ReturnToSupplier.ReturnDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
                        }

                        $scope.inv_ReturnToSupplier.ReturnDate = $scope.inv_ReturnToSupplier.ReturnDate;
                        $scope.inv_ReturnToSupplier.ReturnNo = $scope.inv_ReturnToSupplier.ReturnNo;
                        $scope.ddlReturnBy = { "ReturnById": $scope.inv_ReturnToSupplier.ReturnById };
                        $scope.inv_ReturnToSupplier.ReturnById = $scope.inv_ReturnToSupplier.ReturnById;
                        $scope.inv_ReturnToSupplier.ReturnBy = $scope.inv_ReturnToSupplier.ReturnBy;
                        $scope.inv_ReturnToSupplier.Remarks = $scope.inv_ReturnToSupplier.Remarks;

                        var parms = JSON.stringify({ id: $scope.inv_ReturnToSupplier.ReturnId });
                        $http.post('/ReturnToSupplier/GetReturnToSupplierDetailById', parms).success(function (ReturnDetailList) {
                            angular.forEach(ReturnDetailList, function (aReturnDetail) {
                                $http({
                                    url: '/ReturnToSupplier/GetAllReturnToSupplierDetailAdAttributeByReturnToSupplierDetailId',
                                    method: 'GET',
                                    params: { returnToSupplierDetailId: aReturnDetail.ReturnDetailId },
                                    headers: { 'content-Type': 'application/json' }
                                }).success(function (ReturnDetailAdAttributeList) {
                                    aReturnDetail.ItemAddAtt = [];

                                    angular.forEach(ReturnDetailAdAttributeList, function (aReturnDetailAdAttribute) {
                                        var obj = {};
                                        obj.selected = true;
                                        obj.AttributeQty = aReturnDetailAdAttribute.AttributeQty;
                                        obj.Detatil = [];

                                        $http({
                                            url: '/ReturnToSupplier/GetAllReturnToSupplierAdAttributeDetailByReturnToSupplierAddAttId',
                                            method: 'GET',
                                            params: { returnToSupplierDetailAddattId: aReturnDetailAdAttribute.ReturnDetailAdAttId },
                                            headers: { 'content-Type': 'application/json' },
                                        }).success(function (ReturnDetailAddAttList) {
                                            angular.forEach(ReturnDetailAddAttList, function (aReturnDetailAddAtt) {
                                                $http({
                                                    url: '/ReturnToSupplier/GetItemAdditionalAttributeValueByItemAddAttId',
                                                    method: "GET",
                                                    params: { itemAddAttId: aReturnDetailAddAtt.ItemAddAttId },
                                                    headers: { 'Content-Type': 'application/json' }
                                                }).success(function (itemAdAttValues) {
                                                    if (itemAdAttValues.length) {
                                                        aReturnDetailAddAtt.Values = itemAdAttValues;
                                                        aReturnDetailAddAtt.ValueSelect = { "Value": aReturnDetailAddAtt.AttributeValue };
                                                    }
                                                })
                                                obj.Detatil.push(aReturnDetailAddAtt);
                                            })
                                        })
                                        aReturnDetail.ItemAddAtt.push(obj);
                                    })
                                })
                            })
                            $scope.btnSave = "Revise";
                            $scope.inv_ReturnToSupplierDetailList = ReturnDetailList;
                        })
                    })
                }
            })
        }
    }
    //#endregion

    //#region Events 

    $scope.SearchReceive = function () {
        $scope.ItemAdvanceSearch = false;
        $scope.ScreenId = $cookieStore.get('StockReceiveScreenId');
        $http({
            url: "/AdvancedSearch/SetScreenIdsToSession?screenId=" + $scope.ScreenId + '&fromScreenId=' + $scope.fromScreenId,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            document.getElementById('AdSearch').contentDocument.location.reload(true);
            $scope.ItemAdvanceSearch = false;
            $scope.IsSearchReceive = true;
        });
    }

    $scope.SearchReturnToSupplierForEdit = function () {
        $scope.ItemAdvanceSearch = false;
        $scope.ScreenId = $cookieStore.get('ReturnToSupplierScreenId');
        $http({
            url: "/AdvancedSearch/SetScreenIdsToSession?screenId=" + $scope.ScreenId + '&fromScreenId=' + $scope.fromScreenId,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            document.getElementById('AdSearch').contentDocument.location.reload(true);
            $scope.ItemAdvanceSearch = false;
            $scope.IsSearchReceive = false;
        });
    }

    $scope.LoadAdvanceSearch = function () {
        if ($scope.IsSearchReceive == true) {
            $http({
                url: '/AdvancedSearch/GetSearchId',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.SearchId = data;
                if ($scope.SearchId > 0) {
                    $http({
                        url: '/Receive/GetReceiveById',
                        method: 'GET',
                        params: { srId: $scope.SearchId },
                        headers: { 'Content-Type': 'application/json' }
                    }).success(function (ReceiveList) {
                        GetReceiveMaster(ReceiveList);
                        //angular.forEach(ReceiveList, function (aStockReceive) {
                        //    GetReceiveMaster(aStockReceive);
                        //})
                    })
                }
            })
        }
        else {
            ReturnToSupplierAdvanceSearch();
        }

    };

    $scope.resetForm = function () {
        Clear();
        $scope.returnToSupplierForm.$setPristine();
        $scope.returnToSupplierForm.$setUntouched();
    };

    $scope.Search = function () {
        GetSearchResult();
    };

    $scope.SelReceive = function (aStockReceive) {
        GetReceiveMaster(aStockReceive);
    };

    //Save
    $scope.SaveReturnToSupplier = function () {
        var erroMsg = [];
        if ($scope.inv_ReturnToSupplierDetailList.length < 1) {
            erroMsg.push({
                msg: "Please Add Product"
            });
        }
        else {
            var itemWithQtyNotFound = true;
            var a = false;
            angular.forEach($scope.inv_ReturnToSupplierDetailList, function (aReturnToSupplierDetail) {
                if (aReturnToSupplierDetail.ReturnQuantity != null && aReturnToSupplierDetail.ReturnQuantity > 0) {
                    itemWithQtyNotFound = false;
                    if ((aReturnToSupplierDetail.ReturnQuantity + aReturnToSupplierDetail.ReturnedQuantity) > aReturnToSupplierDetail.SRQuantity) {
                        a = true;
                    }
                }
            });
            if (itemWithQtyNotFound) {
                erroMsg.push({
                    msg: "Please Input Quantity of products !!!"
                });
            }
            if (a) {
                erroMsg.push({
                    msg: "Return Quantity Can't be more than available Quantity !!!"
                });
            }
        }
        if (!erroMsg.length) {
            if ($scope.IsSearchReceive == true) {
                $scope.inv_ReturnToSupplier.IsApproved = false;
            }
            else {
                $scope.inv_ReturnToSupplier.IsApproved = true;
            }
            var from = $("#txtReturnDate").val().split("/");
            var f = new Date(from[2], from[1] - 1, from[0]);
            $scope.inv_ReturnToSupplier.ReturnDate = f;
            var parms = JSON.stringify({ returnToSupplier: $scope.inv_ReturnToSupplier });
            $http.post('/ReturnToSupplier/SaveReturnToSupplier', parms).success(function (ReturnId) {
                if (ReturnId > 0) {
                    angular.forEach($scope.inv_ReturnToSupplierDetailList, function (aReturnToSupplierDetail) {
                        var parms = JSON.stringify({ returnToSupplierDetail: aReturnToSupplierDetail, returnId: ReturnId });
                        $http.post('/ReturnToSupplier/SaveReturnToSupplierDetail', parms).success(function (returnToSupplierDetailList) {

                            //add additional attribute function
                            if (returnToSupplierDetailList.ItemAddAtt.length) {
                                angular.forEach(returnToSupplierDetailList.ItemAddAtt, function (aItemAddAtt) {
                                    //chk if add att is valid or not
                                    if (aItemAddAtt.selected) {
                                        aItemAddAtt.ReturnDetailId = detailsuccess;
                                        var parms = JSON.stringify({ _inv_ReturnToSupplierDetailAdAttribute: aItemAddAtt });
                                        $http.post('/ReturnToSupplier/SaveReturnToSupplierrDetailAdAttribute', parms).success(function (data) {
                                            //in method param aItemAddAtt.Detatil
                                            angular.forEach(aItemAddAtt.Detatil, function (aDetatil) {
                                                aDetatil.ReturnDetailAdAttId = data;
                                                var parmms = JSON.stringify({ _inv_ReturnToSupplierDetailAdAttributeDetail: aDetatil });
                                                $http.post('/ReturnToSupplier/SaveReturnToSupplierAdAttributeDetail', parmms).success(function (data) {

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
                    Clear();
                    $scope.returnToSupplierForm.$setPristine();
                    $scope.returnToSupplierForm.$setUntouched();
                    alertify.log('Return To Supplier Saved Successfully!', 'success', '5000');
                }
            }).error(function (data) {
                alertify.log('Server Save Errors!', 'error', '5000');
            });
        } else {
            angular.forEach(erroMsg, function (aErroMsg) {
                alertify.log(aErroMsg.msg, 'error', '5000');
            });
        }
    };
    //#endregion

    //#region expand for additina attribute
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
    //#endregion


});