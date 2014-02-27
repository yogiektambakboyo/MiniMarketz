'use strict';

var AngularAppRoute = angular.module('AngularAppRoute', [
    'ngRoute',
    'AngularAppController',
    'ngCookies',
    'ui.bootstrap',
    'ngTable'
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
            when('/addriwayatbekerja/:id_pegawai',{
                templateUrl: '/partials/riwayatbekerja/add.html',
                controller: 'AngularAddDataRiwayatBekerja'
            }).
            when('/addriwayatpendidikan/:id_pegawai',{
                templateUrl: '/partials/riwayatpendidikan/add.html',
                controller: 'AngularAddDataRiwayatPendidikan'
            }).
            when('/addriwayatkeluarga/:id_pegawai',{
                templateUrl: '/partials/riwayatkeluarga/add.html',
                controller: 'AngularAddDataRiwayatKeluarga'
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
            when('/viewprodusen',{
                templateUrl: '/partials/produsen/view.html',
                controller: 'AngularDataProdusen',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/editprodusen/:_id',{
                templateUrl: '/partials/produsen/edit.html',
                controller : 'AngularEditDataProdusen',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/addprodusen',{
                templateUrl: '/partials/produsen/add.html',
                controller: 'AngularAddDataProdusen',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/viewdistributor',{
                templateUrl: '/partials/distributor/view.html',
                controller: 'AngularDataDistributor',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/editdistributor/:_id',{
                templateUrl: '/partials/distributor/edit.html',
                controller : 'AngularEditDataDistributor',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/adddistributor',{
                templateUrl: '/partials/distributor/add.html',
                controller: 'AngularAddDataDistributor',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/viewsatuan',{
                templateUrl: '/partials/satuan/view.html',
                controller: 'AngularDataSatuan',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/editsatuan/:_id',{
                templateUrl: '/partials/satuan/edit.html',
                controller : 'AngularEditDataSatuan',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/addsatuan',{
                templateUrl: '/partials/satuan/add.html',
                controller: 'AngularAddDataSatuan',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/viewmatauang',{
                templateUrl: '/partials/matauang/view.html',
                controller: 'AngularDataMataUang',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/editmatauang/:_id',{
                templateUrl: '/partials/matauang/edit.html',
                controller : 'AngularEditDataMataUang',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/addmatauang',{
                templateUrl: '/partials/matauang/add.html',
                controller: 'AngularAddDataMataUang',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/viewtransaksipembelian',{
                templateUrl: '/partials/transaksipembelian/view.html',
                controller: 'AngularDataTransaksiPembelian',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/edittransaksipembelian/:_id',{
                templateUrl: '/partials/transaksipembelian/edit.html',
                controller : 'AngularEditDataTransaksiPembelian',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/addtransaksipembelian',{
                templateUrl: '/partials/transaksipembelian/add.html',
                controller: 'AngularAddDataTransaksiPembelian',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/viewtransaksipenjualan',{
                templateUrl: '/partials/transaksipenjualan/view.html',
                controller: 'AngularDataTransaksiPenjualan',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/edittransaksipenjualan/:_id',{
                templateUrl: '/partials/transaksipenjualan/edit.html',
                controller : 'AngularEditDataTransaksiPenjualan',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/detailtransaksipenjualan/:_id',{
                templateUrl: '/partials/transaksipenjualan/detail.html',
                controller : 'AngularDetailDataTransaksiPenjualan',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/addtransaksipenjualan',{
                templateUrl: '/partials/transaksipenjualan/add.html',
                controller: 'AngularAddDataTransaksiPenjualan',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/viewtransaksi',{
                templateUrl: '/partials/transaksi/view.html',
                controller: 'AngularDataTransaksi',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/edittransaksi/:_id',{
                templateUrl: '/partials/transaksi/edit.html',
                controller : 'AngularEditDataTransaksi',
                resolve: {
                    loggedin: checkLoggedin
                }
            }).
            when('/addtransaksi',{
                templateUrl: '/partials/transaksi/add.html',
                controller: 'AngularAddDataTransaksi',
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
