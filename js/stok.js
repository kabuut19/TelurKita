/*==================================================
    TELURKITA PREMIUM V3
    stok.js
==================================================*/

/*=========================================
    DATA STOK
=========================================*/

let stokData = getStok();

let supplierData = getSupplier();

/*=========================================
    ELEMEN
=========================================*/

const stokTable = document.getElementById("stokTable");

const btnSimpanStok = document.getElementById("btnSimpanStok");

const cariStok = document.getElementById("cariStok");

/*=========================================
    INPUT
=========================================*/

const stokId = document.getElementById("stokId");

const supplierStok = document.getElementById("supplierStok");

const jumlahRak = document.getElementById("jumlahRak");

const hargaBeli = document.getElementById("hargaBeli");

const tanggalMasuk = document.getElementById("tanggalMasuk");

const keteranganStok = document.getElementById("keteranganStok");

/*=========================================
    MODAL
=========================================*/

const modalStok = new bootstrap.Modal(

    document.getElementById("modalStok")

);

/*=========================================
    LOAD AWAL
=========================================*/

loadDropdownSupplier();

loadStok();

loadStatistik();

/*=========================================
    EVENT
=========================================*/

btnSimpanStok.addEventListener(

    "click",

    simpanStok

);

if (cariStok) {

    cariStok.addEventListener("keyup", function () {

        loadStok(this.value);

    });

}

/*=========================================
    TANGGAL HARI INI
=========================================*/

if (tanggalMasuk) {

    tanggalMasuk.value = new Date()

        .toISOString()

        .split("T")[0];

}
/*=========================================
    LOAD DROPDOWN SUPPLIER
=========================================*/

function loadDropdownSupplier() {

    supplierData = getSupplier();

    supplierStok.innerHTML = `
        <option value="">
            -- Pilih Supplier --
        </option>
    `;

    supplierData
        .filter(item => item.status === "Aktif")
        .forEach(item => {

            supplierStok.innerHTML += `
                <option value="${item.nama}">
                    ${item.nama}
                </option>
            `;

        });

}

/*=========================================
    SIMPAN STOK
=========================================*/

function simpanStok() {

    const id = stokId.value;

    const supplier = supplierStok.value;

    const rak = Number(jumlahRak.value);

    const harga = Number(hargaBeli.value);

    const tanggal = tanggalMasuk.value;

    const keterangan = keteranganStok.value.trim();

    /*=========================
        VALIDASI
    =========================*/

    if (supplier === "") {

        showAlert("Silakan pilih supplier.");

        supplierStok.focus();

        return;

    }

    if (rak <= 0 || isNaN(rak)) {

        showAlert("Jumlah rak harus lebih dari 0.");

        jumlahRak.focus();

        return;

    }

    if (harga <= 0 || isNaN(harga)) {

        showAlert("Harga beli tidak valid.");

        hargaBeli.focus();

        return;

    }

    /*=========================
        MODE EDIT
    =========================*/

    if (id !== "") {

        const index = stokData.findIndex(

            item => item.id == id

        );

        if (index !== -1) {

            stokData[index].supplier = supplier;

            stokData[index].jumlahRak = rak;

            stokData[index].hargaBeli = harga;

            stokData[index].tanggalMasuk = tanggal;

            stokData[index].keterangan = keterangan;

        }

    }

    /*=========================
        MODE TAMBAH
    =========================*/

    else {

        const index = stokData.findIndex(

            item => item.supplier === supplier

        );

        if (index !== -1) {

            /*=====================
                TAMBAH RAK
            =====================*/

            stokData[index].jumlahRak += rak;

            stokData[index].hargaBeli = harga;

            stokData[index].tanggalMasuk = tanggal;

            stokData[index].keterangan = keterangan;

        }

        else {

            stokData.push({

                id: generateID(),

                supplier: supplier,

                jumlahRak: rak,

                hargaBeli: harga,

                tanggalMasuk: tanggal,

                keterangan: keterangan

            });

        }

    }

    /*=========================
        SIMPAN
    =========================*/

    saveStok(stokData);

    loadStok();

    loadStatistik();

    refreshDashboard();

    resetFormStok();

    modalStok.hide();

    showAlert("Data stok berhasil disimpan.");

}

/*=========================================
    RESET FORM
=========================================*/

function resetFormStok() {

    stokId.value = "";

    supplierStok.value = "";

    jumlahRak.value = "";

    hargaBeli.value = "";

    tanggalMasuk.value = new Date()

        .toISOString()

        .split("T")[0];

    keteranganStok.value = "";

}

/*=========================================
    MODAL TAMBAH
=========================================*/

const tombolTambahStok = document.querySelector(

    '[data-bs-target="#modalStok"]'

);

if (tombolTambahStok) {

    tombolTambahStok.addEventListener("click", () => {

        resetFormStok();

        document.querySelector(

            "#modalStok .modal-title"

        ).textContent = "📦 Tambah Stok";

    });

}
/*=========================================
    LOAD DATA STOK
=========================================*/

