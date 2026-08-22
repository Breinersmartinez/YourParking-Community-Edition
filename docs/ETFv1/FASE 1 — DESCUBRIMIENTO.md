# FASE 1 — DESCUBRIMIENTO

## 1. Resumen del negocio [ORIGEN: Excel]

Es un parqueadero mediano (aprox. 20-30 clientes activos por mes, todos motos) que opera con **mensualidades**. El archivo tiene una hoja por mes (Enero–Junio 2025), una hoja "Deudores", y dos hojas con botones sin funcionalidad real embebida en el archivo ("Actualizar Hoja Deudores", "Generador de hojas"), más una hoja "Resumen Financiero" que está **completamente vacía** (sin datos, sin fórmulas, sin gráfico).

No hay evidencia en el archivo de: parqueo por horas, visitantes, control de cupos/espacios físicos, usuarios, roles/permisos, auditoría, ni backups. Todo eso proviene únicamente del documento de requerimientos — es decir, son funcionalidades **nuevas**, no una digitalización de algo existente.

## 2. Procesos actuales (cómo funciona hoy) [ORIGEN: Excel]

- **Una hoja de Excel por mes**, con estructura idéntica: `Nombre, Placa_Del_Vehiculo, Tipo_Vehiculo, Fecha_Ingreso, Fecha_vencimiento_pago, Estado_Del_Pago, Monto_Mensual, Monto_Pagado, Meses_Pendientes, Saldo_Pendiente, Metodo_De_Pago`.
- Cada mes se **copia manualmente** la lista de clientes del mes anterior (fila por fila) y se actualizan los campos de pago. Esto se confirma porque el mismo cliente aparece en las 6 hojas con datos casi idénticos, y porque existe un botón "Crear Hoja" (hoja "Generador de hojas") que sugiere que el proceso de duplicar la hoja mensual se intentó automatizar en algún momento, pero **el archivo no contiene ninguna fórmula o script que lo haga** — es decir, el botón no tiene lógica funcional en este archivo.
- La hoja "Deudores" se alimenta, aparentemente, copiando manualmente filas de clientes en mora desde las hojas mensuales, con una columna `Fuente (Hoja)` que indica de qué mes vino el registro. También existe un botón "Actualizar Deudores" sin lógica adjunta — mismo patrón: automatización deseada pero no implementada, o implementada en Google Sheets (Apps Script) y perdida al exportar a `.xlsx`.
- Los totales (`Monto_Pagado` total, `Saldo_Pendiente` total) se calculan con `SUM()` al final de cada hoja mensual — esta es la única automatización real que existe en el archivo.
- No hay validación de datos (data validation), ni formato condicional, ni comentarios en ninguna celda: **toda la carga de datos es 100% manual y sin restricciones de formato**.

## 3. Procesos futuros [ORIGEN: Documento de requerimientos]

El documento exige un sistema completo que además de mensualidades cubra: parqueo por horas/visitantes con ingreso-salida y cálculo de tarifa, gestión de cupos/espacios, tarifas versionadas, dashboard, reportes, usuarios/roles/permisos, seguridad, auditoría, backups y notificaciones. Es decir, el alcance nuevo es sustancialmente mayor que el proceso actual (que solo cubre mensualidades de motos).

## 4. Problemas encontrados en el Excel

**A. Calidad de datos / estados libres.** La columna `Estado_Del_Pago` es texto libre, sin validación. Valores reales encontrados: `Ya pago`, `Pago`, `pago`, `Psgo` (typo), `pago ` (con espacio), `Pendiente`, `pendiente`, y celdas vacías (`None`) que también parecen significar "sin estado registrado". Esto confirma literalmente el problema anticipado en el punto 23 del prompt (`Pago/pago/Ya pago/Psgo/Pendiente`).

**B. Método de pago inconsistente.** `Metodo_De_Pago`: `EFECTIVO`, `Efectivo`, `Efectivo `, `efectivo`, `TRANSFERENCIA`, `Transferencia`, `Transferencia `, y muchos `None` — incluso en filas marcadas como "pago".

