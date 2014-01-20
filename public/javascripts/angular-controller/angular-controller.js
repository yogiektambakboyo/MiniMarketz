var AngularAppController = angular.module('AngularAppController',['ngResource']);

AngularAppController.factory('datapegawai',function($resource){
    return $resource('/api/datapegawai/:_id',{ _id : '@_id'})
});

AngularAppController.factory('databarang',function($resource){
    return $resource('/api/databarang/:_id',{ _id : '@_id'})
});

AngularAppController.factory('datauserassingment',function($resource){
    return $resource('/api/datauserassingment/:_id',{ _id : '@_id'})
});

AngularAppController.factory('datarole',function($resource){
    return $resource('/api/datarole/:_id',{ _id : '@_id'})
});

AngularAppController.factory('datarolemaxid',function($resource){
    return $resource('/api/datarole/getmaxid/')
});

AngularAppController.factory('datariwayatbekerja',function($resource){
    return $resource('/api/datariwayatbekerja/')
});

AngularAppController.factory('datapegawaipendidikan',function($resource){
    return $resource('/api/datapegawaipendidikan/')
});

AngularAppController.factory('datapegawaikeluarga',function($resource){
    return $resource('/api/datapegawaikeluarga/')
});

AngularAppController.factory('dataprodusen',function($resource){
    return $resource('/api/dataprodusen/:_id',{ _id : '@_id'})
});

AngularAppController.factory('datadistributor',function($resource){
    return $resource('/api/datadistributor/:_id',{ _id : '@_id'})
});

AngularAppController.factory('datasatuan',function($resource){
    return $resource('/api/datasatuan/:_id',{ _id : '@_id'})
});

AngularAppController.factory('datamatauang',function($resource){
    return $resource('/api/datamatauang/:_id',{ _id : '@_id'})
});


//==============================================
// Barang Section
//==============================================
AngularAppController.controller('AngularDataBarang', [ '$scope', '$resource', 'databarang','dataprodusen', 'datadistributor', 'datasatuan', 'datamatauang', '$http', '$location', '$rootScope',
    function($scope, $resource , databarang, dataprodusen, datadistributor, datasatuan, datamatauang, $http, $location, $rootScope){
        var dataBarang = databarang;
        $scope.databarang = dataBarang.query();

        var dataProdusen = dataprodusen;
        $scope.dataprodusen = dataProdusen.query();

        var dataDistributor = datadistributor;
        $scope.datadistributor = dataDistributor.query();

        var dataSatuan = datasatuan;
        $scope.datasatuan = dataSatuan.query();

        var dataMataUang = datamatauang;
        $scope.datamatauang = dataMataUang.query();


        $scope.delBarang = function(data){
            $http.delete('/api/databarang/' + data._id  , {
                _id : data._id
            })
                .success(function(barang){
                    $rootScope.message = 'Delete data "' + data._id + '" Succesful!';
                    $scope.databarang = dataBarang.query();
                    $location.url('/viewbarang');
                })
                .error(function(){
                    $rootScope.message = 'Delete data "' + data._id + '" Failed!';
                });
        };
    }
]);

AngularAppController.controller('AngularEditDataBarang', [ '$scope', '$resource', 'databarang','dataprodusen', 'datadistributor', 'datasatuan', 'datamatauang', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $resource, databarang, dataprodusen, datadistributor, datasatuan, datamatauang, $routeParams, $http, $location, $rootScope){
        $scope.databarang = databarang.get({ _id : $routeParams._id });

        $scope.updateBarang = function(){
            $http.put('/api/databarang/' + $scope.databarang._id , {"databarang": $scope.databarang})
                .success(function(response){
                    $rootScope.message = 'Edit data "' + $scope.databarang._id + '" Succesful!';
                    $location.path("/viewbarang");
                })
                .error(function(response){
                    $rootScope.message = 'Edit data "' + $scope.databarang._id + '" Failed!';
                });
        };
    }
]);

