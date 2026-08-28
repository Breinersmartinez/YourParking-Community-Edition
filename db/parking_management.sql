-- =====================================================================
--  YourParking - Esquema de base de datos (PostgreSQL)
-- =====================================================================
--  Este script refleja fielmente las entidades JPA del backend
--  (package com.example.parking_management.model).
--
--  NOTA IMPORTANTE:
--    * El backend usa Hibernate y puede auto-generar el esquema
--      (ddl-auto). Este script sirve como referencia de provisión
--      manual y para documentar el modelo.
--    * La estrategia de nombres es PhysicalNamingStrategyStandardImpl:
--      los nombres de tablas y columnas se usan tal cual están
--      declarados en @Table / @Column (en mayúsculas).
--    * Los enums se almacenan en formato STRING (registre_enum? no:
--      se guardan como VARCHAR con los valores del enum).
-- =====================================================================

-- La base de datos (crear fuera del script si el proveedor lo maneja)
-- CREATE DATABASE parking_management;

-- =====================================================================
-- 1. USUARIO
--    Entidad: User  (tabla USUARIO)
--    PK: IDENTIFICACION (Integer)
-- =====================================================================
CREATE TABLE USUARIO (
    IDENTIFICACION          INT           NOT NULL,
    TIPO_IDENTIFICACION     VARCHAR(20)   NOT NULL,   -- enum: TI, CC, NUIP, CE, P
    NOMBRE                  VARCHAR(255)  NOT NULL,
    APELLIDO                VARCHAR(255)  NOT NULL,
    CONTRASEÑA              VARCHAR(255)  NOT NULL,   -- hash BCrypt
    CORREO                  VARCHAR(255)  NOT NULL UNIQUE,
    NUMERO_TELEFONO         VARCHAR(255),
    DIRECCION               VARCHAR(255),
    FECHA_REGISTRO          TIMESTAMP,
    ROL                     VARCHAR(20)   NOT NULL,   -- enum: ADMIN, OPERATOR, VIGILANTE, SUPERVISOR, USER
    ACTIVO                  BOOLEAN,
    CREADO_POR              VARCHAR(255),
    FECHA_CREACION          TIMESTAMP,
    ULTIMA_MODIFICACION_POR VARCHAR(255),
    ULTIMA_MODIFICACION_DATE TIMESTAMP,
    CONSTRAINT PK_USUARIO PRIMARY KEY (IDENTIFICACION)
);

-- =====================================================================
-- 2. PISO (Nivel)
--    Entidad: Level  (tabla PISO)
-- =====================================================================
CREATE TABLE PISO (
    ID_PISO                BIGSERIAL      NOT NULL,
    NUMERO_PISO            INT            NOT NULL UNIQUE,
    CAPACIDAD_TOTAL        INT,
    ESPACIOS_DISPONIBLES   INT,
    CREADO_POR             VARCHAR(255),
    FECHA_CREACION         TIMESTAMP,
    ULTIMA_MODIFICACION_POR VARCHAR(255),
    ULTIMA_MODIFICACION_DATE TIMESTAMP,
    CONSTRAINT PK_PISO PRIMARY KEY (ID_PISO)
);

-- =====================================================================
-- 3. ZONA (Sector)
--    Entidad: Zone  (tabla ZONA)
-- =====================================================================
CREATE TABLE ZONA (
    ID_ZONA                BIGSERIAL      NOT NULL,
    NOMBRE_ZONA            VARCHAR(255)   NOT NULL,
    DESCRIPCION            VARCHAR(255),
    ID_PISO                BIGINT,
    CREADO_POR             VARCHAR(255),
    FECHA_CREACION         TIMESTAMP,
    ULTIMA_MODIFICACION_POR VARCHAR(255),
    ULTIMA_MODIFICACION_DATE TIMESTAMP,
    CONSTRAINT PK_ZONA PRIMARY KEY (ID_ZONA),
    CONSTRAINT FK_ZONA_PISO FOREIGN KEY (ID_PISO)
        REFERENCES PISO (ID_PISO)
);

