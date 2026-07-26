// =====================================
// TELURKITA v2.0
// =====================================

document.addEventListener("DOMContentLoaded", () => {

    // ======================
    // SIDEBAR ACTIVE
    // ======================

    const menus = document.querySelectorAll(".sidebar li");

    menus.forEach(menu => {

        menu.addEventListener("click", function () {

            menus.forEach(item => item.classList.remove("active"));

            this.classList.add("active");

        });

    });

    // ======================
    // QUICK ACTION
    // ======================

    const buttons = document.querySelectorAll(".btn");

    buttons.forEach(btn => {

        btn.addEventListener("click", () => {

            console.log("Button :", btn.innerText);

        });

    });

    // ======================
    // GREETING
    // ======================

    let jam = new Date().getHours();

    let salam = "";

    if (jam < 12) {

        salam = "Selamat Pagi ☀️";

    } else if (jam < 15) {

        salam = "Selamat Siang 🌤️";

    } else if (jam < 18) {

        salam = "Selamat Sore 🌥️";

    } else {

        salam = "Selamat Malam 🌙";

    }

    console.log(salam);

    // ======================
    // TANGGAL HARI INI
    // ======================

    const sekarang = new Date();

    const tanggal = sekarang.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    console.log(tanggal);

});

// =====================================
// FUNGSI KE DEPAN
// =====================================

// Dashboard
function dashboard() {

    window.location.href = "index.html";

}

// Stok
function stok() {

    window.location.href = "pages/stok.html";

}

// Penjualan
function penjualan() {

    window.location.href = "pages/penjualan.html";

}

// Supplier
function supplier() {

    window.location.href = "pages/supplier.html";

}

// Pengeluaran
function pengeluaran() {

    window.location.href = "pages/pengeluaran.html";

}

// Piutang
function piutang() {

    window.location.href = "pages/piutang.html";

}

// Laporan
function laporan() {

    window.location.href = "pages/laporan.html";

}

// Pengaturan
function pengaturan() {

    window.location.href = "pages/pengaturan.html";

}