AngularAppController.controller('AngularAddDataBarang', [ '$scope' , '$location', '$http', '$rootScope', 'dataprodusen', 'datadistributor', 'datasatuan', 'datamatauang',
    function($scope, $location, $http, $rootScope, dataprodusen, datadistributor, datasatuan, datamatauang){

        var dataProdusen = dataprodusen;
        $scope.dataprodusen = dataProdusen.query();

        $scope.selectedDataProdusen = null;
        $scope.databarang = {};

        $scope.selectActionProdusen = function(){
            $scope.databarang.id_produsen = $scope.selectedDataProdusen;
        }

        var dataDistributor = datadistributor;
        $scope.datadistributor = dataDistributor.query();

        $scope.selectedDataDistributor = null;

        $scope.selectActionDistributor = function(){
            $scope.databarang.id_distributor = $scope.selectedDataDistributor;
        }

        var dataSatuan = datasatuan;
        $scope.datasatuan = dataSatuan.query();

        $scope.selectedDataSatuan = null;

        $scope.selectActionSatuan = function(){
            $scope.databarang.id_satuan = $scope.selectedDataSatuan;
        }

        var dataMataUang = datamatauang;
        $scope.datamatauang = dataMataUang.query();

        $scope.selectedDataMataUang = null;

        $scope.selectActionMataUang = function(){
            $scope.databarang.id_mata_uang = $scope.selectedDataMataUang;
        }


        $scope.simpanBarang = function(databarang){
            $http.post('/api/databarang' , {
                "databarang" : $scope.databarang
            })
                .success(function(databarang){
                    $rootScope.message = 'Add data "' + databarang._id + '" Succesful!';
                    $location.url('/viewbarang');
                })
                .error(function(){
                    $rootScope.message = 'Add data "' + databarang._id + '" Failed!';
                });
        };

    }
]);

//==============================================
// Pegawai Section
//==============================================

AngularAppController.controller('AngularDataPegawai', [ '$scope', '$resource', 'datapegawai', '$http', '$location', '$rootScope',
    function($scope, $resource, datapegawai, $http, $location, $rootScope ){
        var dataPegawai = datapegawai;
        $scope.datapegawai = dataPegawai.query();

        $scope.delPegawai = function(data){
            $http.delete('/api/datapegawai/' + data._id  , {
                _id : data._id
            })
                .success(function(user){
                    $rootScope.message = 'Delete data "' + data._id + '" Succesful!';
                    $scope.datapegawai = dataPegawai.query();
                    $location.url('/viewpegawai');
                })
                .error(function(){
                    $rootScope.message = 'Delete data "' + data._id + '" Failed!';
                });
        };


        //var socket = io.connect('http://localhost:3000');
        //socket.on('news', function (data) {
            //console.log(data);
            //socket.emit('my other event', { my: 'data' });
        //});

        //socket.on('databaru', function (data) {
            //console.log(data);
            //socket.emit('my other event', { my: 'data' });
        //});
    }


]);

