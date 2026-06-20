"use strict";
/**
 * @cucu/eslint-config — config ESLint compartida de CUCU (flat config, ESLint 9+).
 *
 * Fuente ÚNICA de reglas transversales a TODOS los repos (mobile, backend, paneles, cui-agent).
 * Hoy: `cucu/no-voseo` (tuteo boliviano). Mañana: lo que sea transversal. Se agrega ACÁ una vez
 * y lo heredan todos — cero dispersión.
 *
 * Uso (flat config del consumidor):
 *   const cucu = require("@cucu/eslint-config");      // CommonJS
 *   module.exports = [ cucu.configs.recommended, ...resto ];
 *
 *   import cucu from "@cucu/eslint-config";            // ESM (interop default)
 *   export default [ cucu.configs.recommended, ...resto ];
 */
const noVoseo = require("./rules/no-voseo.js");
const { VOSEO_WORDS, VOSEO_REGEX } = require("./lib/voseo.js");

const plugin = {
  meta: { name: "@cucu/eslint-config", version: "1.0.0" },
  rules: { "no-voseo": noVoseo },
};

const recommended = {
  name: "cucu/recommended",
  plugins: { cucu: plugin },
  rules: { "cucu/no-voseo": "error" },
};

module.exports = {
  plugin,
  configs: { recommended },
  // exportados para tooling/diagnóstico — la fuente sigue siendo lib/voseo.js
  VOSEO_WORDS,
  VOSEO_REGEX,
};
