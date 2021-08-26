app.controller("OverheadEntryController", function ($scope, $cookieStore, $http, $window) {
    $scope.message = "Hello!";
    $scope.button = "Save";
    $scope.overheadentrylist = [];
    $scope.HasAccounts = false;

    //Server side pagination
    $scope.currentPage = 1;
    $scope.PerPage = 10;
    $scope.total_count = 0;

    //For Screen lock
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('OverheadScreenId');
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
        $scope.ad_OverHead = new Object();
        $scope.ad_OverHead.OverHeadId = 0;
        $scope.ad_OverHead.IsActive = true;
        $scope.button = "Save";
        txtOverheadName.focus();
        $scope.btnDeleteShow = false;
        GetHasAccounts();
        GetAllOverheadPaged($scope.currentPage);
    }
    
    Clear();
   
    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetAllOverheadPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetAllOverheadPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetAllOverheadPaged($scope.currentPage);
        }
    };

    function GetAllOverheadPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/OverHead/GetAllOverheadPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.overheadentrylist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    //function GetOverheadName() {
    //    $http({
    //        url: '/OverHead/GetAllOverhead',
    //        method: 'GET',
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (data) {
    //        $scope.overheadentrylist = data;
    //    });
    //}

    function GetHasAccounts() {
        $http({
            url: '/Item/GetHasAccounts',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.HasAccounts = (data === 'true');
        });
    }

    $scope.AddOverHeadName = function () {
        if ($scope.found) {
            txtOverheadName.focus();
        }
        else {
            //For Creator details Start
            $scope.LoginUser = $cookieStore.get('UserData');
            $scope.UserId = $scope.LoginUser.UserId;
            //End
            $scope.ad_OverHead.CreatorId = $scope.UserId;
            $scope.ad_OverHead.UpdatorId = $scope.UserId;
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_OverHead.OverHeadId == 0) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            var parms = JSON.stringify({ overhead: $scope.ad_OverHead });
                            $http.post('/OverHead/Save', parms).success(function (data) {
                                if (data > 0) {
                                    alertify.log('Overhead Name Saved Successfully!', 'success', '5000');
                                    Clear();

                                    $scope.overheadEntryForm.$setPristine();
                                    $scope.overheadEntryForm.$setUntouched();
                                } else {
                                    alertify.log('Save Failed!', 'error', '5000');
                                }
                            }).error(function (data) {
                                alertify.log('Server Errors!', 'error', '5000');
                            });
                        }
                    })
                } else {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            var parms = JSON.stringify({ overhead: $scope.ad_OverHead });
                            $http.post('/OverHead/Save', parms).success(function (data) {
                                if (data > 0) {
                                    alertify.log('Overhead Name Updated Successfully!', 'success', '5000');
                                    Clear();

                                    $scope.overheadEntryForm.$setPristine();
                                    $scope.overheadEntryForm.$setUntouched();
                                } else {
                                    alertify.log('Save Failed!', 'error', '5000');
                                }
                            }).error(function (data) {
                                alertify.log('Server Errors!', 'error', '5000');
                            });
                        }
                    })
                }
            } else {
                var parms = JSON.stringify({ overhead: $scope.ad_OverHead });
                $http.post('/OverHead/Save', parms).success(function (data) {
                    if (data > 0) {
                        if ($scope.ad_OverHead.OverHeadId == 0) {
                            alertify.log('Overhead Name Saved Successfully!', 'success', '5000');
                        } else {
                            alertify.log('Overhead Name Updated Successfully!', 'success', '5000');
                        }
                        Clear();

                        $scope.overheadEntryForm.$setPristine();
                        $scope.overheadEntryForm.$setUntouched();
                    } else {
                        alertify.log('Save Failed!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '5000');
                });
            }
        }
    };

    $scope.SelOverhead = function (overhead) {
        $scope.ad_OverHead = overhead;
        if (overhead.IsActive) {
            $scope.ad_OverHead.IsActive = true;
        }
        $scope.button = "Update";
        $scope.btnDeleteShow = true;
        $window.scrollTo(0, 0);
    };

    $scope.CheckDuplicateOverheadName = function () {
        var criteria = ' OverHeadName=\'' + $scope.ad_OverHead.OverHeadName + '\'';

        if ($scope.ad_OverHead.OverHeadId != 0) {
            criteria += ' AND OverHeadId<>' + $scope.ad_OverHead.OverHeadId;
        }

        $http({
            url: '/OverHead/GetOverheadDynamic?searchCriteria=' + criteria + '&orderBy=OverHeadName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_OverHead.OverHeadName + ' already exists!', 'already', '5000');
                txtOverheadName.focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    };

    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ OverHeadId: $scope.ad_OverHead.OverHeadId });
                $http.post('/OverHead/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Overhead Name Deleted Successfully!', 'success', '5000');
                        Clear();
                        $scope.overheadEntryForm.$setPristine();
                        $scope.overheadEntryForm.$setUntouched();
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
        $scope.overheadEntryForm.$setPristine();
        $scope.overheadEntryForm.$setUntouched();
        $scope.ad_OverHead.OverHeadName = '';
        $scope.ad_OverHead.AccountCode = '';
    };
});