import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import type { Space, Ticket, Vehicle } from '../../core/models';
import { formatCurrency, formatDateTime, formatDuration } from '../../core/utils/format';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { DataTableComponent, TableColumn } from '../../shared/ui/data-table.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [FormsModule, BadgeComponent, DataTableComponent, ModalComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Tickets" description="Registra ingresos y controla los tickets del parqueadero.">
      <button type="button" class="btn-primary" (click)="openEntry()">Registrar ingreso</button>
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
      [searchKeys]="['plate', 'idTicket']"
      placeholder="Buscar por ticket o placa..."
      emptyMessage="No hay tickets registrados."
      [loading]="loading"
    ></app-data-table>

    <ng-template #tmplTicket let-row="row">
      <span class="font-medium text-white">#{{ row.idTicket }}</span>
    </ng-template>

    <ng-template #tmplEspacio let-row="row">
      #{{ spaceNum(row.idEspacio) }}
    </ng-template>

    <ng-template #tmplIngreso let-row="row">
      {{ formatDateTime(row.entryDate) }}
    </ng-template>

    <ng-template #tmplSalida let-row="row">
      {{ row.exitDate ? formatDateTime(row.exitDate) : '—' }}
    </ng-template>

    <ng-template #tmplDuracion let-row="row">
      {{ formatDuration(row.totalMinutes) }}
    </ng-template>

    <ng-template #tmplMonto let-row="row">
      {{ formatCurrency(row.totalAmount) }}
    </ng-template>

    <ng-template #tmplEstado let-row="row">
      <app-badge [value]="row.state"></app-badge>
    </ng-template>

    <ng-template #tmplAcciones let-row="row">
      <div class="flex gap-2">
        @if (row.state === 'ACTIVO') {
          <button type="button" class="btn-success btn-sm" (click)="closeTicket(row)">Salida</button>
          <button type="button" class="btn-danger btn-sm" (click)="cancelTicket(row)">Cancelar</button>
        }
      </div>
    </ng-template>

    <app-modal title="Registrar ingreso" [open]="entryModal" [showFooter]="true" (onClose)="entryModal = false">
      <form (ngSubmit)="submitEntry($event)" class="space-y-4">
        <div>
          <label class="label">Placa</label>
          <input class="input uppercase" list="vehiculos" placeholder="Placa" [(ngModel)]="entryForm.plate" name="plate" required />
          <datalist id="vehiculos">
            @for (v of vehiclesList; track v.plate) {
              <option [value]="v.plate"></option>
            }
          </datalist>
        </div>
        <div>
          <label class="label">Espacio</label>
          <select class="select" [(ngModel)]="entryForm.idEspacio" name="idEspacio" required>
            @if (availableSpaces.length === 0) {
              <option>Sin espacios disponibles</option>
            } @else {
              @for (s of availableSpaces; track s.idEspacio) {
                <option [value]="s.idEspacio">#{{ s.numeroEspacio }}</option>
              }
            }
          </select>
        </div>
        <div>
          <label class="label">Fecha y hora de ingreso</label>
          <input type="datetime-local" class="input" [(ngModel)]="entryForm.entryDate" name="entryDate" required />
        </div>
      </form>
      <div modal-footer>
        <button type="button" class="btn-ghost" (click)="entryModal = false">Cancelar</button>
        <button type="button" class="btn-primary" [disabled]="saving" (click)="submitEntry($event)">
          {{ saving ? 'Registrando...' : 'Registrar' }}
        </button>
      </div>
    </app-modal>
  `,
})
export class TicketsComponent implements AfterViewInit {
  formatCurrency = formatCurrency;
  formatDateTime = formatDateTime;
  formatDuration = formatDuration;
  rows: Ticket[] = [];
  spacesList: Space[] = [];
  vehiclesList: Vehicle[] = [];
  loading = true;
  error = '';
  msg = '';
  saving = false;
  entryModal = false;
  entryForm = { plate: '', idEspacio: '', entryDate: '' };

  columns: TableColumn[] = [];

  @ViewChild('tmplTicket') tmplTicket!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplEspacio') tmplEspacio!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplIngreso') tmplIngreso!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplSalida') tmplSalida!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplDuracion') tmplDuracion!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplMonto') tmplMonto!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplEstado') tmplEstado!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplAcciones') tmplAcciones!: TemplateRef<{ $implicit: unknown; row: any }>;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'idTicket', label: 'Ticket', bodyTemplate: this.tmplTicket },
      { key: 'plate', label: 'Placa' },
      { key: 'idEspacio', label: 'Espacio', bodyTemplate: this.tmplEspacio },
      { key: 'entryDate', label: 'Ingreso', bodyTemplate: this.tmplIngreso },
      { key: 'exitDate', label: 'Salida', bodyTemplate: this.tmplSalida },
      { key: 'totalMinutes', label: 'Duración', bodyTemplate: this.tmplDuracion },
      { key: 'totalAmount', label: 'Monto', bodyTemplate: this.tmplMonto },
      { key: 'state', label: 'Estado', bodyTemplate: this.tmplEstado },
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
      tickets: this.api.getTickets(),
      spaces: this.api.getSpaces().pipe(catchError(() => of([]))),
      vehicles: this.api.getVehicles().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (data) => {
        this.rows = data.tickets || [];
        this.spacesList = data.spaces || [];
        this.vehiclesList = data.vehicles || [];
      },
      error: (e) => { this.error = e?.message || 'Error de conexión.'; },
      complete: () => { this.loading = false; },
    });
  }

  spaceNum(idEspacio: number): number | string {
    const space = this.spacesList.find((s) => s.idEspacio === idEspacio);
    return space ? space.numeroEspacio : idEspacio;
  }

  openEntry(): void {
    this.entryForm = {
      plate: '',
      idEspacio: `${this.availableSpaces[0]?.idEspacio ?? ''}`,
      entryDate: new Date().toISOString().slice(0, 16),
    };
    this.entryModal = true;
  }

  submitEntry($event: Event): void {
    $event.preventDefault();
    this.saving = true;
    this.error = '';
    this.api.createTicketEntry({
      plate: this.entryForm.plate,
      idEspacio: Number(this.entryForm.idEspacio),
      entryDate: new Date(this.entryForm.entryDate).toISOString(),
    }).subscribe({
      next: () => {
        this.msg = 'Ingreso registrado.';
        this.entryModal = false;
        this.saving = false;
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al registrar el ingreso.';
        this.saving = false;
      },
    });
  }

  closeTicket(row: Ticket): void {
    if (!window.confirm(`¿Registrar la salida del ticket #${row.idTicket}?`)) return;
    this.error = '';
    this.api.closeTicket(row.idTicket).subscribe({
      next: () => { this.msg = 'Salida registrada.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al registrar la salida.'; },
    });
  }

  cancelTicket(row: Ticket): void {
    if (!window.confirm(`¿Cancelar el ticket #${row.idTicket}?`)) return;
    this.error = '';
    this.api.cancelTicket(row.idTicket).subscribe({
      next: () => { this.msg = 'Ticket cancelado.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al cancelar el ticket.'; },
    });
  }
}
