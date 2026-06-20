"use strict";
const { VOSEO_REGEX } = require("../lib/voseo.js");

/**
 * Regla ESLint `cucu/no-voseo` — prohíbe voseo rioplatense en copy de cara al usuario.
 *
 * AST-based: inspecciona SOLO string literales, template strings y texto JSX — por diseño
 * IGNORA comentarios y nombres de identificadores (a diferencia de un grep, que tenía que
 * excluir comentarios a mano). Corre en el editor (subrayado en vivo) y en el `lint` del CI.
 *
 * Si un archivo legítimamente CONTIENE voseo como dato (p.ej. un scorer/diccionario que lista
 * las formas prohibidas), se silencia con `// eslint-disable-next-line cucu/no-voseo` en esa
 * línea — explícito y localizado, no una exclusión global escondida.
 */
module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Prohíbe voseo rioplatense en copy de cara al usuario (regla dura CUCU: tuteo boliviano 'tú').",
      recommended: true,
    },
    schema: [],
    messages: {
      voseo:
        'Voseo detectado: "{{match}}". El cliente es boliviano — usar tuteo "tú" (ver doctrina CUCU).',
    },
  },
  create(context) {
    function check(node, text) {
      if (typeof text !== "string" || text.length === 0) return;
      const m = text.match(VOSEO_REGEX);
      if (m) {
        context.report({ node, messageId: "voseo", data: { match: m[0] } });
      }
    }
    return {
      Literal(node) {
        if (typeof node.value === "string") check(node, node.value);
      },
      TemplateElement(node) {
        check(node, node.value && (node.value.cooked ?? node.value.raw));
      },
      JSXText(node) {
        check(node, node.value);
      },
    };
  },
};
