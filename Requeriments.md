
## Entidades Principales

### 1. **USUARIO**
- id_usuario (PK)
- nombre
- apellido
- email
- teléfono
- tipo_documento
- numero_documento
- fecha_registro
- estado (activo/inactivo)

### 2. **VEHÍCULO**
- id_vehiculo (PK)
- id_usuario (FK)
- placa
- marca
- modelo
- color
- tipo_vehiculo (auto, moto, camioneta, etc.)
- año

### 3. **ESPACIO_PARQUEO**
- id_espacio (PK)
- numero_espacio
- id_piso (FK)
- id_zona (FK)
- tipo_espacio (estándar, discapacidad, familia, eléctrico)
- estado (disponible, ocupado, reservado, mantenimiento)
- dimensiones

### 4. **PISO/NIVEL**
- id_piso (PK)
- numero_piso
- capacidad_total
- espacios_disponibles

### 5. **ZONA/SECTOR**
- id_zona (PK)
- nombre_zona
- descripción
- id_piso (FK)

### 6. **REGISTRO_ENTRADA_SALIDA**
- id_registro (PK)
- id_vehiculo (FK)
- id_espacio (FK)
- fecha_hora_entrada
- fecha_hora_salida
- tiempo_total
- id_operador_entrada (FK)
- id_operador_salida (FK)

### 7. **TARIFA**
- id_tarifa (PK)
- tipo_vehiculo
- precio_hora
- precio_fraccion
- precio_dia
- precio_mes
- fecha_vigencia_inicio
- fecha_vigencia_fin

### 8. **PAGO**
- id_pago (PK)
- id_registro (FK)
- monto_total
- metodo_pago (efectivo, tarjeta, app, QR)
- fecha_hora_pago
- estado_pago (pendiente, pagado, cancelado)
- referencia_transaccion

### 9. **RESERVA**
- id_reserva (PK)
- id_usuario (FK)
- id_espacio (FK)
- fecha_hora_inicio
- fecha_hora_fin
- estado (pendiente, confirmada, cancelada, cumplida)
- monto_reserva

### 10. **OPERADOR/EMPLEADO**
- id_operador (PK)
- nombre
- apellido
- usuario
- contraseña (hash)
- rol (administrador, operador, vigilancia)
- turno
- estado

### 11. **ABONO/MENSUALIDAD**
- id_abono (PK)
- id_usuario (FK)
- id_vehiculo (FK)
- tipo_abono (mensual, trimestral, anual)
- fecha_inicio
- fecha_fin
- monto
- estado (activo, vencido, cancelado)

### 12. **INCIDENTE**
- id_incidente (PK)
- id_espacio (FK)
- id_vehiculo (FK)
- fecha_hora
- tipo_incidente (daño, robo, accidente, otro)
- descripción
- estado (reportado, en_proceso, resuelto)

## Relaciones Principales

- **USUARIO** → **VEHÍCULO** (1:N) - Un usuario puede tener varios vehículos
- **VEHÍCULO** → **REGISTRO_ENTRADA_SALIDA** (1:N) - Un vehículo tiene múltiples registros
- **ESPACIO_PARQUEO** → **REGISTRO_ENTRADA_SALIDA** (1:N) - Un espacio tiene múltiples registros de uso
- **PISO** → **ESPACIO_PARQUEO** (1:N) - Un piso contiene varios espacios
- **ZONA** → **ESPACIO_PARQUEO** (1:N) - Una zona agrupa varios espacios
- **REGISTRO_ENTRADA_SALIDA** → **PAGO** (1:1) - Cada registro genera un pago
- **TARIFA** → **PAGO** (1:N) - Una tarifa se aplica a múltiples pagos
- **USUARIO** → **RESERVA** (1:N) - Un usuario puede hacer varias reservas
- **ESPACIO_PARQUEO** → **RESERVA** (1:N) - Un espacio puede ser reservado múltiples veces
- **USUARIO** → **ABONO** (1:N) - Un usuario puede tener varios abonos
- **OPERADOR** → **REGISTRO_ENTRADA_SALIDA** (1:N) - Un operador registra múltiples entradas/salidas






## 1. Uso de Enums y Composición en la Clase `User`

### Por qué se usan enums en los usuarios

En el modelo `User`, se utilizan **enums** para definir valores como el **rol** (`ADMIN`, `USER`) y el **tipo de identificación** (`CC`, `TI`, `CE`, etc.).
Esto se hace porque:

* Los valores posibles son **limitados y fijos**, no cambian con frecuencia.
* Facilita la validación, ya que evita errores por escritura (por ejemplo, no se puede registrar un rol incorrecto).
* Mejora la legibilidad y el mantenimiento del código.

**Ejemplo:**

```java
public enum Role {
    ADMIN,
    USER
}
```

En lugar de crear una jerarquía de clases (por ejemplo, `Admin extends User` o `Cliente extends User`), el enum simplifica el diseño cuando la única diferencia entre los usuarios es el **rol o los permisos**, no el comportamiento ni los atributos.

Esto se alinea con el principio de **KISS (Keep It Simple, Stupid)**:

> “No usar herencia cuando un simple enum resuelve el problema de manera más clara y eficiente.”

---

### Por qué se usa composición

El usuario tiene relaciones con otras entidades como **Vehicle**, **Payment** o **Reservation**.
Esto se maneja con **composición**, porque:

* Un usuario posee o está asociado a esos objetos, pero no es un tipo de ellos.
* Se cumple el principio de **composición sobre herencia**, es decir, preferir relaciones “tiene un” antes que “es un” cuando no hay jerarquía lógica.

**Ejemplo:**

```java
@OneToMany(mappedBy = "user")
private List<Vehicle> vehicles;
```

Esto representa que el usuario **tiene vehículos**, no que **hereda** de una clase vehículo.

En resumen:

* Usar **enums** para roles es ideal cuando las diferencias son de tipo lógico (no estructural).
* Usar **composición** para asociar objetos es ideal cuando las clases representan entidades distintas pero relacionadas.

---

## 2. Uso de Herencia en `Vehicle`

En el caso de los vehículos, sí tiene sentido usar herencia, porque existen tipos de vehículos con atributos o comportamientos diferentes.

**Ejemplo:**

```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Vehicle {
    @Id
    private String plate;
    private String brand;
}

@Entity
public class Car extends Vehicle {
    private int doors;
}

@Entity
public class Motorcycle extends Vehicle {
    private int cylinderCapacity;
}
```

### Ventajas de usar herencia aquí:

* Permite reutilizar atributos comunes (placa, marca, color).
* Facilita el polimorfismo, es decir, manejar todos los tipos de vehículos con una misma interfaz (`List<Vehicle>`).
* Si en el futuro se agrega un nuevo tipo de vehículo (como `Truck`), no es necesario modificar la lógica general.

En resumen, se aplica herencia cuando una clase base comparte estructura y comportamiento con sus subclases, pero estas tienen características adicionales propias.

---

## 3. Uso de Herencia en `Payment`

El caso de los pagos también es ideal para herencia, porque hay distintos métodos de pago con atributos específicos.

**Ejemplo:**

```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Payment {
    @Id
    private Long id;
    private Double amount;
    private LocalDateTime date;
}

@Entity
public class CashPayment extends Payment {
    private String receiptNumber;
}

@Entity
public class CardPayment extends Payment {
    private String cardNumber;
    private String bankName;
}
```

### Ventajas:

* Facilita agregar nuevos tipos de pago sin modificar la clase base.
* Mejora la extensibilidad del sistema (por ejemplo, se puede agregar `QrPayment` sin afectar las demás clases).
* Permite manejar todos los pagos con una sola lista (`List<Payment>`), aplicando polimorfismo real.

En este caso, la herencia aporta valor porque existen variaciones reales en la estructura de cada tipo de pago.

---

## 4. Conclusión General

| Concepto                           | Aplicación                         | Justificación                                                          | Tipo de relación                 |
| ---------------------------------- | ---------------------------------- | ---------------------------------------------------------------------- | -------------------------------- |
| `Enums` (Role, IdentificationType) | En `User`                          | Los valores son fijos y no cambian. Simplifica validaciones.           | Enumeración (constantes)         |
| **Composición**                    | Entre `User`, `Vehicle`, `Payment` | Representa relaciones del tipo “tiene un”. Favorece bajo acoplamiento. | Asociación / dependencia         |
| **Herencia**                       | En `Vehicle` y `Payment`           | Permite extender comportamiento común con variaciones específicas.     | Generalización / especialización |

---

## 5.  concepto

* Usar **enums** cuando las diferencias son lógicas o categóricas.
* Usar **composición** cuando una clase usa o contiene otra.
* Usar **herencia** cuando una clase extiende la funcionalidad de otra y comparten un mismo concepto base.

---