**C. Placa como identificador de vehículo, pero inconsistente/ausente.** Varios clientes no tienen placa registrada en algunos meses (`Cristian`, `Dayana Nieva` en meses tempranos, `Santiago Nieva`, `Primo de los Nieva`, `Amigo de claudia`) y luego sí la tienen en meses posteriores (p. ej. `Cristian` aparece sin placa en Ene-Abr y con placa `MYA93G` desde Mayo; `Santiago Nieva` sin placa hasta Abril, luego `LHZ68H`). No hay forma de saber si es la misma placa que se omitió por pereza de digitación o si el vehículo cambió.

**D. `Tipo_Vehiculo` mezcla tipo y descripción/color.** Valores como `MOTO`, `MOTO (Rojo)`, `MOTO (Negra)`, `MOTO(Morada)` mezclan la categoría del vehículo con su color, sin un campo separado de color/descripción.

**E. `Meses_Pendientes` y `Saldo_Pendiente` son inconsistentes y no siempre coherentes con `Estado_Del_Pago`.** Ejemplo: en Abril, `Leo Nieva` y `Dayana Nieva` tienen `Estado_Del_Pago = None` (vacío) con `Monto_Pagado = None`, `Meses_Pendientes = None`, `Saldo_Pendiente = None` — es decir, **no se sabe si deben o no deben**, el dato simplemente no fue diligenciado. Esto no es lo mismo que "sin deuda".

**F. La hoja "Deudores" no coincide con las hojas mensuales.** Ejemplo: en la hoja Deudores, `Jairo/MYA76G` y `Jairo/UDU95F` aparecen como deudores con `Fuente = Abril 2025`, pero en la hoja "Abril 2025" ambos registros de Jairo tienen `Estado_Del_Pago = 'pago'` sin saldo pendiente. Esto indica que la hoja Deudores **quedó desactualizada o se llenó con datos de otro momento del mes** (antes del pago), y nunca se sincronizó — es exactamente el tipo de inconsistencia que un proceso manual duplicado genera.

**G. `Fecha_Ingreso` casi siempre vacía y de significado ambiguo.** Solo algunos clientes la tienen (`Nicolás Buitrago`, `Kevin Nieva`, `Santiago Nieva`, `Amigo de claudia`, `Primo de los Nieva`). No es claro si es "fecha de ingreso al parqueadero como cliente mensual" (fecha de alta) o algo distinto. Además, en varios casos `Fecha_Ingreso` es más de un mes anterior al mes de la hoja (p. ej. `Kevin Nieva`: ingreso `2024-02-17`, y aparece igual en todas las hojas de 2025), lo que sugiere que sí es una fecha de alta única del cliente, copiada mes a mes — pero al no repetirse consistentemente para todos, no se puede confirmar con certeza.

**H. `Fecha_vencimiento_pago` no siempre corresponde al mes de la hoja.** En "Marzo 2025", casi todas las fechas de vencimiento dicen `2025-02-XX` (fechas de **febrero**, no de marzo) excepto `Primo de los Nieva` (`2025-04-25`). Esto sugiere que el campo no se actualizó correctamente al copiar la hoja de un mes a otro, o que representa algo distinto a lo que su nombre indica (¿última fecha de pago real vs. próxima fecha de vencimiento?). **Esto es una ambigüedad seria del modelo actual.**

**I. Registros sin placa ni tipo de vehículo pero con monto en cero.** Fila `Fernando inquilino` en Junio: sin placa, sin tipo de vehículo, `Monto_Mensual = None`, `Monto_Pagado = 0`, `Saldo_Pendiente = 0`, `Estado = 'Pago'`. Parece un registro de prueba o un caso especial (¿inquilino del predio, no cliente de parqueadero?) mal capturado.

**J. Junio 2025 casi vacío.** La mayoría de registros de Junio tienen `Estado_Del_Pago = None` y `Monto_Pagado = None` — es la hoja más reciente y probablemente el mes en curso al momento de la última edición, es decir datos parcialmente diligenciados, no necesariamente "todos deben".

**K. Fila de totales mezclada con los datos.** El total (`SUM`) está en la misma tabla que los registros de clientes (última fila), sin separación clara — riesgo típico de hojas Excel que en un sistema real no debe replicarse (el total debe ser una vista calculada, no una fila de datos).

