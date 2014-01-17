
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);
//var io = require('socket.io').listen(server);

//==================================================================
// MongoDB Setting
//==================================================================

var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
var db;
//var uri = 'mongodb://192.168.16.13:27017/angularapp';
var uri = 'mongodb://yogiaditya:angularappdb@ds061518.mongolab.com:61518/angularapp';


db = mongoose.createConnection(uri);

var dataBarangSchema = require('./model/DataSchema.js').dataBarangSchema;
var dataBarang = db.model('databarang', dataBarangSchema);

var dataPegawaiSchema = require('./model/DataSchema.js').dataPegawaiSchema;
var dataPegawai = db.model('datapegawai', dataPegawaiSchema);

var dataUserAssingmentSchema = require('./model/DataSchema.js').datausersassingment;
var dataUserAssingment = db.model('datausersassingment', dataUserAssingmentSchema);

var dataRolesSchema = require('./model/DataSchema.js').dataRoles;
var dataRoles = db.model('datarole', dataRolesSchema);

var dataRiwayatBekerjaSchema = require('./model/DataSchema.js').datariwayatkerja;
var dataRiwayatBekerja = db.model('datariwayatbekerja', dataRiwayatBekerjaSchema);

var dataPegawaiPendidikanSchema = require('./model/DataSchema.js').datapegawaipendidikan;
var dataPegawaiPendidikan = db.model('datapegawaipendidikan', dataPegawaiPendidikanSchema);

var dataPegawaiKeluargaSchema = require('./model/DataSchema.js').datapegawaikeluarga;
var dataPegawaiKeluarga = db.model('datapegawaikeluarga', dataPegawaiKeluargaSchema);

function customHeaders( req, res, next ){
    // Switch off the default 'X-Powered-By: Express' header
    app.disable( 'x-powered-by' );
    res.setHeader( 'X-Powered-By', 'Mini Marketz V0.1' );
    next()
}

app.use(customHeaders);

//=============================================
//=============================================
dataPegawaiSchema.pre('save', function(next){
    var user = this;

    if(!user.isModified('password'))
        return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash){
            if (err) return next(err);

            user.password = hash;
            user.oldpassword = hash;
            next();
        });
    });
});

var checkChangePassword = function(currentpassword, newpassword){
    var hasho = currentpassword;
    var pass;
    var isMatch = bcrypt.compareSync(newpassword, hasho);
    if((!isMatch)&&(currentpassword != newpassword)){
        pass = bcrypt.hashSync(newpassword, SALT_WORK_FACTOR);
        return pass;
    }else{
        return currentpassword;
    }
};


//=============================================
//=============================================




//==================================================================
// Define the strategy to be used by PassportJS
//==================================================================

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


/*passport.use(new LocalStrategy(
    function(username, password, done) {
        dataPegawai.findOne({ username : username, password : password }, function (err,user){
            if(err){
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            return done(null, user);
        });

    }
));*/

