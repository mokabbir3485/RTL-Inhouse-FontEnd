app.controller("IssueEntryController", function ($scope, $cookieStore, $http, $filter) {
    $scope.LoginUser = $cookieStore.get('UserData');

    Clear();

    function Clear() {
        $scope.ScreenId = $cookieStore.get('StockIssueScreenId');
        $scope.FromScreenId = $cookieStore.get('StockIssueScreenId');
        $scope.EmployeeList = [];
        $scope.TopForIssueList = [];
        $scope.TopForIssue = [];
        $scope.Storelist = [];
        $scope.DepartmentList = [];
        $scope.VarietyList = [];
        $scope.copy_IssueDetailList = [];
        $scope._inv_StockIssueDetailAdAttribute = [];
        $scope._inv_StockIssueDetail = [];
        $scope.SingleIssuelist = [];
        $scope.ItemAdvanceSearch = false;
        $scope.HasApprovalForIssue = false;
        GetIsApproveForIssue();
        GetAllDepartment();
        GetAllStore();
        GetAllEmployee();
        $scope.inv_StockIssue = new Object;
        $scope.ddlReceivedBy = null;
        GetTopForIsshu(100);
        GetAllVariety();
        $scope.showTable = true;
        $scope.IsRequesition = true;
        $scope.buttonAddIssue = "Add";
        $scope.btnSave = 'Save';
    }

    $scope.RemoveItemAttr = function (aAttribute) {
        var ind = $scope._inv_StockIssueDetailAdAttribute.indexOf(aAttribute);
        $scope._inv_StockIssueDetailAdAttribute.splice(ind, 1);
        SumAttQty();
    }

    function SumAttQty() {
        angular.forEach($scope._inv_StockIssueDetailAdAttribute, function (aDetailAdAttribute) {
            if (aDetailAdAttribute.IssueQuantity < 0.01 || aDetailAdAttribute.IssueQuantity == undefined || aDetailAdAttribute.IssueQuantity == null) {
                aDetailAdAttribute.IssueQuantity = 0.01;
            }
            else if (aDetailAdAttribute.IssueQuantity > aDetailAdAttribute.RequisitionQuantity) {
                //Message: Cannot Issue more than Stock Qty
                aDetailAdAttribute.IssueQuantity = aDetailAdAttribute.RequisitionQuantity;
            }
        });
        angular.forEach($scope.SingleIssuelist, function (aIssueDetail) {
            aIssueDetail.IssueUnitId = 1;
            aIssueDetail.IssueUnitName = "Pcs";
            aIssueDetail.IssueQuantity = Enumerable.From($scope._inv_StockIssueDetailAdAttribute).Where("$.ItemId == '" + aIssueDetail.ItemId + "'").Sum('$.IssueQuantity');
        });
        //$scope.SingleIssuelist = Enumerable.From($scope.SingleIssuelist).Where("$.IssueQuantity != 0").ToArray();
    }

    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.EmployeeList = data;
            $scope.ddlIssuedBy = { EmployeeId: $scope.LoginUser.EmployeeId };
            $scope.inv_StockIssue.IssuedById = $scope.LoginUser.EmployeeId;
            $scope.inv_StockIssue.IssuedBy = $scope.LoginUser.FullName;
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

    function GetAllDepartment() {
        $http({
            url: '/Department/GetAllDepartment',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.DepartmentList = data;
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

    function GetTopForIsshu(topQty) {
        $http({
            url: '/Requisition/GetTopRequisitionForIssue?topQty=' + topQty,
            method: 'GET',
            headers: { 'content-Type': 'application/json' }
        }).success(function (issueList) {
            angular.forEach(issueList, function (aData) {
                var res = aData.RequisitionDate.substring(0, 5);
                if (res == "/Date") {
                    var parsedDate = new Date(parseInt(aData.RequisitionDate.substr(6)));
                    aData.RequisitionDate = $filter('date')(parsedDate, 'dd-MMM-yyyy');
                }
            });
            $scope.TopForIssueList = issueList;
        })
    }

    function GetByCombinationandDepertment() {
        if ($scope.ddlDepartment) {
            $http({
                url: '/Item/GetByDepartmentAndCombinationLike?departmentId=' + $scope.ddlDepartment.DepartmentId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.AllCombinationlist = JSON.parse(data);
                /*
                if ($scope.AllCombinationlist.length) {
                    $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).Take(7).ToArray();
                }
                */
            })
        }
        else {
            $scope.ItemSearchCombination = null;
        }
    }

    function GetMaxIssueNo() {
        var date = $("#txtIssueDate").val();
        if (date != "") {
            $http({
                url: '/Issue/GetMaxIssueNoByDate?issueDate=' + date,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.inv_StockIssue.IssueNo = parseInt(data);
            });
        } else {
            $("#txtIssueDate").focus();
        }
    }


    $scope.getMaxIsseByDate = function () {
        GetMaxIssueNo();
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

            $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).Where(SearchCriteria).Take(7).ToArray();
            $scope.VisibilityOfSuggession = true;
        }
        else {
            $scope.AllCombinationSearch = Enumerable.From($scope.AllCombinationlist).Take(7).ToArray();
            $scope.VisibilityOfSuggession = false;
        }
    }

    $scope.GetByCombinationLike = function () {
        GetByCombinationandDepertment();
    }

    $scope.LoadACombination = function (aCombination) {
        $scope.ItemCombination = aCombination;
        $scope.VisibilityOfSuggession = false;
        $scope.ItemSearchCombination = $scope.ItemCombination.Combination;
        $scope.AllCombinationSearch = [];
        $('#txtIssueQty').focus();
    }

    $scope.CellClick = function (topIssue) {
        //  $scope.LoadACombination();
        $scope.inv_StockIssue.RequisitionId = topIssue.RequisitionId;
        $scope.inv_StockIssue.RequisitionNo = topIssue.RequisitionNo;
        $scope.ddlDepartment = { "DepartmentId": topIssue.ToDepartmentId };
        $scope.inv_StockIssue.IssueFromDepartmentId = topIssue.ToDepartmentId;
        $scope.inv_StockIssue.IssueFromDepartmentName = topIssue.ToDepartmentName;
        $scope.ddlStore = { "DepartmentId": topIssue.FromDepartmentId };
        $scope.inv_StockIssue.IssueToDepartmentId = topIssue.FromDepartmentId;
        $scope.inv_StockIssue.IssueToDepartmentName = topIssue.FromDepartmentName;

        var parms = JSON.stringify({ requisitionId: topIssue.RequisitionId });
        $http.post('/Item/GetCombinationByRequisition', parms).success(function (IssueDetailList) {
            $scope.IssueDetailList = JSON.parse(IssueDetailList);
            $scope.copy_IssueDetailList = angular.copy($scope.IssueDetailList);

            $scope._inv_StockIssueDetailAdAttribute = [];
            angular.forEach($scope.copy_IssueDetailList, function (aIssue) {
                //aIssue.IssueQuantity = (aIssue.RequisitionQuantity - aIssue.IssuedQuantity) > aIssue.CurrentQuantity ? aIssue.CurrentQuantity : (aIssue.RequisitionQuantity - aIssue.IssuedQuantity);
                aIssue.IssueQuantity = aIssue.RequisitionQuantity;
                //var ValueOfAttribute = [];
                //var a = aIssue.AttributeNames.split(',');
                //for (var i = 0; i < a.length; i++) {
                //    var val = a[i].split(':');
                //    ValueOfAttribute.push(val[1].trim());
                //}
                aIssue.ValueOfAttribute = [aIssue.AttributeNames];
                $scope._inv_StockIssueDetailAdAttribute.push(aIssue);

            });

            $scope.SingleIssuelist = [];
            angular.forEach($scope.IssueDetailList, function (aIssue) {
                if (Enumerable.From($scope.SingleIssuelist).Where('$.ItemId==' + aIssue.ItemId).ToArray().length == 0) {
                    $scope.SingleIssuelist.push(aIssue);

                    console.log('SingleIssuelist',$scope.SingleIssuelist)
                }
                //var HeaderOfAttribute = [];
                //var a = aIssue.AttributeNames.split(',');
                //for (var i = 0; i < a.length; i++) {
                //    var val = a[i].split(':');
                //    HeaderOfAttribute.push(val[0].trim());
                //}
                aIssue.HeaderOfAttribute = ["Description"];

                aIssue.IssueQuantity = Enumerable.From($scope._inv_StockIssueDetailAdAttribute).Where('$.ItemId==' + aIssue.ItemId).Sum('$.IssueQuantity');;
            });
        });
    }

    $scope.SaveStockIssue = function () {
        var erroMsg = [];
        var da = $scope._inv_StockIssueDetailAdAttribute;
        var isIssueChk = 0;
        for (var i = 0; i < $scope._inv_StockIssueDetailAdAttribute.length; i++) {
            //if ($scope._inv_StockIssueDetailAdAttribute[i].CurrentQuantity < 1) {
            //    erroMsg.push({ msg: 'Stock is not available for one or more product' });
            //}
            if ($scope._inv_StockIssueDetailAdAttribute[i].IsIssued) {
                isIssueChk++;
                if ($scope._inv_StockIssueDetailAdAttribute[i].IssueQuantity <= 0) {
                    alertify.log('Please give Issue Qty for one or more product', 'error', '3000');
                    return;
                }
                if ($scope._inv_StockIssueDetailAdAttribute[i].IssueQuantity > $scope._inv_StockIssueDetailAdAttribute[i].CurrentQuantity) {
                    alertify.log('Issue quantity is greater than stock quantity', 'error', '3000');
                    return;
                }
                if ($scope._inv_StockIssueDetailAdAttribute[i].IssueQuantity > ($scope._inv_StockIssueDetailAdAttribute[i].RequisitionQuantity - $scope._inv_StockIssueDetailAdAttribute[i].IssuedQuantity)) {
                    alertify.log('Issue quantity is greater than Requisition quantity', 'error', '3000');
                    return;
                }
            }
        }
        if (isIssueChk < 1) {
            alertify.log('Please select at least one issue details', 'error', '3000');
            return;
        }

        angular.forEach($scope.SingleIssuelist, function (aItem) {
            if (Enumerable.From($scope._inv_StockIssueDetailAdAttribute).Where("$.ItemId == '" + aItem.ItemId + "'").ToArray().length) {
                if (aItem.IssueQuantity != Enumerable.From($scope._inv_StockIssueDetailAdAttribute).Where("$.ItemId == '" + aItem.ItemId + "'").Sum('$.IssueQuantity')) {
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
            angular.forEach($scope._inv_StockIssueDetailAdAttribute, function (adata) {
                if (adata.IsIssued) {
                    $scope._inv_StockIssueDetail.push(adata);
                }
            });

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
                        var parms = JSON.stringify({ stockIssue: $scope.inv_StockIssue, issueDetailLst: $scope._inv_StockIssueDetail });
                        $http.post('/Issue/SaveStockIssueConsume', parms).success(function (data) {
                            if (data > 0) {
                                Clear();
                                $scope.issueEntryForm.$setPristine();
                                $scope.issueEntryForm.$setUntouched();
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

    $scope.AddIssueDetail = function () {
        var flag = true;
        angular.forEach($scope._inv_StockIssueDetailAdAttribute, function (aDetailAdAttribute) {
            if (aDetailAdAttribute.Barcode == $scope.ItemCombination.Barcode) {
                flag = false;
            }
        });
        if (flag) {
            var ValueOfAttribute = [];
            var a = $scope.ItemCombination.AttributeNames.split(',');
            for (var i = 0; i < a.length; i++) {
                var val = a[i].split(':');
                ValueOfAttribute.push(val[1].trim());
            }
            $scope.ItemCombination.ValueOfAttribute = ValueOfAttribute;
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
                var HeaderOfAttribute = [];
                var a = $scope.ItemCombination.AttributeNames.split(',');
                for (var i = 0; i < a.length; i++) {
                    var val = a[i].split(':');
                    HeaderOfAttribute.push(val[0].trim());
                }
                Item.HeaderOfAttribute = HeaderOfAttribute;
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

    function RequesitionAdvanceSearch() {
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
                    $scope.TopForIssueList = [];
                    $http({
                        url: '/Requisition/GetRequisitionById',
                        method: 'GET',
                        params: { id: $scope.SearchId },
                        headers: { 'Content-Type': 'application/json' }
                    }).success(function (aRequesition) {
                        var res = aRequesition.RequisitionDate.substring(0, 5);
                        if (res == "/Date") {
                            var parsedDate = new Date(parseInt(aRequesition.RequisitionDate.substr(6)));
                            aRequesition.RequisitionDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
                        }
                        $scope.TopForIssueList.push(aRequesition);
                        $scope.inv_StockIssue.RequisitionId = aRequesition.RequisitionId;
                        $scope.inv_StockIssue.RequisitionNo = aRequesition.RequisitionNo;
                        $scope.inv_StockIssue.IssueFromDepartmentId = aRequesition.ToDepartmentId;
                        $scope.inv_StockIssue.IssueFromDepartmentName = aRequesition.ToDepartmentName;
                        $scope.inv_StockIssue.IssueToDepartmentId = aRequesition.FromDepartmentId;
                        $scope.inv_StockIssue.IssueToDepartmentName = aRequesition.FromDepartmentName;
                        /*
                        var parms = JSON.stringify({ id: aRequesition.RequisitionId });                        
                        $http.post('/Requisition/GetRequisitionDetailByRequisitionId', parms).success(function (issueDetail) {
                        $scope.TopForIssue = issueDetail;                        
                        });
                        */
                    })
                    $scope.btnSave = "Save";
                }

            })
        }
    }

    function GetIsApproveForIssue() {
        $http({
            url: '/Approval/GetByScreenId?screenId=' + $scope.FromScreenId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.HasApprovalForIssue = data.IsRequired;
        })
    }

    $scope.resetForm = function () {
        Clear();
        $scope.issueEntryForm.$setPristine();
        $scope.issueEntryForm.$setUntouched();
    }
});