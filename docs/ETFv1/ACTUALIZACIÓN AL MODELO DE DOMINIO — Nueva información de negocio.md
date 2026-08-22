# ACTUALIZACIÓN AL MODELO DE DOMINIO — Nueva información de negocio [ORIGEN: dueña del parqueadero, verbal]


## 1. Qué me confirmacion (interpretado)

1. **Los clientes mensuales tienen acceso libre**: pueden entrar y salir con su vehículo las veces que quieran, sin límite ni cobro adicional por movimiento. Esto ya estaba implícito en el concepto de "mensualidad", pero ahora queda confirmado explícitamente como regla de negocio.
2. **La tarifa real para visitantes hoy NO es por hora**: es una **tarifa plana por día completo = $3.000 COP**, sin importar cuántas horas permanezca el vehículo.
3. **Está abierta a cobrar por horas también** — es decir, el sistema debe soportar ambas modalidades de tarifa (día completo y por hora), aunque hoy solo se use la primera.

## 2. Impacto en el modelo de dominio

### `Tarifa` — ahora tiene una modalidad de cálculo

Antes asumí (implícitamente) que la tarifa era siempre "por hora". Eso era una suposición incorrecta de mi parte, corregida con tu información real. Actualizo:

| Atributo nuevo | Valor |
|---|---|
| `ModalidadCobro` (Value Object / enum) | `POR_DIA` \| `POR_HORA` |
| `MontoPorDia` | usado cuando `ModalidadCobro = POR_DIA` (hoy: $3.000) |
| `MontoPorHora` | usado cuando `ModalidadCobro = POR_HORA` (aún no tiene valor real — pendiente si se activa esta modalidad) |
| `TopeMaximoDiario` | ya estaba contemplado para la modalidad por hora (evita que cobrar por hora supere el costo del día completo) |

`Tarifa` sigue siendo versionada en el tiempo (RN6 no cambia), solo que ahora cada versión de tarifa declara **qué modalidad aplica** para ese `TipoVehiculo` en ese período de vigencia.

**RECOMENDACIÓN:** el `CalculadorDeCobro` (antes lo llamé `CalculadorDeCobroPorHoras`, lo renombro a `CalculadorDeCobro` porque ya no es solo horas) debe:
- Si la tarifa vigente es `POR_DIA`: cobrar un monto fijo por cada día calendario (o por cada 24h — **ver decisión pendiente 10** abajo) que el vehículo permanezca, sin importar fracciones de hora.
- Si la tarifa vigente es `POR_HORA`: calcular por fracción de hora con tope diario, como se había definido.

Esto es exactamente el tipo de decisión que Strategy Pattern resuelve bien (dos formas de calcular el mismo caso de uso, seleccionadas por el tipo de tarifa vigente) — se detalla en Fase 4/5, no aquí.

### `Movimiento` — se confirma el alcance, con un matiz importante

Tu aclaración confirma la **Alternativa A** de la `[DECISIÓN PENDIENTE 7]`: una sola entidad `Movimiento` con `hora_salida` nullable sirve perfectamente, tanto para visitantes (con cobro) como, potencialmente, para clientes mensuales (sin cobro, solo control de acceso). **Doy por resuelta esa decisión pendiente.**

Pero esto abre una pregunta nueva:

`[DECISIÓN PENDIENTE 10]` **¿Los clientes mensuales generan un registro de `Movimiento` cada vez que entran/salen, o el acceso libre significa que no se registra nada?**
- Alternativa A: sí se registra `Movimiento` para el cliente mensual (sin `CalcularCobro`), útil para saber quién está físicamente en el parqueadero en un momento dado y para ocupación real del espacio.
- Alternativa B: no se registra nada para clientes mensuales — el acceso libre significa que ni siquiera se lleva control de entrada/salida, y `Movimiento` solo aplica a visitantes.
- RECOMENDACIÓN: Alternativa A, **solo si** existe un límite físico real de espacio (ver decisión pendiente 8 sobre cupos, aún abierta). Si el espacio es informal (los clientes se acomodan como pueden, sin cupos numerados ni límite estricto), entonces Alternativa B es más simple y evita registrar datos que nadie va a usar — sería sobreingeniería. **Necesito tu respuesta sobre si hay un límite real de cupos/espacio físico** (esta es la misma pregunta de la decisión pendiente 8 de la Fase 2, que sigue sin resolver y ahora es más relevante).

`[DECISIÓN PENDIENTE 11]` **¿"Día completo" significa día calendario (cambia a medianoche) o 24 horas desde el ingreso?** Esto afecta directamente el cálculo de cobro para visitantes. Ejemplo: un visitante entra a las 11pm y sale a la 1am del día siguiente — ¿paga 1 día o 2?
- RECOMENDACIÓN: 24 horas desde el ingreso (o fracción), es más justo para el cliente y más fácil de calcular sin ambigüedad de "medianoche". Pero es tu negocio, tú decides.

## 3. Reglas de negocio actualizadas

| # | Regla | Origen |
|---|---|---|
| RN7 (actualizada) | Un cliente mensual con mensualidad activa tiene acceso libre e ilimitado, sin cobro por movimiento. | dueña |
| RN12 (nueva) | La tarifa de visitantes por defecto es plana por día completo ($3.000 COP actual); el sistema debe permitir configurar una modalidad alternativa por hora sin afectar tarifas históricas ya aplicadas (RN6 se mantiene). | dueña |
| RN13 (nueva) | El monto de tarifa por día y por hora son valores independientes y configurables por el Administrador (caso de uso `ConfigurarTarifa`), no un valor fijo en código. | RECOMENDACIÓN |

## 4. Esto no cambia la Fase 2 aprobada, la extiende

Los actores, casos de uso, bounded contexts, entidades y relaciones de la Fase 2 siguen siendo válidos. Solo se ajustan los atributos de `Tarifa` y se resuelve la decisión pendiente 7. El resto de decisiones pendientes de las Fases 1 y 2 (fechas, automatización perdida, cupos físicos, retiro de cliente con saldo, autoservicio) **siguen abiertas**.

---