AngularAppController.controller('AngularEditDataPegawai', [ '$scope', '$resource', 'datapegawai','datariwayatbekerja','datapegawaipendidikan','datapegawaikeluarga', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $resource, datapegawai, datariwayatbekerja, datapegawaipendidikan, datapegawaikeluarga, $routeParams, $http, $location, $rootScope){
        $scope.datapegawai = datapegawai.get({ _id : $routeParams._id });

        var dataRiwayatBekerja = datariwayatbekerja;
        $scope.datariwayatbekerja = dataRiwayatBekerja.query();

        var dataRiwayatPendidikan = datapegawaipendidikan;
        $scope.datapegawaipendidikan = dataRiwayatPendidikan.query();

        var dataRiwayatKeluarga = datapegawaikeluarga;
        $scope.datapegawaikeluarga = dataRiwayatKeluarga.query();

        $scope.updatePegawai = function(){
            $http.put('/api/datapegawai/' + $scope.datapegawai._id , {"datapegawai": $scope.datapegawai})
                .success(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datapegawai._id + '" Succesful!';
                    $location.path("/viewpegawai");
                })
                .error(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datapegawai._id + '" Failed!';
                });
        };

        $scope.delRiwayatBekerja = function(data){
            $http.delete('/api/datariwayatbekerja/' + data._id  , {
                _id : data._id
            })
                .success(function(user){
                    $rootScope.message = 'Delete data "' + data._id + '" Succesful!';
                    $scope.datariwayatbekerja = dataRiwayatBekerja.query();
                    //$location.url('/viewpegawai');
                })
                .error(function(){
                    $rootScope.message = 'Delete data "' + data._id + '" Failed!';
                });
        };

        $scope.delRiwayatPendidikan = function(data){
            $http.delete('/api/datapegawaipendidikan/' + data._id  , {
                _id : data._id
            })
                .success(function(user){
                    $rootScope.message = 'Delete data "' + data._id + '" Succesful!';
                    $scope.datapegawaipendidikan = dataRiwayatPendidikan.query();
                    //$location.url('/viewpegawai');
                })
                .error(function(){
                    $rootScope.message = 'Delete data "' + data._id + '" Failed!';
                });
        };

        $scope.delRiwayatKeluarga = function(data){
            $http.delete('/api/datapegawaikeluarga/' + data._id  , {
                _id : data._id
            })
                .success(function(user){
                    $rootScope.message = 'Delete data "' + data._id + '" Succesful!';
                    $scope.datapegawaikeluarga = dataRiwayatKeluarga.query();
                    //$location.url('/viewpegawai');
                })
                .error(function(){
                    $rootScope.message = 'Delete data "' + data._id + '" Failed!';
                });
        };

        //Test DatePicker
        $scope.today = function() {
            $scope.dt = new Date('yyyy-MM-dd');
        };

        $scope.today();

        $scope.showWeeks = true;
        $scope.toggleWeeks = function () {
            $scope.showWeeks = ! $scope.showWeeks;
        };

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
        /*        $scope.disabled = function(date, mode) {
         //return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
         return ( mode === '');
         };*/

        /*$scope.toggleMin = function() {
         $scope.minDate = ( $scope.minDate ) ? null : new Date();
         };*/
        //$scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };

        $scope.format = 'dd-MM-yyyy';
    }
]);

AngularAppController.controller('AngularAddDataPegawai', [ '$scope' , '$location', '$http', '$rootScope',
    function($scope, $location, $http, $rootScope){


        $scope.simpanPegawai = function(datapegawai){
            $http.post('/api/datapegawai' , {
                "datapegawai" : $scope.datapegawai
            })
                .success(function(datapegawai){
                    $rootScope.message = 'Add data "' + datapegawai._id + '" Succesful!';
                    $location.url('/viewpegawai');
                })
                .error(function(){
                    $rootScope.message = 'Add data "' + datapegawai._id + '" Failed!';
                });
        };

        //Test DatePicker
        $scope.today = function() {
            $scope.dt = new Date('yyyy-MM-dd');
        };

        $scope.today();

        $scope.showWeeks = true;
        $scope.toggleWeeks = function () {
            $scope.showWeeks = ! $scope.showWeeks;
        };

        $scope.clear = function () {
            $scope.dt = null;
        };

        // Disable weekend selection
/*        $scope.disabled = function(date, mode) {
            //return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            return ( mode === '');
        };*/

        /*$scope.toggleMin = function() {
            $scope.minDate = ( $scope.minDate ) ? null : new Date();
        };*/
        //$scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };

        $scope.format = 'dd-MM-yyyy';

    }
]);

