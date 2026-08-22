# FASE 5 — DISEÑO TÉCNICO


---

## 1. Patrones de diseño — solo los justificados

Por cada uno: problema → solución → dónde → costo.

### Repository
- **Problema:** el dominio necesita persistir/consultar agregados sin conocer PostgreSQL/JPA.
- **Solución:** interfaz en `domain` (puerto de salida), implementación en `infrastructure`.
- **Dónde:** `PeriodoRepository`, `PagoRepository`, `MovimientoRepository`, `ClienteRepository`, etc. — uno por agregado raíz identificado en Fase 3.
- **Costo:** bajo, es el patrón base de la arquitectura hexagonal ya aprobada.

### Strategy
- **Problema:** el cálculo de cobro de un `Movimiento` cambia según `ModalidadCobro` (`POR_DIA` vs `POR_HORA`), y no queremos un `if/else` que crezca cada vez que se agregue una modalidad.
- **Solución:** interfaz `EstrategiaCalculoCobro` con dos implementaciones.
- **Dónde:** módulo `parqueo-transitorio`, invocado por `CalcularCobroUseCase`.
- **Costo:** bajo — 2 implementaciones hoy, extensible sin tocar el caso de uso (Open/Closed).

### Specification
- **Problema:** `EstadoPeriodo` se deriva de reglas combinables (vencido, pagado, parcial) que se repetirían en varias consultas/reportes (dashboard, deudores, estado de cuenta).
- **Solución:** encapsular la regla como objeto reutilizable, no como condicionales duplicados en cada lugar que la necesita.
- **Dónde:** `domain` del módulo `mensualidades`, usado por `CalculadorDeEstadoMensualidad` y por `reporting`.
- **Costo:** bajo-medio — se justifica porque ya identificamos 3+ consumidores de la misma regla (Fase 1 mostró el riesgo real de tener esta lógica duplicada e inconsistente en el Excel).

### Factory (simple, método de fábrica — no Abstract Factory)
- **Problema:** crear un `Periodo` requiere aplicar el snapshot de tarifa vigente + reglas de vencimiento; hacerlo "a mano" en el caso de uso arriesga que alguien lo haga distinto en otro lugar.
- **Solución:** `PeriodoFactory.generar(mensualidad, tarifaVigente)` centraliza la construcción válida.
- **Dónde:** módulo `mensualidades`, usado por `GeneradorDePeriodosUseCase`.
- **Costo:** bajo.

### Observer / Domain Events
- **Problema:** auditoría, notificaciones y proyecciones de reporting necesitan reaccionar a hechos del dominio (pago registrado, mensualidad vencida) sin que cada caso de uso llame explícitamente a los tres.
- **Solución:** el dominio publica eventos (`PagoRegistrado`, `MovimientoFinalizado`, etc.); listeners independientes en `seguridad` y `reporting` se suscriben.
- **Dónde:** transversal — ya justificado en Fase 4.
- **Costo:** medio — requiere un bus de eventos in-process, pero resuelve directamente RN10 (auditoría obligatoria) sin duplicar la llamada en cada caso de uso.

### Chain of Responsibility
- **Problema:** validar un `RegistrarPagoRequest` implica varias validaciones independientes (monto > 0, periodo existe, periodo no sobre-pagado, método de pago válido) que no deben vivir todas en un solo método gigante.
- **Solución:** cadena de validadores pequeños, cada uno con una sola responsabilidad (Single Responsibility).
- **Dónde:** capa `application`, antes de invocar el caso de uso.
- **Costo:** bajo-medio. **Evaluado y con reserva:** para el volumen de validaciones actual (4-5 reglas), una lista de validadores ejecutados en secuencia sin la maquinaria completa de "chain" (sin next-handler explícito) es igual de efectiva y más simple. **RECOMENDACIÓN: usar una lista de `Validador<T>` iterada, no la cadena clásica con enlace explícito** — mismo beneficio, menos complejidad. Lo dejo como variante simplificada del patrón.

### Dependency Injection
- **Problema:** el dominio no debe instanciar directamente sus adaptadores de infraestructura.
- **Solución:** inyección por constructor (framework: Spring), ya implícita en toda la arquitectura hexagonal aprobada.
- **Dónde:** todos los casos de uso reciben sus puertos por constructor.
- **Costo:** ninguno adicional — es la forma natural de cablear Ports & Adapters.

