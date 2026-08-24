# docs/context — memoria técnica del proyecto

> Última actualización: 2026-08-24 · Basado en commit `fd8253d`

Esta carpeta es la **memoria de largo plazo** del proyecto: un conjunto de documentos versionados en Git que describen, con evidencia rastreable, qué es YourParking, cómo está construido, qué reglas sigue y qué le falta. Está pensada para humanos y para agentes de IA (Claude Code, Codex, OpenCode u otros) que trabajen sobre el repo sin re-analizarlo desde cero.

## Cómo usarla

Empieza siempre por [context-index.md](context-index.md): tabla maestra con qué contiene cada documento, cuándo leerlo y su prioridad.

## Convenciones internas

1. **Estados de conocimiento**: cada afirmación relevante lleva una etiqueta:
   - `[CONFIRMADO]` — verificado leyendo código/config (con referencia a archivo).
   - `[DOCUMENTADO]` — declarado en docs/README/comentarios pero sin verificación en implementación.
   - `[INFERIDO]` — conclusión por patrones, no declarada en ningún lado.
   - `[RECOMENDACIÓN]` — propuesta futura; NO forma parte del sistema actual y va siempre separada.
2. **Metadatos**: cada documento abre con fecha de última actualización y commit base.
3. **Sin duplicación**: los documentos se referencian entre sí por enlace relativo en lugar de repetir contenido.
4. **Actualización incremental**: ante cambios del repo no se regenera todo; se actualizan solo los documentos impactados y se registra en [changelog-context.md](changelog-context.md). Estrategia completa descrita allí.

## Nota para agentes de IA

> Antes de realizar cualquier cambio en este repositorio, analiza `docs/context/`, comenzando por `context-index.md`. Comprende la arquitectura y el dominio existentes antes de proponer modificaciones. Respeta las convenciones documentadas en `conventions.md`. Si encuentras una contradicción entre este contexto y el código actual, **el código es la fuente de verdad**: actualiza el contexto siguiendo la estrategia de actualización incremental descrita en este mismo directorio, en lugar de ignorarla.

## Desviaciones respecto a la estructura genérica propuesta

Se mantuvo la estructura completa de 18 documentos porque la espec ETFv1 aporta contenido real para todos (no hay archivos triviales). Única adaptación menor: las recomendaciones se concentran dentro de `decisions.md` y `known-issues.md` en secciones marcadas `[RECOMENDACIÓN]`, en lugar de dispersarse.