AngularAppController.controller('AngularDisplayProfilDataPegawai', [ '$scope', '$resource', 'datapegawai','datariwayatbekerja','datapegawaipendidikan','datapegawaikeluarga', '$routeParams',
    function($scope, $resource, datapegawai, datariwayatbekerja, datapegawaipendidikan, datapegawaikeluarga, $routeParams){
        $scope.datapegawai = datapegawai.get({ _id : $routeParams._id });

        var dataRiwayatBekerja = datariwayatbekerja;
        $scope.datariwayatbekerja = dataRiwayatBekerja.query();

        var dataRiwayatPendidikan = datapegawaipendidikan;
        $scope.datapegawaipendidikan = dataRiwayatPendidikan.query();

        var dataRiwayatKeluarga = datapegawaikeluarga;
        $scope.datapegawaikeluarga = dataRiwayatKeluarga.query();

    }
]);

//==========================================
// User Assingment Section
//==========================================
AngularAppController.controller('AngularDataUserAssingment', [ '$scope', '$resource','datapegawai','datarole', 'datauserassingment', '$http', '$location', '$rootScope',
    function($scope, $resource, datapegawai, datarole, datauserassingment , $http, $location, $rootScope){
        var dataUserAssingment = datauserassingment;
        $scope.datauserassingment = dataUserAssingment.query();

        $scope.datapegawai = datapegawai.query();
        $scope.datarole = datarole.query();

        $scope.delUserAssingment = function(data){
            $http.delete('/api/datauserassingment/' + data._id  , {
                _id : data._id
            })
                .success(function(user){
                    $rootScope.message = 'Delete data "' + data._id + '" Succesful!';
                    $scope.datauserassingment = dataUserAssingment.query();
                    //$location.url('/viewuser');
                })
                .error(function(){
                    $rootScope.message = 'Delete data "' + data._id + '" Failed!';
                });
        };

    }
]);

AngularAppController.controller('AngularAddDataUserAssingment', [ '$scope','$resource', 'datapegawai', 'datarole', '$location', '$http', '$rootScope',
    function($scope, $resource, datapegawai, datarole, $location, $http, $rootScope){

        var dataPegawai = datapegawai;
        $scope.datapegawai = dataPegawai.query();

        $scope.selectedDataPegawai = null;
        $scope.datauserassingment = {};

        $scope.selectActionPegawai = function(){
            $scope.datauserassingment.pegawai_id = $scope.selectedDataPegawai;
        }

        var dataRole = datarole;
        $scope.datarole = dataRole.query();

        $scope.selectedDataRole = null;

        $scope.selectActionRole = function(){
            $scope.datauserassingment.role_id = $scope.selectedDataRole;
        }



        $scope.simpanUserAssingment = function(datauserassingment){
            $http.post('/api/datauserassingment' , {
                "datauserassingment" : $scope.datauserassingment
            })
                .success(function(datauserassingment){
                    $rootScope.message = 'Add data "' + datauserassingment._id + '" Succesful!';
                    $location.url('/viewuserassingment');
                })
                .error(function(){
                    $rootScope.message = 'Add data "' + datauserassingment._id + '" Failed!';
                });
        };

    }
]);

AngularAppController.controller('AngularEditDataUserAssingment', [ '$scope', '$resource', 'datauserassingment','datapegawai', 'datarole', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $resource, datauserassingment, datapegawai, datarole, $routeParams, $http, $location, $rootScope){
        $scope.datauserassingment = datauserassingment.get({ _id : $routeParams._id });

        var dataPegawai = datapegawai;
        $scope.datapegawai = dataPegawai.query();

        $scope.selectedDataPegawai = null;

        $scope.selectActionPegawai = function(){
            $scope.datauserassingment.pegawai_id = $scope.selectedDataPegawai;
        }


        var dataRole = datarole;
        $scope.datarole = dataRole.query();

        $scope.selectedDataRole = null;

        $scope.selectActionRole = function(){
            $scope.datauserassingment.role_id = $scope.selectedDataRole;
        }

        $scope.updateUserAssingment= function(){
            $http.put('/api/datauserassingment/' + $scope.datauserassingment._id , {"datauserassingment": $scope.datauserassingment})
                .success(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datauserassingment._id + '" Succesful!';
                    $location.path("/viewuserassingment");
                })
                .error(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datauserassingment._id + '" Failed!';
                });
        };
    }
]);

