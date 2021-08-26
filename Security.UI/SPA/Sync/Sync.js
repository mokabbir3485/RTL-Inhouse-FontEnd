app.controller("SyncController", function ($scope, $cookieStore, $http, $window) {
    $scope.SyncIn = function () {
        if ($rootScope.online) {
            $.ajax({
                url: "",
                dataType: "json",
                contentType: "application/json;charset=utf-8",
                type: "POST",
                data: JSON.stringify({}),
                success: function (data) {
                    alertify.success("Sync In Successfuly!", 5000);
                },
                error: function (msg) {
                    alertify.error("Sync In Fail! Please try again.", 5000);
                }
            })
        }
        else {
            alertify.error("There is no internet connection.", 5000);
        }

    }
    $scope.SyncOut = function () {
        $.ajax({
            url: "",
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            type: "POST",
            data: JSON.stringify({}),
            success: function (data) {
                alertify.success("Sync Out Successfuly!", 5000);
            },
            error: function (msg) {
                alertify.error("Sync Out Fail! Please try again.", 5000);
            }
        })
    }
});
//app.run(function ($window, $rootScope) {
//    $rootScope.online = navigator.onLine;
//    $window.addEventListener("offline", function () {
//        $rootScope.$apply(function () {
//            $rootScope.online = false;
//        });
//    }, false);

//    $window.addEventListener("online", function () {
//        $rootScope.$apply(function () {
//            $rootScope.online = true;
//        });
//    }, false);
//});