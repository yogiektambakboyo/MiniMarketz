
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
var uri = 'mongodb://127.0.0.1:27017/angularapp';
//var uri = 'mongodb://192.168.16.13:27017/angularapp';
//var uri = 'mongodb://yogiaditya:angularappdb@ds061518.mongolab.com:61518/angularapp';


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

var dataProdusenSchema = require('./model/DataSchema.js').dataProdusenSchema;
var dataProdusen = db.model('dataprodusen', dataProdusenSchema);

var dataDistributorSchema = require('./model/DataSchema.js').dataDistributorSchema;
var dataDistributor = db.model('datadistributor', dataDistributorSchema);

var dataMataUangSchema = require('./model/DataSchema.js').dataMataUangSchema;
var dataMataUang = db.model('datamatauang', dataMataUangSchema);

var dataSatuanSchema = require('./model/DataSchema.js').dataSatuanSchema;
var dataSatuan = db.model('datasatuan', dataSatuanSchema);

var dataTransaksiPembelianSchema = require('./model/DataSchema.js').dataTransaksiPembelian;
var dataTransaksiPembelian = db.model('datatransaksipembelian', dataTransaksiPembelianSchema);

var dataTransaksiPenjualanSchema = require('./model/DataSchema.js').dataTransaksiPenjualan;
var dataTransaksiPenjualan = db.model('datatransaksipenjualan', dataTransaksiPenjualanSchema);

var dataTransaksiSchema = require('./model/DataSchema.js').dataTransaksi;
var dataTransaksi = db.model('datatransaksi', dataTransaksiSchema);


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
            }else{
                return done(null, user);
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
            rumah : req.body.datapegawai.telepon.rumah,
            handphone : req.body.datapegawai.telepon.handphone
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
                res.send('Deleted ' +  req.params._id);
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
        tipe : req.body.databarang.tipe,
        id_distributor : req.body.databarang.id_distributor,
        id_produsen : req.body.databarang.id_produsen,
        stock : req.body.databarang.stock,
        id_satuan : req.body.databarang.id_satuan,
        harga : req.body.databarang.harga,
        id_mata_uang : req.body.databarang.id_mata_uang
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
            tipe : req.body.databarang.tipe,
            id_distributor : req.body.databarang.id_distributor,
            id_produsen : req.body.databarang.id_produsen,
            stock : req.body.databarang.stock,
            id_satuan : req.body.databarang.id_satuan,
            harga : req.body.databarang.harga,
            id_mata_uang : req.body.databarang.id_mata_uang
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
                res.send('Deleted ' +  req.params._id);
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
                res.send('Deleted ' +  req.params._id);
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
                res.send('Deleted '+ req.params._id);
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
                res.send('Deleted '+ req.params._id);
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
        .findOne({ 'id_pegawai' : req.params.id_pegawai })
        .exec(function (err, editdatapegawaipendidikan){
            if(err) return next(err);
            res.send(editdatapegawaipendidikan);
        });
};

module.exports.savePegawaiPendidikan = function(req, res, next){
    var datapegawaipendidikan = new dataPegawaiPendidikan({
        id_pegawai : req.body.datapegawaipendidikan.id_pegawai,
        nama_sekolah : req.body.datapegawaipendidikan.nama_sekolah,
        kota : req.body.datapegawaipendidikan.kota,
        jenjang : req.body.datapegawaipendidikan.jenjang,
        mulai : req.body.datapegawaipendidikan.mulai,
        lulus : req.body.datapegawaipendidikan.lulus,
        jurusan : req.body.datapegawaipendidikan.jurusan,
        nilai : req.body.datapegawaipendidikan.nilai
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
                res.send('Deleted ' + req.params._id);
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
        alamat : req.body.datapegawaikeluarga.alamat,
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
                res.send('Deleted ' + req.params._id);
            }

        });
};

//=======================================
// Produsen
//=======================================

module.exports.findAllProdusen = function(req,res, next){
    dataProdusen
        .find()
        .sort({'nama' : 1})
        .exec(function (err, dataprodusen){
            if (err) return next(err);
            res.send(dataprodusen);
        });
};

module.exports.findOneProdusen = function(req, res, next){
    dataProdusen
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdataprodusen){
            if(err) return next(err);
            res.send(editdataprodusen);
        });
};

module.exports.saveProdusen = function(req, res, next){
    var dataprodusen = new dataProdusen({
        id : req.body.dataprodusen.id,
        nama : req.body.dataprodusen.nama
    });

    dataprodusen.save( function(err, dataprodusen){
        if (err) return next(err);
        res.send(dataprodusen);
    });
};

module.exports.editProdusen = function(req, res){
    dataProdusen.update(
        { _id : req.body.dataprodusen._id},
        {
            id : req.body.dataprodusen.id,
            nama : req.body.dataprodusen.nama
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

module.exports.deleteProdusen = function(req, res) {
    dataProdusen
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted ' +  req.params._id);
            }

        });
};

