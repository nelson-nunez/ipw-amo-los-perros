"use strict";

// #region Referencias al DOM
const $ = (id) => document.getElementById(id);

const fechaActual = $("fechaActual");
const btnMenu = $("btnMenu");
const btnArriba = $("btnArriba");
// #endregion

// #region Fechas
// aaaa-mm-dd
function fechaHoy() {
    const hoy = new Date();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");
    return `${hoy.getFullYear()}-${mes}-${dia}`;
}

// aaaa-mm-dd -> dd/mm/aaaa
function formatearFecha(fecha) {
    return fecha.split("-").reverse().join("/");
}

function mostrarFechaActual() {
    if (!fechaActual) return;
    fechaActual.textContent = `Hoy es ${formatearFecha(fechaHoy())}`;
}
// #endregion

// #region Menu
function alternarMenu() {
    if (!btnMenu) return;

    const nav = btnMenu.closest("nav");
    const abierto = nav.classList.toggle("abierto");
    btnMenu.setAttribute("aria-expanded", String(abierto));
}

// Escape cierra el menu y vuelve al boton
function cerrarMenu(e) {
    if (!btnMenu || e.key !== "Escape") return;

    const nav = btnMenu.closest("nav");
    if (!nav.classList.contains("abierto")) return;

    nav.classList.remove("abierto");
    btnMenu.setAttribute("aria-expanded", "false");
    btnMenu.focus();
}
// #endregion

// #region Volver up
function mostrarBotonArriba() {
    if (!btnArriba) return;
    btnArriba.classList.toggle("visible", window.scrollY > 400);
}

function subirAlInicio() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
// #endregion

// #region Eventos
if (btnMenu) btnMenu.addEventListener("click", alternarMenu);
document.addEventListener("keydown", cerrarMenu);

if (btnArriba) {
    btnArriba.addEventListener("click", subirAlInicio);
    window.addEventListener("scroll", mostrarBotonArriba);
}
// #endregion

// #region Inicio
document.addEventListener("DOMContentLoaded", () => {
    mostrarFechaActual();
    mostrarBotonArriba();
});
// #endregion