passport.use(new LocalStrategy(
    function(username, password, done) {
        dataPegawai.findOne({ username : username }, function (err,user){
            if(err){
                return done(err);
            }

            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            user.comparePassword(password, function(err, isMatch) {
                console.log(password, isMatch);
                if(isMatch){
                    return done(null, user);
                }else{
                    return done(err);
                }
            });
        });

    }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

/*passport.deserializeUser(function(id, done) {
    done(null, user);
    dataUser.findById(id, function(err, user){
        done(err,user);
    });
});*/

// Define a middleware function to be used for every secured routes
var auth = function(req, res, next){
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};


// Mongo Store
//var MongoStore = require('connect-mongo')(express);

//==================================================================
//==================================================================



// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.bodyParser());
app.use(express.urlencoded());
app.use(express.methodOverride());


app.use(express.cookieParser());
app.use(express.session({
    cookie: { maxAge: new Date(Date.now() + 3600000) },
    secret: 'secretMe',
    maxAge: new Date(Date.now() + 3600000)
    //store : new MongoStore({url : 'mongodb://admin:AdminN33dYou@192.168.17.2/test/appSession',
    /*store : new MongoStore({url : 'mongodb://localhost/sampledb/appSession',
        clear_interval: 120})*/
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


//==============================================================
// Design Roles
//==============================================================



//==============================================================

// Handle Errors gracefully
app.use(function(err, req, res, next) {
    if(!err) return next();
    console.log(err.stack);
    res.json({error: true});
});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//=============================================
// Api Route
//=============================================

module.exports.findAllPegawai = function(req,res, next){
    dataPegawai
        .find()
        .sort({'nama' : 1})
        .exec(function (err, datapegawai){
            if (err) return next(err);
            res.send(datapegawai);
        });
};

module.exports.findOnePegawai = function(req, res, next){
    dataPegawai
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdatapegawai){
            if(err) return next(err);
            res.send(editdatapegawai);
        });
};


module.exports.savePegawai = function(req, res, next){
    var datapegawai = new dataPegawai({
        nama : req.body.datapegawai.nama,
        username :req.body.datapegawai.username,
        password : req.body.datapegawai.password,
        oldpassword : req.body.datapegawai.password,
        ttl : {
            tempat : req.body.datapegawai.ttl.tempat,
            tanggal : req.body.datapegawai.ttl.tanggal
        },
        jenis_kelamin : req.body.datapegawai.jenis_kelamin,
        agama : req.body.datapegawai.agama,
        tanggal_masuk : req.body.datapegawai.tanggal_masuk,
        status : req.body.datapegawai.status,
        negara : req.body.datapegawai.negara,
        alamat :{
            kelurahan : req.body.datapegawai.alamat.kelurahan,
            kecamatan : req.body.datapegawai.alamat.kecamatan,
            kota : req.body.datapegawai.alamat.kota,
            provinsi : req.body.datapegawai.alamat.provinsi,
            kodepos : req.body.datapegawai.alamat.kodepos
        },
        telepon : {
            rumah : req.body.datapegawai.rumah,
            handphone : req.body.datapegawai.handphone
        },
        email : req.body.datapegawai.email
        //image_path : req.body.datapegawai.image_path

    });

    datapegawai.save( function(err, datapegawai){
        if (err) return next(err);
        res.send(datapegawai);
    });
};

module.exports.editPegawai = function(req, res){
    var isSame = checkChangePassword(req.body.datapegawai.oldpassword , req.body.datapegawai.password);
    dataPegawai.update(
        { _id : req.body.datapegawai._id},
        {
            nama : req.body.datapegawai.nama,
            username :req.body.datapegawai.username,
            password : isSame ,
            oldpassword: isSame,
            ttl : {
                tempat : req.body.datapegawai.ttl.tempat,
                tanggal : req.body.datapegawai.ttl.tanggal
            },
            jenis_kelamin : req.body.datapegawai.jenis_kelamin,
            agama : req.body.datapegawai.agama,
            tanggal_masuk : req.body.datapegawai.tanggal_masuk,
            status : req.body.datapegawai.status,
            negara : req.body.datapegawai.negara,
            alamat :{
                kelurahan : req.body.datapegawai.alamat.kelurahan,
                kecamatan : req.body.datapegawai.alamat.kecamatan,
                kota : req.body.datapegawai.alamat.kota,
                provinsi : req.body.datapegawai.alamat.provinsi,
                kodepos : req.body.datapegawai.alamat.kodepos
            },
            telepon : {
                rumah : req.body.datapegawai.telepon.rumah,
                handphone : req.body.datapegawai.telepon.handphone
            },
            email : req.body.datapegawai.email
            //image_path : req.body.datapegawai.image_path
        },
        function(err){
            if(err){
                res.send(err);
            }else{
                res.send('OK, Updated');
            }

        }
    );
};


module.exports.deletePegawai = function(req, res) {
    dataPegawai
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted');
            }

        });
};

//=======================================
// Barang
//=======================================

module.exports.findAllBarang = function(req,res, next){
    dataBarang
        .find()
        .sort({'nama' : 1})
        .exec(function (err, databarang){
            if (err) return next(err);
            res.send(databarang);
        });
};

