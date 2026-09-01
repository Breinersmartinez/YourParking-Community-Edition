import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ENUMS } from '../../core/enums';
import type { Incident, Ticket } from '../../core/models';
import { formatDateTime } from '../../core/utils/format';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { DataTableComponent, TableColumn } from '../../shared/ui/data-table.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

interface IncidentForm {
  idEspacio: number | '';
  plate: string;
  fechaHora: string;
  tipoIncidente: string;
  descripcion: string;
}

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [FormsModule, BadgeComponent, DataTableComponent, ModalComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Incidentes" description="Registra y gestiona los incidentes del parqueadero.">
      <button type="button" class="btn-primary" (click)="openCreate()">Reportar incidente</button>
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
      [searchKeys]="['plate', 'descripcion']"
      placeholder="Buscar por placa o descripción..."
      emptyMessage="No hay incidentes registrados."
      [loading]="loading"
    ></app-data-table>

    <ng-template #tmplIncidente let-row="row">
      <span class="font-medium text-white">#{{ row.idIncidente }}</span>
    </ng-template>

    <ng-template #tmplEspacio let-row="row">
      {{ row.idEspacio ? '#' + row.idEspacio : '—' }}
    </ng-template>

    <ng-template #tmplTipo let-row="row">
      <app-badge [value]="row.tipoIncidente"></app-badge>
    </ng-template>

    <ng-template #tmplFecha let-row="row">
      {{ formatDateTime(row.fechaHora) }}
    </ng-template>

    <ng-template #tmplDescripcion let-row="row">
      <span class="max-w-xs truncate">{{ row.descripcion }}</span>
    </ng-template>

    <ng-template #tmplEstado let-row="row">
      <app-badge [value]="row.estado"></app-badge>
    </ng-template>

    <ng-template #tmplAcciones let-row="row">
      <div class="flex gap-2">
        @if (row.estado === 'REPORTADO') {
          <button type="button" class="btn-blue btn-sm" (click)="changeState(row, 'EN_PROCESO')">En proceso</button>
        }
        @if (row.estado !== 'RESUELTO') {
          <button type="button" class="btn-success btn-sm" (click)="changeState(row, 'RESUELTO')">Resolver</button>
        }
        <button type="button" class="btn-danger btn-sm" (click)="remove(row)">Eliminar</button>
      </div>
    </ng-template>

    <app-modal title="Reportar incidente" [open]="!!modal" [showFooter]="true" (onClose)="modal = null">
      <form (ngSubmit)="submit($event)" class="space-y-4">
        <div>
          <label class="label">Placa</label>
          <input class="input uppercase" list="placas" placeholder="Placa" [(ngModel)]="form.plate" name="plate" required />
          <datalist id="placas">
            @for (t of ticketsList; track t.idTicket) {
              <option [value]="t.plate"></option>
            }
          </datalist>
        </div>
        <div>
          <label class="label">Tipo de incidente</label>
          <select class="select" [(ngModel)]="form.tipoIncidente" name="tipoIncidente">
            @for (t of ENUMS.IncidentType; track t) {
              <option [value]="t">{{ t }}</option>
            }
          </select>
        </div>
        <div>
          <label class="label">Espacio</label>
          <input type="number" class="input" placeholder="Opcional" [(ngModel)]="form.idEspacio" name="idEspacio" />
        </div>
        <div>
          <label class="label">Fecha y hora</label>
          <input type="datetime-local" class="input" [(ngModel)]="form.fechaHora" name="fechaHora" required />
        </div>
        <div>
          <label class="label">Descripción</label>
          <textarea class="input" rows="3" [(ngModel)]="form.descripcion" name="descripcion" required></textarea>
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
export class IncidentsComponent implements AfterViewInit {
  formatDateTime = formatDateTime;
  readonly ENUMS = ENUMS;
  rows: Incident[] = [];
  ticketsList: Ticket[] = [];
  loading = true;
  error = '';
  msg = '';
  saving = false;
  modal: { mode: 'create' | 'edit'; id?: number } | null = null;
  form: IncidentForm = { idEspacio: '', plate: '', fechaHora: '', tipoIncidente: 'OTRO', descripcion: '' };

  columns: TableColumn[] = [];

  @ViewChild('tmplIncidente') tmplIncidente!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplEspacio') tmplEspacio!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplTipo') tmplTipo!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplFecha') tmplFecha!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplDescripcion') tmplDescripcion!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplEstado') tmplEstado!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplAcciones') tmplAcciones!: TemplateRef<{ $implicit: unknown; row: any }>;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'idIncidente', label: 'Incidente', bodyTemplate: this.tmplIncidente },
      { key: 'plate', label: 'Placa' },
      { key: 'idEspacio', label: 'Espacio', bodyTemplate: this.tmplEspacio },
      { key: 'tipoIncidente', label: 'Tipo', bodyTemplate: this.tmplTipo },
      { key: 'fechaHora', label: 'Fecha', bodyTemplate: this.tmplFecha },
      { key: 'descripcion', label: 'Descripción', className: 'max-w-xs truncate', bodyTemplate: this.tmplDescripcion },
      { key: 'estado', label: 'Estado', bodyTemplate: this.tmplEstado },
      { key: 'acciones', label: 'Acciones', bodyTemplate: this.tmplAcciones },
    ];
  }

  private load(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      incidents: this.api.getIncidents(),
      tickets: this.api.getTickets().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (data) => {
        this.rows = data.incidents || [];
        this.ticketsList = data.tickets || [];
      },
      error: (e) => { this.error = e?.message || 'Error de conexión.'; },
      complete: () => { this.loading = false; },
    });
  }

  openCreate(): void {
    this.form = {
      idEspacio: '',
      plate: '',
      fechaHora: new Date().toISOString().slice(0, 16),
      tipoIncidente: 'OTRO',
      descripcion: '',
    };
    this.modal = { mode: 'create' };
  }

  submit($event: Event): void {
    $event.preventDefault();
    this.saving = true;
    this.error = '';
    const incForm = this.form as IncidentForm;
    this.api.createIncident({
      idEspacio: incForm.idEspacio ? Number(incForm.idEspacio) : null,
      plate: incForm.plate,
      fechaHora: new Date(incForm.fechaHora).toISOString(),
      tipoIncidente: incForm.tipoIncidente,
      descripcion: incForm.descripcion,
    }).subscribe({
      next: () => {
        this.msg = 'Incidente reportado.';
        this.modal = null;
        this.saving = false;
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al reportar el incidente.';
        this.saving = false;
      },
    });
  }

  changeState(row: Incident, estado: string): void {
    if (!window.confirm(`¿Cambiar el estado del incidente #${row.idIncidente} a ${estado}?`)) return;
    this.error = '';
    this.api.changeIncidentState(row.idIncidente, estado).subscribe({
      next: () => { this.msg = 'Estado actualizado.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al actualizar estado.'; },
    });
  }

  remove(row: Incident): void {
    if (!window.confirm(`¿Eliminar el incidente #${row.idIncidente}?`)) return;
    this.error = '';
    this.api.removeIncident(row.idIncidente).subscribe({
      next: () => { this.msg = 'Incidente eliminado.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al eliminar.'; },
    });
  }
}