-- =====================================================================
-- 4. ESPACIO
--    Entidad: Space  (tabla ESPACIO)
-- =====================================================================
CREATE TABLE ESPACIO (
    ID_ESPACIO             BIGSERIAL      NOT NULL,
    NUMERO_ESPACIO         INT            NOT NULL,
    ESTADO                 VARCHAR(20)    NOT NULL,   -- enum: DISPONIBLE, OCUPADO, RESERVADO, MANTENIMIENTO
    TIPO_ESPACIO           VARCHAR(20)    NOT NULL,   -- enum: ESTANDAR, DISCAPACIDAD, FAMILIA, ELECTRICO
    DIMENSIONES            VARCHAR(255),
    ID_PISO                BIGINT,
    ID_ZONA                BIGINT,
    CREADO_POR             VARCHAR(255),
    FECHA_CREACION         TIMESTAMP,
    ULTIMA_MODIFICACION_POR VARCHAR(255),
    ULTIMA_MODIFICACION_DATE TIMESTAMP,
    CONSTRAINT PK_ESPACIO PRIMARY KEY (ID_ESPACIO),
    CONSTRAINT FK_ESPACIO_PISO FOREIGN KEY (ID_PISO)
        REFERENCES PISO (ID_PISO),
    CONSTRAINT FK_ESPACIO_ZONA FOREIGN KEY (ID_ZONA)
        REFERENCES ZONA (ID_ZONA)
);

-- =====================================================================
-- 5. VEHICULO
--    Entidad: Vehicle  (tabla VEHICULO)
--    PK: PLACA_VEHICULO (String)
-- =====================================================================
CREATE TABLE VEHICULO (
    PLACA_VEHICULO         VARCHAR(255)   NOT NULL,
    TIPO_VEHICULO          VARCHAR(20),
    MARCA_VEHICULO         VARCHAR(255),
    COLOR_VEHICULO         VARCHAR(255),
    TARJETA_PROPIEDAD      VARCHAR(255),
    HORA_ENTRADA           TIMESTAMP,
    HORA_SALIDA            TIMESTAMP,
    ID_USUARIO             INT,
    CREADO_POR             VARCHAR(255),
    FECHA_CREACION         TIMESTAMP,
    ULTIMA_MODIFICACION_POR VARCHAR(255),
    ULTIMA_MODIFICACION_DATE TIMESTAMP,
    CONSTRAINT PK_VEHICULO PRIMARY KEY (PLACA_VEHICULO),
    CONSTRAINT FK_VEHICULO_USUARIO FOREIGN KEY (ID_USUARIO)
        REFERENCES USUARIO (IDENTIFICACION)
);

-- =====================================================================
-- 6. TICKET (registro de entrada/salida)
--    Entidad: Ticket  (tabla TICKET)
-- =====================================================================
CREATE TABLE TICKET (
    ID_TICKET              BIGSERIAL      NOT NULL,
    PLACA_VEHICULO         VARCHAR(255),
    ID_ESPACIO             BIGINT,
    FECHA_HORA_ENTRADA     TIMESTAMP      NOT NULL,
    FECHA_HORA_SALIDA      TIMESTAMP,
    TIEMPO_TOTAL_MINUTOS   BIGINT,
    VALOR_TOTAL            NUMERIC(12,2),
    ESTADO                 VARCHAR(20)    NOT NULL,   -- enum: ACTIVO, FINALIZADO, CANCELADO
    CREADO_POR             VARCHAR(255),
    FECHA_CREACION         TIMESTAMP,
    ULTIMA_MODIFICACION_POR VARCHAR(255),
    ULTIMA_MODIFICACION_DATE TIMESTAMP,
    CONSTRAINT PK_TICKET PRIMARY KEY (ID_TICKET),
    CONSTRAINT FK_TICKET_VEHICULO FOREIGN KEY (PLACA_VEHICULO)
        REFERENCES VEHICULO (PLACA_VEHICULO),
    CONSTRAINT FK_TICKET_ESPACIO FOREIGN KEY (ID_ESPACIO)
        REFERENCES ESPACIO (ID_ESPACIO)
);