module.exports.findOneBarang = function(req, res, next){
    dataBarang
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdatabarang){
            if(err) return next(err);
            res.send(editdatabarang);
        });
};

module.exports.saveBarang = function(req, res, next){
    var databarang = new dataBarang({
        nama : req.body.databarang.nama,
        stock : req.body.databarang.stock,
        harga : req.body.databarang.harga
    });

    databarang.save( function(err, databarang){
        if (err) return next(err);
        res.send(databarang);
    });
};

module.exports.editBarang = function(req, res){
    dataBarang.update(
        { _id : req.body.databarang._id},
        {
            nama : req.body.databarang.nama,
            stock : req.body.databarang.stock,
            harga : req.body.databarang.harga
        },
        function(err){
            if(err){
                res.send(err);
            }else{
                res.send('OK, Updated');
            }

        }
    );
};

module.exports.deleteBarang = function(req, res) {
    dataBarang
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted');
            }

        });
};


//=======================================
// User Assingment
//=======================================
module.exports.findAllUserAssingment =  function(req,res, next){
    dataUserAssingment
        .find()
        .exec(function (err, datauserassingment){
            if (err) return next(err);
            res.send(datauserassingment);
        });
};


module.exports.findOneUserAssingment = function(req, res, next){
    dataUserAssingment
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdatauserassingment){
            if(err) return next(err);
            res.send(editdatauserassingment);
        });
};

module.exports.saveUserAssingment = function(req, res, next){
    var datauserassingment = new dataUserAssingment({
        pegawai_id : req.body.datauserassingment.pegawai_id,
        role_id : req.body.datauserassingment.role_id
    });

    datauserassingment.save( function(err, datauserassingment){
        if (err) return next(err);
        res.send(datauserassingment);
    });
};

module.exports.editUserAssingment = function(req, res){
    dataUserAssingment.update(
        { _id : req.body.datauserassingment._id},
        {
            pegawai_id : req.body.datauserassingment.pegawai_id,
            role_id : req.body.datauserassingment.role_id
        },
        function(err){
            if(err){
                res.send(err);
            }else{
                res.send('OK, Updated');
            }

        }
    );
};

module.exports.deleteUserAssingment = function(req, res) {
    dataUserAssingment
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted');
            }

        });
};

//=======================================
// Roles
//=======================================
module.exports.findAllRoles =  function(req,res, next){
    dataRoles
        .find()
        .sort({'role' : 1})
        .exec(function (err, dataroles){
            if (err) return next(err);
            res.send(dataroles);
        });
};

module.exports.findMaxIdRole =  function(req,res, next){
    dataRoles
        .findOne()
        .sort({'nama' : -1})
        .limit(1)
        .exec(function (err, dataroles){
            if (err) return next(err);
            res.send(dataroles);
        });
};


module.exports.findOneRoles = function(req, res, next){
    dataRoles
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdataroles){
            if(err) return next(err);
            res.send(editdataroles);
        });
};

module.exports.saveRoles = function(req, res, next){
    var dataroles = new dataRoles({
        id : req.body.datarole.id,
        role : req.body.datarole.role
    });

    dataroles.save( function(err, dataroles){
        if (err) return next(err);
        res.send(dataroles);
    });
};

module.exports.editRoles = function(req, res){
    dataRoles.update(
        { _id : req.body.datarole._id},
        {
            id : req.body.datarole.id,
            role : req.body.datarole.role
        },
        function(err){
            if(err){
                res.send(err);
            }else{
                res.send('OK, Updated');
            }

        }
    );
};

module.exports.deleteRoles = function(req, res) {
    dataRoles
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted');
            }

        });
};


//=======================================
// Riwayat Bekerja
//=======================================
module.exports.findAllRiwayatBekerja = function(req,res, next){
    dataRiwayatBekerja
        .find()
        .sort({'id_pegawai' : 1})
        .exec(function (err, datariwayatbekerja){
            if (err) return next(err);
            res.send(datariwayatbekerja);
        });
};

