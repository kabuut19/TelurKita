/*=================================================
    TELURKITA PREMIUM V3
==================================================*/

/*=========================================
    LOCAL STORAGE KEY
=========================================*/

const KEY_SUPPLIER = "telurkita_supplier";

const KEY_STOK = "telurkita_stok";

const KEY_PELANGGAN = "telurkita_pelanggan";

const KEY_PENJUALAN = "telurkita_penjualan";

const KEY_PENGELUARAN = "telurkita_pengeluaran";

const KEY_PIUTANG = "telurkita_piutang";

/*=========================================
    DEFAULT LOCAL STORAGE
=========================================*/

function initStorage() {

    if (!localStorage.getItem(KEY_SUPPLIER)) {

        localStorage.setItem(KEY_SUPPLIER, JSON.stringify([]));

    }

    if (!localStorage.getItem(KEY_STOK)) {

        localStorage.setItem(KEY_STOK, JSON.stringify([]));

    }

    if (!localStorage.getItem(KEY_PELANGGAN)) {

        localStorage.setItem(KEY_PELANGGAN, JSON.stringify([]));

    }

    if (!localStorage.getItem(KEY_PENJUALAN)) {

        localStorage.setItem(KEY_PENJUALAN, JSON.stringify([]));

    }

    if (!localStorage.getItem(KEY_PENGELUARAN)) {

        localStorage.setItem(KEY_PENGELUARAN, JSON.stringify([]));

    }

    if (!localStorage.getItem(KEY_PIUTANG)) {

        localStorage.setItem(KEY_PIUTANG, JSON.stringify([]));

    }

}

initStorage();

/*=========================================
    GET DATA
=========================================*/

function getSupplier() {

    return JSON.parse(localStorage.getItem(KEY_SUPPLIER)) || [];

}

function getStok() {

    return JSON.parse(localStorage.getItem(KEY_STOK)) || [];

}

function getPelanggan() {

    return JSON.parse(localStorage.getItem(KEY_PELANGGAN)) || [];

}

function getPenjualan() {

    return JSON.parse(localStorage.getItem(KEY_PENJUALAN)) || [];

}

function getPengeluaran() {

    return JSON.parse(localStorage.getItem(KEY_PENGELUARAN)) || [];

}

function getPiutang() {

    return JSON.parse(localStorage.getItem(KEY_PIUTANG)) || [];

}

/*=========================================
    SAVE DATA
=========================================*/

function saveSupplier(data) {

    localStorage.setItem(KEY_SUPPLIER, JSON.stringify(data));

}

function saveStok(data) {

    localStorage.setItem(KEY_STOK, JSON.stringify(data));

}

function savePelanggan(data) {

    localStorage.setItem(KEY_PELANGGAN, JSON.stringify(data));

}

function savePenjualan(data) {

    localStorage.setItem(KEY_PENJUALAN, JSON.stringify(data));

}

function savePengeluaran(data) {

    localStorage.setItem(KEY_PENGELUARAN, JSON.stringify(data));

}

function savePiutang(data) {

    localStorage.setItem(KEY_PIUTANG, JSON.stringify(data));

}

/*=========================================
    FORMAT RUPIAH
=========================================*/

function rupiah(angka){

    return Number(angka).toLocaleString("id-ID",{

        style:"currency",

        currency:"IDR",

        minimumFractionDigits:0

    });

}

/*=========================================
    FORMAT ANGKA
=========================================*/

function angka(angka){

    return Number(angka).toLocaleString("id-ID");

}
/*=========================================
    TANGGAL & JAM
=========================================*/

function updateTanggalJam() {

    const el = document.getElementById("tanggalJam");

    if (!el) return;

    const sekarang = new Date();

    const opsi = {

        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"

    };

    const tanggal = sekarang.toLocaleDateString("id-ID", opsi);

    const jam = sekarang.toLocaleTimeString("id-ID");

    el.innerHTML = `${tanggal} | ${jam}`;

}

setInterval(updateTanggalJam, 1000);

updateTanggalJam();

/*=========================================
    DARK MODE
=========================================*/

const darkBtn = document.getElementById("darkMode");

if (localStorage.getItem("darkmode") === "true") {

    document.body.classList.add("dark");

}

