import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ENUMS } from '../../core/enums';
import type { Payment, Ticket } from '../../core/models';
import { formatCurrency, formatDateTime } from '../../core/utils/format';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { DataTableComponent, TableColumn } from '../../shared/ui/data-table.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

interface PaymentForm {
  idTicket: number | '';
  montoTotal: number | '';
  metodoPago: string;
  referenciaTransaccion: string;
}

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [FormsModule, BadgeComponent, DataTableComponent, ModalComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Pagos" description="Historial de pagos realizados en el parqueadero.">
      <button type="button" class="btn-outline" (click)="showFilters = !showFilters">Filtros</button>
      <button type="button" class="btn-primary" (click)="openCreate()">Registrar pago</button>
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

    @if (showFilters) {
      <form class="card mb-6 space-y-4">
        <div>
          <label class="label">Buscar</label>
          <input class="input" placeholder="Buscar por ID, ticket, método o referencia..." [(ngModel)]="searchTerm" name="searchTerm" (ngModelChange)="filter()" />
        </div>
        <div>
          <label class="label">Método de pago</label>
          <select class="select" [(ngModel)]="methodFilter" name="methodFilter" (ngModelChange)="filter()">
            <option value="">Todos</option>
            @for (m of ENUMS.PaymentMethod; track m) {
              <option [value]="m">{{ m }}</option>
            }
          </select>
        </div>
      </form>
    }

    <app-data-table
      [columns]="columns"
      [rows]="filteredRows"
      [searchKeys]="['idPayment', 'idTicket', 'referenciaTransaccion']"
      placeholder="Buscar pago..."
      emptyMessage="No hay pagos registrados."
      [loading]="loading"
    ></app-data-table>

    <div class="card mt-6">
      <div class="card-header"><h3 class="font-semibold text-white">Resumen</h3></div>
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <p class="text-sm text-neutral-400">Total pagos</p>
          <p class="text-2xl font-bold text-white">{{ filteredRows.length }}</p>
        </div>
        <div>
          <p class="text-sm text-neutral-400">Ingresos totales</p>
          <p class="text-2xl font-bold text-primary-500">{{ formatCurrency(ingresos) }}</p>
        </div>
      </div>
    </div>

    <ng-template #tmplPago let-row="row">
      <span class="font-medium text-white">#{{ row.idPayment }}</span>
    </ng-template>

    <ng-template #tmplTicket let-row="row">
      #{{ row.idTicket }}
    </ng-template>

    <ng-template #tmplMonto let-row="row">
      {{ formatCurrency(row.montoTotal) }}
    </ng-template>

    <ng-template #tmplFecha let-row="row">
      {{ formatDateTime(row.fechaHoraPago) }}
    </ng-template>

    <ng-template #tmplMetodo let-row="row">
      <app-badge [value]="row.metodoPago"></app-badge>
    </ng-template>

    <ng-template #tmplEstado let-row="row">
      <app-badge [value]="row.estadoPago"></app-badge>
    </ng-template>

    <ng-template #tmplReferencia let-row="row">
      {{ row.referenciaTransaccion || '—' }}
    </ng-template>

    <ng-template #tmplAcciones let-row="row">
      <button type="button" class="btn-danger btn-sm" (click)="remove(row)">Eliminar</button>
    </ng-template>

    <app-modal title="Registrar pago" [open]="!!modal" [showFooter]="true" (onClose)="modal = null">
      <form (ngSubmit)="submit($event)" class="space-y-4">
        <div>
          <label class="label">Ticket</label>
          <select class="select" [(ngModel)]="form.idTicket" name="idTicket" required>
            <option [ngValue]="''">Seleccionar</option>
            @for (t of ticketsList; track t.idTicket) {
              <option [ngValue]="t.idTicket">#{{ t.idTicket }} · {{ t.plate }}</option>
            }
          </select>
        </div>
        <div>
          <label class="label">Método de pago</label>
          <select class="select" [(ngModel)]="form.metodoPago" name="metodoPago">
            @for (m of ENUMS.PaymentMethod; track m) {
              <option [value]="m">{{ m }}</option>
            }
          </select>
        </div>
        <div>
          <label class="label">Monto total</label>
          <input type="number" step="0.01" class="input" [(ngModel)]="form.montoTotal" name="montoTotal" required />
        </div>
        <div>
          <label class="label">Referencia de transacción</label>
          <input class="input" [(ngModel)]="form.referenciaTransaccion" name="referenciaTransaccion" />
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
export class PaymentsComponent implements AfterViewInit {
  formatCurrency = formatCurrency;
  formatDateTime = formatDateTime;
  readonly ENUMS = ENUMS;
  rows: Payment[] = [];
  filteredRows: Payment[] = [];
  ticketsList: Ticket[] = [];
  loading = true;
  error = '';
  msg = '';
  saving = false;
  showFilters = false;
  searchTerm = '';
  methodFilter = '';
  modal: { mode: 'create' } | null = null;
  form: PaymentForm = { idTicket: '', montoTotal: '', metodoPago: 'EFECTIVO', referenciaTransaccion: '' };

  columns: TableColumn[] = [];

  @ViewChild('tmplPago') tmplPago!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplTicket') tmplTicket!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplMonto') tmplMonto!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplFecha') tmplFecha!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplMetodo') tmplMetodo!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplEstado') tmplEstado!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplReferencia') tmplReferencia!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplAcciones') tmplAcciones!: TemplateRef<{ $implicit: unknown; row: any }>;

  constructor(private api: ApiService) {}

  get ingresos(): number {
    return this.filteredRows
      .filter((p) => p.estadoPago === 'PAGADO')
      .reduce((sum, p) => sum + Number(p.montoTotal || 0), 0);
  }

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'idPayment', label: 'Pago', bodyTemplate: this.tmplPago },
      { key: 'idTicket', label: 'Ticket', bodyTemplate: this.tmplTicket },
      { key: 'montoTotal', label: 'Monto', bodyTemplate: this.tmplMonto },
      { key: 'fechaHoraPago', label: 'Fecha', bodyTemplate: this.tmplFecha },
      { key: 'metodoPago', label: 'Método', bodyTemplate: this.tmplMetodo },
      { key: 'estadoPago', label: 'Estado', bodyTemplate: this.tmplEstado },
      { key: 'referenciaTransaccion', label: 'Referencia', bodyTemplate: this.tmplReferencia },
      { key: 'acciones', label: 'Acciones', bodyTemplate: this.tmplAcciones },
    ];
  }

  private load(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      payments: this.api.getPayments(),
      tickets: this.api.getTickets().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (data) => {
        this.rows = data.payments || [];
        this.ticketsList = data.tickets || [];
        this.filter();
      },
      error: (e) => { this.error = e?.message || 'Error de conexión.'; },
      complete: () => { this.loading = false; },
    });
  }

  filter(): void {
    const q = this.searchTerm ? this.searchTerm.toLowerCase() : '';
    this.filteredRows = this.rows.filter((p) => {
      const matchesTerm = !q
        || String(p.idPayment).toLowerCase().includes(q)
        || String(p.idTicket).toLowerCase().includes(q)
        || String(p.metodoPago ?? '').toLowerCase().includes(q)
        || String(p.referenciaTransaccion ?? '').toLowerCase().includes(q);
      const matchesMethod = !this.methodFilter || p.metodoPago === this.methodFilter;
      return matchesTerm && matchesMethod;
    });
  }

  openCreate(): void {
    this.form = { idTicket: '', montoTotal: '', metodoPago: 'EFECTIVO', referenciaTransaccion: '' };
    this.modal = { mode: 'create' };
  }

  submit($event: Event): void {
    $event.preventDefault();
    this.saving = true;
    this.error = '';
    this.api.createPayment({
      idTicket: Number(this.form.idTicket),
      montoTotal: Number(this.form.montoTotal),
      metodoPago: this.form.metodoPago,
      referenciaTransaccion: this.form.referenciaTransaccion,
    }).subscribe({
      next: () => {
        this.msg = 'Pago registrado correctamente.';
        this.modal = null;
        this.saving = false;
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al registrar el pago.';
        this.saving = false;
      },
    });
  }

  remove(row: Payment): void {
    if (!window.confirm(`¿Eliminar el pago #${row.idPayment}?`)) return;
    this.error = '';
    this.api.removePayment(row.idPayment).subscribe({
      next: () => { this.msg = 'Pago eliminado.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al eliminar.'; },
    });
  }
}