//=======================================
// Distributor
//=======================================

module.exports.findAllDistributor = function(req,res, next){
    dataDistributor
        .find()
        .sort({'nama' : 1})
        .exec(function (err, datadistributor){
            if (err) return next(err);
            res.send(datadistributor);
        });
};

module.exports.findOneDistributor = function(req, res, next){
    dataDistributor
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdatadistributor){
            if(err) return next(err);
            res.send(editdatadistributor);
        });
};

module.exports.saveDistributor = function(req, res, next){
    var datadistributor = new dataDistributor({
        id : req.body.datadistributor.id,
        nama : req.body.datadistributor.nama,
        no_telepon : req.body.datadistributor.no_telepon
    });

    datadistributor.save( function(err, datadistributor){
        if (err) return next(err);
        res.send(datadistributor);
    });
};

module.exports.editDistributor = function(req, res){
    dataDistributor.update(
        { _id : req.body.datadistributor._id},
        {
            id : req.body.datadistributor.id,
            nama : req.body.datadistributor.nama,
            no_telepon : req.body.datadistributor.no_telepon
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

module.exports.deleteDistributor = function(req, res) {
    dataDistributor
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted ' +  req.params._id);
            }

        });
};

//=======================================
// Satuan
//=======================================

module.exports.findAllSatuan = function(req,res, next){
    dataSatuan
        .find()
        .sort({'nama' : 1})
        .exec(function (err, datasatuan){
            if (err) return next(err);
            res.send(datasatuan);
        });
};

module.exports.findOneSatuan = function(req, res, next){
    dataSatuan
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdatasatuan){
            if(err) return next(err);
            res.send(editdatasatuan);
        });
};

module.exports.saveSatuan = function(req, res, next){
    var datasatuan = new dataSatuan({
        id : req.body.datasatuan.id,
        nama : req.body.datasatuan.nama
    });

    datasatuan.save( function(err, datasatuan){
        if (err) return next(err);
        res.send(datasatuan);
    });
};

module.exports.editSatuan = function(req, res){
    dataSatuan.update(
        { _id : req.body.datasatuan._id},
        {
            id : req.body.datasatuan.id,
            nama : req.body.datasatuan.nama
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

module.exports.deleteSatuan = function(req, res) {
    dataSatuan
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted ' +  req.params._id);
            }

        });
};

//=======================================
// MataUang
//=======================================

module.exports.findAllMataUang = function(req,res, next){
    dataMataUang
        .find()
        .sort({'nama' : 1})
        .exec(function (err, datamatauang){
            if (err) return next(err);
            res.send(datamatauang);
        });
};

module.exports.findOneMataUang = function(req, res, next){
    dataMataUang
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdatamatauang){
            if(err) return next(err);
            res.send(editdatamatauang);
        });
};

module.exports.saveMataUang = function(req, res, next){
    var datamatauang = new dataMataUang({
        id : req.body.datamatauang.id,
        nama : req.body.datamatauang.nama
    });

    datamatauang.save( function(err, datamatauang){
        if (err) return next(err);
        res.send(datamatauang);
    });
};