### Patrones evaluados y **descartados** (regla 13/9 — no usar si no resuelven un problema real)
- **State** (para `Mensualidad`/`Periodo`): evaluado, pero las transiciones son pocas y simples (3 estados en Mensualidad, ver Fase 2); un enum + validación en el caso de uso es suficiente. Implementar clases de estado sería sobreingeniería para este volumen.
- **Builder**: no hay ningún objeto con suficiente complejidad de construcción (parámetros opcionales combinables) que lo justifique; los DTOs y entidades tienen constructores simples.
- **Facade**: los módulos ya exponen una interfaz pública acotada (Fase 4); una fachada adicional sería una capa redundante.
- **Adapter**: sí se usa, pero no como "patrón a destacar" — es simplemente cómo se implementan los puertos de salida (repositorios JPA), ya cubierto por Repository.
- **Template Method**: no hay algoritmos con pasos fijos y variaciones puntuales que lo requieran hoy.

---

## 2. Estructuras de datos

| Estructura | Uso | Justificación |
|---|---|---|
| `Optional<T>` | Retorno de consultas por ID que pueden no existir | Evita nulls implícitos, fuerza manejo explícito |
| `List<T>` | Colecciones ordenadas (periodos de una mensualidad, movimientos de un vehículo) | Orden importa (cronológico) |
| Enum (`EstadoMensualidad`, `ModalidadCobro`, `MetodoPago`, `OrigenPago`) | Catálogos cerrados de bajo volumen de cambio | Ya no son texto libre (corrige el hallazgo central de Fase 1) |
| Value Object `Dinero` (wrapping `BigDecimal`) | Todo monto monetario | **Nunca `float`/`double`** — precisión exacta obligatoria en dinero; ya señalado como corrección al Excel en Fase 2 |
| DTO / Record | Entrada/salida de casos de uso y controladores | Nunca se expone una entidad de dominio directamente en la API (regla 12, evita acoplar contrato externo a modelo interno) |
| Specification\<Periodo\> | Reglas de estado combinables | Ya justificado arriba |
| Paginación (`Page<T>` / `PageRequest`) | Listados de clientes, movimientos, pagos, auditoría | Crece con el tiempo (histórico), nunca se debe traer todo sin límite |

---

## 3. Ejemplo completo: módulo `mensualidades`, caso de uso `RegistrarPago`

Elijo este caso de uso como ejemplo detallado porque concentra la mayoría de reglas de negocio críticas (RN5, transacciones, auditoría, cálculo derivado).

### 3.1 Value Objects

```java
// domain/model/Dinero.java
public final class Dinero {
    private final BigDecimal valor;

    private Dinero(BigDecimal valor) {
        if (valor.compareTo(BigDecimal.ZERO) < 0) {
            throw new MontoInvalidoException("El monto no puede ser negativo");
        }
        this.valor = valor.setScale(2, RoundingMode.HALF_UP);
    }

    public static Dinero of(BigDecimal valor) { return new Dinero(valor); }
    public Dinero sumar(Dinero otro) { return new Dinero(this.valor.add(otro.valor)); }
    public Dinero restar(Dinero otro) { return new Dinero(this.valor.subtract(otro.valor)); }
    public boolean esMayorQue(Dinero otro) { return this.valor.compareTo(otro.valor) > 0; }
    public boolean esCero() { return this.valor.compareTo(BigDecimal.ZERO) == 0; }
    // equals/hashCode por valor, no por referencia (Value Object)
}
```

### 3.2 Entidades del agregado

