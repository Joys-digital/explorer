angular
    .module('BlocksApp').controller('AddressController', function ($stateParams, $rootScope, $scope, $http, $location) {
    $scope.$on('$viewContentLoaded', function () {
        // initialize core components
    });
    var activeTab = $location.url().split('#');
    if (activeTab.length > 1)
        $scope.activeTab = activeTab[1];

    $rootScope.$state.current.data["pageSubTitle"] = $stateParams.hash;
    $scope.addrHash = $stateParams.hash;
    $scope.address = {balance: 0, transactions: [], txCount: 0};
    $scope.txLimit = 20;
    $scope.minedLimit = 20;
    $scope.mined = [];

    $http({
        method: 'GET',
        url: '/api/address/' + $scope.addrHash
    }).then(function (result) {
        var count = 0;
        result.data.transactions.forEach(function () {
            count++;
        });
        $scope.address.txCount = count;
        $scope.address.transactions = result.data.transactions;
        $scope.address.balance = result.data.balance;
    }, function (error) {


    });

    $http({
        method: 'GET',
        url: '/api/address/' + $scope.addrHash + '/mined'
    }).then(function (result) {
        $scope.mined = result.data;
    }, function (error) {

    });


    $scope.loadTxs = function (amount) {
        $scope.txLimit += amount;
    };

    $scope.loadMined = function (amount) {
        $scope.minedLimit += amount;
    };

    $scope.getMined = function () {
        var result = [];

        $scope.mined.forEach(function (block) {
            result.push(block);
        });

        //sort by blocknumber
        var sorted = result.sort(function (a, b) {
            return b.number - a.number;
        });
        return sorted.slice(0, $scope.minedLimit);
    };

    $scope.getTransactions = function () {
        var result = [];

        $scope.address.transactions.forEach(function (tx) {
            result.push(tx);
        });

        //sort by blocknumber
        var sorted = result.sort(function (a, b) {
            return b.blockNumber - a.blockNumber;
        });
        return sorted.slice(0, $scope.txLimit);

    }

});