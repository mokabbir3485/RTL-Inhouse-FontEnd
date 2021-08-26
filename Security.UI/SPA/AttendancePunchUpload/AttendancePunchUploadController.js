app.controller("AttendancePunchUploadController", function ($scope, $cookieStore, $http) {
    //TO DO:
    //1.Update USERINFO

    $scope.LoginUser = $cookieStore.get('UserData');
    $scope.MessageButtonLabel = 'Looking for DB';
    $scope.UploadButtonLabel = 'Nothing to Upload';
    $scope.MaxUpload = 250;
    $scope.NewPunchCount = 0;
    if ($scope.LoginUser.BranchName != 'Head Office')
        GetNewPunchCount();

    function GetNewPunchCount() {
        $http({
            url: '/AdvancedSearch/GetNewPunchCount?branchName=' + $scope.LoginUser.BranchName,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (punch) {
            if (punch > 0) {
                $scope.NewPunchCount = punch;
                $scope.MessageButtonLabel = punch + ' New Punch Found';

                if (punch >= $scope.MaxUpload)
                    $scope.UploadButtonLabel = 'Upload ' + $scope.MaxUpload;
                else
                    $scope.UploadButtonLabel = 'Upload ' + punch;
            }

            else if (punch == 0) {
                $scope.NewPunchCount = punch;
                $scope.MessageButtonLabel = 'No New Punch Found';
                $scope.UploadButtonLabel = 'Nothing to Upload';
            }

            else if (punch == -1)
                alertify.log('Could not connect to ' + $scope.LoginUser.BranchName + ' Attendance Database', 'error', '5000');
        })
    }

    $scope.Upload = function () {
        var count = $scope.NewPunchCount >= $scope.MaxUpload ? $scope.MaxUpload : $scope.NewPunchCount;

        $http({
            url: '/AdvancedSearch/UploadPunch?branchName=' + $scope.LoginUser.BranchName + '&count=' + count,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).success(function (data) {
            if (data > 0) {
                alertify.log(count + ' Punch Uploaded Successfully!', 'success', '5000');
                GetNewPunchCount();
            }
            else if (data == -1)
                alertify.log('Could not connect to ' + $scope.LoginUser.BranchName + ' Attendance Database', 'error', '5000');
            else if (data == -2)
                alertify.log('No new punch found, Please refresh page', 'error', '5000');
            else
                alertify.log('Please refresh page to try again', 'error', '5000');

        }).error(function (data) {
            alertify.log('Please refresh page to try again', 'error', '5000');
        });
    }
})