```java
// domain/model/Periodo.java
public class Periodo {
    private final Long id;
    private final Long mensualidadId;
    private final YearMonth anioMes;
    private final Dinero monto;
    private final LocalDate fechaVencimiento;

    // Sin campo "estado" ni "saldoPendiente" — se calculan, no se guardan (RN11)

    public EstadoPeriodo calcularEstado(List<AplicacionPago> aplicaciones, LocalDate fechaActual) {
        Dinero totalAplicado = aplicaciones.stream()
            .map(AplicacionPago::getMontoAplicado)
            .reduce(Dinero.of(BigDecimal.ZERO), Dinero::sumar);

        Dinero saldo = monto.restar(totalAplicado);

        if (saldo.esCero()) return EstadoPeriodo.PAGADO;
        if (fechaActual.isAfter(fechaVencimiento)) return EstadoPeriodo.EN_MORA;
        if (!totalAplicado.esCero()) return EstadoPeriodo.PARCIAL;
        return EstadoPeriodo.PENDIENTE;
    }

    public Dinero calcularSaldo(List<AplicacionPago> aplicaciones) {
        Dinero totalAplicado = aplicaciones.stream()
            .map(AplicacionPago::getMontoAplicado)
            .reduce(Dinero.of(BigDecimal.ZERO), Dinero::sumar);
        return monto.restar(totalAplicado);
    }
}
```

### 3.3 Puertos de salida (interfaces en domain)

```java
// domain/port/out/PeriodoRepository.java
public interface PeriodoRepository {
    Optional<Periodo> buscarPorId(Long id);
    List<Periodo> buscarPendientesPorMensualidad(Long mensualidadId);
    void guardar(Periodo periodo);
}

// domain/port/out/PagoRepository.java
public interface PagoRepository {
    void guardar(Pago pago);
}

// domain/port/out/AplicacionPagoRepository.java
public interface AplicacionPagoRepository {
    List<AplicacionPago> buscarPorPeriodo(Long periodoId);
    void guardar(AplicacionPago aplicacion);
}

// domain/port/out/EventPublisher.java  (compartido, no específico de este módulo)
public interface EventPublisher {
    void publicar(DomainEvent evento);
}
```

### 3.4 DTOs (capa application, entrada/salida — nunca se expone la entidad)

```java
// application/dto/RegistrarPagoRequest.java
public record RegistrarPagoRequest(
    List<Long> periodoIds,       // uno o varios (RN5: pago cubre varios periodos)
    BigDecimal montoTotal,
    MetodoPago metodoPago,
    Long registradoPorUsuarioId
) {}

// application/dto/RegistrarPagoResponse.java
public record RegistrarPagoResponse(
    Long pagoId,
    List<PeriodoSaldoDTO> periodosActualizados
) {}

public record PeriodoSaldoDTO(
    Long periodoId,
    EstadoPeriodo estadoResultante,
    BigDecimal saldoRestante
) {}
```

### 3.5 Validadores (Chain of Responsibility simplificado — lista iterada)

```java
// application/validation/Validador.java
public interface Validador<T> {
    void validar(T input);   // lanza excepción de dominio si falla
}

// application/validation/MontoPositivoValidador.java
public class MontoPositivoValidador implements Validador<RegistrarPagoRequest> {
    public void validar(RegistrarPagoRequest req) {
        if (req.montoTotal().compareTo(BigDecimal.ZERO) <= 0) {
            throw new MontoInvalidoException("El monto del pago debe ser mayor a cero");
        }
    }
}

// application/validation/PeriodosExistenValidador.java  (usa PeriodoRepository)
// application/validation/NoSobrepagoValidador.java      (usa saldo calculado)
```

### 3.6 Caso de uso (application) — orquesta, no contiene reglas de negocio propias

