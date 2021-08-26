app.controller("BillOfMaterialController", function ($scope, $cookieStore, $http, $filter, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');

    Clear();

    function Clear() {
        $scope.FinishedGoodList = [];
        $scope.RawMaterialList = [];
        $scope.OverheadList = [];
        $scope.OverheadDetailList = [];
        $scope.OverheadDetailListUI = [];
        $scope.PackingDetailListUI = [];
        $scope.ServiceDetailListUI = [];
        $scope.OverheadDetail = {};
        $scope.BillOfMaterial = {};
        $scope.BillOfMaterialDetail = {};
        $scope.BillOfMaterialDetaillist = [];
        $scope.ddlRawMaterial = null;
        $scope.ddlFinishedGood = null;
        GetOverhead();
        GetAllFinishedGood();
        GetAllRawMaterial();

        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        GetBillOfMaterialPaged($scope.currentPage);
    }


    function GetOverhead() {
        $http({
            url: '/OverHead/GetAllOverhead',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.OverheadList = data;
        });
    }
    $scope.AddOverheadDetail = function () {
        $scope.OverheadDetail.SectorType = "Overhead";
        $scope.OverheadDetailListUI.push($scope.OverheadDetail);
        $scope.OverheadDetail = {};
        $scope.ddlOverhead = null;
    }
    $scope.RemoveOverHead = function (index) {
        $scope.OverheadDetailListUI.splice(index, 1);
    }


    $scope.AddPackingDetail = function () {
        $scope.OverheadDetail.SectorType = "Packing";
        $scope.OverheadDetail.SectorName = $scope.OverheadDetail.PackingSectorName;
        $scope.OverheadDetail.Amount = $scope.OverheadDetail.PackingAmount;

        $scope.PackingDetailListUI.push($scope.OverheadDetail);
        $scope.OverheadDetail = {};
        $scope.ddlOverhead = null;
    }
    $scope.RemovePacking = function (index) {
        $scope.PackingDetailListUI.splice(index, 1);
    }

    $scope.AddServiceDetail = function () {
        $scope.OverheadDetail.SectorType = "Service";
        $scope.OverheadDetail.SectorName = $scope.OverheadDetail.ServiceSectorName;
        $scope.OverheadDetail.Amount = $scope.OverheadDetail.ServiceAmount;
        $scope.ServiceDetailListUI.push($scope.OverheadDetail);
        $scope.OverheadDetail = {};
        $scope.ddlOverhead = null;
    }
    $scope.RemoveService = function (index) {
        $scope.ServiceDetailListUI.splice(index, 1);
    }



    function GetAllFinishedGood() {
        var criteria = "C.CategoryId=1";
        $http({
            url: '/Item/GetItemDynamic?searchCriteria=' + criteria + "&orderBy=ItemId",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.FinishedGoodList = data;
            angular.forEach($scope.FinishedGoodList,
                function (aData) {
                    aData.TempItemName = aData.ItemName +
                        " ~ " +
                        aData.ItemDescription +
                        " ~ " +
                        aData.ItemDescriptionTwo +
                        " ~ " +
                        aData.ItemCode +
                        " ~ " +
                        aData.UnitPerPackage +
                        " ~ " +
                        aData.PackagePerContainer +
                        " ~ " +
                        aData.HsCode +
                        " ~ " +
                        aData.ItemId;

                    aData.ItemName = aData.ItemName +
                        " ~ " +
                        aData.ItemDescription +
                        " ~ " +
                        aData.ItemDescriptionTwo;
                });

        })
    }

    function GetAllRawMaterial() {
        var criteria = "C.CategoryId=4";
        $http({
            url: '/Item/GetItemDynamic?searchCriteria=' + criteria + "&orderBy=ItemId",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.RawMaterialList = data;
            angular.forEach($scope.RawMaterialList,
                function (aData) {
                    aData.TempItemName = aData.ItemName +
                        " ~ " +
                        aData.ItemDescription +
                        " ~ " +
                        aData.ItemDescriptionTwo +
                        " ~ " +
                        aData.ItemCode +
                        " ~ " +
                        aData.UnitPerPackage +
                        " ~ " +
                        aData.PackagePerContainer +
                        " ~ " +
                        aData.HsCode +
                        " ~ " +
                        aData.ItemId;
                    aData.ItemName = aData.ItemName +
                        " ~ " +
                        aData.ItemDescription +
                        " ~ " +
                        aData.ItemDescriptionTwo;
                });

        })
    }

    $scope.AddBillOfMaterialDetail = function () {
        $scope.BillOfMaterialDetaillist.push($scope.BillOfMaterialDetail);
        $scope.BillOfMaterialDetail = {};
        $scope.ddlRawMaterial = null;
    }
    $scope.RemoveBillOfMaterialDetail = function (index) {
        $scope.BillOfMaterialDetaillist.splice(index, 1);
    }
    $scope.CalValue = function () {
        
        $scope.BillOfMaterialDetail.TotalValue = $scope.BillOfMaterialDetail.TotalProduction * $scope.BillOfMaterialDetail.UnitPrice;
    }
    $scope.WastageCalculetion = function () {
        $scope.BillOfMaterialDetail.WastageAmount = ($scope.BillOfMaterialDetail.WastagePercentage / 100) * $scope.BillOfMaterialDetail.Qty;
        $scope.BillOfMaterialDetail.TotalProduction = $scope.BillOfMaterialDetail.Qty - $scope.BillOfMaterialDetail.WastageAmount;
    }


    $scope.SaveBillOfMaterial = function () {
        $scope.BillOfMaterial.UpdatorId = $scope.LoginUser.UserId;
        $scope.OverheadDetailList = $scope.OverheadDetailListUI.concat($scope.PackingDetailListUI ,$scope.ServiceDetailListUI);

        var parms = JSON.stringify({ BillOfMaterial: $scope.BillOfMaterial, BillOfMaterialDetaillist: $scope.BillOfMaterialDetaillist, OverheadDetailList: $scope.OverheadDetailList });
        $http.post('/BillOfMaterial/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Bill Of Material Save Successfully!', 'success', '5000');
                Clear();
                $scope.BillOfMaterialForm.$setPristine();
                $scope.BillOfMaterialForm.$setUntouched();

            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    $scope.SelBillOfMaterial = function (aBillOfMaterial) {
        window.scrollTo(0, 0);
        $scope.BillOfMaterial = aBillOfMaterial;

        $scope.ddlFinishedGood = { "ItemId": aBillOfMaterial.ItemId };



        $http({
            url: "/BillOfMaterial/GetBillOfMaterialDetailByBillOfMaterialId?BOMId=" + aBillOfMaterial.BillOfMaterialId,
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (BOMDetailData) {
            $scope.BillOfMaterialDetaillist = BOMDetailData;
        });

        //////////////////////////////////

        $http({
            url: "/BillOfMaterial/GetBillOfMaterialOverheadByBillOfMaterialId?BOMId=" + aBillOfMaterial.BillOfMaterialId + "&SectorType=Overhead",
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            if (data.length) {
                $scope.OverheadDetailListUI = data;
            }
        });

        $http({
            url: "/BillOfMaterial/GetBillOfMaterialOverheadByBillOfMaterialId?BOMId=" + aBillOfMaterial.BillOfMaterialId + "&SectorType=Packing",
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            if (data.length) {
                $scope.PackingDetailListUI = data;
            }
        });

        $http({
            url: "/BillOfMaterial/GetBillOfMaterialOverheadByBillOfMaterialId?BOMId=" + aBillOfMaterial.BillOfMaterialId + "&SectorType=Service",
            method: "GET",
            headers: { 'Content-Type': "application/json" }
        }).success(function (data) {
            if (data.length) {
                $scope.ServiceDetailListUI = data;
            }
        });

        var isCreateDate = isNaN(aBillOfMaterial.CreateDate);

        if (isCreateDate == true) {
            var res1 = aBillOfMaterial.CreateDate.substring(0, 5);
            if (res1 == "/Date") {
                var parsedDate1 = new Date(parseInt(aBillOfMaterial.CreateDate.substr(6)));
                var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                aBillOfMaterial.CreateDate = date1;
            }
        }

        
    }

    $scope.BOMReportBtn = function (BillOfMaterial) {
        $window.open("#/Mushak4_3", "popup", "width=850,height=550,left=280,top=80");
        var BillOfMaterialObj = BillOfMaterial;
        $cookieStore.put("BillOfMaterialObj", BillOfMaterialObj);
        event.stopPropagation();

    };

    $scope.resetForm = function () {
        Clear();
    }


    $scope.reloadBtn = function () {
        $('#txtFromDateForBOM').val('');
        $('#txtToDateForBOM').val('');
        $('#textBillOfMaterialNo').val('');
        $scope.FromDate = "";
        $scope.ToDate = "";
        $scope.SearchBillOfMaterialNo = null;
        GetBillOfMaterialPaged(1);
    }

    $scope.BillOfMaterialSearch = function () {
        GetBillOfMaterialPaged(1);

    }

    function GetBillOfMaterialPaged(curPage) {

        if (curPage == null) curPage = 1;
        var startRecordNo = ($scope.PerPage * (curPage - 1)) + 1;

        var formDateChange = $("#txtFromDateForBOM").val();
        $scope.FromDate = formDateChange.split('/').reverse().join('-');

        var toDateChange = $("#txtToDateForBOM").val();
        $scope.ToDate = toDateChange.split('/').reverse().join('-');

        var SearchCriteria = "";

        if ($scope.SearchBillOfMaterialNo != undefined && $scope.SearchBillOfMaterialNo != "" && $scope.FromDate != "" && $scope.ToDate != "") {
            SearchCriteria = "([DeliveryDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "') and ([BillOfMaterialNo] LIKE '%" + $scope.SearchBillOfMaterialNo + "%')";
            //alert("Name, Date Success!!!!!");
        }
        else if ($scope.SearchBillOfMaterialNo !== undefined && $scope.SearchBillOfMaterialNo != null && $scope.SearchBillOfMaterialNo != "") {
            SearchCriteria = "[BillOfMaterialNo] LIKE '%" + $scope.SearchBillOfMaterialNo + "%'";
            //alert("Name Success!!!!!");
        }
        else if ($scope.FromDate != "" && $scope.ToDate != "") {
            SearchCriteria = "[DeliveryDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "'";
            //alert("Date Success!!!!!");
        }


        //console.log(SearchCriteria);
        $http({
            url: encodeURI('/BillOfMaterial/GetBillOfMaterialPaged?startRecordNo=' + startRecordNo + '&rowPerPage=' + $scope.PerPage + "&whereClause=" + SearchCriteria + '&rows=' + 0),
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            if (data.ListData.length > 0) {
                angular.forEach(data.ListData, function (aSd) {
                    var res1 = aSd.SubmitDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.SubmitDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                        aSd.SubmitDate = date1;
                    }
                    if (aSd.DeliveryDate != null) {
                        var res2 = aSd.DeliveryDate.substring(0, 5);
                        if (res2 == "/Date") {
                            var parsedDate2 = new Date(parseInt(aSd.DeliveryDate.substr(6)));
                            var date2 = ($filter('date')(parsedDate2, 'MMM dd, yyyy')).toString();
                            aSd.DeliveryDate = date2;
                        }
                    }


                })

            }
            else {
                alertify.log('Commercial Invoice  Not Found', 'error', '5000');
            }
            $scope.BillOfMaterialListPaged = data.ListData;
            $scope.total_count = data.TotalRecord;


        });
    }

    $scope.getData = function (curPage) {

        // if ($scope.FromDate == "" || $scope.ToDate == "" ) {

        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetBillOfMaterialPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetBillOfMaterialPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetBillOfMaterialPaged($scope.currentPage);
        }
        //  }


    }
    
    ////////////////////////////
    $("#txtSubmitDate").datepicker({
        dateFormat: "M d yy",
        onSelect: function () {
    
            $scope.OnSelectdate = $("#txtSubmitDate").val();
            $scope.BillOfMaterial.SubmitDate = $scope.OnSelectdate;
            var today = $scope.OnSelectdate;
            $scope.financial_year = "";

            var getMonth = today.substring(0, 3);


            var getFullYear = today.substring(6, 11);
            var fullYear = parseInt(getFullYear);

            if (getMonth > 6) {
                $scope.financial_year = (fullYear - 1) + "-" + fullYear;
            } else {
                $scope.financial_year = fullYear + "-" + (fullYear + 1)
            }

            var getYear1 = $scope.financial_year.substring(2, 4);
            var getYear2 = $scope.financial_year.substring(7, 9);
            $scope.getAllYear = getYear1 + "-" + getYear2;
            $http({
                url: '/BillOfMaterial/GetMaxBillOfMaterialNo',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.inv_PurchaseBilldate = data;
                $scope.BillOfMaterial.BillOfMaterialNo = "BOM/" + $scope.getAllYear + "/" + parseInt(data);


            });

        }

    });
    $("#txtDeliveryDate").datepicker({
        dateFormat: "M d yy",
        
    });
    //$scope.PBDateChange = function () {
    //    $("#txtSubmitDate").focus();
    //    $("#txtSubmitDate").trigger("click");

    //}
    ////////////////////////

    $("#txtFromDateForBOM").datepicker({
        dateFormat: "dd/mm/yy"
    });

    $scope.FormDateChangeForBOM = function () {
        $("#txtFromDateForBOM").focus();
        $("#txtFromDateForBOM").trigger("click");
    }


    $("#txtToDateForBOM").datepicker({
        dateFormat: "dd/mm/yy"
    });

    $scope.ToDateChangeForBOM = function () {
        $("#txtToDateForBOM").focus();
        $("#txtToDateForBOM").trigger("click");
    }

});