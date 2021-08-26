app.controller("ProformaInvoiceApproveController",
    function($scope, $cookieStore, $http, $filter, $window) {
        $scope.LoginUser = $cookieStore.get('UserData');
        Clear();




        function Clear() {
            $scope.name = "Proforma Invoice Approve";
            $scope.OTP = "";
            $scope.count = 0;
            $scope.DisNewPiSaveBtn = false;
            $scope.DisPiAmendmentSaveBtn = false; 
           // $scope.DisPiOTPSaveBtn = false;

            $scope.PerformaInvoiceApproveList = [];
            $scope.ProformaInvoiceNewApproveList = [];
            $scope.PiNewApproval = [];
            $scope.PiAmendmentList = [];

            GetAllAmendmentApproveRequest();
            GetAllNewPIApprove();
        }

        function GetAllAmendmentApproveRequest() {
            $http({
                url: '/ExpApproval/GetProformaInvoice?approvalType=PIAmendment',
                method: 'GET',
                headers: { 'Content-type': 'application/json' }
            }).success(function (data) {
                if (data.length > 0) {
                    angular.forEach(data, function (aSd) {
                        var res1 = aSd.DocDate.substring(0, 5);
                        if (res1 == "/Date") {
                            var parsedDate1 = new Date(parseInt(aSd.DocDate.substr(6)));
                            var date1 = ($filter('date')(parsedDate1, 'mediumDate')).toString();
                            aSd.DocDate = date1;
                        }
                    })
                }
                $scope.PerformaInvoiceApproveList = data;
            });
        }

        function GetAllNewPIApprove() { 
            $http({
                url: '/ExpApproval/GetProformaInvoice?approvalType=PINew',
                method: 'GET',
                headers: { 'Content-type': 'application/json' }
            }).success(function (data) {
                if (data.length > 0) {
                    angular.forEach(data,
                        function(aSd) {
                            var res1 = aSd.DocDate.substring(0, 5);
                            if (res1 == "/Date") {
                                var parsedDate1 = new Date(parseInt(aSd.DocDate.substr(6)));
                                var date1 = ($filter('date')(parsedDate1, 'mediumDate')).toString();
                                aSd.DocDate = date1;
                            }
                        });
                }
                $scope.ProformaInvoiceNewApproveList = data;
            });
        }

        $scope.OpenReports = function (invoiceId) {
           
            //$window.open("http://43.224.119.250/Reports_MSSQLSERVER2016/report/Reports/Export/Rpt_ProformaInvoice?InvoiceId=" + invoiceId);
            $window.open("#/ProformaInvoiceReport", "popup", "width=800,height=550,left=280,top=80");
            $cookieStore.put("InvoiceId", invoiceId);
            event.stopPropagation();
        }

        $scope.CheckDuplicatePassword = function (password) {

            $http({
                url: '/ExpApproval/CheckDuplicate?approvalType=PiAmendment&approvalPassword=' + password,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {
                if (data.length > 0) {
                    $scope.count = 1;
                   // $scope.DisPiOTPSaveBtn = false;
                    $('#idOTP').focus();
                    $scope.found = true;
                    return;
                } else {
                   // $scope.DisPiOTPSaveBtn = true;
                    $scope.count = 0;
                    $scope.found = false;
                }
            });
        }
        $scope.LoadInvoice = function (password) {
                                
            $http({
                url: '/ExpApproval/exp_ExpAmendment_GetForEdit?approvalType=ExpAmendment&approvalPassword=' + password,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            }).success(function (data) {

                if (data[0]) {
                    var res1 = data[0].ApplicationDate.substring(0, 5);
                    var res2 = data[0].LcDate.substring(0, 5);
                    var res3 = data[0].ExportContactDate.substring(0, 5);
                    if (res1 && res2 && res3 == "/Date") {
                        var parsedDate1 = new Date(parseInt(data[0].ApplicationDate.substr(6)));
                        var parsedDate2 = new Date(parseInt(data[0].LcDate.substr(6)));
                        var parsedDate3 = new Date(parseInt(data[0].ExportContactDate.substr(6)));
                        var date1 = ($filter('date')(parsedDate1, 'MMM dd, yyyy')).toString();
                        var date2 = ($filter('date')(parsedDate2, 'MMM dd, yyyy')).toString();
                        var date3 = ($filter('date')(parsedDate3, 'MMM dd, yyyy')).toString();
                        data[0].ApplicationDate = date1;
                        data[0].LcDate = date2;
                        data[0].ExportContactDate = date3;
                    }
                }
                $scope.exp_PaymentProcess = data[0];
            });
        }
        $scope.SelectNewPiApproveList = function (row, select) {
            row.Ischeck = select;
            row.IsApproved = true;
            row.ApprovedBy = row.UpdateBy = $scope.LoginUser.UserId;

            if (row.Ischeck) {
                row.ApprovalId = row.ApprovalId;
                $scope.PiNewApproval.push(row);
            }
            else {
                var RowIndexList = [];

                angular.forEach($scope.PiNewApproval, function (salesApprove) {
                    if (salesApprove.Ischeck === row.Ischeck) {
                        var ind = $scope.PiNewApproval.indexOf(salesApprove);
                        RowIndexList.push(ind);
                    }
                });
                for (var i = RowIndexList.length - 1; i >= 0; i--) {
                    $scope.PiNewApproval.splice(RowIndexList[i], 1);
                }
            }
            if ($scope.PiNewApproval.length > 0) {
                $scope.DisNewPiSaveBtn = true;
            }
            else {
                $scope.DisNewPiSaveBtn = false;
            }
        }

        $scope.SelectPiAmendmentRequestList = function (row) {
            var array = [];
            row.IsApproved = true;
            row.ApprovedBy = row.UpdateBy = $scope.LoginUser.UserId;

            if (row.optionsRadio === "true") {
                $scope.DisPiAmendmentSaveBtn = true;
                row.ApprovalId = row.ApprovalId;
                array.push(row);
            }
            else {
                $scope.DisPiAmendmentSaveBtn = false;
            }
            $scope.PiAmendmentList = array;
        }

        $scope.SaveNewPiApprove = function () {

            if ($scope.PiNewApproval.length <= 0) {
                alertify.log('Please select at least one new PI', 'error', '3000');
                return;
            }
            alertify.confirm("Are you sure to submit?", function (e) {
                if (e) {
                    var params = JSON.stringify({ expApproval: $scope.PiNewApproval });
                    $http.post('/ExpApproval/UpdateApproval', params).success(function (data) {
                        if (data > 0) {
                            alertify.log('New Proforma invoice approved successfully!', 'success', '5000');
                            GetAllNewPIApprove();
                        }
                        else {
                            alertify.log('Network Error, refresh page and try again', 'error', '5000');
                        }
                    }).error(function (msg) {
                        alertify.log('Network Error, refresh page and try again', 'error', '5000');
                    });
                }
            })
        }

        $scope.SavePiAmendmentApprove = function () {

            if ($scope.count > 0) {
                alertify.log(' Password already used!', 'already', '2000');
                return;
            }
            angular.forEach($scope.PiAmendmentList, function (pass) {
                pass.ApprovalPassword = $scope.OTP;
            });

            alertify.confirm("Are you sure to submit?", function (e) {
                if (e) {
                    var params = JSON.stringify({ expApproval: $scope.PiAmendmentList });
                    $http.post('/ExpApproval/UpdateApproval', params).success(function (data) {
                        if (data > 0) {
                            alertify.log('Proforma invoice amendment approved successfully!', 'success', '5000');
                            GetAllAmendmentApproveRequest();
                            $('#idOTP').val('');
                            Clear();
                        }
                        else {
                            alertify.log('Network Error, refresh page and try again', 'error', '5000');
                        }
                    }).error(function (msg) {
                        alertify.log('Network Error, refresh page and try again', 'error', '5000');
                    });
                }
            })
        }

        $scope.ResetPiNewForm = function()
        {
            GetAllNewPIApprove();
        }

        $scope.ResetPiAmendForm = function () {
            GetAllAmendmentApproveRequest();
            $scope.DisPiAmendmentSaveBtn = false;
            $scope.OTP = "";

        }

    });
