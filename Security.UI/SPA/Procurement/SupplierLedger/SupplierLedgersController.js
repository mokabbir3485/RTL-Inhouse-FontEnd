
app.controller("SupplierLedgersController", function ($scope, $http, $filter, $cookieStore, $cookies, $window ) {

   // document.write("<script type='text/javascript' src='commonController.js'></script>");
    

    Clear();
    function Clear() {
        $scope.name = "Supplier Ledger";
        $scope.showTableItem = false;
        $scope.supplierLedgerList = [];
        GetSupplier();
        $scope.selectedIsCheck = false;
        $scope.invPBDetailsFiledHide = false;
        $scope.supplierAllLedgerList = [];
        $scope.SupAllListShow = true;
    }

    $("#txtFromDateForPB").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.FormDateChangeForPB = function () {
        $("#txtFromDateForPB").focus();
        $("#txtFromDateForPB").trigger("click");
    }


    $("#txtToDateForPB").datepicker({
        dateFormat: "M d, yy"
    });

    $scope.ToDateChangeForPB = function () {
        $("#txtToDateForPB").focus();
        $("#txtToDateForPB").trigger("click");
    }

    $scope.hideBtnColapse = function () {
        $scope.invPBDetailsFiledHide == true;
        $scope.invPBDetailsFiledHide = $scope.invPBDetailsFiledHide == false ? true : false;
    }

    $scope.supplierlistAll = [];
    $scope.supplierIdList = [];

    $scope.example8settings = {
        checkBoxes: true,
        scrollableHeight: '200px',
        scrollable: true,
        dynamicTitle: true,
        selectionOf: true,
        showUncheckAll: true,
        showCheckAll: true,
        enableSearch: true
    };

    function GetSupplier() {
        $http({
            url: '/Supplier/GetAllSuppler',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.supplierlist = data;
            //angular.forEach(data, function (aData) {
            //    $scope.supplierlistAll.push({ id: aData.SupplierId, label: aData.SupplierName  });
            //});
        })
    }

    $scope.onSuppilerInfoLoad = function (supId) {
        $scope.supplierId = supId;
    }
  
    $scope.onLoadBtn = function () {
        if ($scope.supplierId == undefined && $scope.supplierId==null  ) {
            $scope.showTableItem = false;
            $scope.supplierId= 0;
        } else {
            $scope.showTableItem = true;
        }
        $scope.checkList = [];
        //$scope.supplierIds = '';
        //angular.forEach($scope.supplierIdList, function (data) {
        //    $scope.supplierIds += $scope.supplierIds == '' ? data.id : (',' + data.id)
        //});
        
      

        //$scope.supplierId = Number($scope.supplierIds);

        var fromDate = $("#textFormDate").val();
        var toDate = $("#textToDate").val();
        // var fromDate = '01/05/2021';
        //var toDate = '30/10/2021';

        //$cookieStore.put("GetSupplierId", $scope.supplierIds);
        //console.log($cookieStore.get("GetSupplierId"));

        if ($scope.supplierId == 0 || $scope.supplierId == undefined || $scope.supplierId == null) {
            $scope.showTableItem = false;
            $scope.SupAllListShow = true;
            $http({
                url: '/SupplierPaymentAndAdjustment/GetAllSupplierLedger?supplierId=' + 0 + '&formDate=' + fromDate + '&toDate=' + toDate,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                //$scope.selectedIsCheck = true;
                $scope.supplierAllLedgerList = data;
               
            })
        } else {
            $scope.SupAllListShow = false;
            $scope.showTableItem = true;
            $http({
                url: '/SupplierPaymentAndAdjustment/GetAllSupplierLedger?supplierId=' + $scope.supplierId+ '&formDate=' + fromDate + '&toDate=' + toDate,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
               
                $scope.supplierLedgerList = data;

            })
        }
        
    }

    $scope.checkList = [];

    $scope.onCheckVal = function (row, select, indx) {
        row.isCheck = select;
        $scope.checkLedgerRowSelect = row;
        $scope.checkLedgerSelect = select;
        $scope.checkLedgerIndex = indx;
       
       

        if (row.isCheck == true) {
            $scope.checkList.push(row);
        } else {
            var index = $scope.checkList.indexOf(row);
            $scope.checkList.splice(index, 1);
        }

        console.log($scope.checkList);

    }

    $scope.CheckAllValue = function () {
        // $scope.checkLedgerRowSelect
      
        if ($scope.selectedIsCheck == true) {
            angular.forEach($scope.supplierAllLedgerList, function (aData) {
                aData.selectedIsCheck = true;
                $scope.checkList.push(aData);
            })
        } else {
            $scope.checkList = [];
        }
        console.log($scope.checkList);

        //$scope.selectedIsCheck = true;
    }

    


    $scope.supplierLedgerReportBtn = function () {
        $window.open("#/SupplierLedgerReport", "popup", "width=850,height=550,left=280,top=80");
       
        $cookieStore.put("SupplierLedgerReportData", $scope.checkList);
        
        event.stopPropagation();

    };

    $scope.PaymentLedgerShowBtn = function () {
        $('#supplierledgerShow').modal('show');
    }
    
})