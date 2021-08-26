app.controller("TerminalEntryController", function ($scope, $cookieStore, $http, $window) {
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('TerminalScreenId');
    $scope.ipAddress = false;
    $scope.button = "Save";
    $scope.ScreenLockInfo = [];
    $scope.Terminallist = [];   
    $scope.currentPage = 1;
    $scope.PerPage = 10;
    $scope.total_count = 0;    
    $scope.ConfirmationMessageForAdmin = false;

    Clear();

    //ScreenLock();

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
    
    function GetConfirmationMessageForAdmin() {
        $http({
            url: '/Role/GetConfirmationMessageForAdmin',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ConfirmationMessageForAdmin = (data === 'true');
        });
    }
     
    function Clear() {
        $scope.ipAddress = false;
        $scope.found = false;
        $scope.foundIP = false;
        $scope.ad_Terminal = new Object();
        $scope.ad_Terminal.TerminalId = 0;
        $scope.ad_Terminal.IsActive = true;
        $scope.IPSeg1 = null;
        $scope.IPSeg2 = null;
        $scope.IPSeg3 = null;
        $scope.IPSeg4 = null;
        txtTerminalName.focus();
        $scope.button = "Save";
        $scope.Show = false;
        GetTerminalPaged($scope.currentPage);
        GetAllStore();
    }

    function GetAllStore() {
        $http({
            url: '/User/GetUserDepartmentByUserId?userId=' + $scope.LoginUser.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (userOutletList) {
            $scope.Storelist = userOutletList;
            if ($scope.Storelist.length == 1) {
                $scope.ddlStore = { DepartmentId: $scope.Storelist[0].DepartmentId };
                $scope.ad_Terminal.DepartmentId = $scope.Storelist[0].DepartmentId;
                $scope.ad_Terminal.DepartmentName = $scope.Storelist[0].DepartmentName;
            }
        });
    }

    function GetTerminalPaged(curPage) {
        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/Terminal/GetTerminalPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + '&rows=' + 0,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Terminallist = data.ListData;
            $scope.total_count = data.TotalRecord;
        });
    }

    function GenerateIpAddressFromForm() {
        $scope.ad_Terminal.IpAddress = $scope.IPSeg1 + '.' + $scope.IPSeg2 + '.' + $scope.IPSeg3 + '.' + $scope.IPSeg4;
    }

    function AssignIpAddressIntoForm() {
        var ipSeg = $scope.ad_Terminal.IpAddress.split(".");
        $scope.IPSeg1 = ipSeg[0];
        $scope.IPSeg2 = ipSeg[1];
        $scope.IPSeg3 = ipSeg[2];
        $scope.IPSeg4 = ipSeg[3];
    }

    function SaveOrUpdate(parms, type) {
        $http.post('/Terminal/Save', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Terminal ' + type + ' Successfully!', 'success', '5000');
                Clear();
                $scope.terminalEntryForm.$setUntouched();
                $scope.terminalEntryForm.$setPristine();
            } else {
                alertify.log('Save Failed!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    $scope.GetPcInfo = function () {
        if ($scope.ipAddress == true) {
            $http({
                url: '/Terminal/GetCurrentPcIp',
                method: "GET",
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                var ipSefment = data.split('.');
                $scope.IPSeg1 = ipSefment[0];
                $scope.IPSeg2 = ipSefment[1];   
                $scope.IPSeg3 = ipSefment[2];
                $scope.IPSeg4 = ipSefment[3];
                $scope.CheckDuplicateIpAddress();
            })
        }
        else {
            $scope.IPSeg1 = '';
            $scope.IPSeg2 = '';
            $scope.IPSeg3 = '';
            $scope.IPSeg4 = '';
        }
    }

    GetConfirmationMessageForAdmin();

    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetTerminalPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetTerminalPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetTerminalPaged($scope.currentPage);
        }
    };

    $scope.AddTerminal = function () {
        GenerateIpAddressFromForm();
         if ($scope.found) {
            txtTerminalName.focus();
        }
         else if ($scope.foundIP) {
             alertify.log($scope.ad_Terminal.IpAddress + ' already exists!', 'already', '5000');
         }
         else {
             var parms = JSON.stringify({ Terminal: $scope.ad_Terminal });
             if ($scope.ConfirmationMessageForAdmin) {

                 if ($scope.ad_Terminal.TerminalId == 0) {
                     alertify.confirm("Are you sure to save?", function (e) {
                         if (e) {
                             SaveOrUpdate(parms, 'Saved');
                         }
                     })
                 }
                 else {
                     alertify.confirm("Are you sure to update?", function (e) {
                         if (e) {
                             SaveOrUpdate(parms, 'Updated');
                         }
                     })
                 }
             }
             else {
                 if ($scope.ad_Terminal.TerminalId == 0) {
                     SaveOrUpdate(parms, 'Saved');
                 } else {
                     SaveOrUpdate(parms, 'Updated');
                 }
             }
         }
    };

    $scope.SelTerminal = function (Terminal) {
        $scope.ad_Terminal = Terminal;
        $scope.ddlStore = { 'DepartmentId': $scope.ad_Terminal.DepartmentId };
        AssignIpAddressIntoForm();
        $scope.button = "Update";
        $scope.Show = false;
        $window.scrollTo(0, 0);
    };

    $scope.CheckDuplicateTerminalName = function () {
        var criteria = ' TerminalName=\'' + $scope.ad_Terminal.TerminalName + '\'';

        if ($scope.ad_Terminal.TerminalId != 0) {
            criteria += ' AND TerminalId<>' + $scope.ad_Terminal.TerminalId;
        }
        $http({
            url: '/Terminal/GetTerminalDynamic?searchCriteria=' + criteria + '&orderBy=TerminalName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_Terminal.TerminalName + ' already exists!', 'already', '5000');
                txtTerminalName.focus();  
               $scope.found = true;
            } else {
                $scope.found = false;
            }        });
    };

    $scope.foundChange = function () {
        $scope.found = true;
    };

    $scope.CheckDuplicateIpAddress = function () {
        GenerateIpAddressFromForm();
        var criteria = ' IpAddress=\'' + $scope.ad_Terminal.IpAddress + '\'';
        if ($scope.ad_Terminal.TerminalId != 0) {
            criteria += ' AND TerminalId<>' + $scope.ad_Terminal.TerminalId;
        }

        $http({
            url: '/Terminal/GetTerminalDynamic?searchCriteria=' + criteria + '&orderBy=IpAddress',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                alertify.log($scope.ad_Terminal.IpAddress + ' already exists!', 'already', '5000');
                $scope.ipAddress = false;
                $('#iPSeg1').focus();
                $scope.IPSeg1 = '';
                $scope.IPSeg2 = '';
                $scope.IPSeg3 = '';
                $scope.IPSeg4 = '';
                $scope.foundIP = true;
            } else {
                $scope.foundIP = false;
            }
        });
    };

    $scope.foundChangeIP = function () {
        $scope.foundIP = true;
    };

    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ TerminalId: $scope.ad_Terminal.TerminalId });
                $http.post('/Terminal/Delete', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Terminal Deleted Successfully!', 'success', '5000');
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
        $scope.terminalEntryForm.$setPristine();
        $scope.terminalEntryForm.$setUntouched();
        $scope.ad_Terminal.TerminalName = '';
        //$scope.branchTypeEntryForm.BranchTypeName.$error = new Object();
    };
});