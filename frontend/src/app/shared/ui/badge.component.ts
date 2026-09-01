import { Component, Input } from '@angular/core';

const STATE_COLORS: Record<string, string> = {
  // Espacios
  DISPONIBLE: 'badge-green',
  OCUPADO: 'badge-red',
  RESERVADO: 'badge-yellow',
  MANTENIMIENTO: 'badge-gray',
  // Tickets
  ACTIVO: 'badge-green',
  FINALIZADO: 'badge-blue',
  CANCELADO: 'badge-red',
  // Reservas
  PENDIENTE: 'badge-yellow',
  CONFIRMADA: 'badge-blue',
  CUMPLIDA: 'badge-green',
  // Pagos
  PAGADO: 'badge-green',
  // Suscripciones
  VENCIDO: 'badge-red',
  // Incidentes
  REPORTADO: 'badge-yellow',
  EN_PROCESO: 'badge-blue',
  RESUELTO: 'badge-green',
  // Users
  true: 'badge-green',
  false: 'badge-red',
};

const LABELS: Record<string, string> = {
  DISPONIBLE: 'Disponible',
  OCUPADO: 'Ocupado',
  RESERVADO: 'Reservado',
  MANTENIMIENTO: 'Mantenimiento',
  ACTIVO: 'Activo',
  FINALIZADO: 'Finalizado',
  CANCELADO: 'Cancelado',
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  CUMPLIDA: 'Cumplida',
  PAGADO: 'Pagado',
  VENCIDO: 'Vencido',
  REPORTADO: 'Reportado',
  EN_PROCESO: 'En proceso',
  RESUELTO: 'Resuelto',
  ESTANDAR: 'Estándar',
  DISCAPACIDAD: 'Discapacidad',
  FAMILIA: 'Familia',
  ELECTRICO: 'Eléctrico',
  EFECTIVO: 'Efectivo',
  TARJETA: 'Tarjeta',
  APP: 'App',
  QR: 'QR',
  DANIO: 'Daño',
  ROBO: 'Robo',
  ACCIDENTE: 'Accidente',
  OTRO: 'Otro',
  MENSUAL: 'Mensual',
  TRIMESTRAL: 'Trimestral',
  ANUAL: 'Anual',
  ADMIN: 'Administrador',
  OPERATOR: 'Operador',
  SUPERVISOR: 'Supervisor',
  VIGILANTE: 'Vigilante',
  USER: 'Usuario',
};

@Component({
  selector: 'app-badge',
  standalone: true,
  template: `<span [class]="statusClass()">{{ statusLabel() }}</span>`,
})
export class BadgeComponent {
  @Input() value: unknown;

  statusClass(): string {
    const v = this.value;
    if (v === true || v === false) return STATE_COLORS[String(v)] || 'badge-gray';
    return STATE_COLORS[String(v)] || 'badge-gray';
  }

  statusLabel(): string {
    const v = this.value;
    if (v === true || v === false) return v ? 'Activo' : 'Inactivo';
    return LABELS[String(v)] || String(v);
  }
}