-- =====================================================================
-- 7. RESERVA
--    Entidad: Reservation  (tabla RESERVA)
-- =====================================================================
CREATE TABLE RESERVA (
    ID_RESERVA             BIGSERIAL      NOT NULL,
    ID_USUARIO             INT            NOT NULL,
    ID_ESPACIO             BIGINT         NOT NULL,
    FECHA_HORA_INICIO      TIMESTAMP      NOT NULL,
    FECHA_HORA_FIN         TIMESTAMP      NOT NULL,
    ESTADO                 VARCHAR(20)    NOT NULL,   -- enum: PENDIENTE, CONFIRMADA, CANCELADA, CUMPLIDA
    MONTO_RESERVA          NUMERIC(12,2),
    CREADO_POR             VARCHAR(255),
    FECHA_CREACION         TIMESTAMP,
    ULTIMA_MODIFICACION_POR VARCHAR(255),
    ULTIMA_MODIFICACION_DATE TIMESTAMP,
    CONSTRAINT PK_RESERVA PRIMARY KEY (ID_RESERVA),
    CONSTRAINT FK_RESERVA_USUARIO FOREIGN KEY (ID_USUARIO)
        REFERENCES USUARIO (IDENTIFICACION),
    CONSTRAINT FK_RESERVA_ESPACIO FOREIGN KEY (ID_ESPACIO)
        REFERENCES ESPACIO (ID_ESPACIO)
);

-- =====================================================================
-- 8. TARIFA
--    Entidad: Rate  (tabla TARIFA)
-- =====================================================================
CREATE TABLE TARIFA (
    ID_TARIFA              BIGSERIAL      NOT NULL,
    TIPO_VEHICULO          VARCHAR(20)    NOT NULL,   -- enum VehicleType
    PRECIO_HORA            NUMERIC(12,2),
    PRECIO_FRACCION        NUMERIC(12,2),
    PRECIO_DIA             NUMERIC(12,2),
    PRECIO_MES             NUMERIC(12,2),
    PRECIO_ANIO            NUMERIC(12,2),
    FECHA_VIGENCIA_INICIO  DATE,
    FECHA_VIGENCIA_FIN     DATE,
    CREADO_POR             VARCHAR(255),
    FECHA_CREACION         TIMESTAMP,
    ULTIMA_MODIFICACION_POR VARCHAR(255),
    ULTIMA_MODIFICACION_DATE TIMESTAMP,
    CONSTRAINT PK_TARIFA PRIMARY KEY (ID_TARIFA)
);

-- =====================================================================
-- 9. PAGO
--    Entidad: Payment  (tabla PAGO)
--    Relación 1:1 con TICKET (ID_TICKET)
-- =====================================================================
CREATE TABLE PAGO (
    ID_PAGO                BIGSERIAL      NOT NULL,
    ID_TICKET              BIGINT,
    MONTO_TOTAL            NUMERIC(12,2)  NOT NULL,
    METODO_PAGO            VARCHAR(20)    NOT NULL,   -- enum: EFECTIVO, TARJETA, APP, QR
    FECHA_HORA_PAGO        TIMESTAMP,
    ESTADO_PAGO            VARCHAR(20)    NOT NULL,   -- enum: PENDIENTE, PAGADO, CANCELADO
    REFERENCIA_TRANSACCION VARCHAR(255),
    CREADO_POR             VARCHAR(255),
    FECHA_CREACION         TIMESTAMP,
    ULTIMA_MODIFICACION_POR VARCHAR(255),
    ULTIMA_MODIFICACION_DATE TIMESTAMP,
    CONSTRAINT PK_PAGO PRIMARY KEY (ID_PAGO),
    CONSTRAINT UQ_PAGO_TICKET UNIQUE (ID_TICKET),
    CONSTRAINT FK_PAGO_TICKET FOREIGN KEY (ID_TICKET)
        REFERENCES TICKET (ID_TICKET)
);

