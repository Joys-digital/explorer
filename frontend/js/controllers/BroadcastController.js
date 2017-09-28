angular
    .module('BlocksApp').controller('BroadcastController', function ($stateParams, $rootScope, $scope, $http, $location) {
    $scope.rawTx = null;

    $scope.sendRawTx = function () {
        if($scope.rawTx !== null) {

            $http({
                method: 'POST',
                url: '/api/broadcast',
                data: {rawTx: $scope.rawTx}
            }).then(function (result) {
                console.log(result);
                $scope.hash = result.data.hash;
                $scope.error = null;
            }, function (error) {
                console.log('error', error);
                $scope.error = error.status;
            });
        }
    };
});