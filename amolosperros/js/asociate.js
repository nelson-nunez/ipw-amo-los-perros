"use strict";

// #region Referencias al DOM
const formSocio = $("formSocio");
const txtNombre = $("txtNombre");
const txtEmail = $("txtEmail");
const txtTelefono = $("txtTelefono");
const selCategoria = $("selCategoria");
const txtMonto = $("txtMonto");
const txtFecha = $("txtFecha");
const chkCondiciones = $("chkCondiciones");
const contadorNombre = $("contadorNombre");
const infoCategoria = $("infoCategoria");
const mensajeEstado = $("mensajeEstado");
const btnLimpiar = $("btnLimpiar");
const tbodySocios = $("tbodySocios");
const tfootSocios = $("tfootSocios");
const infoCategorias = $("infoCategorias");
// #endregion

// #region Mensajes
function mostrarMensaje(texto, esError = false) {
    mensajeEstado.textContent = texto;
    mensajeEstado.classList.toggle("error", esError);
}

function mostrarError(input, texto) {
    $("err-" + input.id).textContent = texto;

    if (texto) {
        input.setAttribute("aria-invalid", "true");
    } else {
        input.removeAttribute("aria-invalid");
    }
}
// #endregion

// #region Categorias
function mostrarInfoCategoria() {
    const categoria = CATEGORIAS[selCategoria.value];
    if (!categoria) {
        infoCategoria.textContent = "";
        return;
    }

    infoCategoria.textContent = categoria.descripcion;
}

function contarPorCategoria(clave) {
    return socios.filter((s) => s.categoria === clave).length;
}

function mostrarContadorCategorias() {
    const partes = Object.keys(CATEGORIAS).map((clave) => `${CATEGORIAS[clave].nombre}: ${contarPorCategoria(clave)}`);
    infoCategorias.textContent = partes.join(" - ");
}
// #endregion

// #region Validaciones
function soloLetras(valor) {
    return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/.test(valor);
}

// valdia el mail
function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(valor);
}

function telefonoValido(valor) {
    return new RegExp(`^\\d{${TELEFONO_MIN},${TELEFONO_MAX}}$`).test(valor);
}

function estaAsociado(email) {
    return socios.some((s) => s.email === email);
}

// Devuelven el error, o "" si es valido
function validarNombre() {
    const nombre = txtNombre.value.trim();
    if (!nombre) return "El nombre y apellido es obligatorio.";
    if (nombre.length < NOMBRE_MIN) return `Debe tener al menos ${NOMBRE_MIN} caracteres.`;
    if (!soloLetras(nombre)) return "Solo admite letras y espacios.";
    return "";
}

function validarEmail() {
    const email = txtEmail.value.trim();
    if (!email) return "El correo electrónico es obligatorio.";
    if (!emailValido(email)) return "Escribí un correo válido, por ejemplo nombre@correo.com.";
    return "";
}

function validarTelefono() {
    const telefono = txtTelefono.value.trim();
    if (!telefono) return "El teléfono es obligatorio.";
    if (!telefonoValido(telefono)) return `El teléfono debe tener entre ${TELEFONO_MIN} y ${TELEFONO_MAX} dígitos numéricos.`;
    return "";
}

function validarCategoria() {
    if (!selCategoria.value) return "Elegí con qué categoría querés colaborar.";
    return "";
}

function validarMonto() {
    const monto = Number(txtMonto.value);
    if (!txtMonto.value.trim()) return "El monto del aporte es obligatorio.";
    if (monto < CUOTA_MINIMA) return `El aporte mínimo es de ${CUOTA_MINIMA} pesos.`;
    return "";
}

function validarFecha() {
    if (!txtFecha.value) return "Indicá desde qué fecha querés colaborar.";
    return "";
}

function validarCondiciones() {
    if (!chkCondiciones.checked) return "Debés aceptar el uso de tus datos para poder asociarte.";
    return "";
}

const campos = [
    { el: txtNombre, validar: validarNombre },
    { el: txtEmail, validar: validarEmail },
    { el: txtTelefono, validar: validarTelefono },
    { el: selCategoria, validar: validarCategoria },
    { el: txtMonto, validar: validarMonto },
    { el: txtFecha, validar: validarFecha },
    { el: chkCondiciones, validar: validarCondiciones }
];

function validarCampo(campo) {
    const mensaje = campo.validar();
    mostrarError(campo.el, mensaje);
    return mensaje === "";
}

function validarFormulario() {
    const invalidos = campos.filter((campo) => !validarCampo(campo));
    return invalidos.length === 0;
}