```java
// application/usecase/RegistrarPagoUseCase.java
public class RegistrarPagoUseCase {

    private final PeriodoRepository periodoRepository;
    private final PagoRepository pagoRepository;
    private final AplicacionPagoRepository aplicacionPagoRepository;
    private final EventPublisher eventPublisher;
    private final List<Validador<RegistrarPagoRequest>> validadores;

    // constructor con inyección de dependencias (DI)

    @Transactional
    public RegistrarPagoResponse ejecutar(RegistrarPagoRequest request) {

        validadores.forEach(v -> v.validar(request));

        List<Periodo> periodos = request.periodoIds().stream()
            .map(id -> periodoRepository.buscarPorId(id)
                .orElseThrow(() -> new PeriodoNoEncontradoException(id)))
            .toList();

        Pago pago = Pago.crear(
            Dinero.of(request.montoTotal()),
            OrigenPago.MENSUALIDAD,
            request.metodoPago(),
            request.registradoPorUsuarioId()
        );
        pagoRepository.guardar(pago);

        // Distribución del pago entre periodos (RN5): más antiguo primero
        Dinero restante = Dinero.of(request.montoTotal());
        List<PeriodoSaldoDTO> resultado = new ArrayList<>();

        for (Periodo periodo : periodos.stream()
                .sorted(Comparator.comparing(Periodo::getAnioMes)).toList()) {

            List<AplicacionPago> aplicacionesExistentes =
                aplicacionPagoRepository.buscarPorPeriodo(periodo.getId());
            Dinero saldoPeriodo = periodo.calcularSaldo(aplicacionesExistentes);

            Dinero aAplicar = restante.esMayorQue(saldoPeriodo) ? saldoPeriodo : restante;
            if (aAplicar.esCero()) continue;

            AplicacionPago aplicacion = AplicacionPago.crear(pago.getId(), periodo.getId(), aAplicar);
            aplicacionPagoRepository.guardar(aplicacion);

            restante = restante.restar(aAplicar);

            List<AplicacionPago> actualizadas = new ArrayList<>(aplicacionesExistentes);
            actualizadas.add(aplicacion);
            resultado.add(new PeriodoSaldoDTO(
                periodo.getId(),
                periodo.calcularEstado(actualizadas, LocalDate.now()),
                periodo.calcularSaldo(actualizadas).getValor()
            ));
        }

        eventPublisher.publicar(new PagoRegistradoEvent(
            pago.getId(), request.registradoPorUsuarioId(), Instant.now()
        ));

        return new RegistrarPagoResponse(pago.getId(), resultado);
    }
}
```

**Nota de diseño:** el `@Transactional` está en el borde del caso de uso (Fase 4, sección 5), cubriendo exactamente la atomicidad: crear pago + distribuir en periodos + (implícitamente) preparar el evento. El evento se publica **después** de confirmar la transacción principal (o vía outbox pattern si se requiere garantía estricta — `[DECISIÓN PENDIENTE 14]` abajo).

### 3.7 Excepciones de dominio (manejo de errores, estructura estándar de API)

```java
// domain/exception/DomainException.java (base)
public abstract class DomainException extends RuntimeException {
    public abstract String codigo();   // ej. "MONTO_INVALIDO", "PERIODO_NO_ENCONTRADO"
}

public class MontoInvalidoException extends DomainException {
    public String codigo() { return "MONTO_INVALIDO"; }
}
public class PeriodoNoEncontradoException extends DomainException {
    public String codigo() { return "PERIODO_NO_ENCONTRADO"; }
}
```

```java
// api/error/GlobalExceptionHandler.java — mapea DomainException a respuesta estándar
@ExceptionHandler(DomainException.class)
public ResponseEntity<ApiResponse<Void>> handle(DomainException ex) {
    return ResponseEntity.status(mapHttpStatus(ex))
        .body(ApiResponse.error(ex.codigo(), ex.getMessage()));
}
```

Reutilizo aquí tu mismo envelope `ApiResponse` (success/message/data/timestamp) confirmado en la fase anterior, para consistencia con tu proyecto Medical Management.

---

## 4. Ejemplo: Strategy para cálculo de cobro (módulo `parqueo-transitorio`)

```java
// domain/service/EstrategiaCalculoCobro.java
public interface EstrategiaCalculoCobro {
    Dinero calcular(Instant ingreso, Instant salida, TarifaVisitante tarifa);
}

// domain/service/CalculoCobroPorDia.java
public class CalculoCobroPorDia implements EstrategiaCalculoCobro {
    public Dinero calcular(Instant ingreso, Instant salida, TarifaVisitante tarifa) {
        long horas = Duration.between(ingreso, salida).toHours();
        long dias = (long) Math.ceil(horas / 24.0);   // [SUPUESTO 24h, ver decisión pendiente 11]
        if (dias == 0) dias = 1; // mínimo un día
        return tarifa.getMontoDia().multiplicarPor(dias);
    }
}

// domain/service/CalculoCobroPorHora.java
public class CalculoCobroPorHora implements EstrategiaCalculoCobro {
    public Dinero calcular(Instant ingreso, Instant salida, TarifaVisitante tarifa) {
        long minutos = Duration.between(ingreso, salida).toMinutes();
        long horasFraccion = (long) Math.ceil(minutos / 60.0);
        Dinero calculado = tarifa.getMontoHora().multiplicarPor(horasFraccion);
        Dinero tope = tarifa.getTopeMaximoDiario();
        return calculado.esMayorQue(tope) ? tope : calculado;
    }
}

// domain/service/SelectorEstrategiaCalculoCobro.java  (factory simple para elegir la estrategia)
public class SelectorEstrategiaCalculoCobro {
    public EstrategiaCalculoCobro seleccionar(ModalidadCobro modalidad) {
        return switch (modalidad) {
            case POR_DIA -> new CalculoCobroPorDia();
            case POR_HORA -> new CalculoCobroPorHora();
        };
    }
}
```

