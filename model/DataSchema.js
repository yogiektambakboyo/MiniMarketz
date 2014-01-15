var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');

exports.dataPegawaiSchema = new mongoose.Schema(
    {
        id : String,
        nama : String,
        username : {type : String, index : { unique : true }},
        password : {type : String, required : true},
        oldpassword : {type : String, required : true},
        ttl : {
            tempat : String,
            tanggal : Date
        },
        umur : String,
        alamat : {
            kelurahan : String,
            kecamatan : String,
            kota      : String,
            provinsi  : String,
            kodepos   : Number
        },
        jenis_kelamin : String,
        agama : String,
        telepon : {
            rumah : String,
            handphone : String
        },
        email : String,
        pendidikan : {
            nama_sekolah : String,
            jenjang : String,
            jurusan : String,
            mulai : Number,
            lulus : Number
        },
        keluarga : {
            ayah : String,
            ibu : String,
            saudara_1 : String,
            saudara_2 : String,
            saudara_3 : String,
            saudara_4 : String,
            saudara_5 : String
        },
        image_path : String
    }
);

exports.dataPegawaiSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

exports.dataBarangSchema = new mongoose.Schema(
    {
        id : String,
        nama : String,
        stock : String,
        harga : String
    }
);

exports.dataRoles = new mongoose.Schema(
    {
        id : Number,
        role : String
    }
);

exports.datausersassingment = new mongoose.Schema(
    {
        pegawai_id : String,
        role_id : String
    }
);




