"use strict";

// #region Constantes
const CUOTA_MINIMA = 3000;
const EDAD_MAXIMA = 8;
const NOMBRE_MIN = 3;
const TELEFONO_MIN = 8;
const TELEFONO_MAX = 13;
// #endregion

// #region Catalogos
const ESPECIES = {
    perro: { nombre: "Perro" },
    gato: { nombre: "Gato" }
};

const ESTADOS = {
    transito: { nombre: "En tránsito", descripcion: "Vive en una casa de familia hasta encontrar hogar definitivo." },
    adopcion: { nombre: "En adopción", descripcion: "Está sano, castrado y listo para irse con su familia." },
    tratamiento: { nombre: "En tratamiento", descripcion: "Está recibiendo atención veterinaria antes de darse en adopción." },
    adoptado: { nombre: "Adoptado", descripcion: "Ya encontró familia y sigue en seguimiento." }
};

const CATEGORIAS = {
    colaborador: { nombre: "Socio colaborador", descripcion: "Aporte mensual que sostiene el alimento y los insumos del refugio." },
    padrino: { nombre: "Padrino", descripcion: "Acompañás el tratamiento de un animal hasta que esté listo para adopción." },
    unico: { nombre: "Donante único", descripcion: "Una sola donación, sin compromiso mensual." }
};
// #endregion

// #region Animales
// nombre, especie, edad, sexo, tamaño, estado, hogar, foto
const animales = [
    { nombre: "Luna", especie: "perro", edad: 3, sexo: "Hembra", tamanio: "Mediano", estado: "adopcion", hogar: "Hogar de Ana", foto: "img/adopcion-luna.jpg" },
    { nombre: "Toby", especie: "perro", edad: 1, sexo: "Macho", tamanio: "Mediano", estado: "adopcion", hogar: "Hogar de Marcos", foto: "img/adopcion-toby.jpg" },
    { nombre: "Milo", especie: "perro", edad: 4, sexo: "Macho", tamanio: "Grande", estado: "adopcion", hogar: "Refugio", foto: "img/adopcion-milo.jpg" },
    { nombre: "Nala", especie: "perro", edad: 9, sexo: "Hembra", tamanio: "Grande", estado: "adopcion", hogar: "Hogar de Clara", foto: "img/adopcion-nala.jpg" },
    { nombre: "Rocco", especie: "perro", edad: 6, sexo: "Macho", tamanio: "Pequeño", estado: "adopcion", hogar: "Hogar de Julia", foto: "img/adopcion-rocco.jpg" },
    { nombre: "Michi", especie: "gato", edad: 5, sexo: "Macho", tamanio: "Mediano", estado: "adopcion", hogar: "Hogar de Pablo", foto: "img/adopcion-michi.jpg" },
    { nombre: "Pelusa", especie: "gato", edad: 2, sexo: "Hembra", tamanio: "Pequeño", estado: "transito", hogar: "Hogar de Vero", foto: "" },
    { nombre: "Simba", especie: "gato", edad: 1, sexo: "Macho", tamanio: "Pequeño", estado: "transito", hogar: "Hogar de Diego", foto: "" },
    { nombre: "Bruno", especie: "perro", edad: 5, sexo: "Macho", tamanio: "Grande", estado: "transito", hogar: "Hogar de Sofía", foto: "" },
    { nombre: "Kira", especie: "perro", edad: 2, sexo: "Hembra", tamanio: "Mediano", estado: "tratamiento", hogar: "Veterinaria Las Patitas", foto: "" },
    { nombre: "Nina", especie: "gato", edad: 10, sexo: "Hembra", tamanio: "Mediano", estado: "tratamiento", hogar: "Hogar de Vero", foto: "" },
    { nombre: "Coco", especie: "perro", edad: 7, sexo: "Macho", tamanio: "Pequeño", estado: "adoptado", hogar: "Familia Gómez", foto: "" }
];
// #endregion

// #region Tratamientos
// animal, problema, tratamiento, costo, estado
const tratamientos = [
    { animal: "Kira", problema: "Fractura en la pata trasera", tratamiento: "Cirugía y rehabilitación", costo: 185000, estado: "En curso" },
    { animal: "Nina", problema: "Insuficiencia renal", tratamiento: "Dieta especial y medicación mensual", costo: 42000, estado: "Pendiente" },
    { animal: "Bruno", problema: "Sarna sarcóptica", tratamiento: "Baños medicados y antiparasitario", costo: 28000, estado: "Finalizado" },
    { animal: "Pelusa", problema: "Infección ocular", tratamiento: "Antibiótico y control semanal", costo: 15500, estado: "Pendiente" },
    { animal: "Milo", problema: "Leishmaniasis en control", tratamiento: "Medicación diaria y análisis cada 6 meses", costo: 96000, estado: "En curso" }
];
// #endregion

// #region Castraciones
// mes, perros, gatos
const castraciones = [
    { mes: "Enero", perros: 18, gatos: 12 },
    { mes: "Febrero", perros: 15, gatos: 14 },
    { mes: "Marzo", perros: 22, gatos: 19 },
    { mes: "Abril", perros: 26, gatos: 21 },
    { mes: "Mayo", perros: 24, gatos: 17 },
    { mes: "Junio", perros: 19, gatos: 15 },
    { mes: "Julio", perros: 17, gatos: 13 },
    { mes: "Agosto", perros: 23, gatos: 20 },
    { mes: "Septiembre", perros: 28, gatos: 24 },
    { mes: "Octubre", perros: 31, gatos: 27 },
    { mes: "Noviembre", perros: 29, gatos: 25 },
    { mes: "Diciembre", perros: 16, gatos: 11 }
];
// #endregion

// #region Movimientos
// fecha, concepto, tipo, monto
const movimientos = [
    { fecha: "2026-03-05", concepto: "Cuotas de socios de marzo", tipo: "ingreso", monto: 148000 },
    { fecha: "2026-03-12", concepto: "Alimento balanceado (300 kg)", tipo: "gasto", monto: 92500 },
    { fecha: "2026-04-02", concepto: "Rifa solidaria de otoño", tipo: "ingreso", monto: 215000 },
    { fecha: "2026-04-18", concepto: "Insumos veterinarios", tipo: "gasto", monto: 76400 },
    { fecha: "2026-05-09", concepto: "Donación de la panadería del barrio", tipo: "ingreso", monto: 60000 },
    { fecha: "2026-05-23", concepto: "Jornada de castración (quirófano móvil)", tipo: "gasto", monto: 134000 },
    { fecha: "2026-06-07", concepto: "Venta de artículos en la feria", tipo: "ingreso", monto: 88300 },
    { fecha: "2026-06-21", concepto: "Medicación para tratamientos", tipo: "gasto", monto: 103700 },
    { fecha: "2026-07-04", concepto: "Padrinos de animales en tratamiento", tipo: "ingreso", monto: 96000 },
    { fecha: "2026-07-19", concepto: "Arreglo de caniles del refugio", tipo: "gasto", monto: 58900 }
];
// #endregion

// #region Socios
// nombre, categoria, monto
const socios = [
    { nombre: "M. L.", categoria: "colaborador", monto: 6000 },
    { nombre: "J. P.", categoria: "padrino", monto: 12000 },
    { nombre: "A. R.", categoria: "colaborador", monto: 4500 },
    { nombre: "S. G.", categoria: "unico", monto: 25000 }
];
// #endregion
