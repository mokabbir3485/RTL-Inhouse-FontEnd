app.controller("CustomerEntryController", function ($scope, $cookieStore, MyService, $http, $filter, $window) {
    //For Screen lock
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('CustomerScreenId');

    ClearCustomer();
    function ClearCustomer() {
        $scope.ScreenLockInfo = [];
        //ScreenLock();
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;

        $scope.customerlist = [];
        $scope.customerAddresslist = [];
        $scope.customerBillPolicylist = [];
        $scope.customerTypeList = [];
        $scope.Branchlist = [];
        $scope.msgAlert = "Save";
        $scope.hidePayable = true;
        $scope.found = false;

        $scope.ad_Customer = {};
        $scope.ddlCustomerType = null;
        $scope.ddlBranch = null;
        $scope.ad_Customer.CustomerId = 0;
        $scope.ad_Customer.IsActive = true;
        $scope.buttonSupp = "Save";
        $scope.ad_Customer.Gender = 'Male';
        $scope.btnDeleteShow = false;
        GetCustomerPaged($scope.currentPage);
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        GetAllCustomertype();
        GetAllBranch();
        ClearCustomerAddress();
        ClearCustomerBillPolicy();
        GetUsersPermissionDetails();
    }
    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('CustomerScreenId');
        $http({
            url: '/Permission/GetUsersPermissionDetails?searchCriteria=' + searchCriteria + '&orderBy=PermissionDetailId',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.PermissionDetails = data;
            angular.forEach($scope.PermissionDetails, function (aPermissionDetails) {
                if (aPermissionDetails.FunctionName == 'Create') {
                    $scope.CreatePermission = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Revise') {
                    $scope.RevisePermission = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'Remove') {
                    $scope.RemovePermission = aPermissionDetails.CanExecute;
                }
                else if (aPermissionDetails.FunctionName == 'ListView') {
                    $scope.ListViewPermission = aPermissionDetails.CanExecute;
                }
            });
        });
    }
    
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
    function GetAllCustomertype() {
        $http({
            url: '/CustomerEntry/GetAllCustomertype',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (customerTyoeList) {
            var unRegType = { CustomerTypeId: 0, CustomerTypeName: 'Un-Registered' };
            customerTyoeList.push(unRegType);
            $scope.customerTypeList = customerTyoeList;
        })
    }
    function GetAllBranch() {
        $http({
            url: '/Branch/GetAllBranchByUserID?userId=' + $cookieStore.get('UserData').UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.Branchlist = data;
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
    function GetCustomerPaged(curPage) {
        var SearchCriteria = "1=1";
        if ($scope.SearchName != null && $scope.SearchName != '' && $scope.SearchName != undefined) {
            SearchCriteria += " AND (C.FirstName LIKE '%" + $scope.SearchName + "%' OR C.MiddleName LIKE '%" + $scope.SearchName + "%' OR C.LastName LIKE '%" + $scope.SearchName + "%') ";
        }
        if ($scope.SearchCode != null && $scope.SearchCode != '' && $scope.SearchCode != undefined) {
            SearchCriteria += " AND C.ManualCustomerCode LIKE '" + $scope.SearchCode + "%'";
        }
        if ($scope.SearchOutlet != null && $scope.SearchOutlet != '' && $scope.SearchOutlet != undefined) {
            SearchCriteria += " AND C.BranchId = '" + $scope.SearchOutlet.BranchId + "'";
        }
        if ($scope.SearchPhone != null && $scope.SearchPhone != '' && $scope.SearchPhone != undefined) {
            SearchCriteria += " AND (SELECT TOP 1 Mobile FROM ad_CustomerAddress WHERE CustomerCode=C.CustomerCode AND IsDefault=1) LIKE '" + $scope.SearchPhone + "%'";
        }

        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/CustomerEntry/GetCustomerPaged?StartRecordNo=' + StartRecordNo + '&RowPerPage=' + $scope.PerPage + "&whClause=" + SearchCriteria + '&rows=' + 0 + "&userId=" + $scope.UserId,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            angular.forEach(data.ListData, function (aData) {
                if (aData.Title != '' && aData.MiddleName != '') {
                    aData.fullName = aData.Title + ' ' + aData.FirstName + ' ' + aData.MiddleName + ' ' + aData.LastName;
                }
                else if (aData.Title != '' && aData.MiddleName == '') {
                    aData.fullName = aData.Title + ' ' + aData.FirstName + ' ' + aData.LastName;
                }
                else if (aData.Title == '' && aData.MiddleName != '') {
                    aData.fullName = aData.FirstName + ' ' + aData.MiddleName + ' ' + aData.LastName;
                }
                else {
                    aData.fullName = aData.FirstName + ' ' + aData.LastName;
                }
            });
            $scope.customerlist = data.ListData;
            $scope.customerlist = Enumerable.From($scope.customerlist).Where('$.FirstName !="General"').ToArray();
            $scope.total_count = data.TotalRecord;
        });
    };
    function GenerateDate() {
        var from = $scope.ad_Customer.DateOfBirth.split(" ");
        if (from[1] == "Jan") {
            from[1] = 1;
        }
        if (from[1] == "Feb") {
            from[1] = 2;
        }
        if (from[1] == "Mar") {
            from[1] = 3;
        }
        if (from[1] == "Apr") {
            from[1] = 4;
        }
        if (from[1] == "May") {
            from[1] = 5;
        }
        if (from[1] == "Jun") {
            from[1] = 6;
        }
        if (from[1] == "Jul") {
            from[1] = 7;
        }
        if (from[1] == "Aug") {
            from[1] = 8;
        }
        if (from[1] == "Sep") {
            from[1] = 9;
        }
        if (from[1] == "Oct") {
            from[1] = 10;
        }
        if (from[1] == "Nov") {
            from[1] = 11;
        }
        if (from[1] == "Dec") {
            from[1] = 12;
        }

        $scope.ad_Customer.DateOfBirth = new Date("1970", from[1] - 1, from[0]);
    }
    function GetCustomerInfo(cusId) {
        $http({
            url: '/CustomerEntry/GetCustomerById',
            method: "GET",
            params: { customerId: cusId },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ad_Customer.CustomerCode = data.CustomerCode;
            alertify.log('Customer (' + data.CustomerCode + ') Saved Successfully!', 'success', '5000');
        });
    }
    
    function ShowAlert(msgAlert, cusId) {
        if (cusId != 0) {
            for (var i = 0; i < $scope.customerlist.length; i++) {
                if ($scope.customerlist[i].CustomerId == cusId) {
                    msgAlert = 'Customer (' + $scope.customerlist[i].CustomerCode + ') Saved Successfully!';
                    break;
                }
            }
        }

        alertify.log(msgAlert, 'success', '5000');
    }
    function GetCustomerAddress(code) {
        $http({
            url: '/CustomerEntry/GetAllCustomerAddress',
            method: "GET",
            params: { customerCode: code },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.customerAddresslist = [];
            $scope.customerAddresslist = data;
        });
    }
    function GetCustomerBillPolicy(code) {
        $http({
            url: '/CustomerEntry/GetAllCustomerBillPolicy',
            method: "GET",
            params: { customerCode: code },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.customerBillPolicylist = [];
            $scope.customerBillPolicylist = data;
        });
    }
    function ClearCustomerAddress() {
        $scope.ad_CustomerAddress = new Object();
        $scope.ad_CustomerAddress.AddressType = 'Mailing';
        $scope.buttonSuppAddress = "Add";
        $scope.btnSuppAddressDeleteShow = false;
        $scope.addressRowIndex = '';
    }
    function ClearCustomerBillPolicy() {
        $scope.ad_CustomerBillPolicy = new Object();
        $scope.buttonBillPolicy = "Add";
        $scope.btnSuppBillPolicyDeleteShow = false;
        $scope.billRowIndex = '';
    }

    function SaveAddressAndBillpolicy(cusCode) {
        for (var i = 0; i < $scope.customerAddresslist.length; i++) {
            $scope.ad_CustomerAddress = new Object();
            $scope.ad_CustomerAddress.CustomerCode = cusCode;
            $scope.ad_CustomerAddress.IsDefault = i == 0 ? true : false;
            $scope.ad_CustomerAddress.AddressType = $scope.customerAddresslist[i].AddressType;
            $scope.ad_CustomerAddress.Address = $scope.customerAddresslist[i].Address;
            $scope.ad_CustomerAddress.ContactPerson = $scope.customerAddresslist[i].ContactPerson;
            $scope.ad_CustomerAddress.ContactDesignation = $scope.customerAddresslist[i].ContactDesignation;
            $scope.ad_CustomerAddress.Phone = $scope.customerAddresslist[i].Phone;
            $scope.ad_CustomerAddress.Mobile = $scope.customerAddresslist[i].Mobile;
            $scope.ad_CustomerAddress.Email = $scope.customerAddresslist[i].Email;
            //$scope.ad_CustomerAddress.IsDefault = $scope.customerAddresslist[i].IsDefault;
            var parmsAdd = JSON.stringify({ customeraddress: $scope.ad_CustomerAddress });
            $http.post('/CustomerEntry/SaveCustomerAddress', parmsAdd).success(function (data) {
            }).error(function (data) {
                alertify.log('Server Errors!', 'error', '5000');
            });
        }
        for (var i = 0; i < $scope.customerBillPolicylist.length; i++) {
            $scope.ad_CustomerBillPolicy = new Object();
            $scope.ad_CustomerBillPolicy.CustomerCode = cusCode;
            $scope.ad_CustomerBillPolicy.PolicyDescription = $scope.customerBillPolicylist[i].PolicyDescription;
            var parmsBill = JSON.stringify({ customerbillpolicy: $scope.ad_CustomerBillPolicy });
            $http.post('/CustomerEntry/SaveCustomerBillPolicy', parmsBill).success(function (data) {
            }).error(function (data) {
                alertify.log('Server Errors!', 'error', '5000');
            });
        }
        ClearCustomer();
        $scope.customerEntryForm.$setPristine();
        $scope.customerEntryForm.$setUntouched();
    }

    function SaveCustomer() {
        var parms = JSON.stringify({ customer: $scope.ad_Customer });
        $http.post('/CustomerEntry/SaveCustomer', parms).success(function (data) {
            if (data !=null && data !='') {
                SaveAddressAndBillpolicy(data);
            }
            else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }

    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetCustomerPaged($scope.currentPage);
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetCustomerPaged($scope.currentPage);
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetCustomerPaged($scope.currentPage);
        }
    };
    $scope.GetCustSearch = function () {
        GetCustomerPaged(1);
    }
    $scope.AddCustomer = function () {
        if ($scope.found) {
            $('#txtCustomerMobile').focus();
        }
        if ($('#txtCustomerFirstName').val() == 'General') {
            alertify.log('General Not allowed!', 'error', '5000');
        }
        else {
            $scope.ad_Customer.CreatorId = $scope.UserId;
            $scope.ad_Customer.UpdatorId = $scope.UserId;

            if ($scope.ad_Customer.DateOfBirth != undefined)
                GenerateDate();

            if ($scope.ConfirmationMessageForAdmin) {
                if ($scope.ad_Customer.CustomerId == 0 && $scope.CreatePermission) {
                    alertify.confirm("Are you sure to save?", function (e) {
                        if (e) {
                            SaveCustomer();
                            alertify.log('Customer Saved Successfully!', 'success', '5000');
                        }
                    })
                }
                else if ($scope.ad_Customer.CustomerId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_Customer.CustomerId > 0 && $scope.RevisePermission) {
                    alertify.confirm("Are you sure to update?", function (e) {
                        if (e) {
                            SaveCustomer();
                            alertify.log('Customer Updated Successfully!', 'success', '5000');
                        }
                    })
                }
                else if ($scope.ad_Customer.CustomerId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
            else {
                if ($scope.ad_Customer.CustomerId == 0 && $scope.CreatePermission) {
                    SaveCustomer();
                    alertify.log('Customer Saved Successfully!', 'success', '5000');
                }
                else if ($scope.ad_Customer.CustomerId == 0 && !$scope.CreatePermission) {
                    alertify.log('You do not have permission to save!', 'error', '5000');
                }
                else if ($scope.ad_Customer.CustomerId > 0 && $scope.RevisePermission) {
                    SaveCustomer();
                    alertify.log('Customer Updated Successfully!', 'success', '5000');
                }
                else if ($scope.ad_Customer.CustomerId > 0 && !$scope.RevisePermission) {
                    alertify.log('You do not have permission to Update!', 'error', '5000');
                }
            }
        }
    }
    $scope.SelCustomer = function (customer) {

        $scope.ad_Customer = customer;
        $scope.ddlCustomerType = { "CustomerTypeId": $scope.ad_Customer.CustomerTypeId };

        $scope.ddlBranch = { "BranchId": $scope.ad_Customer.BranchId };

        GetCustomerAddress($scope.ad_Customer.CustomerCode);
        GetCustomerBillPolicy($scope.ad_Customer.CustomerCode);
        $scope.buttonSupp = "Update";
        $scope.btnDeleteShow = false;

        var res = customer.DateOfBirth.substring(0, 5);
        if (res == "/Date") {
            var parsedDate = new Date(parseInt($scope.ad_Customer.DateOfBirth.substr(6)));
            $scope.ad_Customer.DateOfBirth = $filter('date')(parsedDate, 'dd MMM');
        }
        $window.scrollTo(0, 0);
    };
    $scope.AddCustomerAddress = function () {
        if ($scope.found) {
            $('#txtCustomerMobile').focus();
        }
        else {
            if ($scope.buttonSuppAddress == "Add") {
                if ($scope.ad_CustomerAddress.IsDefault) {
                    $scope.ad_CustomerAddress.Status = 'Yes';
                }
                else {
                    $scope.ad_CustomerAddress.Status = 'No';
                }
                $scope.customerAddresslist.push($scope.ad_CustomerAddress);
                ClearCustomerAddress();
                $scope.customerEntryForm.$setPristine();
                $scope.customerEntryForm.$setUntouched();
                //ddlAddressType.focus();
            } else {
                if ($scope.ad_CustomerAddress.IsDefault) {
                    $scope.ad_CustomerAddress.Status = 'Yes';
                }
                else {
                    $scope.ad_CustomerAddress.Status = 'No';
                }
                ClearCustomerAddress();
            }
        }
    };
    $scope.CheckDefault = function (defaultAdd) {
        if (defaultAdd) {
            angular.forEach($scope.customerAddresslist, function (address) {
                if ($scope.ad_CustomerAddress.AddressType == 'Mailing') {
                    if (address.Status == 'Yes' && address.AddressType == 'Mailing') {
                        alertify.log('One Default Mailing Address Accepted!', 'error', '5000');
                        $scope.ad_CustomerAddress.IsDefault = false;
                        return;
                    }
                }
                if ($scope.ad_CustomerAddress.AddressType == 'Billing') {
                    if (address.Status == 'Yes' && address.AddressType == 'Billing') {
                        alertify.log('One Default Billing Address Accepted!', 'error', '5000');
                        $scope.ad_CustomerAddress.IsDefault = false;
                        return;
                    }
                }
            });
        }
    };
    $scope.SelCustomerAddress = function (customerAddress, index) {
        $scope.ad_CustomerAddress = customerAddress;
        $scope.buttonSuppAddress = "Change";
        $scope.btnSuppAddressDeleteShow = true;
        $scope.addressRowIndex = index;
    };
    $scope.removeAddress = function () {
        $scope.customerAddresslist.splice($scope.addressRowIndex, 1);
        ClearCustomerAddress();
    }
    $scope.AddCustomerBillPolicy = function () {
        if ($scope.buttonBillPolicy == "Add") {
            $scope.customerBillPolicylist.push($scope.ad_CustomerBillPolicy);
            ClearCustomerBillPolicy();
            $scope.customerEntryForm.$setPristine();
            $scope.customerEntryForm.$setUntouched();
        } else {
            ClearCustomerBillPolicy();
        }
    };
    $scope.SelCustomerBillPolicy = function (customerbillpolicy, index) {
        $scope.ad_CustomerBillPolicy = customerbillpolicy;
        $scope.buttonBillPolicy = "Change";
        $scope.btnSuppBillPolicyDeleteShow = true;
        $scope.billRowIndex = index;
    };
    $scope.removeBillPolicy = function () {
        $scope.customerBillPolicylist.splice($scope.billRowIndex, 1);
        ClearCustomerBillPolicy();
    },
    $scope.Delete = function () {
        alertify.confirm("Are you sure to delete?", function (e) {
            if (e) {
                var parms = JSON.stringify({ customerId: $scope.ad_Customer.CustomerId });
                $http.post('/CustomerEntry/DeleteCustomer', parms).success(function (data) {
                    if (data > 0) {
                        alertify.log('Customer( ' + $scope.ad_Customer.CustomerCode + ' ) Deleted Successfully!', 'success', '5000');
                        ClearCustomer();
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
        ClearCustomer();
        $scope.customerEntryForm.$setPristine();
        $scope.customerEntryForm.$setUntouched();
    };
    $scope.CheckDuplicateMobileNo = function () {
        var criteria = " [Mobile]='" + $scope.ad_CustomerAddress.Mobile + "'";
        if ($scope.ad_Customer.CustomerId > 0) {
            criteria += " AND CustomerId<>" + $scope.ad_Customer.CustomerId;
        }

        $http({
            url: '/CustomerEntry/GetCustomerAddressDynamic?searchCriteria=' + criteria + '&orderBy=Mobile',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                $scope.found = true;
                alertify.log($scope.ad_CustomerAddress.Mobile + ' Mobile No. already exists!', 'already', '5000');
                $('#txtCustomerMobile').focus();
            } else {
                $scope.found = false;
            }
        });
    }
    $scope.foundChange = function () {
        $scope.found = true;
    };
});