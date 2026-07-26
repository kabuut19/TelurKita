// ==============================
// TELURKITA APP
// ==============================

document.addEventListener("DOMContentLoaded", function () {

    // Menu aktif
    const menu = document.querySelectorAll(".sidebar li");

    menu.forEach(item => {

        item.addEventListener("click", function () {

            menu.forEach(i => i.classList.remove("active"));

            this.classList.add("active");

        });

    });

    // Tombol Aksi Cepat
    const tombol = document.querySelectorAll(".quick-action button");

    tombol.forEach(btn => {

        btn.addEventListener("click", function () {

            alert("Fitur ini sedang dibuat 😊");

        });

    });

});