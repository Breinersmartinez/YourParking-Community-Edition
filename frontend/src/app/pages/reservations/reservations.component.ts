import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import type { Reservation, Space } from '../../core/models';
import { formatCurrency, formatDateTime } from '../../core/utils/format';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { DataTableComponent, TableColumn } from '../../shared/ui/data-table.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

interface ReservationForm {
  idCard: number;
  idEspacio: number | '';
  fechaHoraInicio: string;
  fechaHoraFin: string;
  montoReserva: number;
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [FormsModule, BadgeComponent, DataTableComponent, ModalComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Reservas" description="Gestiona las reservas de espacios del parqueadero.">
      <button type="button" class="btn-primary" (click)="openCreate()">Nueva reserva</button>
    </app-page-header>

    @if (error) {
      <div class="mb-4 rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4">
        <p class="text-sm text-danger-500">{{ error }}</p>
      </div>
    }
    @if (msg) {
      <div class="mb-4 rounded-md border-l-4 border-success-500 bg-success-500/10 p-4">
        <p class="text-sm text-success-500">{{ msg }}</p>
      </div>
    }

    <app-data-table
      [columns]="columns"
      [rows]="rows"
      [searchKeys]="['idReserva', 'idCard']"
      placeholder="Buscar por reserva o cliente..."
      emptyMessage="No hay reservas registradas."
      [loading]="loading"
    ></app-data-table>

    <ng-template #tmplReserva let-row="row">
      <span class="font-medium text-white">#{{ row.idReserva }}</span>
    </ng-template>

    <ng-template #tmplEspacio let-row="row">
      #{{ spaceNum(row.idEspacio) }}
    </ng-template>

    <ng-template #tmplInicio let-row="row">
      {{ formatDateTime(row.fechaHoraInicio) }}
    </ng-template>

    <ng-template #tmplFin let-row="row">
      {{ formatDateTime(row.fechaHoraFin) }}
    </ng-template>

    <ng-template #tmplMonto let-row="row">
      {{ formatCurrency(row.montoReserva) }}
    </ng-template>

    <ng-template #tmplEstado let-row="row">
      <app-badge [value]="row.estado"></app-badge>
    </ng-template>

    <ng-template #tmplAcciones let-row="row">
      <div class="flex gap-2">
        @if (['PENDIENTE', 'CONFIRMADA'].includes(row.estado)) {
          <button type="button" class="btn-success btn-sm" (click)="changeState(row, 'CUMPLIDA')">Cumplir</button>
        }
        @if (row.estado !== 'CANCELADA') {
          <button type="button" class="btn-danger btn-sm" (click)="changeState(row, 'CANCELADA')">Cancelar</button>
        }
        <button type="button" class="btn-outline btn-sm" (click)="remove(row)">Eliminar</button>
      </div>
    </ng-template>

    <app-modal title="Nueva reserva" [open]="!!modal" [showFooter]="true" (onClose)="modal = null">
      <form (ngSubmit)="submit($event)" class="space-y-4">
        <div>
          <label class="label">ID Cliente</label>
          <input type="number" class="input" [(ngModel)]="form.idCard" name="idCard" required />
        </div>
        <div>
          <label class="label">Espacio</label>
          <select class="select" [(ngModel)]="form.idEspacio" name="idEspacio" required>
            <option value="">Seleccionar</option>
            @for (s of availableSpaces; track s.idEspacio) {
              <option [value]="s.idEspacio">#{{ s.numeroEspacio }}</option>
            }
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Inicio</label>
            <input type="datetime-local" class="input" [(ngModel)]="form.fechaHoraInicio" name="fechaHoraInicio" required />
          </div>
          <div>
            <label class="label">Fin</label>
            <input type="datetime-local" class="input" [(ngModel)]="form.fechaHoraFin" name="fechaHoraFin" required />
          </div>
        </div>
        <div>
          <label class="label">Monto reserva</label>
          <input type="number" step="0.01" class="input" [(ngModel)]="form.montoReserva" name="montoReserva" required />
        </div>
      </form>
      <div modal-footer>
        <button type="button" class="btn-ghost" (click)="modal = null">Cancelar</button>
        <button type="button" class="btn-primary" [disabled]="saving" (click)="submit($event)">
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </app-modal>
  `,
})
export class ReservationsComponent implements AfterViewInit {
  formatCurrency = formatCurrency;
  formatDateTime = formatDateTime;
  rows: Reservation[] = [];
  spacesList: Space[] = [];
  loading = true;
  error = '';
  msg = '';
  saving = false;
  modal: { mode: 'create' | 'edit'; id?: number } | null = null;
  form: ReservationForm = { idCard: 0, idEspacio: '', fechaHoraInicio: '', fechaHoraFin: '', montoReserva: 0 };

  columns: TableColumn[] = [];

  @ViewChild('tmplReserva') tmplReserva!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplEspacio') tmplEspacio!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplInicio') tmplInicio!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplFin') tmplFin!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplMonto') tmplMonto!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplEstado') tmplEstado!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplAcciones') tmplAcciones!: TemplateRef<{ $implicit: unknown; row: any }>;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'idReserva', label: 'Reserva', bodyTemplate: this.tmplReserva },
      { key: 'idCard', label: 'Cliente (ID)' },
      { key: 'idEspacio', label: 'Espacio', bodyTemplate: this.tmplEspacio },
      { key: 'fechaHoraInicio', label: 'Inicio', bodyTemplate: this.tmplInicio },
      { key: 'fechaHoraFin', label: 'Fin', bodyTemplate: this.tmplFin },
      { key: 'montoReserva', label: 'Monto', bodyTemplate: this.tmplMonto },
      { key: 'estado', label: 'Estado', bodyTemplate: this.tmplEstado },
      { key: 'acciones', label: 'Acciones', bodyTemplate: this.tmplAcciones },
    ];
  }

  get availableSpaces(): Space[] {
    return this.spacesList.filter((s) => s.estado === 'DISPONIBLE');
  }

  private load(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      reservations: this.api.getReservations(),
      spaces: this.api.getSpaces().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (data) => {
        this.rows = data.reservations || [];
        this.spacesList = data.spaces || [];
      },
      error: (e) => { this.error = e?.message || 'Error de conexión.'; },
      complete: () => { this.loading = false; },
    });
  }

  spaceNum(idEspacio: number): number | string {
    const space = this.spacesList.find((s) => s.idEspacio === idEspacio);
    return space ? space.numeroEspacio : idEspacio;
  }

  openCreate(): void {
    this.form = { idCard: 0, idEspacio: '', fechaHoraInicio: '', fechaHoraFin: '', montoReserva: 0 };
    this.modal = { mode: 'create' };
  }

  submit($event: Event): void {
    $event.preventDefault();
    this.saving = true;
    this.error = '';
    this.api.createReservation({
      idCard: Number(this.form.idCard),
      idEspacio: Number(this.form.idEspacio),
      fechaHoraInicio: new Date(this.form.fechaHoraInicio).toISOString(),
      fechaHoraFin: new Date(this.form.fechaHoraFin).toISOString(),
      montoReserva: Number(this.form.montoReserva),
    }).subscribe({
      next: () => {
        this.msg = 'Reserva creada.';
        this.modal = null;
        this.saving = false;
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al crear la reserva.';
        this.saving = false;
      },
    });
  }

  changeState(row: Reservation, estado: string): void {
    const label = estado === 'CUMPLIDA' ? 'cumplida' : 'cancelada';
    if (!window.confirm(`¿Marcar la reserva #${row.idReserva} como ${label}?`)) return;
    this.error = '';
    this.api.changeReservationState(row.idReserva, estado).subscribe({
      next: () => { this.msg = 'Estado actualizado.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al actualizar estado.'; },
    });
  }

  remove(row: Reservation): void {
    if (!window.confirm(`¿Eliminar la reserva #${row.idReserva}?`)) return;
    this.error = '';
    this.api.removeReservation(row.idReserva).subscribe({
      next: () => { this.msg = 'Reserva eliminada.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al eliminar.'; },
    });
  }
}