module.exports.findAllRiwayatBekerjaPerPegawai = function(req,res, next){
    dataRiwayatBekerja
        .find()
        .sort({'id_pegawai' : 1})
        .exec(function (err, datariwayatbekerja){
            if (err) return next(err);
            res.send(datariwayatbekerja);
        });
};

module.exports.findOneRiwayatBekerja = function(req, res, next){
    dataRiwayatBekerja
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdatariwayatbekerja){
            if(err) return next(err);
            res.send(editdatariwayatbekerja);
        });
};

module.exports.saveRiwayatBekerja = function(req, res, next){
    var datariwayatbekerja = new dataRiwayatBekerja({
        id_pegawai : req.body.datariwayatbekerja.id_pegawai,
        tanggal_riwayat : req.body.datariwayatbekerja.tanggal_riwayat,
        jabatan : req.body.datariwayatbekerja.jabatan,
        gaji : req.body.datariwayatbekerja.gaji
    });

    datariwayatbekerja.save( function(err, datariwayatbekerja){
        if (err) return next(err);
        res.send(datariwayatbekerja);
    });
};

/*module.exports.editRiwayatBekerja = function(req, res){
    dataRiwayatBekerja.update(
        { _id : req.body.datariwayatbekerja._id},
        {
            id_pegawai : req.body.datariwayatbekerja.id_pegawai,
            tanggal_riwayat : req.body.datariwayatbekerja.tanggal_riwayat,
            jabatan : req.body.datariwayatbekerja.jabatan,
            gaji : req.body.datariwayatbekerja.gaji
        },
        function(err){
            if(err){
                res.send(err);
            }else{
                res.send('OK, Updated');
            }

        }
    );
};*/

module.exports.deleteRiwayatBekerja = function(req, res) {
    dataRiwayatBekerja
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted');
            }

        });
};

//=======================================
// Riwayat Pendidikan
//=======================================

module.exports.findAllPegawaiPendidikan = function(req,res, next){
    dataPegawaiPendidikan
        .find()
        .sort({'id_pegawai' : 1})
        .exec(function (err, datapegawaipendidikan){
            if (err) return next(err);
            res.send(datapegawaipendidikan);
        });
};

module.exports.findOnePegawaiPendidikan = function(req, res, next){
    dataPegawaiPendidikan
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdatapegawaipendidikan){
            if(err) return next(err);
            res.send(editdatapegawaipendidikan);
        });
};

module.exports.savePegawaiPendidikan = function(req, res, next){
    var datapegawaipendidikan = new dataPegawaiPendidikan({
        id_pegawai : req.body.datapegawaipendidikan.id_pegawai,
        nama_sekolah : req.body.datapegawaipendidikan.nama_sekolah,
        jenjang : req.body.datapegawaipendidikan.jenjang,
        mulai : req.body.datapegawaipendidikan.mulai,
        lulus : req.body.datapegawaipendidikan.lulus,
        jurusan : req.body.datapegawaipendidikan.jurusan,
        ipk : req.body.datapegawaipendidikan.ipk
    });

    datapegawaipendidikan.save( function(err, datapegawaipendidikan){
        if (err) return next(err);
        res.send(datapegawaipendidikan);
    });
};

/*module.exports.editPegawaiPendidikan = function(req, res){
 dataPegawaiPendidikan.update(
 { _id : req.body.datapegawaipendidikan._id},
 {
 id_pegawai : req.body.datapegawaipendidikan.id_pegawai,
 tanggal_riwayat : req.body.datapegawaipendidikan.tanggal_riwayat,
 jabatan : req.body.datapegawaipendidikan.jabatan,
 gaji : req.body.datapegawaipendidikan.gaji
 },
 function(err){
 if(err){
 res.send(err);
 }else{
 res.send('OK, Updated');
 }

 }
 );
 };*/

module.exports.deletePegawaiPendidikan = function(req, res) {
    dataPegawaiPendidikan
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted');
            }

        });
};


//=======================================
// Keluarga
//=======================================

module.exports.findAllPegawaiKeluarga = function(req,res, next){
    dataPegawaiKeluarga
        .find()
        .sort({'id_pegawai' : 1})
        .exec(function (err, datapegawaikeluarga){
            if (err) return next(err);
            res.send(datapegawaikeluarga);
        });
};

