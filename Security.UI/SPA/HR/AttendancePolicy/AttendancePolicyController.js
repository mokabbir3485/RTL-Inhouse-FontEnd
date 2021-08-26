app.controller("AttendancePolicyController", function ($scope, $cookieStore, $http, $filter) {
    Clear();
    function Clear() {
        $scope.AttendancePolice = {};
        $scope.AttendancePolice.IsHalfDay = false;
        $scope.AttendancePolice.IsActive = true;
        $scope.IsShowHalfDayLate = false;
        $scope.btnSave = "Save";
        $scope.FirstWeeklyHolidayList = [];
        FillDateAndTimeTextBoxValue();
        loadWeekHoliday();
    }

    function FillDateAndTimeTextBoxValue() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        //Time 
        var hours = today.getHours();
        var minutes = today.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;

        $scope.ToTime = strTime;

        $scope.AttendancePolice.HalfDayLate = strTime;
        $scope.AttendancePolice.StartTime = strTime;
        $scope.AttendancePolice.EndTime = strTime;
        $scope.AttendancePolice.LateInAfter = strTime;
        $scope.AttendancePolice.EarlyOutBefore = strTime;


        $scope.AttendancePolice.HalfDayStartTime = strTime;
        $scope.AttendancePolice.HalfDayEndTime = strTime;
        $scope.AttendancePolice.HalfDayLateInAfter = strTime;
        $scope.AttendancePolice.HalfDayEarlyOutBefore = strTime;
        
        //Date
        //var today = dd + '-' + mm + '-' + yyyy;
        //$scope.EventEntry.FromDate = today;
        //$("#fromDateTextBox").val(today);

        //$scope.EventEntry.ToDate = today;
        //$("#toDateTextBox").val(today);

        //$scope.EventEntry.EntryDate = today;
        //$("#EntryDate").val(today);

        //$scope.fromDateSrch = "01" + '-' + mm + '-' + yyyy;
        //$scope.toDateSrch = today;

    }
    function loadWeekHoliday() {
        var weekList = [
            { WeekDayName: "Saturday" },
            { WeekDayName: "Sunday" },
            { WeekDayName: "Monday" },
            { WeekDayName: "Tuesday" },
            { WeekDayName: "Wednesday" },
            { WeekDayName: "Thursday" },
            { WeekDayName: "Friday" },
        ];
        $scope.FirstWeeklyHolidayList = weekList;
        $scope.SecondWeeklyHolidayList = weekList;
        $scope.WeekHalfList = weekList;
    }
    $scope.resetForm = function () {
        Clear();
        $scope.attendancePolicyForm.$setPristine();
        $scope.attendancePolicyForm.$setUntouched();
    }

    $scope.ShowOrHideHalfDayLate = function () {
        if ($scope.AttendancePolice.IsHalfDay) {
            $scope.IsShowHalfDayLate = true;
        } else {
            $scope.IsShowHalfDayLate = false;
        }
    }   
});