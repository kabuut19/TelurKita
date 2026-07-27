/*====================================
TELURKITA PREMIUM V2
====================================*/

document.addEventListener("DOMContentLoaded", () => {

    initSidebar();

    initClock();

    initChart();

    initDarkMode();

    loadDashboard();

});

/*====================================
SIDEBAR
====================================*/

function initSidebar() {

    const menu = document.getElementById("menuToggle");

    const sidebar = document.querySelector(".sidebar");

    if (!menu || !sidebar) return;

    menu.addEventListener("click", () => {

        sidebar.classList.toggle("active");

    });

}

/*====================================
JAM & TANGGAL
====================================*/

function initClock() {

    const target = document.getElementById("tanggalJam");

    if (!target) return;

    setInterval(() => {

        const now = new Date();

        target.innerHTML = now.toLocaleString("id-ID", {

            weekday: "long",

            day: "numeric",

            month: "long",

            year: "numeric",

            hour: "2-digit",

            minute: "2-digit",

            second: "2-digit"

        });

    }, 1000);

}

/*====================================
DASHBOARD
====================================*/

function loadDashboard() {

    let stok = JSON.parse(localStorage.getItem("dataStok")) || [];

    let penjualan = JSON.parse(localStorage.getItem("dataPenjualan")) || [];

    let pengeluaran = JSON.parse(localStorage.getItem("dataPengeluaran")) || [];

    let piutang = JSON.parse(localStorage.getItem("dataPiutang")) || [];

    let totalRak = 0;

    stok.forEach(item => {

        totalRak += Number(item.rak);

    });

    let omzet = 0;

    penjualan.forEach(item => {

        omzet += Number(item.total);

    });

    let keluar = 0;

    pengeluaran.forEach(item => {

        keluar += Number(item.nominal);

    });

    let hutang = 0;

    piutang.forEach(item => {

        hutang += Number(item.nominal);

    });

    setText("totalStok", totalRak + " Rak");

    setText("ringkasanRak", totalRak);

    setText("penjualanHariIni", rupiah(omzet));

    setText("ringkasanJual", rupiah(omzet));

    setText("pengeluaranHariIni", rupiah(keluar));

    setText("ringkasanKeluar", rupiah(keluar));

    setText("piutangTotal", rupiah(hutang));

    setText("ringkasanPiutang", rupiah(hutang));

    setText("ringkasanLaba", rupiah(omzet - keluar));

}

/*====================================
HELPER
====================================*/

function setText(id, value) {

    const el = document.getElementById(id);

    if (el) {

        el.innerHTML = value;

    }

}

function rupiah(angka) {

    return "Rp " + Number(angka).toLocaleString("id-ID");

}
/*====================================
CHART.JS
====================================*/

function initChart() {

    const canvas = document.getElementById("salesChart");

    if (!canvas) return;

    new Chart(canvas, {

        type: "line",

        data: {

            labels: [

                "Sen",

                "Sel",

                "Rab",

                "Kam",

                "Jum",

                "Sab",

                "Min"

            ],

            datasets: [

                {

                    label: "Penjualan",

                    data: [

                        0,

                        0,

                        0,

                        0,

                        0,

                        0,

                        0

                    ],

                    borderColor: "#f59e0b",

                    backgroundColor: "rgba(245,158,11,.15)",

                    fill: true,

                    tension: .4,

                    borderWidth: 3,

                    pointRadius: 5,

                    pointBackgroundColor: "#f59e0b"

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {

                    display: false

                }

            },

            scales: {

                y: {

                    beginAtZero: true,

                    grid: {

                        color: "#eeeeee"

                    }

                },

                x: {

                    grid: {

                        display: false

                    }

                }

            }

        }

    });

}

/*====================================
DARK MODE
====================================*/

function initDarkMode() {

    const tombol = document.getElementById("darkMode");

    if (!tombol) return;

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark");

    }

    tombol.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem("theme", "dark");

        } else {

            localStorage.setItem("theme", "light");

        }

    });

}

/*====================================
LOADING
====================================*/

window.addEventListener("load", () => {

    const loader = document.querySelector(".loader");

    if (!loader) return;

    setTimeout(() => {

        loader.classList.add("hidden");

    }, 600);

});

/*====================================
NOTIFIKASI
====================================*/

function showToast(pesan) {

    const toast = document.createElement("div");

    toast.innerHTML = pesan;

    toast.style.position = "fixed";

    toast.style.top = "20px";

    toast.style.right = "20px";

    toast.style.background = "#10b981";

    toast.style.color = "#fff";

    toast.style.padding = "12px 18px";

    toast.style.borderRadius = "12px";

    toast.style.boxShadow = "0 10px 20px rgba(0,0,0,.15)";

    toast.style.zIndex = "99999";

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}
/*====================================
AUTO REFRESH DASHBOARD
====================================*/

function refreshDashboard() {

    loadDashboard();

}

window.addEventListener("storage", refreshDashboard);

setInterval(refreshDashboard, 5000);

/*====================================
DATA STOK
====================================*/

function getTotalStok() {

    let data = JSON.parse(localStorage.getItem("dataStok")) || [];

    let total = 0;

    data.forEach(item => {

        total += Number(item.rak);

    });

    return total;

}

