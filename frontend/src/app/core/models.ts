import type { IncidentState, IncidentType, PaymentMethod, Role, SpaceState, SpaceType, VehicleType } from './enums';

export type { Role };

export interface User {
  idCard: number;
  identificationType: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber: string;
  direction: string;
  role: Role;
  active: boolean;
  registrationDate?: string;
}

export interface Level {
  idPiso?: number;
  numeroPiso: number;
  capacidadTotal: number;
  espaciosDisponibles: number;
}

export interface Zone {
  idZona?: number;
  nombreZona: string;
  descripcion: string;
  idPiso: number;
}

export interface Space {
  idEspacio?: number;
  numeroEspacio: number;
  estado: SpaceState;
  tipoEspacio: SpaceType;
  dimensiones: string;
  idPiso: number;
  idZona?: number | null;
}

export interface Vehicle {
  plate: string;
  typeVehicle: VehicleType;
  brandVehicle: string;
  colorVehicle: string;
  propertyCard?: string;
  entryDate?: string | null;
  departureDate?: string | null;
  ownerIdCard?: number | null;
}

export interface Ticket {
  idTicket: number;
  plate: string;
  idEspacio: number;
  entryDate: string;
  exitDate?: string | null;
  totalMinutes?: number;
  totalAmount?: number;
  state: string;
}

export interface Reservation {
  idReserva: number;
  idCard: number;
  idEspacio: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  montoReserva: number;
  estado: string;
}

export interface Payment {
  idPayment: number;
  idTicket: number;
  montoTotal: number;
  metodoPago: PaymentMethod;
  fechaHoraPago?: string;
  referenciaTransaccion?: string;
  estadoPago: string;
}

export interface Rate {
  idTarifa: number;
  tipoVehiculo: VehicleType;
  precioHora: number;
  precioFraccion: number;
  precioDia: number;
  precioMes: number;
  precioAnio: number;
  fechaVigenciaInicio?: string;
  fechaVigenciaFin?: string;
}

export interface Subscription {
  idAbono: number;
  plate: string;
  tipoAbono: string;
  fechaInicio: string;
  fechaFin: string;
  monto: number;
  estado: string;
}

export interface Incident {
  idIncidente: number;
  idEspacio?: number | null;
  plate: string;
  fechaHora: string;
  tipoIncidente: IncidentType;
  descripcion: string;
  estado: IncidentState;
}

export interface AuthResponse {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
