app.controller("InventoryReportsMushakController", function ($scope, $cookieStore, $cookies, $http, $filter, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    load();

    //Functions
    function load() {
        $scope.Mushak4_3Report = 'Mushak4_3ReportFalse';
        $scope.Mushak6_1Report = 'Mushak6_1ReportFalse';
        $scope.Mushak6_2Report = 'Mushak6_2ReportFalse';
        $scope.suppilerList = [];
        $scope.suppilerImportPBList = [];
        $scope.BillOfMaterialList = [];
        $scope.ddlImporter = null;
        $scope.ddlImportPbImporter = null;
        $scope.ddlLocalOrImp = null;
        $scope.ddlBillOfMaterial = null;
        GetBillOfMaterial();
    }

    $scope.Mushak6_1ReportFalse = function () {
        $scope.Mushak6_1Report = 'Mushak6_1ReportFalse';

    }
    $scope.Mushak6_1 = function () {
        $scope.Mushak6_1Report = 'Mushak6_1Report';

    }

    $scope.Mushak6_2ReportFalse = function () {
        $scope.Mushak6_2Report = 'Mushak6_2ReportFalse';

    }
    $scope.Mushak6_2 = function () {
        $scope.Mushak6_2Report = 'Mushak6_2Report';

    }

    $scope.Mushak4_3ReportFalse = function () {
        $scope.Mushak4_3Report = 'Mushak4_3ReportFalse';

    }
    $scope.Mushak4_3 = function () {
        $scope.Mushak4_3Report = 'Mushak4_3Report';

    }

    function GetBillOfMaterial() {
            $http({
                url: '/BillOfMaterial/GetBillOfMaterialByBillOfMaterialId',
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.BillOfMaterialList = data;

            })
    }


    //function GetAllActiveCompany() {
    //    var criteria = "C.IsActive=1";
    //    $http({
    //        url: '/Company/GetCompanyDynamic?searchCriteria=' + criteria + "&orderBy=CompanyName",
    //        method: 'GET',
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (data) {
    //        $scope.companyList = data;

    //    })

    //}


    $scope.IPBAndLPBList = [
        { Id: 1, Name: "Local Purchase Bill" },
        { Id: 2, Name: "Import Purchase Bill" }
    ]
    $scope.GetByPurchaseBillId = function (id) {
        $scope.IpbAndLpbDdlId = id;
        if ($scope.IpbAndLpbDdlId == 1) {
            GetAllActiveLocalPurchaseBillCompany();
            $scope.ddlImporter = null;
            $scope.ddlImportPbImporter = null;

        } else if ($scope.IpbAndLpbDdlId == 2) {
            GetAllActiveImportPurchaseBillCompany();
            $scope.ddlImporter = null;
            $scope.ddlImportPbImporter = null;

        }
    }

    //GetLocalPBDynamic

    function GetAllActiveImportPurchaseBillCompany() {
        var criteria = "1=1";
        $http({
            url: '/PurchaseBill/GetPBDynamic?where=' + criteria + "&orderBy=SupplierName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            $scope.suppilerList = Enumerable.From(data).Distinct(function (x) {
                return x.SupplierName
            }).ToArray();

        });

    }



    function GetAllActiveLocalPurchaseBillCompany() {

        $http({
            url: '/PurchaseBill/LocalGetAll',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {

            $scope.suppilerList = Enumerable.From(data).Distinct(function (x) {
                return x.SupplierName
            }).ToArray();

        });

    }



    $scope.GetBySuppilerId = function (PBObj) {
        var IpbId = PBObj;

        if ($scope.IpbAndLpbDdlId == 1) {

            $http({
                url: '/PurchaseBill/LocalSuppilerPBId?supId=' + IpbId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.suppilerImportPBList = data;
                $scope.ddlImportPbImporter = null;
            });

        } else if ($scope.IpbAndLpbDdlId == 2) {
            $http({
                url: '/PurchaseBill/GetAllSuppilerPBId?supId=' + IpbId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.suppilerImportPBList = data;
                $scope.ddlImportPbImporter = null;
            });
        }



    }

    $scope.GetByPBId = function (pBId) {
        if ($scope.IpbAndLpbDdlId == 1) {
            $scope.LpbId = pBId.LPBId;
        }
        else if ($scope.IpbAndLpbDdlId == 2) {
            $scope.IportPBId = pBId.PBId;
        }


    }
    $scope.MusukBtn = function () {
        if ($scope.IpbAndLpbDdlId == 1) {
            $window.open("#/Mushak6_2", "popup", "width=850,height=550,left=280,top=80");
            $cookieStore.put("PBId", $scope.LpbId);
            event.stopPropagation();
        } else if ($scope.IpbAndLpbDdlId == 2) {
            $window.open("#/Mushak6_2", "popup", "width=850,height=550,left=280,top=80");
            $cookieStore.put("PBId", $scope.IportPBId);
            event.stopPropagation();
        }

    }

    $scope.MushakBtn_6_1 = function () {
        if ($scope.IpbAndLpbDdlId == 1) {
            $window.open("#/Mushak6_1", "popup", "width=850,height=550,left=280,top=80");
            $cookieStore.put("PBId", $scope.LpbId);
            event.stopPropagation();
        } else if ($scope.IpbAndLpbDdlId == 2) {
            $window.open("#/Mushak6_1", "popup", "width=850,height=550,left=280,top=80");
            $cookieStore.put("PBId", $scope.IportPBId);
            event.stopPropagation();
        }

    }

    $scope.MushakBtn_4_3 = function () {
        $window.open("#/Mushak4_3", "popup", "width=850,height=550,left=280,top=80");
        var BillOfMaterialObj = $scope.ddlBillOfMaterial;
        $cookieStore.put("BillOfMaterialObj", BillOfMaterialObj);
        event.stopPropagation();

    };


    //$scope.CIFReportBtn = function (companyId) {
    //    $window.open("#/CIFReport", "popup", "width=850,height=550,left=280,top=80");
    //    //var companyId = company.CompanyId;
    //    $scope.company = {};
    //    if ($scope.CIFFromDate != undefined && $scope.CIFToDate != undefined) {
    //        $scope.CIFFromDate = $scope.CIFFromDate.split("/").reverse().join("-");
    //        $scope.CIFToDate = $scope.CIFToDate.split("/").reverse().join("-");
    //    }



    //    $scope.company['companyId'] = companyId;
    //    $scope.company['CIFFromDate'] = $scope.CIFFromDate;
    //    $scope.company['CIFToDate'] = $scope.CIFToDate;
    //    $cookies.remove("Company");
    //    $cookies.putObject("Company", $scope.company);
    //    event.stopPropagation();

    //};


});