module.exports.editMataUang = function(req, res){
    dataMataUang.update(
        { _id : req.body.datamatauang._id},
        {
            id : req.body.datamatauang.id,
            nama : req.body.datamatauang.nama
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

module.exports.deleteMataUang = function(req, res) {
    dataMataUang
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted ' +  req.params._id);
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

//=======================================
// Transaksi
//=======================================

module.exports.findAllTransaksi = function(req,res, next){
    dataTransaksi
        .find()
        .sort({'tanggal' : 1})
        .exec(function (err, datatransaksi){
            if (err) return next(err);
            res.send(datatransaksi);
        });
};

module.exports.findOneTransaksi = function(req, res, next){
    dataTransaksi
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdatatransaksi){
            if(err) return next(err);
            res.send(editdatatransaksi);
        });
};

module.exports.aggregateTransaksi = function(req, res, next){
    dataTransaksi.aggregate([
            { $match : { id_transaksi : req.params.id_transaksi }},
            { $group :
                {
                    _id : null,
                    total_harga: { $sum : "$total_harga" }
                }
            }])
    .exec(function (err, editdatatransaksi){
            if(err) return next(err);
            res.send(editdatatransaksi[0]);
    });

};


module.exports.saveTransaksi = function(req, res, next){
    var datatransaksi = new dataTransaksi({
        tanggal : req.body.datatransaksi.tanggal,
        id_transaksi : req.body.datatransaksi.id_transaksi,
        id_barang : req.body.datatransaksi.id_barang,
        nama_barang : req.body.datatransaksi.nama_barang,
        jumlah_barang : req.body.datatransaksi.jumlah_barang,
        harga_satuan : req.body.datatransaksi.harga_satuan,
        total_harga : req.body.datatransaksi.total_harga,
        diskon : req.body.datatransaksi.diskon
    });

    datatransaksi.save( function(err, datatransaksi){
        if (err) return next(err);
        res.send(datatransaksi);
    });
};

module.exports.editTransaksi = function(req, res){
    dataTransaksi.update(
        { _id : req.body.datatransaksi._id},
        {
            tanggal : req.body.datatransaksi.tanggal,
            id_transaksi : req.body.datatransaksi.id_transaksi,
            id_barang : req.body.datatransaksi.id_barang,
            nama_barang : req.body.datatransaksi.nama_barang,
            jumlah_barang : req.body.datatransaksi.jumlah_barang,
            harga_satuan : req.body.datatransaksi.harga_satuan,
            total_harga : req.body.datatransaksi.total_harga,
            diskon : req.body.datatransaksi.diskon
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

module.exports.deleteTransaksi = function(req, res) {
    dataTransaksi
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted ' +  req.params._id);
            }

        });
};

//=======================================
// Transaksi Pembelian
//=======================================

module.exports.findAllTransaksiPembelian = function(req,res, next){
    dataTransaksiPembelian
        .find()
        .sort({'tanggal_transaksi' : 1})
        .exec(function (err, datatransaksipembelian){
            if (err) return next(err);
            res.send(datatransaksipembelian);
        });
};

module.exports.findOneTransaksiPembelian = function(req, res, next){
    dataTransaksiPembelian
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdatatransaksipembelian){
            if(err) return next(err);
            res.send(editdatatransaksipembelian);
        });
};

module.exports.saveTransaksiPembelian = function(req, res, next){
    var datatransaksipembelian = new dataTransaksiPembelian({
        id_transaksi : req.body.datatransaksipembelian.id_transaksipembelian,
        tanggal_transaksi : req.body.datatransaksipembelian.tanggal_transaksi,
        no_kwitansi : req.body.datatransaksipembelian.no_kwitansi,
        total_transaksi : req.body.datatransaksipembelian.total_transaksi,
        id_distributor : req.body.datatransaksipembelian.id_distributor,
        penerima : req.body.datatransaksipembelian.penerima,
        status : req.body.datatransaksipembelian.status
    });

    datatransaksipembelian.save( function(err, datatransaksipembelian){
        if (err) return next(err);
        res.send(datatransaksipembelian);
    });
};

module.exports.editTransaksiPembelian = function(req, res){
    dataTransaksiPembelian.update(
        { _id : req.body.datatransaksipembelian._id},
        {
            id_transaksi : req.body.datatransaksipembelian.id_transaksipembelian,
            tanggal_transaksi : req.body.datatransaksipembelian.tanggal_transaksi,
            no_kwitansi : req.body.datatransaksipembelian.no_kwitansi,
            total_transaksi : req.body.datatransaksipembelian.total_transaksi,
            id_distributor : req.body.datatransaksipembelian.id_distributor,
            penerima : req.body.datatransaksipembelian.penerima,
            status : req.body.datatransaksipembelian.status
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

module.exports.deleteTransaksiPembelian = function(req, res) {
    dataTransaksiPembelian
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted ' +  req.params._id);
            }

        });
};

//=======================================
// Transaksi Penjualan
//=======================================

module.exports.findAllTransaksiPenjualan = function(req,res, next){
    dataTransaksiPenjualan
        .find()
        .sort({'tanggal_transaksi' : 1})
        .exec(function (err, datatransaksipenjualan){
            if (err) return next(err);
            res.send(datatransaksipenjualan);
        });
};

module.exports.findOneTransaksiPenjualan = function(req, res, next){
    dataTransaksiPenjualan
        .findOne({ '_id' : req.params._id })
        .exec(function (err, editdatatransaksipenjualan){
            if(err) return next(err);
            res.send(editdatatransaksipenjualan);
        });
};

module.exports.saveTransaksiPenjualan = function(req, res, next){
    var datatransaksipenjualan = new dataTransaksiPenjualan({
        id_transaksi : req.body.datatransaksipenjualan.id_transaksipenjualan,
        tanggal_transaksi : req.body.datatransaksipenjualan.tanggal_transaksi,
        no_kwitansi : req.body.datatransaksipenjualan.no_kwitansi,
        total_transaksi : req.body.datatransaksipenjualan.total_transaksi,
        uang_bayar : req.body.datatransaksipenjualan.uang_bayar,
        uang_kembali : req.body.datatransaksipenjualan.uang_kembali,
        pegawai : req.user.nama,
        status : req.body.datatransaksipenjualan.status
    });

    datatransaksipenjualan.save( function(err, datatransaksipenjualan){
        if (err) return next(err);
        res.send(datatransaksipenjualan);
    });
};

