var AngularAppController = angular.module('AngularAppController',['ngResource']);

AngularAppController.factory('datapegawai',function($resource){
    return $resource('/api/datapegawai/:_id',{ _id : '@_id'})
});

AngularAppController.factory('datauser',function($resource){
    return $resource('/api/datauser/:_id',{ _id : '@_id'})
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


//==============================================
// Barang Section
//==============================================
AngularAppController.controller('AngularDataBarang', [ '$scope', '$resource', 'databarang', '$http', '$location', '$rootScope',
    function($scope, $resource ,databarang, $http, $location, $rootScope){
        var dataBarang = databarang;
        $scope.databarang = dataBarang.query();

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

AngularAppController.controller('AngularEditDataBarang', [ '$scope', '$resource', 'databarang', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $resource, databarang, $routeParams, $http, $location, $rootScope){
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

AngularAppController.controller('AngularAddDataBarang', [ '$scope' , '$location', '$http', '$rootScope',
    function($scope, $location, $http, $rootScope){


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
    function($scope, $resource, datapegawai, $http, $location, $rootScope){
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


        var socket = io.connect('http://localhost:3000');
        socket.on('news', function (data) {
            console.log(data);
            //socket.emit('my other event', { my: 'data' });
        });

        socket.on('databaru', function (data) {
            console.log(data);
            //socket.emit('my other event', { my: 'data' });
        });
    }


]);

AngularAppController.controller('AngularEditDataPegawai', [ '$scope', '$resource', 'datapegawai', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $resource, datapegawai, $routeParams, $http, $location, $rootScope){
        $scope.datapegawai = datapegawai.get({ _id : $routeParams._id });

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

    }
]);

//==========================================
// User Section
//==========================================
AngularAppController.controller('AngularDataUser', [ '$scope', '$resource', 'datauser', '$http', '$location', '$rootScope',
    function($scope, $resource, datauser , $http, $location, $rootScope){
        var dataUser = datauser;
        $scope.datauser = dataUser.query();

        $scope.delUser = function(data){
            $http.delete('/api/datauser/' + data._id  , {
                _id : data._id
            })
                .success(function(user){
                    $rootScope.message = 'Delete data "' + data._id + '" Succesful!';
                    $scope.datauser = dataUser.query();
                    //$location.url('/viewuser');
                })
                .error(function(){
                    $rootScope.message = 'Delete data "' + data._id + '" Failed!';
                });
        };

    }
]);

AngularAppController.controller('AngularAddDataUser', [ '$scope', '$location', '$http', '$rootScope',
    function($scope, $location, $http, $rootScope){
/*        var dataUser = datauser;
        $scope.datauser = new dataUser({});

        $scope.save = function (){
            $scope.datauser.$save(function (){
                $location.path("/viewuser");
            });
        }*/

        $scope.simpanUser = function(datauser){
            $http.post('/api/datauser' , {
                "datauser" : $scope.datauser
            })
                .success(function(datauser){
                    $rootScope.message = 'Add data "' + datauser._id + '" Succesful!';
                    $location.url('/viewuser');
                })
                .error(function(){
                    $rootScope.message = 'Add data "' + datauser._id + '" Failed!';
                });
        };

    }
]);

AngularAppController.controller('AngularEditDataUser', [ '$scope', '$resource', 'datauser', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $resource, datauser, $routeParams, $http, $location, $rootScope){
        $scope.datauser = datauser.get({ _id : $routeParams._id });

        $scope.updateUser = function(){
            $http.put('/api/datauser/' + $scope.datauser._id , {"datauser": $scope.datauser})
                .success(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datauser._id + '" Succesful!';
                    $location.path("/viewuser");
                })
                .error(function(response){
                    $rootScope.message = 'Edit data "' + $scope.datauser._id + '" Failed!';
                });
        };
    }
]);


//==========================================
// User Assingment Section
//==========================================
AngularAppController.controller('AngularDataUserAssingment', [ '$scope', '$resource','datauser','datarole', 'datauserassingment', '$http', '$location', '$rootScope',
    function($scope, $resource, datauser, datarole, datauserassingment , $http, $location, $rootScope){
        var dataUserAssingment = datauserassingment;
        $scope.datauserassingment = dataUserAssingment.query();

        $scope.datauser = datauser.query();
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

AngularAppController.controller('AngularAddDataUserAssingment', [ '$scope','$resource', 'datauser', 'datarole', '$location', '$http', '$rootScope',
    function($scope, $resource, datauser, datarole, $location, $http, $rootScope){

        var dataUser = datauser;
        $scope.datauser = dataUser.query();

        $scope.selectedDataUser = null;
        $scope.datauserassingment = {};

        $scope.selectActionUser = function(){
            $scope.datauserassingment.user_id = $scope.selectedDataUser;
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

AngularAppController.controller('AngularEditDataUserAssingment', [ '$scope', '$resource', 'datauserassingment','datauser', 'datarole', '$routeParams', '$http', '$location', '$rootScope',
    function($scope, $resource, datauserassingment, datauser, datarole, $routeParams, $http, $location, $rootScope){
        $scope.datauserassingment = datauserassingment.get({ _id : $routeParams._id });

        var dataUser = datauser;
        $scope.datauser = dataUser.query();

        $scope.selectedDataUser = null;

        $scope.selectActionUser = function(){
            $scope.datauserassingment.user_id = $scope.selectedDataUser;
        }

        console.log($scope.selectedDataUser);

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


