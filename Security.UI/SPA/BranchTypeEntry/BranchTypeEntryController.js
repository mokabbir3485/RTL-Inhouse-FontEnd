app.controller("BranchTypeEntryController", function ($scope, $cookieStore, $route, $http, $window) {
    //For Screen lock
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('BranchTypeScreenId');
    $scope.ScreenLockInfo = [];



    $scope.message = "Hello!";
    $scope.button = "Save";
    $scope.BranchTypelist = [];

    //Server side pagination
    $scope.currentPage = 1;
    $scope.itemsPerPage = 10;
    $scope.total_count = 0;
    CheckNet();
    //ScreenLock();

    function CheckNet() {
        $http({
            url: '/BranchType/CheckInternet',
            method: 'GET',
            headers:{'content-type':'application/json'}
        }).success(function (status) {
            var sta = status;
        })
    }
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

    //function GetBranchType() {
    //    $http({
    //        url: '/BranchType/GetAllBranchType',
    //        method: 'GET',
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function(data) {
    //        $scope.BranchTypelist = data;
    //    });
    //}

    function Clear() {
        $scope.found = true;
        $scope.ad_BranchType = new Object();
        $scope.ad_BranchType.BranchTypeId = 0;
        $scope.button = "Save";
        txtBranchTypeName.focus();
        $scope.Show = false;
        //GetBranchType();
        GetAllBranchTypePaged($scope.currentPage);
    }

    Clear();
    $scope.getData = function (curPage) {
        // alert(r);
        if ($scope.itemsPerPage > 100) {
            $scope.itemsPerPage = 100;
            $scope.currentPage = curPage;
            GetAllBranchTypePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.itemsPerPage < 1) {
            $scope.itemsPerPage = 1;
            $scope.currentPage = curPage;
            GetAllBranchTypePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetAllBranchTypePaged($scope.currentPage);
        }


    };

    function GetAllBranchTypePaged(curPage) {
        if (curPage == null) {
            curPage = 1;
        }
        var StartRecordNo = ($scope.itemsPerPage * (curPage - 1)) + 1;
        $http({
            url: '/BranchType/GetAllBranchTypePaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.itemsPerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.BranchTypelist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    //Duplicacy check start
    $scope.CheckDuplicateBranchTypeName = function () {
        var criteria = '1=1';
        if ($scope.ad_BranchType.BranchTypeId == 0) {
            criteria += ' AND BranchTypeName=\'' + $scope.ad_BranchType.BranchTypeName + '\'';
        } else {
            criteria += ' AND BranchTypeName=\'' + $scope.ad_BranchType.BranchTypeName + '\' AND BranchTypeId<>' + $scope.ad_BranchType.BranchTypeId;
        }
        $http({
            url: '/BranchType/GetBranchTypeDynamic?searchCriteria=' + criteria + '&orderBy=BranchTypeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_BranchType.BranchTypeName + ' already exists!', 'already', '5000');
                txtBranchTypeName.focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    };
    $scope.foundChange = function () {
        $scope.found = true;
    };
    //Duplicacy check end

    $scope.AddBranchType = function () {
        if ($scope.found) {
            txtBranchTypeName.focus();
        }
        else {
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_BranchType.BranchTypeId == 0) {
                    alertify.log('Only one Entry Possible', 'error', '5000');
                    //alertify.confirm("Are you sure to save?", function (e) {
                    //    if (e) {
                    //        var parms = JSON.stringify({ BranchType: $scope.ad_BranchType });
                    //        $http.post('/BranchType/Save', parms).success(function (data) {
                    //            if (data > 0) {
                    //                alertify.log('Business Type Saved Successfully!', 'success', '5000');
                    //                Clear();
                    //                $scope.branchTypeEntryForm.$setPristine();
                    //                $scope.branchTypeEntryForm.$setUntouched();

                    //            } else {
                    //                alertify.log('Save Failed!', 'error', '5000');
                    //            }
                    //        }).error(function (data) {
                    //            alertify.log('Server Errors!', 'error', '5000');
                    //        });
                    //    }
                    //})
                }
                else {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            var parms = JSON.stringify({ BranchType: $scope.ad_BranchType });
                            $http.post('/BranchType/Save', parms).success(function (data) {
                                if (data > 0) {
                                    alertify.log('Business Type Updated Successfully!', 'success', '5000');
                                    Clear();
                                    $scope.branchTypeEntryForm.$setPristine();
                                    $scope.branchTypeEntryForm.$setUntouched();
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
                if ($scope.ad_BranchType.BranchTypeId == 0) {
                    alertify.log('Only one Entry Possible', 'error', '5000');
                }
                else {
                    var parms = JSON.stringify({ BranchType: $scope.ad_BranchType });
                    $http.post('/BranchType/Save', parms).success(function (data) {
                        if (data > 0) {
                            if ($scope.ad_BranchType.BranchTypeId == 0) {
                                alertify.log('Business Type Saved Successfully!', 'success', '5000');
                            } else {
                                alertify.log('Business Type Updated Successfully!', 'success', '5000');
                            }
                            Clear();
                            $scope.branchTypeForm.$setUntouched();
                            $scope.branchTypeForm.$setPristine();

                        } else {
                            alertify.log('Save Failed!', 'error', '5000');
                        }
                    }).error(function (data) {
                        alertify.log('Server Errors!', 'error', '5000');
                    });
                }
            }
        }
    }

    $scope.SelBranchType = function (BranchType) {
        $scope.ad_BranchType = BranchType;
        $scope.button = "Update";
        $scope.Show = false;
        // $window.scrollTo(0, 0);
        $("body").animate({ scrollTop: 0 }, 400);
    }

    $scope.CheckDuplicate = function () {
        GetBranchType();
        $scope.found = false;
        if ($scope.ad_BranchType.BranchTypeId == 0) {
            for (var i = 0; i < $scope.BranchTypelist.length; i++) {
                if ($scope.BranchTypelist[i].BranchTypeName.toLowerCase() == $scope.ad_BranchType.BranchTypeName.toLowerCase()) {
                    $scope.found = true;
                    break;
                }
            }
        }
        else {
            for (var i = 0; i < $scope.BranchTypelist.length; i++) {
                if ($scope.BranchTypelist[i].BranchTypeName.toLowerCase() == $scope.ad_BranchType.BranchTypeName.toLowerCase() && $scope.BranchTypelist[i].BranchTypeId != $scope.ad_BranchType.BranchTypeId) {
                    $scope.found = true;
                    break;
                }
            }

        }
        if ($scope.found) {
            alertify.log($scope.ad_BranchType.BranchTypeName + ' already exists!', 'already', '5000');
            txtBranchTypeName.focus();
        }
        else {

        }
    }

    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ BranchTypeId: $scope.ad_BranchType.BranchTypeId });
                $http.post('/BranchType/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Business Type Deleted Successfully!', 'success', '5000');
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
        $scope.branchTypeEntryForm.$setPristine();
        $scope.branchTypeEntryForm.$setUntouched();
        // $route.reload();
        //$scope.branchTypeEntryForm.BranchTypeName.$error = new Object();
    };

});