if (darkBtn) {

    darkBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        localStorage.setItem(

            "darkmode",

            document.body.classList.contains("dark")

        );

    });

}

/*=========================================
    SIDEBAR MOBILE
=========================================*/

const menuToggle = document.getElementById("menuToggle");

const sidebar = document.querySelector(".sidebar");

if (menuToggle) {

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("active");

    });

}

/*=========================================
    FORMAT TANGGAL
=========================================*/

function formatTanggal(tanggal){

    return new Date(tanggal).toLocaleDateString("id-ID",{

        day:"2-digit",

        month:"long",

        year:"numeric"

    });

}

/*=========================================
    GENERATE ID
=========================================*/

function generateID(){

    return Date.now();

}

/*=========================================
    NOTIFIKASI
=========================================*/

function showAlert(pesan){

    alert(pesan);

}

/*=========================================
    KONFIRMASI
=========================================*/

function konfirmasi(pesan){

    return confirm(pesan);

}

/*=========================================
    PENCARIAN MENU SIDEBAR
=========================================*/

const searchInput = document.querySelector(".search-box input");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const keyword = this.value.toLowerCase();

        const menu = document.querySelectorAll(".menu li");

        menu.forEach(item => {

            const teks = item.innerText.toLowerCase();

            item.style.display = teks.includes(keyword)

                ? ""

                : "none";

        });

    });

}

/*=========================================
    CEK HALAMAN
=========================================*/

const halaman = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();
    /*=========================================
    DASHBOARD
=========================================*/

function loadDashboard() {

    if (halaman !== "" && halaman !== "index.html") return;

    const supplier = getSupplier();
    const stok = getStok();
    const pelanggan = getPelanggan();
    const penjualan = getPenjualan();
    const pengeluaran = getPengeluaran();
    const piutang = getPiutang();

    /*=================================
        TOTAL DATA
    =================================*/

    const totalSupplier = supplier.length;

    const totalPelanggan = pelanggan.length;

    let totalRak = 0;
    let nilaiPersediaan = 0;

    stok.forEach(item => {

        totalRak += Number(item.jumlahRak || 0);

        nilaiPersediaan +=
            Number(item.jumlahRak || 0) *
            Number(item.hargaBeli || 0);

    });

    /*=================================
        PENJUALAN HARI INI
    =================================*/

    const hariIni = new Date().toISOString().split("T")[0];

    let omzetHariIni = 0;

    let modalHariIni = 0;

    penjualan.forEach(item => {

        if (item.tanggal === hariIni) {

            omzetHariIni += Number(item.total || 0);

            modalHariIni += Number(item.modal || 0);

        }

    });

    /*=================================
        PENGELUARAN HARI INI
    =================================*/

    let pengeluaranHariIni = 0;

    pengeluaran.forEach(item => {

        if (item.tanggal === hariIni) {

            pengeluaranHariIni += Number(item.nominal || 0);

        }

    });

    /*=================================
        PIUTANG
    =================================*/

    let totalPiutang = 0;

    piutang.forEach(item => {

        if (item.status !== "Lunas") {

            totalPiutang += Number(item.nominal || 0);

        }

    });

    /*=================================
        LABA
    =================================*/

    const labaBersih =
        omzetHariIni -
        modalHariIni -
        pengeluaranHariIni;

    /*=================================
        TAMPILKAN KE DASHBOARD
    =================================*/

    document.getElementById("totalSupplier").textContent =
        angka(totalSupplier);

    document.getElementById("totalPelanggan").textContent =
        angka(totalPelanggan);

    document.getElementById("totalRak").textContent =
        angka(totalRak) + " Rak";

    document.getElementById("nilaiPersediaan").textContent =
        rupiah(nilaiPersediaan);

    document.getElementById("penjualanHari").textContent =
        rupiah(omzetHariIni);

    document.getElementById("pengeluaranHari").textContent =
        rupiah(pengeluaranHariIni);

    document.getElementById("labaBersih").textContent =
        rupiah(labaBersih);

    document.getElementById("totalPiutang").textContent =
        rupiah(totalPiutang);

    /*=================================
        RINGKASAN
    =================================*/

    document.getElementById("sumSupplier").textContent =
        angka(totalSupplier);

    document.getElementById("sumPelanggan").textContent =
        angka(totalPelanggan);

    document.getElementById("sumRak").textContent =
        angka(totalRak);

    document.getElementById("sumPenjualan").textContent =
        rupiah(omzetHariIni);

    document.getElementById("sumPengeluaran").textContent =
        rupiah(pengeluaranHariIni);

    document.getElementById("sumLaba").textContent =
        rupiah(labaBersih);

}

