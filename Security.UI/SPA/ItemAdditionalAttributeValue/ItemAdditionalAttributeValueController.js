app.controller("ItemAdditionalAttributeValueController", function ($scope, $cookieStore, $http, $window) {

    //For Screen lock
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('ItemAdditionalAttributeValueScreenId');
    $scope.ScreenLockInfo = [];
    $scope.AdditionalAttributeList = [];

    $scope.message = "Hello!";
    $scope.button = "Save";
    $scope.AddAttlist = [];

    //Server side pagination
    $scope.currentPage = 1;
    $scope.PerPage = 10;
    $scope.total_count = 0;

   // ScreenLock();

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
    
    function GetFromSavedType() {
        $http({
            url: '/ItemAdditionalAttributeValue/GetFromSavedType',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AdditionalAttributeList = data;
        });
    }

    function Clear() {
        $scope.found = false;
        $scope.ad_AdditionalAttributeValue = new Object();
        $scope.ad_AdditionalAttributeValue.AttributeValueId = 0;
        $scope.ad_AdditionalAttributeValue.IsActive = true;
        $scope.ddlAdditionalAttribute = null;
        $scope.button = "Save";
        GetFromSavedType();
        $scope.LoginUser = $cookieStore.get('UserData');
        $scope.UserId = $scope.LoginUser.UserId;
        $scope.ad_AdditionalAttributeValue.CreatorId = $scope.UserId;
        $scope.ad_AdditionalAttributeValue.UpdatorId = $scope.UserId;
        GetAdditionalAttributeValuePaged($scope.currentPage);
    }

    Clear();

    $scope.getData = function (curPage) {
        // alert(r);
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetAdditionalAttributeValuePaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetAdditionalAttributeValuePaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetAdditionalAttributeValuePaged($scope.currentPage);
        }
    };

    function GetAdditionalAttributeValuePaged(curPage) {
        if (curPage == null) {
            curPage = 1;
        }
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/ItemAdditionalAttributeValue/GetAdditionalAttributeValuePaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AddAttValuelist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }
    
    function SendToSever(saveType) {
        var parms = JSON.stringify({ AdditionalAttributeValue: $scope.ad_AdditionalAttributeValue });
        $http.post('/ItemAdditionalAttributeValue/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Additional Attribute Value ' + saveType + ' Successfully!', 'success', '5000');
                Clear();
                $scope.itemAdditionalAttributeValueForm.$setPristine();
                $scope.itemAdditionalAttributeValueForm.$setUntouched();

            } else {
                alertify.log('Save Failed!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    $scope.AddAddAttValue = function() {
        if ($scope.found) {
            txtValue.focus();
        }
        else {

            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_AdditionalAttributeValue.AttributeValueId == 0) {
                    alertify.confirm("Are you sure to save?", function(e) {
                        if (e) {
                            SendToSever('Saved');
                        }
                    });
                } else {
                    alertify.confirm("Are you sure to update?", function(e) {
                        if (e) {
                            SendToSever('Updated');
                        }
                    });
                }

            } else {
                if ($scope.ad_AdditionalAttributeValue.AttributeValueId == 0) {
                    SendToSever('Saved');
                }
                else {
                    SendToSever('Updated');
                }
            }
        }
    };

    $scope.SelAddAttValue = function(aSelAddAttValue) {
        $scope.ad_AdditionalAttributeValue = aSelAddAttValue;
        $scope.ddlAdditionalAttribute = { "AttributeId": aSelAddAttValue.AttributeId }
        $scope.button = "Update";

        $window.scrollTo(0, 0);

    };
   
    $scope.CheckDuplicateAdditionalAttributeValue = function () {
        var criteria = ' [Value]=\'' + $scope.ad_AdditionalAttributeValue.Value + '\'';

        if ($scope.ad_AdditionalAttributeValue.AttributeValueId != 0) {
            criteria += ' AND AttributeValueId<>' + $scope.ad_AdditionalAttributeValue.AttributeValueId;
        }

        $http({
            url: '/ItemAdditionalAttributeValue/GetAdditionalAttributeValueDynamic?searchCriteria=' + criteria + '&orderBy=[Value]',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_AdditionalAttributeValue.Value + ' already exists!', 'already', '5000');
                txtValue.focus();
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
                var parms = JSON.stringify({ AttributeValueId: $scope.ad_AdditionalAttributeValue.AttributeValueId });
                $http.post('/ItemAdditionalAttributeValue/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Additional Attributee Value Deleted Successfully!', 'success', '5000');
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
        $scope.itemAdditionalAttributeValueForm.$setPristine();
        $scope.itemAdditionalAttributeValueForm.$setUntouched();
        // $route.reload();
        //$scope.branchTypeEntryForm.BranchTypeName.$error = new Object();
    };
});