module.exports.findOnePegawaiKeluarga = function(req, res, next){
    dataPegawaiKeluarga
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdatapegawaikeluarga){
            if(err) return next(err);
            res.send(editdatapegawaikeluarga);
        });
};

module.exports.savePegawaiKeluarga = function(req, res, next){
    var datapegawaikeluarga = new dataPegawaiKeluarga({
        id_pegawai : req.body.datapegawaikeluarga.id_pegawai,
        status : req.body.datapegawaikeluarga.status,
        nama : req.body.datapegawaikeluarga.nama,
        tanggal_lahir : req.body.datapegawaikeluarga.tanggal_lahir,
        pekerjaan : req.body.datapegawaikeluarga.pekerjaan,
        keterangan : req.body.datapegawaikeluarga.keterangan
    });

    datapegawaikeluarga.save( function(err, datapegawaikeluarga){
        if (err) return next(err);
        res.send(datapegawaikeluarga);
    });
};

/*module.exports.editPegawaiKeluarga = function(req, res){
 dataPegawaiKeluarga.update(
 { _id : req.body.datapegawaikeluarga._id},
 {
 id_pegawai : req.body.datapegawaikeluarga.id_pegawai,
 tanggal_riwayat : req.body.datapegawaikeluarga.tanggal_riwayat,
 jabatan : req.body.datapegawaikeluarga.jabatan,
 gaji : req.body.datapegawaikeluarga.gaji
 },
 function(err){
 if(err){
 res.send(err);
 }else{
 res.send('OK, Updated');
 }

 }
 );
 };*/

module.exports.deletePegawaiKeluarga = function(req, res) {
    dataPegawaiKeluarga
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted');
            }

        });
};

//==================================================================
// Permission
//==================================================================
var needsRoles = function(roles_id) {
    return function(req, res, next) {
        if (req.user)
            dataUserAssingment.findOne({ pegawai_id : req.user._id, role_id : roles_id }, function (err,user){
                if(!user){
                    res.send(401, 'Unauthorized');
                }
            }),
                next();
        else
            res.send(401, 'Unauthorized');
    };
};

//==================================================================
// MongoDB API
//==================================================================

app.get('/api/datapegawai', needsRoles(2),this.findAllPegawai);
//app.get('/api/datapegawai',this.findAllPegawai);
app.get('/api/datapegawai/:_id', this.findOnePegawai);
app.post('/api/datapegawai', this.savePegawai);
app.put('/api/datapegawai/:_id', this.editPegawai);
app.delete('/api/datapegawai/:_id', this.deletePegawai);

//
app.get('/api/datauserassingment', needsRoles(3), this.findAllUserAssingment);
//app.get('/api/datauserassingment', this.findAllUserAssingment);
app.get('/api/datauserassingment/:_id', this.findOneUserAssingment);
app.post('/api/datauserassingment', this.saveUserAssingment);
app.put('/api/datauserassingment/:_id', this.editUserAssingment);
app.delete('/api/datauserassingment/:_id', this.deleteUserAssingment);

//
app.get('/api/datarole', needsRoles(7), this.findAllRoles);
//app.get('/api/datarole', this.findAllRoles);
app.get('/api/datarole/getmaxid', this.findMaxIdRole);
app.get('/api/datarole/:_id', this.findOneRoles);
app.post('/api/datarole', this.saveRoles);
app.put('/api/datarole/:_id', this.editRoles);
app.delete('/api/datarole/:_id', this.deleteRoles);

//
app.get('/api/databarang',needsRoles(1), this.findAllBarang);
//app.get('/api/databarang', this.findAllBarang);
app.get('/api/databarang/:_id', this.findOneBarang);
app.post('/api/databarang', this.saveBarang);
app.put('/api/databarang/:_id', this.editBarang);
app.delete('/api/databarang/:_id', this.deleteBarang);

