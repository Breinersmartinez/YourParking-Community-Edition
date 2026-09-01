import { AfterViewInit, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ENUMS } from '../../core/enums';
import { User } from '../../core/models';
import { formatDate as formatDateUtil } from '../../core/utils/format';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { DataTableComponent, TableColumn } from '../../shared/ui/data-table.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [FormsModule, BadgeComponent, DataTableComponent, ModalComponent, PageHeaderComponent],
  template: `
    <app-page-header title="Gestión de Usuarios" description="Administra los usuarios y sus roles en el sistema.">
      <button type="button" class="btn-primary" (click)="openCreate()">Nuevo usuario</button>
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
      [searchKeys]="['idCard', 'firstName', 'lastName', 'email', 'role']"
      placeholder="Buscar usuario..."
      emptyMessage="No hay usuarios registrados."
      [loading]="loading"
    ></app-data-table>

    <ng-template #tmplId let-row="row">
      <span class="font-medium text-white">#{{ row.idCard }}</span>
    </ng-template>

    <ng-template #tmplNombre let-row="row">
      {{ row.firstName }} {{ row.lastName }}
    </ng-template>

    <ng-template #tmplRol let-row="row">
      <app-badge [value]="row.role"></app-badge>
    </ng-template>

    <ng-template #tmplEstado let-row="row">
      @if (row.active) {
        <app-badge [value]="true"></app-badge>
      } @else {
        <app-badge [value]="false"></app-badge>
      }
    </ng-template>

    <ng-template #tmplRegistro let-row="row">
      {{ formatDate(row.registrationDate) }}
    </ng-template>

    <ng-template #tmplAcciones let-row="row">
      <div class="flex gap-1">
        <button type="button" class="btn-outline btn-sm" (click)="openEdit(row)">Editar</button>
        @if (row.active) {
          <button type="button" class="btn-danger btn-sm" (click)="toggleActive(row)">Deshabilitar</button>
        } @else {
          <button type="button" class="btn-success btn-sm" (click)="toggleActive(row)">Habilitar</button>
        }
        <button type="button" class="btn-danger btn-sm" (click)="remove(row)">Eliminar</button>
      </div>
    </ng-template>

    <app-modal
      [title]="modal?.mode === 'edit' ? 'Editar usuario' : 'Nuevo usuario'"
      [open]="!!modal"
      [showFooter]="true"
      (onClose)="modal = null"
    >
      <form (ngSubmit)="submit($event)" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Tipo de ID</label>
            <select class="select" [(ngModel)]="form.identificationType" name="identificationType">
              @for (t of identificationTypes; track t) {
                <option [value]="t">{{ t }}</option>
              }
            </select>
          </div>
          <div>
            <label class="label">N° Identificación</label>
            <input type="number" class="input" [(ngModel)]="form.idCard" name="idCard" required [disabled]="modal?.mode === 'edit'" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Nombre</label>
            <input class="input" [(ngModel)]="form.firstName" name="firstName" required />
          </div>
          <div>
            <label class="label">Apellido</label>
            <input class="input" [(ngModel)]="form.lastName" name="lastName" required />
          </div>
        </div>
        <div>
          <label class="label">Correo</label>
          <input type="email" class="input" [(ngModel)]="form.email" name="email" required />
        </div>
        <div>
          <label class="label">{{ modal?.mode === 'edit' ? 'Nueva contraseña (opcional)' : 'Contraseña' }}</label>
          <input type="password" class="input" [(ngModel)]="form.password" name="password" [placeholder]="modal?.mode === 'edit' ? 'Déjalo vacío para no cambiar' : ''" [required]="modal?.mode !== 'edit'" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Teléfono</label>
            <input class="input" [(ngModel)]="form.phoneNumber" name="phoneNumber" />
          </div>
          <div>
            <label class="label">Dirección</label>
            <input class="input" [(ngModel)]="form.direction" name="direction" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Rol</label>
            <select class="select" [(ngModel)]="form.role" name="role">
              @for (r of roles; track r) {
                <option [value]="r">{{ r }}</option>
              }
            </select>
          </div>
          <div>
            <label class="label">Estado</label>
            <select class="select" [(ngModel)]="form.active" name="active">
              <option [ngValue]="true">Activo</option>
              <option [ngValue]="false">Inactivo</option>
            </select>
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
export class UsersComponent implements AfterViewInit {
  rows: User[] = [];
  loading = true;
  error = '';
  msg = '';
  saving = false;
  modal: { mode: 'create' | 'edit'; id?: number } | null = null;

  identificationTypes = ENUMS.IdentificationType;
  roles = ENUMS.Role;

  form = {
    idCard: '' as number | '',
    identificationType: 'CC',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    direction: '',
    role: 'USER',
    active: true,
  };

  columns: TableColumn[] = [];

  @ViewChild('tmplId') tmplId!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplNombre') tmplNombre!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplRol') tmplRol!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplEstado') tmplEstado!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplRegistro') tmplRegistro!: TemplateRef<{ $implicit: unknown; row: any }>;
  @ViewChild('tmplAcciones') tmplAcciones!: TemplateRef<{ $implicit: unknown; row: any }>;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  ngAfterViewInit(): void {
    this.columns = [
      { key: 'idCard', label: 'ID', bodyTemplate: this.tmplId },
      { key: 'firstName', label: 'Nombre', bodyTemplate: this.tmplNombre },
      { key: 'email', label: 'Correo' },
      { key: 'idCard', label: 'Cédula' },
      { key: 'phoneNumber', label: 'Teléfono' },
      { key: 'role', label: 'Rol', bodyTemplate: this.tmplRol },
      { key: 'active', label: 'Estado', bodyTemplate: this.tmplEstado },
      { key: 'registrationDate', label: 'Registro', bodyTemplate: this.tmplRegistro },
      { key: 'acciones', label: 'Acciones', bodyTemplate: this.tmplAcciones },
    ];
  }

  private load(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      me: this.api.getUserMe(),
      users: this.api.getUsers(),
    }).subscribe({
      next: ({ users }) => {
        this.rows = (users || []).map((u) => ({
          idCard: u.idCard,
          identificationType: u.identificationType,
          firstName: u.firstName,
          lastName: u.lastName,
          email: u.email,
          phoneNumber: u.phoneNumber,
          direction: u.direction,
          role: u.role,
          active: u.active,
          registrationDate: u.registrationDate,
        }));
      },
      error: (e) => {
        this.error = e?.error?.message || e?.message || 'Error de conexión.';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  openCreate(): void {
    this.form = {
      idCard: '',
      identificationType: 'CC',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      direction: '',
      role: 'USER',
      active: true,
    };
    this.modal = { mode: 'create' };
  }

  openEdit(row: User): void {
    this.form = {
      idCard: row.idCard,
      identificationType: row.identificationType,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      password: '',
      phoneNumber: row.phoneNumber,
      direction: row.direction,
      role: row.role,
      active: row.active,
    };
    this.modal = { mode: 'edit', id: row.idCard };
  }

  submit($event: Event): void {
    $event.preventDefault();
    if (!this.modal) return;
    this.saving = true;
    this.error = '';
    this.msg = '';

    const idCard = Number(this.form.idCard);
    const base: Record<string, unknown> = {
      idCard,
      identificationType: this.form.identificationType,
      firstName: this.form.firstName,
      lastName: this.form.lastName,
      email: this.form.email,
      phoneNumber: this.form.phoneNumber,
      direction: this.form.direction,
      role: this.form.role,
      active: this.form.active,
    };

    if (this.form.password) {
      base['password'] = this.form.password;
    }

    const targetId = this.modal.mode === 'edit' && this.modal.id != null ? this.modal.id : idCard;

    this.api.updateUser(targetId, base as Partial<User>).subscribe({
      next: () => {
        this.msg = this.modal!.mode === 'edit' ? 'Usuario actualizado correctamente.' : 'Usuario creado correctamente.';
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

  toggleActive(row: User): void {
    const action = row.active ? 'deshabilitar' : 'habilitar';
    if (!window.confirm(`¿Desea ${action} al usuario ${row.firstName} ${row.lastName}?`)) return;
    this.error = '';
    const obs = row.active ? this.api.deactivateUser(row.idCard) : this.api.activateUser(row.idCard);
    obs.subscribe({
      next: () => {
        this.msg = `Usuario ${row.active ? 'deshabilitado' : 'habilitado'}.`;
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al actualizar.';
      },
    });
  }

  remove(row: User): void {
    if (!window.confirm(`¿Eliminar al usuario ${row.firstName} ${row.lastName}?`)) return;
    this.error = '';
    this.api.removeUser(row.idCard).subscribe({
      next: () => {
        this.msg = 'Usuario eliminado.';
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al eliminar.';
      },
    });
  }

  formatDate(value: string | number | Date | null | undefined): string {
    return formatDateUtil(value);
  }
}
