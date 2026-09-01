import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ENUMS } from '../../core/enums';
import type { Rate } from '../../core/models';
import { formatCurrency } from '../../core/utils/format';
import { DataTableComponent, TableColumn } from '../../shared/ui/data-table.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

interface RateForm {
  tipoVehiculo: string;
  precioHora: number | '';
  precioFraccion: number | '';
  precioDia: number | '';
  precioMes: number | '';
  precioAnio: number | '';
  fechaVigenciaInicio: string;
  fechaVigenciaFin: string;
}

@Component({
  selector: 'app-rates',
  standalone: true,
  imports: [FormsModule, DataTableComponent, ModalComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Tarifas" description="Administra las tarifas del parqueadero.">
      <button type="button" class="btn-primary" (click)="openCreate()">Nueva tarifa</button>
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
      [searchKeys]="['tipoVehiculo']"
      placeholder="Buscar tarifa..."
      emptyMessage="No hay tarifas registradas."
      [loading]="loading"
    ></app-data-table>

    <ng-template #tmplTipo let-row="row">
      <span class="font-medium text-white">{{ row.tipoVehiculo }}</span>
    </ng-template>

    <ng-template #tmplHora let-row="row">
      {{ formatCurrency(row.precioHora) }}
    </ng-template>

    <ng-template #tmplFraccion let-row="row">
      {{ formatCurrency(row.precioFraccion) }}
    </ng-template>

    <ng-template #tmplDia let-row="row">
      {{ formatCurrency(row.precioDia) }}
    </ng-template>

    <ng-template #tmplMes let-row="row">
      {{ formatCurrency(row.precioMes) }}
    </ng-template>

    <ng-template #tmplAnio let-row="row">
      {{ formatCurrency(row.precioAnio) }}
    </ng-template>

    <ng-template #tmplVigencia let-row="row">
      @if (row.fechaVigenciaInicio && row.fechaVigenciaFin) {
        {{ row.fechaVigenciaInicio }} → {{ row.fechaVigenciaFin }}
      } @else {
        —
      }
    </ng-template>

    <ng-template #tmplAcciones let-row="row">
      <div class="flex gap-2">
        <button type="button" class="btn-outline btn-sm" (click)="openEdit(row)">Editar</button>
        <button type="button" class="btn-danger btn-sm" (click)="remove(row)">Eliminar</button>
      </div>
    </ng-template>

    <app-modal
      [title]="modal?.mode === 'edit' ? 'Editar tarifa' : 'Nueva tarifa'"
      [open]="!!modal"
      [showFooter]="true"
      (onClose)="modal = null"
    >
      <form (ngSubmit)="submit($event)" class="space-y-4">
        <div>
          <label class="label">Tipo de vehículo</label>
          <select class="select" [(ngModel)]="form.tipoVehiculo" name="tipoVehiculo">
            @for (t of ENUMS.VehicleType; track t) {
              <option [value]="t">{{ t }}</option>
            }
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Precio hora</label>
            <input type="number" step="0.01" class="input" [(ngModel)]="form.precioHora" name="precioHora" required />
          </div>
          <div>
            <label class="label">Precio fracción</label>
            <input type="number" step="0.01" class="input" [(ngModel)]="form.precioFraccion" name="precioFraccion" required />
          </div>
          <div>
            <label class="label">Precio día</label>
            <input type="number" step="0.01" class="input" [(ngModel)]="form.precioDia" name="precioDia" required />
          </div>
          <div>
            <label class="label">Precio mes</label>
            <input type="number" step="0.01" class="input" [(ngModel)]="form.precioMes" name="precioMes" required />
          </div>
          <div>
            <label class="label">Precio año</label>
            <input type="number" step="0.01" class="input" [(ngModel)]="form.precioAnio" name="precioAnio" required />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Vigencia inicio</label>
            <input type="date" class="input" [(ngModel)]="form.fechaVigenciaInicio" name="fechaVigenciaInicio" />
          </div>
          <div>
            <label class="label">Vigencia fin</label>
            <input type="date" class="input" [(ngModel)]="form.fechaVigenciaFin" name="fechaVigenciaFin" />
          </div>
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
export class RatesComponent implements AfterViewInit {
  formatCurrency = formatCurrency;
  readonly ENUMS = ENUMS;
  rows: Rate[] = [];
  loading = true;
  error = '';
  msg = '';
  saving = false;
  modal: { mode: 'create' | 'edit'; id?: number } | null = null;
  form: RateForm = {
    tipoVehiculo: 'AUTO',
    precioHora: '',
    precioFraccion: '',
    precioDia: '',
    precioMes: '',
    precioAnio: '',
    fechaVigenciaInicio: '',
    fechaVigenciaFin: '',
  };

  columns: TableColumn[] = [];

  @ViewChild('tmplTipo') tmplTipo!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplHora') tmplHora!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplFraccion') tmplFraccion!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplDia') tmplDia!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplMes') tmplMes!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplAnio') tmplAnio!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplVigencia') tmplVigencia!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplAcciones') tmplAcciones!: TemplateRef<{ $implicit: unknown; row: any }>;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'tipoVehiculo', label: 'Tipo', bodyTemplate: this.tmplTipo },
      { key: 'precioHora', label: 'Hora', bodyTemplate: this.tmplHora },
      { key: 'precioFraccion', label: 'Fracción', bodyTemplate: this.tmplFraccion },
      { key: 'precioDia', label: 'Día', bodyTemplate: this.tmplDia },
      { key: 'precioMes', label: 'Mes', bodyTemplate: this.tmplMes },
      { key: 'precioAnio', label: 'Año', bodyTemplate: this.tmplAnio },
      { key: 'fechaVigenciaInicio', label: 'Vigencia', bodyTemplate: this.tmplVigencia },
      { key: 'acciones', label: 'Acciones', bodyTemplate: this.tmplAcciones },
    ];
  }

  private load(): void {
    this.loading = true;
    this.error = '';
    this.api.getRates().subscribe({
      next: (data) => { this.rows = data || []; },
      error: (e) => { this.error = e?.message || 'Error de conexión.'; },
      complete: () => { this.loading = false; },
    });
  }

  openCreate(): void {
    this.form = {
      tipoVehiculo: 'AUTO',
      precioHora: '',
      precioFraccion: '',
      precioDia: '',
      precioMes: '',
      precioAnio: '',
      fechaVigenciaInicio: '',
      fechaVigenciaFin: '',
    };
    this.modal = { mode: 'create' };
  }

  openEdit(row: Rate): void {
    this.form = {
      tipoVehiculo: row.tipoVehiculo,
      precioHora: row.precioHora,
      precioFraccion: row.precioFraccion,
      precioDia: row.precioDia,
      precioMes: row.precioMes,
      precioAnio: row.precioAnio,
      fechaVigenciaInicio: row.fechaVigenciaInicio ?? '',
      fechaVigenciaFin: row.fechaVigenciaFin ?? '',
    };
    this.modal = { mode: 'edit', id: row.idTarifa };
  }

  submit($event: Event): void {
    $event.preventDefault();
    this.saving = true;
    this.error = '';
    const payload = {
      idTarifa: this.modal?.id ?? 0,
      tipoVehiculo: this.form.tipoVehiculo,
      precioHora: Number(this.form.precioHora),
      precioFraccion: Number(this.form.precioFraccion),
      precioDia: Number(this.form.precioDia),
      precioMes: Number(this.form.precioMes),
      precioAnio: Number(this.form.precioAnio),
      fechaVigenciaInicio: this.form.fechaVigenciaInicio || null,
      fechaVigenciaFin: this.form.fechaVigenciaFin || null,
    } as Rate;
    const req = this.modal?.mode === 'edit' && this.modal.id != null
      ? this.api.updateRate(this.modal.id, payload)
      : this.api.createRate(payload);
    req.subscribe({
      next: () => {
        this.msg = this.modal?.mode === 'edit' ? 'Tarifa actualizada.' : 'Tarifa creada.';
        this.modal = null;
        this.saving = false;
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al guardar.';
        this.saving = false;
      },
    });
  }

  remove(row: Rate): void {
    if (!window.confirm(`¿Eliminar la tarifa ${row.tipoVehiculo}?`)) return;
    this.error = '';
    this.api.removeRate(row.idTarifa).subscribe({
      next: () => { this.msg = 'Tarifa eliminada.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al eliminar.'; },
    });
  }
}
