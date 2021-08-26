app.controller("RequisitionPurposeEntryController", function ($scope, $cookieStore, $http, $window) {
   
    $scope.message = "Hello!erreerd3333";
    $scope.button = "Save";
    $scope.RequisitionPurposelist = [];

    //Server side pagination
    $scope.currentPage = 1;
    $scope.PerPage = 10;
    $scope.total_count = 0;

    //For Screen lock
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('RequisitionPurposeEntryScreenId');
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

    //function GetRequisitionPurpose() {
    //    $http({
    //        url: '/RequisitionPurpose/GetAllRequisitionPurpose',
    //        method: 'GET',
    //        headers: { 'Content-Type': 'application/json' }
    //    }).success(function (data) {
    //        $scope.RequisitionPurposelist = data;
    //    })
    //}

    function Clear() {
        $scope.found = false;
        $scope.ad_RequisitionPurpose = new Object();
        $scope.ad_RequisitionPurpose.RequisitionPurposeId = 0;
        $scope.ad_RequisitionPurpose.IsActive = true;
        $scope.button = "Save";
        txtRequisitionPurposeName.focus();
        $scope.Show = false;
        // GetRequisitionPurpose();
        GetRequisitionPurposePaged($scope.currentPage);
    }

    Clear();

    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetRequisitionPurposePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetRequisitionPurposePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetRequisitionPurposePaged($scope.currentPage);
        }
    };

    function GetRequisitionPurposePaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/RequisitionPurpose/GetRequisitionPurposePaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.RequisitionPurposelist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    $scope.AddRequisitionPurpose = function () {
        if ($scope.found) {
            txtRequisitionPurposeName.focus();
        }
        else {
            //For Creator details Start
            $scope.LoginUser = $cookieStore.get('UserData');
            $scope.UserId = $scope.LoginUser.UserId;
            //End
            $scope.ad_RequisitionPurpose.CreatorId = $scope.UserId;
            $scope.ad_RequisitionPurpose.UpdatorId = $scope.UserId;
            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_RequisitionPurpose.RequisitionPurposeId == 0) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            var parms = JSON.stringify({ RequisitionPurpose: $scope.ad_RequisitionPurpose });
                            $http.post('/RequisitionPurpose/Save', parms).success(function (data) {
                                if (data > 0) {
                                    alertify.log('Requisition Purpose Saved Successfully!', 'success', '5000');
                                    Clear();
                                    $scope.requisitionPurposeEntryForm.$setPristine();
                                    $scope.requisitionPurposeEntryForm.$setUntouched();
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
                            var parms = JSON.stringify({ RequisitionPurpose: $scope.ad_RequisitionPurpose });
                            $http.post('/RequisitionPurpose/Save', parms).success(function (data) {
                                if (data > 0) {
                                    alertify.log('Requisition Purpose Updated Successfully!', 'success', '5000');
                                    Clear();
                                    $scope.requisitionPurposeEntryForm.$setPristine();
                                    $scope.requisitionPurposeEntryForm.$setUntouched();
                                } else {
                                    alertify.log('Update Failed!', 'error', '5000');
                                }
                            }).error(function (data) {
                                alertify.log('Server Errors!', 'error', '5000');
                            });
                        }
                    })
                }
            }
            else {
                var parms = JSON.stringify({ RequisitionPurpose: $scope.ad_RequisitionPurpose });
                $http.post('/RequisitionPurpose/Save', parms).success(function (data) {
                    if (data > 0) {
                        if ($scope.ad_RequisitionPurpose.RequisitionPurposeId == 0) {
                            alertify.log('Requisition Purpose Saved Successfully!', 'success', '5000');
                        } else {
                            alertify.log('Requisition Purpose Updated Successfully!', 'success', '5000');
                        }
                        Clear();
                        $scope.requisitionPurposeEntryForm.$setPristine();
                        $scope.requisitionPurposeEntryForm.$setUntouched();
                    } else {
                        alertify.log('Save Failed!', 'error', '5000');
                    }
                }).error(function (data) {
                    alertify.log('Server Errors!', 'error', '5000');
                });
            }
        }
    };

    $scope.SelRequisitionPurpose = function (RequisitionPurpose) {
        $scope.ad_RequisitionPurpose = RequisitionPurpose;
        if (RequisitionPurpose.IsActive) {
            $scope.ad_RequisitionPurpose.IsActive = true;
        }
        $scope.button = "Update";
        $scope.Show = true;
        $window.scrollTo(0, 0);
    };

    $scope.CheckDuplicateRequisitionPurposeName = function () {
        var criteria = ' RequisitionPurposeName=\'' + $scope.ad_RequisitionPurpose.RequisitionPurposeName + '\'';

        if ($scope.ad_RequisitionPurpose.RequisitionPurposeId != 0) {
            criteria += ' AND RequisitionPurposeId<>' + $scope.ad_RequisitionPurpose.RequisitionPurposeId;
        }

        $http({
            url: '/RequisitionPurpose/GetRequisitionPurposeDynamic?searchCriteria=' + criteria + '&orderBy=RequisitionPurposeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_RequisitionPurpose.RequisitionPurposeName + ' already exists!', 'already', '5000');
                tbxRequisitionPurposeName.focus();
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
                var parms = JSON.stringify({ requisitionPurposeId: $scope.ad_RequisitionPurpose.RequisitionPurposeId });
                $http.post('/RequisitionPurpose/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Requisition Purpose Deleted Successfully!', 'success', '5000');
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
        $scope.requisitionPurposeEntryForm.$setPristine();
        $scope.requisitionPurposeEntryForm.$setUntouched();
        $scope.ad_RequisitionPurpose.RequisitionPurposeName = '';
    };
});