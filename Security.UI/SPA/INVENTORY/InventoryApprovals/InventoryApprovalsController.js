app.controller("InventoryApprovalsController", function ($scope, $cookieStore, $http, $filter, $window, FileUploadService) {

    $scope.LoginUser = $cookieStore.get('UserData');

    Clear();

    function Clear() {
        //$scope.currentPage = 1;
        //$scope.PerPage = 10;
        //$scope.total_count = 0;
        //GetPagedIwo($scope.currentPage);
        //$scope.iwoListPaged = [];
        //$scope.Approval = [
        //                    {
        //                        ddlApprovalType: "",
        //                        ddlApprovedBy: "",
        //                        ApprovalDate: "",
        //                    }
        //];
        //$scope.Approval = [];

        $scope.SelectedFileForUpload = [];
        $scope.EmployeeList = [];
        $scope.GetModuleExAdminSecurityList = [];
        $scope.iwoDetailList = [];
        $scope.CoreList = [
            { Id: 12.5, CoreName: "12.5" },
            { Id: 25, CoreName: "25" },
            { Id: 40, CoreName: "40" },
            { Id: 76, CoreName: "76" },
        ];
        $scope.RollDirectionList = [
            { Id: "Face In", RollName: "FI" },
            { Id: "Face Out", RollName: "FO" },
            { Id: "Clock Wise", RollName: "CW" },
            { Id: "Anti Clock Wise", RollName: "ACW" },
        ];
        $scope.interWODate = "";
        $scope.VarietyList = [];
        $scope.AllCombinationlist = [];
        $scope.AllRawMaterialAndCombination = [];
        $scope.inv_InternalOrderDetailList = [];
        $scope.Approval = {};
        GetModuleExAdminSecurity();
        GetAllEmployee();
        hideAll();
        $scope.Approval.ApprovalDate = $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy');
        GetByCombinationand();
        GetByCombinationLike();
        GetAllVariety();
        GetAllStock();
    }

    function GetModuleExAdminSecurity() {
        $http({
            url: '/InventoryApprovals/GetModuleExAdminSecurity',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.GetModuleExAdminSecurityList = Enumerable.From(data).Where('$.ModuleName!="Common"').ToArray();;
            if (data.length == 1) {
                $scope.Approval.ddlApprovalType.ScreenId = data[0].ScreenId;
                $scope.ApprovalChange();
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
        });
    }

    function hideAll() {
        $('#31').hide();
        $('#21').hide();
        $('#20').hide();
        $('#25').hide();
        $('#27').hide();
        $('#41').hide();
        $('#33').hide();
        $('#34').hide();
        $('#45').hide();
        $('#30').hide();
    }

    function GetByCombinationand() {
        $http({
            url: '/Item/GetCombinationWithPrice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AllCombinationlist = angular.fromJson(data);
            console.log($scope.AllCombinationlist);
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

    function GetByCombinationLike() {
        //$http({
        //    url: '/Item/GetByCombinationLike',
        //    method: 'GET',
        //    headers: { 'Content-Type': 'application/json' }
        //}).success(function (data) {
        //    $scope.AllRawCombination = JSON.parse(data);
        //    $scope.AllRawMaterialAndCombination = Enumerable.From($scope.AllRawCombination)
        //                                         .Distinct("$.Combination")
        //                                         .Where("$.CategoryName =='Raw Materials'")
        //                                         .OrderBy("$.ItemName")
        //                                         .ToArray();
        //    })

        var searchCriteria = "C.CategoryName='Raw Materials'";
        $http({
            url: '/Item/GetItemForIwoDynamic?searchCriteria=' + searchCriteria,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AllRawCombination = data;
            $scope.AllRawMaterialAndCombination = Enumerable.From($scope.AllRawCombination)
                .Distinct("$.Combination").ToArray();
        })
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

    function GetSearchResultForApprovalDetails(details) {
        $scope.iwoDetailList = [];
     
        $scope.listItem = [];
        $http({
            url: "/InternalWorkOrder/GetInternalWorkOrderDetailByInternalWorkOrderId?internalWorkId=" + $scope.Approval.Id,
            method: 'GET',
            //params: { screenId: $scope.Approval.ddlApprovalType.ScreenId, Pkid: $scope.Approval.Id },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            if (data == '') {
                $scope.NotFounds = true;
            }
            else {
                var dFormate = details.InternalWorkOrderDate.split("/");
                $scope.interWODate = new Date(dFormate[2],(parseInt(dFormate[1]) - 1), dFormate[0])
                $scope.inv_InternalOrderDetailList = [];
                var rawMaterial = {
                    Core: 0,
                    QtyPerRoll: 0,
                    RollDirection: "",
                    DeliveryDate: ""
                }
                angular.forEach(data, function (adata) {
                    var rawItemList = [];

                    //$scope.internalWorkOrder.SalesOrderId = iwo.SalesOrderId;
                    rawItemList = Enumerable.From($scope.AllRawMaterialAndCombination)
                                  .Select(function (x) {
                                      return {
                                          'ItemName': x['Combination'],
                                          'ItemId': x['ItemId']
                                      };
                                  }).ToArray();
                    var ItemCombination = Enumerable.From($scope.AllCombinationlist).Where('$.ItemId==' + adata.FinishedItemId).FirstOrDefault();
                    var checkCategory = Enumerable.From($scope.VarietyList).Where('$.ItemId==' + ItemCombination.ItemId).FirstOrDefault();

                    var dueDate = "";
                    var res1 = adata.DeliveryDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDueDate1 = new Date(parseInt(adata.DeliveryDate.substr(6)));
                        var date1 = ($filter('date')(parsedDueDate1, 'dd/MM/yyyy')).toString();
                        dueDate = date1;
                    }

                    if (checkCategory.CategoryName === "Finished Goods" && checkCategory.SubCategoryName != "Barcode Ribbon (R)") {
                        var RMaterialList = [];

                        var rawItem = Enumerable.From($scope.AllCombinationlist).Where('$.ItemId==' + adata.ItemId).FirstOrDefault();
                        RMaterialList.push(rawMaterial);

                        var HeaderOfAttribute = ['Raw Material', 'Core (mm)', 'Qty.Per Roll', 'Roll Direction', 'Delivery Date', 'Remarks'];
                       
                        var inv_InternalOrderDetail = {
                            InternalWorkOrderDetailId: adata.InternalWorkOrderDetailId,
                            ItemId: ItemCombination.ItemId,
                            ItemName: ItemCombination.Combination,
                            FinishedItemAddAttId: ItemCombination.ItemId,
                            Barcode: ItemCombination.Barcode,
                            RawItemList: rawItemList,
                            OrderQty: adata.OrderQty,
                            QtyPerRoll: adata.QtyPerRoll,
                            Remarks: "",
                            DeliveryDate: dueDate,
                            DeliveryDate2: dueDate,
                            HeaderOfAttribute: HeaderOfAttribute,
                            CategoryName: checkCategory.CategoryName,
                            SubCategoryName: checkCategory.SubCategoryName,
                            ddlCore: { Id: adata.Core },
                            ddlItem: { ItemId: rawItem.ItemId },
                            ddlCombination: { ItemAddAttId: rawItem.ItemId },
                            ddlRollDirection: { Id: adata.RollDirection }
                        }
                     
                        $scope.inv_InternalOrderDetailList.push(inv_InternalOrderDetail);
                      
                        
                    } else {
                        var HeaderOfAttribute = ["Delivery Date"];
                        var inv_InternalOrderDetail = {
                            InternalWorkOrderDetailId: adata.InternalWorkOrderDetailId,
                            ItemId: ItemCombination.ItemId,
                            ItemAddAttId: adata.ItemId,
                            ItemName: ItemCombination.Combination,
                            FinishedItemAddAttId: ItemCombination.ItemId,
                            Barcode: ItemCombination.Barcode,
                            OrderQty: adata.OrderQty,
                            SalesOrderDate: adata.SalesOrderDate,
                            DeliveryDate: dueDate,
                            DeliveryDate2: dueDate,
                            HeaderOfAttribute: HeaderOfAttribute,
                            CategoryName: checkCategory.CategoryName,
                            SubCategoryName: checkCategory.SubCategoryName
                        }

                      
                        $scope.inv_InternalOrderDetailList.push(inv_InternalOrderDetail);
                      
                    }
                });
            }
        })
    }

    
    //Start here

    //function GetPagedIwo(curPage) {

    //    if (curPage == null) curPage = 1;
    //    var startRecordNo = ($scope.PerPage * (curPage - 1)) + 1;



    //    var formDateChange = $("#txtFromDateForIWO").val();
    //    $scope.FromDate = formDateChange.split('/').reverse().join('-');

    //    var toDateChange = $("#txtToDateForIWO").val();
    //    $scope.ToDate = toDateChange.split('/').reverse().join('-');

    //    var SearchCriteria = "";

    //    // SearchCriteria = "[IWO].[IsApproved]=1";

    //    if ($scope.SearchIWOAndCompanyName != undefined && $scope.SearchIWOAndCompanyName != "" && $scope.FromDate != "" && $scope.ToDate != "") {
    //        SearchCriteria = "([IWO].[InternalWorkOrderDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "') and ([IWO].[InternalWorkOrderNo] LIKE '%" + $scope.SearchIWOAndCompanyName + "%' OR [SO].[CompanyNameOnBill] LIKE '%" + $scope.SearchIWOAndCompanyName + "%')";
    //        //alert("Name, Date Success!!!!!");
    //    }
    //    else if ($scope.SearchIWOAndCompanyName !== undefined && $scope.SearchIWOAndCompanyName != null && $scope.SearchIWOAndCompanyName != "") {
    //        SearchCriteria = "[IWO].[InternalWorkOrderNo] LIKE '%" + $scope.SearchIWOAndCompanyName + "%' OR [SO].[CompanyNameOnBill] LIKE '%" + $scope.SearchIWOAndCompanyName + "%'";
    //        //alert("Name Success!!!!!");
    //    }
    //    else if ($scope.FromDate != "" && $scope.ToDate != "") {
    //        SearchCriteria = "[IWO].[InternalWorkOrderDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "'";
    //        //alert("Date Success!!!!!");
    //    }

    //    //


    //    //var SearchCriteria = "[IWO].[IsApproved]=0";


    //    $http({
    //        url: encodeURI('/InternalWorkOrder/GetPagedIWO?startRecordNo=' + startRecordNo + '&rowPerPage=' + $scope.PerPage + "&whereClause=" + SearchCriteria + '&rows=' + 0),
    //        method: 'GET',
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (data) {

    //        $scope.iwoListPaged = data.ListData;
    //        $scope.total_count = data.TotalRecord;

    //        if ($scope.iwoListPaged.length > 0) {
    //            angular.forEach($scope.iwoListPaged, function (aSd) {
    //                var res1 = aSd.InternalWorkOrderDate.substring(0, 5);
    //                if (res1 == "/Date") {
    //                    var parsedDate1 = new Date(parseInt(aSd.InternalWorkOrderDate.substr(6)));
    //                    var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
    //                    aSd.InternalWorkOrderDate = date1;
    //                }
    //            })

    //        }
    //        else {
    //            alertify.log('Sales Order  Not Found', 'error', '5000');
    //        }



    //    });
    //}
    //$scope.SelSearch = function (row, col) {
    //    $scope.Approval.Id = row[col];
    //    $scope.dataList = [];
    //    $scope.dataList[0] = row;
    //    $scope.Approval.PlaceOfDelivery = row.PlaceOfDelivery;
    //    $scope.Approval.Remarks = row.Remarks;
    //    GetSearchResultForApprovalDetails($scope.dataList[0]);
    //}

    $scope.ApprovalChange = function () {
        hideAll();
        $scope.dataList = [];
        $scope.iwoDetailList = [];
        $scope.colmnss = null;
        //$scope.Approval.Id = "";
        if ($scope.Approval.ddlApprovalType != undefined && $scope.Approval.ddlApprovalType != null && $scope.Approval.ddlApprovalType != "") {
            $http({
                url: '/AdvancedSearch/GetSearchResultForApproval',
                method: 'GET',
                params: { screenId: $scope.Approval.ddlApprovalType.ScreenId, fromScreenId: 0 },
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                console.log('GetSearchResultForApproval', data);
                if (data == '') {
                    $scope.NotFound = true;
                }
                else {
                    $scope.NotFound = false;
                    $scope.dataList = data;
                    $scope.cols = Object.keys($scope.dataList[0]);
                }
                console.log('load  for cols', $scope.cols);
                console.log('load for dataList', $scope.dataList);
            })
        }
    }


    


    //$scope.getData = function (curPage) {

    //    // if ($scope.FromDate == "" || $scope.ToDate == "" ) {

    //    if ($scope.PerPage > 100) {
    //        $scope.PerPage = 100;
    //        $scope.currentPage = curPage;
    //        GetPagedIwo($scope.currentPage);
    //        alertify.log('Maximum record  per page is 100', 'error', '5000');
    //    }
    //    else if ($scope.PerPage < 1) {
    //        $scope.PerPage = 1;
    //        $scope.currentPage = curPage;
    //        GetPagedIwo($scope.currentPage);
    //        alertify.log('Minimum record  per page is 1', 'error', '5000');
    //    }
    //    else {
    //        $scope.currentPage = curPage;
    //        GetPagedIwo($scope.currentPage);
    //    }
    //    //  }


    //}
    //update
    $scope.SelSearch = function (iwo) {
        $scope.inv_InternalOrderDetailList = [];
        $scope.Approval.Id = iwo.InternalWorkOrderId;

        $scope.Approval.PlaceOfDelivery = iwo.PlaceOfDelivery;
        $scope.Approval.Remarks = iwo.Remarks;
        //$scope.internalWorkOrder.InternalWorkOrderDate = $filter('date')($scope.internalWorkOrder.InternalWorkOrderDate.toJSON().slice(0, 10), 'dd/MM/yyyy');
        $scope.ddlPreparedBy = { EmployeeId: iwo.PreparedById };
     
        // $scope.inv_InternalOrderDetail.ddlCore = {}
        //$scope.inv_InternalOrderDetailList = [];


        $http({
            url: '/InternalWorkOrder/GetInternalWorkOrderDetailByInternalWorkOrderId?internalWorkId=' + iwo.InternalWorkOrderId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            console.log('update Item', data);

            var rawMaterial = {
                Core: 0,
                QtyPerRoll: 0,
                RollDirection: "",
                DeliveryDate: ""
            }

            angular.forEach(data, function (aData) {
             
              //  $scope.internalWorkOrder.SalesOrderId = aData.SalesOrderId;
                //for (var i = 0; i < $scope.SelectedFileForUpload.length; i++) {
                //    FileUploadService.UploadFile($scope.SelectedFileForUpload[i]).then(function (d) {
                //        //alert("upload successfull!!!");
                //        // console.log(d);

                //    }, function (e) {
                //        alert(e);
                //    });

                //}

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
                //var finishGooddeliveryDate = $("#finishedGoodDeliveryDate").val();
                //var finishDeliveryDate = finishGooddeliveryDate.split('/').reverse().join('-');
                //console.log(finishDeliveryDate);



                if (aData.CategoryName === "Finished Goods" && aData.SubCategoryName != "Barcode Ribbon (R)") {

                    var RMaterialList = [];
                  

                    var rawItem = Enumerable.From($scope.AllCombinationlist).Where('$.ItemId==' + aData.ItemId).FirstOrDefault();
                    RMaterialList.push(rawMaterial);
                    aData.Core = aData.Core.toString();
                    //aData.ItemId = aData.ItemId.toString();
                    var itemObj = {

                        InternalWorkOrderId: aData.InternalWorkOrderId,
                        InternalWorkOrderDetailId: aData.InternalWorkOrderDetailId,
                        SalesOrderDetailId: aData.SalesOrderDetailId,
                        ItemId: aData.ItemId,
                        ItemName: aData.ItemName,
                        CategoryName: aData.CategoryName,
                        Barcode: aData.Barcode,
                        RawItemList: rawItemList,
                        SubCategoryName: aData.SubCategoryName,
                        OrderQty: aData.OrderQty,
                        QtyPerRoll: aData.QtyPerRoll,
                        DeliveryDate: aData.DeliveryDate,
                        DeliveryDate2: aData.DeliveryDate,

                        DepartmentName: Department,
                        CurrentQuantity: currentQty,
                        Ups: aData.Ups,
                        Radius: aData.Radius,
                        Color: aData.Color,

                        DetailRemarks: aData.DetailRemarks,
                        ddlRollDirection: aData.RollDirection,
                        ddlCore: aData.Core,
                        FinishedItemId: aData.FinishedItemId,
                        ddlItem: { ItemId: aData.ItemId },
                        ddlCombination: {ItemAddAttId: rawItem.ItemId},
                        ArtWork: aData.ArtWork,
                        SalesOrderId: aData.SalesOrderId

                    }

                    $scope.inv_InternalOrderDetailList.push(itemObj);
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
                        SalesOrderId: aData.SalesOrderId
                    }

                    $scope.inv_InternalOrderDetailList.push(itemObj);
                }


                console.log(' update Push inv_InternalOrderDetailList', $scope.inv_InternalOrderDetailList);
            });


        });
   
            }
    //Image Section
    $scope.SelectFile = function (data) {
        $scope.SelectedFileForUpload.push(data.files[0]); //= data.files[0];
        var SelectedFileForUploadName = data.files[0].name;
        var id = data.id.split("_");
        id = id[id.length - 1];
        var elem = document.getElementById(data.id);
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                $scope.$apply(function () {
                    $scope.inv_InternalOrderDetailList[id].thumb = e.target.result;

                });
            };
            reader.readAsDataURL(elem.files[0]);

            angular.element(`input[name='imageName_${id}']`).val(SelectedFileForUploadName);

            //for (var i = 0; i < $scope.inv_InternalOrderDetailList.length; i++) {
            //    $scope.ImageName = $scope.inv_InternalOrderDetailList[i].name;
            //}

            angular.element(`input[name='imageUpdateName_${id}']`).val(null);
           

            //if ((typeof ($scope.ImageName)) === 'string') {
            //    $scope.Image = '{ "0": {} }';
            //    return $scope.ShowImageName;
            //}

        } else {
            alert("This browser does not support FileReader.");
        }
    }
        $scope.ClearImage = function (id) {
            $scope.inv_InternalOrderDetailList[id].thumb = [];

            $scope.inv_InternalOrderDetailList[id].ArtWork = [];
            $scope.SelectedFileForUpload[id] = [];

            angular.element(`input[name='image_${id}']`).val(null);
            angular.element(`input[name='imageUpdateName_${id}']`).val(null);
        };
    //$scope.SelSearch = function (row, col) {
    //    $scope.Approval.Id = row[col];
    //    $scope.dataList = [];
    //    $scope.dataList[0] = row;
    //    $scope.Approval.PlaceOfDelivery = row.PlaceOfDelivery;
    //    $scope.Approval.Remarks = row.Remarks;
    //    GetSearchResultForApprovalDetails($scope.dataList[0]);
    //}

  
    $("body").on("focus", "[id=IWOApproveTable] .DeliveryDatePicker", function () {
        $(this).datepicker({
            autoclose: true,
            todayHighlight: true,
            format: 'dd/mm/yyyy'
        });

    })

    $scope.Approve = function () {
        if (angular.isUndefined($scope.Approval.ApprovalDate) || $scope.Approval.ApprovalDate == null || $scope.Approval.ApprovalDate == "") {
            $("#txtApprovalDate").focus();
            alertify.log("Approval Date is required. Please Select a Date.", "error", "5000");
            return;
        }
        var appDateText = $scope.Approval.ApprovalDate;

        var dateParts = appDateText.split("/");
        var ApprovalDate = new Date(dateParts[2], (parseInt(dateParts[1])-1), dateParts[0]);
       
        if (ApprovalDate < $scope.interWODate) {
            $scope.Approval.ApprovalDate = appDateText;
            alertify.log("Approval date can not be before IWO Date.", "error", "5000");
            return;
        }
        if (angular.isUndefined($scope.Approval.ddlApprovedBy) || $scope.Approval.ddlApprovedBy == null) {
            $("#ddlApprovedBy").focus();
            alertify.log("Please Select Approved By.", "error", "5000");
            return;
        }
        if (!$scope.inv_InternalOrderDetailList.length) {
            alertify.log("You didn't select any row to approved.</br>Please select a row first.", "error", "5000");
            return;
        }

        for (var i = 0; i < $scope.SelectedFileForUpload.length; i++) {

            FileUploadService.UploadFile($scope.SelectedFileForUpload[i]).then(function (d) {
                //alert("upload successfull!!!");
                // console.log(d);

            }, function (e) {
                alert(e);
            });

        }


        var isValidForSave = true;
        var _inv_InternalWorkOrderDetailList = [];

        for (var i = 0; i < $scope.inv_InternalOrderDetailList.length; i++) {

            if (angular.isUndefined($scope.inv_InternalOrderDetailList[i].DeliveryDate) || $scope.inv_InternalOrderDetailList[i].DeliveryDate == "") {
                isValidForSave = false;
                break;
            } else if ($scope.inv_InternalOrderDetailList[i].CategoryName == "Finished Goods" && $scope.inv_InternalOrderDetailList[i].SubCategoryName != "Barcode Ribbon (R)"
                && (angular.isUndefined($scope.inv_InternalOrderDetailList[i].ddlItem) || $scope.inv_InternalOrderDetailList[i].ddlItem == null
                || angular.isUndefined($scope.inv_InternalOrderDetailList[i].ddlCombination) || $scope.inv_InternalOrderDetailList[i].ddlCombination == null
                || angular.isUndefined($scope.inv_InternalOrderDetailList[i].ddlCore) || $scope.inv_InternalOrderDetailList[i].ddlCore == null
                || angular.isUndefined($scope.inv_InternalOrderDetailList[i].QtyPerRoll) || $scope.inv_InternalOrderDetailList[i].QtyPerRoll <= 0
                || angular.isUndefined($scope.inv_InternalOrderDetailList[i].ddlRollDirection) || $scope.inv_InternalOrderDetailList[i].ddlRollDirection == null)) {
                isValidForSave = false;
                break;
            }


            var imgName = {};
            

            if (typeof ($scope.inv_InternalOrderDetailList[i].ArtWork) != "string") {
                angular.forEach($scope.inv_InternalOrderDetailList[i].ArtWork, function (adata) {
                    if (adata.name != null) {
                        imgName = 'ArtWork' + '_' + adata.name;
                    }

                });

            } else {
                imgName = $scope.inv_InternalOrderDetailList[i].ArtWork;

            }

           

            if (isValidForSave) {
                var date, dDate;
                date = $scope.inv_InternalOrderDetailList[i].DeliveryDate.split("/");
                dDate = new Date(date[2], date[1], date[0]);
                if ($scope.inv_InternalOrderDetailList[i].CategoryName == "Finished Goods" && $scope.inv_InternalOrderDetailList[i].SubCategoryName != "Barcode Ribbon (R)") {
                    var inv_InternalWorkOrderDetail = {
                        InternalWorkOrderId: $scope.Approval.Id,
                        InternalWorkOrderDetailId: $scope.inv_InternalOrderDetailList[i].InternalWorkOrderDetailId,
                        ItemId: $scope.inv_InternalOrderDetailList[i].ddlItem.ItemId,
                        Core: $scope.inv_InternalOrderDetailList[i].ddlCore,
                        QtyPerRoll: $scope.inv_InternalOrderDetailList[i].QtyPerRoll,
                        RollDirection: $scope.inv_InternalOrderDetailList[i].ddlRollDirection,
                        DeliveryDate: dDate,
                        DetailRemarks: $scope.inv_InternalOrderDetailList[i].Remarks,
                        SalesOrderDetailId: $scope.inv_InternalOrderDetailList[i].SalesOrderDetailId,
                   
                        Ups: $scope.inv_InternalOrderDetailList[i].Ups,
                        Radius: $scope.inv_InternalOrderDetailList[i].Radius,
                        Color: $scope.inv_InternalOrderDetailList[i].Color,
                        FinishedItemId: $scope.inv_InternalOrderDetailList[i].FinishedItemId,
                        DetailRemarks: $scope.inv_InternalOrderDetailList[i].DetailRemarks,
                        ddlRollDirection: $scope.inv_InternalOrderDetailList[i].RollDirection,
                        SalesOrderId: $scope.inv_InternalOrderDetailList[i].SalesOrderId,
                        OrderQty: $scope.inv_InternalOrderDetailList[i].OrderQty,
                      

                        ArtWork: imgName,
                    }
                    _inv_InternalWorkOrderDetailList.push(inv_InternalWorkOrderDetail);
                } else {
                    var inv_InternalWorkOrderDetail = {
                        InternalWorkOrderDetailId: $scope.inv_InternalOrderDetailList[i].InternalWorkOrderDetailId,
                        ItemId: $scope.inv_InternalOrderDetailList[i].ItemId,
                        //---Added -----
                        InternalWorkOrderId: $scope.Approval.Id,
                        SalesOrderDetailId: $scope.inv_InternalOrderDetailList[i].SalesOrderDetailId,
                        FinishedItemId: $scope.inv_InternalOrderDetailList[i].FinishedItemId,
                        SalesOrderId: $scope.inv_InternalOrderDetailList[i].SalesOrderId,
                        OrderQty: $scope.inv_InternalOrderDetailList[i].OrderQty,
                          //--- End ----
                        Core: 0,
                        QtyPerRoll: 0,
                        RollDirection: "N/A",
                        DeliveryDate: dDate,
                        DetailRemarks: ""
                    }
                    _inv_InternalWorkOrderDetailList.push(inv_InternalWorkOrderDetail);
                }
            }
        }

        if (isValidForSave) {
            var _inv_InternalWorkOrder = {
                InternalWorkOrderId: $scope.inv_InternalOrderDetailList[0].InternalWorkOrderId,

                PlaceOfDelivery: $scope.Approval.PlaceOfDelivery,
                Remarks: $scope.Approval.Remarks,
                IsApproved: true,
                PreparedById: $scope.LoginUser.UserId,
                ApprovedBy: $scope.Approval.ddlApprovedBy.EmployeeId,
                ApprovedDate: ApprovalDate,
                UpdatorId: $scope.LoginUser.UserId
            };

            $.ajax({
                url: "/InventoryApprovals/ApproveIWO",
                contentType: "application/json;charset=utf-8",
                type: "POST",
                data: JSON.stringify({ _inv_InternalWorkOrder: _inv_InternalWorkOrder, _inv_InternalWorkOrderDetailList: _inv_InternalWorkOrderDetailList }),
                success: function (data) {
                    if (data > 0) {
                        alertify.log('Approval Completed Successfully!', 'success', '5000');
                        $scope.inv_InternalOrderDetailList = [];
                        $scope.ApprovalChange();
                        $scope.Approval = { PlaceOfDelivery: "", Remarks: "", ApprovalDate: $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy'), ddlApprovedBy: {} };
                        $scope.Approval.ddlApprovedBy.EmployeeId = $scope.LoginUser.EmployeeId;
                    }
                }, error: function (msg) {
                    alertify.log('Server Save Errors!', 'error', '10000');
                }
            });            
        } else {
            alertify.log("Please fill all required data in details section.", "error", "5000");
            return;
        }
    }

        $scope.Reset = function () {
            location.reload();
        };
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
                    console.log('Update', d);
                });


            return defer.promise;

        }
        return fac;
    });