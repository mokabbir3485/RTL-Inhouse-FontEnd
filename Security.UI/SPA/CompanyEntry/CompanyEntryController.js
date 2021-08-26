app.controller("CompanyEntryController", function ($scope, $cookieStore, MyService, $http, $filter, $window) {
    //For Screen lock
    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.UserId = $scope.LoginUser.UserId;
    $scope.ScreenId = $cookieStore.get('CompanyEntryScreenId');

    ClearCompany();
    function ClearCompany() {
        $scope.ScreenLockInfo = [];
        //ScreenLock();
        //Server side pagination
        $scope.currentPage = 1;
        $scope.PerPage = 10;
        $scope.total_count = 0;
        $scope.isDefaultBilling = false;
        $scope.isDefaultDelivery = false;
        $scope.emplyoeeid = 0;
        $scope.companyList = [];
        $scope.companyAddresslist = [];
        $scope.companyBillPolicylist = [];
        $scope.companyTypeList = [];
        $scope.Branchlist = [];
        $scope.msgAlert = "Save";
        $scope.hidePayable = true;
        $scope.duplicateCompName = false;
        $scope.duplicateCompCode = false;

        $scope.ad_Company = {};
        $scope.ddlCompanyType = null;
        $scope.ddlBranch = null;
        $scope.ad_Company.CompanyId = 0;
        $scope.ad_Company.IsActive = true;
        $scope.ddlEmployeeRef = null;
        $scope.buttonSupp = "Save";
        $scope.btnDeleteShow = false;
        GetCompanyPaged($scope.currentPage, "1=1");
        $scope.ConfirmationMessageForAdmin = false;
        GetConfirmationMessageForAdmin();
        GetAllCompanyType();
        GetAllEmployee();
        ClearCompanyAddress();
        ClearCompanyBillPolicy();
        GetUsersPermissionDetails();
    }

    $scope.GetEmpId = function(){
        var val = $('#ddlEmployeeRef').val()
        var xyz = $('#ddlEmployeeRefid option').filter(function () {
            return this.value == val;
        }).data('xyz');


        $scope.emplyoeeid = xyz;
       
    }
    //$("#button").click(function () {
    //    var val = $('#ddlEmployeeRef').val()
    //    var xyz = $('#ddlEmployeeRefid option').filter(function () {
    //        return this.value == val;
    //    }).data('xyz');
      
       
    //    $scope.emplyoeeid = xyz;
       

    //})
    function GetAllEmployee() {
        $http({
            url: '/Employee/GetAllEmployee',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.EmployeeList = data;
        });
    }

    function GetAllCompanyType() {
        var criteria = " [IsActive]=1";
        $http({
            url: '/Company/GetCompanyType?searchCriteria=' + criteria + '&orderBy=CompanyTypeName',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.CompanyTypeList = data;
        });
    }

    function GetUsersPermissionDetails() {
        $scope.CreatePermission = false;
        $scope.RevisePermission = false;
        $scope.RemovePermission = false;
        $scope.ListViewPermission = false;

        var xxx = $cookieStore.get('CompanyEntryScreenId');
        var searchCriteria = 'P.RoleId=' + $cookieStore.get('UserData').RoleId + ' AND S.ScreenId=' + $cookieStore.get('CompanyEntryScreenId');
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
    $scope.stopProp = function () {
        event.stopPropagation();
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

    function GetCompanyPaged(curPage, SearchCriteria) {

        if (curPage == null) curPage = 1;
        var StartRecordNo = ($scope.PerPage * (curPage - 1)) + 1;
        $http({
            url: '/Company/GetCompanyPaged?startRecordNo=' + StartRecordNo + '&rowPerPage=' + $scope.PerPage + "&sortColumn=CompanyName&sortOrder=ASC &whereClause=" + SearchCriteria + '&rows=' + 0,
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
            $scope.companyList = data.ListData;
            //$scope.companyList = Enumerable.From($scope.companyList).Where('$.FirstName !="General"').ToArray();
            $scope.total_count = data.TotalRecord;

            console.log(' $scope.companyList', $scope.companyList);
        });
    };

    function GenerateDate() {
        var from = $scope.ad_Company.DateOfBirth.split(" ");
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

        $scope.ad_Company.DateOfBirth = new Date("1970", from[1] - 1, from[0]);
    }

    function GetCompanyInfo(companyId) {
        $http({
            url: '/CustomerEntry/GetCustomerById',
            method: "GET",
            params: { companyId: companyId },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.ad_Company.CompanyCode = data.CompanyCode;
            alertify.log('Company (' + data.CompanyCode + ') Saved Successfully!', 'success', '5000');
        });
    }

    function ShowAlert(msgAlert, cusId) {
        if (cusId != 0) {
            for (var i = 0; i < $scope.companyList.length; i++) {
                if ($scope.companyList[i].CompanyId == cusId) {
                    msgAlert = 'Company (' + $scope.companyList[i].CompanyCode + ') Saved Successfully!';
                    break;
                }
            }
        }

        alertify.log(msgAlert, 'success', '5000');
    }

    function GetCompanyAddress(code) {
        $http({
            url: '/Company/GetCompanyAddressByCompanyId',
            method: "GET",
            params: { companyId: code },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.companyAddresslist = [];
            var slNo = 1;
            angular.forEach(data, function (aData) {
                var companyAddress = {};
                companyAddress = aData;
                companyAddress.Status = 'No';
                if (aData.IsDefault) {
                    companyAddress.Status = 'Yes';
                }
                companyAddress.SlNo = slNo;
                $scope.companyAddresslist.push(aData);
                slNo++;
            });
        });
    }

    function GetCompanyBillPolicy(code) {
        $http({
            url: '/Company/GetCompanyBillPolicyByCompanyId',
            method: "GET",
            params: { companyId: code },
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.companyBillPolicylist = [];
            var slNo = 1;
            angular.forEach(data, function (aData) {
                var companyBillPolicy = {};
                companyBillPolicy = aData;
                companyBillPolicy.SlNo = slNo;
                $scope.companyBillPolicylist.push(aData);
                slNo++;
            });

            $scope.companyBillPolicylist = data;
        });
    }

    function ClearCompanyAddress() {
        $scope.ad_CompanyAddress = new Object();
        $scope.ad_CompanyAddress.AddressType = 'Billing';
        $scope.ad_CompanyAddress.IsDefault = true;
        $scope.buttonComAddress = "Add";
        $scope.btnSuppAddressDeleteShow = false;
        $scope.addressRowIndex = '';
    }

    function ClearCompanyBillPolicy() {
        $scope.ad_CompanyBillPolicy = new Object();
        $scope.buttonBillPolicy = "Add";
        $scope.btnSuppBillPolicyDeleteShow = false;
        $scope.billRowIndex = '';
    }

    function SaveCompany() {
        $.ajax({
            url: "/Company/SaveCompany",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({ _ad_Company: $scope.ad_Company, _ad_CompanyAddressList: $scope.companyAddresslist, ad_CompanyBillPolicyList: $scope.companyBillPolicylist }),
            success: function (data) {
                if (data > 0) {
                    if ($scope.ad_Company.CompanyId > 0) {
                        alertify.log('Company Details Updated Successfully.', 'success', '5000');
                    }
                    alertify.log('Company Details Saved Successfully.', 'success', '5000');
                    ClearCompany();
                    $scope.companyEntryForm.$setPristine();
                    $scope.companyEntryForm.$setUntouched();
                }
                else {
                    alertify.log('Server Errors!', 'error', '5000');
                }
            },
            error: function () {
                alertify.log('Server Errors!', 'error', '5000');
            }
        });
    }

    $scope.getData = function (curPage) {
        if ($scope.PerPage > 100) {
            $scope.PerPage = 100;
            $scope.currentPage = curPage;
            GetCompanyPaged($scope.currentPage, "1=1");
            alertify.log('Maximum record  per page is 100', 'error', '5000');
        }
        else if ($scope.PerPage < 1) {
            $scope.PerPage = 1;
            $scope.currentPage = curPage;
            GetCompanyPaged($scope.currentPage, "1=1");
            alertify.log('Minimum record  per page is 1', 'error', '5000');
        }
        else {
            $scope.currentPage = curPage;
            GetCompanyPaged($scope.currentPage, "1=1");
        }
    };

    //Company Save,Edit,Delete start form here
    $scope.CheckDuplicateCompanyName = function () {
        var criteria = " [CompanyName]='" + $scope.ad_Company.CompanyName + "'";
        if ($scope.ad_Company.CompanyId > 0) {
            criteria += " AND CompanyId<>" + $scope.ad_Company.CompanyId;
        }

        $http({
            url: '/Company/GetCompanyDynamic?searchCriteria=' + criteria + '&orderBy=CompanyId',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                $scope.duplicateCompName = true;
                alertify.log($scope.ad_Company.CompanyName + ' Name No. already exists!', 'already', '5000');
                $('#txtCompanyName').focus();
            } else {
                $scope.duplicateCompName = false;
            }
        });
    }

    $scope.CheckDuplicateCompanyCode = function () {
        var criteria = " [CompanyCode]='" + $scope.ad_Company.CompanyCode + "'";
        if ($scope.ad_Company.CompanyId > 0) {
            criteria += " AND CompanyId<>" + $scope.ad_Company.CompanyId;
        }

        $http({
            url: '/Company/GetCompanyDynamic?searchCriteria=' + criteria + '&orderBy=CompanyId',
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data.length > 0) {
                $scope.duplicateCompCode = true;
                alertify.log('Code "' + $scope.ad_Company.CompanyCode + '" No. already exists!', 'already', '5000');
                $('#txtCompanyCode').focus();
            } else {
                $scope.duplicateCompCode = false;
            }
        });
    }

    $scope.AddCompany = function () {
        if ($scope.companyAddresslist.length < 1) {
            alertify.log('At least one address is required with default!', 'error', '5000');
            return;
        }

        var Address1 = false;
        var Address2 = false;

        angular.forEach($scope.companyAddresslist, function (data) {
            if (data.AddressType == 'Billing') {
                Address1 = true;
            }
            if (data.AddressType == 'Delivery') {
                Address2 = true;
            }
        });

        if (!Address1 || !Address2) {
            alertify.log('Minimum one of Each Type is Required!', 'error', '5000');
            return;
        }

        var hasDefaultAddress = Enumerable.From($scope.companyAddresslist).Where('$.IsDefault').FirstOrDefault();
        if (hasDefaultAddress == null || angular.isUndefined(hasDefaultAddress)) {
            alertify.log('One default address is required!', 'error', '5000');
            return;
        }
        //alert($scope.emplyoeeid)
        $scope.ddlEmployeeRef.EmployeeId = $scope.emplyoeeid;

        if ($scope.emplyoeeid != 0) {
            $scope.ad_Company.RefEmployeeId = $scope.emplyoeeid;
        }

        
        $scope.ad_Company.CreatorId = $scope.UserId;
        $scope.ad_Company.UpdatorId = $scope.UserId;
        //$scope.ad_Company.RefEmployeeId = $scope.emplyoeeid;
        //alert($scope.ad_Company.RefEmployeeId);
        $scope.ad_Company.CompanyTypeId = $scope.ddlCompanyType.CompanyTypeId;
        if ($scope.ConfirmationMessageForAdmin) {
            if ($scope.ad_Company.CompanyId == 0 && $scope.CreatePermission) {
                alertify.confirm("Are you sure to save?", function (e) {
                    if (e) {
                        SaveCompany();
                    }
                })
            }
            else if ($scope.ad_Company.CompanyId == 0 && !$scope.CreatePermission) {
                alertify.log('You do not have permission to save!', 'error', '5000');
            }
            else if ($scope.ad_Company.CompanyId > 0 && $scope.RevisePermission) {
                alertify.confirm("Are you sure to update?", function (e) {
                    if (e) {
                        SaveCompany();
                    }
                })
            }
            else if ($scope.ad_Company.CompanyId > 0 && !$scope.RevisePermission) {
                alertify.log('You do not have permission to Update!', 'error', '5000');
            }
        }
        else {
            if ($scope.ad_Company.CompanyId == 0 && $scope.CreatePermission) {
                SaveCompany();
            }
            else if ($scope.ad_Company.CompanyId == 0 && !$scope.CreatePermission) {
                alertify.log('You do not have permission to save!', 'error', '5000');
            }
            else if ($scope.ad_Company.CompanyId > 0 && $scope.RevisePermission) {
                SaveCompany();
            }
            else if ($scope.ad_Company.CompanyId > 0 && !$scope.RevisePermission) {
                alertify.log('You do not have permission to Update!', 'error', '5000');
            }
        }
    }

    $scope.SelCompany = function (Company) {

        $scope.ad_Company = Company;
        $scope.ddlCompanyType = { "CompanyTypeId": $scope.ad_Company.CompanyTypeId };
        //alert($scope.ad_Company.RefEmployeeId);
        if ($scope.ad_Company.RefEmployeeId == 0) {
            $scope.ad_Company.RefEmployeeId = 17;
        }

        var EmployeeInfo = Enumerable.From($scope.EmployeeList).Where("$.EmployeeId==" + $scope.ad_Company.RefEmployeeId).FirstOrDefault();

        $scope.ddlEmployeeRef = EmployeeInfo.FullName;

        GetCompanyAddress($scope.ad_Company.CompanyId);
        GetCompanyBillPolicy($scope.ad_Company.CompanyId);
        $scope.buttonSupp = "Update";
        $scope.btnDeleteShow = false;

        //var res = Company.DateOfBirth.substring(0, 5);
        //if (res == "/Date") {
        //    var parsedDate = new Date(parseInt($scope.ad_Company.DateOfBirth.substr(6)));
        //    $scope.ad_Company.DateOfBirth = $filter('date')(parsedDate, 'dd MMM');
        //}
        $window.scrollTo(0, 0);
    };

    //Address Add, Edit, Delete starts from here 
    $scope.AddCompanyAddress = function () {

        var isExistDefaultBilling;
        var isExistDefaultDelivery;

        if ($scope.ad_CompanyAddress.IsDefault) {
            $scope.ad_CompanyAddress.Status = 'Yes';
        }
        else {
            $scope.ad_CompanyAddress.Status = 'No';
        }
  
        if ($scope.buttonComAddress == "Add") {
            if (!$scope.companyAddresslist.length) {
                $scope.ad_CompanyAddress.SlNo = 1;
            } else {
                $scope.ad_CompanyAddress.SlNo = Enumerable.From($scope.companyAddresslist).Max('$.SlNo') + 1;
            }
            //var checkAddress = Enumerable.From($scope.companyAddresslist).Where('$.Address =="' + $scope.ad_CompanyAddress.Address + '"').FirstOrDefault();
            /*if (checkAddress != null || !angular.isUndefined(checkAddress)) {
                alertify.log('Company Address <b style="color:yellow">' + $scope.ad_CompanyAddress.Address + '</b> Already Added!', 'error', '5000');
                $("#tbxCompanyAddress").focus();
                return;
            }*/
            if (!$scope.companyAddresslist.length) {
                $scope.companyAddresslist.push($scope.ad_CompanyAddress);
            }
            else {
                if (!$scope.isDefaultBilling) {
                    angular.forEach($scope.companyAddresslist, function (aAddress) {
                        if (aAddress.AddressType == $scope.ad_CompanyAddress.AddressType && aAddress.IsDefault == $scope.ad_CompanyAddress.IsDefault) {
                            if ($scope.ad_CompanyAddress.AddressType == 'Billing') {
                                isExistDefaultBilling = aAddress;
                            }
                        }
                    });
                    //isExistDefaultBilling = Enumerable.From($scope.companyAddresslist).Where('$.AddressType == "' + $scope.ad_CompanyAddress.AddressType + '" && $.IsDefault == "' + $scope.ad_CompanyAddress.IsDefault +'" ').FirstOrDefault();
                    if (isExistDefaultBilling && $scope.ad_CompanyAddress.IsDefault) {
                        $scope.isDefaultBilling = true;
                    }
                }
               if (!$scope.isDefaultDelivery) {
                    angular.forEach($scope.companyAddresslist, function (aAddress) {
                        if (aAddress.AddressType == $scope.ad_CompanyAddress.AddressType && aAddress.IsDefault == $scope.ad_CompanyAddress.IsDefault) {
                            if ($scope.ad_CompanyAddress.AddressType == 'Delivery') {
                                isExistDefaultDelivery = aAddress;
                            }
                            
                        }
                    });
                    //isExistDefaultDelivery = Enumerable.From($scope.companyAddresslist).Where('$.AddressType == "' + $scope.ad_CompanyAddress.AddressType + '" && $.IsDefault == "' + $scope.ad_CompanyAddress.IsDefault +'" ').FirstOrDefault();
                   if (isExistDefaultDelivery && $scope.ad_CompanyAddress.IsDefault) {
                        $scope.isDefaultDelivery = true;
                    }
                }
                if ($scope.isDefaultBilling) {
                    alertify.log('Already billing address has default value', 'error', '5000');
                    $scope.isDefaultBilling = false;
                    return;
                }
                else if ($scope.isDefaultDelivery) {
                    alertify.log('Already delivery address has default value', 'error', '5000');
                    $scope.isDefaultDelivery = false;
                    return;
                }
                if (!$scope.isDefaultBilling || !$scope.isDefaultDelivery) {
                    $scope.companyAddresslist.push($scope.ad_CompanyAddress);
                }
            }
           
            $scope.companyEntryForm.$setPristine();
            $scope.companyEntryForm.$setUntouched();
        } else {
            console.log(" update");
            var checkAddressForUpdate = Enumerable.From($scope.companyAddresslist).Where('$.Address =="' + $scope.ad_CompanyAddress.Address + '" && $.SlNo!=' + $scope.ad_CompanyAddress.SlNo).FirstOrDefault();
            var updateAddress = Enumerable.From($scope.companyAddresslist).Where('$.SlNo==' + $scope.ad_CompanyAddress.SlNo).FirstOrDefault();
            if (checkAddressForUpdate == null || angular.isUndefined(checkAddressForUpdate)) {
                updateAddress.Address = $scope.ad_CompanyAddress.Address;
            }

            $scope.companyEntryForm.$setPristine();
            $scope.companyEntryForm.$setUntouched();
        }
        $("#tbxCompanyAddressHidden").val("");
        ClearCompanyAddress();

    };

    $scope.CheckDefault = function (defaultAdd) {
        if (defaultAdd) {
            angular.forEach($scope.companyAddresslist, function (address) {
                if ($scope.ad_CompanyAddress.AddressType == 'Delivery') {
                    if (address.Status == 'Yes' && address.AddressType == 'Delivery') {
                        alertify.log('One Default Delivery Address Accepted!', 'error', '5000');
                        $scope.ad_CompanyAddress.IsDefault = false;
                        return;
                    }
                }
                if ($scope.ad_CompanyAddress.AddressType == 'Billing') {
                    if (address.Status == 'Yes' && address.AddressType == 'Billing') {
                        alertify.log('One Default Billing Address Accepted!', 'error', '5000');
                        $scope.ad_CompanyAddress.IsDefault = false;
                        return;
                    }
                }
            });
        }
    };

    $scope.CheckCompanyAddress = function (IsCompany) {

        if (IsCompany) {
            //alert(IsCompany + " IsCompany");
            $scope.ad_CompanyAddress.AddressCompanyName = $scope.ad_Company.CompanyName;

        }
        if (!IsCompany) {
            //alert(IsCompany + " IsCompany");
            $("#AddressCompanyName").focus();
            $scope.ad_CompanyAddress.AddressCompanyName = "";
        }


    }

    $scope.SelCompanyAddress = function (companyAddress) {
        $("#tbxCompanyAddressHidden").val(companyAddress.Address);
        $scope.ad_CompanyAddress = companyAddress;
        $scope.buttonComAddress = "Change";
    };

    $scope.removeAddress = function (aCompanyAddress) {
        var ind = $scope.companyAddresslist.indexOf(aCompanyAddress);
        $scope.companyAddresslist.splice(ind, 1);
        ClearCompanyAddress();
    }

    //Bill Policy Add, Edit, Delete starts from here
    $scope.AddCompanyBillPolicy = function () {

        if ($scope.buttonBillPolicy == "Add") {

            if (!$scope.companyBillPolicylist.length) {
                $scope.ad_CompanyBillPolicy.SlNo = 1;
            } else {
                $scope.ad_CompanyBillPolicy.SlNo = Enumerable.From($scope.companyBillPolicylist).Max('$.SlNo') + 1;
            }
            var checkPolicy = Enumerable.From($scope.companyBillPolicylist).Where('$.PolicyDescription =="' + $scope.ad_CompanyBillPolicy.PolicyDescription + '"').FirstOrDefault();
            if (checkPolicy != null || !angular.isUndefined(checkPolicy)) {
                alertify.log('Bill Policy <b style="color:yellow">' + $scope.ad_CompanyBillPolicy.PolicyDescription + '</b> Already Added!', 'error', '5000');
                $("#tbxPolicy").focus();
                return;
            }
            $scope.companyBillPolicylist.push($scope.ad_CompanyBillPolicy);

            $scope.companyEntryForm.$setPristine();
            $scope.companyEntryForm.$setUntouched();
        } else {
            var checkUpdateBPolicy = Enumerable.From($scope.companyBillPolicylist).Where('$.PolicyDescription =="' + $scope.ad_CompanyBillPolicy.PolicyDescription + '" && $.SlNo!=' + $scope.ad_CompanyBillPolicy.SlNo).FirstOrDefault();
            var updateBillPolicy = Enumerable.From($scope.companyBillPolicylist).Where('$.SlNo==' + $scope.ad_CompanyBillPolicy.SlNo).FirstOrDefault();
            if (checkUpdateBPolicy == null || angular.isUndefined(checkUpdateBPolicy)) {
                updateBillPolicy.PolicyDescription = $scope.ad_CompanyBillPolicy.PolicyDescription;
            } else {
                updateBillPolicy.PolicyDescription = $("#tbxPolicyHidden").val();
                alertify.log('Bill Policy <b style="color:yellow">' + checkUpdateBPolicy.PolicyDescription + '</b> Already Added!', 'error', '5000');
                $("#tbxPolicy").focus();
            }
        }
        $("#tbxPolicyHidden").val("");
        ClearCompanyBillPolicy();

    };

    $scope.SelCompanyBillPolicy = function (customerbillpolicy, index) {
        $("#tbxPolicyHidden").val(customerbillpolicy.PolicyDescription);
        $scope.ad_CompanyBillPolicy = customerbillpolicy;
        $scope.buttonBillPolicy = "Change";
        $scope.btnSuppBillPolicyDeleteShow = true;
    };

    $scope.removeBillPolicy = function (aBillPolicy) {
        var ind = $scope.companyBillPolicylist.indexOf(aBillPolicy);
        $scope.companyBillPolicylist.splice(ind, 1);
        ClearCompanyBillPolicy();
    },

        $scope.Delete = function () {
            alertify.confirm("Are you sure to delete?", function (e) {
                if (e) {
                    var parms = JSON.stringify({ CompanyId: $scope.ad_Company.CompanyId });
                    $http.post('/CustomerEntry/DeleteCustomer', parms).success(function (data) {
                        if (data > 0) {
                            alertify.log('Company( ' + $scope.ad_Company.CompanyCode + ' ) Deleted Successfully!', 'success', '5000');
                            ClearCompany();
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
        ClearCompany();
        $scope.companyEntryForm.$setPristine();
        $scope.companyEntryForm.$setUntouched();
    };

    $scope.foundChange = function () {
        $scope.duplicateCompName = true;
        $scope.duplicateCompCode = true;
    };

    $scope.GetCompanySearch = function () {
        GetCompanyPaged(1, "C.CompanyName LIKE '%" + $scope.SearchName + "%'");
    }
});