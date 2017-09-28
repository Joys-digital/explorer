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


    $scope.loadTxs = function (amount) {
        if (amount == -1) {
            $scope.txLimit = -1;
        } else {
            $scope.txLimit += amount;
        }
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
        if ($scope.txLimit == -1) {
            return sorted.slice(0);
        }else {
            return sorted.slice(0, $scope.txLimit);
        }

    }

});