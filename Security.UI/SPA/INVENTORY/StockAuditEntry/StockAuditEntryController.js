app.controller("StockAuditEntryController", function ($scope, $cookieStore, $http, $filter) {

    //---scope property start---//
    $scope.message = "ewrrwer!333";
    //$scope.Debug = true;
    //---scope property End---//


    //---Function Call Start---//
    Clear();

    //---Function Call End---//







    //--scope function call Start--//

    $scope.unitFilter = function (RawItem) {
        if (RawItem) {
            return function (pram) {
                return (pram.ItemUnitId == RawItem.UnitId) || (pram.ItemUnitId == RawItem.PackageId) || (pram.ItemUnitId == RawItem.ContainerId);
            };
        } else {
            return null;
        }
    };
    $scope.AddDetail = function () {
        if ($scope.DetailAddBtn == "Add") {
            var valid = true;
            angular.forEach($scope.inv_StockAuditDetailList, function (aData) {
                if (aData.ItemId == $scope.inv_StockAuditDetail.ItemId)
                    valid = false;
            });
            if (valid) {
                $scope.inv_StockAuditDetailList.push($scope.inv_StockAuditDetail);
            } else {
                alertify.log($scope.inv_StockAuditDetail.ItemName + ' is already exists!', 'error', '5000');
            }
            ClearStockAuditDetail();
        } else {
            ClearStockAuditDetail();
        }
    };
    $scope.SelDetail = function (aStockAuditDetail, index) {
        //alert(345);
        $scope.inv_StockAuditDetail = aStockAuditDetail;
        $scope.ddlProduct = { "ItemId": aStockAuditDetail.ItemId, "ItemName": aStockAuditDetail.ItemName, "ItemCode": aStockAuditDetail.ItemCode, "UnitId": aStockAuditDetail.UnitId, "PackageId": aStockAuditDetail.PackageId, "ContainerId": aStockAuditDetail.ContainerId };
        $scope.ddlUnit = { "ItemUnitId": aStockAuditDetail.AuditUnitId, "UnitName": aStockAuditDetail.AuditUnitName };
        $scope.ddlStockAuditGroup = { "AuditGroupId": aStockAuditDetail.AuditGroupId };
        $scope.ddlStockAuditType = { "AuditTypeId": aStockAuditDetail.AuditTypeId, "AuditTypeName": aStockAuditDetail.AuditTypeName };
        $scope.DetailAddBtn = "Change";
        $scope.RemoveBtnShow = true;
        $scope.DetailRowIndex = index;
        $scope.DetailAddBtnDisabled = false;
    };
    $scope.RemoveDetail = function () {
        $scope.inv_StockAuditDetailList.splice($scope.DetailRowIndex, 1);
        ClearStockAuditDetail();
    };
    $scope.AddStockAudit = function () {
        var erroMsg = [];
        // var flg = true;
        if ($scope.inv_StockAuditDetailList.length < 1) {
            erroMsg.push({
                msg: "Please Add Product"
            });
        }
        if (!erroMsg.length) {
            var from = $("#txtAuditDate").val().split("/");
            var f = new Date(from[2], from[1] - 1, from[0]);
            $scope.inv_StockAudit.AuditDate = f;
            //Save
            var parms = JSON.stringify({ inv_StockAudit: $scope.inv_StockAudit });
            $http.post('/StockAudit/SaveStockAudit', parms).success(function (AuditId) {
                if (AuditId > 0) {
                    SaveDetails(AuditId);
                    Clear();
                    $scope.stockAuditEntryForm.$setPristine();
                    $scope.stockAuditEntryForm.$setUntouched();
                    alertify.log('Stock Audit Saved Successfully!', 'success', '5000');
                }
            }).error(function (data) {
                alertify.log('Server Save Errors!', 'error', '5000');
            });
        } else {
            //error
            angular.forEach(erroMsg, function (aErroMsg) {
                alertify.log(aErroMsg.msg, 'error', '5000');
            });
        }
    };
    $scope.resetForm = function () {
        Clear();

        $scope.stockAuditEntryForm.$setPristine();
        $scope.stockAuditEntryForm.$setUntouched();
        
    };
    $scope.AddDetailValidationChk = function (inv_StockAuditDetail) {
        if (inv_StockAuditDetail.ItemId && inv_StockAuditDetail.AuditQuantity && inv_StockAuditDetail.SettleQuantity && inv_StockAuditDetail.AuditUnitId && inv_StockAuditDetail.AuditGroupId && inv_StockAuditDetail.AuditTypeId ) {
            $scope.DetailAddBtnDisabled = false;
        } else {
            $scope.DetailAddBtnDisabled = true;
        }
    };
    //scope function call End//
    //---Function Body Start---//
    function Clear() {
        $scope.inv_StockAudit = {};
        $scope.inv_StockAuditDetailList = [];
        $scope.ddlEmployee = null;
        $scope.ddlStore = null;
        $scope.ddlUnit = null;
        $scope.ddlProduct = null;
        $scope.ddlStockAuditGroup = null;
        $scope.ddlStockAuditType = null;
        GetAllStore();
        GetAllEmployee();
        GetAllProduct();
        GetAllItemUnit();
        GetAllStockAuditGroup();
        GetAllStockAuditType();
        $scope.UserData = $cookieStore.get('UserData');
        $scope.ddlAuditBy = { "EmployeeId": 27 };
        ClearStockAuditDetail();
    }
    function ClearStockAuditDetail() {
        $scope.inv_StockAuditDetail = {};
        $scope.ddlProduct = {};
        $scope.ddlUnit = {};
        $scope.ddlStockAuditGroup = {};
        $scope.ddlStockAuditType = {};
        $scope.DetailAddBtn = "Add";
        $scope.RemoveBtnShow = false;
        $scope.DetailRowIndex = '';
        $scope.DetailAddBtnDisabled = true;
    };
    function SaveDetails(AuditId) {
        angular.forEach($scope.inv_StockAuditDetailList, function (aStockAuditDetail) {
            var parms = JSON.stringify({ inv_StockAuditDetail : aStockAuditDetail, AuditId: AuditId });
            $http.post('/StockAudit/SaveStockAuditDetail', parms).success(function (data) {
               //----------------more detail data -----------------------//
            }).error(function (data) {
                alertify.log('Server Errors!', 'error', '5000');
            });
        });
    }
    //---Load List Method strat---//
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
            $scope.EmployeeList = data;
        });
    }
    function GetAllStore() {
        $http({
            url: '/ReorderLevelSetup/GetAllStore',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Storelist = data;
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
    function GetAllStockAuditGroup() {
        $http({
            url: '/StockAudit/GetAllStockAuditGroup',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.StockAuditGroupList = data;
        });
    }
    function GetAllStockAuditType() {
        $http({
            url: '/StockAudit/GetAllStockAuditType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.StockAuditTypeList = data;
        });
    }
    //---Load List Method End---//
    //---Function Body End---//
});