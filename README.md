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

Repo **público** `cucuapi/cucu_eslint_config` (es solo una config de lint — cero IP/secreto, como
airbnb/standard). Los consumidores lo instalan como dependencia git, **sin token ni registry**:

```jsonc
// package.json del consumidor
"devDependencies": {
  "@cucu/eslint-config": "github:cucuapi/cucu_eslint_config#v1.0.0"
}
```

- **Local y CI:** `npm ci`/`yarn` lo clona sin auth (repo público). El CI del consumidor **no
  necesita ningún secret nuevo**.
- Versionado por **tag** (`#v1.0.0`). Bump = mover el tag en el consumidor (o `#main` para seguir HEAD).

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
