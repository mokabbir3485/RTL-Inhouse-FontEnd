app.controller("DeliveryController", function ($scope, $cookieStore, $http, $filter, $window) {

    $scope.LoginUser = $cookieStore.get('UserData');
    Load();
    Clear();

    function Load() {
        //$scope.VarietyList = [];
        //$scope.Storelist = [];
        GetAllVariety();
        GetAllEmployee();
        GetAllStore();
        GetUnit();
        GetUsersPermissionDetails();
        
    }

    function Clear() {
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        GetPagedDelivery($scope.currentPage);
        $scope.deliveryListForGrid = [];

        $scope.sOrDate = "";
        $scope.ScreenId = $cookieStore.get('DeliveryScreenId');
        $scope.FromScreenId = $cookieStore.get('DeliveryScreenId');
        $scope.found = false;
        $scope.inv_StockDeliveryDetail = {};
        $scope.inv_StockDelivery = {};
        $scope.inv_StockDelivery.DeliveryId = 0;
        $scope.ddlStore = null;
        $scope.DeliveryDetailList = [];
        $scope.inv_stockDeliveryDetailAttributeLst = [];
        $scope.inv_stockDeliveryDetailList = [];
        $scope._inv_StockIssueDetailAdAttribute = [];
       
        $scope.btnSave = "Save";
        var currentDate = new Date();
        $scope.inv_StockDelivery.DeliveryDate = $filter('date')(currentDate.toJSON().slice(0, 10), 'dd/MM/yyyy');
        $scope.inv_StockDelivery.BillDate = $filter('date')(currentDate.toJSON().slice(0, 10), 'dd/MM/yyyy');
        $scope.UserData = $cookieStore.get('UserData');
        $scope.ddlDeliverydBy = { "EmployeeId": $scope.UserData.EmployeeId };
        $scope.inv_StockDelivery.DeliverydById = $scope.UserData.EmployeeId;
        $scope.inv_StockDelivery.DeliverydBy = $scope.UserData.FullName;
        GetTopSalesOrderDetailData();
        GetByCombinationand();
        $scope.ddlChallanStore = null;
        $scope.inv_StockDeliveryNonSODetail = {};
        $scope.inv_StockDeliveryNonSO = {};
        $scope.inv_StockDeliveryNonSO.DeliveryId = 0;
        $scope.ddlChallanBy = { "EmployeeId": $scope.UserData.EmployeeId };
        $scope.inv_StockDeliveryNonSO.UpdatorId = $scope.UserData.EmployeeId;
        $scope.inv_StockDeliveryNonSO.DeliverydBy = $scope.UserData.FullName;
        $scope.StockDeliveryNonSODetailList = [];
    }

    function SuccessMessage(message) {
        return '<div class="alert alert-warning  alert-dismissible fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><div class="topInfo">' + message + '</div></div>';
    }

    $scope.StockDeliveryListItem = [];
    function GetTopSalesOrderDetailData() {
        //$scope.StockDeliveryList = [];
        var criteria = 0;
        $http({
            url: '/SalesOrder/GetTopForDelivery?topQty=' + criteria,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                angular.forEach(data, function (aSd) {
                    var res1 = aSd.SalesOrderDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.SalesOrderDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aSd.SalesOrderDate = date1;
                    }
                })
            }
            $scope.StockDeliveryListItem = data;
            $scope.StockDeliveryList = Enumerable.From($scope.StockDeliveryListItem).Distinct(function (x) {
                return x.SalesOrderId;
            }).ToArray();
            console.log('$scope.StockDeliveryList', $scope.StockDeliveryList);
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

    function GetByCombinationand() {
        $http({
            url: '/Item/GetCombinationWithPrice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AllCombinationlist = JSON.parse(data);
        })
    }

    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('PurchaseBillScreenId');
        $http({
            url: '/Permission/GetUsersPermissionDetails?searchCriteria=' + searchCriteria + '&orderBy=PermissionDetailId',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.PermissionDetails = data;
            angular.forEach($scope.PermissionDetails, function (aPermissionDetails) {
                if (aPermissionDetails.FunctionName == 'Create' ) {
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

    function SaveSDelivery(status) {
        var detaildata = [];
        var serialList = [];
        var serialListForServer = [];
        var errorCount = [];
        var errorMessage = "";
        var itemAddAttIdStringConcat = "";

        var deliverDateText = $('#txtDeliveryDate').val();
        var deliverDate = deliverDateText.split("/");
        var dDate = new Date(deliverDate[2], deliverDate[1] - 1, deliverDate[0]);

        if (dDate < $scope.sOrDate) {
            $('#txtDeliveryDate').val(deliverDateText);
            alertify.log("Delivery date can not before Sales Order date.", "error", "5000");
            return;
        }

       

        $http({
            url: "/StockValuation/GetByDepartmentAndItemAddAttId?departmentId=" + $scope.ddlStore.DepartmentId + "&itemAddAttId=" + itemAddAttIdStringConcat,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (stockValuationAttributeList) {
            for (var i = 0; i < $scope.inv_stockDeliveryDetailAttributeLst.length; i++) {
                var ItemCombination = Enumerable.From($scope.AllCombinationlist).Where('$.ItemId==' + $scope.inv_stockDeliveryDetailAttributeLst[i].ItemId).FirstOrDefault();

                //$scope.inv_stockDeliveryDetailAttributeLst[i].ItemName = ItemCombination.AttributeNames.split(':')[1];
                var deliveryQty = $scope.inv_stockDeliveryDetailAttributeLst[i].DeliveryQuantity;
                //if (deliveryQty > $scope.inv_stockDeliveryDetailAttributeLst[i].StockQty) {
                //    alertify.log('Stock quantity less than Delivery quantity', 'error', '5000');
                //    return;
                //}

                if ((deliveryQty + $scope.inv_stockDeliveryDetailAttributeLst[i].DeliveredQty) > $scope.inv_stockDeliveryDetailAttributeLst[i].OrderQty) {
                    errorCount++;
                    errorMessage = 'Cannot deliver more than order quantity for ' + $scope.inv_stockDeliveryDetailAttributeLst[i].ItemName;
                    break;
                }

                if ($scope.inv_stockDeliveryDetailAttributeLst[i].SerialList.length) {
                    var serial = Enumerable.From($scope.inv_stockDeliveryDetailAttributeLst[i].SerialList).Where('$.IsChecked').ToArray()
                    serial.ItemId = $scope.inv_stockDeliveryDetailAttributeLst[i].ItemId;
                    serialList.push(serial);
                    var numberOfCheckedSerialNo = Enumerable.From($scope.inv_stockDeliveryDetailAttributeLst[i].SerialList).Where('$.IsChecked').Count();

                    if (numberOfCheckedSerialNo != deliveryQty) {
                        errorCount++;
                        errorMessage = 'Number of checked serial  and delivery quantity does not match for ' + $scope.inv_stockDeliveryDetailAttributeLst[i].ItemName;
                        break;
                    }
                }
                //else {
                //    var currQty = stockValuationAttributeList.length?( Enumerable.From(stockValuationAttributeList).Where('$.ItemAddAttId==' + $scope.inv_stockDeliveryDetailAttributeLst[i].ItemAddAttId).FirstOrDefault().CurrentQuantity) :0;
                //    if (currQty < deliveryQty) {
                //        errorCount++;
                //        errorMessage = 'Not enough stock quantity (' + currQty + ') for ' + $scope.inv_stockDeliveryDetailAttributeLst[i].ItemName;
                //        break;
                //    }
                //}
            }

            if (errorCount > 0) {
                alertify.log(errorMessage, 'error', '5000');
                //$('#txtDeliveryDate').val('');
                //$scope.inv_StockDelivery.DeliveryDate = null;
                return;
            }
            var departmentId = $scope.inv_StockDelivery.DeliveryFromDepartmentId;
            console.log(serialList);
            angular.forEach(serialList, function (aSerial) {
                if (aSerial.length) {
                    angular.forEach(aSerial, function (serialData) {
                        var pbDetailSerial = {
                            PBDetailSerialId: serialData.PBDetailSerialId,
                            DepartmentId: departmentId,
                            ItemId: aSerial.ItemId,
                            PBDetailId: 0,
                            WarrentyInDays: 0,
                            SerialNo: serialData.SerialNo,

                        };
                        serialListForServer.push(pbDetailSerial);
                    });
                }
            });
           // return;
            $scope.inv_StockDelivery.DeliveryDate = dDate;
            $scope.inv_StockDelivery.IsApproved = $scope.HasApproval ? true : false;
            $scope.inv_StockDelivery.CreatorId = $scope.LoginUser.UserId;
            $scope.inv_StockDelivery.UpdatorId = $scope.LoginUser.UserId;
            $scope.inv_StockDelivery.DepartmentId = $scope.ddlStore.DepartmentId;
            $scope.inv_StockDelivery.EmployeeId = $scope.ddlDeliverydBy.EmployeeId;
            $scope.inv_StockDelivery.OrderId = $scope.inv_StockDelivery.OrderId;

            var billDate = $('#txtBillDate').val().split("/");
            var bDate = new Date(billDate[2], billDate[1] - 1, billDate[0]);
            $scope.inv_StockDelivery.BillDate = bDate;

            $.ajax({
                url: "/Delivery/SaveDelivery",
                contentType: "application/json;charset=utf-8",
                type: "POST",
                data: JSON.stringify({ inv_stockDelivery: $scope.inv_StockDelivery, inv_stockDeliveryDetail: $scope.inv_stockDeliveryDetailAttributeLst, serialList: serialListForServer }),
                success: function (data) {
                    if (data.DeliveryId > 0 && data.SavedDeliveryNo != "") {
                        $("#successMesg").html(SuccessMessage("Delivery Saved Successfully and Delivery No. is: <b>" + data.SavedDeliveryNo + "</b>"));
                        $window.open("#/DeliveryReport", "popup", "width=850,height=550,left=280,top=80");
                        $cookieStore.put("DeliveryId", data);
                        //$window.open("/ErpReports/RV_Pos_DeliveryChallanByDeliveryId.aspx?DeliveryId=" + data.DeliveryId, "_blank", "width=790,height=630,left=340,top=25");
                        Clear();
                        $scope.deliveryForm.$setPristine();
                        $scope.deliveryForm.$setUntouched();

                    } else {
                        alertify.log('Server Save Errors!', 'error', '10000');
                    }
                }, error: function (msg) {
                    alertify.log('Server Save Errors!', 'error', '10000');
                }
            });
        });
    }

    $scope.LoadDataWhenDepartmentChange = function () {
        $scope.inv_stockDeliveryDetailList = [];
        $scope.inv_stockDeliveryDetailAttributeLst = [];
        GetTopSalesOrderDetailData();
        GetByCombinationand();
    }



    $("#txtFromDateForDC").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.FormDateChangeForDelivery = function () {
        $("#txtFromDateForDC").focus();
        $("#txtFromDateForDC").trigger("click");
    }


    $("#txtToDateForDC").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.ToDateChangeForDelivery = function () {
        $("#txtToDateForDC").focus();
        $("#txtToDateForDC").trigger("click");
    }

    $scope.reloadBtn = function () {
        $('#txtFromDateForDC').val('');
        $('#txtToDateForDC').val('');
        $('#IWOAndCompany').val('');
        $scope.FromDate = "";
        $scope.ToDate = "";
        $scope.SearchDcOredrDcNoAndCompanyName = null;
        GetPagedDelivery(1);
    }

    $scope.DeliverySearch = function () {
        GetPagedDelivery(1);

    }
   
    function GetPagedDelivery(curPage) {

        if (curPage == null) curPage = 1;
        var startRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        
        var formDateChange = $("#txtFromDateForDC").val();
        $scope.FromDate = formDateChange.split('/').reverse().join('-');

        var toDateChange = $("#txtToDateForDC").val();
        $scope.ToDate = toDateChange.split('/').reverse().join('-');

        var SearchCriteria = "";

        if ($scope.SearchDcOredrDcNoAndCompanyName != undefined && $scope.SearchDcOredrDcNoAndCompanyName != "" && $scope.FromDate != "" && $scope.ToDate != "") {
            SearchCriteria = "([SD].[DeliveryDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "') and ([SD].[DeliveryNo] LIKE '%" + $scope.SearchIWOAndCompanyName + "%' OR C.CompanyName LIKE '%" + $scope.SearchIWOAndCompanyName + "%' OR [SD].[OrderNo] LIKE '%" + $scope.SearchIWOAndCompanyName + "%')";
        
        }
        else if ($scope.SearchDcOredrDcNoAndCompanyName !== undefined && $scope.SearchDcOredrDcNoAndCompanyName != null && $scope.SearchDcOredrDcNoAndCompanyName != "") {
            SearchCriteria = "[SD].[DeliveryNo] LIKE '%" + $scope.SearchDcOredrDcNoAndCompanyName + "%' OR C.CompanyName LIKE '%" + $scope.SearchDcOredrDcNoAndCompanyName + "%'  OR [SD].[OrderNo] LIKE '%" + $scope.SearchDcOredrDcNoAndCompanyName + "%'";
            
        }
        else if ($scope.FromDate != "" && $scope.ToDate != "") {
            SearchCriteria = "[SD].[DeliveryDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "'";
          
        }
       


        $http({
            url: encodeURI('/Delivery/GetPagedDelivery?startRecordNo=' + startRecordNo + '&rowPerPage=' + $scope.PerPage + "&whereClause=" + SearchCriteria + '&rows=' + 0),
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            $scope.deliveryListForGrid = data.ListData;
            $scope.total_count = data.TotalRecord;

            if ($scope.deliveryListForGrid.length > 0) {
                angular.forEach($scope.deliveryListForGrid, function (aSd) {
                    var res1 = aSd.DeliveryDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.DeliveryDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aSd.DeliveryDate = date1;
                    }
                })

            }
            else {
                alertify.log('Sales Order  Not Found', 'error', '5000');
            }



        });
    }

    $scope.getData = function (curPage) {

        // if ($scope.FromDate == "" || $scope.ToDate == "" ) {

        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetPagedDelivery($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetPagedDelivery($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetPagedDelivery($scope.currentPage);
        }
        //  }


    }





    //$scope.CheckDuplicateDeliveryNo = function () {
    //    var date = $("#txtDeliveryDate").val();
    //    if (date == "") {
    //        $("#txtDeliveryDate").focus();
    //        alertify.log('Please select date.', 'error', '5000');
    //        return;
    //    }
    //    if ($scope.inv_StockDelivery.DeliveryNo == "" || angular.isUndefined($scope.inv_StockDelivery.DeliveryNo) || $scope.inv_StockDelivery.DeliveryNo == null) {
    //        GetMaxProductionNo();
    //    } else {
    //        $http({
    //            url: '/Delivery/CheckDuplicateDeliveryNo?DeliveryNo=' + $scope.inv_StockDelivery.DeliveryNo + "&date=" + date,
    //            method: 'GET',
    //            headers: { 'Content-Type': 'application/json' }
    //        }).success(function (data) {
    //            if (data.length > 0) {
    //                $scope.found = true;
    //                alertify.log("Delivery No. " + $scope.inv_StockDelivery.DeliveryNo + ' already exists!', 'error', '3000');
    //                $scope.inv_StockDelivery.DeliveryNo = "";
    //                $('#txtDeliveryDate').focus();
    //            } else {
    //                $scope.found = false;
    //            }
    //        });
    //    }
    //}

    $scope.RemoveItemAttr = function (aDetail) {
        var ind = $scope.inv_stockDeliveryDetailAttributeLst.indexOf(aDetail);
        $scope.inv_stockDeliveryDetailAttributeLst.splice(ind, 1);
        angular.forEach($scope.inv_stockDeliveryDetailList, function (ainv_StockDeliveryDetaillst) {
            if (Enumerable.From($scope.inv_stockDeliveryDetailAttributeLst).Where('$.ItemId==' + ainv_StockDeliveryDetaillst.ItemId).ToArray().length < 1) {
                var ind = $scope.inv_stockDeliveryDetailList.indexOf(ainv_StockDeliveryDetaillst);
                $scope.inv_stockDeliveryDetailList.splice(ind, 1);
            }
        });
    }

    $scope.SumAttQty = function () {
        angular.forEach($scope.inv_stockDeliveryDetailAttributeLst, function (aDetailAdAttribute) {
            if (aDetailAdAttribute.DeliveryQuantity <= 0 || aDetailAdAttribute.DeliveryQuantity == undefined || aDetailAdAttribute.DeliveryQuantity == null) {
                
                aDetailAdAttribute.DeliveryQuantity = aDetailAdAttribute.OrderQty - aDetailAdAttribute.DeliveredQty;
                alertify.log('Delivery quantity can not be blank or zero.  ', 'error', '5000');
            }
            else if (aDetailAdAttribute.DeliveryQuantity > (aDetailAdAttribute.OrderQty - aDetailAdAttribute.DeliveredQty)) {
                aDetailAdAttribute.DeliveryQuantity = aDetailAdAttribute.OrderQty - aDetailAdAttribute.DeliveredQty;
                alertify.log('Delivery quantity can not more than ' + aDetailAdAttribute.DeliveryQuantity + '.', 'error', '5000');
            }
        });
        angular.forEach($scope.inv_stockDeliveryDetailList, function (aStockDeliveryDetail) {
            aStockDeliveryDetail.SDQuantity = Enumerable.From($scope.inv_stockDeliveryDetailAttributeLst).Where("$.SalesOrderDetailId == '" + aStockDeliveryDetail.SalesOrderDetailId + "'").Sum('$.DeliveryQuantity');
           
        });
    }

    $scope.SaveStockDelivery = function () {
        if ($scope.found) {
            $('#txtDeliveryDate').focus();
        }
        else {
            for (var i = 0; i < $scope.inv_stockDeliveryDetailAttributeLst.length; i++) {
                if ($scope.inv_stockDeliveryDetailAttributeLst[i].StockQty < $scope.inv_stockDeliveryDetailAttributeLst[i].DeliveryQuantity) {
                    alertify.log("You do not have sufficient stock to deliver this product: " + $scope.inv_stockDeliveryDetailAttributeLst[i].ItemName, "error", "5000");
                    return;
                }
                //itemAddAttIdStringConcat += i == 0 ? ($scope.inv_stockDeliveryDetailAttributeLst[i].ItemAddAttId) : ("," + $scope.inv_stockDeliveryDetailAttributeLst[i].ItemAddAttId);
            }
            if ($scope.CreatePermission=true) {
                alertify.confirm("Are you sure to save?", function (e) {
                    if (e) {
                        SaveSDelivery('Saved');
                    }
                })
            }
            else {
                alertify.log('You do not have permission to save!', 'error', '5000');
            }
        }
    }

    $scope.foundChange = function () {
        $scope.found = true;
    }

    $scope.GetSalesOrderDetails = function (aSO) {
        var departmentId = $scope.inv_StockDelivery.DeliveryFromDepartmentId;
        if (angular.isUndefined(departmentId)) {
            alertify.log("Please select a department first. ", "error", "5000");
            return;
        }
      
       
        $http({
            url: "/Delivery/GetSalesOrderDetailDynamic?salesOrderId=" + aSO.SalesOrderId + "&orderBy='SalesOrderId'",
            method: "GET",
            headers: { "Content-Type": "application/json" }
        }).success(function (data) {

            var msgShowText = "";

            var soDateText = aSO.SalesOrderDate.split("/");
            $scope.sOrDate = new Date(soDateText[2], (parseInt(soDateText[1]) - 1), soDateText[0]);

                angular.forEach(data, function (adata) {
                    if (adata.DeliveredQty < adata.OrderQty) {

                        $scope.inv_stockDeliveryDetailAttributeLst = [];
                        $scope.inv_stockDeliveryDetailList = [];
                        var ItemCombination = Enumerable.From($scope.AllCombinationlist).Where('$.ItemId==' + adata.ItemAddAttId).FirstOrDefault();
                        var checkCategory = Enumerable.From($scope.VarietyList).Where('$.ItemId==' + ItemCombination.ItemId).FirstOrDefault();

                        var criteria = "DeliveryDetailId=0 AND [DepartmentId]=" + $scope.ddlStore.DepartmentId + " AND ItemId=" + adata.ItemAddAttId;
                        $http({
                            url: '/WarrentyAndSerialNo/GetWarrantyAndSerialNoDynamicForSingle?whereCondition=' + criteria,
                            method: 'GET',
                            headers: { 'Content-Type': 'application/json' }
                        }).success(function (warrentySerialNoList) {

                            if (checkCategory.CategoryName != "Hardware" || (checkCategory.CategoryName == "Hardware" && warrentySerialNoList.length)) {
                                if (checkCategory.CategoryName == "Finished Goods") {
                                    $scope.OrderProQty = "Production Qty";
                                }
                                else {
                                    $scope.OrderProQty = "Order Qty";
                                }
                                $scope.inv_StockDelivery.OrderId = aSO.SalesOrderId;
                                $scope.inv_StockDelivery.OrderNo = aSO.SalesOrderNo;
                                $scope.inv_StockDelivery.DeliveryNo = aSO.SalesOrderNo.replace("SO", "DN");

                                //var ValueOfAttribute = [];
                                //var a = ItemCombination.AttributeNames.split(',');
                                //for (var i = 0; i < a.length; i++) {
                                //    var val = a[i].split(':');
                                //    ValueOfAttribute.push(val[1].trim());
                                //}

                                ItemCombination.ValueOfAttribute = [ItemCombination.AttributeNames];
                                $scope.Attribute = {};

                                $scope.Attribute = angular.copy(ItemCombination);
                                $scope.Attribute.DeliveredQty = angular.copy(adata.DeliveredQty);
                                $scope.Attribute.SalesOrderDetailId = adata.SalesOrderDetailId;
                                $scope.Attribute.OrderQty =adata.OrderQty;
                                $scope.Attribute.DeliveryQuantity = adata.OrderQty - adata.DeliveredQty;
                                $scope.Attribute.DeliveryUnitPrice = adata.OrderPrice;
                                $scope.Attribute.DeliveryUnitId = adata.OrderUnitId;

                                var res1 = adata.DueDate.substring(0, 5);
                                if (res1 == "/Date") {
                                    var parsedDueDate1 = new Date(parseInt(adata.DueDate.substr(6)));
                                    var date1 = ($filter('date')(parsedDueDate1, 'dd/MM/yyyy')).toString();
                                    $scope.Attribute.DueDate = date1;
                                }

                                var SerialList = [];
                                if (checkCategory.CategoryName == "Hardware") {
                                    angular.forEach(warrentySerialNoList, function (serialNoByPBDetailId) {

                                        var SerialNo = {
                                            SerialNo: serialNoByPBDetailId.SerialNo,
                                            PBDetailSerialId: serialNoByPBDetailId.PBDetailSerialId,
                                            IsChecked: false
                                        };
                                        SerialList.push(SerialNo);
                                    });

                                }

                                $scope.Attribute.SerialList = SerialList;
                                if ($scope.Attribute.DeliveryQuantity <= $scope.Attribute.OrderQty) {
                                    $scope.inv_stockDeliveryDetailAttributeLst.push($scope.Attribute);
                                 
                                    console.log('$scope.inv_stockDeliveryDetailAttributeLst', $scope.inv_stockDeliveryDetailAttributeLst)
                                }

                                flag = true;
                                //angular.foreach($scope.inv_stockdeliverydetaillist, function (aitem) {
                                //    if (aitem.itemid == itemcombination.itemid) {
                                //        flag = false;
                                //    }
                                //});
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

                                    if (checkCategory.CategoryName == "Finished Goods")
                                        Item.OrderProQty = "Production Qty";
                                    else
                                        Item.OrderProQty = "Order Qty";

                                    //var a = ItemCombination.AttributeNames.split(',');
                                    //for (var i = 0; i < a.length; i++) {
                                    //    var val = a[i].split(':');
                                    //    HeaderOfAttribute.push(val[0].trim());
                                    //}
                                    //Item.OrderQty = angular.copy(adata.OrderQty);
                                    //Item.OrderQty  = angular.copy(ItemCombination);
                                    //$scope.ItemOrderQty = {};
                                    //angular.forEach($scope.inv_stockDeliveryDetailAttributeLst, function (data) {
                                    //    $scope.ItemOrderQty= angular.copy(data.OrderQty);
                                    //});
                                    //Item.OrderQty = $scope.ItemOrderQty;
                                  
                                    Item.SalesOrderDetailId = angular.copy(adata.SalesOrderDetailId);
                                    Item.OrderQty = angular.copy(adata.OrderQty);
                                    Item.HeaderOfAttribute = ["Description"];

                                    $scope.inv_stockDeliveryDetailList.push(angular.copy(Item));
                                   // $scope.inv_stockDeliveryDetailList = angular.copy($scope.inv_stockDeliveryDetailList);
                                    console.log('$scope.inv_stockDeliveryDetailList', $scope.inv_stockDeliveryDetailList)
                                }
                            }
                            else if (checkCategory.CategoryName == "Hardware" && !warrentySerialNoList.length) {
                                alertify.log(ItemCombination.Combination.split(' - ')[0] + " Serial No. Not Found", "error", "5000");
                            }
                           
                        });
                    }
                   
                });
           
           

           // alertify.log("msgShowText" + msgShowText+"error", "5000");
          

           
            //GetByCombinationand();            
        });
    }

    $scope.CountCheckedDeliveryQuantity = function (stockDeliveryDetails) {
        var qty = 0;
        angular.forEach(stockDeliveryDetails.SerialList, function (sData) {
            if (sData.IsChecked) {
                qty++;
                if (stockDeliveryDetails.DeliveredQty < qty) {
                    sData.IsChecked = false;
                }

            }
        });
       
        stockDeliveryDetails.DeliveryQuantity = qty;
        $scope.SumAttQty();
    };

    $scope.getMaxDeliveryNo = function () {
        var date = $('#txtDeliveryDate').val();
        $scope.inv_StockDelivery.BillDate = date;
    }

    $scope.resetForm = function () {
        Load();
        Clear();
        $scope.IsNonSO = false;
        $scope.deliveryForm.$setPristine();
        $scope.deliveryForm.$setUntouched();
    }

    $scope.resetFormChk = function () {
        Clear();
        $scope.deliveryForm.$setPristine();
        $scope.deliveryForm.$setUntouched();
    }

    $scope.addChallanItem = function () {
        var itemChk = Enumerable.From($scope.StockDeliveryNonSODetailList).Where("$.ItemDescription.toLowerCase() === '" + $scope.inv_StockDeliveryNonSODetail.ItemDescription.toLowerCase() + "'").FirstOrDefault();
        if (itemChk && itemChk !== null) {
            alertify.log("Item already added to list", "error", "5000");
            return;
        }
        $scope.StockDeliveryNonSODetailList.push($scope.inv_StockDeliveryNonSODetail);
        $scope.inv_StockDeliveryNonSODetail = {};
        $('#txtItemDesc').focus();
    }

    $scope.removeItem = function (aDetail) {
        var ind = $scope.StockDeliveryNonSODetailList.indexOf(aDetail);
        $scope.StockDeliveryNonSODetailList.splice(ind, 1);
    }

    $scope.getMaxchallanNo = function () {
        var date = $('#txtChallanDate').val();
        $http({
            url: '/Delivery/GetMaxDeliveryNo?deliveryDate=' + date,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.inv_StockDeliveryNonSO.DeliveryNo = parseInt(data);
        });
    }

    $scope.SaveChallan = function () {
        if ($scope.CreatePermission) {
            alertify.confirm("Are you sure to save?", function (e) {
                if (e) {
                    var poDate = $("#txtChallanDate").val().split("/");
                    $scope.inv_StockDeliveryNonSO.DeliveryDate = new Date(poDate[2], poDate[1] - 1, poDate[0]);

                    var parms = JSON.stringify({ inv_stockDeliveryNonSO: $scope.inv_StockDeliveryNonSO, inv_stockDeliveryNonSODetailLst: $scope.StockDeliveryNonSODetailList });
                    $http.post('/DeliveryNonSO/SaveDeliveryNonSO', parms).success(function (data) {
                        if (data > 0) {
                            alertify.log('Challan Saved Successfully!', 'success', '5000');
                            $scope.resetForm();
                        } else {
                            alertify.log('Server Errors!', 'error', '5000');
                        }
                    }).error(function (data) {
                        alertify.log('Server Errors!', 'error', '5000');
                    });
                }
            })
        }
        else {
            alertify.log('You do not have permission to save!', 'error', '5000');
        }
    }


    $scope.OpenReport = function (DeliveryId) {
        $window.open("#/DeliveryReport", "popup", "width=850,height=550,left=280,top=80");

        $cookieStore.put("DeliveryId", DeliveryId);
        event.stopPropagation();

    };

});
