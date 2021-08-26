app.controller("ProductionEntryController", function ($scope, $cookieStore, $http, $window, $filter) {
    Clear();
    GetUsersPermissionDetails();
    GetAllStore();
    GetAllEmployee();
    GetByCombinationand();
    GetByCombinationLike();
    GetAllVariety();

    function Clear() {
        $scope.LoginUser = $cookieStore.get('UserData');
        $scope.UserId = $scope.LoginUser.UserId;
        $scope.ScreenId = $cookieStore.get('ProductionEntryScreenId');
        $scope.ddlStore = null;
        $scope.btnSave = "Save";
        $scope.found = true;
        $scope.Production = {};
        $scope.ProductionDetailList = [];
        $scope.VarietyList = [];
        $scope.AllCombinationlist = [];
        $scope.iwolist = [];
        $scope.AllRawMaterialAndCombination = [];
        //$scope.ConfirmationMessageForAdmin = false;
        //ScreenLock();
        //GetConfirmationMessageForAdmin();
        GetInternalOrderDetailData();
        $('#ProductionDate').val("");
    }

    function GetConfirmationMessageForAdmin() {
        $http({
            url: '/InternalWorkOrder/GetConfirmationMessageForAdmin',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ConfirmationMessageForAdmin = (data === 'true');
        });
    }

    function GetAllStore() {
        $http({
            url: '/User/GetUserStoreByUserId?userId=' + $scope.LoginUser.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (userOutletList) {
            $scope.Storelist = userOutletList;
            if ($scope.Storelist.length == 1) {
                $scope.ddlStore = { 'DepartmentId': $scope.Storelist[0].DepartmentId };
                $scope.Production.DepartmentId = $scope.Storelist[0].DepartmentId;
                $scope.Production.DepartmentName = $scope.Storelist[0].DepartmentName;
            }
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

    function GetInternalOrderDetailData() {
        //var criteria = "IsApproved=1 AND ([InternalWorkOrderId] NOT IN (SELECT [InternalWorkOrderId] FROM pro_Production)) AND ([InternalWorkOrderId] IN (SELECT DISTINCT [InternalWorkOrderId] FROM inv_Requisition R WHERE RequisitionId IN (SELECT RequisitionId FROM inv_StockIssue WHERE RequisitionId=R.RequisitionId))) AND (SELECT COUNT(*) FROM inv_InternalWorkOrderDetail D WHERE D.InternalWorkOrderId=IWO.InternalWorkOrderId AND D.ItemId>0)>0";
        //var criteria = "IsApproved=1 AND ([InternalWorkOrderId] NOT IN (SELECT [InternalWorkOrderId] FROM pro_Production)) AND ([InternalWorkOrderId] IN (SELECT DISTINCT [InternalWorkOrderId] FROM inv_Requisition R WHERE RequisitionId IN (SELECT RequisitionId FROM inv_StockIssue WHERE RequisitionId=R.RequisitionId))) AND (SELECT COUNT(*) FROM inv_InternalWorkOrderDetail D INNER JOIN ad_Item I ON D.FinishedItemId = I.ItemId INNER JOIN ad_ItemSubCategory SC ON I.SubCategoryId = SC.SubCategoryId WHERE D.InternalWorkOrderId=IWO.InternalWorkOrderId AND D.ItemId>0 AND SC.CategoryId <> 2)>0";
        $http({
            url: "/InternalWorkOrder/inv_InternalWorkOrder_ForProduction",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                angular.forEach(data, function (aIwo) {
                    var res1 = aIwo.InternalWorkOrderDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aIwo.InternalWorkOrderDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aIwo.InternalWorkOrderDate = date1;
                    }
                })
            }
            $scope.iwolist = data;
        });
    }

    function GetByCombinationLike() {
        $http({
            url: '/Item/GetByCombinationLike',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            var jsonData = JSON.parse(data);
            $scope.AllRawMaterialAndCombination = Enumerable.From(JSON.parse(data))
                                                  //.Distinct("$.ItemName")
                                                 // .Where("$.CategoryName =='Finished Goods'")
                                                  .OrderBy("$.ItemName")
                                                  .ToArray();
        })
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

    function GetAllVariety() {
        $http({
            url: "/Item/GetLimitedProperty",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.VarietyList = data;
        });
    }

    function GetMaxProductionNo() {
        var date = $('#ProductionDate').val();
        if (date != "") {
            $http({
                url: '/Production/GetMaxProductionNo?deliveryDate=' + date,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.found = false;
                $scope.Production.ProductionNo = parseInt(data);
            });
        } else {
            $('#ProductionDate').focus();
        }
    }

    ////Duplicacy check start

    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('InternalWorkOrderScreenId');
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

    function ScreenLock() {
        $http({
            url: '/Permission/CheckScreenLock',
            method: 'GET',
            params: { userId: $scope.UserId, screenId: $scope.ScreenId },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data != '') {
                $scope.ScreenLockInfo = data;
                alertify.alert('This page is locked by ' + $scope.ScreenLockInfo[0].Username);
                window.location = '/Home/Index#/Home';
            }
            else {
                $scope.s_ScreenLock = new Object();
                $scope.s_ScreenLock.UserId = $scope.UserId;
                $scope.s_ScreenLock.ScreenId = $scope.ScreenId;
                var parms = JSON.stringify({ screenLock: $scope.s_ScreenLock });
                $http.post('/Permission/CreateScreenLock', parms).success(function (data) {
                });
            }
        });
    }

    function ValidProuductionQty(productionDetail) {
        if (angular.isUndefined(productionDetail.ProductionQuantity) || productionDetail.ProductionQuantity == null || productionDetail.ProductionQuantity <= 0) {
            return false;
        }
        var percentAmount = 10;
        var productionTenPrcntAmount = ((parseFloat(productionDetail.ProductionQtyForValidation) * percentAmount) / 100);
        var withTenPercentShort = ((parseFloat(productionDetail.ProductionQtyForValidation) - productionTenPrcntAmount));

        if (productionDetail.ProductionQuantity < withTenPercentShort) {
            productionDetail.ProductionQuantity = productionDetail.ProductionQtyForValidation;;
            return false;
        }
        var withTenPercentExtra = ((parseFloat(productionDetail.ProductionQtyForValidation) + productionTenPrcntAmount));

        if (productionDetail.ProductionQuantity > withTenPercentExtra) {
            productionDetail.ProductionQuantity = productionDetail.ProductionQtyForValidation;;
            return false;
        }
        return true;
    }

    $scope.getInternalWorkOrderDetails = function (iwo) {
        $http({
            url: "/InternalWorkOrder/GetInternalWorkOrderDetailByInternalWorkOrderIdForProduction?internalWorkId=" + iwo.InternalWorkOrderId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            console.log(data);
            $scope.Production.InternalWorkOrderId = iwo.InternalWorkOrderId;
            $scope.ProductionDetailList = [];
            angular.forEach(data, function (adata) {
                var FinishedItem = Enumerable.From($scope.AllCombinationlist).Where('$.ItemId==' + adata.FinishedItemId).FirstOrDefault();
                var RawMaterialItem = Enumerable.From($scope.AllRawMaterialAndCombination).Where('$.ItemId==' + adata.ItemId).FirstOrDefault();

                if (!angular.isUndefined(RawMaterialItem)) {
                    var ProductionDetail = {
                        FinishedItemName: FinishedItem.Combination,
                        QtyPerRoll: adata.QtyPerRoll,
                        RawMaterialItemName: RawMaterialItem.Combination,
                        RawMaterialItemBarcode: RawMaterialItem.Barcode,
                        ItemId: adata.FinishedItemId,
                        Core: adata.Core,
                        UsedRoll: 0,
                        UsedRollMeter: 0,
                        UnitCost: adata.UnitCost,
                        Wastage: 0,
                        WastageRemarks: "",
                        ProductionQuantity: adata.OrderQty,
                        ProductionQtyForValidation: adata.OrderQty,
                        InternalWorkOrderId: adata.InternalWorkOrderId,
                        InternalWorkOrderDetailId: adata.InternalWorkOrderDetailId,
                        ProductionDetailId: 0,
                        ProductionId: 0
                    }
                    $scope.ProductionDetailList.push(ProductionDetail);
                }
            });
        });
    }

    $scope.resetForm = function () {
        Clear();
        $scope.productionEntryForm.$setPristine();
        $scope.productionEntryForm.$setUntouched();
    }

    $scope.getMaxProductionNo = function () {
        GetMaxProductionNo();
    }

    $scope.CheckValidProductionQty = function (productionDetail) {
        if (angular.isUndefined(productionDetail.ProductionQuantity) || productionDetail.ProductionQuantity == null || productionDetail.ProductionQuantity <= 0) {
            productionDetail.ProductionQuantity = productionDetail.ProductionQtyForValidation;
            alertify.log("Production Qty Can Not be </br><strong style='color:yellow;'>Less Than Or Equal Zero And Blank</strong>.", "error", "5000");
            return;
        }
        var percentAmount = 10;
        var productionTenPrcntAmount = ((parseFloat(productionDetail.ProductionQtyForValidation) * percentAmount) / 100);
        var withTenPercentExtra = ((parseFloat(productionDetail.ProductionQtyForValidation) + productionTenPrcntAmount));
        var withTenPercentShort = ((parseFloat(productionDetail.ProductionQtyForValidation) - productionTenPrcntAmount));

        if (productionDetail.ProductionQuantity < withTenPercentShort) {
            var con = confirm("Production Qty Allow Only " + percentAmount + "% Shortage. But Your Qty Seems Shortage More Than 10%. Are you sure to save?");

            if (!con) {
                var prodDetailObjt = Enumerable.From($scope.ProductionDetailList).Where("$.InternalWorkOrderDetailId==" + productionDetail.InternalWorkOrderDetailId).FirstOrDefault();
                prodDetailObjt.ProductionQuantity = prodDetailObjt.ProductionQtyForValidation;
            }
            //alertify.confirm("Production Qty Allow Only <strong> " + percentAmount + "% Shortage</strong>. </br>But Your Qty Seems Shortage More Than 10%.<br/>Are you sure to save?", function (e) {
            //    if (e) {
            //        var prodDetailObjt = Enumerable.From($scope.ProductionDetailList).Where("$.InternalWorkOrderDetailId==" + productionDetail.InternalWorkOrderDetailId).FirstOrDefault();
            //        prodDetailObjt.ProductionQuantity = productionDetail.ProductionQuantity;
            //    } else {                    
            //        productionDetail.ProductionQuantity = prodDetailObjt.ProductionQuantityForValidation;
            //    }
            //});

            return;
        }
        if (productionDetail.ProductionQuantity > withTenPercentExtra) {
            var con = confirm("Production Qty Allow Only " + percentAmount + "% Extra Production. But Your Qty Seems Extra Production More Than 10%. Are you sure to save?");

            if (!con) {
                var prodDetailObjt = Enumerable.From($scope.ProductionDetailList).Where("$.InternalWorkOrderDetailId==" + productionDetail.InternalWorkOrderDetailId).FirstOrDefault();
                prodDetailObjt.ProductionQuantity = prodDetailObjt.ProductionQtyForValidation;
                return;
            }
            //alertify.confirm("Production Qty Allow Only<strong> " + percentAmount + "% Extra Production</strong>. </br>But Your Qty Seems Extra Production More Than 10%.<br/>Are you sure to save?", function (e) {
            //    if (e) {
            //        productionDetail.ProductionQuantity = productionDetail.ProductionQuantity;
            //    } else {
            //        var prodDetailObjt = Enumerable.From($scope.ProductionDetailList).Where("$.InternalWorkOrderDetailId==" + productionDetail.InternalWorkOrderDetailId).FirstOrDefault();
            //        prodDetailObjt.ProductionQuantity = prodDetailObjt.ProductionQuantityForValidation;
            //    }
            //});

        }
    }

    $scope.ConvertRollToMeter = function (productionDetail) {
        if (!angular.isUndefined(productionDetail.UsedRoll) && productionDetail.UsedRoll > 0) {
            productionDetail.UsedRollMeter = (parseFloat(productionDetail.UsedRoll) * 1000);
        } else {
            productionDetail.UsedRoll = 0;
            productionDetail.UsedRollMeter = 0;
        }
    }

    $scope.ConvertMeterToRoll = function (productionDetail) {
        if (!angular.isUndefined(productionDetail.UsedRollMeter) && productionDetail.UsedRollMeter > 0) {
            productionDetail.UsedRoll = (parseFloat(productionDetail.UsedRollMeter) / 1000);
        } else {
            productionDetail.UsedRoll = 0;
            productionDetail.UsedRollMeter = 0;
        }
    }

    $scope.CheckDuplicateProductionNo = function () {
        var date = $("#ProductionDate").val();
        if (date == "") {
            $("#ProductionDate").focus();
            alertify.log('Please select date.', 'error', '5000');
            return;
        }
        if ($scope.Production.ProductionNo == "" || angular.isUndefined($scope.Production.ProductionNo) || $scope.Production.ProductionNo == null) {
            GetMaxProductionNo();
        } else {
            $http({
                url: '/Production/CheckDuplicateProductionNo?ProductionNo=' + $scope.Production.ProductionNo + "&date=" + date,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                if (data.length > 0) {
                    $scope.found = true;
                    alertify.log("Production No. " + $scope.Production.ProductionNo + ' already exists!', 'error', '3000');
                    $scope.Production.ProductionNo = "";
                    $('#ProductionNo').focus();
                } else {
                    $scope.found = false;
                }
            });
        }
    }

    $scope.saveProduction = function () {
        if ($scope.found) {
            $('#ProductionNo').focus();
            alertify.log("Please Provide a Production No.", "error", "5000");
            return;
        }

        var deliveryDate = $('#ProductionDate').val();
        var Production = $scope.Production;

        if (deliveryDate == "" || !Production.ProductionNo || !Production.ProductionNo || !ddlPreparedBy) {
            alertify.log('Please fill all required field in master section!', 'error', '5000');
            return;
        }

        var isValidForSave = true;

        var productionDetail = $scope.ProductionDetailList;

        for (var i = 0; i < productionDetail.length; i++) {
            if (productionDetail[i].UsedRoll < 0 || !ValidProuductionQty(productionDetail[i]) || productionDetail[i].UsedRoll <= 0 || productionDetail[i].UsedRollMeter <= 0) {
                isValidForSave = false;
                break;
            }
        }

        if (!isValidForSave) {
            alertify.log('Please fill all required field in details section!', 'error', '5000');
            return;
        }

        //var productionDetailList = [];
        //for (var i = 0; i < productionDetail.length; i++) {

        //    var pDetails = {
        //        ProductionDetailId: 0,
        //        ProductionId: 0,
        //        ItemAddAttId: productionDetail[i].ItemAddAttId,
        //        UsedRoll: productionDetail[i].UsedRoll,
        //        ProductionQuantity: productionDetail[i].ProductionQty,
        //        UnitCost: productionDetail[i].UnitCost
        //    }
        //    productionDetailList.push(pDetails);
        //}

        angular.forEach($scope.ProductionDetailList, function (aProDtl) {
            aProDtl.ItemAddAttId = aProDtl.InternalWorkOrderDetailId;
        });

        $scope.Production.PreparedById = $scope.ddlPreparedBy.EmployeeId;
        $scope.Production.CreatorId = $scope.LoginUser.UserId;
        $scope.Production.UpdatorId = $scope.LoginUser.UserId;
        var date = $('#ProductionDate').val().split("/");
        var f = new Date(date[2], date[1] - 1, date[0]);

        alertify.confirm("Are you sure to save ?", function (e) {
            if (e) {
                $scope.Production.ProductionDate = f;
                $.ajax({
                    url: "/Production/Save",
                    contentType: "application/json;charset=utf-8",
                    type: "POST",
                    data: JSON.stringify({ pro_Production: $scope.Production, pro_ProductionDetailList: $scope.ProductionDetailList }),
                    success: function (data) {
                        if (data > 0) {

                            alertify.log('Production Saved Successfully!', 'success', '5000');
                            Clear();
                            $scope.productionEntryForm.$setPristine();
                            $scope.productionEntryForm.$setUntouched();
                        }
                    }, error: function (msg) {
                        alertify.log('Server Save Errors!', 'error', '10000');
                    }
                });
            }
        });
    }
});