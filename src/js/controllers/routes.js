angular.module('app').controller("RoutesController",
     ["$scope", "Kong", "$route", "$location", "$routeParams", "owner", "Alert",
         function ($scope, Kong, $route, $location, $routeParams, $owner, Alert) {
    if ($routeParams.service_id) {
        $scope.owner_type = 'Service';
    } else {
        $scope.owner_type = null;
    }
    $scope.owner = $owner;
    $scope.routes = [];
    $scope.total = null;
    $scope.offset = null;
    $scope.location = $location;
    var loaded_pages = [];
    $scope.loadMore = function() {
        var page;
        if ($scope.owner_type == 'Service') {
            page = '/routes?service_id=' + $scope.owner.id + '&';
        }else {
            page = '/routes?';
        }
        if ($scope.offset) {
            page += 'offset=' + $scope.offset + '&';
        }
        if (loaded_pages.indexOf(page) !== -1) {
            return;
        }
        loaded_pages.push(page);

        Kong.get(page).then(function(collection) {
            if ($scope.total === null) {
                $scope.total = 0;
            }
            $scope.routes.push.apply($scope.routes, collection.data);
            $scope.total += collection.total;
            $scope.offset = collection.offset ? collection.offset : null;
            angular.forEach($scope.routes, function(route) {

                if (route.service.id) {
                    Kong.get('/services/' + route.service.id).then(function(service) {
                        route.service_name = service.name;
                        route.service_id = service.id;
                    });
                }
            });
        });
    };
    $scope.loadMore();

    $scope.showDeleteModal = function (name, id) {
        $scope.current = {name: name, id: id};
        $('#deleteRoute').modal('open');
    };
    $scope.abortDelete = function () {
        $('#deleteRoute').modal('close');
    };
    $scope.performDelete = function () {
        $('#deleteRoute').modal('close');
        Kong.delete('/routes/' + $scope.current.id).then(function () {
            $scope.total -= 1;
            $scope.plugins.forEach(function(element, index) {
                if (element.id === $scope.current.id) {
                    $scope.plugins.splice(index, 1);
                }
            });
        });
    };

    $scope.updatePluginStatus = function(id, status) {
        Kong.patch('/routes/' + id, {
            enabled: status
        }).then(function () {
            if (status) {
                Alert.success('Plugin enabled');
            } else {
                Alert.success('Plugin disabled');
            }
        }, function(response) {
            Alert.error('Sorry, we got confused. Please refresh the page.');
        });
    }
}]);