function loadStok(keyword = "") {

    stokData = getStok();

    stokTable.innerHTML = "";

    let no = 1;

    const dataFilter = stokData.filter(item =>

        item.supplier.toLowerCase().includes(keyword.toLowerCase())

    );

    if (dataFilter.length === 0) {

        stokTable.innerHTML = `

        <tr>

            <td colspan="8" class="text-center py-5">

                Belum ada data stok

            </td>

        </tr>

        `;

        return;

    }

    dataFilter.forEach(item => {

        const totalNilai =
            Number(item.jumlahRak) *
            Number(item.hargaBeli);

        stokTable.innerHTML += `

        <tr>

            <td>${no++}</td>

            <td>

                <strong>${item.supplier}</strong>

            </td>

            <td class="text-center">

                ${angka(item.jumlahRak)} Rak

            </td>

            <td class="text-end">

                ${rupiah(item.hargaBeli)}

            </td>

            <td class="text-end">

                ${rupiah(totalNilai)}

            </td>

            <td class="text-center">

                ${item.tanggalMasuk}

            </td>

            <td>

                ${item.keterangan || "-"}

            </td>

            <td class="text-center">

                <button
                    class="btn btn-sm btn-warning"
                    onclick="editStok(${item.id})">

                    <i class="bi bi-pencil"></i>

                </button>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="hapusStok(${item.id})">

                    <i class="bi bi-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

}

/*=========================================
    LOAD STATISTIK
=========================================*/

function loadStatistik() {

    stokData = getStok();

    supplierData = getSupplier();

    let totalRak = 0;

    let totalNilai = 0;

    let lastUpdate = "-";

    stokData.forEach(item => {

        totalRak += Number(item.jumlahRak || 0);

        totalNilai +=

            Number(item.jumlahRak || 0) *

            Number(item.hargaBeli || 0);

        if (item.tanggalMasuk > lastUpdate) {

            lastUpdate = item.tanggalMasuk;

        }

    });

    document.getElementById("totalRak").textContent =
        angka(totalRak);

    document.getElementById("nilaiPersediaan").textContent =
        rupiah(totalNilai);

    document.getElementById("jumlahSupplier").textContent =
        angka(stokData.length);

    const sumRak = document.getElementById("sumRak");
    if (sumRak) sumRak.textContent = angka(totalRak);

    const sumSupplier = document.getElementById("sumSupplier");
    if (sumSupplier) sumSupplier.textContent = angka(stokData.length);

    const sumNilai = document.getElementById("sumNilai");
    if (sumNilai) sumNilai.textContent = rupiah(totalNilai);

    const update = document.getElementById("lastUpdate");
    if (update) update.textContent = lastUpdate;

}

/*=========================================
    REFRESH HALAMAN
=========================================*/

function refreshStokPage() {

    loadDropdownSupplier();

    loadStok();

    loadStatistik();

}
/*=========================================
    EDIT STOK
=========================================*/

function editStok(id) {

    stokData = getStok();

    const data = stokData.find(item => item.id == id);

    if (!data) return;

    stokId.value = data.id;

    supplierStok.value = data.supplier;

    jumlahRak.value = data.jumlahRak;

    hargaBeli.value = data.hargaBeli;

    tanggalMasuk.value = data.tanggalMasuk;

    keteranganStok.value = data.keterangan || "";

    document.querySelector(
        "#modalStok .modal-title"
    ).textContent = "✏ Edit Stok";

    modalStok.show();

}

/*=========================================
    HAPUS STOK
=========================================*/

function hapusStok(id) {

    stokData = getStok();

    const data = stokData.find(item => item.id == id);

    if (!data) return;

    if (!konfirmasi(

        `Hapus data stok supplier "${data.supplier}" ?`

    )) {

        return;

    }

    stokData = stokData.filter(item => item.id != id);

    saveStok(stokData);

    refreshStokPage();

    refreshDashboard();

    showAlert("Data stok berhasil dihapus.");

}

/*=========================================
    RESET MODAL
=========================================*/

const modalStokElement = document.getElementById("modalStok");

if (modalStokElement) {

    modalStokElement.addEventListener(

        "hidden.bs.modal",

        () => {

            resetFormStok();

        }

    );

}

/*=========================================
    AUTO REFRESH ANTAR TAB
=========================================*/

window.addEventListener("storage", function (event) {

    if (event.key === KEY_STOK) {

        refreshStokPage();

    }

});

/*=========================================
    REFRESH SETELAH PERUBAHAN
=========================================*/

function selesaiUpdateStok() {

    refreshStokPage();

    refreshDashboard();

}
/*=========================================
    VALIDASI INPUT ANGKA
=========================================*/

jumlahRak.addEventListener("input", function () {

    if (Number(this.value) < 0) {

        this.value = "";

    }

});

hargaBeli.addEventListener("input", function () {

    if (Number(this.value) < 0) {

        this.value = "";

    }

});

/*=========================================
    ENTER UNTUK SIMPAN
=========================================*/

document.addEventListener("keydown", function (e) {

    if (e.key !== "Enter") return;

    const modalAktif = document
        .getElementById("modalStok")
        .classList.contains("show");

    if (!modalAktif) return;

    e.preventDefault();

    simpanStok();

});

/*=========================================
    REFRESH DROPDOWN SUPPLIER
=========================================*/

window.addEventListener("storage", function (event) {

    if (event.key === KEY_SUPPLIER) {

        loadDropdownSupplier();

    }

});

/*=========================================
    LOAD PERTAMA
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    refreshStokPage();

});

/*=========================================
    FINAL CHECK
=========================================*/

function cekStokKosong() {

    stokData = getStok();

    if (stokData.length === 0) {

        console.log("Belum ada data stok.");

        return;

    }

}

/*=========================================
    SINKRONISASI DASHBOARD
=========================================*/

function sinkronDashboard() {

    try {

        refreshDashboard();

    } catch (e) {

        console.log("Dashboard tidak aktif.");

    }

}

/*=========================================
    AUTO SINKRONISASI
=========================================*/

function selesaiSimpanStok() {

    refreshStokPage();

    sinkronDashboard();

}

/*=========================================
    AUTO LOAD
=========================================*/

cekStokKosong();

console.log("📦 Modul Stok Premium V3 siap digunakan.");

/*=========================================
    END OF FILE
=========================================*/