-- =====================================================================
-- 10. ABONO (suscripción/mensualidad)
--     Entidad: Subscription  (tabla ABONO)
-- =====================================================================
CREATE TABLE ABONO (
    ID_ABONO               BIGSERIAL      NOT NULL,
    ID_USUARIO             INT            NOT NULL,
    PLACA_VEHICULO         VARCHAR(255),
    TIPO_ABONO             VARCHAR(20)    NOT NULL,   -- enum: MENSUAL, TRIMESTRAL, ANUAL
    FECHA_INICIO           DATE           NOT NULL,
    FECHA_FIN              DATE           NOT NULL,
    MONTO                  NUMERIC(12,2),
    ESTADO                 VARCHAR(20)    NOT NULL,   -- enum: ACTIVO, VENCIDO, CANCELADO
    CREADO_POR             VARCHAR(255),
    FECHA_CREACION         TIMESTAMP,
    ULTIMA_MODIFICACION_POR VARCHAR(255),
    ULTIMA_MODIFICACION_DATE TIMESTAMP,
    CONSTRAINT PK_ABONO PRIMARY KEY (ID_ABONO),
    CONSTRAINT FK_ABONO_USUARIO FOREIGN KEY (ID_USUARIO)
        REFERENCES USUARIO (IDENTIFICACION),
    CONSTRAINT FK_ABONO_VEHICULO FOREIGN KEY (PLACA_VEHICULO)
        REFERENCES VEHICULO (PLACA_VEHICULO)
);

-- =====================================================================
-- 11. INCIDENTE
--     Entidad: Incident  (tabla INCIDENTE)
-- =====================================================================
CREATE TABLE INCIDENTE (
    ID_INCIDENTE           BIGSERIAL      NOT NULL,
    ID_ESPACIO             BIGINT,
    PLACA_VEHICULO         VARCHAR(255),
    FECHA_HORA             TIMESTAMP      NOT NULL,
    TIPO_INCIDENTE         VARCHAR(20)    NOT NULL,   -- enum: DANIO, ROBO, ACCIDENTE, OTRO
    DESCRIPCION            VARCHAR(1000),
    ESTADO                 VARCHAR(20)    NOT NULL,   -- enum: REPORTADO, EN_PROCESO, RESUELTO
    CREADO_POR             VARCHAR(255),
    FECHA_CREACION         TIMESTAMP,
    ULTIMA_MODIFICACION_POR VARCHAR(255),
    ULTIMA_MODIFICACION_DATE TIMESTAMP,
    CONSTRAINT PK_INCIDENTE PRIMARY KEY (ID_INCIDENTE),
    CONSTRAINT FK_INCIDENTE_ESPACIO FOREIGN KEY (ID_ESPACIO)
        REFERENCES ESPACIO (ID_ESPACIO),
    CONSTRAINT FK_INCIDENTE_VEHICULO FOREIGN KEY (PLACA_VEHICULO)
        REFERENCES VEHICULO (PLACA_VEHICULO)
);

-- =====================================================================
--  Índices sugeridos para consultas frecuentes
-- =====================================================================
CREATE INDEX IDX_VEHICULO_USUARIO    ON VEHICULO (ID_USUARIO);
CREATE INDEX IDX_ESPACIO_PISO        ON ESPACIO (ID_PISO);
CREATE INDEX IDX_ESPACIO_ZONA        ON ESPACIO (ID_ZONA);
CREATE INDEX IDX_ESPACIO_ESTADO      ON ESPACIO (ESTADO);
CREATE INDEX IDX_TICKET_VEHICULO     ON TICKET (PLACA_VEHICULO);
CREATE INDEX IDX_TICKET_ESTADO       ON TICKET (ESTADO);
CREATE INDEX IDX_RESERVA_USUARIO     ON RESERVA (ID_USUARIO);
CREATE INDEX IDX_RESERVA_ESPACIO     ON RESERVA (ID_ESPACIO);
CREATE INDEX IDX_ABONO_USUARIO       ON ABONO (ID_USUARIO);
CREATE INDEX IDX_INCIDENTE_ESTADO    ON INCIDENTE (ESTADO);
