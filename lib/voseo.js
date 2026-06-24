"use strict";
/**
 * FUENTE ÚNICA de la regla anti-voseo de CUCU.
 *
 * Regla dura sellada por Milton: el cliente es boliviano y RECHAZA el voseo rioplatense.
 * Español boliviano con tuteo "tú" SIEMPRE. Una forma nueva → se agrega ACÁ (y se propaga
 * sola a todos los repos que consumen @cucu/eslint-config). NO duplicar esta lista en ningún
 * otro lado (esa dispersión —misma regex en N repos— es justo lo que este paquete elimina).
 *
 * Doctrina: el voseo se distingue por la TILDE en la última sílaba (iniciá/intentá/cargá).
 * Por eso la lista usa formas ACENTUADAS — evita falsos positivos con tuteo (usa/inicia) y con
 * siglas como "SOS"/"vos" que un match desacentuado dispararía mal.
 */

// Imperativos / 2ª persona voseo (terminación acentuada) + enclíticos inequívocos + multipalabra.
const VOSEO_WORDS = [
  // presente indicativo 2ª pers. voseo (-ás/-és/-ís)
  "podés", "tenés", "querés", "sabés", "hacés", "ponés", "necesitás",
  "escaneás", "pagás", "cotizás", "seleccionás",
  // imperativos voseo (acento en la última sílaba)
  "iniciá", "escribí", "mirá", "mandá", "contactá", "reintentá", "esperá",
  "revisá", "cotizá", "registrá", "tocá", "probá", "seguí", "volvé", "intentá",
  "cargá", "agregá", "pedí", "buscá", "mostrá", "guardá", "subí", "sumá", "dejá",
  "llamá", "ingresá", "completá", "confirmá", "verificá", "descargá", "compartí",
  "abrí", "cerrá", "usá", "aceptá", "continuá", "elegí", "andá", "vení", "poné",
  "hacé", "decí", "comprá", "vendé", "enviá", "seleccioná", "escogé", "deslizá",
  "presioná", "apretá", "actualizá", "configurá", "editá", "eliminá", "borrá",
  "creá", "generá", "calculá", "pagá", "escaneá", "tené", "comé", "conseguí",
  "entrá", "entrás", "subite", "bajate",
  // ciclo de pedido / catálogo mayorista (dominio CUCU)
  "despachá", "entregá", "cancelá", "marcá", "publicá", "despublicá", "reservá",
  // moderación / admin
  "aprobá", "rechazá", "moderá", "gestioná", "asigná", "suspendé", "habilitá",
  // imperativos voseo con enclítico (inequívocos, bajo riesgo de falso positivo)
  "fijate", "contame", "decime", "mandame", "mostrame", "escribime", "dejame",
  "pasame", "avisame", "llevate",
  // multipalabra
  "al toque",
];

// Límites de palabra Unicode-aware: \b falla con tildes (á/é/í no son \w). Lookarounds con
// \p{L} (cualquier letra Unicode) sí respetan los bordes de "iniciá", "necesitás", etc.
const VOSEO_REGEX = new RegExp(
  "(?<!\\p{L})(?:" + VOSEO_WORDS.join("|") + ")(?!\\p{L})",
  "iu"
);

module.exports = { VOSEO_WORDS, VOSEO_REGEX };