module.exports.editTransaksiPenjualan = function(req, res){
    dataTransaksiPenjualan.update(
        { _id : req.body.datatransaksipenjualan._id},
        {
            id_transaksi : req.body.datatransaksipenjualan.id_transaksipenjualan,
            tanggal_transaksi : req.body.datatransaksipenjualan.tanggal_transaksi,
            no_kwitansi : req.body.datatransaksipenjualan.no_kwitansi,
            total_transaksi : req.body.datatransaksipenjualan.total_transaksi,
            uang_bayar : req.body.datatransaksipenjualan.uang_bayar,
            uang_kembali : req.body.datatransaksipenjualan.uang_kembali,
            pegawai : req.body.datatransaksipenjualan.pegawai,
            status : req.body.datatransaksipenjualan.status
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

module.exports.deleteTransaksiPenjualan = function(req, res) {
    dataTransaksiPenjualan
        .remove({
            _id : req.params._id
        }, function(err) {
            if (err){
                res.send(err);
            }else{
                res.send('Deleted ' +  req.params._id);
            }

        });
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

//
app.get('/api/dataprodusen',needsRoles(1), this.findAllProdusen);
//app.get('/api/dataprodusen', this.findAllProdusen);
app.get('/api/dataprodusen/:_id', this.findOneProdusen);
app.post('/api/dataprodusen', this.saveProdusen);
app.put('/api/dataprodusen/:_id', this.editProdusen);
app.delete('/api/dataprodusen/:_id', this.deleteProdusen);

//
app.get('/api/datadistributor',needsRoles(1), this.findAllDistributor);
//app.get('/api/datadistributor', this.findAllDistributor);
app.get('/api/datadistributor/:_id', this.findOneDistributor);
app.post('/api/datadistributor', this.saveDistributor);
app.put('/api/datadistributor/:_id', this.editDistributor);
app.delete('/api/datadistributor/:_id', this.deleteDistributor);

//
app.get('/api/datasatuan',needsRoles(1), this.findAllSatuan);
//app.get('/api/datasatuan', this.findAllSatuan);
app.get('/api/datasatuan/:_id', this.findOneSatuan);
app.post('/api/datasatuan', this.saveSatuan);
app.put('/api/datasatuan/:_id', this.editSatuan);
app.delete('/api/datasatuan/:_id', this.deleteSatuan);

//
app.get('/api/datamatauang',needsRoles(1), this.findAllMataUang);
//app.get('/api/datamatauang', this.findAllMataUang);
app.get('/api/datamatauang/:_id', this.findOneMataUang);
app.post('/api/datamatauang', this.saveMataUang);
app.put('/api/datamatauang/:_id', this.editMataUang);
app.delete('/api/datamatauang/:_id', this.deleteMataUang);


//app.get('/api/datatransaksi',needsRoles(1), this.findAllTransaksi);
app.get('/api/datatransaksi', this.findAllTransaksi);
app.get('/api/datatransaksi/aggregate/:id_transaksi', this.aggregateTransaksi);
app.get('/api/datatransaksi/:_id', this.findOneTransaksi);
app.post('/api/datatransaksi', this.saveTransaksi);
app.put('/api/datatransaksi/:_id', this.editTransaksi);
app.delete('/api/datatransaksi/:_id', this.deleteTransaksi);

//app.get('/api/datatransaksipembelian',needsRoles(1), this.findAllTransaksiPembelian);
app.get('/api/datatransaksipembelian', this.findAllTransaksiPembelian);
app.get('/api/datatransaksipembelian/:_id', this.findOneTransaksiPembelian);
app.post('/api/datatransaksipembelian', this.saveTransaksiPembelian);
app.put('/api/datatransaksipembelian/:_id', this.editTransaksiPembelian);
app.delete('/api/datatransaksipembelian/:_id', this.deleteTransaksiPembelian);

//app.get('/api/datatransaksipenjualan',needsRoles(1), this.findAllTransaksiPenjualan);
app.get('/api/datatransaksipenjualan', this.findAllTransaksiPenjualan);
app.get('/api/datatransaksipenjualan/:_id', this.findOneTransaksiPenjualan);
app.post('/api/datatransaksipenjualan', this.saveTransaksiPenjualan);
app.put('/api/datatransaksipenjualan/:_id', this.editTransaksiPenjualan);
app.delete('/api/datatransaksipenjualan/:_id', this.deleteTransaksiPenjualan);


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
        .find({},{ "password" : 0, "oldpassword" : 0})
        .sort({'nama' : 1})
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
        .sort({'nama' : 1})
        .exec(function (err, databarang){
            if (err) return next(err);
            var databarangJSON = {
                "databarang" : databarang
            }
            res.json(databarangJSON);
        });
});


//==================================================================
// Server Running
//==================================================================


server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
