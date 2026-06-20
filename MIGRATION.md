# Migración a `@cucu/eslint-config` — tracker de adopción

Objetivo: que la regla anti-voseo (y futuras reglas transversales) viva en **una sola fuente**
(este paquete) y no como `check-voseo.sh` copiado en N repos. Estado al **2026-06-20**.

## Estado por consumidor

| Repo | ESLint previo | Estado | Nota |
|---|---|---|---|
| `cucu_mobile` | ✅ sí (expo lint + CI) | ✅ **MIGRADO** | dep `#v1.0.0`, `cucu.configs.recommended` en `eslint.config.js`, bash borrado, step CI borrado, CLAUDE.md actualizado. Verificado: regla dispara + `npm run lint` exit 0. |
| `cui-agent-service` | ✅ sí (`eslint src`) | ⏳ pendiente | Tiene eslint → conversión directa, **con wrinkles** (abajo). Hoy guarda con el **scorer Mastra runtime** (`anti-voseo.ts`) + el fix estático de `webhook.routes.ts` ya hecho. |
| `cucu_medusa_mayoristas` | ❌ no | ⏳ pendiente | **Montar ESLint 9 flat** desde cero. Bash `check-voseo.sh` queda como guarda interina. |
| `cucu_medusa_backend` | ❌ no | ⏳ pendiente | **Montar ESLint 9 flat** desde cero. Bash `check-voseo.sh` (agregado 2026-06-20) queda como guarda interina. |

## Runbook por repo

### Consumidor que YA tiene ESLint (patrón `cucu_mobile`, aplica a `cui-agent-service`)
1. `package.json` devDep: `"@cucu/eslint-config": "github:cucuapi/cucu_eslint_config#v1.0.0"`.
2. `eslint.config.*`: agregar `cucu.configs.recommended` al array flat (require/import del paquete).
3. `npm install` (actualiza lock; repo público → sin token).
4. Verificar: probe con voseo dispara `cucu/no-voseo` + `npm run lint` exit 0 en el repo real.
5. Borrar `scripts/check-voseo.sh`, el script `gate:voseo` y el step bash del CI (el voseo ya vive en `npm run lint`).

**Wrinkle `cui-agent-service`:** hay voseo legítimo **como dato** (no es copy) que hay que silenciar
localizado, NO con exclusión global:
- `src/core/mastra/scorers/anti-voseo.ts` (lista de formas) → `// eslint-disable-next-line cucu/no-voseo` por línea de literal.
- `src/core/agent-mastra.ts` (instrucción de reescritura que enumera formas prohibidas) → idem.
- `src/core/guardrails.ts`, `src/core/canned-config.ts`, `src/channels/whatsapp/onboarding.ts`: son **comentarios** → la regla ya los ignora (AST), no tocar.
- `src/channels/whatsapp/meta-send-tools.ts` (descripciones de tools que el LLM lee: "Usá esto…", "ofrecés…") → **arreglar a tuteo** (además reduce que el LLM imite el voseo del prompt), no silenciar.

### Consumidor SIN ESLint (`cucu_medusa_mayoristas`, `cucu_medusa_backend`)
1. Montar **ESLint 9 flat** acorde al proyecto:
   - mayoristas (Vite React TS): `eslint`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`.
   - backend (Medusa Node TS): `eslint`, `typescript-eslint`.
2. `eslint.config.js` flat con `cucu.configs.recommended` + las reglas base del proyecto.
3. devDep del paquete (`#v1.0.0`), `"lint": "eslint ."` en scripts.
4. CI: reemplazar el step `bash scripts/check-voseo.sh` por `npm run lint`; borrar el bash + `gate:voseo`.
5. Verificar lint exit 0 (arreglar lo que aparezca — puede haber más que voseo al estrenar eslint).

## Bump de versión
Forma nueva de voseo → editar `lib/voseo.js` acá, `npm test`, tag nuevo (`v1.x.0`), y mover el
`#v1.x.0` en cada consumidor (o usar `#main` para seguir HEAD en repos que lo prefieran).