/**********************************************************************
 * Login controller
 **********************************************************************/
AngularAppController.controller('LoginCtrl', function($scope, $rootScope, $http, $location) {
    // This object will be filled by the form
    $scope.user = {};

    // Register the login() function
    $scope.login = function(){
        $http.post('/login', {
            username: $scope.user.username,
            password: $scope.user.password
        })
        .success(function(user){
                // No error: authentication OK
                $rootScope.message = 'Authentication successful!';
                $location.url('/admin');
        })
        .error(function(){
                // Error: authentication failed
                $rootScope.message = 'Authentication failed.';
                $location.url('/login');
        });
    };
});



/**********************************************************************
 * Admin controller
 **********************************************************************/
AngularAppController.controller('AdminCtrl', function($scope, $http) {
    // List of users got from the server

    // Fill the array to display it in the page
    $http.get('/loggedin').success(function(users){
        $scope.userLogin = users;
    });
});

//==========================================
// Roles Section
//==========================================
AngularAppController.controller('AngularDataRole', [ '$scope', '$resource', 'datarole', '$http', '$location', '$rootScope',
    function($scope, $resource, datarole , $http, $location, $rootScope){
        var dataRole = datarole;
        $scope.datarole = dataRole.query();

        $scope.delRole = function(data){
            $http.delete('/api/datarole/' + data._id  , {
                _id : data._id
            })
                .success(function(user){
                    $rootScope.message = 'Delete data "' + data._id + '" Succesful!';
                    $scope.datarole = dataRole.query();
                    //$location.url('/viewuser');
                })
                .error(function(){
                    $rootScope.message = 'Delete data "' + data._id + '" Failed!';
                });
        };

    }
]);

AngularAppController.controller('AngularAddDataRole', [ '$scope', '$location', '$http', '$rootScope',
    function($scope, $location, $http, $rootScope){
        $scope.datarole = {};
        // Make an AJAX call to check if the user is logged in
        $http.get('/api/datarole/getmaxid').success(function(maxid){
            $scope.datarole.id = maxid.id + 1;
        });


        $scope.simpanRole = function(datarole){
            $http.post('/api/datarole' , {
                "datarole" : $scope.datarole
            })
                .success(function(datarole){
                    $rootScope.message = 'Add data "' + datarole._id + '" Succesful!';
                    $location.url('/viewrole');
                })
                .error(function(){
                    $rootScope.message = 'Add data "' + datarole._id + '" Failed!';
                });
        };

    }
]);

AngularAppController.controller('AngularEditDataRole', [ '$scope', '$resource', 'datarole', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $resource, datarole, $routeParams, $http, $location, $rootScope){
        $scope.datarole = datarole.get({ _id : $routeParams._id });

        $scope.updateRole = function(){
            $http.put('/api/datarole/' + $scope.datarole._id , {"datarole": $scope.datarole})
                .success(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datarole._id + '" Succesful!';
                    $location.path("/viewrole");
                })
                .error(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datarole._id + '" Failed!';
                });
        };
    }
]);