---

## 5. Concurrencia: `AsignarCupo` (módulo `parqueo-transitorio`)

```java
// application/usecase/RegistrarIngresoUseCase.java
@Transactional
public RegistrarIngresoResponse ejecutar(RegistrarIngresoRequest request) {

    // Bloqueo pesimista a nivel de fila sobre el contador de capacidad,
    // evita doble asignación por ingresos simultáneos (condición de carrera identificada en Fase 1/2)
    CapacidadParqueadero capacidad = capacidadRepository
        .buscarPorTipoVehiculoConBloqueo(request.tipoVehiculoId());  // SELECT ... FOR UPDATE

    int ocupacionActual = movimientoRepository
        .contarActivosPorTipo(request.tipoVehiculoId());

    if (ocupacionActual >= capacidad.getCapacidadTotal()) {
        throw new CupoNoDisponibleException(request.tipoVehiculoId());
    }

    Movimiento movimiento = Movimiento.registrarIngreso(
        request.vehiculoId(), request.placaCapturada(),
        request.tipoVehiculoId(), request.esClienteMensual(),
        Instant.now(), request.registradoPorUsuarioId()
    );
    movimientoRepository.guardar(movimiento);

    eventPublisher.publicar(new VehiculoIngresoEvent(movimiento.getId(), Instant.now()));

    return RegistrarIngresoResponse.from(movimiento);
}
```

**Justificación del bloqueo pesimista (`FOR UPDATE`)** sobre optimista: el volumen de ingresos simultáneos es bajo (un solo parqueadero, no cientos de transacciones/segundo), y la simplicidad de razonar sobre un bloqueo directo supera el beneficio marginal de un control optimista con reintentos — RECOMENDACIÓN acorde a "no sobreingenierizar" (regla 7).

---

## 6. Formato estándar de error de API

```json
{
  "success": false,
  "message": "El monto del pago debe ser mayor a cero",
  "data": null,
  "errorCode": "MONTO_INVALIDO",
  "timestamp": "2026-08-21T10:15:30"
}
```

Mismo envelope que el de éxito (ya fijado en Fase 4 con tu formato de Medical Management), agregando `errorCode` para que el frontend pueda actuar programáticamente sin parsear el mensaje.

---

## 7. Validaciones — resumen por tipo

| Campo | Sintáctica | Estructural | Negocio |
|---|---|---|---|
| `documento_identidad` | formato según `tipo_documento` | longitud, caracteres permitidos | UNIQUE en BD |
| `placa` | patrón regional de placas | mayúsculas, sin espacios | UNIQUE en BD |
| `monto` | numérico | > 0, máx. 2 decimales | no debe exceder saldo pendiente (pago), no negativo (RN Dinero VO) |
| `fecha_vencimiento` | formato fecha | fecha válida | no puede ser anterior a `fecha_inicio` de la mensualidad |
| `hora_salida` | timestamp | posterior a `hora_ingreso` | — |

---

## 8. Decisión pendiente nueva de esta fase

**`[DECISIÓN PENDIENTE 14]`** Para la publicación de eventos de dominio (auditoría, notificaciones): ¿aceptas que, en un caso extremo, un evento se pierda si el proceso falla justo después del commit de la transacción principal (enfoque simple, in-process), o es un requisito duro que **nunca** se pierda un evento de auditoría (lo cual exige un patrón Outbox con tabla intermedia y un publicador asíncrono, más complejo)?
- RECOMENDACIÓN: enfoque simple in-process para el MVP — dado el volumen del negocio, el riesgo real de pérdida es bajísimo, y el patrón Outbox es complejidad que hoy no se justifica (regla 7). Se puede añadir después si el negocio crece y la garantía se vuelve crítica.

---
