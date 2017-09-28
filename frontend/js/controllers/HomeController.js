angular.module('BlocksApp')
    .controller('HomeController', function ($rootScope, $scope, $http, $interval) {
        $scope.$on('$viewContentLoaded', function () {
            // initialize core components
        });

        $rootScope.isHome = true;

        $scope.reloadBlocks = function () {
            $scope.blockLoading = true;
            $http({
                method: 'GET',
                url: 'api/blocks/latest',
            }).success(function (data) {
                $scope.blockLoading = false;
                $scope.latest_blocks = data;
                console.log($scope.latest_blocks)
            });
        };


        $scope.reloadTransactions = function () {
            $scope.txLoading = true;
            $http({
                method: 'GET',
                url: 'api/txs/latest'
            }).success(function (data) {
                $scope.latest_txs = data;
                $scope.txLoading = false;
            });
        };

        $scope.reloadBlocks();
        $scope.reloadTransactions();

        $interval(function () {
            $scope.reloadBlocks();
            $scope.reloadTransactions();
        }, 5000);

        $scope.txLoading = false;
        $scope.blockLoading = false;
    })

    .directive('summaryStats', function ($http) {
        return {
            restrict: 'E',
            templateUrl: '/views/summary-stats.html',
            scope: true,
            link: function (scope, elem, attrs) {
                scope.stats = {
                    price: 0,
                    hashrate: 0,
                    hashrateChange24hr: 0,
                    difficulty: 0,
                    difficulty24hrChange: 0,
                    blocktime: 0,
                    blocktime24hrChange: 0
                };

                $http.get('api/stats')
                    .then(function (res) {
                        if (res.data.price != null) {
                            scope.stats.price = res.data.price;
                        }
                        if (res.data.hashrate != null) {
                            scope.stats.hashrate = res.data.hashrate;
                        }
                        if (res.data.hashrate24hr != null && scope.stats.hashrate != null) {
                            scope.stats.hashrateChange24hr = Math.round((100 - res.data.hashrate24hr / scope.stats.hashrate * 100) * 100) / 100;
                        }
                        if (res.data.difficulty != null) {
                            scope.stats.difficulty = res.data.difficulty;
                        }
                        if (res.data.difficulty24hr != null && scope.stats.difficulty != null) {
                            scope.stats.difficulty24hrChange = Math.round((100 - res.data.difficulty24hr / scope.stats.difficulty * 100) * 100) / 100;
                        }
                        if (res.data.blocktime != null) {
                            scope.stats.blocktime = Math.round(res.data.blocktime * 100) / 100;
                        }
                        if (res.data.blocktime != null && res.data.blocktime24hr != null) {
                            scope.stats.blocktime24hrChange = Math.round((100 - res.data.blocktime / res.data.blocktime24hr * 100) * 100) / 100;
                        }
                    });
            }
        }
    });

