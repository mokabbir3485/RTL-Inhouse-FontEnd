app.controller("ItemAdditionalAttributeController", function ($scope, $cookieStore, $http, $window) {

    //For Screen lock
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('ItemAdditionalAttributeScreenId');
    $scope.ScreenLockInfo = [];

    $scope.message = "Hello!";
    $scope.button = "Save";
    $scope.AddAttlist = [];

    //Server side pagination
    $scope.currentPage = 1;
    $scope.PerPage = 10;
    $scope.total_count = 0;

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
        $scope.found = false;
        $scope.ad_AdditionalAttribute = new Object();
        $scope.ad_AdditionalAttribute.AttributeId = 0;
        $scope.ad_AdditionalAttribute.IsActive = true;
        $scope.button = "Save";
        txtAddAttName.focus();
        $scope.Show = false;
        $scope.StokMtn = false;
        //GetBranchType();
        GetAdditionalAttributePaged($scope.currentPage);
    }

    Clear();

    $scope.getData = function (curPage) {
        // alert(r);
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetAdditionalAttributePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetAdditionalAttributePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetAdditionalAttributePaged($scope.currentPage);
        }


    };

    function GetAdditionalAttributePaged(curPage) {
        if (curPage == null) {
            curPage = 1;
        }
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/ItemAdditionalAttribute/GetAdditionalAttributePaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AddAttlist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    $scope.AddAddAtt = function () {
        if ($scope.found) {
            txtAddAttName.focus();
        }
        else {
            $scope.LoginUser = $cookieStore.get('UserData');
            $scope.UserId = $scope.LoginUser.UserId;
            //End
            $scope.ad_AdditionalAttribute.CreatorId = $scope.UserId;
            $scope.ad_AdditionalAttribute.UpdatorId = $scope.UserId;
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_AdditionalAttribute.AttributeId == 0) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            var parms = JSON.stringify({ AdditionalAttribute: $scope.ad_AdditionalAttribute });
                            $http.post('/ItemAdditionalAttribute/Save', parms).success(function (data) {
                                if (data > 0) {
                                    alertify.log('Additional Attribute Saved Successfully!', 'success', '5000');
                                    Clear();
                                    $scope.itemAdditionalAttributeForm.$setPristine();
                                    $scope.itemAdditionalAttributeForm.$setUntouched();

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
                            var parms = JSON.stringify({ AdditionalAttribute: $scope.ad_AdditionalAttribute });
                            $http.post('/ItemAdditionalAttribute/Save', parms).success(function (data) {
                                if (data > 0) {
                                    alertify.log('Additional Attribute Updated Successfully!', 'success', '5000');
                                    Clear();
                                    $scope.itemAdditionalAttributeForm.$setPristine();
                                    $scope.itemAdditionalAttributeForm.$setUntouched();
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
                var parms = JSON.stringify({ AdditionalAttribute: $scope.ad_AdditionalAttribute });
                $http.post('/ItemAdditionalAttribute/Save', parms).success(function (data) {
                    if (data > 0) {
                        if ($scope.ad_AdditionalAttribute.AttributeId == 0) {
                            alertify.log('Additional Attribute Saved Successfully!', 'success', '5000');
                        } else {
                            alertify.log('Additional Attribute Updated Successfully!', 'success', '5000');
                        }
                        Clear();
                        $scope.itemAdditionalAttributeForm.$setUntouched();
                        $scope.itemAdditionalAttributeForm.$setPristine();

                    } else {
                        alertify.log('Save Failed!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '5000');
                });
            }
        }
    }

    $scope.SelAddAtt = function (aSelAddAtt) {
        $scope.ad_AdditionalAttribute = aSelAddAtt;
        //if (aSelAddAtt.IsStockMaintain) {
        //    $scope.StokMtn = true;
        //}
        //else {
        //    $scope.StokMtn = false;
        //}
        $scope.button = "Update";
        $scope.Show = true;
        $window.scrollTo(0, 0);
    }

    //$scope.ShowStokMaintain = function (IsFixed) {
    //    if (IsFixed) {
    //        $scope.StokMtn = true;
    //    }
    //    else {
    //        $scope.StokMtn = false;
    //        $scope.ad_AdditionalAttribute.IsStockMaintain = false;
    //    }
    //}

    $scope.CheckDuplicateAdditionalAttribute = function () {
        var criteria = ' AttributeName=\'' + $scope.ad_AdditionalAttribute.AttributeName + '\'';

        if ($scope.ad_AdditionalAttribute.AttributeId != 0) {
            criteria += ' AND AttributeId<>' + $scope.ad_AdditionalAttribute.AttributeId;
        }

        $http({
            url: '/ItemAdditionalAttribute/GetAdditionalAttributeDynamic?searchCriteria=' + criteria + '&orderBy=AttributeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_AdditionalAttribute.AttributeName + ' already exists!', 'already', '5000');
                txtAddAttName.focus();
                $scope.found = true;
            } else {
                $scope.found = false;
            }
        });
    };

    $scope.foundChange = function () {
        $scope.found = true;
    };

    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ AttributeId: $scope.ad_AdditionalAttribute.AttributeId });
                $http.post('/ItemAdditionalAttribute/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Additional Attributee Deleted Successfully!', 'success', '5000');
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
        $scope.itemAdditionalAttributeForm.$setPristine();
        $scope.itemAdditionalAttributeForm.$setUntouched();
       // $route.reload();
        //$scope.branchTypeEntryForm.BranchTypeName.$error = new Object();
    };
});