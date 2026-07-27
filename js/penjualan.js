/*====================================
 TELURKITA PREMIUM V2
 PENJUALAN.JS
====================================*/

let dataPenjualan =
JSON.parse(localStorage.getItem("dataPenjualan")) || [];

let dataStok =
JSON.parse(localStorage.getItem("dataStok")) || [];

let editIndex = -1;

const form = document.getElementById("formPenjualan");
const tbody = document.getElementById("dataPenjualan");

function rupiah(angka){

    return "Rp " +
    Number(angka).toLocaleString("id-ID");

}

/*====================================
LOAD RAK
====================================*/

function loadRak(){

    const select =
    document.getElementById("rak");

    if(!select) return;

    select.innerHTML=
    '<option value="">-- Pilih Rak --</option>';

    dataStok.forEach((item,index)=>{

        if(item.rak>0){

            select.innerHTML+=`

<option value="${index}">

Rak ${item.rak}
- ${item.supplier}

</option>

`;

        }

    });

}

loadRak();

/*====================================
SUPPLIER OTOMATIS
====================================*/

document
.getElementById("rak")
.addEventListener("change",function(){

    if(this.value===""){

        document
        .getElementById("supplier")
        .value="";

        return;

    }

    const item =
    dataStok[this.value];

    document
    .getElementById("supplier")
    .value=item.supplier;

});

/*====================================
PREVIEW TOTAL
====================================*/

function hitungPreview(){

    const qty=
    Number(document
    .getElementById("jumlahRak")
    .value);

    const harga=
    Number(document
    .getElementById("hargaJual")
    .value);

    const total=
    qty*harga;

    document
    .getElementById("previewTotal")
    .innerHTML=
    rupiah(total);

}

document
.getElementById("jumlahRak")
.addEventListener("input",
hitungPreview);

document
.getElementById("hargaJual")
.addEventListener("input",
hitungPreview);
/*====================================
SIMPAN TRANSAKSI
====================================*/

form.addEventListener("submit", function(e){

    e.preventDefault();

    const tanggal = document.getElementById("tanggal").value;

    const pelanggan = document.getElementById("pelanggan").value;

    const rakIndex = Number(document.getElementById("rak").value);

    const qty = Number(document.getElementById("jumlahRak").value);

    const hargaJual = Number(document.getElementById("hargaJual").value);

    const metode = document.getElementById("metode").value;

    const keterangan = document.getElementById("keterangan").value;

    if(rakIndex < 0){

        alert("Pilih rak terlebih dahulu.");

        return;

    }

    const stok = dataStok[rakIndex];

    if(qty > stok.rak){

        alert("Stok rak tidak mencukupi!");

        return;

    }

    const hargaBeli = Number(stok.harga);

    const total = qty * hargaJual;

    const modal = qty * hargaBeli;

    const laba = total - modal;

    const transaksi = {

        tanggal,

        pelanggan,

        supplier: stok.supplier,

        rak: stok.rak,

        qty,

        hargaJual,

        hargaBeli,

        total,

        laba,

        metode,

        keterangan

    };

    if(editIndex === -1){

        dataPenjualan.push(transaksi);

    }else{

        dataPenjualan[editIndex] = transaksi;

        editIndex = -1;

    }

    /* Kurangi stok */

    stok.rak -= qty;

    localStorage.setItem(

        "dataStok",

        JSON.stringify(dataStok)

    );

    localStorage.setItem(

        "dataPenjualan",

        JSON.stringify(dataPenjualan)

    );

    /* Jika Piutang */

    if(metode === "Piutang"){

        let dataPiutang = JSON.parse(

            localStorage.getItem("dataPiutang")

        ) || [];

        dataPiutang.push({

            tanggal,

            pelanggan,

            nominal: total,

            status: "Belum Lunas"

        });

        localStorage.setItem(

            "dataPiutang",

            JSON.stringify(dataPiutang)

        );

    }

    tampilData();

    loadRak();

    form.reset();

    document.getElementById("previewTotal").innerHTML = "Rp0";

    document.getElementById("previewLaba").innerHTML = "Rp0";

    showToast("✅ Penjualan berhasil disimpan");

});

/*====================================
TAMPIL DATA
====================================*/

