angular.module('BlocksApp').controller('BlockController', function($stateParams, $rootScope, $scope, $http, $location) {
    $scope.$on('$viewContentLoaded', function() {   
        // initialize core components
        //TableAjax.init();
    });

    $rootScope.$state.current.data["pageSubTitle"] = $stateParams.number;
    $scope.blockNum = $stateParams.number;
    $scope.transactions = [];

    //fetch block
    $http({
      method: 'GET',
      url: '/api/block/' + $scope.blockNum
    }).success(function(data) {
      if (data.error)
        $location.path("/err404/block/" + $scope.blockNum);
      else {
        $scope.block = data;
        $scope.block.datetime = new Date(data.timestamp*1000); 
      }
    });

    //fetch transactions
    $http({
      method: 'GET',
      url: '/api/block/' + $scope.blockNum + '/transactions'
    }).success(function(res) {
      if (res.error)
        $location.path("/err404/block/" + $scope.blockNum);
      else {
          console.log(res);
        $scope.transactions = res;
      }
    });
});