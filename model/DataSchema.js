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
        tipe: String,
        stock : String,
        id_satuan : String,
        id_distributor : String,
        id_produsen : String,
        harga : Number,
        id_mata_uang : String
    }
);

exports.dataProdusenSchema = new mongoose.Schema(
    {
        id : String,
        nama : String
    }
);
exports.dataDistributorSchema = new mongoose.Schema(
    {
        id : String,
        nama : String,
        no_telepon : String
    }
);

exports.dataMataUangSchema = new mongoose.Schema({
    id : String,
    nama : String
});

exports.dataDiskonSchema = new mongoose.Schema({
    id : String,
    nama : String,
    persen : String
});

exports.dataSatuanSchema = new mongoose.Schema(
    {
        id : String,
        nama : String
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
        gaji : Number
    }
);

exports.datapegawaipendidikan = new mongoose.Schema(
    {
        id_pegawai : String,
        nama_sekolah : String,
        kota : String,
        jenjang : String,
        mulai : Number,
        lulus : Number,
        jurusan : String,
        nilai : String
    }
);

exports.datapegawaikeluarga = new mongoose.Schema(
    {
        id_pegawai : String,
        status : String,
        nama : String,
        tanggal_lahir : Date,
        alamat : String,
        pekerjaan : String,
        keterangan : String
    }
);

exports.dataTransaksiPembelian = new mongoose.Schema(
    {
        id_transaksi : String,
        tanggal_transaksi : Date,
        no_kwitansi : String,
        total_transaksi : Number,
        id_distributor : String,
        tanggal_transaksi : Date,
        no_kwitansi : String,
        total_transaksi : Number,
        distributor : String,
        penerima : String,
        status : String
    }
);
exports.dataTransaksiPenjualan = new mongoose.Schema(
    {

        id_transaksi : String,
        tanggal_transaksi : Date,
        no_kwitansi : String,
        total_transaksi : Number,
        uang_bayar : Number,
        uang_kembali : Number,
        pegawai : String,
        status : String
    }
);

exports.dataTransaksi = new mongoose.Schema(
    {
        tanggal : Date,
        id_transaksi : String,
        id_barang : String,
        nama_barang : String,
        jumlah_barang : Number,
        harga_satuan : Number,
        jumlah_barang : String,
        diskon : String
    }
);




