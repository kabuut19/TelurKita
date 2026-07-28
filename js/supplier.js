/*==================================================
    TELURKITA PREMIUM V3
    supplier.js
==================================================*/

/*=========================================
    DATA SUPPLIER
=========================================*/

let supplierData = getSupplier();

/*=========================================
    ELEMEN
=========================================*/

const supplierTable = document.getElementById("supplierTable");

const btnSimpan = document.getElementById("btnSimpanSupplier");

const cariSupplier = document.getElementById("cariSupplier");

/*=========================================
    MODAL
=========================================*/

const modalSupplier = new bootstrap.Modal(

    document.getElementById("modalSupplier")

);

/*=========================================
    INPUT
=========================================*/

const inputId = document.getElementById("supplierId");

const inputNama = document.getElementById("namaSupplier");

const inputHP = document.getElementById("hpSupplier");

const inputPIC = document.getElementById("picSupplier");

const inputAlamat = document.getElementById("alamatSupplier");

const inputStatus = document.getElementById("statusSupplier");

const inputKet = document.getElementById("ketSupplier");

/*=========================================
    LOAD DATA
=========================================*/

loadSupplier();

loadStatistik();

/*=========================================
    SIMPAN
=========================================*/

btnSimpan.addEventListener("click", simpanSupplier);
/*=========================================
    SIMPAN SUPPLIER
=========================================*/

function simpanSupplier() {

    const id = inputId.value;

    const nama = inputNama.value.trim();
    const hp = inputHP.value.trim();
    const pic = inputPIC.value.trim();
    const alamat = inputAlamat.value.trim();
    const status = inputStatus.value;
    const keterangan = inputKet.value.trim();

    /*=========================
        VALIDASI
    =========================*/

    if (nama === "") {

        showAlert("Nama supplier wajib diisi.");

        inputNama.focus();

        return;

    }

    if (hp === "") {

        showAlert("Nomor HP wajib diisi.");

        inputHP.focus();

        return;

    }

    /*=========================
        CEK DUPLIKAT
    =========================*/

    const duplicate = supplierData.find(item =>

        item.nama.toLowerCase() === nama.toLowerCase() &&
        item.id != id

    );

    if (duplicate) {

        showAlert("Nama supplier sudah digunakan.");

        return;

    }

    /*=========================
        EDIT
    =========================*/

    if (id !== "") {

        const index = supplierData.findIndex(

            item => item.id == id

        );

        supplierData[index] = {

            ...supplierData[index],

            nama,
            hp,
            pic,
            alamat,
            status,
            keterangan

        };

    }

    /*=========================
        TAMBAH
    =========================*/

    else {

        supplierData.push({

            id: generateID(),

            nama,

            hp,

            pic,

            alamat,

            status,

            keterangan,

            tanggal: new Date()

                .toISOString()

                .split("T")[0]

        });

    }

    /*=========================
        SIMPAN
    =========================*/

    saveSupplier(supplierData);

    loadSupplier();

    loadStatistik();

    refreshDashboard();

    resetForm();

    modalSupplier.hide();

    showAlert("Data supplier berhasil disimpan.");

}

/*=========================================
    RESET FORM
=========================================*/

function resetForm() {

    inputId.value = "";

    inputNama.value = "";

    inputHP.value = "";

    inputPIC.value = "";

    inputAlamat.value = "";

    inputStatus.value = "Aktif";

    inputKet.value = "";

}

/*=========================================
    MODAL TAMBAH
=========================================*/

const tombolTambah = document.querySelector(

    '[data-bs-target="#modalSupplier"]'

);

if (tombolTambah) {

    tombolTambah.addEventListener("click", () => {

        resetForm();

        document.querySelector(

            "#modalSupplier .modal-title"

        ).textContent = "🚚 Tambah Supplier";

    });

}
/*=========================================
    LOAD DATA SUPPLIER
=========================================*/