**L. Nombres de cliente no únicos y sin identificador estable.** `Jairo` aparece dos veces (dos vehículos, mismo nombre, sin apellido ni documento de identidad). No hay ningún campo de documento de identidad, teléfono, dirección o contacto del cliente en ninguna hoja — el "cliente" en el Excel es solo un nombre libre.

**M. La hoja "Resumen Financiero" está vacía.** No contiene ninguna fórmula, tabla ni gráfico — es un placeholder nunca desarrollado. No hay evidencia en el archivo de cómo se pretendía calcular ingresos totales, morosidad total, etc.

**N. Botones sin lógica funcional.** "Actualizar Deudores" y "Crear Hoja" son botones de dibujo sin macro ni script asociado dentro de este archivo `.xlsx`. O bien la automatización se perdió al exportar desde Google Sheets, o nunca se implementó y el proceso siguió siendo manual. No podemos asumir cuál es el caso — **[DECISIÓN PENDIENTE]** más abajo.

## 5. Clasificación de la información del Excel

| Dato | Clasificación |
|---|---|
| Nombre, Placa, Tipo_Vehiculo | A. Información real del negocio (con calidad deficiente) |
| Monto_Mensual, Metodo_De_Pago, Fecha pago | A. Información real del negocio |
| Estado_Del_Pago (texto libre) | B. Solución improvisada (debería ser un catálogo/enum + estado derivado) |
| Meses_Pendientes, Saldo_Pendiente | C. Dato derivado — actualmente persistido a mano y de forma inconsistente |
| Hoja mensual duplicada cliente por cliente | D. Redundante — un cliente/vehículo/mensualidad no debería reescribirse cada mes |
| Hoja "Deudores" como copia manual | D/E. Redundante y desactualizable — debería ser una consulta derivada del estado de pagos, no una hoja aparte |
| Fila de totales dentro de la tabla de datos | E. No debe existir en el nuevo sistema (debe ser un cálculo de reporte) |
| Botones sin lógica | E. No aplica al nuevo sistema tal cual |
| Documento de identidad, teléfono, dirección del cliente | F. Falta — requerido para tener un Cliente real y trazable |
| Cupos/espacios físicos, tarifas por hora, control de ingreso/salida | F. Falta por completo — requerido por el documento de requerimientos |
| Usuarios, roles, permisos, auditoría | F. Falta por completo — requerido por el documento de requerimientos |

## 6. Requerimientos identificados [ORIGEN: Documento de requerimientos]

Módulos de alcance declarado: Clientes y vehículos; Mensualidades; Pagos; Deudores; Parqueo por horas/visitantes; Movimientos de entrada/salida; Cupos y espacios; Tarifas; Dashboard; Reportes; Usuarios; Roles; Permisos; Seguridad; Auditoría; Backups; Notificaciones. El documento no detalla reglas de negocio específicas (montos, franjas horarias, tipos de vehículo permitidos, etc.) — solo declara el alcance funcional a alto nivel, dejando el detalle de reglas a definir en fases posteriores con mi validación.

## 7. Inconsistencias y ambigüedades a resolver

1. `Fecha_vencimiento_pago` no siempre coincide con el mes de la hoja — no está claro qué representa realmente hoy.
2. `Fecha_Ingreso` presente solo en algunos registros — no está claro si es fecha de alta del cliente o algo distinto.
3. La hoja Deudores contradice el estado real en la hoja mensual del mismo período — no hay una única fuente de verdad hoy.
4. No existe identificador único de cliente (nombres duplicados, sin documento).
5. No existe identificador único de vehículo confiable (placas ausentes/variables en el tiempo para el mismo cliente).
6. El documento de requerimientos no especifica tipos de vehículo permitidos (¿solo motos y carros?), ni tarifas, ni franjas horarias, ni capacidad del parqueadero — esto se necesitará antes de diseñar tarifas y cupos.

## 8. Datos faltantes para cumplir los requerimientos

