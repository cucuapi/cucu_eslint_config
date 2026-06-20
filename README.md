# @cucu/eslint-config

Config **ESLint compartida** de CUCU (flat config, ESLint 9+). **Fuente única** de las reglas
de calidad transversales a TODOS los repos del ecosistema (mobile, backend, paneles, cui-agent).

Mata la dispersión: antes la misma regex anti-voseo estaba copiada como `check-voseo.sh` en 4
repos. Ahora vive **una sola vez**, acá, y todos la heredan.

## Reglas

| Regla | Qué hace |
|---|---|
| `cucu/no-voseo` | Falla si hay **voseo rioplatense** en copy de cara al usuario (string/template/JSX). El cliente es boliviano: **tuteo "tú" siempre**. AST-based → ignora comentarios. Regla dura sellada por Milton. |

La lista de formas prohibidas vive en `lib/voseo.js` (**fuente única**). Forma nueva → se agrega
ahí y se propaga sola a los consumidores en el próximo bump.

## Uso

Flat config del repo consumidor (`eslint.config.js`):

```js
// CommonJS
const cucu = require("@cucu/eslint-config");
module.exports = [ cucu.configs.recommended, /* ...resto */ ];
```

```js
// ESM
import cucu from "@cucu/eslint-config";
export default [ cucu.configs.recommended, /* ...resto */ ];
```

Engancharlo al `lint` que el CI ya corre (cero step/bash aparte):

```jsonc
// package.json
"scripts": { "lint": "eslint ." }
```

## Distribución (git dependency, sin registry)

Repo **privado** `cucuapi/cucu_eslint_config`. Los consumidores lo instalan como dependencia git
(no requiere montar un npm registry privado):

```jsonc
// package.json del consumidor
"devDependencies": {
  "@cucu/eslint-config": "github:cucuapi/cucu_eslint_config#v1.0.0"
}
```

- **Local (devs):** instala por SSH con el acceso que el dev ya tiene a los repos privados de CUCU.
- **CI:** reusar el PAT que el repo ya tiene para gitops (`GITOPS_TOKEN`) via
  `git config url."https://x-access-token:$GITOPS_TOKEN@github.com/".insteadOf "https://github.com/"`
  antes del `npm/yarn install`. **Cero secret nuevo.**

## Silenciar voseo-como-dato

Un archivo que legítimamente lista formas de voseo (un scorer, un diccionario) se silencia
**localizado**, nunca con una exclusión global:

```js
// eslint-disable-next-line cucu/no-voseo
const VOSEO = "podés|tenés|cargá";
```

## Tests

```bash
npm install && npm test   # node --test + RuleTester de ESLint
```
