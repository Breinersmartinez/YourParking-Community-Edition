export const ENUMS = {
  Role: ['ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE', 'USER'],
  IdentificationType: ['TI', 'CC', 'NUIP', 'CE', 'P'],
  SpaceState: ['DISPONIBLE', 'OCUPADO', 'RESERVADO', 'MANTENIMIENTO'],
  SpaceType: ['ESTANDAR', 'DISCAPACIDAD', 'FAMILIA', 'ELECTRICO'],
  TicketState: ['ACTIVO', 'FINALIZADO', 'CANCELADO'],
  ReservationState: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'CUMPLIDA'],
  PaymentState: ['PENDIENTE', 'PAGADO', 'CANCELADO'],
  PaymentMethod: ['EFECTIVO', 'TARJETA', 'APP', 'QR'],
  SubscriptionState: ['ACTIVO', 'VENCIDO', 'CANCELADO'],
  SubscriptionType: ['MENSUAL', 'TRIMESTRAL', 'ANUAL'],
  IncidentState: ['REPORTADO', 'EN_PROCESO', 'RESUELTO'],
  IncidentType: ['DANIO', 'ROBO', 'ACCIDENTE', 'OTRO'],
  VehicleType: ['AUTO', 'MOTO', 'CAMIONETA', 'CAMION', 'BUS', 'BICICLETA'],
} as const;

export type Role = (typeof ENUMS.Role)[number];
export type SpaceState = (typeof ENUMS.SpaceState)[number];
export type SpaceType = (typeof ENUMS.SpaceType)[number];
export type VehicleType = (typeof ENUMS.VehicleType)[number];
export type IncidentType = (typeof ENUMS.IncidentType)[number];
export type IncidentState = (typeof ENUMS.IncidentState)[number];
export type PaymentMethod = (typeof ENUMS.PaymentMethod)[number];
