app.controller("OfferController", function ($scope, $http, $cookieStore, $filter) {
    load();
    function load() {
        $scope.CropTypeList = [];// [{ SubCategoryId: 100, SubCategoryName: 'Rice Seed' },{ SubCategoryId: 102, SubCategoryName: 'Mango Seed' },{ SubCategoryId: 101, SubCategoryName: 'Gom Seed' },{ SubCategoryId: 103, SubCategoryName: 'Potata Seed' }];
        $scope.VarietyList = [];//[{ SubCategoryId: 100, ItemId: '1001', ItemName: 'Ropa Aman' },{ SubCategoryId: 100, ItemId: '1002', ItemName: 'Kapa Jamal' },{ SubCategoryId: 100, ItemId: '1003', ItemName: 'Ropa Kashem' },{ SubCategoryId: 100, ItemId: '1004', ItemName: 'Kola SAman' },{ SubCategoryId: 102, ItemId: '1005', ItemName: 'Aman Jama' },{ SubCategoryId: 102, ItemId: '1006', ItemName: 'Rola Ka' },{ SubCategoryId: 102, ItemId: '1007', ItemName: 'Kali Hati' },{ SubCategoryId: 101, ItemId: '1008', ItemName: 'Jakama' },{ SubCategoryId: 101, ItemId: '1009', ItemName: 'Kusia' },{ SubCategoryId: 101, ItemId: '1010', ItemName: 'Mon tsd' },{ SubCategoryId: 101, ItemId: '1011', ItemName: 'Opula Ki' },{ SubCategoryId: 103, ItemId: '1012', ItemName: 'Molina Kh' },{ SubCategoryId: 100, ItemId: '1013', ItemName: 'Ropa Aman' },{ SubCategoryId: 100, ItemId: '1014', ItemName: 'Kapa Jamal' },{ SubCategoryId: 100, ItemId: '1015', ItemName: 'Ropa Kashem' },{ SubCategoryId: 100, ItemId: '1016', ItemName: 'Kola SAman' },{ SubCategoryId: 102, ItemId: '1017', ItemName: 'Aman Jama' },{ SubCategoryId: 102, ItemId: '1018', ItemName: 'Rola Ka' },{ SubCategoryId: 102, ItemId: '1019', ItemName: 'Kali Hati' },{ SubCategoryId: 101, ItemId: '1020', ItemName: 'Jakama' },{ SubCategoryId: 101, ItemId: '1021', ItemName: 'Kusia' },{ SubCategoryId: 101, ItemId: '1022', ItemName: 'Mon tsd' },{ SubCategoryId: 101, ItemId: '1023', ItemName: 'Opula Ki' },{ SubCategoryId: 103, ItemId: '1024', ItemName: 'Molina Kh' },{ SubCategoryId: 103, ItemId: '1025', ItemName: 'Vaduri La' }];
        $scope.ItemUnitlist = [];
        $scope.RoleList = [];
        $scope.pos_Offer = {};
        $scope.pos_Offer.HasDateRange = false;
        $scope.pos_Offer.OfferTypeId = 1;
        $scope.pos_Offer.OfferId = 0;
        $("#txtOpeningDate").val('');
        $("#txtColosingDate").val('');
        $scope.pos_OfferDetail = [];
        GetAllRole();
        GetAllItemUnit();
        GetAllCropType();
        GetAllVariety(); 
        GetAllOffer();
        $scope.SaveBtnLbl = 'Create Offer';
    }
    function GetAllRole() {
        $http({
            url: "/Role/GetAllRole",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.RoleList = data;
            $scope.ddlAutoriserRole = { RoleId: data[0].RoleId };
            $scope.pos_Offer.RoleId = data[0].RoleId;
        });
    }
    function GetAllCropType() {
        var criteria = "SubCategoryId IN (SELECT SubCategoryId FROM ad_Item I WHERE I.SubCategoryId=S.SubCategoryId AND I.IsActive=1)";
        $http({
            url: "/Subcategory/GetSubcategoryDynamic?searchCriteria=" + criteria + "&orderBy=SubCategoryName",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CropTypeList = data;
        });
    }
    function GetAllVariety() {
        $http({
            url: "/Item/GetLimitedProperty",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.VarietyList = data;
            angular.forEach($scope.VarietyList, function (aVariety) {
                aVariety.Checked = false;
                aVariety.SaleUnitId = aVariety.DefaultSaleUnitId;
                aVariety.ddlSelMU = { ItemUnitId: aVariety.DefaultSaleUnitId };
            });
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
    function GetAllOffer() {
        $http({
            url: "/Offer/GetAll",
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AllOfferList = data;
            angular.forEach($scope.AllOfferList, function (aOffer) {
                if (aOffer.HasDateRange) {
                    var res = aOffer.StartDate.substring(0, 5);
                    if (res == "/Date") {
                        var parsedDate = new Date(parseInt(aOffer.StartDate.substr(6)));
                        aOffer.StartDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
                    }
                    res = aOffer.EndDate.substring(0, 5);
                    if (res == "/Date") {
                        var parsedDate = new Date(parseInt(aOffer.EndDate.substr(6)));
                        aOffer.EndDate = $filter('date')(parsedDate, 'dd/MM/yyyy');
                    }
                }
                else {
                    aOffer.StartDate = 'N/A';
                    aOffer.EndDate = 'N/A';
                }
            });
        });
    }
    function GetAllDetailsOffer() {
        $http({
            url: "/Offer/GetAllDetail",
            method: 'POST',
            data: JSON.stringify({ OfferId: $scope.pos_Offer.OfferId }),
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.VarietyOnOfferList = data;
            angular.forEach($scope.VarietyList, function (aVariety) {
                aVariety.Checked = false;
                aVariety.SaleUnitId = aVariety.DefaultSaleUnitId;
                aVariety.FreeUnitId = aVariety.DefaultSaleUnitId;
                aVariety.ddlSelMU = { ItemUnitId: aVariety.DefaultSaleUnitId };
                aVariety.ddlFreeMU = { ItemUnitId: aVariety.DefaultSaleUnitId };
                angular.forEach($scope.VarietyOnOfferList, function (aVarietyOnOffer) {
                    if (aVariety.ItemId == aVarietyOnOffer.ItemId) {
                        aVariety.Checked = true;
                        aVariety.SaleUnitId = aVarietyOnOffer.SaleUnitId;
                        aVariety.FreeUnitId = aVarietyOnOffer.FreeUnitId;
                        aVariety.ddlSelMU = { ItemUnitId: aVarietyOnOffer.SaleUnitId };
                        aVariety.ddlFreeMU = { ItemUnitId: aVarietyOnOffer.FreeUnitId };
                    }
                });
            });
            ParrentCheckboxSelect();
            $scope.SaveBtnLbl = 'Update Offer';
        });
    }
    $scope.SaveOffer = function () {
        var erroMsg = [];
        if ($scope.pos_Offer.HasDateRange) {
            if ($("#txtOpeningDate").val() == '' || $("#txtOpeningDate").val() == undefined || $("#txtOpeningDate").val() == null) {
                erroMsg.push({
                    msg: "Please Select Starting Date "
                });
            }
            else {
                var from = $("#txtOpeningDate").val().split("/");
                var f = new Date(from[2], from[1] - 1, from[0]);
                $scope.pos_Offer.StartDate = f;
            }
            if ($("#txtColosingDate").val() == '' || $("#txtColosingDate").val() == undefined || $("#txtColosingDate").val() == null) {
                erroMsg.push({
                    msg: "Please Select Ending Date "
                });
            }
            else {
                from = $("#txtColosingDate").val().split("/");
                f = new Date(from[2], from[1] - 1, from[0]);
                $scope.pos_Offer.EndDate = f;
            }
        }
        else {
            $scope.pos_Offer.StartDate = '2017-01-01';
            $scope.pos_Offer.EndDate = '3017-01-01';
        }
        if (($scope.pos_Offer.OffPercentage == undefined || $scope.pos_Offer.OffPercentage == '' || $scope.pos_Offer.OffPercentage == null || $scope.pos_Offer.OffPercentage <= 0) && ($scope.pos_Offer.OffAmount == undefined || $scope.pos_Offer.OffAmount == null || $scope.pos_Offer.OffAmount == '' || $scope.pos_Offer.OffAmount <= 0) && $scope.pos_Offer.OfferTypeId != 3 && (($scope.pos_Offer.BuyCount == undefined || $scope.pos_Offer.BuyCount == null || $scope.pos_Offer.BuyCount == '' || $scope.pos_Offer.BuyCount <= 0) || ($scope.pos_Offer.FreeCount == undefined || $scope.pos_Offer.FreeCount == null || $scope.pos_Offer.FreeCount == '' || $scope.pos_Offer.FreeCount <= 0))) {
            erroMsg.push({
                msg: "Please Select and Enter Offer type"
            });
        }
        else {

            var pos_OfferDetailLts = [];
            angular.forEach($scope.VarietyList, function (aVariety) {
                if (aVariety.Checked) {
                    pos_OfferDetailLts.push(aVariety);
                }
            })
            if (pos_OfferDetailLts.length < 1) {
                erroMsg.push({
                    msg: "Please Select at least 1 Product"
                });
            }
            else {
                $scope.LoginUser = $cookieStore.get('UserData');
                $scope.pos_Offer.CreatorId = $scope.LoginUser.UserId;
                $scope.pos_Offer.UpdatorId = $scope.LoginUser.UserId;
            }


            $scope.LoginUser = $cookieStore.get('UserData');
            $scope.pos_Offer.CreatorId = $scope.LoginUser.UserId;
            $scope.pos_Offer.UpdatorId = $scope.LoginUser.UserId;
        }

        if (erroMsg.length > 0) {
            angular.forEach(erroMsg, function (aErroMsg) {
                alertify.log(aErroMsg.msg, 'error', '5000');
            });
        }
        else {
           // var pos_OfferDetailLts = [];

            $.ajax({
                url: "/Offer/SaveOffer",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                type: "POST",
                data: JSON.stringify({ _pos_Offer: $scope.pos_Offer, pos_OfferDetailLts: pos_OfferDetailLts }),
                success: function (data) {
                    if (data > 0) {
                        alertify.log($scope.SaveBtnLbl + ' Successful!', 'success', '100000');
                        load();
                    } else { alertify.log('Server Save Errors!', 'error', '10000'); }
                }, error: function (msg) {
                    alertify.log('Server Save Errors!', 'error', '10000');
                }
            });
        }
    }
    $scope.ResetOffer = function () {
        load();
    }
    $scope.OfferTypeChange = function (OfferTypeId) {
        $scope.pos_Offer.OffPercentage = '';
        $scope.pos_Offer.OffAmount = '';
        $scope.pos_Offer.ManualAmount = '';
        $scope.pos_Offer.BuyCount = '';
        $scope.pos_Offer.FreeCount = '';
        if (OfferTypeId == 1) {
            angular.forEach($scope.VarietyList, function (aVariety) {
                aVariety.SaleUnitId = 0;
                aVariety.FreeUnitId = 0;
                aVariety.ddlSelMU = null;
                aVariety.ddlFreeMU = null;
            });
        }
        else if (OfferTypeId == 2 || OfferTypeId == 3) {
            angular.forEach($scope.VarietyList, function (aVariety) {
                aVariety.SaleUnitId = aVariety.DefaultSaleUnitId;
                aVariety.FreeUnitId = 0;
                aVariety.ddlSelMU = { ItemUnitId: aVariety.DefaultSaleUnitId };
                aVariety.ddlFreeMU = null;
            });
        }
        else {
            angular.forEach($scope.VarietyList, function (aVariety) {
                aVariety.SaleUnitId = aVariety.DefaultSaleUnitId;
                aVariety.FreeUnitId = aVariety.DefaultSaleUnitId;
                aVariety.ddlSelMU = { ItemUnitId: aVariety.DefaultSaleUnitId };
                aVariety.ddlFreeMU = { ItemUnitId: aVariety.DefaultSaleUnitId };
            });
        }
    }
    $scope.CheckOrUncheckAll = function (CheckUncheckAll, SubCategoryId) {
        angular.forEach($scope.VarietyList, function (aVariety) {
            if (aVariety.SubCategoryId == SubCategoryId) {
                aVariety.Checked = CheckUncheckAll;
            }
        });
    }
    $scope.ApplyOnCrop = function (ApplyOn) {
        if (ApplyOn == '1' || ApplyOn == '3') {
            angular.forEach($scope.CropTypeList, function (aCropType) {
                aCropType.CheckUncheckAll = true;
            });
            angular.forEach($scope.VarietyList, function (aVariety) {
                aVariety.Checked = true;
            });
        } else {
            angular.forEach($scope.CropTypeList, function (aCropType) {
                aCropType.CheckUncheckAll = false;
            });
            angular.forEach($scope.VarietyList, function (aVariety) {
                aVariety.Checked = false;
            });
        }
    }
    /*
    $scope.ParrentCheckboxSelector = function (SubCategoryId) {
        var flag = true;
        angular.forEach($scope.VarietyList, function (aVariety) {
            if (aVariety.SubCategoryId == SubCategoryId && aVariety.Checked == false) {
                flag = false;
            }
        });
        angular.forEach($scope.CropTypeList, function (aCropType) {
            if (aCropType.SubCategoryId == SubCategoryId) {
                aCropType.CheckUncheckAll = flag;
            }
        });
    }
    */
    $scope.unitFilter = function (RawItem) {
        return function (pram) {
            return (pram.ItemUnitId == RawItem.UnitId) || (pram.ItemUnitId == RawItem.PackageId) || (pram.ItemUnitId == RawItem.ContainerId);
        };
    };
    $scope.ParrentCheckboxSelector = function () {
        ParrentCheckboxSelect();
    }
    function ParrentCheckboxSelect() {
        angular.forEach($scope.CropTypeList, function (aCropType) {
            var flag = true;
            angular.forEach($scope.VarietyList, function (aVariety) {
                if (aVariety.SubCategoryId == aCropType.SubCategoryId && aVariety.Checked == false) {
                    flag = false;
                }
            });
            aCropType.CheckUncheckAll = flag;
        });
    }
    $scope.FillControll = function (aOffer) {
        $scope.pos_Offer = aOffer;
        $scope.ddlAutoriserRole = { RoleId: aOffer.RoleId };
        $("#txtOpeningDate").val(aOffer.StartDate);
        $("#txtColosingDate").val(aOffer.EndDate);
        GetAllDetailsOffer();
    }
});