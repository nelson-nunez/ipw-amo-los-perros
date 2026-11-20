"use strict";

// #region Referencias al DOM
const formContacto = $("formContacto");
const txtNombre = $("txtNombre");
const txtEmail = $("txtEmail");
const selMotivo = $("selMotivo");
const txtMensaje = $("txtMensaje");
const contadorMensaje = $("contadorMensaje");
const infoMotivo = $("infoMotivo");
const mensajeEstado = $("mensajeEstado");
const btnLimpiar = $("btnLimpiar");
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

// #region Motivos
function mostrarInfoMotivo() {
    infoMotivo.replaceChildren();
    if (selMotivo.value !== "adopcion") return;

    infoMotivo.append("Antes de escribirnos, mirá las fichas de los animales disponibles en ");

    const enlace = document.createElement("a");
    enlace.href = "en-adopcion.html";
    enlace.textContent = "En adopción";
    infoMotivo.append(enlace, ".");
}
// #endregion

// #region Validaciones
function soloLetras(valor) {
    return /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ ]+$/.test(valor);
}

function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(valor);
}

// Devuelven el error, o "" si es valido
function validarNombre() {
    const nombre = txtNombre.value.trim();
    if (!nombre) return "El nombre y apellido es obligatorio.";
    if (nombre.length < 3) return "Debe tener al menos 3 caracteres.";
    if (!soloLetras(nombre)) return "Solo admite letras y espacios.";
    return "";
}

function validarEmail() {
    const email = txtEmail.value.trim();
    if (!email) return "El correo electrónico es obligatorio.";
    if (!emailValido(email)) return "Escribí un correo válido, por ejemplo nombre@correo.com.";
    return "";
}

function validarMotivo() {
    if (!selMotivo.value) return "Elegí el motivo de tu consulta.";
    return "";
}

/*function validarMotivo() {
    if (!selMotivo.value) return "Elegí el motivo de tu consulta.";
    return "";
} 
}function validarMotivo() {
    if (!selMotivo.value) return "Elegí el motivo de tu consulta.";
    return "";
}
*/
function validarMensaje() {
    const mensaje = txtMensaje.value.trim();
    if (!mensaje) return "Contanos en qué te podemos ayudar.";
    if (mensaje.length < 10) return "El mensaje debe tener al menos 10 caracteres.";
    return "";
}

const campos = [
    { el: txtNombre, validar: validarNombre },
    { el: txtEmail, validar: validarEmail },
    { el: selMotivo, validar: validarMotivo },
    { el: txtMensaje, validar: validarMensaje }
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
// #endregion

// #region Acciones
function actualizarContadorMensaje() {
    const cantidad = txtMensaje.value.length;
    const unidad = cantidad === 1 ? "carácter" : "caracteres";
    contadorMensaje.textContent = `${cantidad} ${unidad}`;
}

function limpiarFormulario(conservarMensaje = false) {
    formContacto.reset();
    for (const campo of campos) mostrarError(campo.el, "");

    actualizarContadorMensaje();
    mostrarInfoMotivo();
    if (!conservarMensaje) mostrarMensaje("");
}
// #endregion

// #region Eventos
function configurarResaltado(campo) {
    campo.addEventListener("focus", () => campo.classList.add("enfocado"));
    campo.addEventListener("blur", () => campo.classList.remove("enfocado"));
}

function configurarValidacion(campo) {
    campo.el.addEventListener("blur", () => validarCampo(campo));

    // Revalida mientras corrige
    campo.el.addEventListener("input", () => {
        if (campo.el.getAttribute("aria-invalid") === "true") validarCampo(campo);
    });
}

formContacto.querySelectorAll("input, select, textarea").forEach(configurarResaltado);
campos.forEach(configurarValidacion);

txtMensaje.addEventListener("input", actualizarContadorMensaje);
selMotivo.addEventListener("change", mostrarInfoMotivo);
btnLimpiar.addEventListener("click", () => limpiarFormulario());

// No hay servidor: solo confirmamos en pantalla
formContacto.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    mostrarMensaje("¡Gracias! Te vamos a responder a la brevedad.");
    limpiarFormulario(true);
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") mostrarMensaje("");
});
// #endregion

// #region Inicio
document.addEventListener("DOMContentLoaded", () => {
    actualizarContadorMensaje();
    mostrarInfoMotivo();
});
// #endregion
