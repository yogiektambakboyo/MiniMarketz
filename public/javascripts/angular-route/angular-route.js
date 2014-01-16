'use strict';

var AngularAppRoute = angular.module('AngularAppRoute', [
    'ngRoute',
    'AngularAppController',
    'ngCookies',
    'ui.bootstrap'
]);


AngularAppRoute.config(
    ['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {
        //================================================
        // Check if the user is connected
        //================================================
        var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user){
                // Authenticated
                if (user !== '0')
                    $timeout(deferred.resolve, 0);

                // Not Authenticated
                else {
                    $rootScope.message = 'You need to log in.';
                    $timeout(function(){deferred.reject();}, 0);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };

        //================================================
        // Add an interceptor for AJAX errors
        //================================================
        $httpProvider.responseInterceptors.push(function($q, $location) {
            return function(promise) {
                return promise.then(
                    // Success: just return the response
                    function(response){
                        return response;
                    },
                    // Error: check the error status to get only the 401
                    function(response) {
                        if (response.status === 401)
                            $location.url('/unauthorizhed');
                        return $q.reject(response);
                    }
                );
            }
        });
        //================================================

        $routeProvider.
            when('/home',{
                templateUrl:'/partials/home.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/editpegawai/:_id',{
                templateUrl: '/partials/pegawai/edit.html',
                controller : 'AngularEditDataPegawai',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/addpegawai',{
                templateUrl: '/partials/pegawai/add.html',
                controller: 'AngularAddDataPegawai',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/viewpegawai',{
                templateUrl: '/partials/pegawai/view.html',
                controller: 'AngularDataPegawai',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/profil/:_id',{
                templateUrl: '/partials/profil.html',
                controller : 'AngularDisplayProfilDataPegawai',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/login',{
                templateUrl: '/partials/login.html',
                controller: 'LoginCtrl'
            }).
            when('/admin', {
                templateUrl: '/partials/home.html',
                controller : 'AdminCtrl',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/viewbarang',{
                templateUrl: '/partials/barang/view.html',
                controller: 'AngularDataBarang',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/editbarang/:_id',{
                templateUrl: '/partials/barang/edit.html',
                controller : 'AngularEditDataBarang',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/addbarang',{
                templateUrl: '/partials/barang/add.html',
                controller: 'AngularAddDataBarang',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/error',{
                templateUrl: '/partials/404.html'
            }).
            when('/viewuserassingment',{
                templateUrl: '/partials/userassingment/view.html',
                controller: 'AngularDataUserAssingment',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/adduserassingment',{
                templateUrl: '/partials/userassingment/add.html',
                controller: 'AngularAddDataUserAssingment',
                resolve: {
                 loggedin: checkLoggedin
                 }
            }).
            when('/edituserassingment/:_id',{
                templateUrl: '/partials/userassingment/edit.html',
                controller: 'AngularEditDataUserAssingment',
                resolve: {
                 loggedin: checkLoggedin
                 }
            }).
            when('/viewrole',{
                templateUrl: '/partials/role/view.html',
                controller: 'AngularDataRole',
                resolve: {
                 loggedin: checkLoggedin
                 }
            }).
            when('/addrole',{
                templateUrl: '/partials/role/add.html',
                controller: 'AngularAddDataRole',
                resolve: {
                 loggedin: checkLoggedin
                 }
            }).
            when('/editrole/:_id',{
                templateUrl: '/partials/role/edit.html',
                controller: 'AngularEditDataRole',
                resolve: {
                 loggedin: checkLoggedin
                 }
            }).
            when('/unauthorizhed',{
                templateUrl:'/partials/unauthorizhed.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            otherwise({
                redirectTo: '/home'
            });
    }
    ]
);

AngularAppRoute.run(function($rootScope, $http){
    $rootScope.message = '';

    // Logout function is available in any pages
    $rootScope.logout = function(){
        $rootScope.message = 'Logged out.';
        $http.post('/logout');
    };
});