/*====================================
DATA PENJUALAN
====================================*/

function getTotalPenjualan() {

    let data = JSON.parse(localStorage.getItem("dataPenjualan")) || [];

    let total = 0;

    data.forEach(item => {

        total += Number(item.total);

    });

    return total;

}

/*====================================
DATA PENGELUARAN
====================================*/

function getTotalPengeluaran() {

    let data = JSON.parse(localStorage.getItem("dataPengeluaran")) || [];

    let total = 0;

    data.forEach(item => {

        total += Number(item.nominal);

    });

    return total;

}

/*====================================
DATA PIUTANG
====================================*/

function getTotalPiutang() {

    let data = JSON.parse(localStorage.getItem("dataPiutang")) || [];

    let total = 0;

    data.forEach(item => {

        total += Number(item.nominal);

    });

    return total;

}

/*====================================
UPDATE RINGKASAN
====================================*/

function updateRingkasan() {

    let stok = getTotalStok();

    let jual = getTotalPenjualan();

    let keluar = getTotalPengeluaran();

    let piutang = getTotalPiutang();

    let laba = jual - keluar;

    setText("totalStok", stok + " Rak");

    setText("ringkasanRak", stok);

    setText("penjualanHariIni", rupiah(jual));

    setText("ringkasanJual", rupiah(jual));

    setText("pengeluaranHariIni", rupiah(keluar));

    setText("ringkasanKeluar", rupiah(keluar));

    setText("piutangTotal", rupiah(piutang));

    setText("ringkasanPiutang", rupiah(piutang));

    setText("ringkasanLaba", rupiah(laba));

}

updateRingkasan();

/*====================================
SALAM
====================================*/

function tampilSalam(){

    const jam = new Date().getHours();

    let salam = "";

    if(jam < 12){

        salam = "Selamat Pagi ☀️";

    }else if(jam < 15){

        salam = "Selamat Siang 🌤️";

    }else if(jam < 18){

        salam = "Selamat Sore 🌥️";

    }else{

        salam = "Selamat Malam 🌙";

    }

    const judul = document.querySelector(".left h2");

    if(judul){

        judul.innerHTML = salam;

    }

}

tampilSalam();
/*====================================
MENU SEARCH
====================================*/

const searchInput = document.querySelector(".search input");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const keyword = this.value.toLowerCase();

        document.querySelectorAll(".sidebar li").forEach(li => {

            li.style.display = li.innerText.toLowerCase().includes(keyword)
                ? ""
                : "none";

        });

    });

}

/*====================================
NOTIFIKASI STOK MENIPIS
====================================*/

function cekStokMenipis() {

    const stok = JSON.parse(localStorage.getItem("dataStok")) || [];

    let total = 0;

    stok.forEach(item => {

        total += Number(item.rak);

    });

    if (total <= 10) {

        showToast("⚠️ Peringatan! Stok telur tinggal " + total + " rak");

    }

}

cekStokMenipis();

/*====================================
EXPORT DATA
====================================*/

function exportData() {

    const data = {

        stok: JSON.parse(localStorage.getItem("dataStok")) || [],

        penjualan: JSON.parse(localStorage.getItem("dataPenjualan")) || [],

        supplier: JSON.parse(localStorage.getItem("dataSupplier")) || [],

        pengeluaran: JSON.parse(localStorage.getItem("dataPengeluaran")) || [],

        piutang: JSON.parse(localStorage.getItem("dataPiutang")) || []

    };

    const blob = new Blob(

        [JSON.stringify(data, null, 2)],

        { type: "application/json" }

    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);

    a.download = "TelurKita_Backup.json";

    a.click();

}

/*====================================
IMPORT DATA
====================================*/

function importData(input) {

    const file = input.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        const data = JSON.parse(e.target.result);

        localStorage.setItem("dataStok", JSON.stringify(data.stok || []));

        localStorage.setItem("dataPenjualan", JSON.stringify(data.penjualan || []));

        localStorage.setItem("dataSupplier", JSON.stringify(data.supplier || []));

        localStorage.setItem("dataPengeluaran", JSON.stringify(data.pengeluaran || []));

        localStorage.setItem("dataPiutang", JSON.stringify(data.piutang || []));

        showToast("✅ Data berhasil dipulihkan");

        setTimeout(() => {

            location.reload();

        }, 1000);

    };

    reader.readAsText(file);

}

/*====================================
HAPUS SEMUA DATA
====================================*/

function resetData() {

    if (!confirm("Yakin ingin menghapus seluruh data?")) return;

    localStorage.clear();

    showToast("🗑️ Semua data berhasil dihapus");

    setTimeout(() => {

        location.reload();

    }, 1000);

}

/*====================================
LOGOUT
====================================*/

function logout() {

    if (!confirm("Keluar dari aplikasi?")) return;

    showToast("👋 Sampai jumpa!");

    setTimeout(() => {

        location.href = "index.html";

    }, 1000);

}

/*====================================
VERSI
====================================*/

console.log(
"%cTelurKita Premium V2",
"background:#f59e0b;color:white;padding:8px 12px;border-radius:6px;font-weight:bold;"
);

console.log("Versi : 2.0.0");
console.log("Developer : Wahyudi & ChatGPT");