app.controller("InternalWorkOrderEntryController", function ($scope, $cookieStore, $http, $window, $filter, FileUploadService) {
    Clear();

    function Clear() {



        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        GetPagedIwo($scope.currentPage);
        $scope.iwoListPaged = [];
        $scope.salesOrdDate = "";
        $scope.isValidForSave = true;
        $scope.IsFinishedGoods = true;
        $scope.LoginUser = $cookieStore.get('UserData');
        $scope.UserId = $scope.LoginUser.UserId;
        $scope.ScreenId = $cookieStore.get('InternalWorkOrderScreenId');
        $scope.found = true;
        $scope.iwolist = [];
         $scope.iwoListForGrid = [];
        $scope.ddlInternalWorkOrder = null;

        $scope.IwoDdlFilterList = [];

        $scope.VarietyList = [];
        $scope.inv_InternalOrderDetailList = [];
        $scope.iwo = {};
        $scope.FromDepartmentList = [];
        $scope.ToDepartmentList = [];

        $scope.sockQtyWithRequestQty = [];
        $scope.inv_InternalOrderDetailListItem = [];

        $scope.iwo.InternalWorkOrderId = 0;
        $scope.internalWorkOrder = {};
        $scope.internalWorkOrder.SalesOrderId = 0;
        $scope.internalWorkOrder.InternalWorkOrderNo = "";
        var currentDate = new Date();
        $scope.internalWorkOrder.InternalWorkOrderDate = $filter('date')(currentDate.toJSON().slice(0, 10), 'dd/MM/yyyy');
        $scope.iwo.IsActive = true;
        $scope.btnSave = "Save";
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        $scope.btnShowDelete = false;
        GetByCombinationand();
        GetAllVariety();
        GetAllEmployee();
        GetAllFactory();
        GetTopSalesOrderDetailData();
        GetUsersPermissionDetails();
        //ScreenLock();
        GetByCombinationLike();
        GetAllStock();

        // GetrawMatrialStockCheck();

        $scope.QtyPerRollList = [{ Qty: '500' }, { Qty: '1000' }, { Qty: '2000' }, { Qty: '2500' }, { Qty: '5000' }, { Qty: '10000' }, { Qty: '3125' }, { Qty: '2400' }];
        $scope.test = false;


        //File Upload Method

        ClearFileUpload();

        $scope.ShowImageName = false;
    }

    function ClearFileUpload() {

        $scope.Message = "";
        $scope.FileInvalidMessage = "";
        $scope.SelectedFileForUpload =[];
        $scope.FileDescription = "";
        $scope.IsFormSubmitted = false;
        $scope.IsFileValid = false;
        $scope.IsFormValid = false;

    }



    $scope.QtyPerRollTextChange = function (qty) {
        if (qty != undefined && qty != null && qty != "") {
            var SingleSearchItem = qty.split(" ");
            var SearchCriteria = "";
            myHilitor = new Hilitor2("SearchResultsQPR");
            myHilitor.remove();
            for (var i = 0; i < SingleSearchItem.length; i++) {
                myHilitor.setMatchType("open");
                if (SearchCriteria == "") {
                    SearchCriteria = "~($.Qty).toUpperCase().indexOf('" + SingleSearchItem[i] + "'.toUpperCase())";
                } else {
                    SearchCriteria += " && ~($.Qty).toUpperCase().indexOf('" + SingleSearchItem[i] + "'.toUpperCase())";
                }

                myHilitor.apply(SingleSearchItem[i]);
            }

            $scope.QtyPerRollSearch = Enumerable.From($scope.QtyPerRollList).Where(SearchCriteria).Take(10).ToArray();
            $scope.VisibilityOfSuggession = true;
        }
        else {
            $scope.QtyPerRollSearch = Enumerable.From($scope.QtyPerRollList).Take(10).ToArray();
            $scope.VisibilityOfSuggession = false;
        }
    }

    $scope.QtyPerRollSuggestionClick = function () {
        $scope.VisibilityOfSuggession = false;
        $scope.QtyPerRollSearch = [];
    }

    function GetAllFactory() {
        $http({
            url: '/Department/GetAllFactory',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Storelist = data;
            console.log('Load for Storelist', $scope.Storelist);
        });
    }

    function GetByCombinationLike() {
      //  var searchCriteria = "C.CategoryName='Raw Materials'";
        $http({
           // url: '/Item/GetItemForIwoDynamic?searchCriteria=' + searchCriteria,
            url:'/Item/GetByCombinationLike',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AllRawCombination = JSON.parse(data);
            $scope.AllRawMaterialAndCombination = Enumerable.From($scope.AllRawCombination).Where(function (x) {
                    return x.CategoryName =="Raw Materials";
                }).ToArray();
            console.log('AllRawMaterialAndCombination',$scope.AllRawMaterialAndCombination);
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

   
    function GetTopSalesOrderDetailData() {
        $scope.iwoListForGrid = [];
        //var criteria = "A.IsApproved = 1 AND SalesOrderId NOT IN (SELECT SalesOrderId FROM inv_InternalWorkOrder)";
        var criteria = "A.IsApproved = 1 AND (SELECT COUNT(ItemAddAttId) FROM pos_SalesOrderDetail WHERE SalesOrderId = SO.SalesOrderId) > (SELECT COUNT(FinishedItemId) FROM inv_InternalWorkOrderDetail IWOD INNER JOIN inv_InternalWorkOrder IWO ON IWOD.InternalWorkOrderId = IWO.InternalWorkOrderId WHERE IWO.SalesOrderId = SO.SalesOrderId)";
        //var criteria = "A.IsApproved = 1";
        $http({
            url: '/SalesOrder/GetSalesOrderDynamic?searchCriteria=' + criteria + "&orderBy='SalesOrderDate'",
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
            $scope.iwoListForGrid = data;
            $scope.IwoDdlFilterList = Enumerable.From(data).Distinct(function (x) {
                return x.CompanyId
            }).ToArray();

            console.log('iwo Distinct Data', $scope.IwoDdlFilterList);
            console.log('iwo load for Grid ', $scope.iwolist);




        });
    }

    $scope.CompanyLoadForGridIwo = function (companyId) {

        $scope.inv_InternalOrderDetailListItem = [];
        $scope.iwolist = [];
        $scope.btnSave = "Save";
       
        $scope.ddlPreparedBy = null;
        $scope.ddlStore = null;
        $scope.CompanyIdList = companyId;
       // console.log($scope.CompanyIdList);
        angular.forEach($scope.iwoListForGrid, function (aData) {
            if ($scope.CompanyIdList == aData.CompanyId) {
               
                $scope.iwolist.push(aData);
                
            }
            
        });

        $scope.btnSave = "Save";
       
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

    function GetConfirmationMessageForAdmin() {
        $http({
            url: '/InternalWorkOrder/GetConfirmationMessageForAdmin',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ConfirmationMessageForAdmin = (data === 'true');
        });
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


    $scope.FileUpload = function () {
        FileUploadService.UploadFile($scope.SelectedFileForUpload).then(function (d) {
            alert("upload successfull!!!");
            console.log(d);
          
        }, function (e) {
            alert(e);
        });
    }


    


    function SaveIWO(f, iwoDetialList) {

        $scope.internalWorkOrder.InternalWorkOrderDate = f;
        $scope.internalWorkOrder.DepartmentId = $scope.ddlStore.DepartmentId;
        $scope.internalWorkOrder.PreparedById = $scope.ddlPreparedBy.EmployeeId;
        $scope.internalWorkOrder.CreatorId = $scope.LoginUser.UserId;
        $scope.internalWorkOrder.UpdatorId = $scope.LoginUser.UserId;

        for (var i = 0; i < $scope.SelectedFileForUpload.length; i++) {
           
            FileUploadService.UploadFile($scope.SelectedFileForUpload[i]).then(function (d) {
                //alert("upload successfull!!!");
               // console.log(d);

            }, function (e) {
                alert(e);
                });
            
        }

       


        var inv_InternalWorkOrderDetailList = [];
        for (var i = 0; i < iwoDetialList.length; i++) {
            if ($scope.btnSave != "Save") {
                iwoDetialList[i].FinishedItemAddAttId = iwoDetialList[i].FinishedItemId;
            }
            var dDate = iwoDetialList[i].DeliveryDate.split("/");
            var fData = new Date(dDate[2], dDate[1] - 1, dDate[0]);
            if (iwoDetialList[i].CategoryName == "Finished Goods" && iwoDetialList[i].SubCategoryName != "Barcode Ribbon (R)") {
                if (angular.isUndefined(iwoDetialList[i].ddlRollDirection)) {
                    iwoDetialList[i].RollDirection = "N/A";
                }



                var imgName = {};
               

                

                if (typeof (iwoDetialList[i].ArtWork) != "string") {
                    angular.forEach(iwoDetialList[i].ArtWork, function (adata) {
                        if (adata.name != null) {
                            imgName = 'ArtWork' + '_' + adata.name;
                        }

                    });

                } else {
                    imgName = iwoDetialList[i].ArtWork;
                  
                }

               

                var iwoOrderDetail = {
                    InternalWorkOrderDetailId: iwoDetialList[i].InternalWorkOrderDetailId,
                    InternalWorkOrderId: iwoDetialList[i].InternalWorkOrderId,
                    FinishedItemId: iwoDetialList[i].FinishedItemAddAttId,
                    //ItemAddAttId: iwoDetialList[i].CombinationList[0].ItemAddAttId,
                    ItemId: iwoDetialList[i].ddlItem.ItemId,
                    Core: parseFloat(iwoDetialList[i].ddlCore),
                    QtyPerRoll: iwoDetialList[i].QtyPerRoll,
                    RollDirection: iwoDetialList[i].ddlRollDirection,
                    DeliveryDate: fData,
                    OrderQty: iwoDetialList[i].OrderQty,
                    SalesOrderDetailId: iwoDetialList[i].SalesOrderDetailId,
                   
                    CategoryName: iwoDetialList[i].CategoryName,

                    Ups: iwoDetialList[i].Ups,
                    Radius: iwoDetialList[i].Radius,
                    Color: iwoDetialList[i].Color,

                    DetailRemarks: iwoDetialList[i].DetailRemarks,

                    ArtWork:  imgName

                }
                inv_InternalWorkOrderDetailList.push(iwoOrderDetail);
            } else {


                var iwoOrderDetail = {
                    InternalWorkOrderDetailId: iwoDetialList[i].InternalWorkOrderDetailId,
                    InternalWorkOrderId: iwoDetialList[i].InternalWorkOrderId,
                    FinishedItemId: iwoDetialList[i].FinishedItemAddAttId,
                    ItemId: 0,
                    Core: 0.00,
                    QtyPerRoll: 0,
                    RollDirection: "N/A",
                    DeliveryDate: fData,
                    OrderQty: iwoDetialList[i].OrderQty,
                    SalesOrderDetailId: iwoDetialList[i].SalesOrderDetailId,

                    
                    CategoryName: iwoDetialList[i].CategoryName,

                    Ups: iwoDetialList[i].Ups,
                    Radius: iwoDetialList[i].Radius,
                    Color: iwoDetialList[i].Color,

                    DetailRemarks: iwoDetialList[i].DetailRemarks,

                    ArtWork:  imgName


                }

                inv_InternalWorkOrderDetailList.push(iwoOrderDetail);

            }


        }

        $.ajax({
            url: "/InternalWorkOrder/Save",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({ inv_InternalWorkOrder: $scope.internalWorkOrder, inv_InternalWorkOrderDetailList: inv_InternalWorkOrderDetailList }),
            success: function (data) {
                $scope.ddlStore = null;
                if (data > 0 || $scope.btnSave=="Update") {
                    if ($scope.btnSave == "Update") {

                        alertify.log('Internal Work Order Update Successfully!', 'success', '5000');
                      
                    }
                    else {
                        alertify.log('Internal Work Order Saved Successfully!', 'success', '5000');
                        $window.open("#/IWOReport", "popup", "width=850,height=550,left=280,top=80");
                        $cookieStore.put("IWOID", data);
                    }
                  
                   
                    event.stopPropagation();
                   // $window.open("/ErpReports/RV_inv_InternalWorkOrderByInternalWorkOrderId.aspx?internalWorkOrderId=" + data, "_blank", "width=1150,height=630,left=125,top=25");
                    Clear();
                   
                    GetPagedIwo(1);
                    
                    $scope.internalWorkOrderForm.$setPristine();
                    $scope.internalWorkOrderForm.$setUntouched();
                   
                }
                //else {
                //    $scope.btnSave == "Save";

                //    alertify.log('Internal Work Order Update Successfully!', 'success', '5000');
                //    $window.open("#/IWOReport", "popup", "width=850,height=550,left=280,top=80");
                //    $cookieStore.put("IWOID", data);
                //    event.stopPropagation();
                //    // $window.open("/ErpReports/RV_inv_InternalWorkOrderByInternalWorkOrderId.aspx?internalWorkOrderId=" + data, "_blank", "width=1150,height=630,left=125,top=25");
                //    Clear();

                //    GetPagedIwo(1);
                //    window.scrollTo(0, 0);
                //    $scope.internalWorkOrderForm.$setPristine();
                //    $scope.internalWorkOrderForm.$setUntouched();
                //}
            }, error: function (msg) {
                alertify.log('Server Save Errors!', 'error', '10000');
            }
        });

    }







    function GetAllStock() {

        $http({
            url: '/StockValuation/GetAll_CurrentStock',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.sockQtyWithRequestQtyList = [];
            $scope.sockQtyWithRequestQtyList = data;
            $scope.sockQtyWithRequestQty = Enumerable.From($scope.sockQtyWithRequestQtyList).Where(function (x) {
                return x.DepartmentName == "Production (U)" || x.DepartmentName == "Store (U)" || x.DepartmentName == "Supply Chain Management";
            }).ToArray();





        });
    }

    // Check Stock 
    $scope.checkDdlStockRamatrial = function (itemId) {
        $scope.itemId = itemId;
      

        $scope.RawMatrialstockList = [];
        angular.forEach($scope.sockQtyWithRequestQty, function (aData) {

            if ($scope.itemId == aData.ItemId) {
                var stockItem = {};
                stockItem.CurrentQuantity = aData.CurrentQuantity;
                stockItem.DepartmentName = aData.DepartmentName;
                $scope.RawMatrialstockList.push(stockItem);
                console.log('stockList Test', $scope.RawMatrialstockList);
            }
        });

    }


    $scope.getWorkOrderDetails = function (iwo) {
        $scope.inv_InternalOrderDetailList = [];
        $scope.inv_InternalOrderDetailListItem = [];
      
        console.log('Iwo Item', iwo);
        $http({
            url: '/SalesOrder/GetItemForIWO?salesOrderId=' + iwo.SalesOrderId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            var sOrdDate = iwo.SalesOrderDate.split("/");
            $scope.salesOrdDate = new Date(sOrdDate[2], (parseInt(sOrdDate[1]) - 1), sOrdDate[0]);

            $scope.internalWorkOrder.InternalWorkOrderNo = iwo.SalesOrderNo.replace("SO", "IWO");
            var rawMaterial = {
                Core: 0,
                QtyPerRoll: 0,
                RollDirection: "",
                DeliveryDate: ""
            }
            angular.forEach(data, function (adata) {
                var rawItemList = [];
                $scope.internalWorkOrder.SalesOrderId = iwo.SalesOrderId;
                rawItemList = Enumerable.From($scope.AllRawMaterialAndCombination)
                    .Select(function (x) {
                        return {
                            'ItemName': x['ItemName'],

                            'ItemId': x['ItemId']
                        };
                    }).ToArray();



                var ItemCombination = Enumerable.From($scope.AllCombinationlist).Where('$.ItemId==' + adata.ItemAddAttId).FirstOrDefault();
                var checkCategory = Enumerable.From($scope.VarietyList).Where('$.ItemId==' + ItemCombination.ItemId).FirstOrDefault();
                var Department = [];
                var currentQty = [];

                angular.forEach($scope.sockQtyWithRequestQty, function (data) {
                    if (adata.ItemAddAttId == data.ItemId) {

                        Department.push({ 'DepartmentName': data.DepartmentName });
                        currentQty.push({ 'CurrentQuantity': data.CurrentQuantity });

                    }
                });





                var dueDate = "";
                var res1 = adata.DueDate.substring(0, 5);
                if (res1 == "/Date") {
                    var parsedDueDate1 = new Date(parseInt(adata.DueDate.substr(6)));
                    var date1 = ($filter('date')(parsedDueDate1, 'dd/MM/yyyy')).toString();
                    dueDate = date1;
                }


                if (checkCategory.CategoryName === "Finished Goods" && checkCategory.SubCategoryName != "Barcode Ribbon (R)") {
                    var CombinationList = [];
                    var RMaterialList = [];

                    RMaterialList.push(rawMaterial);



                    // var HeaderOfAttribute = ['Raw Material', 'Core (mm)', 'Qty Per Roll', 'Roll Direction', 'Delivery Date'];
                    var inv_InternalOrderDetai = {
                        ItemId: ItemCombination.ItemId,
                        ItemName: ItemCombination.Combination,
                        FinishedItemAddAttId: ItemCombination.ItemId,
                        Barcode: ItemCombination.Barcode,
                        RawItemList: rawItemList,

                        OrderQty: adata.OrderQty,
                        DeliveryDate: dueDate,
                        DeliveryDate2: dueDate,
                        ddlItem: ItemCombination.ItemId,

                        Ups: adata.Ups,
                        Radius: adata.Radius,
                        Color: adata.Color,
                        DetailRemarks: adata.DetailRemarks,

                        DepartmentName: Department,
                        CurrentQuantity: currentQty,

                        RawMaterialList: RMaterialList,
                        //HeaderOfAttribute: HeaderOfAttribute,
                        CategoryName: checkCategory.CategoryName,
                        SubCategoryName: checkCategory.SubCategoryName,
                        SalesOrderDetailId: adata.SalesOrderDetailId,
                        ArtWork: adata.ArtWork,
                      
                    }
                    $scope.inv_InternalOrderDetailList.push(inv_InternalOrderDetai);
                    $scope.inv_InternalOrderDetailListItem.push(inv_InternalOrderDetai);

                    console.log('Iwo List Item', $scope.inv_InternalOrderDetailList);
                } else {
                    var HeaderOfAttribute = ["Delivery Date"];
                    var inv_InternalOrderDetai = {
                        ItemId: ItemCombination.ItemId,
                        ItemName: ItemCombination.Combination,
                        FinishedItemAddAttId: ItemCombination.ItemId,
                        Barcode: ItemCombination.Barcode,
                        OrderQty: adata.OrderQty,
                        SalesOrderDate: adata.SalesOrderDate,
                        DeliveryDate: dueDate,
                        DeliveryDate2: dueDate,
                        Ups: adata.Ups,
                        Radius: adata.Radius,
                        Color: adata.Color,
                        DetailRemarks: adata.DetailRemarks,

                        DepartmentName: Department,
                        CurrentQuantity: currentQty,

                        HeaderOfAttribute: HeaderOfAttribute,
                        CategoryName: checkCategory.CategoryName,
                        SubCategoryName: checkCategory.SubCategoryName,
                        SalesOrderDetailId: adata.SalesOrderDetailId,
                        ArtWork: adata.ArtWork,
                        ddlItem: adata.ItemAddAttId

                    }
                    $scope.inv_InternalOrderDetailList.push(inv_InternalOrderDetai);
                    $scope.inv_InternalOrderDetailListItem.push(inv_InternalOrderDetai);
                }
            });


            console.log('Iwo List Item', $scope.inv_InternalOrderDetailList);
            $("#txtPlaceOfDelivery").focus();
        });
    }


    $scope.departmentForIwoSet = function (deptId) {
      
        getLoadFordropdown(deptId);

    }
    function getLoadFordropdown(deptId) {
    //    $scope.btnSave = "Save";
        $scope.inv_InternalOrderDetailListItem = [];
        var listForItem = $scope.inv_InternalOrderDetailList;
       
        angular.forEach(listForItem, function (adata) {
            if (deptId == 21) {
                if (adata.CategoryName === "Finished Goods" && adata.SubCategoryName != "Barcode Ribbon (R)") {
                 
                    $scope.inv_InternalOrderDetailListItem.push(adata);
                    console.log('Click Of Obj', $scope.inv_InternalOrderDetailListItem);

                }
            } else if (deptId == 1065) {
                if (adata.CategoryName === "Hardware") {
             
                    $scope.inv_InternalOrderDetailListItem.push(adata);
                    console.log('Click Of Obj hardware', $scope.inv_InternalOrderDetailListItem);

                }
            }

        });

    }

   


    $scope.CheckDuplicateIWONo = function (internalWorkOrderNo) {
        var date = $("#txtIwoDate").val();
        if (date == "") {
            $("#txtIwoDate").focus();
            alertify.log('Please select date.', 'error', '5000');
            return;
        }

        if (angular.isUndefined($scope.internalWorkOrder.InternalWorkOrderNo) || $scope.internalWorkOrder.InternalWorkOrderNo == null) {
            $("#txtReceiveNo").focus();
            alertify.log('IWO No. is required.', 'error', '5000');
            return;
        }

        $http({
            url: '/InternalWorkOrder/CheckDuplicateIWO?InternalWorkOrderNo=' + $scope.internalWorkOrder.InternalWorkOrderNo + "&date=" + date,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            console.log('Iwo Data', data);
            if (data.length > 0) {
                alertify.log("Internal Work Order No. ' <b>" + $scope.internalWorkOrder.InternalWorkOrderNo + "<b> '" + " already exists!", "error", "5000");
                $scope.internalWorkOrder.InternalWorkOrderNo = "";
                $('#InternalWorkOrderNo').focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });

    };

    //$scope.getRawCombinationList = function (rawItem, inv_InternalOrderDetail) {
    //    var combinationList = [];
    //    var selectedRow = Enumerable.From($scope.inv_InternalOrderDetailList)
    //                     .Where('$.FinishedItemAddAttId==' + inv_InternalOrderDetail.FinishedItemAddAttId)
    //                     .FirstOrDefault();
    //    selectedRow.CombinationList = combinationList;
    //    if (rawItem != null) {
    //        combinationList = Enumerable.From($scope.AllRawCombination)
    //                          .Where("$.ItemId ==" + rawItem.ItemId)
    //                          .OrderBy("$.Combination")
    //                          .Select(function (x) {
    //                              return {
    //                                  'Combination': x['Combination'],
    //                                  'ItemAddAttId': x['ItemAddAttId']
    //                              };
    //                          })
    //                          .ToArray();

    //        //var selectedRow = Enumerable.From($scope.inv_InternalOrderDetailList)
    //        //                  .Where('$.ItemId==' + inv_InternalOrderDetail.ItemId)
    //        //                  .FirstOrDefault();

    //        selectedRow.CombinationList = combinationList;
    //    }
    //}

    $scope.RemoveProduct = function (ProductDtlRow) {
        var ind = $scope.inv_InternalOrderDetailListItem.indexOf(ProductDtlRow);
        $scope.inv_InternalOrderDetailListItem.splice(ind, 1);
        console.log($scope.inv_InternalOrderDetailListItem);
    }

    $scope.saveInternalWorkOrder = function () {
        $scope.isValidForSave = true;
        //var dateText = $scope.internalWorkOrder.InternalWorkOrderDate;
        var date = $scope.internalWorkOrder.InternalWorkOrderDate.split("/")
        var f = new Date(date[2], date[1] - 1, date[0]);

        if (f < $scope.salesOrdDate) {
            //$scope.internalWorkOrder.InternalWorkOrderDate = dateText;
            alertify.log('IWO date cannot before Sales Order Date!', 'error', '5000');
            return;
        }

        var iwoDetialList = $scope.inv_InternalOrderDetailListItem;

        for (var i = 0; i < iwoDetialList.length; i++) {
            if (iwoDetialList[i].CategoryName == "Finished Goods" && iwoDetialList[i].SubCategoryName != "Barcode Ribbon (R)" &&
                (angular.isUndefined(iwoDetialList[i].ddlCore) || iwoDetialList[i].ddlCore == null ||
                    angular.isUndefined(iwoDetialList[i].ddlItem) || iwoDetialList[i].ddlItem == null ||
                    angular.isUndefined(iwoDetialList[i].ddlRollDirection) || iwoDetialList[i].ddlRollDirection == null ||
                    iwoDetialList[i].Core < 1 || iwoDetialList[i].QtyPerRoll < 1 || angular.isUndefined(iwoDetialList[i].QtyPerRoll) ||
                    iwoDetialList[i].OrderQty < 1 || angular.isUndefined(iwoDetialList[i].DeliveryDate))) {
                $scope.isValidForSave = false;
                break;
            }
        }

        if (!$scope.isValidForSave) {
            alertify.log('Please fill all required field in details section!', 'error', '5000');
            return;
        }

        alertify.confirm("Are you sure to save?", function (e) {
            if (e) {
                SaveIWO(f, iwoDetialList);
            }
        });
    }

   

    $scope.getMaxIwoNo = function () {
        //#region  Date chekc
        var date = $('#txtIwoDate').val();

        if ($scope.inv_InternalOrderDetailList.length) {
            var form = date.split("/");
            var iwoDate = new Date(form[2], form[1] - 1, form[0]);

            for (var i = 0; i < $scope.inv_InternalOrderDetailList.length; i++) {
                var delDate = $scope.inv_InternalOrderDetailList[i].DeliveryDate.split("/");
                delDate = new Date(delDate[2], delDate[1] - 1, delDate[0]);
                if (iwoDate.setHours(0, 0, 0, 0) > delDate.setHours(0, 0, 0, 0)) {
                    $('#txtIwoDate').val("");
                    alertify.log('IWO Date Must Be Before Than Delivery Date.', 'error', '5000');
                    return;
                }
            }
        }
        GetMaxIwoNo(date);
        //#endregion      
    }

    $scope.resetForm = function () {
        $scope.ddlStore = null;
        Clear();
        $scope.internalWorkOrderForm.$setPristine();
        $scope.internalWorkOrderForm.$setUntouched();
    }


    $("body").on("focus", "[id=IWODetailsTable] .DeliveryDatePicker", function () {
        $(this).datepicker({
            autoclose: true,
            todayHighlight: true,
            format: 'dd/mm/yyyy'
        });

    });

    $("body").on("change", "[id=IWODetailsTable] .DeliveryDatePicker", function () {
        var deliDate;
        if (!angular.isUndefined($scope.internalWorkOrder.InternalWorkOrderDate)) {
            var iwoAr = $scope.internalWorkOrder.InternalWorkOrderDate.split("/");
            var iwoDate = new Date(iwoAr[2], iwoAr[1] - 1, iwoAr[0]);

            deliDate = $(this).val();
            var deliveryArr = $(this).val().split("/");

            var deliveryDate = new Date(deliveryArr[2], deliveryArr[1] - 1, deliveryArr[0])

            if (deliveryDate < iwoDate) {
                $scope.isValidForSave = false;
                $(this).val("");
                alertify.log("Delivery Date must be less than IWO Date", "error", "5000");
            } else {
                angular.forEach($scope.inv_InternalOrderDetailList, function (aIWO) {
                    aIWO.DeliveryDate = deliDate;
                })
            }
        }
    });


    //Get Paged


    

    $("#txtFromDateForIWO").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.FormDateChangeForSO = function () {
        $("#txtFromDateForIWO").focus();
        $("#txtFromDateForIWO").trigger("click");
    }


    $("#txtToDateForIWO").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.ToDateChangeForSO = function () {
        $("#txtToDateForIWO").focus();
        $("#txtToDateForIWO").trigger("click");
    }

    $scope.reloadBtn = function () {
        $('#txtFromDateForIWO').val('');
        $('#txtToDateForIWO').val('');
        $('#IWOAndCompany').val('');
        $scope.FromDate = "";
        $scope.ToDate = "";
        $scope.SearchIWOAndCompanyName = null;
        GetPagedIwo(1);
    }

    $scope.IWOSearch = function () {
        GetPagedIwo(1);

    }

    function GetPagedIwo(curPage) {

        if (curPage == null) curPage = 1;
        var startRecordNo = ($scope.PerPage * (curPage - 1)) + 1;



        var formDateChange = $("#txtFromDateForIWO").val();
        $scope.FromDate = formDateChange.split('/').reverse().join('-');

        var toDateChange = $("#txtToDateForIWO").val();
        $scope.ToDate = toDateChange.split('/').reverse().join('-');

        var SearchCriteria = "";

       // SearchCriteria = "[IWO].[IsApproved]=1";

        if ($scope.SearchIWOAndCompanyName != undefined && $scope.SearchIWOAndCompanyName != "" && $scope.FromDate != "" && $scope.ToDate != "") {
            SearchCriteria = "([IWO].[InternalWorkOrderDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "') and ([IWO].[InternalWorkOrderNo] LIKE '%" + $scope.SearchIWOAndCompanyName + "%' OR [SO].[CompanyNameOnBill] LIKE '%" + $scope.SearchIWOAndCompanyName + "%')";
            //alert("Name, Date Success!!!!!");
        }
        else if ($scope.SearchIWOAndCompanyName !== undefined && $scope.SearchIWOAndCompanyName != null && $scope.SearchIWOAndCompanyName != "") {
            SearchCriteria = "[IWO].[InternalWorkOrderNo] LIKE '%" + $scope.SearchIWOAndCompanyName + "%' OR [SO].[CompanyNameOnBill] LIKE '%" + $scope.SearchIWOAndCompanyName + "%'";
            //alert("Name Success!!!!!");
        }
        else if ($scope.FromDate != "" && $scope.ToDate != "") {
            SearchCriteria = "[IWO].[InternalWorkOrderDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "'";
            //alert("Date Success!!!!!");
        }
       
        //


        //var SearchCriteria = "[IWO].[IsApproved]=0";
       

        $http({
            url:encodeURI('/InternalWorkOrder/GetPagedIWO?startRecordNo=' + startRecordNo + '&rowPerPage=' + $scope.PerPage + "&whereClause=" + SearchCriteria + '&rows=' + 0),
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            $scope.iwoListPaged = data.ListData;
            console.log('IWO Groi List Edit',$scope.iwoListPaged);
            $scope.total_count = data.TotalRecord;

            if ($scope.iwoListPaged.length > 0) {
                angular.forEach($scope.iwoListPaged, function (aSd) {
                    var res1 = aSd.InternalWorkOrderDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.InternalWorkOrderDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aSd.InternalWorkOrderDate = date1;
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
            GetPagedIwo($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetPagedIwo($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetPagedIwo($scope.currentPage);
        }
        //  }


    }

    //$scope.OpenReport = function (InternalWorkOrderId) {
    //    $window.open("/ErpReports/RV_inv_InternalWorkOrderByInternalWorkOrderId.aspx?internalWorkOrderId=" + InternalWorkOrderId, "_blank", "width=1150,height=630,left=125,top=25");
    //    event.stopPropagation();
    //}


    $scope.OpenReport = function (iwoId) {
        $window.open("#/IWOReport", "popup", "width=850,height=550,left=280,top=80");

        $cookieStore.put("IWOID", iwoId);
        event.stopPropagation();

    };

   
    

    
   

    $scope.$watch("internalWorkOrderForm.$valid", function (isValid) {
        $scope.IsFormValid = isValid;
    });



    // THIS IS REQUIRED AS File Control is not supported 2 way binding features of Angular
    // ------------------------------------------------------------------------------------
    //File Validation
    $scope.ChechFileValid = function (file) {
        var isValid = false;
        if ($scope.SelectedFileForUpload != null) {
            //if ((file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif' || file.type == 'application/pdf') && file.size <= (512 * 1024)) {
            if ((file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif' || file.type == 'application/pdf')) {
                $scope.FileInvalidMessage = "";
                isValid = true;
            }
            else {
                $scope.FileInvalidMessage = "Selected file is Invalid. (only file type png, jpeg and gif and 512 kb size allowed)";
            }
        }
        else {
            $scope.FileInvalidMessage = "Image required!";
        }
        $scope.IsFileValid = isValid;
    };

    //File Select event 
    //$scope.SelectFile = function (file) {
    //    $scope.image_source = "";
    //    $scope.SelectedFileForUpload = file[0];
    //    console.log(' $scope.SelectedFileForUpload ', $scope.SelectedFileForUpload);
    //    var reader = new FileReader();

    //    reader.onload = function (event) {
    //        $scope.image_source= event.target.result
    //        $scope.$apply()
            
    //        console.log('image_source', $scope.image_source);
    //    }
    //    // when the file is read it triggers the onload event above.
    //    reader.readAsDataURL(file[0]);

    //    $('#ImagePreview').modal('show'); 
        

    //}


    $scope.ClearImage = function (id) {
        $scope.inv_InternalOrderDetailListItem[id].thumb = [];

        $scope.inv_InternalOrderDetailListItem[id].ArtWork = [];
        $scope.SelectedFileForUpload[id] = [];

        angular.element(`input[name='image_${id}']`).val(null);
        angular.element(`input[name='imageUpdateName_${id}']`).val(null);
        angular.element(`input[value='']`).val(null);
       // $scope.ImageText[id];
       

    };

    

    $scope.SelectFile = function (data) {
        //$scope.ShowImageName = true;
        $scope.SelectedFileForUpload.push(data.files[0]); //= data.files[0];
        var SelectedFileForUploadName = data.files[0].name; //= data.files[0];

      
        var id = data.id.split("_");
       
        id = id[id.length - 1];
        var elem = document.getElementById(data.id);
        console.log('elem', elem);
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.inv_InternalOrderDetailListItem[id].thumb = e.target.result;

                  
                });
            };
            reader.readAsDataURL(elem.files[0]);
            angular.element(`input[name='imageName_${id}']`).val(SelectedFileForUploadName);

            //for (var i = 0; i < $scope.inv_InternalOrderDetailList.length; i++) {
            //    $scope.ImageName = $scope.inv_InternalOrderDetailList[i].name;
            //}
                
            angular.element(`input[name='imageUpdateName_${id}']`).val(null);

            //if ((typeof (ImageName)) === 'string') {
            //      $scope.Image = '{ "0": {} }';
            //     return $scope.ShowImageName;
            //}
            
        
        } else {
            alert("This browser does not support FileReader.");
        }

      
    }


    

 
    $scope.ItemAttrList = [];


    $scope.getForIWODetailsUpdate = function (iwo) {
        $scope.btnSave = "Update";
        //$scope.ShowImageName = true;
        $scope.ddlInternalWorkOrder = null;
        $scope.iwolist = [];
        //$scope.inv_InternalOrderDetailList = [];
        $scope.inv_InternalOrderDetailListItem = [];
     
        $scope.internalWorkOrder = iwo;
        
      
        $scope.ddlPreparedBy = { EmployeeId: iwo.PreparedById };
        $scope.ddlStore = { DepartmentId: iwo.DepartmentId };
    

        
        $http({
            url: '/InternalWorkOrder/GetInternalWorkOrderDetailByInternalWorkOrderId?internalWorkId=' + iwo.InternalWorkOrderId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            console.log('update Item', data);

           
           
            angular.forEach(data, function (aData) {
              

                var rawItemList = [];
                rawItemList = Enumerable.From($scope.AllRawMaterialAndCombination)
                    .Select(function (x) {
                        return {
                            'ItemName': x['ItemName'],

                            'ItemId': x['ItemId']
                        };
                    }).ToArray();


                var Department = [];
                var currentQty = [];

                angular.forEach($scope.sockQtyWithRequestQty, function (itemData) {
                    if (itemData.ItemId == aData.FinishedItemId) {

                        Department.push({ 'DepartmentName': itemData.DepartmentName });
                        currentQty.push({ 'CurrentQuantity': itemData.CurrentQuantity });

                    }
                });

                var DeliveryDate = "";
                var res2 = aData.DeliveryDate.substring(0, 5);
                if (res2 == "/Date") {
                    var parsedDate1 = new Date(parseInt(aData.DeliveryDate.substr(6)));
                    var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                    aData.DeliveryDate = date1;
                }

                console.log(DeliveryDate);
              
                if (aData.CategoryName === "Finished Goods" && aData.SubCategoryName != "Barcode Ribbon (R)") {

                  
                    aData.Core = aData.Core.toString();
                 
                    var itemObj = {
                      
                        InternalWorkOrderId: aData.InternalWorkOrderId,
                        InternalWorkOrderDetailId: aData.InternalWorkOrderDetailId,
                        SalesOrderDetailId: aData.SalesOrderDetailId,
                        ItemId: aData.ItemId,
                        ItemName: aData.ItemName,
                        CategoryName: aData.CategoryName,
                        Barcode: aData.Barcode,
                        RawItemList: rawItemList,

                        OrderQty: aData.OrderQty,
                        QtyPerRoll: aData.QtyPerRoll,
                        DeliveryDate:aData.DeliveryDate,
                        DeliveryDate2: aData.DeliveryDate,

                        DepartmentName: Department,
                        CurrentQuantity: currentQty,
                        Ups: aData.Ups,
                        Radius: aData.Radius,
                        Color: aData.Color,
                    
                        DetailRemarks: aData.DetailRemarks,
                        ddlRollDirection:aData.RollDirection,
                        ddlCore: aData.Core,
                        FinishedItemId: aData.FinishedItemId,
                        ddlItem: { ItemId: aData.ItemId },
                  
                        ArtWork: aData.ArtWork,
                       
                    }

                    $scope.inv_InternalOrderDetailListItem.push(itemObj);
                } else {
                  
                    var itemObj = {
                      
                        InternalWorkOrderId: aData.InternalWorkOrderId,
                        InternalWorkOrderDetailId: aData.InternalWorkOrderDetailId,
                        SalesOrderDetailId: aData.SalesOrderDetailId,
                        ItemName: aData.ItemName,
                        CategoryName: aData.CategoryName,
                        Barcode: aData.Barcode,
                        RawItemList: rawItemList,
                        ItemId: aData.ItemId,
                        OrderQty: aData.OrderQty,
                        QtyPerRoll: aData.QtyPerRoll,
                        DeliveryDate: aData.DeliveryDate,
                        DeliveryDate2: aData.DeliveryDate,

                        DepartmentName: Department,
                        CurrentQuantity: currentQty,
                        Ups: aData.Ups,
                        Radius: aData.Radius,
                        Color: aData.Color,
                        FinishedItemId: aData.FinishedItemId,
                        DetailRemarks: aData.DetailRemarks,
                        ddlRollDirection: aData.RollDirection,
                        ddlCore: { ddlCore: aData.Core },
                        ddlItem: { ddlItem: aData.ItemId },
                      
                        ArtWork: aData.ArtWork,
                    }

                    $scope.inv_InternalOrderDetailListItem.push(itemObj);
                }
                
         
                console.log(' update Push inv_InternalOrderDetailList', $scope.inv_InternalOrderDetailListItem);
            });
          
            
            });

        window.scrollTo(0, 0);
    }
  



}).factory('FileUploadService', function ($http, $q) { // explained abour controller and service in part 2

    var fac = {};
    var imageName = {};
    fac.UploadFile = function (file) {
        var formData = new FormData();
        formData.append("file", file);

        //for (var i = 0; i < formData.length; i++) {

        //    imageName = formData[i].name;
        //}
        //console.log(imageName);

        var defer = $q.defer();
        $http.post("/Item/SaveFiles", formData,
            {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            })
            .then(function (d) {
                defer.resolve(d);
                console.log('Update',d);
            });


        return defer.promise;

    }
    return fac;
});