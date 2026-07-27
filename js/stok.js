/*====================================
  TELURKITA PREMIUM V2
  STOK.JS
====================================*/

let dataStok = JSON.parse(localStorage.getItem("dataStok")) || [];

const form = document.getElementById("formStok");
const tbody = document.getElementById("dataStok");
const search = document.getElementById("searchStok");

let editIndex = -1;

/*====================================
FORMAT RUPIAH
====================================*/

function rupiah(angka){

    return "Rp " + Number(angka).toLocaleString("id-ID");

}

/*====================================
SIMPAN LOCAL STORAGE
====================================*/

function simpanData(){

    localStorage.setItem(
        "dataStok",
        JSON.stringify(dataStok)
    );

}

/*====================================
TOTAL
====================================*/

function hitungTotal(){

    let totalRak=0;
    let totalButir=0;
    let totalNilai=0;

    dataStok.forEach(item=>{

        totalRak+=Number(item.rak);

        totalButir+=Number(item.butir);

        totalNilai+=Number(item.total);

    });

    document.getElementById("totalRak").innerHTML=totalRak;

    document.getElementById("nilaiStok").innerHTML=rupiah(totalNilai);

    document.getElementById("jumlahSupplier").innerHTML=dataStok.length;

    document.getElementById("ringRak").innerHTML=totalRak;

    document.getElementById("ringButir").innerHTML=totalButir;

    document.getElementById("ringNilai").innerHTML=rupiah(totalNilai);

    document.getElementById("ringSupplier").innerHTML=dataStok.length;

}

/*====================================
TAMPIL DATA
====================================*/

function tampilData(){

    tbody.innerHTML="";

    if(dataStok.length===0){

        tbody.innerHTML=`
        <tr>
            <td colspan="9" class="text-center">
                Belum ada data stok
            </td>
        </tr>
        `;

        hitungTotal();

        return;

    }

    dataStok.forEach((item,index)=>{

        tbody.innerHTML+=`

        <tr>

        <td>${index+1}</td>

        <td>${item.tanggal}</td>

        <td>${item.supplier}</td>

        <td>${item.rak}</td>

        <td>${item.butir}</td>

        <td>${rupiah(item.harga)}</td>

        <td>${rupiah(item.total)}</td>

        <td>${item.keterangan}</td>

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

    hitungTotal();

}

tampilData();
/*====================================
SIMPAN DATA
====================================*/

form.addEventListener("submit", function(e){

    e.preventDefault();

    const tanggal = document.getElementById("tanggal").value;

    const supplier = document.getElementById("supplier").value;

    const rak = Number(document.getElementById("rak").value);

    const butir = Number(document.getElementById("butir").value);

    const harga = Number(document.getElementById("harga").value);

    const keterangan = document.getElementById("keterangan").value;

    const total = rak * harga;

    const data = {

        tanggal,
        supplier,
        rak,
        butir,
        harga,
        total,
        keterangan

    };

    if(editIndex === -1){

        dataStok.push(data);

        showToast("✅ Data stok berhasil ditambahkan");

    }else{

        dataStok[editIndex] = data;

        showToast("✏️ Data stok berhasil diperbarui");

        editIndex = -1;

    }

    simpanData();

    tampilData();

    form.reset();

});

/*====================================
EDIT DATA
====================================*/

function editData(index){

    const item = dataStok[index];

    document.getElementById("tanggal").value = item.tanggal;

    document.getElementById("supplier").value = item.supplier;

    document.getElementById("rak").value = item.rak;

    document.getElementById("butir").value = item.butir;

    document.getElementById("harga").value = item.harga;

    document.getElementById("keterangan").value = item.keterangan;

    editIndex = index;

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/*====================================
HAPUS DATA
====================================*/

function hapusData(index){

    if(!confirm("Hapus data stok ini?")){

        return;

    }

    dataStok.splice(index,1);

    simpanData();

    tampilData();

    showToast("🗑️ Data stok berhasil dihapus");

}

/*====================================
RESET FORM
====================================*/

form.addEventListener("reset", function(){

    editIndex = -1;

});

/*====================================
SET TANGGAL HARI INI
====================================*/

const inputTanggal = document.getElementById("tanggal");

if(inputTanggal){

    inputTanggal.value = new Date().toISOString().split("T")[0];

}
/*====================================
PENCARIAN DATA
====================================*/

if(search){

    search.addEventListener("keyup", function(){

        const keyword = this.value.toLowerCase();

        const rows = tbody.querySelectorAll("tr");

        rows.forEach(row=>{

            row.style.display = row.innerText
                .toLowerCase()
                .includes(keyword)
                ? ""
                : "none";

        });

    });

}

/*====================================
EXPORT DATA STOK
====================================*/

function exportData(){

    const blob = new Blob(

        [JSON.stringify(dataStok,null,2)],

        {type:"application/json"}

    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "Data_Stok_TelurKita.json";

    link.click();

}

/*====================================
IMPORT DATA STOK
====================================*/

function importData(input){

    const file = input.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload=function(e){

        try{

            dataStok = JSON.parse(e.target.result);

            simpanData();

            tampilData();

            showToast("✅ Import data berhasil");

        }catch{

            alert("File tidak valid");

        }

    }

    reader.readAsText(file);

}

/*====================================
HAPUS SEMUA DATA
====================================*/

function resetData(){

    if(!confirm("Yakin ingin menghapus semua data stok?")){

        return;

    }

    dataStok=[];

    simpanData();

    tampilData();

    showToast("🗑️ Semua data stok dihapus");

}

/*====================================
UPDATE DASHBOARD
====================================*/

function updateDashboard(){

    localStorage.setItem(

        "dashboardUpdate",

        Date.now()

    );

}

const simpanLama = simpanData;

simpanData = function(){

    simpanLama();

    updateDashboard();

}

/*====================================
AUTO REFRESH
====================================*/

window.addEventListener("storage",function(e){

    if(e.key==="dataStok"){

        dataStok=JSON.parse(localStorage.getItem("dataStok"))||[];

        tampilData();

    }

});

/*====================================
SELESAI
====================================*/

console.log("stok.js Premium V2 aktif");