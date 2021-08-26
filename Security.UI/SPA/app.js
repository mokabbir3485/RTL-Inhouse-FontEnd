var app = angular.module('AngularDemoApp', ['ngRoute', 'ngCookies', 'cfp.hotkeys', 'angularUtils.directives.dirPagination', 'ngAnimate', 'ui.bootstrap', 'components', 'angularjs-dropdown-multiselect']);

//Check page parmission from cookies which is defined by 'IndexController'
app.config(function ($routeProvider) {
    $routeProvider
        .when('/Attendee', {
            templateUrl: '/SPA/Attendee/Attendee.html',
            controller: 'AttendeeController'
        })
        .when('/CustomerType', {
            title: "Customer Type",
            templateUrl: '/SPA/CustomerType/CustomerType.html',
            controller: 'CustomerTypeController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData'); //Check Logged In or not
                    if (login != undefined) {
                        var permission = $cookieStore.get('CustomerPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/CustomerEntry', {
            title: 'Customer Entry',
            templateUrl: '/SPA/CustomerEntry/CustomerEntry.html',
            controller: 'CustomerEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData'); //Check Logged In or not
                    if (login != undefined) {
                        var permission = $cookieStore.get('CustomerPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/CompanyEntry', {
            title: 'Company Entry',
            templateUrl: '/SPA/CompanyEntry/CompanyEntry.html',
            controller: 'CompanyEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData'); //Check Logged In or not
                    if (login != undefined) {
                        var permission = $cookieStore.get('CompanyEntryPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/PaymentGroup', {
            templateUrl: '/SPA/PaymentGroup/PaymentGroup.html',
            controller: 'PaymentGroupController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData'); //Check Logged In or not
                    if (login != undefined) {
                        var permission = $cookieStore.get('PaymentGroupPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/BankEntry', {
            templateUrl: '/SPA/BankEntry/BankEntry.html',
            controller: 'BankEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData'); //Check Logged In or not
                    if (login != undefined) {
                        var permission = $cookieStore.get('BankEntryPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/Overhead', {
            templateUrl: '/SPA/OverheadEntry/OverheadEntry.html',
            controller: 'OverheadEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('OverheadPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/BarcodePrint', {
            templateUrl: '/SPA/BarcodePrint/BarcodePrint.html',
            controller: 'BarcodePrintControlloer',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('BarcodePrintPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/StockValuationSetup', {
            templateUrl: '/SPA/INVENTORY/Setup/Setup.html',
            controller: 'StockValuationSetupController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('StockValuationSetupPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/PurchaseOrder', {
            templateUrl: '/SPA/INVENTORY/PurchaseOrder/PurchaseOrderEntry.html',
            controller: 'PurchaseOrderEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('PurchaseOrderPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page3");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }

                }
            }
        })
        .when('/SupplierEntry', {
            templateUrl: '/SPA/SupplierEntry/SupplierEntry.html',
            controller: 'SupplierEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SupplierPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/BranchEntry', {
            templateUrl: '/SPA/BranchEntry/BranchEntry.html',
            controller: 'BranchEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('BranchPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/BranchTypeEntry', {
            templateUrl: '/SPA/BranchTypeEntry/BranchTypeEntry.html',
            controller: 'BranchTypeEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('BranchTypePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/CategoryEntry', {
            templateUrl: '/SPA/CategoryEntry/CategoryEntry.html',
            controller: 'CategoryEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('CategoryPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ChangePassword', {
            templateUrl: '/SPA/ChangePassword/ChangePassword.html',
            controller: 'ChangePasswordController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ChangePasswordPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/Sync', {
            templateUrl: '/SPA/Sync//Sync.html',
            controller: 'SyncController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SyncPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/PaymentType', {
            templateUrl: '/SPA/PaymentType/PaymentType.html',
            controller: 'PaymentTypeController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ChangePasswordPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/DepartmentEntry', {
            templateUrl: '/SPA/DepartmentEntry/DepartmentEntry.html',
            controller: 'DepartmentEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('DepartmentPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/DepartmentTypeEntry', {
            templateUrl: '/SPA/DepartmentTypeEntry/DepartmentTypeEntry.html',
            controller: 'DepartmentTypeEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('DepartmentTypePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/DesignationEntry', {
            templateUrl: '/SPA/DesignationEntry/DesignationEntry.html',
            controller: 'DesignationEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('DesignationPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/Employee', {
            templateUrl: '/SPA/EmployeeEntry/EmployeeEntry.html',
            controller: 'EmployeeController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('EmployeePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ItemAdditionalAttribute', {
            templateUrl: '/SPA/ItemAdditionalAttribute/ItemAdditionalAttribute.html',
            controller: 'ItemAdditionalAttributeController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ItemAdditionalAttributePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ItemAdditionalAttributeValue', {
            templateUrl: '/SPA/ItemAdditionalAttributeValue/ItemAdditionalAttributeValue.html',
            controller: 'ItemAdditionalAttributeValueController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ItemAdditionalAttributeValuePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ItemAdditionalAttributePrice', {
            templateUrl: '/SPA/ItemAdditionalAttributePrice/ItemAdditionalAttributePrice.html',
            controller: 'ItemAdditionalAttributePriceController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ItemAdditionalAttributePricePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ItemEntry', {
            templateUrl: '/SPA/ItemEntry/ItemEntryTwo.html',
            controller: 'ItemEntryTwoController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ProductPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ModuleEntry', {
            templateUrl: '/SPA/ModuleEntry/ModuleEntry.html',
            controller: 'ModuleEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ModulePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/PermissionEntry', {
            templateUrl: '/SPA/PermissionEntry/PermissionEntry.html',
            controller: 'PermissionEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('PermissionPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/RoleEntry', {
            templateUrl: '/SPA/RoleEntry/RoleEntry.html',
            controller: 'RoleEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('RolePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ScreenEntry', {
            templateUrl: '/SPA/ScreenEntry/ScreenEntry.html',
            controller: 'ScreenEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ScreenPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/SubcategoryEntry', {
            templateUrl: '/SPA/SubcategoryEntry/SubcategoryEntry.html',
            controller: 'SubcategoryEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SubcategoryPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/Unit', {
            templateUrl: '/SPA/Unit/Unit.html',
            controller: 'UnitController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('UnitPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/PriceType', {
            templateUrl: '/SPA/PriceTypeEntry/PriceTypeEntry.html',
            controller: 'PriceTypeEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('PriceTypePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ChargeTypeEntry', {
            templateUrl: '/SPA/ChargeTypeEntry/ChargeTypeEntry.html',
            controller: 'ChargeTypeEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ChargeTypePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/FinalPriceConfig', {
            templateUrl: '/SPA/FinalPriceConfig/FinalPriceConfig.html',
            controller: 'FinalPriceConfigController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('FinalPriceConfigPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/AuditType', {
            templateUrl: '/SPA/AuditTypeEntry/AuditTypeEntry.html',
            controller: 'AuditTypeEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('AuditTypePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/Terminal', {
            templateUrl: '/SPA/TerminalEntry/TerminalEntry.html',
            controller: 'TerminalEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('TerminalPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/StockDeclarationType', {
            templateUrl: '/SPA/DeclarationTypeEntry/DeclarationTypeEntry.html',
            controller: 'DeclarationTypeEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('StockDeclarationTypePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/RequisitionPurposeEntry', {
            templateUrl: '/SPA/RequisitionPurposeEntry/RequisitionPurposeEntry.html',
            controller: 'RequisitionPurposeEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('RequisitionPurposeEntryPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ReturnReasonEntry', {
            templateUrl: '/SPA/ReturnReasonEntry/ReturnReasonEntry.html',
            controller: 'ReturnReasonEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ReturnReasonEntryPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/VoidReasonEntry', {
            templateUrl: '/SPA/VoidReasonEntry/VoidReasonEntry.html',
            controller: 'VoidReasonEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('VoidReasonEntryPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ApprovalSetup', {
            templateUrl: '/SPA/Approval/Approval.html',
            controller: 'ApprovalController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ApprovalSetupPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        //HR ADDED BY RAJU 31/12/17
        .when('/AttendancePolicy', {
            templateUrl: '/SPA/HR/AttendancePolicy/AttendancePolicy.html',
            controller: 'AttendancePolicyController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('AttendancePolicyPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

     


        .when('/ProductionEntry', {
            templateUrl: '/SPA/INVENTORY/ProductionEntry/ProductionEntry.html',
            controller: 'ProductionEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ProductionEntryPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/StockReceiveEntry', {

            templateUrl: '/SPA/INVENTORY/StockReceive/StockReceive.html',
            controller: 'StockReceiveController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('StockReceivePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }

                }
            }
        })
        .when('/OpeningQuantity', {
            templateUrl: '/SPA/INVENTORY/OpeningQtyEntry/OpeningQtyEntry.html',
            controller: 'OpeningQtyEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('OpeningQuantityPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/StockIssue', {
            templateUrl: '/SPA/INVENTORY/IssueEntry/IssueEntry.html',
            controller: 'IssueEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('StockIssuePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/StockIssueWithoutRequisition', {
            templateUrl: '/SPA/INVENTORY/IssueWithoutRequisition/IssueWithoutRequisition.html',
            controller: 'IssueWithoutRequisitionController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('StockIssueWithoutRequisitionPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/IssueApprove', {   //added by tofael 26102016
            templateUrl: '/SPA/INVENTORY/IssueApprove/IssueApprove.html',
            controller: 'IssueApproveController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('IssueApprovePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/CIFReport', {
            templateUrl: '/SPA/INVENTORY/CIFReport/CIFReport.html',
            controller: 'CIFReportController'
        })
        .when('/InventoryAndSaleReports', {   //added by tofael 28102016
            templateUrl: '/SPA/INVENTORY/InventoryReports/InventoryReports.html',
            controller: 'InventoryReportsController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('InventoryAndSaleReportsPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/InventoryAndSaleReportsMushak', {   
            templateUrl: '/SPA/INVENTORY/InventoryReportsMushak/InventoryReportsMushak.html',
            controller: 'InventoryReportsMushakController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('InventoryAndSaleReportsMushakPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })


        //.when('/ExportReports', {   //added by rakin 16062020




        //    templateUrl: '/SPA/INVENTORY/ExportReports/ExportReports.html',
        //    controller: 'ExportReportsController',
        //    resolve: {
        //        "check": function ($cookieStore) {
        //            var login = $cookieStore.get('UserData');
        //            if (login != undefined) {
        //                var permission = $cookieStore.get('ExportReportsPermission');
        //                if (permission != 'true') {
        //                    alertify.alert("You don't have parmission to access this page");
        //                    window.location = '/Home/Index#/Home';
        //                }
        //            }
        //            else {
        //                window.location = '/Home/Login#/';
        //            }
        //        }
        //    }
        //})
        .when('/Delivery', {   //added by tofael 09112016
            templateUrl: '/SPA/INVENTORY/Delivery/Delivery.html',
            controller: 'DeliveryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('DeliveryPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/InventoryApprovals', {
            templateUrl: '/SPA/INVENTORY/InventoryApprovals/InventoryApprovals.html',
            controller: 'InventoryApprovalsController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('InventoryApprovalsPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/PurchaseRequisition', {
            templateUrl: '/SPA/INVENTORY/PurchaseRequisition/PurchaseRequisitionEntry.html',
            controller: 'PurchaseRequisitionEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('PurchaseRequisitionPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/BillOfMaterial', {
            templateUrl: '/SPA/INVENTORY/BillOfMaterial/BillOfMaterial.html',
            controller: 'BillOfMaterialController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('BillOfMaterialPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        //.when('/PurchaseBillEntry', {
        //    templateUrl: '/SPA/INVENTORY/PurchaseBillEntry/PurchaseBillEntry.html',
        //    controller: 'PurchaseBillController',
        //    resolve: {
        //        "check": function ($cookieStore) {
        //            var login = $cookieStore.get('UserData');
        //            if (login != undefined) {
        //                var permission = $cookieStore.get('PurchaseBillPermission');
        //                if (permission != 'true') {
        //                    alertify.alert("You don't have parmission to access this page");
        //                    window.location = '/Home/Index#/Home';
        //                }
        //            }
        //            else {
        //                window.location = '/Home/Login#/';
        //            }
        //        }
        //    }
        //})
        .when('/ImportPurchaseBill', {
            templateUrl: '/SPA/INVENTORY/ImportPurchaseBill/ImportPurchaseBillEntry.html',
            controller: 'ImportPurchaseBillEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ImportPurchaseBillPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/LocalPurchaseBillEntry', {
            templateUrl: '/SPA/INVENTORY/LocalPurchaseBillEntry/LocalPurchaseBill.html',
            controller: 'LocalPurchaseBillController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('LocalPurchaseBillPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/SupplierPayment', {
            templateUrl: '/SPA/Procurement/SupplierPaymentEntry/SupplierPayment.html',
            controller: 'SuppilerPaymentController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SupplierPaymentPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/SupplierPaymentAdjustment', {
            templateUrl: '/SPA/Procurement/SupplierAdjustment/SupplierAdjustmentEntry.html',
            controller: 'SupplierAdjustmentController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SupplierPaymentAdjustmentPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/SupplierLedger', {
            templateUrl: '/SPA/Procurement/SupplierLedger/SupplierLedgersEntry.html',
            controller: 'SupplierLedgersController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SupplierLedgerPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/WarrentyAndSerialNo', {
            templateUrl: '/SPA/INVENTORY/WarrentyAndSerialNo/WarrentyAndSerialNoEntry.html',
            controller: 'WarrentyAndSerialNoEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('WarrentyAndSerialNoPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/CIFReport', {
            templateUrl: '/SPA/INVENTORY/CIFReport/CIFReport.html',
            controller: 'CIFReportController'
        })

           //INVENTORY REPORT

        .when('/LocalPurchaseReport', {
            templateUrl: '/SPA/INVENTORY/LocalPurchaseReport/LocalPBReport.html',
            controller: 'LocalPBReportController'
        })



        .when('/Sale', {
            templateUrl: '/SPA/POS/Sale/Sale.html',
            controller: 'SaleController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SalePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/Exchange', {
            templateUrl: '/SPA/POS/Exchange/Exchange.html',
            controller: 'ExchangeController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ExchangePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/Offer', {
            templateUrl: '/SPA/POS/Offer/Offer.html',
            controller: 'OfferController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('OfferPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/SaleVoid', {
            templateUrl: '/SPA/POS/SaleVoid/SaleVoid.html',
            controller: 'SaleVoidController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SaleVoidPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/CashDeposit', {
            templateUrl: '/SPA/POS/CashTransfer/CashTransfer.html',
            controller: 'CashTransferController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('CashDepositPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/RequisitionEntry', {
            templateUrl: '/SPA/INVENTORY/RequisitionEntry/RequisitionEntry.html',
            controller: 'RequisitionController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('RequisitionPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ReorderLevelSetup', {
            templateUrl: '/SPA/INVENTORY/ReorderLevelSetup/ReorderLevelSetup.html',
            controller: 'ReorderLevelSetupController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ReorderLevelSetupPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ReturnToSupplier', {
            templateUrl: '/SPA/INVENTORY/ReturnToSupplier/ReturnToSupplier.html',
            controller: 'ReturnToSupplierController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ReturnToSupplierPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ReturnFromDepartment', {
            templateUrl: '/SPA/INVENTORY/ReturnFromDepartment/ReturnFromDepartment.html',
            controller: 'ReturnFromDepartmentController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ReturnFromDepartmentPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/StockAuditEntry', {
            templateUrl: '/SPA/INVENTORY/StockAuditEntry/StockAuditEntry.html',
            controller: 'StockAuditEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('StockAuditEntryPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/StockDeclarationEntry', {
            templateUrl: '/SPA/INVENTORY/StockDeclarationEntry/StockDeclarationEntry.html',
            controller: 'StockDeclarationEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('StockDeclarationEntryPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/SalesOrder', {
            templateUrl: '/SPA/POS/SalesOrder/SalesOrderEntry.html',
            controller: 'SalesOrderEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SalesOrderPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ReviseSalesOrder', {
            templateUrl: '/SPA/POS/ReviseSalesOrder/ReviseSalesOrderEntry.html',
            controller: 'ReviseSalesOrderEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ReviseSalesOrderPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/SalesOrderApprove', {
            templateUrl: '/SPA/POS/SalesOrderApprove/SalesOrderApprove.html',
            controller: 'SalesOrderApproveController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SalesOrderApprovePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/InternalWorkOrder', {
            templateUrl: '/SPA/INVENTORY/InternalWorkOrder/InternalWorkOrderEntry.html',
            controller: 'InternalWorkOrderEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('InternalWorkOrderPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/CompanyAdvance', {
            templateUrl: '/SPA/RECEIVABLE/CompanyAdvance/CompanyAdvanceEntry.html',
            controller: 'CompanyAdvanceEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('CompanyAdvancePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/SaleAcknowledgement', {
            templateUrl: '/SPA/RECEIVABLE/SaleAcknowledgement/SaleAcknowledgementEntry.html',
            controller: 'SaleAcknowledgementEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SaleAcknowledgementPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/SaleAdjustment', {
            templateUrl: '/SPA/RECEIVABLE/SaleAdjustment/SaleAdjustmentEntry.html',
            controller: 'SaleAdjustmentEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SaleAdjustmentPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/SaleRealization', {
            templateUrl: '/SPA/RECEIVABLE/SaleRealization/SaleRealizationEntry.html',
            controller: 'SaleRealizationEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SaleRealizationPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/SupplierAdvance', {
            templateUrl: '/SPA/PAYABLE/SupplierAdvance/SupplierAdvanceEntry.html',
            controller: 'SupplierAdvanceEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('SupplierAdvancePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/PurchaseAcknowledgement', {
            templateUrl: '/SPA/PAYABLE/PurchaseAcknowledgement/PurchaseAcknowledgementEntry.html',
            controller: 'PurchaseAcknowledgementEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('PurchaseAcknowledgementPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/PurchaseAdjustment', {
            templateUrl: '/SPA/PAYABLE/PurchaseAdjustment/PurchaseAdjustmentEntry.html',
            controller: 'PurchaseAdjustmentEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('PurchaseAdjustmentPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/PurchaseRealization', {
            templateUrl: '/SPA/PAYABLE/PurchaseRealization/PurchaseRealizationEntry.html',
            controller: 'PurchaseRealizationEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('PurchaseRealizationPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/Accounts', {
            templateUrl: '/SPA/ACCOUNTS/AccountsWindow/AccountsWindow.html',
            controller: 'AccountsWindowController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('AccountsPermission');
                        if (permission != 'true') {
                            alertify.log("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/AttendancePunchUpload', {
            templateUrl: '/SPA/AttendancePunchUpload/AttendancePunchUpload.html',
            controller: 'AttendancePunchUploadController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('AttendancePunchUploadPermission');
                        if (permission != 'true') {
                            alertify.log("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ProformaInvoice', {
            templateUrl: '/SPA/EXPORT/ProformaInvoice/ProformaInvoice.html',
            controller: 'ProformaInvoiceController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ProformaInvoicePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ProformaInvoiceReport', {
            templateUrl: '/SPA/EXPORT/ProformaInvoiceReport/ProformaInvoiceReport.html',
            controller: 'ProformaInvoiceReportController'
        })
        .when('/CommercialInvoiceReport', {
            templateUrl: '/SPA/EXPORT/CommercialInvoiceReport/CommercialInvoiceReport.html',
            controller: 'CommercialInvoiceReportController'
        })
        .when('/DeliveryChallanReport', {
            templateUrl: '/SPA/EXPORT/DeliveryChallanReport/DeliveryChallanReport.html',
            controller: 'DeliveryChallanReportController'
        })
        .when('/PackingReport', {
            templateUrl: '/SPA/EXPORT/PackingReport/PackingReport.html',
            controller: 'PackingReportController'
        })
        .when('/PackingDocumentReport', {
            templateUrl: '/SPA/EXPORT/PackingDocumentReport/PackingDocumentReport.html',
            controller: 'PackingDocumentReportController'
        })
        .when('/TruckChallanReport', {
            templateUrl: '/SPA/EXPORT/TruckChallanReport/TruckChallanReport.html',
            controller: 'TruckChallanReportController'
        })
        .when('/BankReport', {
            templateUrl: '/SPA/EXPORT/BankReport/BankReport.html',
            controller: 'BankReportController'
        })
        .when('/BillOfExchangeReport', {
            templateUrl: '/SPA/EXPORT/BillOfExchangeReport/BillOfExchangeReport.html',
            controller: 'BillOfExchangeReportController'
        })

        .when('/BillOfExchangeReport2', {
            templateUrl: '/SPA/EXPORT/BillOfExchangeReport2/BillOfExchangeReport2.html',
            controller: 'BillOfExchangeReport2Controller'
        })

        .when('/BeneficiaryCertificateReport', {
            templateUrl: '/SPA/EXPORT/BeneficiaryCertificateReport/BeneficiaryCertificateReport.html',
            controller: 'BeneficiaryCertificateReportController'
        })

        .when('/ConsumptionCertificateReport', {
            templateUrl: '/SPA/EXPORT/ConsumptionCertificateReport/ConsumptionCertificateReport.html',
            controller: 'ConsumptionCertificateReportController'
        })
        .when('/DeliveryChalan', {
            templateUrl: '/SPA/EXPORT/DeliveryChalan/DeliveryChalan.html',
            controller: 'DeliveryChalanController'
        })


        .when('/CertificateReport', {
            templateUrl: '/SPA/EXPORT/CertificateReport/CertifaciateOfOrigin.html',
            controller: 'CertificateOfOriginController'
        })
        .when('/CertificatePreReport', {
            templateUrl: '/SPA/EXPORT/CertificatePreReport/CertifaciateOfPreInspection.html',
            controller: 'CertifaciateOfPreInspectionController'
        })
        ///IwoReport
        .when('/IWOReport', {
            templateUrl: '/SPA/Inventory/IWOReport/InternalWorkOrderReport.html',
            controller: 'InternalWorkOrderReportController'
        })
        .when('/DeliveryReport', {
            templateUrl: '/SPA/Inventory/DeliveryReport/DeliveryReport.html',
            controller: 'DeliveryReportController'
        })
        .when('/Mushak4_3', {
            templateUrl: '/SPA/CustomTarrif/Mushak4_3/Mushak4_3Report.html',
            controller: 'Mushak4_3ReportController'
        })
        .when('/Mushak6_1', {
            templateUrl: '/SPA/CustomTarrif/Mushak6_1/Mushak6_1Report.html',
            controller: 'Mushak6_1ReportController'
        })

        .when('/Mushak6_2', {
            templateUrl: '/SPA/CustomTarrif/Mushak6_2/Mushak6_2Report.html',
            controller: 'Mushak6_2ReportController'
        })
        .when('/SupplierLedgerReport', {
            templateUrl: '/SPA/Procurement/SupplierLedgerReport/SupplierLedgerReport.html',
            controller: 'SupplierLedgerReportController'
        })

        .when('/ExpGenerate', {
            templateUrl: '/SPA/EXPORT/ExpGenerate/ExpGenerate.html',
            controller: 'ExpGenerateController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ExpGeneratePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/CommercialInvoice', {
            templateUrl: '/SPA/EXPORT/CommercialInvoice/CommercialInvoice.html',
            controller: 'CommercialInvoiceController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('CommercialInvoicePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        //Test
        .when('/Test', {
            templateUrl: '/SPA/Test/TestEntry.html',
            controller: 'TestEntryController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('TestPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ProformaInvoiceApprove', {
            templateUrl: '/SPA/EXPORT/ProformaInvoiceApprove/ProformaInvoiceApprove.html',
            controller: 'ProformaInvoiceApproveController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ProformaInvoiceApprovePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ExpGenerateApprove', {
            templateUrl: '/SPA/EXPORT/ExpGenerateApprove/ExpGenerateApprove.html',
            controller: 'ExpGenerateApproveController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ExpGenerateApprovePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/CommercialInvoiceApprove', {
            templateUrl: '/SPA/EXPORT/CommercialInvoiceApprove/CommercialInvoiceApprove.html',
            controller: 'CommercialInvoiceApproveController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('CommercialInvoiceApprovePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/PostCiProcess', {
            templateUrl: '/SPA/EXPORT/PostCiProcess/PostCiProcess.html',
            controller: 'PostCiProcessController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('PostCiProcessPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ExportDocumentUpload', {
            templateUrl: '/SPA/EXPORT/ExportDocumentUpload/ExportDocumentUpload.html',
            controller: 'ExportDocumentUploadController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ExportDocumentUploadPermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ReviseProformaInvoice', {
            templateUrl: '/SPA/EXPORT/ReviseProformaInvoice/ReviseProformaInvoice.html',
            controller: 'ReviseProformaInvoiceController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ReviseProformaInvoicePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ReviseExpGenerate', {
            templateUrl: '/SPA/EXPORT/ReviseExpGenerate/ReviseExpGenerate.html',
            controller: 'ReviseExpGenerateController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ReviseExpGeneratePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/ReviseCommercialInvoice', {
            templateUrl: '/SPA/EXPORT/ReviseCommercialInvoice/ReviseCommercialInvoice.html',
            controller: 'ReviseCommercialInvoiceController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ReviseCommercialInvoicePermission');
                        if (permission != 'true') {
                            alertify.alert("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })
        .when('/AccountType', {
            templateUrl: '/SPA/ACCOUNTS/AccountType/AccountType.html',
            controller: 'AccountTypeController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('AccountTypePermission');
                        if (permission != 'true') {
                            alertify.log("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/AccountTypeDetail', {
            templateUrl: '/SPA/ACCOUNTS/AccountTypeDetail/AccountTypeDetail.html',
            controller: 'AccountTypeDetailController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('AccountTypeDetailPermission');
                        if (permission != 'true') {
                            alertify.log("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/ChartOfAccounts', {
            templateUrl: '/SPA/ACCOUNTS/ChartOfAccounts/ChartOfAccounts.html',
            controller: 'ChartOfAccountsController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ChartOfAccountsPermission');
                        if (permission != 'true') {
                            alertify.log("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/ReceiptVoucher', {
            templateUrl: '/SPA/ACCOUNTS/ReceiptVoucher/ReceiptVoucher.html',
            controller: 'ReceiptVoucherController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ReceiptVoucherPermission');
                        if (permission != 'true') {
                            alertify.log("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/PaymentVoucher', {
            templateUrl: '/SPA/ACCOUNTS/PaymentVoucher/PaymentVoucher.html',
            controller: 'PaymentVoucherController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('PaymentVoucherPermission');
                        if (permission != 'true') {
                            alertify.log("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/JournalVoucher', {
            templateUrl: '/SPA/ACCOUNTS/JournalVoucher/JournalVoucher.html',
            controller: 'JournalVoucherController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('JournalVoucherPermission');
                        if (permission != 'true') {
                            alertify.log("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/ContraVoucher', {
            templateUrl: '/SPA/ACCOUNTS/ContraVoucher/ContraVoucher.html',
            controller: 'ContraVoucherController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('ContraVoucherPermission');
                        if (permission != 'true') {
                            alertify.log("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/BankAccount', {
            templateUrl: '/SPA/BankAccount/BankAccount.html',
            controller: 'BankAccountController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {
                        var permission = $cookieStore.get('BankAccountPermission');
                        if (permission != 'true') {
                            alertify.log("You don't have parmission to access this page");
                            window.location = '/Home/Index#/Home';
                        }
                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/Home', {
            templateUrl: '/SPA/Home/Home.html',
            controller: 'HomeController',
            resolve: {
                "check": function ($cookieStore) {
                    var login = $cookieStore.get('UserData');
                    if (login != undefined) {

                    }
                    else {
                        window.location = '/Home/Login#/';
                    }
                }
            }
        })

        .when('/', {
            templateUrl: '/SPA/Login/Login.html',
            controller: 'LoginController'
        })
        .otherwise({ redirectTo: '/' });
});

//var dateTimePicker = function () {
//    return {
//        restrict: "A",
//        require: "ngModel",
//        link: function (scope, element, attrs, ngModelCtrl) {
//            var parent = $(element).parent();
//            var dtp = parent.datetimepicker({
//                format: "LL",
//                showTodayButton: true
//            });
//            dtp.on("dp.change", function (e) {
//                ngModelCtrl.$setViewValue(moment(e.date).format("LL"));
//                scope.$apply();
//            });
//        }
//    };
//};

app.directive('moveNextOnEnter', function () {
    return {
        restrict: "A",
        link: function ($scope, element) {
            element.bind("keyup", function (e) {
                if (e.which == 13) {
                    var $nextElement = element.next();
                    //if ($nextElement.length) {
                    $nextElement[0].focus();
                    //}
                }
            });
            event.preventDefault();
        }
    }
});
app.directive("selectNgFiles", function () {
    return {
        require: "ngModel",
        link: function postLink(scope, elem, attrs, ngModel) {
            elem.on("change", function (e) {
                var files = elem[0].files;
                ngModel.$setViewValue(files);
            })
        }
    }
});
app.factory('MyService', function () {
    return {
        data: {
            userName: '',
            role: '',
            permission: []
        },
        update: function (username, role) {
            this.data.userName = username;
            this.data.role = role;
        },
        permissionUpdate: function (permission) {
            this.data.permission = permission;
        }
    };
});

app.config(function ($provide) {
    $provide.decorator('$exceptionHandler', function ($delegate, $cookieStore) {
        return function (exception, cause) {
            $delegate(exception, cause);
            var message = exception.message;
            $cookieStore.put('errorMassage', message);
        };

    });
});

app.run(function ($http, $cookieStore) {
    var message = $cookieStore.get('errorMassage');
    if (message != undefined) {
        var megs = $cookieStore.get('errorMassage');
        var parms = { message: megs };
        $http.post('/ErrorLog/CreateErrorLogForClintSite', parms).success(function (data) {
        });
    }

   
});