"use strict";
const test = require("node:test");
const { RuleTester } = require("eslint");
const rule = require("../rules/no-voseo.js");

const ruleTester = new RuleTester({
  languageOptions: { ecmaVersion: 2024, sourceType: "module" },
});

test("cucu/no-voseo", () => {
  ruleTester.run("no-voseo", rule, {
    valid: [
      // tuteo boliviano correcto
      { code: 'const t = "Inicia sesión, puedes cotizar enseguida";' },
      { code: "const t = `Cuéntame qué necesitas comprar`;" },
      // el voseo dentro de un comentario NO se reporta (AST ignora comentarios)
      { code: "// podés tenés cargá\nconst t = 1;" },
      // identificadores que casualmente contienen una subcadena no se reportan
      { code: "const usado = true;" },
      // palabra tuteo que comparte raíz con una voseo (límite Unicode)
      { code: 'const t = "usa la app, abre el menú";' },
    ],
    invalid: [
      {
        code: 'const t = "Iniciá sesión";',
        errors: [{ messageId: "voseo" }],
      },
      {
        // un nodo con voseo → un report por nodo (basta para fallar el lint)
        code: "const t = `Cargá tu comprobante al toque`;",
        errors: [{ messageId: "voseo" }],
      },
      {
        // "al toque" (multipalabra) también cae
        code: 'const t = "lo hacemos al toque";',
        errors: [{ messageId: "voseo" }],
      },
      {
        code: 'const t = "necesitás revisar esto";',
        errors: [{ messageId: "voseo" }],
      },
    ],
  });
});