function tampilData(){

    tbody.innerHTML = "";

    if(dataPenjualan.length === 0){

        tbody.innerHTML = `

<tr>

<td colspan="10" class="text-center">

Belum ada transaksi

</td>

</tr>

`;

        return;

    }

    dataPenjualan.forEach((item,index)=>{

        tbody.innerHTML += `

<tr>

<td>${index+1}</td>

<td>${item.tanggal}</td>

<td>${item.pelanggan}</td>

<td>${item.supplier}</td>

<td>${item.rak}</td>

<td>${item.qty}</td>

<td>${rupiah(item.hargaJual)}</td>

<td>${rupiah(item.total)}</td>

<td>${item.metode}</td>

<td>

<button

class="btn btn-warning btn-sm"

onclick="editData(${index})">

<i class="bi bi-pencil"></i>

</button>

<button

class="btn btn-danger btn-sm"

onclick="hapusData(${index})">

<i class="bi bi-trash"></i>

</button>

</td>

</tr>

`;

    });

}

tampilData();
/*====================================
EDIT DATA
====================================*/

function editData(index){

    const item = dataPenjualan[index];

    document.getElementById("tanggal").value = item.tanggal;
    document.getElementById("pelanggan").value = item.pelanggan;
    document.getElementById("jumlahRak").value = item.qty;
    document.getElementById("hargaJual").value = item.hargaJual;
    document.getElementById("metode").value = item.metode;
    document.getElementById("keterangan").value = item.keterangan;

    editIndex = index;

    hitungPreview();

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

/*====================================
HAPUS DATA
====================================*/

function hapusData(index){

    if(!confirm("Hapus transaksi ini?")) return;

    dataPenjualan.splice(index,1);

    localStorage.setItem(
        "dataPenjualan",
        JSON.stringify(dataPenjualan)
    );

    tampilData();

    updateStatistik();

    showToast("🗑️ Transaksi berhasil dihapus");

}

/*====================================
UPDATE STATISTIK
====================================*/

function updateStatistik(){

    let totalPenjualan = 0;
    let totalRak = 0;
    let totalLaba = 0;
    let totalPiutang = 0;

    dataPenjualan.forEach(item=>{

        totalPenjualan += Number(item.total);
        totalRak += Number(item.qty);
        totalLaba += Number(item.laba);

        if(item.metode==="Piutang"){

            totalPiutang += Number(item.total);

        }

    });

    document.getElementById("totalJual").innerHTML = rupiah(totalPenjualan);
    document.getElementById("rakTerjual").innerHTML = totalRak;
    document.getElementById("totalLaba").innerHTML = rupiah(totalLaba);
    document.getElementById("piutangJual").innerHTML = rupiah(totalPiutang);

    document.getElementById("ringPenjualan").innerHTML = rupiah(totalPenjualan);
    document.getElementById("ringRakJual").innerHTML = totalRak;
    document.getElementById("ringLaba").innerHTML = rupiah(totalLaba);
    document.getElementById("ringPiutang").innerHTML = rupiah(totalPiutang);

}

updateStatistik();

/*====================================
PENCARIAN
====================================*/

const cari = document.getElementById("searchPenjualan");

if(cari){

    cari.addEventListener("keyup",function(){

        const keyword = this.value.toLowerCase();

        document.querySelectorAll("#dataPenjualan tr").forEach(row=>{

            row.style.display = row.innerText.toLowerCase().includes(keyword)
            ? ""
            : "none";

        });

    });

}

/*====================================
EXPORT DATA
====================================*/

function exportPenjualan(){

    const blob = new Blob(

        [JSON.stringify(dataPenjualan,null,2)],

        {type:"application/json"}

    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "Penjualan_TelurKita.json";

    link.click();

}

/*====================================
RESET DATA
====================================*/

function resetPenjualan(){

    if(!confirm("Hapus semua data penjualan?")) return;

    dataPenjualan = [];

    localStorage.setItem(
        "dataPenjualan",
        JSON.stringify(dataPenjualan)
    );

    tampilData();

    updateStatistik();

    showToast("🗑️ Semua data penjualan dihapus");

}

/*====================================
AUTO TANGGAL
====================================*/

const inputTanggal = document.getElementById("tanggal");

if(inputTanggal){

    inputTanggal.value = new Date().toISOString().split("T")[0];

}

/*====================================
INIT
====================================*/

tampilData();
updateStatistik();

console.log("Penjualan Premium V2 Aktif");