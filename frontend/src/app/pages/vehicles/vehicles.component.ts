import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { ENUMS } from '../../core/enums';
import type { Vehicle } from '../../core/models';
import { formatDateTime } from '../../core/utils/format';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { DataTableComponent, TableColumn } from '../../shared/ui/data-table.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

interface VehicleForm {
  plate: string;
  typeVehicle: string;
  brandVehicle: string;
  colorVehicle: string;
  propertyCard: string;
  entryDate: string;
  departureDate: string;
  ownerIdCard: number | '';
}

@Component({
  selector: 'app-vehicles',
  standalone: true,
  imports: [FormsModule, BadgeComponent, DataTableComponent, ModalComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Vehículos" description="Administra los vehículos registrados en el parqueadero.">
      <button type="button" class="btn-primary" (click)="openCreate()">Nuevo vehículo</button>
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
      [searchKeys]="['plate', 'brandVehicle']"
      placeholder="Buscar por placa o marca..."
      emptyMessage="No hay vehículos registrados."
      [loading]="loading"
    ></app-data-table>

    <ng-template #tmplPlaca let-row="row">
      <span class="font-medium text-white">{{ row.plate }}</span>
    </ng-template>

    <ng-template #tmplTipo let-row="row">
      <app-badge [value]="row.typeVehicle"></app-badge>
    </ng-template>

    <ng-template #tmplIngreso let-row="row">
      {{ formatDateTime(row.entryDate) }}
    </ng-template>

    <ng-template #tmplSalida let-row="row">
      {{ row.departureDate ? formatDateTime(row.departureDate) : '—' }}
    </ng-template>

    <ng-template #tmplPropietario let-row="row">
      @if (row.ownerIdCard) {
        <span class="font-medium text-white">#{{ row.ownerIdCard }}</span>
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
      [title]="modal?.mode === 'edit' ? 'Editar vehículo' : 'Nuevo vehículo'"
      [open]="!!modal"
      [showFooter]="true"
      (onClose)="modal = null"
    >
      <form (ngSubmit)="submit($event)" class="space-y-4">
        <div>
          <label class="label">Placa</label>
          <input class="input uppercase" [(ngModel)]="form.plate" name="plate" placeholder="ABC123" required />
        </div>
        <div>
          <label class="label">Tipo</label>
          <select class="select" [(ngModel)]="form.typeVehicle" name="typeVehicle">
            @for (t of ENUMS.VehicleType; track t) {
              <option [value]="t">{{ t }}</option>
            }
          </select>
        </div>
        <div>
          <label class="label">Marca</label>
          <input class="input" [(ngModel)]="form.brandVehicle" name="brandVehicle" placeholder="Marca" />
        </div>
        <div>
          <label class="label">Color</label>
          <input class="input" [(ngModel)]="form.colorVehicle" name="colorVehicle" placeholder="Color" />
        </div>
        <div>
          <label class="label">Tarjeta de propiedad</label>
          <input class="input" [(ngModel)]="form.propertyCard" name="propertyCard" placeholder="Tarjeta de propiedad" />
        </div>
        <div>
          <label class="label">ID del propietario</label>
          <input type="number" class="input" placeholder="Cédula del cliente" [(ngModel)]="form.ownerIdCard" name="ownerIdCard" />
        </div>
        <div>
          <label class="label">Ingreso</label>
          <input type="datetime-local" class="input" [(ngModel)]="form.entryDate" name="entryDate" />
        </div>
        <div>
          <label class="label">Salida</label>
          <input type="datetime-local" class="input" [(ngModel)]="form.departureDate" name="departureDate" />
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
export class VehiclesComponent implements AfterViewInit {
  formatDateTime = formatDateTime;
  readonly ENUMS = ENUMS;
  rows: Vehicle[] = [];
  loading = true;
  error = '';
  msg = '';
  saving = false;
  modal: { mode: 'create' | 'edit'; id?: string } | null = null;
  form: VehicleForm = { plate: '', typeVehicle: 'AUTO', brandVehicle: '', colorVehicle: '', propertyCard: '', entryDate: '', departureDate: '', ownerIdCard: '' };

  columns: TableColumn[] = [];

  @ViewChild('tmplPlaca') tmplPlaca!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplTipo') tmplTipo!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplIngreso') tmplIngreso!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplSalida') tmplSalida!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplPropietario') tmplPropietario!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplAcciones') tmplAcciones!: TemplateRef<{ $implicit: unknown; row: any }>;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'plate', label: 'Placa', bodyTemplate: this.tmplPlaca },
      { key: 'typeVehicle', label: 'Tipo', bodyTemplate: this.tmplTipo },
      { key: 'brandVehicle', label: 'Marca' },
      { key: 'colorVehicle', label: 'Color' },
      { key: 'ownerIdCard', label: 'Propietario', bodyTemplate: this.tmplPropietario },
      { key: 'entryDate', label: 'Ingreso', bodyTemplate: this.tmplIngreso },
      { key: 'departureDate', label: 'Salida', bodyTemplate: this.tmplSalida },
      { key: 'acciones', label: 'Acciones', bodyTemplate: this.tmplAcciones },
    ];
  }

  private load(): void {
    this.loading = true;
    this.error = '';
    this.api.getVehicles().subscribe({
      next: (data) => { this.rows = data || []; },
      error: (e) => { this.error = e?.message || 'Error de conexión.'; },
      complete: () => { this.loading = false; },
    });
  }

  openCreate(): void {
    this.form = { plate: '', typeVehicle: 'AUTO', brandVehicle: '', colorVehicle: '', propertyCard: '', entryDate: '', departureDate: '', ownerIdCard: '' };
    this.modal = { mode: 'create' };
  }

  openEdit(row: Vehicle): void {
    this.form = {
      plate: row.plate,
      typeVehicle: row.typeVehicle,
      brandVehicle: row.brandVehicle,
      colorVehicle: row.colorVehicle,
      propertyCard: row.propertyCard ?? '',
      entryDate: row.entryDate ?? '',
      departureDate: row.departureDate ?? '',
      ownerIdCard: row.ownerIdCard ?? '',
    };
    this.modal = { mode: 'edit', id: row.plate };
  }

  submit($event: Event): void {
    $event.preventDefault();
    this.saving = true;
    this.error = '';
    const payload: Vehicle = {
      plate: this.form.plate,
      typeVehicle: this.form.typeVehicle as Vehicle['typeVehicle'],
      brandVehicle: this.form.brandVehicle,
      colorVehicle: this.form.colorVehicle,
      propertyCard: this.form.propertyCard,
      entryDate: this.form.entryDate || null,
      departureDate: this.form.departureDate || null,
      ownerIdCard: this.form.ownerIdCard ? Number(this.form.ownerIdCard) : null,
    };
    const req = this.modal?.mode === 'edit' && this.modal.id != null
      ? this.api.updateVehicle(this.modal.id, payload)
      : this.api.createVehicle(payload);
    req.subscribe({
      next: () => {
        this.msg = this.modal?.mode === 'edit' ? 'Vehículo actualizado.' : 'Vehículo creado.';
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

  remove(row: Vehicle): void {
    if (!window.confirm(`¿Eliminar el vehículo ${row.plate}?`)) return;
    this.error = '';
    this.api.removeVehicle(row.plate).subscribe({
      next: () => { this.msg = 'Vehículo eliminado.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al eliminar.'; },
    });
  }
}
