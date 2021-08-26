app.controller("StockReceiveController", function ($scope, $cookieStore, $http, $filter) {
    $scope.LoginUser = $cookieStore.get('UserData');

    Clear();


    function Clear() {
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        // GetTopForWarrentyAndSerialNo($scope.currentPage);
        $scope.IPBAndLPBDdl = null;
        $scope.WarrentyAndSerialListShow = true;
        $scope.PBId = 0;
        $scope.PBDate = null;
        $scope.inv_StockReceiveDetailAdAttributeLst = [];
        $scope.inv_StockReceiveDetailList = [];
        $scope.inv_StockReceive = {};
        $scope.inv_StockReceive.SRId = 0;
        $scope.VarietyList = [];
        $scope.Storelist = [];
        $scope.EmployeeList = [];
        $scope.ActivePriceTypeList = [];
        $scope.ItemUnitlist = [];
        $scope.btnSave = "Save";
        $scope.ddlStore = null;
        GetAllEmployee();
        GetAllStore();
        GetActivePriceType();
        GetByCombinationand();
        GetAllVariety();
        var currentDate = new Date();
        $scope.inv_StockReceive.ReceiveDate = $filter('date')(currentDate.toJSON().slice(0, 10), 'dd/MM/yyyy');
        GetAllItemUnit();
        ClearReceiveDetail();
        GetUsersPermissionDetails();
      //  GetAllActivePB();
        $scope.WarrentyAndSerialNoList = [];
       
    }

    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;
        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('StockReceiveScreenId');
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

    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.EmployeeList = data;
            $scope.ddlReceiveBy = { EmployeeId: $scope.LoginUser.EmployeeId };
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
                $scope.inv_StockReceive.DepartmentId = $scope.Storelist[0].DepartmentId;
                $scope.inv_StockReceive.DepartmentName = $scope.Storelist[0].DepartmentName;
            }
        });
    }

    function GetActivePriceType() {
        var criteria = "IsActive=1";
        $http({
            url: '/PriceType/GetPriceTypeDynamic?searchCriteria=' + criteria + '&orderBy=PriceTypeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (activePriceTypeList) {
            $scope.ActivePriceTypeList = activePriceTypeList;
            angular.forEach($scope.ActivePriceTypeList, function (aActivePriceType) {
                if (aActivePriceType.IsDefault == true) {
                    $scope.ddlPriceType = { 'PriceTypeId': aActivePriceType.PriceTypeId }
                }
            })
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

    function SuccessMessage(message) {
        return '<div class="alert alert-warning  alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><div class="topInfo">' + message + '</div></div>';
    }

    function ClearReceiveDetail() {
        $scope.ReceiveDetail = {};
        // $scope.ddlMu = null;
        $scope.DetailAddBtn = "Add Product";
        $scope.VarietyList = [];
        GetAllVariety();
    }

    function SaveReceive(Status) {
        var detaildata = [];
        var serialList = [];
        var serialListForServer = [];
        var serialListForLocalServer = [];
        var errorCount = 0;
        for (var i = 0; i < $scope.inv_StockReceiveDetailAdAttributeLst.length; i++) {

            if ($scope.inv_StockReceiveDetailAdAttributeLst[i].SerialList.length) {
                var attributeQty = $scope.inv_StockReceiveDetailAdAttributeLst[i].AttributeQty;
                var receivedQty = $scope.inv_StockReceiveDetailAdAttributeLst[i].ReceivedQty;
                serialList.push(Enumerable.From($scope.inv_StockReceiveDetailAdAttributeLst[i].SerialList).Where('$.IsChecked').ToArray());
                var numberOfCheckedSerialNo = Enumerable.From($scope.inv_StockReceiveDetailAdAttributeLst[i].SerialList).Where('$.IsChecked').Count();
                if (numberOfCheckedSerialNo != attributeQty) {
                    errorCount++;
                    break
                }
            }

        }

        if (errorCount > 0) {
            //$("#txtFromDate1").val($("#txtFromDate1Hidden").val());
            //$("#txtFromDate1Hidden").val("");

            $scope.inv_StockReceive.ReceiveDate = "";
            alertify.log('Number of Checked Serial No And Recive Quantity Does not Match!', 'error', '5000');
            return;
        }
        var departmentId = $scope.inv_StockReceive.DepartmentId;
        angular.forEach(serialList, function (aSerial) {
            if (aSerial.length) {
                angular.forEach(aSerial, function (serialData) {
                    var pbDetailSerial = {
                        PBDetailSerialId: serialData.PBDetailSerialId,
                        DepartmentId: departmentId,
                        PBDetailId: 0,
                        WarrentyInDays: 0,
                        SerialNo: serialData.SerialNo,
                    }
                    serialListForServer.push(pbDetailSerial);
                });

                angular.forEach(aSerial, function (serialData) {
                    var pbDetailSerial = {
                        LPBDetailSerialId: serialData.LPBDetailSerialId,
                        DepartmentId: departmentId,
                        PBDetailId: 0,
                        WarrentyInDays: 0,
                        SerialNo: serialData.SerialNo,
                    }
                    serialListForLocalServer.push(pbDetailSerial);
                });
            }
        });
        angular.forEach($scope.inv_StockReceiveDetailAdAttributeLst, function (adetaildata) {
            var newdetail = {
                ItemId: adetaildata.ItemId,
                SRQuantity: adetaildata.AttributeQty,
                SRUnitPrice: adetaildata.AttributeUnitPrice,
                ItemName: adetaildata.ItemName,

                FreeUnitId: 1, //*****hard data*****************
                FreeQty: 1,
                SRUnitName: "Hard Data from Js",
                FreeUnitName: "Hard Data from Js"
            };

            detaildata.push(newdetail);
        });
       // return;
        $.ajax({
            url: "/Receive/StockSave",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({ stockReceive: $scope.inv_StockReceive, stockReceiveDetailLst: detaildata, serialList: serialListForServer, localSerialList: serialListForLocalServer }),
            success: function (data) {
                if (data > 0) {
                    serialListForServer = [];
                    serialListForLocalServer = [];
                    
                    Clear();
                    $scope.stockReceive.$setPristine();
                    $scope.stockReceive.$setUntouched();
                   // $("#successMesg").html(SuccessMessage("Stock Recived Successfully and Recive No. is: <b>" + data.StockReciveNo + "</b>"));
                    alertify.log('Stock Receive ' + Status + ' Successfully!', 'success', '5000');
                   
                }

            }, error: function (msg) {
                alertify.log('Server Save Errors!', 'error', '10000');
            }
        });
    }

    function SumAttQty() {
        angular.forEach($scope.inv_StockReceiveDetailAdAttributeLst, function (aDetailAdAttribute) {
            if (aDetailAdAttribute.AttributeQty < 1 || aDetailAdAttribute.AttributeQty == undefined || aDetailAdAttribute.AttributeQty == null) {
                aDetailAdAttribute.AttributeQty = 1;
            }
            else if (aDetailAdAttribute.AttributeQty + aDetailAdAttribute.ReceivedQty > aDetailAdAttribute.PBQty) {
                aDetailAdAttribute.AttributeQty = aDetailAdAttribute.PBQty - aDetailAdAttribute.ReceivedQty;
            }
        });

        angular.forEach($scope.inv_StockReceiveDetailList, function (aStockReceiveDetail) {
            aStockReceiveDetail.SRQuantity = Enumerable.From($scope.inv_StockReceiveDetailAdAttributeLst).Where("$.ItemId == '" + aStockReceiveDetail.ItemId + "'").Sum('$.AttributeQty');
        });
        $scope.inv_StockReceiveDetailList = Enumerable.From($scope.inv_StockReceiveDetailList).Where("$.SRQuantity != 0").ToArray();
    }

    //function GetAllActivePB() {
    //    $http({
    //        url: "/PurchaseBill/GetTopForReceive?Amount=1000",
    //        method: 'GET',
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (data) {
    //        if (data.length > 0) {
    //            angular.forEach(data, function (aPb) {
    //                var res1 = aPb.PBDate.substring(0, 5);
    //                if (res1 == "/Date") {
    //                    var parsedDate1 = new Date(parseInt(aPb.PBDate.substr(6)));
    //                    var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
    //                    aPb.PBDate = date1;
    //                }
    //            })
    //        }
    //        $scope.PurchaseBillList = data;
    //    });
    //}

    function GetByCombinationand() {
        $http({
            url: '/Item/GetCombinationWithPrice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AllCombinationlist = JSON.parse(data);
        })
    }

    $scope.CheckDuplicateReceiveNo = function () {
        var date = $("#txtFromDate1").val();
        if (date == "") {
            $("#txtFromDate1").focus();
            alertify.log('Please select date.', 'error', '5000');
            return;
        }

        if (angular.isUndefined($scope.inv_StockReceive.ReceiveNo) || $scope.inv_StockReceive.ReceiveNo == null) {
            $("#txtReceiveNo").focus();
            alertify.log('Stock recive No. is required.', 'error', '5000');
            return;
        }

        $http({
            url: '/Receive/CheckDuplicateSRNo?ReceiveNo=' + $scope.inv_StockReceive.ReceiveNo + "&date=" + date,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                $scope.found = true;
                alertify.log("Stock Recive No. " + $scope.inv_StockReceive.ReceiveNo + ' already exists!', 'error', '3000');
                $scope.inv_StockReceive.ReceiveNo = "";
                $('#txtReceiveNo').focus();
            } else {
                $scope.found = false;
            }
        });
    }

    $scope.foundChange = function () {
        $scope.found = true;
    }

    $scope.unitFilter = function (RawItem) {
        return function (pram) {
            return (pram.ItemUnitId == RawItem.UnitId) || (pram.ItemUnitId == RawItem.PackageId) || (pram.ItemUnitId == RawItem.ContainerId);
        };
    }

    $scope.RemoveItemAttr = function (inv_StockReceiveDetailAdAttribute) {
        var ind = $scope.inv_StockReceiveDetailAdAttributeLst.indexOf(inv_StockReceiveDetailAdAttribute);
        $scope.inv_StockReceiveDetailAdAttributeLst.splice(ind, 1);
        SumAttQty();
    }

    $scope.SumAttQty = function () {
        SumAttQty();
    }

    $scope.Save = function () {
        alertify.confirm("Are you sure to save?", function (e) {
            if (e) {
                var totQty = 0;
                if ($scope.found) {
                    $('#txtReceiveNo').focus();
                }
                else {
                    $scope.inv_StockReceive.IsApproved = $scope.HasApproval ? false : true;
                    $scope.inv_StockReceive.PBId = $scope.PBId;
                    $scope.inv_StockReceive.PBNo = $scope.PBNo;
                    $scope.inv_StockReceive.PONo = $scope.PONo;
                   // $scope.inv_StockReceive.PBId = $scope.PBId;
                    $scope.inv_StockReceive.SupplierId = 0;
                    $scope.inv_StockReceive.SupplierName = 'N/A';
                    $scope.inv_StockReceive.ReceivedById = $scope.ddlReceiveBy.EmployeeId;
                    $scope.inv_StockReceive.ReceivedBy = 'N/A';
                    $scope.inv_StockReceive.CreatorId = $scope.LoginUser.UserId;
                    $scope.inv_StockReceive.UpdatorId = $scope.LoginUser.UserId;
                    //$("#txtFromDate1Hidden").val("");
                    //$("#txtFromDate1Hidden").val($("#txtFromDate1").val());
                    var fromDateText = $("#txtFromDate1").val();
                    var from = fromDateText.split("/")
                    var f = new Date(from[2], from[1] - 1, from[0]);
                    $scope.inv_StockReceive.ReceiveDate = f;

                    if ($scope.inv_StockReceive.ReceiveDate<$scope.PBDate) {
                        alertify.log('Recive date can not before of PB Date!', 'error', '5000');
                        $("#txtFromDate1").val(fromDateText);
                        return;
                    }
                    if ($scope.inv_StockReceive.SRId == 0 && $scope.CreatePermission) {
                        SaveReceive('Saved');
                    }
                    else if ($scope.inv_StockReceive.SRId == 0 && !$scope.CreatePermission) {
                        alertify.log('You do not have permission to save!', 'error', '5000');
                    }

                    else if ($scope.inv_StockReceive.SRId > 0 && $scope.RevisePermission) {
                        SaveReceive('Updated');
                    }
                    else if ($scope.inv_StockReceive.SRId > 0 && !$scope.RevisePermission) {
                        alertify.log('You do not have permission to Update!', 'error', '5000');
                    }

                }
            }
        });
    }

    $scope.Reset = function () {
        Clear();
        $scope.stockReceive.ddlStore.$setPristine();
        $scope.stockReceive.ddlStore.$setUntouched();

    }

    

    $scope.CountCheckedReciveQty = function (stockReciveDetails) {
        var qty = 0;
        angular.forEach(stockReciveDetails.SerialList, function (sData) {
            if (sData.IsChecked) {
                qty++;
            }
        });
        stockReciveDetails.AttributeQty = qty;

    };


    $scope.Reset = function () {
        Clear();
    }


    $("#txtFromDateForWarenty").datepicker({
        dateFormat: "dd/MM/yyyy"
    });

    $scope.FormDateChangeForWarrenty = function () {
        $("#txtFromDateForWarenty").focus();
        $("#txtFromDateForWarenty").trigger("click");
    }


    $("#txtToDateForWarenty").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.ToDateChangeForWarrenty = function () {
        $("#txtToDateForWarenty").focus();
        $("#txtToDateForWarenty").trigger("click");
    }




    function ImportPB(curPage) {

        if (curPage == null) curPage = 1;
        var startRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        //  var SearchCriteria = "1=1";
        var formDateChange = $("#txtFromDateForWarenty").val();
        $scope.FromDate = formDateChange.split('/').reverse().join('-');

        var toDateChange = $("#txtToDateForWarenty").val();
        $scope.ToDate = toDateChange.split('/').reverse().join('-');
        $scope.SearchPBAndCompanyName = $("#PBAndCompany").val();
        var SearchCriteria = "";

        if ($scope.SearchPBAndCompanyName != undefined && $scope.SearchPBAndCompanyName != "" && $scope.FromDate != "" && $scope.ToDate != "") {
            // SearchCriteria = "([PBDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "') and ([PBNo] LIKE '%" + $scope.SearchPBAndCompanyName + "%')";
            SearchCriteria = "([PBDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "') and ([PBNo] LIKE '%" + $scope.SearchPBAndCompanyName + "%' OR [SupplierName] LIKE '%" + $scope.SearchPBAndCompanyName + "%')";

        }
        else if ($scope.SearchPBAndCompanyName !== undefined && $scope.SearchPBAndCompanyName != null && $scope.SearchPBAndCompanyName != "") {
            SearchCriteria = "[PBNo] LIKE '%" + $scope.SearchPBAndCompanyName + "%' OR [SupplierName] LIKE '%" + $scope.SearchPBAndCompanyName + "%'";

        }
        else if ($scope.FromDate != "" && $scope.ToDate != "") {
            SearchCriteria = "[PBDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "'";

        }

        //var formDateChange = $("#txtFromDateForWarenty").val();
        //$scope.FromDate = formDateChange.split('/').reverse().join('-');

        //var toDateChange = $("#txtToDateForWarenty").val();
        //$scope.ToDate = toDateChange.split('/').reverse().join('-');
        //$scope.SearchPBAndCompanyName = $("#PBAndCompany").val();
        //var SearchCriteria = "";

        //if ($scope.SearchPBAndCompanyName != undefined && $scope.SearchPBAndCompanyName != "" && $scope.FromDate != "" && $scope.ToDate != "") {
        //    SearchCriteria = "([PBDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "') and ([PBNo] LIKE '%" + $scope.SearchPBAndCompanyName +"%')";

        //} 
        //else if ($scope.FromDate != "" && $scope.ToDate != "") {
        //    SearchCriteria = "[PBDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "'";

        //}

        $http({
            url: '/PurchaseBill/ImportPagedPB?startRecordNo=' + startRecordNo + '&rowPerPage=' + $scope.PerPage + "&whereClause=" + SearchCriteria + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {


            if (data.ListData.length > 0) {
                angular.forEach(data.ListData, function (aPb) {
                    var res1 = aPb.PBDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aPb.PBDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aPb.PBDate = date1;
                    }
                })
            }
            $scope.WarrentyAndSerialNoList = data.ListData;
            $scope.total_count = data.TotalRecord;
            console.log('$scope.WarrentyAndSerialNoList', $scope.WarrentyAndSerialNoList);
        });
    }

    function LocalPagedPB(curPage) {
        if (curPage == null) curPage = 1;
        var startRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        // var SearchCriteria = "1=1";
        var formDateChange = $("#txtFromDateForWarenty").val();
        $scope.FromDate = formDateChange.split('/').reverse().join('-');

        var toDateChange = $("#txtToDateForWarenty").val();
        $scope.ToDate = toDateChange.split('/').reverse().join('-');
        $scope.SearchPBAndCompanyName = $("#PBAndCompany").val();
        var SearchCriteria = "";

        if ($scope.SearchPBAndCompanyName != undefined && $scope.SearchPBAndCompanyName != "" && $scope.FromDate != "" && $scope.ToDate != "") {
            // SearchCriteria = "([PBDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "') and ([PBNo] LIKE '%" + $scope.SearchPBAndCompanyName + "%')";
            SearchCriteria = "([PBDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "') and ([PBNo] LIKE '%" + $scope.SearchPBAndCompanyName + "%' OR [SupplierName] LIKE '%" + $scope.SearchPBAndCompanyName + "%')";

        }
        else if ($scope.SearchPBAndCompanyName !== undefined && $scope.SearchPBAndCompanyName != null && $scope.SearchPBAndCompanyName != "") {
            SearchCriteria = "[PBNo] LIKE '%" + $scope.SearchPBAndCompanyName + "%' OR [SupplierName] LIKE '%" + $scope.SearchPBAndCompanyName + "%'";

        }
        else if ($scope.FromDate != "" && $scope.ToDate != "") {
            SearchCriteria = "[PBDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "'";

        }

        $http({
            url: '/PurchaseBill/LocalPagedPB?startRecordNo=' + startRecordNo + '&rowPerPage=' + $scope.PerPage + "&whereClause=" + SearchCriteria + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            if (data.ListData.length > 0) {
                angular.forEach(data.ListData, function (aPb) {
                    var res1 = aPb.PBDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aPb.PBDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aPb.PBDate = date1;
                    }
                })
            }
            $scope.WarrentyAndSerialNoList = data.ListData;
            $scope.total_count = data.TotalRecord;

            console.log('$scope.WarrentyAndSerialNoList', $scope.WarrentyAndSerialNoList);
        });
    }






    $scope.warrentyAndPbList = [

        { Id: 1, Name: "Local Purchase Bill" },
        { Id: 2, Name: "Import Purchase Bill" },
    ];

    $scope.LocalWarrantyAndSerialNumber = function (id) {
        $scope.PBIdDdl = id;

        //if ($scope.PBIdDdl == 1) {
        //    $scope.inv_StockReceive.IsLocalPurchase = true;
        //} else {
        //    $scope.inv_StockReceive.IsLocalPurchase = false;
        //}
       
    }

    $scope.reloadBtn = function () {
        $('#txtFromDateForWarenty').val('');
        $('#txtToDateForWarenty').val('');
        $('#PBAndCompany').val('');
        $scope.FromDate = "";
        $scope.ToDate = "";
        $scope.SearchPBAndCompanyName = null;
        // GetPagedPB(1);
        //if ($scope.PBIdDdl == 1) {
        //    LocalPagedPB($scope.currentPage);
        //    $scope.inv_StockReceive.IsLocalPurchase = true;
        //} else if ($scope.PBIdDdl == 2) {
        //    ImportPB($scope.currentPage);
        //    $scope.inv_StockReceive.IsLocalPurchase = false;
        //}
        //else {
        //    $scope.WarrentyAndSerialNoList = [];
        //    $scope.pageSizeHide = false;
        //}

    }


   
    function GetAllActiveImportPB() {
        $http({
            url: "/PurchaseBill/GetTopForReceive?Amount=1000",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                angular.forEach(data, function (aPb) {
                    var res1 = aPb.PBDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aPb.PBDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aPb.PBDate = date1;
                    }
                })
            }
            $scope.WarrentyAndSerialNoList = data;
        });
    }
    function GetAllActiveLocalPB() {
        $http({
            url: "/PurchaseBill/GetTopForLocalReceive?amount=1000",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                angular.forEach(data, function (aPb) {
                    var res1 = aPb.PBDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aPb.PBDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aPb.PBDate = date1;
                    }
                })
            }
            $scope.WarrentyAndSerialNoList = data;
        });
    }

    $scope.localAndImportWarrantyAndSerialNumber = function () {

        

        if ($scope.PBIdDdl == 1) {
           // $scope.WarrentyAndSerialNoList = [];
            GetAllActiveLocalPB();
          //  LocalPagedPB($scope.currentPage);
           // $scope.pageSizeHide = true;
            $scope.inv_StockReceive.IsLocalPurchase = true;
            //document.getElementById("isLocalPurchase").disabled = true;
          
        } else if ($scope.PBIdDdl == 2) {
            
            GetAllActiveImportPB();
            $scope.inv_StockReceive.IsLocalPurchase = false;
            //ImportPB($scope.currentPage);
          //  $scope.pageSizeHide = true;
          //  $scope.inv_StockReceive.IsLocalPurchase = false;
          //  document.getElementById("isLocalPurchase").disabled = false;
        } else {
            $scope.WarrentyAndSerialNoList = [];
            $scope.pageSizeHide = false;
            $scope.inv_StockReceive.IsLocalPurchase = false;
            //document.getElementById("isLocalPurchase").disabled = false;
        }
    }



    //$scope.getData = function (curPage) {

    //    if ($scope.PBIdDdl == 1) {
    //        if ($scope.PerPage > 100) {
    //            $scope.PerPage = 100;
    //            $scope.currentPage = curPage;
    //            LocalPagedPB(curPage);

    //            alertify.log('Maximum record  per page is 100', 'error', '5000');
    //        }
    //        else if ($scope.PerPage < 1) {
    //            $scope.PerPage = 1;
    //            $scope.currentPage = curPage;

    //            LocalPagedPB(curPage);


    //            alertify.log('Minimum record  per page is 1', 'error', '5000');
    //        }
    //        else {
    //            $scope.currentPage = curPage;

    //            LocalPagedPB(curPage);

    //        }

    //    }
    //    else {

    //        if ($scope.PerPage > 100) {
    //            $scope.PerPage = 100;
    //            $scope.currentPage = curPage;

    //            ImportPB($scope.currentPage);

    //            alertify.log('Maximum record  per page is 100', 'error', '5000');
    //        }
    //        else if ($scope.PerPage < 1) {
    //            $scope.PerPage = 1;
    //            $scope.currentPage = curPage;


    //            ImportPB(curPage);

    //            alertify.log('Minimum record  per page is 1', 'error', '5000');
    //        }
    //        else {
    //            $scope.currentPage = curPage;

    //            ImportPB(curPage);
    //        }

    //    }

    //}


    //$scope.SearchBtn = function (curPage) {


    //    var formDateChange = $("#txtFromDateForWarenty").val();
    //    $scope.FromDate = formDateChange.split('/').reverse().join('-');

    //    var toDateChange = $("#txtToDateForWarenty").val();
    //    $scope.ToDate = toDateChange.split('/').reverse().join('-');
    //    $scope.SearchPBAndCompanyName = $("#PBAndCompany").val();
    //    if ($scope.PBIdDdl == 1) {
    //        LocalPagedPB(curPage);
    //    } else if ($scope.PBIdDdl == 2) {
    //        ImportPB(curPage);

    //    } else {
    //        $scope.WarrentyAndSerialNoList = [];
    //        $scope.pageSizeHide = false;
    //    }


    //}



   


    $scope.GetPBDetails = function (aPB) {

        if ($scope.PBIdDdl == 2) {
            $http({
                url: "/PurchaseBill/GetPBById?id=" + aPB.PBId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {

                $scope.PBId = aPB.PBId;
                $scope.PBNo = aPB.PBNo;
                $scope.PONo = aPB.PONo;
                var pDate = aPB.PBDate.split("/");
                $scope.PBDate = new Date(pDate[2], (parseInt(pDate[1]) - 1), pDate[0]);
                $scope.inv_StockReceiveDetailAdAttributeLst = [];
                $scope.inv_StockReceiveDetailList = [];
                angular.forEach(data, function (adata) {
                    var ItemCombination = Enumerable.From($scope.AllCombinationlist).Where('$.ItemId==' + adata.ItemId).FirstOrDefault();
                    var checkCategory = Enumerable.From($scope.VarietyList).Where('$.ItemId==' + ItemCombination.ItemId).FirstOrDefault();

                    var criteria = " [DepartmentId]=0 AND PBDetailId=" + adata.PBDetailId;
                    $http({
                        url: '/WarrentyAndSerialNo/GetWarrantyAndSerialNoDynamicForSingle?whereCondition=' + criteria,
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    }).success(function (warrentySerialNoList) {
                        if (checkCategory.CategoryName != "Hardware" || (checkCategory.CategoryName == "Hardware" && warrentySerialNoList.length > 0)) {

                            $scope.inv_StockReceive.ReceiveNo = aPB.PBNo.replace("IPB", "SR");
                            //var ValueOfAttribute = [];
                            //var a = ItemCombination.AttributeNames.split(',');
                            //for (var i = 0; i < a.length; i++) {
                            //    var val = a[i].split(':');
                            //    ValueOfAttribute.push(val[1].trim());
                            //}
                            //ItemCombination.ValueOfAttribute = ValueOfAttribute;
                            var Attribute = ItemCombination;
                            Attribute.PBQty = adata.PBQty;
                            Attribute.AttributeUnitPrice = adata.PBPrice;
                            Attribute.ReceivedQty = adata.ReceivedQty;
                            Attribute.AttributeQty = (Attribute.PBQty - Attribute.ReceivedQty);

                            var SerialList = [];

                            if (checkCategory.CategoryName == "Hardware") {
                                angular.forEach(warrentySerialNoList, function (serialNoByPBDetailId) {
                                    var SerialNo = {
                                        SerialNo: serialNoByPBDetailId.SerialNo,
                                        PBDetailSerialId: serialNoByPBDetailId.PBDetailSerialId,
                                        IsChecked: true
                                    };
                                    SerialList.push(SerialNo);
                                });
                            }

                            Attribute.SerialList = SerialList;
                            if (Attribute.ReceivedQty < Attribute.PBQty)
                                $scope.inv_StockReceiveDetailAdAttributeLst.push(Attribute);
                            flag = true;
                            angular.forEach($scope.inv_StockReceiveDetailList, function (aItem) {
                                if (aItem.ItemId == ItemCombination.ItemId) {
                                    flag = false;
                                }
                            });
                            if (flag) {
                                var Item = {};
                                angular.forEach($scope.VarietyList, function (aItem) {
                                    if (aItem.ItemId == ItemCombination.ItemId) {
                                        Item = aItem;
                                    }
                                })
                                Item.HeaderOfAttribute = [];
                                var HeaderOfAttribute = [];
                                var hasSerialNo = false;
                                if (SerialList.length > 0)
                                    hasSerialNo = true;

                                Item.HasSerialNo = hasSerialNo;
                                //var a = ItemCombination.AttributeNames.split(',');
                                //for (var i = 0; i < a.length; i++) {
                                //    var val = a[i].split(':');
                                //    HeaderOfAttribute.push(val[0].trim());
                                //}
                                //Item.HeaderOfAttribute = HeaderOfAttribute;
                                $scope.inv_StockReceiveDetailList.push(Item);
                            }
                        }
                        else {
                            alertify.log('Serial No. not found ', 'error', '5000');
                        }
                    });
                });
                //GetByCombinationand();
            });
        }

       
    }

    $scope.GetLocalPBDetails = function (LocalData) {

        if ($scope.PBIdDdl==1) {
            $http({
                url: "/PurchaseBill/GetLocalPBById?id=" + LocalData.LPBId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {

                $scope.PBId = LocalData.LPBId;
                $scope.PBNo = LocalData.PBNo;
                $scope.PONo = LocalData.PONo;
                var pDate = LocalData.PBDate.split("/");
                $scope.PBDate = new Date(pDate[2], (parseInt(pDate[1]) - 1), pDate[0]);
                $scope.TempSerial = [];
                $scope.inv_StockReceiveDetailAdAttributeLst = [];
                $scope.inv_StockReceiveDetailList = [];
                angular.forEach(data, function (adata) {
                    var ItemCombination = Enumerable.From($scope.AllCombinationlist).Where('$.ItemId==' + adata.ItemId).FirstOrDefault();
                    var checkCategory = Enumerable.From($scope.VarietyList).Where('$.ItemId==' + ItemCombination.ItemId).FirstOrDefault();

                    var criteria = " [DepartmentId]=0 AND LPBDetailId=" + adata.LPBDetailId;
                    $http({
                        url: '/WarrentyAndSerialNo/GetLocalWarrantyAndSerialNoDynamicForSingle?whereCondition=' + criteria,
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    }).success(function (warrentySerialNoList) {
                        $scope.TempSerial = warrentySerialNoList;
                        if (checkCategory.CategoryName != "Hardware" || (checkCategory.CategoryName == "Hardware" && warrentySerialNoList.length > 0)) {

                            $scope.inv_StockReceive.ReceiveNo = LocalData.PBNo.replace("LPB", "SR");
                            //var ValueOfAttribute = [];
                            //var a = ItemCombination.AttributeNames.split(',');
                            //for (var i = 0; i < a.length; i++) {
                            //    var val = a[i].split(':');
                            //    ValueOfAttribute.push(val[1].trim());
                            //}
                            //ItemCombination.ValueOfAttribute = ValueOfAttribute;
                            var Attribute = ItemCombination;
                            Attribute.PBQty = adata.PBQty;
                            Attribute.AttributeUnitPrice = adata.PBPrice;
                            Attribute.ReceivedQty = adata.ReceivedQty;
                            Attribute.AttributeQty = (Attribute.PBQty - Attribute.ReceivedQty);

                            var SerialList = [];

                            if (checkCategory.CategoryName == "Hardware") {
                                angular.forEach(warrentySerialNoList, function (aSerial) {
                                    var SerialNo = {
                                        SerialNo: aSerial.SerialNo,
                                        LPBDetailSerialId: aSerial.LPBDetailSerialId,
                                        IsChecked: true
                                    };
                                    SerialList.push(SerialNo);
                                });
                            }

                            Attribute.SerialList = SerialList;
                            if (Attribute.ReceivedQty < Attribute.PBQty)
                                $scope.inv_StockReceiveDetailAdAttributeLst.push(Attribute);
                            flag = true;
                            angular.forEach($scope.inv_StockReceiveDetailList, function (aItem) {
                                if (aItem.ItemId == ItemCombination.ItemId) {
                                    flag = false;
                                }
                            });
                            if (flag) {
                                var Item = {};
                                angular.forEach($scope.VarietyList, function (aItem) {
                                    if (aItem.ItemId == ItemCombination.ItemId) {
                                        Item = aItem;
                                    }
                                })
                                Item.HeaderOfAttribute = [];
                                var HeaderOfAttribute = [];
                                var hasSerialNo = false;
                                if (SerialList.length > 0)
                                    hasSerialNo = true;

                                Item.HasSerialNo = hasSerialNo;
                                //var a = ItemCombination.AttributeNames.split(',');
                                //for (var i = 0; i < a.length; i++) {
                                //    var val = a[i].split(':');
                                //    HeaderOfAttribute.push(val[0].trim());
                                //}
                                //Item.HeaderOfAttribute = HeaderOfAttribute;
                                $scope.inv_StockReceiveDetailList.push(Item);
                            }
                        }
                        else {
                            alertify.log('Serial No. not found ', 'error', '5000');
                        }
                    });
                });
            });
        }

        



    }



});