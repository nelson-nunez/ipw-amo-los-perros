"use strict";

// #region Referencias al DOM
const tbodyTransito = $("tbodyTransito");
const tbodyAdopcion = $("tbodyAdopcion");
const tbodyTratamientos = $("tbodyTratamientos");
const tbodyCastraciones = $("tbodyCastraciones");
const tfootCastraciones = $("tfootCastraciones");
const tbodyMovimientos = $("tbodyMovimientos");
const tfootMovimientos = $("tfootMovimientos");
const selEspecie = $("selEspecie");
const infoFiltro = $("infoFiltro");
const totalPendiente = $("totalPendiente");
// #endregion

// #region Formato
function formatearMoneda(monto) {
    return monto.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

function textoEdad(edad) {
    const unidad = edad === 1 ? "año" : "años";
    if (edad >= EDAD_MAXIMA) return `${edad} ${unidad} (adulto mayor)`;
    return `${edad} ${unidad}`;
}

function agregarFilaVacia(tbody, columnas, texto) {
    const fila = tbody.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = columnas;
    celda.textContent = texto;
}
// #endregion

// #region Tabla
// Dibuja los perros que estan en transito
function dibujarTransito() {
    if (!tbodyTransito) return;

    tbodyTransito.replaceChildren();
    const lista = animales.filter((a) => a.estado === "transito" || a.estado === "tratamiento");

    if (lista.length === 0) {
        agregarFilaVacia(tbodyTransito, 7, "Todavía no hay animales en tránsito.");
        return;
    }

    lista.forEach((animal) => {
        const fila = tbodyTransito.insertRow();
        fila.insertCell().textContent = animal.nombre;
        fila.insertCell().textContent = ESPECIES[animal.especie].nombre;
        fila.insertCell().textContent = textoEdad(animal.edad);
        fila.insertCell().textContent = animal.sexo;
        fila.insertCell().textContent = animal.tamanio;
        fila.insertCell().textContent = animal.hogar;
        fila.insertCell().textContent = ESTADOS[animal.estado].nombre;
    });
}

function dibujarAdopcion(especie = "") {
    if (!tbodyAdopcion) return;

    tbodyAdopcion.replaceChildren();
    const enAdopcion = animales.filter((a) => a.estado === "adopcion");
    const filtrados = especie ? enAdopcion.filter((a) => a.especie === especie) : enAdopcion;

    if (filtrados.length === 0) {
        agregarFilaVacia(tbodyAdopcion, 6, "No hay animales que coincidan con el filtro.");
        actualizarInfoFiltro(0);
        return;
    }

    filtrados.forEach((animal) => {
        const fila = tbodyAdopcion.insertRow();
        fila.insertCell().textContent = animal.nombre;
        fila.insertCell().textContent = ESPECIES[animal.especie].nombre;
        fila.insertCell().textContent = textoEdad(animal.edad);
        fila.insertCell().textContent = animal.sexo;
        fila.insertCell().textContent = animal.tamanio;
        fila.insertCell().textContent = animal.hogar;
    });

    actualizarInfoFiltro(filtrados.length);
}

function dibujarTratamientos() {
    if (!tbodyTratamientos) return;

    tbodyTratamientos.replaceChildren();

    if (tratamientos.length === 0) {
        agregarFilaVacia(tbodyTratamientos, 5, "Todavía no hay tratamientos cargados.");
        return;
    }

    tratamientos.forEach((t) => {
        const fila = tbodyTratamientos.insertRow();
        fila.insertCell().textContent = t.animal;
        fila.insertCell().textContent = t.problema;
        fila.insertCell().textContent = t.tratamiento;
        fila.insertCell().textContent = formatearMoneda(t.costo);
        fila.insertCell().textContent = t.estado;
    });
}

function mostrarTotalPendiente() {
    if (!totalPendiente) return;

    const pendientes = tratamientos.filter((t) => t.estado !== "Finalizado");
    const total = pendientes.reduce((suma, t) => suma + t.costo, 0);
    totalPendiente.textContent = `Nos faltan reunir ${formatearMoneda(total)} para cubrir ${pendientes.length} tratamientos en curso.`;
}

function dibujarCastraciones() {
    if (!tbodyCastraciones) return;

    tbodyCastraciones.replaceChildren();
    tfootCastraciones.replaceChildren();

    let totalPerros = 0;
    let totalGatos = 0;

    // recorre las filas de la tabal
    castraciones.forEach((mes) => {
        totalPerros += mes.perros;
        totalGatos += mes.gatos;

        const fila = tbodyCastraciones.insertRow();
        fila.insertCell().textContent = mes.mes;
        fila.insertCell().textContent = mes.perros;
        fila.insertCell().textContent = mes.gatos;
        fila.insertCell().textContent = mes.perros + mes.gatos;
    });

    const filaTotal = tfootCastraciones.insertRow();
    filaTotal.insertCell().textContent = "Totales del año";
    filaTotal.insertCell().textContent = totalPerros;
    filaTotal.insertCell().textContent = totalGatos;
    filaTotal.insertCell().textContent = totalPerros + totalGatos;
}

function agregarTotalMovimientos(concepto, monto) {
    const fila = tfootMovimientos.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = 3;
    celda.textContent = concepto;
    fila.insertCell().textContent = formatearMoneda(monto);
}

function sumarMovimientos(tipo) {
    return movimientos.filter((m) => m.tipo === tipo).reduce((suma, m) => suma + m.monto, 0);
}

function dibujarMovimientos() {
    if (!tbodyMovimientos) return;

    tbodyMovimientos.replaceChildren();
    tfootMovimientos.replaceChildren();

    movimientos.forEach((m) => {
        const fila = tbodyMovimientos.insertRow();
        fila.className = m.tipo;
        fila.insertCell().textContent = formatearFecha(m.fecha);
        fila.insertCell().textContent = m.concepto;
        fila.insertCell().textContent = m.tipo === "ingreso" ? "Ingreso" : "Gasto";
        fila.insertCell().textContent = formatearMoneda(m.monto);
    });

    const ingresos = sumarMovimientos("ingreso");
    const gastos = sumarMovimientos("gasto");
    agregarTotalMovimientos("Total de ingresos", ingresos);
    agregarTotalMovimientos("Total de gastos", gastos);
    agregarTotalMovimientos("Saldo disponible", ingresos - gastos);
}
// #endregion

// #region Filtro
function actualizarInfoFiltro(cantidad) {
    if (!infoFiltro) return;

    if (cantidad === 1) {
        infoFiltro.textContent = "Se encontró 1 animal.";
        return;
    }

    infoFiltro.textContent = `Se encontraron ${cantidad} animales.`;
}

function filtrarPorEspecie() {
    dibujarAdopcion(selEspecie.value);
}
// #endregion

// #region Eventos
function configurarResaltado(tbody) {
    if (!tbody) return;

    tbody.addEventListener("mouseover", (e) => {
        const fila = e.target.closest("tr");
        if (fila && !fila.querySelector("td[colspan]")) fila.classList.add("resaltada");
    });

    tbody.addEventListener("mouseout", (e) => {
        const fila = e.target.closest("tr");
        if (fila) fila.classList.remove("resaltada");
    });
}

[tbodyTransito, tbodyAdopcion, tbodyTratamientos, tbodyCastraciones, tbodyMovimientos].forEach(configurarResaltado);

if (selEspecie) selEspecie.addEventListener("change", filtrarPorEspecie);
// #endregion

// #region Inicio
document.addEventListener("DOMContentLoaded", () => {
    dibujarTransito();
    dibujarAdopcion();
    dibujarTratamientos();
    mostrarTotalPendiente();
    dibujarCastraciones();
    dibujarMovimientos();
});
// #endregion
