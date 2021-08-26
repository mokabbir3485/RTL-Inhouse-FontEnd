
app.controller("SuppilerPaymentController", function ($scope, $http, $filter, $cookieStore, $timeout, $window) {

    Clear();
    function Clear() {
        $scope.supplierPaymentGetPagedList = [];
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        GetPagedSP($scope.currentPage);
        $scope.inv_supplierPayment = {};
        $scope.ddlSupplier = null;
        $scope.ddlBankAccount = null;
        $scope.ddlLocal = null;
        $scope.supplierlist = [];
        $scope.supplierlistSearch = [];
        $scope.supplierPaymentList = [];
        $scope.BankAccountList = [];
        $scope.updateAmountList = [];
        $scope.paymentTypelist = [];
        $scope.supplierIsCheckPaymentCalculationList = [];

        $scope.isPaidPaymentAmount = false;
        $scope.ddlCheque = null;

        $scope.inv_SuppPaymentDetils = {};
        $scope.inv_supplierPayment.IsCheque = "true";
      
        //Method Call Section=====>>>>
        $scope.inv_supplierPayment.PaymentDate = $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy');
       // $scope.inv_supplierPayment.ChequeDate = $filter('date')(new Date().toJSON().slice(0, 10), 'dd/MM/yyyy');
        GetSupplier();
        GetAllBankAccount();
        GetAllActivePaymentType();
    }
   
    function GetAllActivePaymentType() {
        $http({
            url: '/PaymentType/GetAllActivePaymentType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.paymentTypelist = data;
            
        })
    }

    function GetSupplier() {
        $http({
            url: '/Supplier/GetAllSuppler',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.supplierlist = data;

            $scope.supplierlistSearch = angular.copy(data);
            if (data.length == 1)
                $scope.ddlSupplier = { SupplierId: data[0].SupplierId, SupplierName: data[0].SupplierName };
        })
    }





   
    GetAllSupplierPayementandPurchaseBill();

   
    function GetAllSupplierPayementandPurchaseBill() {

        var localSupplierId = $cookieStore.get("LocalPB");

        var importSupplierId = $cookieStore.get("ImportPB");

        var LocalLPBId = $cookieStore.get("LocalLPBId");
        var ImportPBId = $cookieStore.get("ImportPBId");     
        $cookieStore.remove("LocalPB");
        $cookieStore.remove("ImportPB");

      
        if (localSupplierId == undefined) {
            $scope.ddlSupplier = { SupplierId: importSupplierId }
            $scope.supplierId = importSupplierId;
        } else {
            $scope.ddlSupplier = { SupplierId: localSupplierId }
            $scope.supplierId = localSupplierId;
        }

        if (localSupplierId != undefined || importSupplierId != undefined) {
            $http({
                url: '/SupplierPaymentAndAdjustment/SupplierPaymentGetById?supId=' + $scope.supplierId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                //  $scope.supplierPaymentList = data;
                angular.forEach(data, function (adata) {
                    $scope.localAndImportPBCheckList = [];
                    if (adata.PayableAmount != adata.ActualAmount) {
                        if (ImportPBId == adata.PBId) {

                            $scope.selectedIsCheck = true;
                            $scope.supplierPaymentList.push(adata);
                            $scope.localAndImportPBCheckList = $scope.supplierPaymentList;
                            PbCheckListMethod();
                        }
                        if (LocalLPBId == adata.LPBId) {
                            $scope.supplierPaymentList.push(adata);
                            $scope.localAndImportPBCheckList = $scope.supplierPaymentList;
                            PbCheckListMethod();
                        }
                    }
                    console.log('Gel All List', adata);

                });
                if ($scope.supplierPaymentList.length > 0) {
                    angular.forEach($scope.supplierPaymentList, function (aData) {
                        var res1 = aData.PBDate.substring(0, 5);
                        if (res1 == "/Date") {
                            var parsedDate1 = new Date(parseInt(aData.PBDate.substr(6)));
                            var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                            aData.PBDate = date1;
                        }
                    })

                }
            })
        }

       
    }



    $scope.LocalPBAndImportPB = [
        { Id: 0, Name: "Import Purchase Bill" },
        { Id: 1, Name: "Local Purchase Bill" }

    ];
    //$scope.onLocalPBAndImportPB = function (id) {
    //    $scope.isLocalCheckId = id;
    //    if (id == 0) {
    //        $scope.isLocalId = false;
    //    } else {
    //        $scope.isLocalId = true;
    //    }
       
    //}

    function GetAllBankAccount() {

        $http({
            url: '/BankAccount/GetAllBankAccount',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            
            $scope.BankConcat = "";
            angular.forEach(data, function (aData) {
                //$scope.BankConcat = 
                var obj = {};
                obj.BankAccountId = aData.BankAccountId;
                obj.BankName = aData.BankName + "  ~  " + aData.BranchName + "  ~  " + aData.AccountNo;
                $scope.BankAccountList.push(obj);
            })

        });
    }

    $scope.onSuppilerInfoLoad = function (supId) {
        // alert(supId);
        $scope.supplierId = supId;
        if ($scope.ddlSupplier == null) {
            $scope.supplierPaymentList = [];
        }
    }

    $scope.onChequeGetById = function (id) {

        if (id == 3) {
            $scope.checqueShowDiv = true;
        } else {
            $scope.checqueShowDiv = false;
            $scope.ddlBankAccount = 0;
        }


    }

    $scope.onLoadImportAndLoacalBtn = function () {
       
        $scope.isCheckArrayList = [];

        $http({
            url: '/SupplierPaymentAndAdjustment/SupplierPaymentGetById?supId=' + $scope.supplierId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {


            if (true) {
               
                document.getElementById("isTotalAitTextBoxId").disabled = false;
                $scope.inv_supplierPayment = {};
                $scope.supplierIsCheckPaymentCalculationList = [];
                $scope.isCheckArrayList = [];
                $scope.supplierPaymentList = [];
                angular.forEach(data, function (adata) {

                    if (adata.PayableAmount != adata.ActualAmount) {
                        $scope.selectedIsCheck =false;
                        $scope.supplierPaymentList.push(adata);
                    }
                    console.log('Gel All List', adata);

                })

                if ($scope.supplierPaymentList.length > 0) {
                    angular.forEach($scope.supplierPaymentList, function (aData) {
                        var res1 = aData.PBDate.substring(0, 5);
                        if (res1 == "/Date") {
                            var parsedDate1 = new Date(parseInt(aData.PBDate.substr(6)));
                            var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                            aData.PBDate = date1;
                        }
                    })

                }
            } else {
              
                document.getElementById("isTotalAitTextBoxId").disabled = true;
               // $scope.inv_supplierPayment = {};
                $scope.inv_supplierPayment.TotalAIT = 0;
                $scope.supplierIsCheckPaymentCalculationList = [];
                $scope.isCheckArrayList = [];
                $scope.supplierPaymentList = [];
                angular.forEach(data, function (adata) {

                    if (adata.PayableAmount != adata.ActualAmount) {
                        $scope.selectedIsCheck = false;
                        $scope.supplierPaymentList.push(adata);
                    }
                    console.log('Gel All List', adata);

                })



                if ($scope.supplierPaymentList.length > 0) {
                    angular.forEach($scope.supplierPaymentList, function (aData) {
                        var res1 = aData.PBDate.substring(0, 5);
                        if (res1 == "/Date") {
                            var parsedDate1 = new Date(parseInt(aData.PBDate.substr(6)));
                            var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                            aData.PBDate = date1;
                        }
                    })

                }
            }
            
         
        });
    }


   



    

    $scope.isCheckArrayList = [];
    $scope.isCheckIndexList = [];
    $scope.TotalActualAmountList = [];
    var vatAmount = 0;
    var aitAmount = 0;
    
    $scope.onCheckVal = function (row,select,indx) {
        row.isCheck = select;
      
       console.log('$scope.isCheckArrayList',$scope.isCheckArrayList);

        $scope.isCheck = select;
            if (row.isCheck == true) {

                $scope.isCheckArrayList.push(row);
               
                vatAmount += row.VatAmount;
                $scope.inv_supplierPayment.TotalVAT = vatAmount;

                aitAmount += row.AitAmount;
                $scope.inv_supplierPayment.TotalAIT = aitAmount;

            }
            else {

                vatAmount -= row.VatAmount;
                $scope.inv_supplierPayment.TotalVAT = vatAmount;

                aitAmount -= row.AitAmount;
                $scope.inv_supplierPayment.TotalAIT = aitAmount;

                var index = $scope.isCheckArrayList.indexOf(row);

                $scope.isCheckArrayList.splice(index, 1);
                //  $scope.supplierIsCheckPaymentCalculationList.splice($scope.pbId,1);

            }
     

      
      
    }

   

    function CheckValueAndPayvalue() {
      
        $scope.supplierIsCheckPaymentCalculationList = [];
        $scope.isPaidPaymentAmount = true;
        $scope.updatePaidlist = $scope.isCheckArrayList;

       
        //$scope.isCheckArrayList = [];

        $scope.paidAmmount = 0;

        $scope.paid = 0;
        $scope.vatAmount = 0;
        $scope.aitAmountUp = 0;

        $scope.paid = $scope.inv_supplierPayment.PaidAmount;
        $scope.vatAmount = $scope.inv_supplierPayment.TotalVAT;

        $scope.aitAmountUp = angular.copy($scope.inv_supplierPayment.TotalAIT);

        angular.forEach($scope.updatePaidlist, function (aData) {
          

            var pbNo = aData.PBNo.split('/');
            console.log(pbNo[0])
               

            $scope.PBId = aData.PBId;
          
                
                if ($scope.paid != 0 || $scope.vatAmount != 0 || $scope.aitAmountUp != 0) {
                   
                   // $scope.AitWithtableHeadHide = true;
                    $scope.AitWithtableHeadHide = true;
                    $scope.isAitShow = true;
                    if (aData.ActualAmount <= $scope.paid) {
                        aData.PaidAmount = (aData.ActualAmount).toFixed(2);
                        $scope.paid = $scope.paid - aData.ActualAmount;

                    }
                    else {
                        aData.PaidAmount = ($scope.paid).toFixed(2);
                        $scope.paid = 0;
                    }

                    if (aData.VatAmount <= $scope.vatAmount) {
                        aData.TotalVAT = (aData.VatAmount).toFixed(2);
                        $scope.vatAmount = $scope.vatAmount - aData.VatAmount;
                    } else {
                        aData.TotalVAT = ($scope.vatAmount).toFixed(2);
                        $scope.vatAmount = 0;
                    }

                    if (aData.AitAmount <= $scope.aitAmountUp) {
                        aData.TotalAIT = (aData.AitAmount).toFixed(2);
                        $scope.aitAmountUp = $scope.aitAmountUp - aData.AitAmount;

                    } else {
                        aData.TotalAIT = ($scope.aitAmountUp).toFixed(2);
                        $scope.aitAmountUp = 0;

                    }
                }
                else {
                  
                    $scope.paid = 0;
                    aData.PaidAmount = ($scope.paid).toFixed(2);

                    $scope.vatAmount = 0;
                    aData.TotalVAT = ($scope.vatAmount).toFixed(2);

                    $scope.aitAmount = 0;
                    aData.TotalAIT = ($scope.aitAmountUp).toFixed(2);
                }

                $scope.supplierIsCheckPaymentCalculationList.push(aData);
              

                $scope.suplierPaymentDetailList = [];
                angular.forEach($scope.supplierIsCheckPaymentCalculationList, function (aData) {
                    var suplierDetail = {};
                    suplierDetail.VAT = angular.copy(aData.TotalVAT);
                    suplierDetail.AIT = angular.copy(aData.TotalAIT);
                    suplierDetail.PayableAmount = aData.PayableAmount;
                    suplierDetail.SupplierPaymentId = 0;
                    suplierDetail.ActualAmount = aData.ActualAmount;
                    suplierDetail.PaidAmount = aData.PaidAmount;
                    suplierDetail.PBId = aData.PBId;
                    var pbNo = aData.PBNo.split('/');
                  
                    if (pbNo[0]=="LPB") {
                        suplierDetail.IsLocalPurchase = true;
                    } else {
                        suplierDetail.IsLocalPurchase = false;
                    }
                    $scope.suplierPaymentDetailList.push(suplierDetail);
                });

        });

       

    }

   
    $scope.UpdateAmount = function () {
        CheckValueAndPayvalue();
    }


    $scope.SupplierpaymentSave = function () {

        $scope.inv_supplierPayment.SupplierId = $scope.ddlSupplier.SupplierId;
        $scope.inv_supplierPayment.BankAccountId = $scope.ddlBankAccount.BankAccountId;
        $scope.inv_supplierPayment.PaymentTypeId = $scope.ddlCheque.PaymentTypeId;

        var paymentDate = $("#supplierPaymentDate").val();
        $scope.inv_supplierPayment.PaymentDate = paymentDate.split("/").reverse().join("-");

        var chequeDate = $("#txtChequeDate").val();
        $scope.inv_supplierPayment.ChequeDate = chequeDate.split("/").reverse().join("-");

        $http({
            url: "/SupplierPaymentAndAdjustment/SaveSupplierPayment",
            method: "POST",
            data: JSON.stringify({ _SupplierPayment: $scope.inv_supplierPayment, proc_SupplierPaymentsdetail: $scope.suplierPaymentDetailList }),
        }).success(function (data) {

            if (data > 0) {
                alertify.log('Supplier Payment ' + status + ' Successfully!', 'success', '5000');
               // Clear();
                $scope.checqueShowDiv = false;
                $scope.suplierPaymentDetailList = [];
                $scope.isCheckArrayList = [];
                $scope.onLoadImportAndLoacalBtn();
              
               
                $scope.SupplierPayment.$setPristine();
                $scope.SupplierPayment.$setUntouched();
            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
    
        })

    }



    $scope.isCheckArrayList = [];
    $scope.isCheckIndexList = [];
    $scope.TotalActualAmountList = [];
    var vatAmount = 0;
    var aitAmount = 0;


    function PbCheckListMethod() {
        if ($scope.selectedIsCheck = true) {

            $scope.isCheckArrayList = $scope.localAndImportPBCheckList;
            angular.forEach($scope.isCheckArrayList, function (aData) {
                $scope.AitWithtableHeadHide = true;
                $scope.isAitShow = true;
                vatAmount += aData.VatAmount;
                $scope.inv_supplierPayment.TotalVAT = vatAmount;

                aitAmount += aData.AitAmount;
                $scope.inv_supplierPayment.TotalAIT = aitAmount;

            })

        }
        else {

            angular.forEach($scope.isCheckArrayList, function (aData) {
                $scope.AitWithtableHeadHide = true;
                $scope.isAitShow = true;
                vatAmount += aData.VatAmount;
                $scope.inv_supplierPayment.TotalVAT = vatAmount;

                aitAmount += aData.AitAmount;
                $scope.inv_supplierPayment.TotalAIT = aitAmount;
                $scope.isCheckArrayList.splice(aData, 1);
            })

            //vatAmount -= row.VatAmount;
            //$scope.inv_supplierPayment.TotalVAT = vatAmount;

            //aitAmount -= row.AitAmount;
            //$scope.inv_supplierPayment.TotalAIT = aitAmount;

            //var index = $scope.isCheckArrayList.indexOf(row);

            //$scope.isCheckArrayList.splice(index, 1);
            //  $scope.supplierIsCheckPaymentCalculationList.splice($scope.pbId,1);

        }
    }

    $scope.onCheckVal = function (row, select, indx) {
        row.isCheck = select;
        $scope.pbId = row.PBId;
        $scope.isCheck = select;
        console.log($scope.isCheck);

        console.log($scope.pbId);

        row.index = indx;

        if (true) {
            if (row.isCheck == true) {

                $scope.isCheckArrayList.push(row);

                vatAmount += row.VatAmount;
                $scope.inv_supplierPayment.TotalVAT = vatAmount;

                aitAmount += row.AitAmount;
                $scope.inv_supplierPayment.TotalAIT = aitAmount;

            }
            else {

                vatAmount -= row.VatAmount;
                $scope.inv_supplierPayment.TotalVAT = vatAmount;

                aitAmount -= row.AitAmount;
                $scope.inv_supplierPayment.TotalAIT = aitAmount;

                var index = $scope.isCheckArrayList.indexOf(row);

                $scope.isCheckArrayList.splice(index, 1);
                //  $scope.supplierIsCheckPaymentCalculationList.splice($scope.pbId,1);

            }
        } else {

            if (row.isCheck == true) {
                // $scope.inv_supplierPayment.TotalAIT = 0;

                $scope.isCheckArrayList.push(row);

                vatAmount += row.VatAmount;
                $scope.inv_supplierPayment.TotalVAT = vatAmount;

                aitAmount += row.AitAmount;
                $scope.inv_supplierPayment.TotalAIT = 0;

            }
            else {

                vatAmount -= row.VatAmount;
                $scope.inv_supplierPayment.TotalVAT = vatAmount;

                aitAmount -= row.AitAmount;
                $scope.inv_supplierPayment.TotalAIT = 0;

                var index = $scope.isCheckArrayList.indexOf(row);

                $scope.isCheckArrayList.splice(index, 1);
                //  $scope.supplierIsCheckPaymentCalculationList.splice($scope.pbId,1);

            }
        }






    }



    $scope.Reset = function () {
           
            $scope.inv_supplierPayment = {};
            $scope.supplierPaymentList = [];
            $scope.supplierIsCheckPaymentCalculationList = [];
            $scope.suplierPaymentDetailList = [];
            $scope.isCheckArrayList = [];
            $scope.ddlSupplier = { SupplierId: null };
            $scope.onLoadImportAndLoacalBtn();
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

    $scope.reloadBtn = function () {
        $('#txtFromDateForPB').val('');
        $('#txtToDateForPB').val('');
        $('#PBAndCompany').val('');
        $scope.FromDate = "";
        $scope.ToDate = "";
        $scope.SearchPBAndCompanyName = null;
        GetPagedSP(1);
    }

    $scope.SPSearch = function () {
        GetPagedSP(1);

    }
    $scope.getData = function (curPage) {

        // if ($scope.FromDate == "" || $scope.ToDate == "" ) {

        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetPagedSP(curPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetPagedSP($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetPagedSP($scope.currentPage);
        }
        //  }


    }
    function GetPagedSP(curPage) {

        if (curPage == null) curPage = 1;
        var startRecordNo = ($scope.PerPage * (curPage - 1)) + 1;



        var formDateChange = $("#txtFromDateForPB").val();
        $scope.FromDate = formDateChange.split('/').reverse().join('-');

        var toDateChange = $("#txtToDateForPB").val();
        $scope.ToDate = toDateChange.split('/').reverse().join('-');

        var SearchCriteria = "";



        if ($scope.SearchPBAndCompanyName != undefined && $scope.SearchPBAndCompanyName != "" && $scope.FromDate != "" && $scope.ToDate != "") {
            SearchCriteria = "([PaymentDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "') and ([ChequeNo] LIKE '%" + $scope.SearchPBAndCompanyName + "%' OR [ChequeType] LIKE '%" + $scope.SearchPBAndCompanyName + "%')";

        }
        else if ($scope.SearchPBAndCompanyName !== undefined && $scope.SearchPBAndCompanyName != null && $scope.SearchPBAndCompanyName != "") {
            SearchCriteria = "[ChequeNo] LIKE '%" + $scope.SearchPBAndCompanyName + "%' OR [ChequeType] LIKE '%" + $scope.SearchPBAndCompanyName + "%'";

        }
        else if ($scope.FromDate != "" && $scope.ToDate != "") {
            SearchCriteria = "[PaymentDate] between '" + $scope.FromDate + "' and '" + $scope.ToDate + "'";

        }


        $http({
            url: encodeURI('/SupplierPaymentAndAdjustment/GetSupplierPaymentGetPaged?startRecordNo=' + startRecordNo + '&rowPerPage=' + $scope.PerPage + "&whereClause=" + SearchCriteria + '&rows=' + 0),
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            $scope.supplierPaymentGetPagedList = data.ListData;
            console.log('supplierPaymentGetPagedList', $scope.supplierPaymentGetPagedList);
            $scope.total_count = data.TotalRecord;
            console.log('supplierPaymentGetPagedList', $scope.supplierPaymentGetPagedList);
            if ($scope.supplierPaymentGetPagedList.length > 0) {
                angular.forEach($scope.supplierPaymentGetPagedList, function (aSd) {
                    var res1 = aSd.PaymentDate.substring(0, 5);
                    if (res1 == "/Date") {
                        var parsedDate1 = new Date(parseInt(aSd.PaymentDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'dd/MM/yyyy')).toString();
                        aSd.PaymentDate = date1;
                    }
                  
                })

            }
            if ($scope.supplierPaymentGetPagedList.length > 0) {
                angular.forEach($scope.supplierPaymentGetPagedList, function (aSd) {
                   
                    var res2 = aSd.ChequeDate.substring(0, 5);
                    if (res2 == "/Date") {
                        var parsedDate2 = new Date(parseInt(aSd.ChequeDate.substr(6)));
                        var date2 = ($filter('date')(parsedDate2, 'dd/MM/yyyy')).toString();
                        aSd.ChequeDate = date2;
                    }
                })

            }
            else {
                alertify.log('Supplier Payment  Not Found', 'error', '5000');
            }



        });
    }

});