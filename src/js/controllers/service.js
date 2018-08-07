angular.module('app').controller("ServiceController", ["$scope", "Kong", "$routeParams", "Alert", "api", "env", function ($scope, Kong, $routeParams, Alert, service, env)
{



    $scope.schema = env.schemas.service;
    $scope.errors = {};
    if ($routeParams.id) {
        $scope.service = service;
        $scope.title = "Edit SERVICE";
        $scope.action = "Save";
    } else {
        $scope.service = {};
        $scope.title = "Add an SERVICE";
        $scope.action = "Create";
    }
 
    $scope.save = function () {
        Kong.post('/services', $scope.service).then(function () {
            if ($routeParams.id) {
                Alert.success('Service updated');
            } else {
                Alert.success('Service created');
                // clearing inputs.
                $scope.api = {};
            }
            // clearing errors.
            $scope.errors = {};
        }, function (response) {
            if (response.status == 400 || response.status == 409) {
                $scope.errors = response.data;
            } else {
                Alert.error('Unexpected error from Kong');
                console.log(response);
            }
        });
    }
}]);
