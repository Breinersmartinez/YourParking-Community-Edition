import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ENUMS } from '../../core/enums';
import type { Level, Space, Zone } from '../../core/models';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { DataTableComponent, TableColumn } from '../../shared/ui/data-table.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

interface SpaceForm {
  numeroEspacio: number;
  estado: string;
  tipoEspacio: string;
  dimensiones: string;
  idPiso: number;
  idZona: number | '';
}

@Component({
  selector: 'app-spaces',
  standalone: true,
  imports: [FormsModule, BadgeComponent, DataTableComponent, ModalComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Gestión de Espacios" description="Administra los espacios del parqueadero.">
      <button type="button" class="btn-primary" (click)="openCreate()">Nuevo espacio</button>
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
      <app-data-table
        [columns]="columns"
        [rows]="rows"
        [searchKeys]="['numeroEspacio', 'dimensiones']"
        placeholder="Buscar por número o dimensiones..."
        emptyMessage="No hay espacios registrados."
        [loading]="loading"
      ></app-data-table>

      <div class="card">
        <div class="card-header"><h3 class="font-semibold text-white">Cambio rápido de estado</h3></div>
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Espacio</th>
                @for (s of ENUMS.SpaceState; track s) {
                  <th>{{ s }}</th>
                }
              </tr>
            </thead>
            <tbody>
              @for (row of rows.slice(0, 15); track row.idEspacio) {
                <tr>
                  <td class="font-medium text-white">#{{ row.numeroEspacio }}</td>
                  @for (s of ENUMS.SpaceState; track s) {
                    <td>
                      <button
                        type="button"
                        [class]="row.estado === s ? 'btn-sm btn-primary' : 'btn-sm btn-ghost'"
                        (click)="row.estado !== s && changeState(row, s)"
                      >{{ s }}</button>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ng-template #tmplNum let-row="row">
      <span class="font-medium text-white">#{{ row.numeroEspacio }}</span>
    </ng-template>

    <ng-template #tmplEstado let-row="row">
      <app-badge [value]="row.estado"></app-badge>
    </ng-template>

    <ng-template #tmplTipo let-row="row">
      <app-badge [value]="row.tipoEspacio"></app-badge>
    </ng-template>

    <ng-template #tmplPiso let-row="row">
      Piso {{ levelNumber(row.idPiso) }}
    </ng-template>

    <ng-template #tmplZona let-row="row">
      {{ zoneName(row.idZona) }}
    </ng-template>

    <ng-template #tmplAcciones let-row="row">
      <div class="flex gap-2">
        <button type="button" class="btn-outline btn-sm" (click)="openEdit(row)">Editar</button>
        <button type="button" class="btn-danger btn-sm" (click)="remove(row)">Eliminar</button>
      </div>
    </ng-template>

    <app-modal
      [title]="modal?.mode === 'edit' ? 'Editar espacio' : 'Nuevo espacio'"
      [open]="!!modal"
      [showFooter]="true"
      (onClose)="modal = null"
    >
      <form (ngSubmit)="submit($event)" class="space-y-4">
        <div>
          <label class="label">N° Espacio</label>
          <input type="number" class="input" [(ngModel)]="form.numeroEspacio" name="numeroEspacio" required />
        </div>
        <div>
          <label class="label">Tipo de espacio</label>
          <select class="select" [(ngModel)]="form.tipoEspacio" name="tipoEspacio">
            @for (t of ENUMS.SpaceType; track t) {
              <option [value]="t">{{ t }}</option>
            }
          </select>
        </div>
        <div>
          <label class="label">Estado</label>
          <select class="select" [(ngModel)]="form.estado" name="estado">
            @for (s of ENUMS.SpaceState; track s) {
              <option [value]="s">{{ s }}</option>
            }
          </select>
        </div>
        <div>
          <label class="label">Dimensiones</label>
          <input class="input" placeholder="Ej: 2.5m x 5m" [(ngModel)]="form.dimensiones" name="dimensiones" />
        </div>
        <div>
          <label class="label">Piso</label>
          <select class="select" [(ngModel)]="form.idPiso" name="idPiso" required>
            @for (l of levelsList; track l.idPiso) {
              <option [value]="l.idPiso">Piso {{ l.numeroPiso }}</option>
            }
          </select>
        </div>
        <div>
          <label class="label">Zona</label>
          <select class="select" [(ngModel)]="form.idZona" name="idZona">
            <option value="">Sin zona</option>
            @for (z of zonesList; track z.idZona) {
              <option [value]="z.idZona">{{ z.nombreZona }}</option>
            }
          </select>
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
export class SpacesComponent implements AfterViewInit {
  readonly ENUMS = ENUMS;
  rows: Space[] = [];
  levelsList: Level[] = [];
  zonesList: Zone[] = [];
  loading = true;
  error = '';
  msg = '';
  saving = false;
  modal: { mode: 'create' | 'edit'; id?: number } | null = null;
  form: SpaceForm = { numeroEspacio: 0, estado: 'DISPONIBLE', tipoEspacio: 'ESTANDAR', dimensiones: '', idPiso: 0, idZona: '' };

  columns: TableColumn[] = [];

  @ViewChild('tmplNum') tmplNum!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplEstado') tmplEstado!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplTipo') tmplTipo!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplPiso') tmplPiso!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplZona') tmplZona!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplAcciones') tmplAcciones!: TemplateRef<{ $implicit: unknown; row: any }>;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'numeroEspacio', label: 'N° Espacio', bodyTemplate: this.tmplNum },
      { key: 'estado', label: 'Estado', bodyTemplate: this.tmplEstado },
      { key: 'tipoEspacio', label: 'Tipo', bodyTemplate: this.tmplTipo },
      { key: 'dimensiones', label: 'Dimensiones' },
      { key: 'idPiso', label: 'Piso', bodyTemplate: this.tmplPiso },
      { key: 'idZona', label: 'Zona', bodyTemplate: this.tmplZona },
      { key: 'acciones', label: 'Acciones', bodyTemplate: this.tmplAcciones },
    ];
  }

  private load(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      spaces: this.api.getSpaces(),
      levels: this.api.getLevels().pipe(catchError(() => of([]))),
      zones: this.api.getZones().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (data) => {
        this.rows = data.spaces || [];
        this.levelsList = data.levels || [];
        this.zonesList = data.zones || [];
      },
      error: (e) => { this.error = e?.message || 'Error de conexión.'; },
      complete: () => { this.loading = false; },
    });
  }

  levelNumber(idPiso: number): number | string {
    const level = this.levelsList.find((l) => l.idPiso === idPiso);
    return level ? level.numeroPiso : idPiso;
  }

  zoneName(idZona: number | null | undefined): string {
    if (idZona == null) return '—';
    const zone = this.zonesList.find((z) => z.idZona === idZona);
    return zone ? zone.nombreZona : String(idZona);
  }

  openCreate(): void {
    this.form = { numeroEspacio: 0, estado: 'DISPONIBLE', tipoEspacio: 'ESTANDAR', dimensiones: '', idPiso: 0, idZona: '' };
    this.modal = { mode: 'create' };
  }

  openEdit(row: Space): void {
    this.form = {
      numeroEspacio: row.numeroEspacio,
      estado: row.estado,
      tipoEspacio: row.tipoEspacio,
      dimensiones: row.dimensiones,
      idPiso: row.idPiso,
      idZona: row.idZona ?? '',
    };
    this.modal = { mode: 'edit', id: row.idEspacio };
  }

  submit($event: Event): void {
    $event.preventDefault();
    this.saving = true;
    this.error = '';
    const payload: Space = {
      numeroEspacio: Number(this.form.numeroEspacio),
      estado: this.form.estado as Space['estado'],
      tipoEspacio: this.form.tipoEspacio as Space['tipoEspacio'],
      dimensiones: this.form.dimensiones,
      idPiso: Number(this.form.idPiso),
      idZona: this.form.idZona !== '' ? Number(this.form.idZona) : null,
    };
    const req = this.modal?.mode === 'edit' && this.modal.id != null
      ? this.api.updateSpace(this.modal.id, payload)
      : this.api.createSpace(payload);
    req.subscribe({
      next: () => {
        this.msg = this.modal?.mode === 'edit' ? 'Espacio actualizado.' : 'Espacio creado.';
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

  changeState(row: Space, estado: string): void {
    if (!window.confirm(`¿Cambiar el estado del espacio #${row.numeroEspacio} a ${estado}?`)) return;
    this.error = '';
    this.api.changeSpaceState(row.idEspacio!, estado).subscribe({
      next: () => { this.msg = 'Estado actualizado.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al cambiar estado.'; },
    });
  }

  remove(row: Space): void {
    if (!window.confirm(`¿Eliminar el espacio #${row.numeroEspacio}?`)) return;
    this.error = '';
    this.api.removeSpace(row.idEspacio!).subscribe({
      next: () => { this.msg = 'Espacio eliminado.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al eliminar.'; },
    });
  }
}