//=================================================================================
// Riwayat Bakerja
//=================================================================================
AngularAppController.controller('AngularAddDataRiwayatBekerja', [ '$scope' , '$location', '$http', '$rootScope', '$routeParams',
    function($scope, $location, $http, $rootScope, $routeParams){

        $scope.simpanRiwayatBekerja = function(datariwayatbekerja){
            $scope.datariwayatbekerja.id_pegawai = $routeParams.id_pegawai;
            $http.post('/api/datariwayatbekerja' , {
                "datariwayatbekerja" : $scope.datariwayatbekerja
            })
                .success(function(datariwayatbekerja){
                    $rootScope.message = 'Add data "' + datariwayatbekerja._id + '" Succesful!';
                    $location.url('/editpegawai/' + $routeParams.id_pegawai);
                })
                .error(function(){
                    $rootScope.message = 'Add data "' + datariwayatbekerja._id + '" Failed!';
                });
        };

        //Test DatePicker
        $scope.today = function() {
            $scope.dt = new Date('yyyy-MM-dd');
        };

        $scope.today();

        $scope.showWeeks = true;
        $scope.toggleWeeks = function () {
            $scope.showWeeks = ! $scope.showWeeks;
        };

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };

        $scope.format = 'dd-MM-yyyy';

    }
]);

//=================================================================================
// Riwayat Pendidikan
//=================================================================================
AngularAppController.controller('AngularAddDataRiwayatPendidikan', [ '$scope' , '$location', '$http', '$rootScope', '$routeParams',
    function($scope, $location, $http, $rootScope, $routeParams){

        $scope.simpanRiwayatPendidikan = function(datapegawaipendidikan){
            $scope.datapegawaipendidikan.id_pegawai = $routeParams.id_pegawai;
            $http.post('/api/datapegawaipendidikan' , {
                "datapegawaipendidikan" : $scope.datapegawaipendidikan
            })
                .success(function(datapegawaipendidikan){
                    $rootScope.message = 'Add data "' + datapegawaipendidikan._id + '" Succesful!';
                    $location.url('/editpegawai/' + $routeParams.id_pegawai);
                })
                .error(function(){
                    $rootScope.message = 'Add data "' + datapegawaipendidikan._id + '" Failed!';
                });
        };

    }
]);

//=================================================================================
// Riwayat Keluarga
//=================================================================================
AngularAppController.controller('AngularAddDataRiwayatKeluarga', [ '$scope' , '$location', '$http', '$rootScope', '$routeParams',
    function($scope, $location, $http, $rootScope, $routeParams){



        $scope.simpanRiwayatKeluarga = function(datapegawaikeluarga){
            $scope.datapegawaikeluarga.id_pegawai = $routeParams.id_pegawai;
            $http.post('/api/datapegawaikeluarga' , {
                "datapegawaikeluarga" : $scope.datapegawaikeluarga
            })
                .success(function(datapegawaikeluarga){
                    $rootScope.message = 'Add data "' + datapegawaikeluarga._id + '" Succesful!';
                    $location.url('/editpegawai/' + $routeParams.id_pegawai);
                })
                .error(function(){
                    $rootScope.message = 'Add data "' + datapegawaikeluarga._id + '" Failed!';
                });
        };

        //Test DatePicker
        $scope.today = function() {
            $scope.dt = new Date('yyyy-MM-dd');
        };

        $scope.today();

        $scope.showWeeks = true;
        $scope.toggleWeeks = function () {
            $scope.showWeeks = ! $scope.showWeeks;
        };

        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };

        $scope.format = 'dd-MM-yyyy';

    }
]);

//==============================================
// Produsen Section
//==============================================
AngularAppController.controller('AngularDataProdusen', [ '$scope', '$resource', 'dataprodusen', '$http', '$location', '$rootScope',
    function($scope, $resource ,dataprodusen, $http, $location, $rootScope){
        var dataProdusen = dataprodusen;
        $scope.dataprodusen = dataProdusen.query();

        $scope.delProdusen = function(data){
            $http.delete('/api/dataprodusen/' + data._id  , {
                _id : data._id
            })
                .success(function(produsen){
                    $rootScope.message = 'Delete data "' + data._id + '" Succesful!';
                    $scope.dataprodusen = dataProdusen.query();
                    $location.url('/viewprodusen');
                })
                .error(function(){
                    $rootScope.message = 'Delete data "' + data._id + '" Failed!';
                });
        };
    }
]);