// Duplicado
function validarReglasNegocio(email) {
    if (estaAsociado(email)) {
        return "Ese correo ya está registrado como socio o donante.";
    }
    return "";
}
// #endregion

// #region Tabla
// Nelson Nuñez -> N. N.
function iniciales(nombre) {
    return nombre.trim().split(/\s+/).map((palabra) => `${palabra[0].toUpperCase()}.`).join(" ");
}

function calcularTotalRecaudado() {
    return socios.reduce((suma, s) => suma + s.monto, 0);
}

function formatearPesos(monto) {
    return monto.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
}

function agregarFilaVacia() {
    const fila = tbodySocios.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = 3;
    celda.textContent = "Todavía no hay socios ni donantes registrados.";
}

function agregarFila(socio) {
    const fila = tbodySocios.insertRow();
    fila.insertCell().textContent = iniciales(socio.nombre);
    fila.insertCell().textContent = CATEGORIAS[socio.categoria].nombre;
    fila.insertCell().textContent = formatearPesos(socio.monto);
}

function actualizarTotalSocios() {
    tfootSocios.replaceChildren();

    const fila = tfootSocios.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = 2;
    celda.textContent = "Total recaudado";
    fila.insertCell().textContent = formatearPesos(calcularTotalRecaudado());
}

function actualizarTabla() {
    tbodySocios.replaceChildren();

    if (socios.length === 0) {
        agregarFilaVacia();
    } else {
        socios.forEach(agregarFila);
    }

    actualizarTotalSocios();
    mostrarContadorCategorias();
}
// #endregion

// #region Acciones
// TODO: ordenar los socios por categoria
function registrarSocio() {
    const email = txtEmail.value.trim();

    const mensaje = validarReglasNegocio(email);
    if (mensaje) {
        mostrarMensaje(mensaje, true);
        return false;
    }

    socios.push({
        nombre: txtNombre.value.trim(),
        email,
        telefono: txtTelefono.value.trim(),
        categoria: selCategoria.value,
        monto: Number(txtMonto.value),
        fecha: txtFecha.value
    });
    actualizarTabla();
    mostrarMensaje(`Gracias por sumarte como ${CATEGORIAS[selCategoria.value].nombre}.`);
    return true;
}

function actualizarContadorNombre() {
    const cantidad = txtNombre.value.length;
    const unidad = cantidad === 1 ? "carácter" : "caracteres";
    contadorNombre.textContent = `${cantidad} ${unidad}`;
}

function limpiarFormulario(conservarMensaje = false) {
    formSocio.reset();
    for (const campo of campos) mostrarError(campo.el, "");

    txtFecha.value = fechaHoy();
    actualizarContadorNombre();
    mostrarInfoCategoria();
    if (!conservarMensaje) { mostrarMensaje(""); }
}
// #endregion

// #region Eventos
function configurarResaltado(input) {
    input.addEventListener("focus", () => input.classList.add("enfocado"));
    input.addEventListener("blur", () => input.classList.remove("enfocado"));
}

function configurarValidacion(campo) {
    campo.el.addEventListener("blur", () => validarCampo(campo));

    // Revalida mientras corrige
    campo.el.addEventListener("input", () => {
        if (campo.el.getAttribute("aria-invalid") === "true") validarCampo(campo);
    });
}

formSocio.querySelectorAll("input, select").forEach(configurarResaltado);
campos.forEach(configurarValidacion);

// Solo digitos
txtTelefono.addEventListener("input", () => {
    txtTelefono.value = txtTelefono.value.replace(/\D/g, "");
});

txtNombre.addEventListener("input", actualizarContadorNombre);
selCategoria.addEventListener("change", mostrarInfoCategoria);
btnLimpiar.addEventListener("click", () => limpiarFormulario());

formSocio.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    if (registrarSocio()) limpiarFormulario(true);
});

// Resaltado de filas
tbodySocios.addEventListener("mouseover", (e) => {
    const fila = e.target.closest("tr");
    if (fila && !fila.querySelector("td[colspan]")) fila.classList.add("resaltada");
});

tbodySocios.addEventListener("mouseout", (e) => {
    const fila = e.target.closest("tr");
    if (fila) fila.classList.remove("resaltada");
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") mostrarMensaje("");
});
// #endregion

// #region Inicio
document.addEventListener("DOMContentLoaded", () => {
    txtFecha.value = fechaHoy();
    actualizarContadorNombre();
    mostrarInfoCategoria();
    actualizarTabla();
    // console.log(socios);
});
// #endregion
