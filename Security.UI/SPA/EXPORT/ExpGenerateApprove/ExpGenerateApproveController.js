app.controller("ExpGenerateApproveController", function ($scope, $cookieStore, $http, $filter, $window) {


    function Clear() {
        $scope.aPassword =null;
        $scope.LoginUser = $cookieStore.get('UserData');
        $scope.exp_AmendmentNewApproval = {};
        $scope.exp_AmendmentRequestApproval = {};
        $scope.exp_AmendmentNewApproval.ApprovalId = 0;
        $scope.exp_AmendmentRequestApproval.ApprovalId = 0;
        $scope.PaymentProcessNewList = [];
        $scope.AmendmentRequestApprovalList = [];
        $scope.AmendmentRequestList = [];
        $scope.AmendmentNewApprovalList = [];
        GetAllAmendmentRequest();
        GetAllPaymentProcessNew();

    }
    Clear();

    function GetAllAmendmentRequest() {
        var approvalType = 'ExpAmendment'
        $http({
            url: '/ExpApproval/GetExpGenerate?approvalType=' + approvalType,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.AmendmentRequestList = data;
            console.log($scope.AmendmentRequestList);
        });
    }

    function GetAllPaymentProcessNew() {
        var approvalType = 'ExpNew'
        $http({
            url: '/ExpApproval/GetExpGenerate?approvalType=' + approvalType,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            $scope.PaymentProcessNewList = data;
            console.log($scope.PaymentProcessNewList);
        });
    }
    function SubmitNewApproval(status) {


        var parms = JSON.stringify({ expApproval: $scope.AmendmentNewApprovalList });
        $http.post('/ExpApproval/UpdateApproval', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Request ' + status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.PaymentProcessEntryForm.$setPristine();
                $scope.PaymentProcessEntryForm.$setUntouched();
            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    }
    function SubmitAmendmentRequestApproval(status) {
        $scope.AmendmentRequestApprovalList.push($scope.exp_AmendmentRequestApproval);
        angular.forEach($scope.AmendmentRequestApprovalList, function (data) {
            if ($scope.aPassword != null) {
                data.ApprovalPassword = $scope.aPassword;
            }
        });

        var parms = JSON.stringify({ expApproval: $scope.AmendmentRequestApprovalList });
        $http.post('/ExpApproval/UpdateApproval', parms).success(function (data) {
            if (data > 0) {
                alertify.log('Request ' + status + ' Successfully!', 'success', '5000');
                Clear();
                $scope.PaymentProcessEntryForm.$setPristine();
                $scope.PaymentProcessEntryForm.$setUntouched();
            } else {
                alertify.log('Server Errors!', 'error', '5000');
            }
        }).error(function (data) {
            alertify.log('Server Errors!', 'error', '5000');
        });
    };

    $scope.RowNewSelect = function (selected, Approve) {
        $scope.ChackSelect = selected;
        if (selected == true) {
            $scope.exp_AmendmentNewApproval = {
                ApprovalId: Approve.ApprovalId,
                IsApproved: true,
                ApprovedBy: $scope.LoginUser.UserId,
                UpdateBy: $scope.LoginUser.UserId
            };
            $scope.AmendmentNewApprovalList.push($scope.exp_AmendmentNewApproval);
        }
        else {
            angular.forEach($scope.AmendmentNewApprovalList, function (aApproval) {
                if (aApproval.ApprovalId == Approve.ApprovalId) {
                    var isHashKey = Enumerable.From($scope.AmendmentNewApprovalList).Where('$.ApprovalId==' + Approve.ApprovalId).FirstOrDefault();
                    var index = $scope.AmendmentNewApprovalList.indexOf(isHashKey);
                    $scope.AmendmentNewApprovalList.splice(index, 1);
                }
            });
        }
    }
    $scope.RowRequestSelect = function (selected, Approve) {
        $scope.RadioSelected = selected = true;
        if (selected == true) {
            $scope.exp_AmendmentRequestApproval = {
                ApprovalId: Approve.ApprovalId,
                IsApproved: true,
                ApprovedBy: $scope.LoginUser.UserId,
                UpdateBy: $scope.LoginUser.UserId
            };

        }
    }
    $scope.SubmitNewApproval = function () {
        if ($scope.AmendmentNewApprovalList.length == 0) {
            alertify.log('Please select at least one request', 'error', '5000');
            return;
        }
        if ($scope.exp_AmendmentNewApproval.ApprovalId == 0) {
            alertify.confirm("Are you sure want to save?", function (e) {
                if (e) {
                    SubmitNewApproval('Saved');
                }
            })
        }
        else if ($scope.exp_AmendmentNewApproval.ApprovalId > 0) {
            alertify.confirm("Are you sure want to approve?", function (e) {
                if (e) {
                    SubmitNewApproval('Approved');
                }
            })
        }

    }
    $scope.SubmitAmendmentRequestApproval = function () {

        if ($scope.exp_AmendmentRequestApproval.ApprovalId == 0) {
            alertify.confirm("Are you sure want to save?", function (e) {
                if (e) {
                    SubmitAmendmentRequestApproval('Saved');
                }
            })
        }
        else if ($scope.exp_AmendmentRequestApproval.ApprovalId > 0) {
            $http({
                url: '/ExpApproval/CheckDuplicate?approvalType=ExpAmendment&approvalPassword=' + $scope.aPassword,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                if (data.length > 0) {
                    alertify.log(' Password already used!', 'already', '5000');
                    txtPassword.focus();
                    return;
                }
                else {
                    alertify.confirm("Are you sure want to approve?", function (e) {
                        if (e) {
                            SubmitAmendmentRequestApproval('Approved');
                        }
                    })
                }
            })
          
        }

    }
    $scope.resetForm = function () {
        Clear();
        $scope.amendmentRequestApproveForm.$setPristine();
        $scope.amendmentRequestApproveForm.$setUntouched();
    };


});