AngularAppController.controller('AngularEditDataProdusen', [ '$scope', '$resource', 'dataprodusen', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $resource, dataprodusen, $routeParams, $http, $location, $rootScope){
        $scope.dataprodusen = dataprodusen.get({ _id : $routeParams._id });

        $scope.updateProdusen = function(){
            $http.put('/api/dataprodusen/' + $scope.dataprodusen._id , {"dataprodusen": $scope.dataprodusen})
                .success(function(response){
                    $rootScope.message = 'Edit data "' + $scope.dataprodusen._id + '" Succesful!';
                    $location.path("/viewprodusen");
                })
                .error(function(response){
                    $rootScope.message = 'Edit data "' + $scope.dataprodusen._id + '" Failed!';
                });
        };
    }
]);

AngularAppController.controller('AngularAddDataProdusen', [ '$scope' , '$location', '$http', '$rootScope',
    function($scope, $location, $http, $rootScope){


        $scope.simpanProdusen = function(dataprodusen){
            $http.post('/api/dataprodusen' , {
                "dataprodusen" : $scope.dataprodusen
            })
                .success(function(dataprodusen){
                    $rootScope.message = 'Add data "' + dataprodusen._id + '" Succesful!';
                    $location.url('/viewprodusen');
                })
                .error(function(){
                    $rootScope.message = 'Add data "' + dataprodusen._id + '" Failed!';
                });
        };

    }
]);

//==============================================
// Distributor Section
//==============================================
AngularAppController.controller('AngularDataDistributor', [ '$scope', '$resource', 'datadistributor', '$http', '$location', '$rootScope',
    function($scope, $resource ,datadistributor, $http, $location, $rootScope){
        var dataDistributor = datadistributor;
        $scope.datadistributor = dataDistributor.query();

        $scope.delDistributor = function(data){
            $http.delete('/api/datadistributor/' + data._id  , {
                _id : data._id
            })
                .success(function(distributor){
                    $rootScope.message = 'Delete data "' + data._id + '" Succesful!';
                    $scope.datadistributor = dataDistributor.query();
                    $location.url('/viewdistributor');
                })
                .error(function(){
                    $rootScope.message = 'Delete data "' + data._id + '" Failed!';
                });
        };
    }
]);

AngularAppController.controller('AngularEditDataDistributor', [ '$scope', '$resource', 'datadistributor', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $resource, datadistributor, $routeParams, $http, $location, $rootScope){
        $scope.datadistributor = datadistributor.get({ _id : $routeParams._id });

        $scope.updateDistributor = function(){
            $http.put('/api/datadistributor/' + $scope.datadistributor._id , {"datadistributor": $scope.datadistributor})
                .success(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datadistributor._id + '" Succesful!';
                    $location.path("/viewdistributor");
                })
                .error(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datadistributor._id + '" Failed!';
                });
        };
    }
]);

AngularAppController.controller('AngularAddDataDistributor', [ '$scope' , '$location', '$http', '$rootScope',
    function($scope, $location, $http, $rootScope){


        $scope.simpanDistributor = function(datadistributor){
            $http.post('/api/datadistributor' , {
                "datadistributor" : $scope.datadistributor
            })
                .success(function(datadistributor){
                    $rootScope.message = 'Add data "' + datadistributor._id + '" Succesful!';
                    $location.url('/viewdistributor');
                })
                .error(function(){
                    $rootScope.message = 'Add data "' + datadistributor._id + '" Failed!';
                });
        };

    }
]);


