var BlocksApp = angular.module("BlocksApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize"
]); 

BlocksApp.config(['$ocLazyLoadProvider',  '$locationProvider', 
    function($ocLazyLoadProvider, $locationProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
    $locationProvider.html5Mode({
      enabled: true
    });
}]);


/* Setup global settings */
BlocksApp.factory('settings', ['$rootScope', '$http', function($rootScope, $http) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar menu state
            pageContentWhite: false, // set page content layout
            pageBodySolid: false, // solid body color state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        assetsPath: '/',
        globalPath: '/',
        layoutPath: '/',
    };

    $rootScope.settings = settings;
    return settings;
}]);

/* Setup App Main Controller */
BlocksApp.controller('MainController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        //App.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive.
***/

/* Setup Layout Part - Header */
BlocksApp.controller('HeaderController', ['$scope', '$location', '$state', function($scope, $location, $state) {
    $scope.$on('$includeContentLoaded', function() {
    });

    $scope.form = {};
    $scope.searchQuery = function(s) {
        var search = s.toLowerCase();

        $scope.form.searchInput="";
        $scope.form.searchForm.$setPristine();
        $scope.form.searchForm.$setUntouched();
        if (isAddress(search))
            $state.go('address', {hash: search});
        else if (isTransaction(search))
            $state.go('tx', {hash: search});
        else if (!isNaN(search))
            $state.go('block', {number: search});
            //$location.path("/block/" + search);
        else
            $scope.form.searchInput = search;

    }
}]);

/* Search Bar */
BlocksApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {        
        
    });
}]);

/* Setup Layout Part - Footer */
BlocksApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
    });
}]);

/* Setup Rounting For All Pages */
BlocksApp.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    // Redirect any unmatched url
    $urlRouterProvider.otherwise("home");

    $stateProvider

        // Dashboard
        .state('home', {
            url: "/home",
            templateUrl: "views/home.html",            
            data: {pageTitle: 'Blockchain Explorer'},
            controller: "HomeController"
        })

        .state('address', {
            url: "/addr/{hash}",
            templateUrl: "views/address.html",
            data: {pageTitle: 'Address'},
            controller: "AddressController"
        })

        .state('block', {
            url: "/block/{number}",
            templateUrl: "views/block.html",
            data: {pageTitle: 'Block'},
            controller: "BlockController"
        })

        .state('tx', {
            url: "/tx/{hash}",
            templateUrl: "views/tx.html",
            data: {pageTitle: 'Transaction'},
            controller: "TxController"
        })
        .state('broadcast', {
            url: "/broadcast",
            templateUrl: "views/broadcast.html",
            data: {pageTitle: 'Broadcast TX'},
            controller: "BroadcastController"
        })

        .state('err404', {
            url: "/err404/{thing}/{hash}",
            templateUrl: "views/err_404.html",
            data: {pageTitle: '404 Not Found.'},
            controller: "ErrController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'BlocksApp',
                        insertBefore: '#ng_load_plugins_before', 
                        files: [
                             '/js/controllers/ErrController.js'
                        ]
                    });
                }]
            }
        })
}]);

BlocksApp.filter('timeDuration', function() {
  return function(timestamp) {
    return getDuration(timestamp).toString();
  };
})
.filter('totalDifficulty', function() {
  return function(hashes) {
    return getDifficulty(hashes);
  };
}) 
.filter('teraHashes', function() {
    return function(hashes) {
        var result = hashes / Math.pow(1000, 4);
        return parseInt(result);
  }
})
.filter('fromWeiToEther', function() {
    return function(wei) {
        return etherUnits.toEther(wei, 'wei');
  }
})
.filter('bigNumberToString', function() {
    return function(number) {
        return number.toString(10);
  }
});

/* Init global settings and run the app */
BlocksApp.run(["$rootScope", "settings", "$state", function($rootScope, settings, $state) {
    $rootScope.$state = $state; // state to be accessed from view
    $rootScope.$settings = settings; // state to be accessed from view
}]);