//
app.get('/api/datariwayatbekerja',needsRoles(1), this.findAllRiwayatBekerja);
app.get('/api/datariwayatbekerja/:_id', this.findOneRiwayatBekerja);
app.post('/api/datariwayatbekerja', this.saveRiwayatBekerja);
//app.put('/api/datariwayatbekerja/:_id', this.editRiwayatBekerja);
app.delete('/api/datariwayatbekerja/:_id', this.deleteRiwayatBekerja);

//
//app.get('/api/datapegawaipendidikan',needsRoles(1), this.findAllPegawaiPendidikan);
app.get('/api/datapegawaipendidikan', this.findAllPegawaiPendidikan);
app.get('/api/datapegawaipendidikan/:_id', this.findOnePegawaiPendidikan);
app.post('/api/datapegawaipendidikan', this.savePegawaiPendidikan);
//app.put('/api/datapegawaipendidikan/:_id', this.editPegawaiPendidikan);
app.delete('/api/datapegawaipendidikan/:_id', this.deletePegawaiPendidikan);

//
//app.get('/api/datapegawaikeluarga',needsRoles(1), this.findAllPegawaiKeluarga);
app.get('/api/datapegawaikeluarga', this.findAllPegawaiKeluarga);
app.get('/api/datapegawaikeluarga/:_id', this.findOnePegawaiKeluarga);
app.post('/api/datapegawaikeluarga', this.savePegawaiKeluarga);
//app.put('/api/datapegawaikeluarga/:_id', this.editPegawaiKeluarga);
app.delete('/api/datapegawaikeluarga/:_id', this.deletePegawaiKeluarga);

//io.sockets.on('connection', function (socket) {
    //socket.emit('news', { hello: 'world' });
    /*socket.on('my other event', function (data) {
        console.log(data);
    });*/
//);

//========================================
//Authenticate System
//========================================
var auth = function(req, res, next){
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};
//==================================================================
// Home Page Route
//==================================================================

app.get('/',function(req, res){
    if(req.user){
        res.render('index', {title : "Home", user : req.user});
    }else{
        res.render('login', {title : "Login"});
    }
});




// route to test if the user is logged in or not
app.get('/loggedin', function(req, res) {
    res.send(req.isAuthenticated() ? req.user : '0');
});

// route to log in
/*app.post('/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user);
});*/

app.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/'
    }), function(req, res) {
        res.send(req.user);
    }
);

app.get('/login', function(req, res){
    res.render('login', {title : "Login"});
});

app.get('/logout', function(req, res){
    req.logOut();
    res.redirect('/login');
});

// route to log out
app.post('/logout', function(req, res){
    req.logOut();
    res.redirect('/login');
});
//

//=================================
// Android API
//=================================
app.get('/api/android/datapegawai', function (req,res){
    res.contentType('json');

    dataPegawai
        .find()
        .sort('nama')
        .exec(function (err, datapegawai){
            if (err) return next(err);
            var datapegawaiJSON = {
                "datapegawai" : datapegawai
            }
            res.json(datapegawaiJSON);
        });
});

app.get('/api/android/databarang', function (req,res){
    res.contentType('json');

    dataBarang
        .find()
        .sort('nama')
        .exec(function (err, databarang){
            if (err) return next(err);
            var databarangJSON = {
                "databarang" : databarang
            }
            res.json(databarangJSON);
        });
});

//=================================
// Test Section
//=================================
app.get('/api/android/', function (req,res){
    res.contentType('json');
    var contact = {
        "contacts": [
            {
                "id": "c200",
                "name": "RaviTamada",
                "email": "ravi@gmail.com",
                "address": "xx-xx-xxxx,x-street,x-country",
                "gender": "male",
                "phone": {
                    "mobile": "+910000000000",
                    "home": "00000000",
                    "office": "00000000"
                }
            },
            {
                "id": "c201",
                "name": "Johnny Depp",
                "email": "johnny_depp@gmail.com",
                "address": "xx-xx-xxxx,x - street, x - country",
                "gender": "male",
                "phone": {
                    "mobile": "+91 0000000000",
                    "home": "00 000000",
                    "office": "00 000000"
                }
            }
        ]
    }
    res.json(contact);
});


//==================================================================
// Server Running
//==================================================================


server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