//==============================================
// Satuan Section
//==============================================
AngularAppController.controller('AngularDataSatuan', [ '$scope', '$resource', 'datasatuan', '$http', '$location', '$rootScope',
    function($scope, $resource ,datasatuan, $http, $location, $rootScope){
        var dataSatuan = datasatuan;
        $scope.datasatuan = dataSatuan.query();

        $scope.delSatuan = function(data){
            $http.delete('/api/datasatuan/' + data._id  , {
                _id : data._id
            })
                .success(function(satuan){
                    $rootScope.message = 'Delete data "' + data._id + '" Succesful!';
                    $scope.datasatuan = dataSatuan.query();
                    $location.url('/viewsatuan');
                })
                .error(function(){
                    $rootScope.message = 'Delete data "' + data._id + '" Failed!';
                });
        };
    }
]);

AngularAppController.controller('AngularEditDataSatuan', [ '$scope', '$resource', 'datasatuan', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $resource, datasatuan, $routeParams, $http, $location, $rootScope){
        $scope.datasatuan = datasatuan.get({ _id : $routeParams._id });

        $scope.updateSatuan = function(){
            $http.put('/api/datasatuan/' + $scope.datasatuan._id , {"datasatuan": $scope.datasatuan})
                .success(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datasatuan._id + '" Succesful!';
                    $location.path("/viewsatuan");
                })
                .error(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datasatuan._id + '" Failed!';
                });
        };
    }
]);

AngularAppController.controller('AngularAddDataSatuan', [ '$scope' , '$location', '$http', '$rootScope',
    function($scope, $location, $http, $rootScope){


        $scope.simpanSatuan = function(datasatuan){
            $http.post('/api/datasatuan' , {
                "datasatuan" : $scope.datasatuan
            })
                .success(function(datasatuan){
                    $rootScope.message = 'Add data "' + datasatuan._id + '" Succesful!';
                    $location.url('/viewsatuan');
                })
                .error(function(){
                    $rootScope.message = 'Add data "' + datasatuan._id + '" Failed!';
                });
        };

    }
]);

//==============================================
// MataUang Section
//==============================================
AngularAppController.controller('AngularDataMataUang', [ '$scope', '$resource', 'datamatauang', '$http', '$location', '$rootScope',
    function($scope, $resource ,datamatauang, $http, $location, $rootScope){
        var dataMataUang = datamatauang;
        $scope.datamatauang = dataMataUang.query();

        $scope.delMataUang = function(data){
            $http.delete('/api/datamatauang/' + data._id  , {
                _id : data._id
            })
                .success(function(matauang){
                    $rootScope.message = 'Delete data "' + data._id + '" Succesful!';
                    $scope.datamatauang = dataMataUang.query();
                    $location.url('/viewmatauang');
                })
                .error(function(){
                    $rootScope.message = 'Delete data "' + data._id + '" Failed!';
                });
        };
    }
]);

AngularAppController.controller('AngularEditDataMataUang', [ '$scope', '$resource', 'datamatauang', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $resource, datamatauang, $routeParams, $http, $location, $rootScope){
        $scope.datamatauang = datamatauang.get({ _id : $routeParams._id });

        $scope.updateMataUang = function(){
            $http.put('/api/datamatauang/' + $scope.datamatauang._id , {"datamatauang": $scope.datamatauang})
                .success(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datamatauang._id + '" Succesful!';
                    $location.path("/viewmatauang");
                })
                .error(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datamatauang._id + '" Failed!';
                });
        };
    }
]);

AngularAppController.controller('AngularAddDataMataUang', [ '$scope' , '$location', '$http', '$rootScope',
    function($scope, $location, $http, $rootScope){


        $scope.simpanMataUang = function(datamatauang){
            $http.post('/api/datamatauang' , {
                "datamatauang" : $scope.datamatauang
            })
                .success(function(datamatauang){
                    $rootScope.message = 'Add data "' + datamatauang._id + '" Succesful!';
                    $location.url('/viewmatauang');
                })
                .error(function(){
                    $rootScope.message = 'Add data "' + datamatauang._id + '" Failed!';
                });
        };

    }
]);