function loadSupplier(keyword = "") {

    supplierData = getSupplier();

    const stokData = getStok();

    supplierTable.innerHTML = "";

    let no = 1;

    const dataFilter = supplierData.filter(item =>

        item.nama.toLowerCase().includes(keyword.toLowerCase()) ||

        item.hp.toLowerCase().includes(keyword.toLowerCase()) ||

        item.pic.toLowerCase().includes(keyword.toLowerCase())

    );

    if (dataFilter.length === 0) {

        supplierTable.innerHTML = `

        <tr>

            <td colspan="8" class="text-center py-5">

                Belum ada data supplier

            </td>

        </tr>

        `;

        return;

    }

    dataFilter.forEach(item => {

        /*=========================
            HITUNG JUMLAH RAK
        =========================*/

        let totalRak = 0;

        stokData.forEach(stok => {

            if (stok.supplier === item.nama) {

                totalRak += Number(stok.jumlahRak || 0);

            }

        });

        const badgeStatus = item.status === "Aktif"

            ? '<span class="badge-success">Aktif</span>'

            : '<span class="badge-danger">Non Aktif</span>';

        supplierTable.innerHTML += `

        <tr>

            <td>${no++}</td>

            <td>

                <strong>${item.nama}</strong>

            </td>

            <td>${item.hp}</td>

            <td>${item.pic}</td>

            <td class="text-center">

                ${angka(totalRak)} Rak

            </td>

            <td class="text-center">

                ${badgeStatus}

            </td>

            <td>${item.keterangan || "-"}</td>

            <td class="text-center">

                <button

                    class="btn btn-sm btn-warning"

                    onclick="editSupplier(${item.id})">

                    <i class="bi bi-pencil"></i>

                </button>

                <button

                    class="btn btn-sm btn-danger"

                    onclick="hapusSupplier(${item.id})">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

/*=========================================
    STATISTIK SUPPLIER
=========================================*/

function loadStatistik() {

    supplierData = getSupplier();

    const stokData = getStok();

    const totalSupplier = supplierData.length;

    const supplierAktif = supplierData.filter(

        item => item.status === "Aktif"

    ).length;

    const supplierNonAktif = supplierData.filter(

        item => item.status === "Non Aktif"

    ).length;

    let totalRak = 0;

    stokData.forEach(item => {

        totalRak += Number(item.jumlahRak || 0);

    });

    document.getElementById("totalSupplierCard").textContent =

        angka(totalSupplier);

    document.getElementById("supplierAktif").textContent =

        angka(supplierAktif);

    document.getElementById("supplierNonAktif").textContent =

        angka(supplierNonAktif);

    document.getElementById("totalRakSupplier").textContent =

        angka(totalRak);

}

/*=========================================
    PENCARIAN
=========================================*/

if (cariSupplier) {

    cariSupplier.addEventListener("keyup", function () {

        loadSupplier(this.value);

    });

}
/*=========================================
    EDIT SUPPLIER
=========================================*/

function editSupplier(id) {

    supplierData = getSupplier();

    const supplier = supplierData.find(item => item.id == id);

    if (!supplier) return;

    inputId.value = supplier.id;

    inputNama.value = supplier.nama;

    inputHP.value = supplier.hp;

    inputPIC.value = supplier.pic;

    inputAlamat.value = supplier.alamat;

    inputStatus.value = supplier.status;

    inputKet.value = supplier.keterangan;

    document.querySelector(
        "#modalSupplier .modal-title"
    ).textContent = "✏ Edit Supplier";

    modalSupplier.show();

}

/*=========================================
    HAPUS SUPPLIER
=========================================*/

function hapusSupplier(id) {

    supplierData = getSupplier();

    const supplier = supplierData.find(item => item.id == id);

    if (!supplier) return;

    /*=================================
        CEK MASIH ADA STOK
    =================================*/

    const stok = getStok();

    const masihAdaStok = stok.some(item =>

        item.supplier === supplier.nama &&
        Number(item.jumlahRak) > 0

    );

    if (masihAdaStok) {

        showAlert(
            "Supplier tidak dapat dihapus karena masih memiliki stok."
        );

        return;

    }

    /*=================================
        CEK PERNAH DIPAKAI PENJUALAN
    =================================*/

    const penjualan = getPenjualan();

    const pernahDipakai = penjualan.some(item =>

        item.supplier === supplier.nama

    );

    if (pernahDipakai) {

        showAlert(
            "Supplier tidak dapat dihapus karena sudah memiliki riwayat penjualan."
        );

        return;

    }

    /*=================================
        KONFIRMASI
    =================================*/

    if (!konfirmasi(
        `Hapus supplier "${supplier.nama}" ?`
    )) {

        return;

    }

    supplierData = supplierData.filter(item => item.id != id);

    saveSupplier(supplierData);

    loadSupplier();

    loadStatistik();

    refreshDashboard();

    showAlert("Supplier berhasil dihapus.");

}

/*=========================================
    REFRESH DATA
=========================================*/

window.addEventListener("storage", () => {

    supplierData = getSupplier();

    loadSupplier();

    loadStatistik();

});

/*=========================================
    LOAD PERTAMA
=========================================*/

loadSupplier();

loadStatistik();
/*=========================================
    RESET FORM SAAT MODAL DITUTUP
=========================================*/

const modalElement = document.getElementById("modalSupplier");

if (modalElement) {

    modalElement.addEventListener("hidden.bs.modal", () => {

        resetForm();

    });

}

/*=========================================
    ENTER UNTUK SIMPAN
=========================================*/

document.addEventListener("keydown", function (e) {

    if (e.key !== "Enter") return;

    const modalAktif = document
        .getElementById("modalSupplier")
        .classList.contains("show");

    if (!modalAktif) return;

    e.preventDefault();

    simpanSupplier();

});

/*=========================================
    VALIDASI NOMOR HP
=========================================*/

inputHP.addEventListener("input", function () {

    this.value = this.value.replace(/[^0-9]/g, "");

});

/*=========================================
    VALIDASI NAMA SUPPLIER
=========================================*/

inputNama.addEventListener("blur", function () {

    this.value = this.value.trim();

});

/*=========================================
    AUTO UPPERCASE PIC
=========================================*/

inputPIC.addEventListener("input", function () {

    this.value = this.value.replace(/\b\w/g, function (huruf) {

        return huruf.toUpperCase();

    });

});

/*=========================================
    REFRESH HALAMAN
=========================================*/

function refreshSupplierPage() {

    supplierData = getSupplier();

    loadSupplier();

    loadStatistik();

    refreshDashboard();

}

/*=========================================
    LOAD PERTAMA
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    refreshSupplierPage();

});

/*=========================================
    END FILE
=========================================*/

console.log("✅ Supplier Premium V3 Loaded");