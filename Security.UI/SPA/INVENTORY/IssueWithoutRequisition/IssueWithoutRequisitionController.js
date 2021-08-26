app.controller("IssueWithoutRequisitionController", function ($scope, $cookieStore, $http, $filter) {
    $scope.LoginUser = $cookieStore.get('UserData');

    Clear();

    function Clear() {
        $scope.inv_StockIssue = {};
        $scope.inv_StockIssue.IssueId = 0;
        $scope.ConfirmationMessageForAdmin = false;
        $scope.ItemSearchResultList = [];
        $scope.Storelist = [];
        $scope.DepartmentList = [];
        $scope.VarietyList = [];
        $scope.employeeList = [];
        $scope.inv_PurchaseBill = [];
        $scope.SingleIssuelist = [];
        $scope._inv_StockIssueDetailAdAttribute = [];
        $scope._inv_StockIssueDetailAdAttributeDetail = [];
        $scope.ddlStore = null;
        $scope.btnSave = "Save";
        $scope.found = false;
        // GetByCombinationLike();
        GetAllEmployee();
        GetIsApprove();
        GetUnit();
        GetConfirmationMessageForAdmin();
        GetAllStore();
        GetAllDepartment();
        DetailClear();
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

    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.employeeList = data;
            $scope.ddlIssueeBy = { "EmployeeId": $scope.LoginUser.EmployeeId };
            $scope.inv_StockIssue.IssuedById = data[0].EmployeeId;
            $scope.inv_StockIssue.IssuedBy = data[0].FullName;
        });
    }

    function GetIsApprove() {
        $scope.HasApproval = false;
        $scope.ScreenId = $cookieStore.get('StockIssueWithoutRequisitionScreenId');
        $http({
            url: '/Approval/GetByScreenId?screenId=' + $scope.ScreenId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.HasApproval = data.IsRequired;
        })
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

    function GetAllStore() {
        $http({
            url: '/User/GetUserStoreByUserId?userId=' + $scope.LoginUser.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (userOutletList) {
            $scope.Storelist = userOutletList;
            if ($scope.Storelist.length == 1) {
                $scope.ddlStore = { 'DepartmentId': $scope.Storelist[0].DepartmentId };
                $scope.inv_StockIssue.IssueFromDepartmentId = $scope.Storelist[0].DepartmentId;
                $scope.inv_StockIssue.IssueFromDepartmentName = $scope.Storelist[0].DepartmentName;
                GetByCombinationandDepertment();
            }
        });
    }

    function GetAllDepartment() {
        $http({
            url: '/Department/GetAllStore',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DepartmentList = data;
        });
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

    function DetailClear() {
        $scope.inv_StockIssueDetail = {};
        $("#txtItemCode").removeAttr("disabled");
        $("#txtVariety").removeAttr("disabled");
        $scope.ItemCode = '';
        $scope.Product = '';
        $scope.ddlUnit = null;
        $scope.RemoveBtnShow = false;
        $scope.buttonAddIssue = "Add";
        GetAllVariety();
    }

    function GetMaxIssueNo() {
        var date = $("#txtIssueDate").val();
        if (date != "") {
            $http({
                url: '/IssueWithoutRequisition/GetMaxIssueNoWithoutReqByDate?issueDate=' + date,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.inv_StockIssue.IssueNo = parseInt(data);
            });
        } else {
            $("#txtIssueDate").focus();
        }

    }

    function SumAttQty() {
        angular.forEach($scope._inv_StockIssueDetailAdAttribute, function (aDetailAdAttribute) {
            if (aDetailAdAttribute.AttributeQty < 1 || aDetailAdAttribute.AttributeQty == undefined || aDetailAdAttribute.AttributeQty == null) { aDetailAdAttribute.AttributeQty = 1; }
        });
        angular.forEach($scope.SingleIssuelist, function (aStockReceiveDetail) {
            aStockReceiveDetail.IssueUnitId = 1;
            aStockReceiveDetail.IssueUnitName = "Pcs";
            aStockReceiveDetail.IssueQuantity = Enumerable.From($scope._inv_StockIssueDetailAdAttribute).Where("$.ItemId == '" + aStockReceiveDetail.ItemId + "'").Sum('$.AttributeQty');
        });
        $scope.SingleIssuelist = Enumerable.From($scope.SingleIssuelist).Where("$.IssueQuantity != 0").ToArray();
    }

    function GetByCombinationandDepertment() {
        if ($scope.ddlStore) {
            $http({
                url: '/Item/GetByDepartmentAndCombinationLike?departmentId=' + $scope.ddlStore.DepartmentId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.AllCombinationlist =JSON.parse(data);
                console.log($scope.AllCombinationlist);

                
                //if ($scope.AllCombinationlist.length) {
                //    $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).Take(7).ToArray();
                //}
                
            })
        }
        else {
            $scope.ItemSearchCombination = null;
        }
    }

    $scope.getMaxIssWithoutReqNoByDate = function () {
        GetMaxIssueNo();
    };

    $scope.GetByCombinationLike = function () {
        $scope.SingleIssuelist = [];
        $scope._inv_StockIssueDetailAdAttribute = [];
        GetByCombinationandDepertment();
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
            $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).Where(SearchCriteria).Take(7).ToArray();
            $scope.VisibilityOfSuggession = true;
        }
        else {
            $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).Take(7).ToArray();
            $scope.VisibilityOfSuggession = false;
        }
    }

    $scope.LoadACombination = function (aCombination) {
        $scope.ItemCombination = aCombination;
        $scope.VisibilityOfSuggession = false;
        $scope.ItemSearchCombination = $scope.ItemCombination.Combination;
        $scope.AllCombinationSearch = [];
        $('#txtIssueQty').focus();
    }

    $scope.RemoveItemAttr = function (aAttribute) {
        var ind = $scope._inv_StockIssueDetailAdAttribute.indexOf(aAttribute);
        $scope._inv_StockIssueDetailAdAttribute.splice(ind, 1);
        SumAttQty();
    }

    $scope.AddIssueDetail = function () {
        var flag = true;
        angular.forEach($scope._inv_StockIssueDetailAdAttribute, function (aDetailAdAttribute) {
            if (aDetailAdAttribute.Barcode == $scope.ItemCombination.Barcode) {
                flag = false;
            }
        });
        if (flag) {
            console.log($scope.ItemCombination);
            var ValueOfAttribute = [];
            //var a = $scope.ItemCombination.AttributeNames.split(',');
            //for (var i = 0; i < a.length; i++) {
            //    var val = a[i].split(':');
            //    ValueOfAttribute.push(val[1].trim());
            //}
            //$scope.ItemCombination.ValueOfAttribute = ValueOfAttribute;
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
                //Item.HeaderOfAttribute = HeaderOfAttribute;
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

    $scope.CheckDuplicateIssueNo = function () {
        var date = $("#txtIssueDate").val();
        if (date == "") {
            $("#txtIssueDate").focus();
            alertify.log('Please select date.', 'error', '5000');
            return;
        }
        if ($scope.inv_StockIssue.IssueNo == "" || angular.isUndefined($scope.inv_StockIssue.IssueNo) || $scope.inv_StockIssue.IssueNo == null) {
            GetMaxIssueNo();
        } else {
            $http({
                url: '/Issue/CheckDuplicateIssueNo?IssueNo=' + $scope.inv_StockIssue.IssueNo + "&date=" + date,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                if (data.length > 0) {
                    $scope.found = true;
                    alertify.log("Issue No. " + $scope.inv_StockIssue.IssueNo + ' already exists!', 'error', '3000');
                    $scope.inv_StockIssue.IssueNo = "";
                    $('#txtIssueNo').focus();
                } else {
                    $scope.found = false;
                }
            });
        }
    }

    $scope.foundChange = function () {
        $scope.found = true;
    }

    $scope.CheckItemQuantity = function (CurrentQuantity, AttributeQty) {
        if (CurrentQuantity < AttributeQty) {
            alertify.log('Attribute Qty must not be greater then CurrentQuantity', 'error', '10000');
            return CurrentQuantity;
        }
        else {
            return AttributeQty;
        }
    }

    $scope.SumAttQty = function () {
        SumAttQty();
    }

    $scope.SaveIssueWithoutRequisition = function () {
        var erroMsg = [];
        if ($scope.inv_StockIssue.ReceivedById == undefined || $scope.inv_StockIssue.ReceivedById == null) {
            alertify.log('Select Reference Name', 'error', '5000');
            return;
        }
        angular.forEach($scope.SingleIssuelist, function (aItem) {
            if (Enumerable.From($scope._inv_StockIssueDetailAdAttribute).Where("$.ItemId == '" + aItem.ItemId + "'").ToArray().length) {
                if (aItem.IssueQuantity != Enumerable.From($scope._inv_StockIssueDetailAdAttribute).Where("$.ItemId == '" + aItem.ItemId + "'").Sum('$.AttributeQty')) {
                    erroMsg.push({ msg: aItem.ItemName + ' attribute Quantity not same as Total Issue Quantity' });
                }
            }
        });

        if (erroMsg.length > 0) {
            angular.forEach(erroMsg, function (aErroMsg) {
                alertify.log(aErroMsg.msg, 'error', '5000');
            });
        }
        else {
            $scope.inv_StockIssue.CreatorId = $scope.LoginUser.UserId;
            $scope.inv_StockIssue.UpdatorId = $scope.LoginUser.UserId;
            $scope.inv_StockIssue.IsApproved = $scope.HasApproval ? false : true;
            var a = $scope.inv_StockIssue.IssueDate;

            var from = a.split("/");
            var f = new Date(from[2], from[1] - 1, from[0]);

            if ($scope.btnSave == "Save") {
                alertify.confirm("Are you sure to save ?", function (e) {
                    if (e) {
                        $scope.inv_StockIssue.IssueDate = f;
                        var parms = JSON.stringify({ stockIssue: $scope.inv_StockIssue, issueDetailLst: $scope.SingleIssuelist, inv_StockIssueDetailAdAttributeLst: $scope._inv_StockIssueDetailAdAttribute });
                        $http.post('/IssueWithoutRequisition/SaveIssueWithoutReq', parms).success(function (data) {
                            if (data > 0) {
                                Clear();
                                alertify.log('Issue saved successfully!', 'success', '5000');
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

    $scope.resetForm = function () {
        Clear();
    }

    $scope.unitFilter = function (item) {
        return function (pram) {
            return (pram.ItemUnitId == RawItem.UnitId) || (pram.ItemUnitId == RawItem.PackageId) || (pram.ItemUnitId == RawItem.ContainerId);
        };
    }
});