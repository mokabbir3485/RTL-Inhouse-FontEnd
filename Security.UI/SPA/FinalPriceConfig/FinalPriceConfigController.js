app.controller("FinalPriceConfigController", function ($scope, $cookieStore, $http, $window) {
    
    $scope.message = 'Hello';
    //list for save
    $scope.FinalPriceConfigurationListSave = [];
    $scope.TransactionTypelistSave = [];
    $scope.ChargeTypelistSave = [];
    $scope.PriceTypelistSave = [];
    $scope.ChargeTypeForApplyListSave = [];
    $scope.ApplyCheckListSave = [];
    $scope.PriceTypeCheckListSave = [];
    //list for save end
    $scope.FinalPriceConfigurationList = [];
    $scope.TransactionTypelist = [];
    $scope.ChargeTypelist = [];
    $scope.PriceTypelist = [];
    $scope.ChargeTypeForApplyList = [];
    $scope.ApplyCheckList = [];
    $scope.PriceTypeCheckList = [];
    
    //Server side pagination
    $scope.currentPage = 1;
    $scope.PerPage = 10;
    $scope.total_count = 0;

    //For Screen lock
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('FinalPriceConfigScreenId');
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
    //end Screen lock

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
    //User configuration end

    function ListForSave() {
        $scope.FinalPriceConfigurationListSave = [];
        $scope.TransactionTypelistSave = [];
        $scope.ChargeTypelistSave = [];
        $scope.PriceTypelistSave = [];
        $scope.ChargeTypeForApplyListSave = [];
        $scope.ApplyCheckListSave = [];
        $scope.PriceTypeCheckListSave = [];
        //Update
        if ($scope.IsUpdate) {
            $scope.FinalPriceConfigurationListSave = $scope.FinalPriceConfigurationList;
            $scope.TransactionTypelistSave = $scope.TransactionTypelist;
            $scope.PriceTypelistSave = $scope.PriceTypelist;
            $scope.ChargeTypeForApplyListSave = $scope.ChargeTypeForApplyList;
            if ($scope.IsMoveRow) {
                $scope.ChargeTypelistSave = $scope.ChargeTypelist;
                $scope.ApplyCheckListSave = $scope.ApplyCheckList;
            }
            else {
                $scope.ChargeTypelistSave = $scope.ChargeTypeDatalist;
                angular.forEach($scope.ChargeTypeDatalist, function (chrgType) {
                    for (var i = 0; i < chrgType.ApplyOn.length; i++) {
                        if (chrgType.ApplyOn[i].Check) {
                            $scope.ApplyCheckList.push({
                                check: true,
                                id: chrgType.ApplyOn[i].ChargeTypeId,
                                typeId: chrgType.ChargeTypeId
                            });
                        }
                    }
                });
                $scope.ApplyCheckListSave = $scope.ApplyCheckList;
            }
            $scope.PriceTypeCheckListSave = $scope.PriceTypeCheckList;
        }
            //save
        else {
            $scope.FinalPriceConfigurationListSave = $scope.FinalPriceConfigurationList;
            $scope.TransactionTypelistSave = $scope.TransactionTypelist;
            $scope.ChargeTypelistSave = $scope.ChargeTypelist;
            $scope.PriceTypelistSave = $scope.PriceTypelist;
            $scope.ChargeTypeForApplyListSave = $scope.ChargeTypeForApplyList;
            $scope.ApplyCheckListSave = $scope.ApplyCheckList;
            $scope.PriceTypeCheckListSave = $scope.PriceTypeCheckList;
        }


    }

    //function GetAllConfig() {
    //    $http({
    //        url: '/FinalPriceConfig/GetAllConfig',
    //        method: 'GET',
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (data) {
    //        $scope.FinalPriceConfigurationList = data;
    //    });
    //}

    function GetAllTransactionType() {
        $http({
            url: '/Item/GetAllTransactionType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.TransactionTypelist = data;
        });
    }

    function GetChargeType() {
        $http({
            url: '/ChargeType/GetAllChargeTypeWithProductPrice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ChargeTypelist = data;
            $scope.ChargeTypeForApplyList = data;
        })
    }

    function GetPriceType() {
        $http({
            url: '/PriceType/GetAllPriceType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.PriceTypelist = data;
        })
    }

    function Clear() {
        $scope.found = false;
        $scope.ad_FinalPriceConfig = new Object();
        $scope.ad_FinalPriceConfig.ConfigId = 0;
        $scope.btnSave = "Save";
        ddlTransactionType.focus();
        $scope.btnDeleteShow = false;
        $scope.UpdateTable = false;
        $scope.CreateTable = true;
        $scope.IsUpdate = false;
        $scope.IsMoveRow = false;
        $scope.ApplyCheckList = [];
        $scope.PriceTypeCheckList = [];
        $scope.ddlTransactionType = null;
        GetAllTransactionType();
        GetChargeType();
        GetPriceType();
        //GetAllConfig();
        GetFinalPriceConfigPaged($scope.currentPage);
    }

    Clear();
    
    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetFinalPriceConfigPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetFinalPriceConfigPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetFinalPriceConfigPaged($scope.currentPage);
        }
    };

    function GetFinalPriceConfigPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/FinalPriceConfig/GetFinalPriceConfigPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.FinalPriceConfigurationList = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    $scope.AddConfig = function() {
        if ($scope.found) {
            txtConfigName.focus();
        }
        else {
            if ($scope.ConfirmationMessageForAdmin) {
                ListForSave();
                if ($scope.IsUpdate) {
                    alertify.confirm("Are you sure to update?", function(e) {
                        if (e) {
                            $scope.ad_FinalPriceConfig.TransactionTypeId = $scope.ddlTransactionType.TransactionTypeId;
                            if ($scope.ddlTransactionType.TransactionTypeId == 1) { //For Purchase  
                                $scope.ad_FinalPriceConfig.PriceTypeId = 0;
                                var parms = JSON.stringify({ finalPriceConfig: $scope.ad_FinalPriceConfig });
                                $http.post('/FinalPriceConfig/SaveFinalPriceConfig', parms).success(function(data) {
                                    $scope.ad_FinalPriceConfigDetail = new Object();
                                    $scope.ad_FinalPriceConfigDetail.ConfigId = $scope.ad_FinalPriceConfig.ConfigId;
                                    var i = 0;
                                    angular.forEach($scope.ChargeTypelistSave, function(chrgType) {
                                        if (chrgType.ChargeTypeId > 1) {
                                            i++;
                                            $scope.ad_FinalPriceConfigDetail.ChargeTypeId = chrgType.ChargeTypeId;
                                            $scope.ad_FinalPriceConfigDetail.ChargePercentage = chrgType.ChargePercentage;
                                            $scope.ad_FinalPriceConfigDetail.OrderId = i;
                                            var parms = JSON.stringify({ finalPriceConfigDetail: $scope.ad_FinalPriceConfigDetail });
                                            $http.post('/FinalPriceConfig/SaveFinalPriceConfigDetail', parms).success(function(data) {
                                                if (chrgType.ChargeTypeId > 1) {
                                                    $scope.ad_FinalPriceConfigDetailApplyOn = new Object();
                                                    $scope.ad_FinalPriceConfigDetailApplyOn.ConfigDetailId = data;

                                                    for (var i = 0; i < $scope.ApplyCheckListSave.length; i++) {
                                                        if ($scope.ApplyCheckListSave[i].typeId == chrgType.ChargeTypeId) {
                                                            $scope.ad_FinalPriceConfigDetailApplyOn.ApplyOnChargeTypeId = $scope.ApplyCheckListSave[i].id;
                                                            var parms = JSON.stringify({ finalPriceConfigDetailApplyOn: $scope.ad_FinalPriceConfigDetailApplyOn });
                                                            $http.post('/FinalPriceConfig/SaveFinalPriceConfigDetailApplyOn', parms).success(function(data) {
                                                            })
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    alertify.log('Configuration Updated Successfully!', 'success', '5000');
                                    Clear();
                                    $scope.finalPriceConfigForm.$setPristine();
                                    $scope.finalPriceConfigForm.$setUntouched();

                                }).error(function(data) {
                                    alertify.log('Server Errors!', 'error', '5000');
                                });

                            } else {
                                if ($scope.PriceTypeCheckListSave.length > 0) { //For Sales
                                    $scope.success = true;
                                    for (var i = 0; i < $scope.PriceTypeCheckListSave.length; i++) {
                                        $scope.ad_FinalPriceConfig.PriceTypeId = $scope.PriceTypeCheckListSave[i].typeId;
                                        var parms = JSON.stringify({ finalPriceConfig: $scope.ad_FinalPriceConfig });
                                        $http.post('/FinalPriceConfig/SaveFinalPriceConfig', parms).success(function(data) {
                                            $scope.ad_FinalPriceConfigDetail = new Object();
                                            $scope.ad_FinalPriceConfigDetail.ConfigId = $scope.ad_FinalPriceConfig.ConfigId;
                                            var i = 0;
                                            angular.forEach($scope.ChargeTypelistSave, function(chrgType) {
                                                if (chrgType.ChargeTypeId > 1) {
                                                    i++;
                                                    $scope.ad_FinalPriceConfigDetail.ChargeTypeId = chrgType.ChargeTypeId;
                                                    $scope.ad_FinalPriceConfigDetail.ChargePercentage = chrgType.ChargePercentage;
                                                    $scope.ad_FinalPriceConfigDetail.OrderId = i;
                                                    var parms = JSON.stringify({ finalPriceConfigDetail: $scope.ad_FinalPriceConfigDetail });
                                                    $http.post('/FinalPriceConfig/SaveFinalPriceConfigDetail', parms).success(function(data) {
                                                        if (chrgType.ChargeTypeId > 1) {
                                                            $scope.ad_FinalPriceConfigDetailApplyOn = new Object();
                                                            $scope.ad_FinalPriceConfigDetailApplyOn.ConfigDetailId = data;
                                                            for (var i = 0; i < $scope.ApplyCheckListSave.length; i++) {
                                                                if ($scope.ApplyCheckListSave[i].typeId == chrgType.ChargeTypeId) {
                                                                    $scope.ad_FinalPriceConfigDetailApplyOn.ApplyOnChargeTypeId = $scope.ApplyCheckListSave[i].id;
                                                                    var parms = JSON.stringify({ finalPriceConfigDetailApplyOn: $scope.ad_FinalPriceConfigDetailApplyOn });
                                                                    $http.post('/FinalPriceConfig/SaveFinalPriceConfigDetailApplyOn', parms).success(function(data) {
                                                                    })
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                            if ($scope.success) {
                                                $scope.success = false;
                                                alertify.log('Configuration Updated Successfully!', 'success', '5000');
                                            }
                                            Clear();
                                            $scope.finalPriceConfigForm.$setPristine();
                                            $scope.finalPriceConfigForm.$setUntouched();
                                        }).error(function(data) {
                                            alertify.log('Server Errors!', 'error', '5000');
                                        });
                                    }

                                } else {
                                    alertify.log('Please select price type!', 'already', '5000');
                                }
                            }
                        }
                    })
                } else {
                    alertify.confirm("Are you sure to save?", function(e) {
                        if (e) {
                            $scope.ad_FinalPriceConfig.TransactionTypeId = $scope.ddlTransactionType.TransactionTypeId;
                            if ($scope.ddlTransactionType.TransactionTypeId == 1) { //For Purchase  
                                $scope.ad_FinalPriceConfig.PriceTypeId = 0;
                                var parms = JSON.stringify({ finalPriceConfig: $scope.ad_FinalPriceConfig });
                                $http.post('/FinalPriceConfig/SaveFinalPriceConfig', parms).success(function(data) {
                                    $scope.ad_FinalPriceConfigDetail = new Object();
                                    $scope.ad_FinalPriceConfigDetail.ConfigId = data;
                                    var i = 0;
                                    angular.forEach($scope.ChargeTypelistSave, function(chrgType) {
                                        if (chrgType.ChargeTypeId > 1) {
                                            i++;
                                            $scope.ad_FinalPriceConfigDetail.ChargeTypeId = chrgType.ChargeTypeId;
                                            $scope.ad_FinalPriceConfigDetail.ChargePercentage = chrgType.ChargePercentage;
                                            $scope.ad_FinalPriceConfigDetail.OrderId = i;
                                            var parms = JSON.stringify({ finalPriceConfigDetail: $scope.ad_FinalPriceConfigDetail });
                                            $http.post('/FinalPriceConfig/SaveFinalPriceConfigDetail', parms).success(function(data) {
                                                if (chrgType.ChargeTypeId > 1) {
                                                    $scope.ad_FinalPriceConfigDetailApplyOn = new Object();
                                                    $scope.ad_FinalPriceConfigDetailApplyOn.ConfigDetailId = data;

                                                    for (var i = 0; i < $scope.ApplyCheckListSave.length; i++) {
                                                        if ($scope.ApplyCheckListSave[i].typeId == chrgType.ChargeTypeId) {
                                                            $scope.ad_FinalPriceConfigDetailApplyOn.ApplyOnChargeTypeId = $scope.ApplyCheckListSave[i].id;
                                                            var parms = JSON.stringify({ finalPriceConfigDetailApplyOn: $scope.ad_FinalPriceConfigDetailApplyOn });
                                                            $http.post('/FinalPriceConfig/SaveFinalPriceConfigDetailApplyOn', parms).success(function(data) {
                                                            })
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    });
                                    alertify.log('Configuration Saved Successfully!', 'success', '5000');
                                    Clear();
                                    $scope.finalPriceConfigForm.$setPristine();
                                    $scope.finalPriceConfigForm.$setUntouched();

                                }).error(function(data) {
                                    alertify.log('Server Errors!', 'error', '5000');
                                });

                            } else {
                                if ($scope.PriceTypeCheckListSave.length > 0) { //For Sales
                                    $scope.success = true;
                                    for (var i = 0; i < $scope.PriceTypeCheckListSave.length; i++) {
                                        $scope.ad_FinalPriceConfig.PriceTypeId = $scope.PriceTypeCheckListSave[i].typeId;
                                        var parms = JSON.stringify({ finalPriceConfig: $scope.ad_FinalPriceConfig });
                                        $http.post('/FinalPriceConfig/SaveFinalPriceConfig', parms).success(function(data) {
                                            $scope.ad_FinalPriceConfigDetail = new Object();
                                            $scope.ad_FinalPriceConfigDetail.ConfigId = data;
                                            var i = 0;
                                            angular.forEach($scope.ChargeTypelistSave, function(chrgType) {
                                                if (chrgType.ChargeTypeId > 1) {
                                                    i++;
                                                    $scope.ad_FinalPriceConfigDetail.ChargeTypeId = chrgType.ChargeTypeId;
                                                    $scope.ad_FinalPriceConfigDetail.ChargePercentage = chrgType.ChargePercentage;
                                                    $scope.ad_FinalPriceConfigDetail.OrderId = i;
                                                    var parms = JSON.stringify({ finalPriceConfigDetail: $scope.ad_FinalPriceConfigDetail });
                                                    $http.post('/FinalPriceConfig/SaveFinalPriceConfigDetail', parms).success(function(data) {
                                                        if (chrgType.ChargeTypeId > 1) {
                                                            $scope.ad_FinalPriceConfigDetailApplyOn = new Object();
                                                            $scope.ad_FinalPriceConfigDetailApplyOn.ConfigDetailId = data;
                                                            for (var i = 0; i < $scope.ApplyCheckListSave.length; i++) {
                                                                if ($scope.ApplyCheckListSave[i].typeId == chrgType.ChargeTypeId) {
                                                                    $scope.ad_FinalPriceConfigDetailApplyOn.ApplyOnChargeTypeId = $scope.ApplyCheckListSave[i].id;
                                                                    var parms = JSON.stringify({ finalPriceConfigDetailApplyOn: $scope.ad_FinalPriceConfigDetailApplyOn });
                                                                    $http.post('/FinalPriceConfig/SaveFinalPriceConfigDetailApplyOn', parms).success(function(data) {
                                                                    })
                                                                }
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                            if ($scope.success) {
                                                $scope.success = false;
                                                alertify.log('Configuration Saved Successfully!', 'success', '5000');
                                            }
                                            Clear();
                                            $scope.finalPriceConfigForm.$setPristine();
                                            $scope.finalPriceConfigForm.$setUntouched();
                                        }).error(function(data) {
                                            alertify.log('Server Errors!', 'error', '5000');
                                        });
                                    }

                                } else {
                                    alertify.log('Please select price type!', 'already', '5000');
                                }
                            }
                        }
                    })
                }
            } else {
                Config();
            }
        }
    };

    function Config() {
        ListForSave();
        $scope.ad_FinalPriceConfig.TransactionTypeId = $scope.ddlTransactionType.TransactionTypeId;
        if ($scope.ddlTransactionType.TransactionTypeId == 1) {   //For Purchase  
            $scope.ad_FinalPriceConfig.PriceTypeId = 0;
            var parms = JSON.stringify({ finalPriceConfig: $scope.ad_FinalPriceConfig });
            $http.post('/FinalPriceConfig/SaveFinalPriceConfig', parms).success(function (data) {
                $scope.ad_FinalPriceConfigDetail = new Object();
                if ($scope.IsUpdate) {
                    $scope.ad_FinalPriceConfigDetail.ConfigId = $scope.ad_FinalPriceConfig.ConfigId;
                }
                else {
                    $scope.ad_FinalPriceConfigDetail.ConfigId = data;
                }
                var i = 0;
                angular.forEach($scope.ChargeTypelistSave, function (chrgType) {
                    if (chrgType.ChargeTypeId > 1) {
                        i++;
                        $scope.ad_FinalPriceConfigDetail.ChargeTypeId = chrgType.ChargeTypeId;
                        $scope.ad_FinalPriceConfigDetail.ChargePercentage = chrgType.ChargePercentage;
                        $scope.ad_FinalPriceConfigDetail.OrderId = i;
                        var parms = JSON.stringify({ finalPriceConfigDetail: $scope.ad_FinalPriceConfigDetail });
                        $http.post('/FinalPriceConfig/SaveFinalPriceConfigDetail', parms).success(function (data) {
                            if (chrgType.ChargeTypeId > 1) {
                                $scope.ad_FinalPriceConfigDetailApplyOn = new Object();
                                $scope.ad_FinalPriceConfigDetailApplyOn.ConfigDetailId = data;

                                for (var i = 0; i < $scope.ApplyCheckListSave.length; i++) {
                                    if ($scope.ApplyCheckListSave[i].typeId == chrgType.ChargeTypeId) {
                                        $scope.ad_FinalPriceConfigDetailApplyOn.ApplyOnChargeTypeId = $scope.ApplyCheckListSave[i].id;
                                        var parms = JSON.stringify({ finalPriceConfigDetailApplyOn: $scope.ad_FinalPriceConfigDetailApplyOn });
                                        $http.post('/FinalPriceConfig/SaveFinalPriceConfigDetailApplyOn', parms).success(function (data) {
                                        })
                                    }
                                }
                            }
                        });
                    }
                });
                if ($scope.IsUpdate) {
                    alertify.log('Configuration Updated Successfully!', 'success', '5000');
                }
                else {
                    alertify.log('Configuration Saved Successfully!', 'success', '5000');
                }
                Clear();
                $scope.finalPriceConfigForm.$setPristine();
                $scope.finalPriceConfigForm.$setUntouched();

            }).error(function (data) {
                alertify.log('Server Errors!', 'error', '5000');
            });

        }
        else {
            if ($scope.PriceTypeCheckListSave.length > 0) {  //For Sales
                $scope.success = true;
                for (var i = 0; i < $scope.PriceTypeCheckListSave.length; i++) {
                    $scope.ad_FinalPriceConfig.PriceTypeId = $scope.PriceTypeCheckListSave[i].typeId;
                    var parms = JSON.stringify({ finalPriceConfig: $scope.ad_FinalPriceConfig });
                    $http.post('/FinalPriceConfig/SaveFinalPriceConfig', parms).success(function (data) {
                        $scope.ad_FinalPriceConfigDetail = new Object();
                        if ($scope.IsUpdate) {
                            $scope.ad_FinalPriceConfigDetail.ConfigId = $scope.ad_FinalPriceConfig.ConfigId;
                        }
                        else {
                            $scope.ad_FinalPriceConfigDetail.ConfigId = data;
                        }
                        var i = 0;
                        angular.forEach($scope.ChargeTypelistSave, function (chrgType) {
                            if (chrgType.ChargeTypeId > 1) {
                                i++;
                                $scope.ad_FinalPriceConfigDetail.ChargeTypeId = chrgType.ChargeTypeId;
                                $scope.ad_FinalPriceConfigDetail.ChargePercentage = chrgType.ChargePercentage;
                                $scope.ad_FinalPriceConfigDetail.OrderId = i;
                                var parms = JSON.stringify({ finalPriceConfigDetail: $scope.ad_FinalPriceConfigDetail });
                                $http.post('/FinalPriceConfig/SaveFinalPriceConfigDetail', parms).success(function (data) {
                                    if (chrgType.ChargeTypeId > 1) {
                                        $scope.ad_FinalPriceConfigDetailApplyOn = new Object();
                                        $scope.ad_FinalPriceConfigDetailApplyOn.ConfigDetailId = data;
                                        for (var i = 0; i < $scope.ApplyCheckListSave.length; i++) {
                                            if ($scope.ApplyCheckListSave[i].typeId == chrgType.ChargeTypeId) {
                                                $scope.ad_FinalPriceConfigDetailApplyOn.ApplyOnChargeTypeId = $scope.ApplyCheckListSave[i].id;
                                                var parms = JSON.stringify({ finalPriceConfigDetailApplyOn: $scope.ad_FinalPriceConfigDetailApplyOn });
                                                $http.post('/FinalPriceConfig/SaveFinalPriceConfigDetailApplyOn', parms).success(function (data) {
                                                })
                                            }
                                        }
                                    }
                                });
                            }
                        });
                        if ($scope.success) {
                            $scope.success = false;
                            if ($scope.IsUpdate) {
                                alertify.log('Configuration Updated Successfully!', 'success', '5000');
                            }
                            else {
                                alertify.log('Configuration Saved Successfully!', 'success', '5000');
                            }
                        }
                        Clear();
                        $scope.finalPriceConfigForm.$setPristine();
                        $scope.finalPriceConfigForm.$setUntouched();
                    }).error(function (data) {
                        alertify.log('Server Errors!', 'error', '5000');
                    });
                }

            }
            else { alertify.log('Please select price type!', 'already', '5000'); }
        }

    }
    
    $scope.CheckDuplicateConfigName = function () {
        var criteria = ' ConfigName=\'' + $scope.ad_FinalPriceConfig.ConfigName + '\'';

        if ($scope.ad_FinalPriceConfig.ConfigId != 0) {
            criteria += ' AND ConfigId<>' + $scope.ad_FinalPriceConfig.ConfigId;
        }

        $http({
            url: '/FinalPriceConfig/GetFinalPriceConfigDynamic?searchCriteria=' + criteria + '&orderBy=ConfigName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_FinalPriceConfig.ConfigName + ' already exists!', 'already', '5000');
                txtConfigName.focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        })
    };

    $scope.foundChange = function () {
        $scope.found = true;
    };

    $scope.AddCheckPriceTypeList = function (cbx, id) {
        if (cbx) {
            $scope.PriceTypeCheckList.push({
                typeId: id
            });
        }
        else {
            for (var i = 0; i < $scope.PriceTypeCheckList.length; i++) {
                if ($scope.PriceTypeCheckList[i].typeId == id) {
                    $scope.PriceTypeCheckList.splice(i, 1);
                }
            }
        }
    }

    $scope.AddCheckList = function (cbx, index, id) {
        if (cbx) {
            $scope.ApplyCheckList.push({
                check: true,
                id: $scope.ChargeTypeForApplyList[index].ChargeTypeId,
                typeId: id
            });
        }
        else {
            for (var i = 0; i < $scope.ApplyCheckList.length; i++) {
                if ($scope.ApplyCheckList[i].id == $scope.ChargeTypeForApplyList[index].ChargeTypeId && $scope.ApplyCheckList[i].typeId == id) {
                    $scope.ApplyCheckList.splice(i, 1);
                }
            }
        }
    }

    $scope.DependencyList = [];
    $scope.ChargeTypeDatalistTemp = [];
    $scope.ApplyOnListTemp = [];
    $scope.ChargeTypeDatalist = [];

    //Row select
    $scope.SelConfig = function (aConfig) {
        $scope.btnSave = "Update";
        $scope.IsUpdate = true;
        $scope.btnDeleteShow = false;
        $scope.CreateTable = false;
        $scope.UpdateTable = true;
        //Set Price Type Start
        if (aConfig.PriceTypeId > 0) {
            angular.forEach($scope.PriceTypelist, function (priceType) {
                priceType.selected = false;

            })
            $scope.PriceTypeShow = true;
            for (var j = 0; j < $scope.PriceTypelist.length; j++) {
                if ($scope.PriceTypelist[j].PriceTypeId == aConfig.PriceTypeId) {
                    $scope.PriceTypelist[j].selected = true;
                    $scope.PriceTypeCheckList.push({
                        typeId: $scope.PriceTypelist[j].PriceTypeId
                    });
                }
            }
        }
        else {
            $scope.PriceTypeShow = false;
        }
        //Set Price Type end
        $http({
            url: '/ChargeType/GetAllChargeTypeWithProductPrice',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ChargeTypelist = data;
            $scope.ChargeTypeForApplyList = data;
            $scope.ddlTransactionType = { "TransactionTypeId": aConfig.TransactionTypeId };
            $scope.ad_FinalPriceConfig = aConfig;
            $http({
                url: '/FinalPriceConfig/GetConfigDetailByCofigId?configId=' + aConfig.ConfigId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.ChargeTypeDatalist = data;
                $scope.ChargeTypeDatalistTemp[0] = $scope.ChargeTypelist[0];
                var k = 1;
                var r = 1;
                for (var i = 0; i < $scope.ChargeTypeDatalist.length; i++) {

                    for (var j = 1; j < $scope.ChargeTypelist.length; j++) {
                        if ($scope.ChargeTypeDatalist[i].ChargeTypeId == $scope.ChargeTypelist[j].ChargeTypeId) {
                            $scope.ChargeTypelist[j].percent = $scope.ChargeTypeDatalist[i].ChargePercentage;
                            $scope.ChargeTypeDatalistTemp[k] = $scope.ChargeTypelist[j];
                            k++;
                        }
                    }
                }
                $scope.ChargeTypelist = $scope.ChargeTypeDatalistTemp;
                $scope.ChargeTypeForApplyList = $scope.ChargeTypeDatalistTemp;
                GetApplyOn();

            })

        })
        $window.scrollTo(0, 0);
    };

    $scope.AppyOnList = [];

    function GetApplyOn() {
        $scope.ChargeTypeDatalist.ApplyOn = [];
        angular.forEach($scope.ChargeTypeDatalist, function (chrgType) {
            $http({
                url: '/FinalPriceConfig/GetConfigDetailApplyOnByCofigDetailId?configDetailId=' + chrgType.ConfigDetailId,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                $scope.AppyOnList = data;
                chrgType.ApplyOn = angular.copy($scope.ChargeTypelist);
                for (var j = 0; j < $scope.AppyOnList.length; j++) {
                    for (var i = 0; i < $scope.ChargeTypelist.length; i++) {
                        if ($scope.AppyOnList[j].ApplyOnChargeTypeId == $scope.ChargeTypelist[i].ChargeTypeId)
                            chrgType.ApplyOn[i].Check = true;
                    }
                }
            })
        });

    }

    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ ConfigId: $scope.ad_FinalPriceConfig.ConfigId });
                $http.post('/FinalPriceConfig/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Configuration( ' + $scope.ad_FinalPriceConfig.ConfigCode + ' ) Deleted Successfully!', 'success', '5000');
                        Clear();
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
        Clear();
        $scope.finalPriceConfigForm.$setPristine();
        $scope.finalPriceConfigForm.$setUntouched();
        $scope.ad_FinalPriceConfig.ConfigName = '';
    };

    $scope.ShowPriceType = function (trnsType) {
        if (trnsType.TransactionTypeId == 1) {
            $scope.PriceTypeShow = false;
        }
        else {
            $scope.PriceTypeShow = true;
        }
    }

    $scope.ChangeCheckList = function () {
        $scope.CreateTable = true;
        $scope.UpdateTable = false;
        GetChargeType();
    }

    var move = function (origin, destination) {
        var temp = $scope.ChargeTypelist[destination];
        $scope.ChargeTypelist[destination] = $scope.ChargeTypelist[origin];
        $scope.ChargeTypelist[origin] = temp;
    };

    $scope.moveUp = function (index) {
        move(index, index - 1);
        for (var i = 0; i < $scope.ApplyCheckList.length; i++) {
            $scope.ApplyCheckList.splice(i, 1);
        }
    };

    $scope.moveDown = function (index) {
        move(index, index + 1);
        for (var i = 0; i < $scope.ApplyCheckList.length; i++) {
            $scope.ApplyCheckList.splice(i, 1);
        }
    };

    $scope.moveUpForUpdate = function () {
        $scope.CreateTable = true;
        $scope.UpdateTable = false;
        $scope.IsMoveRow = true;
        GetChargeType();
    };

    $scope.moveDownForUpdate = function () {
        $scope.CreateTable = true;
        $scope.IsMoveRow = true;
        $scope.UpdateTable = false;
        GetChargeType();
    };
})