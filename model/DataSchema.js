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
        jenis_kelamin : String,
        agama : String,
        tanggal_masuk : Date,
        status : String,
        negara : String,
        alamat : {
            kelurahan : String,
            kecamatan : String,
            kota      : String,
            provinsi  : String,
            kodepos   : Number
        },
        telepon : {
            rumah : String,
            handphone : String
        },
        email : String,
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

exports.datariwayatkerja = new mongoose.Schema(
    {
        id_pegawai : String,
        tanggal_riwayat : Date,
        jabatan : String,
        gaji : String
    }
);

exports.datapegawaipendidikan = new mongoose.Schema(
    {
        id_pegawai : String,
        nama_sekolah : String,
        jenjang : String,
        mulai : Number,
        lulus : Number,
        jurusan : String,
        ipk : String
    }
);