loadDashboard();
/*=========================================
    GRAFIK DASHBOARD
=========================================*/

function loadCharts() {

    if (halaman !== "" && halaman !== "index.html") return;

    const penjualan = getPenjualan();
    const stok = getStok();

    /*=================================
        GRAFIK PENJUALAN 7 HARI
    =================================*/

    const labelHari = [];
    const dataPenjualan = [];

    for (let i = 6; i >= 0; i--) {

        const tanggal = new Date();

        tanggal.setDate(tanggal.getDate() - i);

        const key = tanggal.toISOString().split("T")[0];

        labelHari.push(
            tanggal.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short"
            })
        );

        let total = 0;

        penjualan.forEach(item => {

            if (item.tanggal === key) {

                total += Number(item.total || 0);

            }

        });

        dataPenjualan.push(total);

    }

    const chartPenjualan = document.getElementById("chartPenjualan");

    if (chartPenjualan) {

        new Chart(chartPenjualan, {

            type: "line",

            data: {

                labels: labelHari,

                datasets: [{

                    label: "Penjualan",

                    data: dataPenjualan,

                    borderColor: "#f59e0b",

                    backgroundColor: "rgba(245,158,11,.15)",

                    fill: true,

                    tension: .35

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        });

    }

    /*=================================
        GRAFIK STOK
    =================================*/

    const supplier = [];
    const jumlah = [];

    stok.forEach(item => {

        supplier.push(item.supplier);

        jumlah.push(Number(item.jumlahRak || 0));

    });

    const chartStok = document.getElementById("chartStok");

    if (chartStok) {

        new Chart(chartStok, {

            type: "doughnut",

            data: {

                labels: supplier,

                datasets: [{

                    data: jumlah,

                    backgroundColor: [

                        "#f59e0b",

                        "#10b981",

                        "#3b82f6",

                        "#ef4444",

                        "#8b5cf6",

                        "#06b6d4",

                        "#22c55e",

                        "#f97316"

                    ]

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        });

    }

}

loadCharts();

/*=========================================
    TOP SUPPLIER
=========================================*/

function loadTopSupplier() {

    if (halaman !== "" && halaman !== "index.html") return;

    const tbody = document.getElementById("topSupplier");

    if (!tbody) return;

    const stok = getStok();

    tbody.innerHTML = "";

    if (stok.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="2" class="text-center">
                Belum ada data
            </td>
        </tr>`;

        return;

    }

    stok.sort((a, b) => b.jumlahRak - a.jumlahRak);

    stok.slice(0, 5).forEach(item => {

        tbody.innerHTML += `

        <tr>

            <td>${item.supplier}</td>

            <td>${angka(item.jumlahRak)} Rak</td>

        </tr>

        `;

    });

}

loadTopSupplier();
/*=========================================
    GRAFIK DASHBOARD
=========================================*/

function loadCharts() {

    if (halaman !== "" && halaman !== "index.html") return;

    const penjualan = getPenjualan();
    const stok = getStok();

    /*=================================
        GRAFIK PENJUALAN 7 HARI
    =================================*/

    const labelHari = [];
    const dataPenjualan = [];

    for (let i = 6; i >= 0; i--) {

        const tanggal = new Date();

        tanggal.setDate(tanggal.getDate() - i);

        const key = tanggal.toISOString().split("T")[0];

        labelHari.push(
            tanggal.toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "short"
            })
        );

        let total = 0;

        penjualan.forEach(item => {

            if (item.tanggal === key) {

                total += Number(item.total || 0);

            }

        });

        dataPenjualan.push(total);

    }

    const chartPenjualan = document.getElementById("chartPenjualan");

    if (chartPenjualan) {

        new Chart(chartPenjualan, {

            type: "line",

            data: {

                labels: labelHari,

                datasets: [{

                    label: "Penjualan",

                    data: dataPenjualan,

                    borderColor: "#f59e0b",

                    backgroundColor: "rgba(245,158,11,.15)",

                    fill: true,

                    tension: .35

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        display: false

                    }

                }

            }

        });

    }

    /*=================================
        GRAFIK STOK
    =================================*/

    const supplier = [];
    const jumlah = [];

    stok.forEach(item => {

        supplier.push(item.supplier);

        jumlah.push(Number(item.jumlahRak || 0));

    });

    const chartStok = document.getElementById("chartStok");

    if (chartStok) {

        new Chart(chartStok, {

            type: "doughnut",

            data: {

                labels: supplier,

                datasets: [{

                    data: jumlah,

                    backgroundColor: [

                        "#f59e0b",

                        "#10b981",

                        "#3b82f6",

                        "#ef4444",

                        "#8b5cf6",

                        "#06b6d4",

                        "#22c55e",

                        "#f97316"

                    ]

                }]

            },

            options: {

                responsive: true,

                plugins: {

                    legend: {

                        position: "bottom"

                    }

                }

            }

        });

    }

}

loadCharts();

/*=========================================
    TOP SUPPLIER
=========================================*/

function loadTopSupplier() {

    if (halaman !== "" && halaman !== "index.html") return;

    const tbody = document.getElementById("topSupplier");

    if (!tbody) return;

    const stok = getStok();

    tbody.innerHTML = "";

    if (stok.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="2" class="text-center">
                Belum ada data
            </td>
        </tr>`;

        return;

    }

    stok.sort((a, b) => b.jumlahRak - a.jumlahRak);

    stok.slice(0, 5).forEach(item => {

        tbody.innerHTML += `

        <tr>

            <td>${item.supplier}</td>

            <td>${angka(item.jumlahRak)} Rak</td>

        </tr>

        `;

    });

}

loadTopSupplier();
/*=========================================
    TOP PELANGGAN
=========================================*/

function loadTopPelanggan() {

    if (halaman !== "" && halaman !== "index.html") return;

    const tbody = document.getElementById("topPelanggan");

    if (!tbody) return;

    const penjualan = getPenjualan();

    tbody.innerHTML = "";

    if (penjualan.length === 0) {

        tbody.innerHTML = `
        <tr>
            <td colspan="2" class="text-center">
                Belum ada data
            </td>
        </tr>`;

        return;

    }

    const data = {};

    penjualan.forEach(item => {

        if (!data[item.pelanggan]) {

            data[item.pelanggan] = 0;

        }

        data[item.pelanggan] += Number(item.total || 0);

    });

    const hasil = Object.entries(data)
        .sort((a,b)=>b[1]-a[1])
        .slice(0,5);

    hasil.forEach(item=>{

        tbody.innerHTML += `

        <tr>

            <td>${item[0]}</td>

            <td>${rupiah(item[1])}</td>

        </tr>

        `;

    });

}

loadTopPelanggan();

/*=========================================
    STATUS PERSEDIAAN
=========================================*/

function loadStatusPersediaan(){

    if (halaman !== "" && halaman !== "index.html") return;

    const tbody=document.getElementById("statusPersediaan");

    if(!tbody) return;

    const stok=getStok();

    tbody.innerHTML="";

    if(stok.length===0){

        tbody.innerHTML=`

        <tr>

        <td colspan="4" class="text-center">

        Belum ada data stok

        </td>

        </tr>

        `;

        return;

    }

    stok.forEach(item=>{

        const nilai=
        Number(item.jumlahRak||0)*
        Number(item.hargaBeli||0);

        tbody.innerHTML+=`

        <tr>

        <td>${item.supplier}</td>

        <td>${angka(item.jumlahRak)} Rak</td>

        <td>${rupiah(item.hargaBeli)}</td>

        <td>${rupiah(nilai)}</td>

        </tr>

        `;

    });

}

loadStatusPersediaan();

/*=========================================
    AKTIVITAS TERAKHIR
=========================================*/

function loadAktivitas(){

    if (halaman !== "" && halaman !== "index.html") return;

    const tbody=document.getElementById("aktivitasTerakhir");

    if(!tbody) return;

    tbody.innerHTML="";

    const aktivitas=[];

    getSupplier().forEach(item=>{

        aktivitas.push({

            waktu:item.tanggal||"-",

            teks:"Supplier ditambahkan",

            status:"Supplier"

        });

    });

    getPenjualan().forEach(item=>{

        aktivitas.push({

            waktu:item.tanggal,

            teks:"Penjualan berhasil",

            status:"Penjualan"

        });

    });

    getPengeluaran().forEach(item=>{

        aktivitas.push({

            waktu:item.tanggal,

            teks:"Pengeluaran dicatat",

            status:"Pengeluaran"

        });

    });

    aktivitas.sort((a,b)=>

        new Date(b.waktu)-new Date(a.waktu)

    );

    aktivitas.slice(0,10).forEach(item=>{

        tbody.innerHTML+=`

        <tr>

            <td>${item.waktu}</td>

            <td>${item.teks}</td>

            <td>

                <span class="badge-success">

                    ${item.status}

                </span>

            </td>

        </tr>

        `;

    });

    if(aktivitas.length===0){

        tbody.innerHTML=`

        <tr>

            <td colspan="3"

            class="text-center">

            Belum ada aktivitas

            </td>

        </tr>

        `;

    }

}

loadAktivitas();

/*=========================================
    REFRESH DASHBOARD
=========================================*/

function refreshDashboard(){

    loadDashboard();

    loadCharts();

    loadTopSupplier();

    loadTopPelanggan();

    loadStatusPersediaan();

    loadAktivitas();

}
/*=========================================
    AUTO REFRESH ANTAR TAB
=========================================*/

window.addEventListener("storage", function (event) {

    const keys = [
        KEY_SUPPLIER,
        KEY_STOK,
        KEY_PELANGGAN,
        KEY_PENJUALAN,
        KEY_PENGELUARAN,
        KEY_PIUTANG
    ];

    if (keys.includes(event.key)) {

        refreshDashboard();

    }

});

/*=========================================
    RESET DATA (DEVELOPER)
=========================================*/

function resetSemuaData() {

    if (!konfirmasi("Yakin ingin menghapus semua data?")) {

        return;

    }

    localStorage.removeItem(KEY_SUPPLIER);
    localStorage.removeItem(KEY_STOK);
    localStorage.removeItem(KEY_PELANGGAN);
    localStorage.removeItem(KEY_PENJUALAN);
    localStorage.removeItem(KEY_PENGELUARAN);
    localStorage.removeItem(KEY_PIUTANG);

    initStorage();

    showAlert("Semua data berhasil dihapus.");

    location.reload();

}

/*=========================================
    HITUNG LABA
=========================================*/

function hitungLaba(totalJual, totalModal) {

    return Number(totalJual) - Number(totalModal);

}

/*=========================================
    HITUNG NILAI STOK
=========================================*/

function hitungNilaiStok(jumlahRak, hargaBeli) {

    return Number(jumlahRak) * Number(hargaBeli);

}

/*=========================================
    CEK STOK SUPPLIER
=========================================*/

function cariSupplierStok(namaSupplier) {

    const stok = getStok();

    return stok.find(item => item.supplier === namaSupplier);

}

/*=========================================
    UPDATE STOK SETELAH PENJUALAN
=========================================*/

function kurangiStokSupplier(namaSupplier, jumlahRak) {

    const stok = getStok();

    const index = stok.findIndex(item => item.supplier === namaSupplier);

    if (index === -1) {

        return false;

    }

    const sisa = Number(stok[index].jumlahRak) - Number(jumlahRak);

    if (sisa < 0) {

        showAlert("Stok rak tidak mencukupi.");

        return false;

    }

    stok[index].jumlahRak = sisa;

    saveStok(stok);

    return true;

}

/*=========================================
    INIT APP
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    try {

        refreshDashboard();

    } catch (e) {

        console.log("Dashboard tidak dimuat pada halaman ini.");

    }

});

/*=========================================
    END OF FILE
=========================================*/

console.log("✅ TelurKita Premium V3 Loaded");