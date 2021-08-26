app.controller("AuditTypeEntryController", function ($scope, $cookieStore, $route, $http, $window) {
    $scope.AddDeductlist = [];
    $scope.AuditTypelist = [];

    //Server side pagination
    $scope.currentPage = 1;
    $scope.PerPage = 10;
    $scope.total_count = 0;


    //For Screen lock
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('AuditTypeScreenId');
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
    //User configuration end

    function Clear() {
        $scope.found = false;
        $scope.ad_StockAuditType = new Object();
        $scope.ad_StockAuditType.AuditTypeId = 0;
        $scope.ad_StockAuditType.IsActive = true;
        $scope.ddlAddOrDeduct =null;
        $scope.button = "Save";
        txtAuditTypeName.focus();
        $scope.Show = false;
        GetAddDeduct();
        // GetAllAuditType();
        GetAuditTypePaged($scope.currentPage);
    }

    function GetAddDeduct() {
        $http({
            url: '/AuditType/GetAddDeduct',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AddDeductlist = data;
        });
    }

    //function GetAllAuditType() {
    //    $http({
    //        url: '/AuditType/GetAllAuditType',
    //        method: 'GET',
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (data) {
    //        $scope.AuditTypelist = data;
    //    });
    //}
    
    Clear();
    
    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetAuditTypePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetAuditTypePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetAuditTypePaged($scope.currentPage);
        }
    };

    function GetAuditTypePaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/AuditType/GetAuditTypePaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AuditTypelist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    $scope.AddAuditType = function () {
        if ($scope.found) {
            txtAuditTypeName.focus();
        }
        else {
            $scope.ad_StockAuditType.AuditGroupId = $scope.ddlAddOrDeduct.AuditGroupId;
            //For Creator details Start
            $scope.LoginUser = $cookieStore.get('UserData');
            $scope.UserId = $scope.LoginUser.UserId;
            //End
            $scope.ad_StockAuditType.CreatorId = $scope.UserId;
            $scope.ad_StockAuditType.UpdatorId = $scope.UserId;
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_StockAuditType.AuditTypeId == 0) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            var parms = JSON.stringify({ stockAuditType: $scope.ad_StockAuditType });
                            $http.post('/AuditType/Save', parms).success(function (data) {
                                if (data > 0) {
                                    alertify.log('Audit Type Saved Successfully!', 'success', '5000');
                                    Clear();
                                    $scope.auditTypeEntryForm.$setPristine();
                                    $scope.auditTypeEntryForm.$setUntouched();
                                } else {
                                    alertify.log('Save Failed!', 'error', '5000');
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
                            var parms = JSON.stringify({ stockAuditType: $scope.ad_StockAuditType });
                            $http.post('/AuditType/Save', parms).success(function (data) {
                                if (data > 0) {
                                    alertify.log('Audit Type Updated Successfully!', 'success', '5000');
                                    Clear();
                                    $scope.auditTypeEntryForm.$setPristine();
                                    $scope.auditTypeEntryForm.$setUntouched();
                                } else {
                                    alertify.log('Save Failed!', 'error', '5000');
                                }
                            }).error(function (data) {
                                alertify.log('Server Errors!', 'error', '5000');
                            });
                        }
                    })
                }
            }
            else {
                var parms = JSON.stringify({ stockAuditType: $scope.ad_StockAuditType });
                $http.post('/AuditType/Save', parms).success(function (data) {
                    if (data > 0) {
                        if ($scope.ad_StockAuditType.AuditTypeId == 0) {
                            alertify.log('Audit Type Saved Successfully!', 'success', '5000');
                        } else {
                            alertify.log('Audit Type Updated Successfully!', 'success', '5000');
                        }
                        Clear();
                        $scope.auditTypeEntryForm.$setPristine();
                        $scope.auditTypeEntryForm.$setUntouched();
                    } else {
                        alertify.log('Save Failed!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '5000');
                });
            }
        }
    };

    $scope.CheckDuplicateAuditTypeName = function () {
        var criteria = ' AuditTypeName=\'' + $scope.ad_StockAuditType.AuditTypeName + '\'';

        if ($scope.ad_StockAuditType.AuditTypeId != 0) {
            criteria += ' AND AuditTypeId<>' + $scope.ad_StockAuditType.AuditTypeId;
        }

        $http({
            url: '/AuditType/GetAuditTypeDynamic?searchCriteria=' + criteria + '&orderBy=AuditTypeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_StockAuditType.AuditTypeName + ' already exists!', 'already', '5000');
                txtAuditTypeName.focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    };

    $scope.foundChange = function () {
        $scope.found = true;
    };

    $scope.SelAuditType = function(AuditType) {
        $scope.ad_StockAuditType = AuditType;
        $scope.button = "Update";
        $scope.Show = true;
        $scope.ddlAddOrDeduct = { "AuditGroupId": AuditType.AuditGroupId };
        $window.scrollTo(0, 0);
    };

    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ auditTypeId: $scope.ad_StockAuditType.AuditTypeId});
                $http.post('/AuditType/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Audit Type Deleted Successfully!', 'success', '5000');
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
        $scope.auditTypeEntryForm.$setPristine();
        $scope.auditTypeEntryForm.$setUntouched();
        $scope.ad_StockAuditType.AuditTypeName = '';
    };
})