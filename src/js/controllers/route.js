angular.module('app').controller("RouteController",
         ["$scope", "Kong", "$location", "$routeParams","route", "services", "Alert", "$route","env",
 function ($scope, Kong, $location, $routeParams,route,services, Alert, $route,env)
{

    console.log(route);
    $scope.schema = env.schemas.route;
    var mode;
    if (route) {
        $scope.title = "Edit Route";
        $scope.action = "Save";
        mode = 'edit';
    } else {
        $scope.title = "Add Route";
        $scope.action = "Add";
        mode = 'create';
        
    }

    var servicesOptions = {};

    services.data.forEach(function(service) {
        servicesOptions[service.name] = service.id;
    });
    $scope.schema.properties.services.enum=servicesOptions;

    // $scope.$watch($scope.route.paths, function($r){
    //     console.log($r);
    // });
    $scope.route = route || {};
    console.log("=============================");
    console.log($scope);


    $scope.$watch("route.hosts",function(hosts){
       if((typeof hosts)=="string"){
            $scope.route.hosts=hosts.split(",");
       }
    })

    $scope.$watch("route.services",function(service){
        if((typeof hosts)=="string"){
            $scope.route.service.id=service;
        }
     })

    $scope.$watch("route.paths",function(paths){
        if((typeof paths)=="string"){
            $scope.route.paths=paths.split(",");
        }
     })

    $scope.save = function () {
        var route = angular.copy($scope.route);
        var data = $scope.route; 
        // console.log(data);
        // service={id:data.service};
        // data.service={id:data.services};
        // data.hosts= data.hosts.split(",");
        // delete data.services;
        // data.paths= data.paths.split(",");

        if($scope.route.id){
            var endpoint = '/routes/'+$scope.route.id;
          
            Kong.patch(endpoint, data).then(function (response) {
                Alert.success('Route saved!');
                $route.reload();
            }, function (response) {
                if (!response) {
                    // unexpected error message already displayed by Kong service.
                    return;
                }
                if (response.status == 400 || response.status == 409) {
                    $scope.errors = Kong.unflattenErrorResponse(response.data);
                } else {
                    Alert.error('Unexpected error from Kong');
                    console.log(response);
                }
            });
        }else{
          
            var endpoint = '/routes';  
            Kong.post(endpoint, data).then(function (response) {
                Alert.success('Route saved!');
                $route.reload();
            }, function (response) {
                if (!response) {
                    // unexpected error message already displayed by Kong service.
                    return;
                }
                if (response.status == 400 || response.status == 409) {
                    $scope.errors = Kong.unflattenErrorResponse(response.data);
                } else {
                    Alert.error('Unexpected error from Kong');
                    console.log(response);
                }
            });
        }
       
    };
}]);
