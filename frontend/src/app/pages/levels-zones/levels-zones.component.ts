import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import type { Level, Zone } from '../../core/models';
import { DataTableComponent, TableColumn } from '../../shared/ui/data-table.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

interface LevelForm {
  numeroPiso: number;
  capacidadTotal: number;
  espaciosDisponibles: number;
}

interface ZoneForm {
  nombreZona: string;
  descripcion: string;
  idPiso: number;
}

@Component({
  selector: 'app-levels-zones',
  standalone: true,
  imports: [FormsModule, DataTableComponent, ModalComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Niveles y Zonas" description="Organiza la estructura del parqueadero en pisos y zonas.">
      <button type="button" class="btn-outline" (click)="openZone('create')">Nueva zona</button>
      <button type="button" class="btn-primary" (click)="openLevel('create')">Nuevo piso</button>
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

    <div class="space-y-6">
      <div>
        <h2 class="mb-3 text-lg font-semibold text-white">Pisos</h2>
        <app-data-table
          [columns]="levelColumns"
          [rows]="levelRows"
          [searchKeys]="['numeroPiso']"
          placeholder="Buscar por piso..."
          emptyMessage="No hay pisos registrados."
          [loading]="loading"
        ></app-data-table>
      </div>

      <div>
        <h2 class="mb-3 text-lg font-semibold text-white">Zonas</h2>
        <app-data-table
          [columns]="zoneColumns"
          [rows]="zoneRows"
          [searchKeys]="['nombreZona', 'descripcion']"
          placeholder="Buscar por zona o descripción..."
          emptyMessage="No hay zonas registradas."
          [loading]="loading"
        ></app-data-table>
      </div>
    </div>

    <ng-template #tmplPiso let-row="row">
      Piso {{ row.numeroPiso }}
    </ng-template>

    <ng-template #tmplDisponibles let-row="row">
      <span [class]="row.espaciosDisponibles > 0 ? 'badge-green' : 'badge-red'">{{ row.espaciosDisponibles }}</span>
    </ng-template>

    <ng-template #tmplLevelAcciones let-row="row">
      <div class="flex gap-2">
        <button type="button" class="btn-outline btn-sm" (click)="openLevel('edit', row)">Editar</button>
        <button type="button" class="btn-danger btn-sm" (click)="removeLevel(row)">Eliminar</button>
      </div>
    </ng-template>

    <ng-template #tmplZone let-row="row">
      <span class="font-medium text-white">{{ row.nombreZona }}</span>
    </ng-template>

    <ng-template #tmplZonePiso let-row="row">
      Piso {{ levelNumber(row.idPiso) }}
    </ng-template>

    <ng-template #tmplZoneAcciones let-row="row">
      <div class="flex gap-2">
        <button type="button" class="btn-outline btn-sm" (click)="openZone('edit', row)">Editar</button>
        <button type="button" class="btn-danger btn-sm" (click)="removeZone(row)">Eliminar</button>
      </div>
    </ng-template>

    <app-modal
      [title]="levelModal?.mode === 'edit' ? 'Editar piso' : 'Nuevo piso'"
      [open]="!!levelModal"
      [showFooter]="true"
      (onClose)="levelModal = null"
    >
      <form (ngSubmit)="submitLevel($event)" class="space-y-4">
        <div>
          <label class="label">N° Piso</label>
          <input type="number" class="input" [(ngModel)]="form.numeroPiso" name="numeroPiso" required />
        </div>
        <div>
          <label class="label">Capacidad total</label>
          <input type="number" class="input" [(ngModel)]="form.capacidadTotal" name="capacidadTotal" required />
        </div>
        <div>
          <label class="label">Espacios disponibles</label>
          <input type="number" class="input" [(ngModel)]="form.espaciosDisponibles" name="espaciosDisponibles" required />
        </div>
      </form>
      <div modal-footer>
        <button type="button" class="btn-ghost" (click)="levelModal = null">Cancelar</button>
        <button type="button" class="btn-primary" [disabled]="saving" (click)="submitLevel($event)">
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </app-modal>

    <app-modal
      [title]="zoneModal?.mode === 'edit' ? 'Editar zona' : 'Nueva zona'"
      [open]="!!zoneModal"
      [showFooter]="true"
      (onClose)="zoneModal = null"
    >
      <form (ngSubmit)="submitZone($event)" class="space-y-4">
        <div>
          <label class="label">Nombre de la zona</label>
          <input class="input" [(ngModel)]="zoneForm.nombreZona" name="nombreZona" required />
        </div>
        <div>
          <label class="label">Descripción</label>
          <textarea class="input" rows="3" [(ngModel)]="zoneForm.descripcion" name="descripcion"></textarea>
        </div>
        <div>
          <label class="label">Piso</label>
          <select class="select" [(ngModel)]="zoneForm.idPiso" name="idPiso" required>
            @for (l of levelRows; track l.idPiso) {
              <option [value]="l.idPiso">Piso {{ l.numeroPiso }}</option>
            }
          </select>
        </div>
      </form>
      <div modal-footer>
        <button type="button" class="btn-ghost" (click)="zoneModal = null">Cancelar</button>
        <button type="button" class="btn-primary" [disabled]="saving" (click)="submitZone($event)">
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </app-modal>
  `,
})
export class LevelsZonesComponent implements AfterViewInit {
  levelRows: Level[] = [];
  zoneRows: Zone[] = [];
  loading = true;
  error = '';
  msg = '';
  saving = false;
  levelModal: { mode: 'create' | 'edit'; id?: number } | null = null;
  zoneModal: { mode: 'create' | 'edit'; id?: number } | null = null;
  form: LevelForm = { numeroPiso: 0, capacidadTotal: 0, espaciosDisponibles: 0 };
  zoneForm: ZoneForm = { nombreZona: '', descripcion: '', idPiso: 0 };

  levelColumns: TableColumn[] = [];
  zoneColumns: TableColumn[] = [];

  @ViewChild('tmplPiso') tmplPiso!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplDisponibles') tmplDisponibles!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplLevelAcciones') tmplLevelAcciones!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplZone') tmplZone!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplZonePiso') tmplZonePiso!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplZoneAcciones') tmplZoneAcciones!: TemplateRef<{ $implicit: unknown; row: any }>;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.levelColumns = [
      { key: 'numeroPiso', label: 'Piso', bodyTemplate: this.tmplPiso },
      { key: 'capacidadTotal', label: 'Capacidad total' },
      { key: 'espaciosDisponibles', label: 'Disponibles', bodyTemplate: this.tmplDisponibles },
      { key: 'acciones', label: 'Acciones', bodyTemplate: this.tmplLevelAcciones },
    ];

    this.zoneColumns = [
      { key: 'nombreZona', label: 'Zona', bodyTemplate: this.tmplZone },
      { key: 'descripcion', label: 'Descripción' },
      { key: 'idPiso', label: 'Piso', bodyTemplate: this.tmplZonePiso },
      { key: 'acciones', label: 'Acciones', bodyTemplate: this.tmplZoneAcciones },
    ];
  }

  private load(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      levels: this.api.getLevels(),
      zones: this.api.getZones().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (data) => {
        this.levelRows = data.levels || [];
        this.zoneRows = data.zones || [];
      },
      error: (e) => { this.error = e?.message || 'Error de conexión.'; },
      complete: () => { this.loading = false; },
    });
  }

  levelNumber(idPiso: number): number | string {
    const level = this.levelRows.find((l) => l.idPiso === idPiso);
    return level ? level.numeroPiso : idPiso;
  }

  openLevel(mode: 'create' | 'edit', row?: Level): void {
    this.form = row
      ? { numeroPiso: row.numeroPiso, capacidadTotal: row.capacidadTotal, espaciosDisponibles: row.espaciosDisponibles }
      : { numeroPiso: 0, capacidadTotal: 0, espaciosDisponibles: 0 };
    this.levelModal = { mode, id: row?.idPiso };
  }

  submitLevel($event: Event): void {
    $event.preventDefault();
    this.saving = true;
    this.error = '';
    const payload: Level = {
      numeroPiso: Number(this.form.numeroPiso),
      capacidadTotal: Number(this.form.capacidadTotal),
      espaciosDisponibles: Number(this.form.espaciosDisponibles),
    };
    const req = this.levelModal?.mode === 'edit' && this.levelModal.id != null
      ? this.api.updateLevel(this.levelModal.id, payload)
      : this.api.createLevel(payload);
    req.subscribe({
      next: () => {
        this.msg = this.levelModal?.mode === 'edit' ? 'Piso actualizado.' : 'Piso creado.';
        this.levelModal = null;
        this.saving = false;
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al guardar.';
        this.saving = false;
      },
    });
  }

  removeLevel(row: Level): void {
    if (!window.confirm(`¿Eliminar el piso ${row.numeroPiso}?`)) return;
    this.error = '';
    this.api.removeLevel(row.idPiso!).subscribe({
      next: () => { this.msg = 'Piso eliminado.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al eliminar.'; },
    });
  }

  openZone(mode: 'create' | 'edit', row?: Zone): void {
    this.zoneForm = row
      ? { nombreZona: row.nombreZona, descripcion: row.descripcion, idPiso: row.idPiso }
      : { nombreZona: '', descripcion: '', idPiso: 0 };
    this.zoneModal = { mode, id: row?.idZona };
  }

  submitZone($event: Event): void {
    $event.preventDefault();
    this.saving = true;
    this.error = '';
    const payload: Zone = {
      nombreZona: this.zoneForm.nombreZona,
      descripcion: this.zoneForm.descripcion,
      idPiso: Number(this.zoneForm.idPiso),
    };
    const req = this.zoneModal?.mode === 'edit' && this.zoneModal.id != null
      ? this.api.updateZone(this.zoneModal.id, payload)
      : this.api.createZone(payload);
    req.subscribe({
      next: () => {
        this.msg = this.zoneModal?.mode === 'edit' ? 'Zona actualizada.' : 'Zona creada.';
        this.zoneModal = null;
        this.saving = false;
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al guardar.';
        this.saving = false;
      },
    });
  }

  removeZone(row: Zone): void {
    if (!window.confirm(`¿Eliminar la zona ${row.nombreZona}?`)) return;
    this.error = '';
    this.api.removeZone(row.idZona!).subscribe({
      next: () => { this.msg = 'Zona eliminada.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al eliminar.'; },
    });
  }
}
