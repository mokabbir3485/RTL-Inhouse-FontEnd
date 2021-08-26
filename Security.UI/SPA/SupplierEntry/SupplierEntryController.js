app.controller("SupplierEntryController", function ($scope, $cookieStore, $http, $window) {
    $scope.message = "Hello!";

    $scope.supplierlist = [];
    $scope.supplierTypeList = [];
    $scope.supplierAddresslist = [];
    $scope.supplierBillPolicylist = [];
    //Server side pagination
    $scope.currentPage = 1;
    $scope.PerPage = 10;
    $scope.total_count = 0;
    //For Screen lock
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('SupplierScreenId');
    $scope.ScreenLockInfo = [];
    //ScreenLock();
    //Lock Screen by user
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

    //User configuration start
    $scope.ConfirmationMessageForAdmin = false;

    function GetConfirmationMessageForAdmin() {
        $http({
            url: '/Role/GetConfirmationMessageForAdmin',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ConfirmationMessageForAdmin = (data === 'true');
        });
    }

    GetConfirmationMessageForAdmin();

    function GetSupplierType() {
        $http({
            url: '/Supplier/GetAllSupplerType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }
        ).success(function (data) {
            $scope.supplierTypeList = data;
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    $scope.buttonSupp = "Save";

    function ClearSupplier() {
        $scope.ad_Supplier = new Object();
        $scope.ad_Supplier.SupplierId = 0;
        $scope.ad_Supplier.SupplierType = "Local";
        $scope.ad_Supplier.IsActive = true;
        txtSupplierName.focus();
        $scope.buttonSupp = "Save";
        $scope.btnDeleleShow = false;
        //GetSupplier();
        GetSupplierType();
        GetSupplierPaged($scope.currentPage);
        $scope.ddlSupplierType = null;
    }

    ClearSupplier();

    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetSupplierPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetSupplierPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetSupplierPaged($scope.currentPage);
        }
    };

    function GetSupplierPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/Supplier/GetSupplierPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.supplierlist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    $scope.AddSupplier = function () {

        var addressList = $scope.supplierAddresslist;
        var hasOneDefultAddress = false;
        for (i = 0; i < addressList.length; i++) {
            if (addressList[i].Status == "Yes") {
                hasOneDefultAddress = true;
                break;
            }
        }
        if (hasOneDefultAddress) {
            if ($scope.ConfirmationMessageForAdmin) {
                $scope.ad_Supplier.SupplierTypeId = $scope.ddlSupplierType.SupplierTypeId;
                //For Creator details Start
                $scope.LoginUser = $cookieStore.get('UserData');
                $scope.UserId = $scope.LoginUser.UserId;
                //End
                $scope.ad_Supplier.CreatorId = $scope.UserId;
                $scope.ad_Supplier.UpdatorId = $scope.UserId;
                var supId = 0;
                if ($scope.ad_Supplier.SupplierId == 0) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            var parms = JSON.stringify({ supplier: $scope.ad_Supplier });
                            $http.post('/Supplier/SaveSupplier', parms).success(function (data) {
                                if (data > 0) {
                                    supId = data;
                                    GetSupplierInfo(supId);
                                    SaveAddressAndBillpolicy(supId);
                                }
                                else {
                                    alertify.log('Server Errors!', 'error', '5000');
                                }
                            }).error(function (data) {
                                alertify.log('Server Errors!', 'error', '5000');
                            });
                        }
                    })
                }
                else {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            var parms = JSON.stringify({ supplier: $scope.ad_Supplier });
                            $http.post('/Supplier/UpdateSupplier', parms).success(function (data) {
                                if (data > 0) {
                                    supId = $scope.ad_Supplier.SupplierId;
                                    alertify.log('Supplier (' + $scope.ad_Supplier.SupplierCode + ') Updated Successfully!', 'success', '5000');
                                    SaveAddressAndBillpolicy(supId);
                                }
                                else {
                                    alertify.log('Server Errors!', 'error', '5000');
                                }
                            }).error(function (data) {
                                alertify.log('Server Errors!', 'error', '5000');
                            });
                        }
                    })
                }
            }
            else {
                //For Creator details Start
                $scope.LoginUser = $cookieStore.get('UserData');
                $scope.UserId = $scope.LoginUser.UserId;
                //End
                $scope.ad_Supplier.CreatorId = $scope.UserId;
                $scope.ad_Supplier.UpdatorId = $scope.UserId;
                var supId = 0;
                if ($scope.ad_Supplier.SupplierId == 0) {
                    var parms = JSON.stringify({ supplier: $scope.ad_Supplier });
                    $http.post('/Supplier/SaveSupplier', parms).success(function (data) {
                        if (data > 0) {
                            supId = data;
                            GetSupplierInfo(supId);
                            SaveAddressAndBillpolicy(supId);
                        }
                        else {
                            alertify.log('Server Errors!', 'error', '5000');
                        }
                    }).error(function (data) {
                        alertify.log('Server Errors!', 'error', '5000');
                    });
                }
                else {
                    var parms = JSON.stringify({ supplier: $scope.ad_Supplier });
                    $http.post('/Supplier/UpdateSupplier', parms).success(function (data) {
                        supId = $scope.ad_Supplier.SupplierId;
                        alertify.log('Supplier (' + $scope.ad_Supplier.SupplierCode + ') Updated Successfully!', 'success', '5000');
                        if (data > 0) {
                            SaveAddressAndBillpolicy(supId);
                        }
                        else {
                            alertify.log('Server Errors!', 'error', '5000');
                        }
                    }).error(function (data) {
                        alertify.log('Server Errors!', 'error', '5000');
                    });
                }
            }

        }
        else {

            alertify.log('Atleast Select One Defult Value!', 'error', '5000');
        }

    };

    function GetSupplierInfo(supId) {
        $http({
            url: '/Supplier/GetSupplierById',
            method: "GET",
            params: { supplierId: supId },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            alertify.log('Supplier (' + data.SupplierCode + ') Saved Successfully!', 'success', '5000');
        })
    }

    function SaveAddressAndBillpolicy(supId) {
        for (var i = 0; i < $scope.supplierAddresslist.length; i++) {
            $scope.ad_SupplierAddress = new Object();
            $scope.ad_SupplierAddress.SupplierId = supId;
            $scope.ad_SupplierAddress.AddressType = $scope.supplierAddresslist[i].AddressType;
            $scope.ad_SupplierAddress.Address = $scope.supplierAddresslist[i].Address;
            $scope.ad_SupplierAddress.ContactPerson = $scope.supplierAddresslist[i].ContactPerson;
            $scope.ad_SupplierAddress.ContactDesignation = $scope.supplierAddresslist[i].ContactDesignation;
            $scope.ad_SupplierAddress.Phone = $scope.supplierAddresslist[i].Phone;
            $scope.ad_SupplierAddress.Mobile = $scope.supplierAddresslist[i].Mobile;
            $scope.ad_SupplierAddress.Email = $scope.supplierAddresslist[i].Email;
            $scope.ad_SupplierAddress.Port = $scope.supplierAddresslist[i].Port;
            $scope.ad_SupplierAddress.IsDefault = $scope.supplierAddresslist[i].IsDefault;
            var parmsAdd = JSON.stringify({ supplieraddress: $scope.ad_SupplierAddress });
            $http.post('/Supplier/SaveSupplerAddress', parmsAdd).success(function (data) {
            }).error(function (data) {
                alertify.log('Server Errors!', 'error', '5000');
            });
        }

        for (var i = 0; i < $scope.supplierBillPolicylist.length; i++) {
            $scope.ad_SupplierBillPolicy = new Object();
            $scope.ad_SupplierBillPolicy.SupplierId = supId;
            $scope.ad_SupplierBillPolicy.PolicyDescription = $scope.supplierBillPolicylist[i].PolicyDescription;
            var parmsBill = JSON.stringify({ supplierbillpolicy: $scope.ad_SupplierBillPolicy });
            $http.post('/Supplier/SaveSupplerBillPolicy', parmsBill).success(function (data) {
            }).error(function (data) {
                alertify.log('Server Errors!', 'error', '5000');
            });
        }
        $scope.supplierAddresslist = [];
        $scope.supplierBillPolicylist = [];
        ClearSupplier();
        ClearSupplierAddress();
        ClearSupplierBillPolicy();
        $scope.supplierEntryForm.$setPristine();
        $scope.supplierEntryForm.$setUntouched();
    }

    $scope.SelSupplier = function (supplier) {
        $scope.ad_Supplier = supplier;
       
        $scope.ddlSupplierType = { "SupplierTypeId": supplier.SupplierTypeId };
        GetSupplierAddress($scope.ad_Supplier.SupplierId);
        GetSupplierBillPolicy($scope.ad_Supplier.SupplierId);
        $scope.buttonSupp = "Update";
        $scope.btnDeleleShow = true;
        $window.scrollTo(0, 0);
    }

    function GetSupplierAddress(SupplierId) {
        $http({
            url: '/Supplier/GetAllSupplerAddress',
            method: "GET",
            params: { supplierId: SupplierId },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.supplierAddresslist = [];
            $scope.supplierAddresslist = data;
        })
    }

    function GetSupplierBillPolicy(SupplierId) {
        $http({
            url: '/Supplier/GetAllSupplerBillPolicy',
            method: "GET",
            params: { supplierId: SupplierId },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.supplierBillPolicylist = [];
            $scope.supplierBillPolicylist = data;
        })
    }

    function ClearSupplierAddress() {
        $scope.ad_SupplierAddress = new Object();
        $scope.ad_SupplierAddress.AddressType = 'Mailing';
        $scope.buttonSuppAddress = "Add";
        $scope.btnSuppAddressDeleleShow = false;
        $scope.addressRowIndex = '';
    }

    ClearSupplierAddress();

    function ClearSupplierBillPolicy() {
        $scope.ad_SupplierBillPolicy = new Object();
        $scope.buttonBillPolicy = "Add";
        $scope.btnSuppBillPolicyDeleleShow = false;
        $scope.billRowIndex = '';
    }

    ClearSupplierBillPolicy();

    $scope.AddSupplierAddress = function () {

        if ($scope.buttonSuppAddress == "Add") {
            if ($scope.ad_SupplierAddress.IsDefault || $scope.ad_SupplierAddress.IsDefault || $scope.ad_SupplierAddress.IsDefault) {
                $scope.ad_SupplierAddress.Status = 'Yes';
            }

            else {
                $scope.ad_SupplierAddress.Status = 'No';
            }
            $scope.supplierAddresslist.push($scope.ad_SupplierAddress);
            ClearSupplierAddress();
            $scope.supplierEntryForm.$setPristine();
        }
        else {
            if ($scope.ad_SupplierAddress.IsDefault || $scope.ad_SupplierAddress.IsDefault || $scope.ad_SupplierAddress.IsDefault) {
                $scope.ad_SupplierAddress.Status = 'Yes';
            }
            else {
                $scope.ad_SupplierAddress.Status = 'No';
            }
            ClearSupplierAddress();
        }

    }

    $scope.CheckDefault = function (defaultAdd) {
        if (defaultAdd) {
            angular.forEach($scope.supplierAddresslist, function (address) {
                if ($scope.ad_SupplierAddress.AddressType == 'Mailing' || $scope.ad_SupplierAddress.AddressType == 'Billing' || $scope.ad_SupplierAddress.AddressType == 'DeliveryPoint') {
                    if (address.Status == 'Yes' && address.AddressType == 'Mailing' || address.Status == 'Yes' && address.AddressType == 'Billing' || address.Status == 'Yes' && address.AddressType == 'DeliveryPoint') {
                        alertify.log('One Default Address Accepted!', 'error', '5000');
                        $scope.ad_SupplierAddress.IsDefault = false;
                        return;
                    }
                }
            })
        }
    }

    $scope.SelSupplierAddress = function (supplierAddress, index) {
        $scope.ad_SupplierAddress = supplierAddress;
        $scope.buttonSuppAddress = "Change";
        $scope.btnSuppAddressDeleleShow = true;
        $scope.addressRowIndex = index;
    }

    $scope.removeAddress = function () {
        $scope.supplierAddresslist.splice($scope.addressRowIndex, 1);
        ClearSupplierAddress();
    },

    $scope.AddSupplierBillPolicy = function () {
        if ($scope.buttonBillPolicy == "Add") {
            $scope.supplierBillPolicylist.push($scope.ad_SupplierBillPolicy);
            ClearSupplierBillPolicy();
            $scope.supplierEntryForm.$setPristine();
        }
        else {
            ClearSupplierBillPolicy();
        }
    }

    $scope.SelSupplierBillPolicy = function (supplierbillpolicy, index) {
        $scope.ad_SupplierBillPolicy = supplierbillpolicy;
        $scope.buttonBillPolicy = "Change";
        $scope.btnSuppBillPolicyDeleleShow = true;
        $scope.billRowIndex = index;
    }

    $scope.removeBillPolicy = function () {
        $scope.supplierBillPolicylist.splice($scope.billRowIndex, 1);
        ClearSupplierBillPolicy();
    },

    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ supplierId: $scope.ad_Supplier.SupplierId });
                $http.post('/Supplier/DeleteSupplier', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Supplier( ' + $scope.ad_Supplier.SupplierCode + ' ) Deleted Successfully!', 'success', '5000');
                        $scope.supplierAddresslist = [];
                        $scope.supplierBillPolicylist = [];
                        ClearSupplier();
                    } else {
                        alertify.log('Delete Failed!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '5000');
                });
            }
        });
    };

    $scope.resetForm = function () {
        ClearSupplier();
        ClearSupplierAddress();
        ClearSupplierBillPolicy();
        $scope.supplierAddresslist = [];
        $scope.supplierBillPolicylist = [];
        $scope.supplierEntryForm.$setPristine();
        $scope.supplierEntryForm.$setUntouched();
        $scope.ad_Supplier.SupplierName = '';
        $scope.ad_Supplier.Web = '';
        $scope.ad_SupplierAddress.Address = '';
        $scope.ad_SupplierAddress.ContactPerson = '';
        $scope.ad_SupplierAddress.ContactDesignation = '';
        $scope.ad_SupplierAddress.Phone = '';
        $scope.ad_SupplierAddress.Mobile = '';
        $scope.ad_SupplierAddress.Email = '';
        $scope.ad_SupplierBillPolicy.PolicyDescription = '';
    };
});