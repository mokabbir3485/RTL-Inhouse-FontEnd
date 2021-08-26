app.controller("ReturnFromDepartmentController", function ($scope, $cookieStore, $http, $filter) {    
    $scope.SearchItem = [
        {
            ddlStore: "",
            ddlDepartment: "",
            ddlIssuedBy: "",
            ddlReceivedBy: "",
            //ddlProduct: "",
        }
    ];
    $scope.FromScreenId = $cookieStore.get('ReturnFromDepartmentScreenId');

    Clear();
    function Clear() {
        GetIsApprove();
        GetAllProduct();
        GetAllEmployee();
        GetAllDepartment();
        GetAllStore();
        GetAllReturnReasonList();
        $scope.found = false;
        $scope.inv_ReturnFromDepartment = new Object();
        $scope.DepartmentList = [];
        $scope.Storelist = [];
        $scope.EmployeeList = [];
        $scope.ItemList = [];
        $scope.IssueList = [];
        $scope.IssueListDetails = [];
        $scope.ReturnReasonList = [];
        $scope.ReturnFromDepartmentMaster = new Object();
    }
    function GetAllStore() {
        $scope.LoginUser = $cookieStore.get('UserData');
        $http({
            url: '/User/GetUserDepartmentByUserId?userId=' + $scope.LoginUser.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (userOutletList) {
            $scope.Storelist = userOutletList;
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
    function GetAllReturnReasonList() {
        $http({
            url: '/ReturnToSupplier/GetAllReturnReason',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ReturnReasonList = data;
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
    function GetAllProduct() {
        $http({
            url: "/Item/GetLimitedProperty",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.VarietyList = data;
        });
    }
    function GetVarietyDetail() {
        $scope.SearchItem.ItemId = undefined;
        $scope.SearchItem.BarCode = undefined;
        if (typeof $scope.VarietyName === 'object') {   // && $scope.VarietyName.hasOwnProperty('ItemId')) {
            $scope.SearchItem.ItemId = $scope.VarietyName.ItemId;
        }
        else {
            angular.forEach($scope.VarietyList, function (item) {
                if ($scope.VarietyName == item.ItemName) {
                    $scope.SearchItem.ItemId = item.ItemId;
                }
            });
        }
        //if ($scope.BarCode != undefined && $scope.BarCode != null && $scope.BarCode != '') {
        //    $scope.SearchItem.BarCode = $scope.BarCode;
        //}
    }

    $scope.Search = function () {
        GetVarietyDetail();
        var SearchCriteria = '1=1';
        if ($scope.inv_ReturnFromDepartment.FromDate != undefined) {
            if ($scope.inv_ReturnFromDepartment.ToDate != undefined) {
                var dateParts = $scope.inv_ReturnFromDepartment.FromDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var from = dateParts[3] + "-" + dateParts[2] + "-" + dateParts[1];
                var dateParts2 = $scope.inv_ReturnFromDepartment.ToDate.split(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
                var to = dateParts2[3] + "-" + dateParts2[2] + "-" + dateParts2[1];
                SearchCriteria += " AND [IssueDate] BETWEEN '" + from + "' AND '" + to + "'";
            }
            else {
                alertify.log("Please Enter To Date also !!!", "Error", "5000");
                return;
            }
        }
        if ($scope.inv_ReturnFromDepartment.IssueNo != undefined) {
            SearchCriteria += " AND [IssueNo]='" + $scope.inv_ReturnFromDepartment.IssueNo + "'";
        }
        if ($scope.SearchItem.ddlStore != undefined) {
            SearchCriteria += " AND [IssueFromDepartmentId]=" + $scope.SearchItem.ddlStore.DepartmentId;
        }
        if ($scope.SearchItem.ddlDepartment != undefined) {
            SearchCriteria += " AND [IssueToDepartmentId]=" + $scope.SearchItem.ddlDepartment.DepartmentId;
        }
        if ($scope.SearchItem.ddlIssuedBy != undefined) {
            SearchCriteria += " AND [IssuedById]=" + $scope.SearchItem.ddlIssuedBy.EmployeeId;
        }
        if ($scope.SearchItem.ddlReceivedBy != undefined) {
            SearchCriteria += " AND [ReceivedById]=" + $scope.SearchItem.ddlReceivedBy.EmployeeId;
        }
        //if ($scope.SearchItem.BarCode != undefined) {
        //    SearchCriteria += " AND  ((select top 1 [ItemCode] from [inv_StockIssueDetail] where [IssueId] = I.[IssueId])='" + $scope.SearchItem.BarCode + "')";
        //}
        if ($scope.SearchItem.ItemId != undefined) {
            SearchCriteria += " AND  ((select top 1 [ItemId] from [inv_StockIssueDetail] where [IssueId] = I.[IssueId])=" + $scope.SearchItem.ItemId + ")";
        }

        $http({
            url: '/Issue/GetTopIssueForReturn?whereCondition=' + SearchCriteria + "&topQty=5",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (IssueList) {
            if (IssueList.length > 0) {
                angular.forEach(IssueList, function (aData) {
                    var res = aData.IssueDate.substring(0, 5);
                    if (res == "/Date") {
                        var parsedDate = new Date(parseInt(aData.IssueDate.substr(6)));
                        aData.IssueDate = $filter('date')(parsedDate, 'dd-MMM-yyyy');
                    }
                });
                $scope.IssueList = IssueList;
                $scope.IssueListDetails = [];
            }
            else {
                $scope.IssueList = [];
                $scope.IssueListDetails = [];
                alertify.log("No Issue Found", "Error", "5000");
            }
        });
    }

    $scope.FillControll = function (aIssue) {
        GetDetail(aIssue.IssueId);
        $scope.ReturnFromDepartmentMaster = new Object();
        $scope.LoginUser = $cookieStore.get('UserData');
        $scope.ReturnFromDepartmentMaster.FromDepartmentId = aIssue.IssueToDepartmentId;
        $scope.ReturnFromDepartmentMaster.ToDepartmentId = aIssue.IssueFromDepartmentId;
        $scope.ReturnFromDepartmentMaster.IssueId = aIssue.IssueId;
        $scope.ReturnFromDepartmentMaster.IssueNo = aIssue.IssueNo;
        $scope.ReturnFromDepartmentMaster.CreatorId = $scope.LoginUser.UserId;
        $scope.ReturnFromDepartmentMaster.UpdatorId = $scope.LoginUser.UserId;
        $scope.ReturnFromDepartmentMaster.FromDepartmentName = aIssue.IssueToDepartmentName;
        $scope.ReturnFromDepartmentMaster.ToDepartmentName = aIssue.IssueFromDepartmentName;
    }
    function GetDetail(IssueId) {
        $http({
            url: '/Issue/GetIssueDetails',
            method: "GET",
            params: { IssueId: IssueId },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.IssueListDetails = data;
        });
    }

    $scope.resetForm = function () {
        Clear();
    }

    $scope.Save = function () {
        if ($scope.found) {
            $('#txtReturnNo').focus();
        }
        else {
        var erroMsg = [];
        if ($scope.IssueListDetails.length < 1) {
            erroMsg.push({
                msg: "Please Add Product"
            });
        }
        else
        {
            var itemWithQtyNotFound = true;
            var a = false;
            angular.forEach($scope.IssueListDetails, function (aIssueListDetails) {
                if (aIssueListDetails.ReturnQuantity != null && aIssueListDetails.ReturnQuantity > 0) {
                    itemWithQtyNotFound = false;
                    if ((aIssueListDetails.ReturnQuantity + aIssueListDetails.ReturnedQuantity) > aIssueListDetails.IssueQuantity) {
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
            var a = $scope.ReturnFromDepartmentMaster.ReturnDate;
            var from = a.split("/");
            var f = new Date(from[2], from[1] - 1, from[0]);
            $scope.ReturnFromDepartmentMaster.ReturnDate = f;
            var parms = JSON.stringify({ _inv_ReturnFromDepartment: $scope.ReturnFromDepartmentMaster, returnFromDepartmentDetailLst: $scope.IssueListDetails });
            $http.post('/ReturnFromDepartment/SaveReturnFromDepartment', parms).success(function (ReturnId) {
                if (ReturnId > 0) {
                    //angular.forEach($scope.IssueListDetails, function (aIssueListDetails) {
                    //    if (aIssueListDetails.ReturnQuantity > 0) {
                    //        aIssueListDetails.ReturnId = ReturnId;
                    //        var parms = JSON.stringify({ _inv_ReturnFromDepartmentDetail: aIssueListDetails });  //, returnId: ReturnId
                    //        $http.post('/ReturnFromDepartment/SaveReturnFromDepartmentDetail', parms).success(function (data) {
                    //        }).error(function (data) {
                    //            alertify.log('Server Errors!', 'error', '5000');
                    //        });
                    //    }
                    //});
                    Clear();
                    $scope.returnFromDepartmentForm.$setPristine();
                    $scope.returnFromDepartmentForm.$setUntouched();
                    alertify.log('Return From Department Saved Successfully!', 'success', '5000');
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
    }
    $scope.LoadAdvanceSearch = function () {
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
            if($scope.ScreenId == $scope.FromScreenId){
                ReturnSearch();
            }
            else {
                IssueSearch();
            }
        }
    };
    function IssueSearch() {
        $http({
            url: '/AdvancedSearch/GetSearchId',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.SearchId = data;
            if ($scope.SearchId > 0) {
                $http({
                    url: '/ReturnFromDepartment/GetIssueByIssueId',
                    method: 'GET',
                    params: { issueId: $scope.SearchId },
                    headers: { 'Content-Type': 'application/json' }
                }).success(function (ainv_StockIssue) {
                    $scope.IssueList = [];// ainv_StockIssue;
                    var res = ainv_StockIssue.IssueDate.substring(0, 5);
                    if (res == "/Date") {
                        var parsedDate = new Date(parseInt(ainv_StockIssue.IssueDate.substr(6)));
                        ainv_StockIssue.IssueDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
                    }

                    $scope.IssueList.push(ainv_StockIssue);
                    $scope.FillControll(ainv_StockIssue);

                    /*
                    $scope.IssueList.IssueId = $scope.SearchId;
                    $scope.ddlStore = { "DepartmentId": $scope.IssueList.IssueFromDepartmentId };
                    $scope.ddlDepartment = { "DepartmentId": $scope.IssueList.IssueToDepartmentId };
                    $scope.ddlIssueeBy = { "EmployeeId": $scope.IssueList.IssuedById };
                    $scope.ddlReceiveBy = { "EmployeeId": $scope.IssueList.ReceivedById };
                    */
                    /*
                     $http({
                         url: '/ReturnFromDepartment/GetIssueDetailByIssueId',
                         method: 'GET',
                         params: { issueId: $scope.SearchId },
                         headers: { 'Content-Type': 'application/json' }
                     }).success(function (deliveryDetail) {
                         $scope.SingleIssuelist = deliveryDetail;

                         //angular.forEach($scope.SingleIssuelist, function (SingleIssue) {
                         //    SingleIssue.StockQuantity = 100; //IT Will be change from database...!!!
                         //})
                     })          //   $scope.btnSave = "Revise";     
                     */
                })
            }
        })

    }
    function ReturnSearch() {

    }
    $scope.ForAdvanceReturnSearch = function () {
        $scope.ScreenId = $cookieStore.get('ReturnFromDepartmentScreenId');
        $http({
            url: "/AdvancedSearch/SetScreenIdsToSession?screenId=" + $scope.ScreenId + '&fromScreenId=' + $scope.FromScreenId,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            document.getElementById('AdSearch').contentDocument.location.reload(true);
            $scope.ItemAdvanceSearch = false;
        });
    }
    function GetIsApprove() {
        $http({
            url: '/Approval/GetByScreenId?screenId=' + $scope.FromScreenId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.HasApproval = data.IsRequired;
        })
    }
    $scope.ForAdvanceIssueSearch = function () {
        $scope.ScreenId = $cookieStore.get('StockIssueScreenId');
        $http({
            url: "/AdvancedSearch/SetScreenIdsToSession?screenId=" + $scope.ScreenId + '&fromScreenId=' + $scope.FromScreenId,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            document.getElementById('AdSearch').contentDocument.location.reload(true);
            $scope.ItemAdvanceSearch = false;
        });
    }

    $scope.CheckDuplicateReturnNo = function () {
        var criteria = " [ReturnNo]='" + $scope.ReturnFromDepartmentMaster.ReturnNo + "'";

        $http({
            url: '/ReturnFromDepartment/GetReturnFromDepartmentDynamic?searchCriteria=' + criteria + '&orderBy=ReturnNo',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                $scope.found = true;
                alertify.log($scope.ReturnFromDepartmentMaster.ReturnNo + ' already exists!', 'already', '5000');
                $('#txtReturnNo').focus();
            } else {
                $scope.found = false;
            }
        });
    }

    $scope.foundChange = function () {
        $scope.found = true;
    };
});