- Identificación del cliente: documento de identidad, teléfono/contacto, dirección (no existen hoy).
- Identificación estable del vehículo (placa como clave natural única, marca, color separado del tipo).
- Capacidad total del parqueadero y distribución por tipo de vehículo (motos/carros) — no existe ningún dato de "cupos" en el Excel.
- Tarifas por hora / tarifa máxima diaria para parqueo de visitantes — no existe ningún dato de tarifas por hora en el Excel (solo mensualidades).
- Datos de usuarios/operadores del sistema (quién registra qué) — no existen hoy.
- Datos históricos reales de "hora de ingreso/salida" de vehículos por horas — el Excel solo maneja mensualidades, nunca parqueo transitorio.

## 9. Riesgos

- **Riesgo de migración:** los estados de pago en texto libre y las inconsistencias entre hojas mensuales y "Deudores" hacen que una migración automática 1:1 pueda arrastrar errores (deudas fantasma, pagos "perdidos"). Se requerirá normalización y probablemente validación manual de casos dudosos (ver sección 23 del prompt, se abordará en detalle en fases posteriores).
- **Riesgo de alcance:** el sistema nuevo es mucho más amplio (parqueo por horas, cupos, tarifas, seguridad, auditoría) que el proceso actual (solo mensualidades). Ninguna de esas reglas de negocio existe hoy como precedente, por lo que deberán definirse desde cero contigo, no inferirse del Excel.
- **Riesgo de sobre-normalización prematura:** dado el tamaño real del negocio (~15 clientes, un solo parqueadero, todo motos hasta ahora), existe el riesgo de sobrediseñar (microservicios, colas de eventos, etc.) cuando el problema real es pequeño. Se tendrá en cuenta en la fase de arquitectura.

## 10. Decisiones pendientes

**[DECISIÓN PENDIENTE 1] — Alcance de tipos de vehículo**
El Excel solo registra motos. El documento de requerimientos no dice si el sistema debe soportar carros u otros tipos.
- Alternativas: (a) solo motos por ahora, extensible después; (b) diseñar `Tipo_Vehiculo` como catálogo abierto desde el día uno para carros/motos/otros.
- RECOMENDACIÓN: (b) — es prácticamente el mismo costo de diseño y evita una migración de esquema después.

**[DECISIÓN PENDIENTE 2] — Significado real de `Fecha_vencimiento_pago` y `Fecha_Ingreso`**
No puedo inferir con certeza qué representan realmente en el negocio (ver inconsistencia #1 y #2). Necesito que me confirmes: ¿`Fecha_vencimiento_pago` es la fecha en que vence el próximo pago, o la fecha en que se hizo el último pago? ¿`Fecha_Ingreso` es la fecha en que el cliente se afilió al parqueadero?

**[DECISIÓN PENDIENTE 3] — Automatización perdida (botones "Actualizar Deudores" / "Crear Hoja")**
No sé si estos botones alguna vez tuvieron lógica real (Google Apps Script) que se perdió al exportar, o si nunca se implementaron. Esto no cambia el diseño del nuevo sistema, pero es útil saberlo para entender qué tan manual es realmente el proceso hoy. ¿Puedes confirmar si en Google Sheets estos botones ejecutan algo?

**[DECISIÓN PENDIENTE 4] — Reglas de negocio no cubiertas por el documento de requerimientos**
El documento declara el alcance (módulos) pero no las reglas: capacidad del parqueadero, tarifas por hora, tarifa máxima diaria, montos de mensualidad por tipo de vehículo, día de corte/vencimiento mensual, qué pasa si un cliente paga después de la fecha de vencimiento (¿recargo?, ¿mora?). Necesitaré estos datos antes de la Fase 3 (modelo de datos) y Fase 5 (reglas de negocio), no necesariamente ahora.

**[DECISIÓN PENDIENTE 5] — Identificador único de cliente**
El Excel no tiene documento de identidad. ¿El nuevo sistema exigirá documento de identidad obligatorio para registrar un cliente, o se permitirá registrar solo con nombre + teléfono (más flexible pero menos confiable)?
- RECOMENDACIÓN: exigir documento de identidad como identificador único de negocio (aparte del ID técnico interno), dado que ya vemos nombres duplicados (`Jairo`) en los datos reales.

