import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { ENUMS } from '../../core/enums';
import type { Vehicle } from '../../core/models';
import { formatCurrency, formatDate, formatDateTime } from '../../core/utils/format';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { ModalComponent } from '../../shared/ui/modal.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [FormsModule, BadgeComponent, ModalComponent, SpinnerComponent],
  template: `
    @if (idCard === null) {
      <div class="card p-8 text-center">
        <p class="text-neutral-400">No se pudo identificar su cuenta. Vuelva a iniciar sesión.</p>
      </div>
    } @else {
      <div>
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-white">Hola, {{ auth.getFirstName() }} 👋</h1>
          <p class="mt-1 text-sm text-neutral-400">Administra tus vehículos, reservas y suscripciones desde aquí.</p>
        </div>

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

        <div class="mb-6 flex flex-wrap gap-2">
          @for (t of tabs; track t) {
            <button type="button" [class]="tabs.indexOf(t) === activeTab ? 'btn-primary' : 'btn-ghost'" (click)="activeTab = tabs.indexOf(t)">{{ t }}</button>
          }
        </div>

        @if (loading) {
          <div class="flex justify-center py-16"><app-spinner size="lg"></app-spinner></div>
        } @else {
          @switch (activeTab) {
            @case (0) {
              <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div class="lg:col-span-2">
                  <div class="card overflow-hidden">
                    <div class="card-header"><h3 class="font-semibold text-white">Mis vehículos</h3></div>
                    @if (myVehicles.length === 0) {
                      <div class="p-8 text-center text-neutral-500">Aún no tienes vehículos registrados.</div>
                    } @else {
                      <div class="overflow-x-auto">
                        <table class="table">
                          <thead><tr><th>Placa</th><th>Tipo</th><th>Marca</th><th>Color</th><th>Acciones</th></tr></thead>
                          <tbody>
                            @for (v of myVehicles; track v.plate) {
                              <tr>
                                <td class="font-medium text-white">{{ v.plate }}</td>
                                <td><app-badge [value]="v.typeVehicle"></app-badge></td>
                                <td>{{ v.brandVehicle || '—' }}</td>
                                <td>{{ v.colorVehicle || '—' }}</td>
                                <td>
                                  <button type="button" class="btn-danger btn-sm" (click)="removeVehicle(v)">Eliminar</button>
                                </td>
                              </tr>
                            }
                          </tbody>
                        </table>
                      </div>
                    }
                  </div>
                </div>

                <div class="card p-6">
                  <h3 class="mb-4 font-semibold text-white">Registrar vehículo</h3>
                  <form (ngSubmit)="registerVehicle()" class="space-y-3">
                    <input name="plate" class="input uppercase" placeholder="Placa" required [(ngModel)]="vehicleForm.plate" />
                    <select name="typeVehicle" class="select" [(ngModel)]="vehicleForm.typeVehicle">
                      @for (t of ENUMS.VehicleType; track t) {
                        <option [value]="t">{{ t }}</option>
                      }
                    </select>
                    <input name="brandVehicle" class="input" placeholder="Marca" [(ngModel)]="vehicleForm.brandVehicle" />
                    <input name="colorVehicle" class="input" placeholder="Color" [(ngModel)]="vehicleForm.colorVehicle" />
                    <input name="propertyCard" class="input" placeholder="Tarjeta de propiedad" [(ngModel)]="vehicleForm.propertyCard" />
                    <button class="btn-primary w-full">Registrar</button>
                  </form>
                </div>
              </div>
            }
            @case (1) {
              <div class="space-y-6">
                <div class="flex items-center justify-between">
                  <div class="grid grid-cols-2 gap-4 sm:flex">
                    <div class="card px-4 py-2 text-sm"><span class="text-neutral-400">Ocupado: </span><span class="text-danger-500">{{ occupiedCount }}</span></div>
                    <div class="card px-4 py-2 text-sm"><span class="text-neutral-400">Total: </span><span class="text-white">{{ myReservations.length }}</span></div>
                  </div>
                  <button type="button" class="btn-primary" (click)="reserveModal = true">Nueva reserva</button>
                </div>

                <div class="card overflow-hidden">
                  @if (myReservations.length === 0) {
                    <div class="p-8 text-center text-neutral-500">No tienes reservas.</div>
                  } @else {
                    <div class="overflow-x-auto">
                      <table class="table">
                        <thead><tr><th>#</th><th>Espacio</th><th>Inicio</th><th>Fin</th><th>Monto</th><th>Estado</th><th>Acciones</th></tr></thead>
                        <tbody>
                          @for (r of myReservations; track r.idReserva) {
                            <tr>
                              <td class="font-medium text-white">#{{ r.idReserva }}</td>
                              <td>#{{ r.idEspacio }}</td>
                              <td>{{ formatDateTime(r.fechaHoraInicio) }}</td>
                              <td>{{ formatDateTime(r.fechaHoraFin) }}</td>
                              <td>{{ formatCurrency(r.montoReserva) }}</td>
                              <td><app-badge [value]="r.estado"></app-badge></td>
                              <td>
                                @if (['PENDIENTE', 'CONFIRMADA'].includes(r.estado)) {
                                  <button type="button" class="btn-danger btn-sm" (click)="cancelReservation(r)">Cancelar</button>
                                }
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  }
                </div>
              </div>
            }
            @case (2) {
              <div class="space-y-6">
                <div class="card overflow-hidden">
                  <div class="card-header"><h3 class="font-semibold text-white">Mis suscripciones</h3></div>
                  @if (mySubscriptions.length === 0) {
                    <div class="p-8 text-center text-neutral-500">No tienes suscripciones activas.</div>
                  } @else {
                    <div class="overflow-x-auto">
                      <table class="table">
                        <thead><tr><th>#</th><th>Placa</th><th>Tipo</th><th>Inicio</th><th>Fin</th><th>Monto</th><th>Estado</th><th>Acciones</th></tr></thead>
                        <tbody>
                          @for (s of mySubscriptions; track s.idAbono) {
                            <tr>
                              <td class="font-medium text-white">#{{ s.idAbono }}</td>
                              <td>{{ s.plate }}</td>
                              <td><app-badge [value]="s.tipoAbono"></app-badge></td>
                              <td>{{ formatDate(s.fechaInicio) }}</td>
                              <td>{{ formatDate(s.fechaFin) }}</td>
                              <td>{{ formatCurrency(s.monto) }}</td>
                              <td><app-badge [value]="s.estado"></app-badge></td>
                              <td>
                                @if (s.estado === 'ACTIVO') {
                                  <button type="button" class="btn-danger btn-sm" (click)="cancelSubscription(s)">Cancelar</button>
                                }
                              </td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  }
                </div>

                <div class="card p-6">
                  <h3 class="mb-4 font-semibold text-white">Contratar suscripción</h3>
                  <form (ngSubmit)="registerSubscription()" class="space-y-3">
                    <select name="subPlate" class="select" [(ngModel)]="subForm.plate" (ngModelChange)="subForm.monto = subscriptionAmount()" required>
                      <option value="">Seleccionar vehículo</option>
                      @for (v of myVehicles; track v.plate) {
                        <option [value]="v.plate">{{ v.plate }} · {{ v.typeVehicle }}</option>
                      }
                    </select>
                    <select name="subTipo" class="select" [(ngModel)]="subForm.tipoAbono" (ngModelChange)="subForm.monto = subscriptionAmount()">
                      @for (t of ENUMS.SubscriptionType; track t) {
                        <option [value]="t">{{ t }}</option>
                      }
                    </select>
                    <div>
                      <p class="text-sm text-neutral-400">Valor a pagar</p>
                      <p class="text-xl font-bold text-primary-500">{{ formatCurrency(subForm.monto) }}</p>
                    </div>
                    <button class="btn-primary w-full" [disabled]="saving || myVehicles.length === 0">Contratar</button>
                  </form>
                </div>
              </div>
            }
          }
        }

        <app-modal title="Reservar espacio" [open]="reserveModal" (onClose)="reserveModal = false" [showFooter]="true">
          <form (ngSubmit)="submitReservation()" class="space-y-4">
            <div>
              <label class="label">Espacio disponible</label>
              <select class="select" [(ngModel)]="reserveForm.idEspacio" name="idEspacio" required>
                <option value="">Seleccionar</option>
                @for (s of spaceOptions; track s.idEspacio) {
                  <option [value]="s.idEspacio">#{{ s.numeroEspacio }}</option>
                }
              </select>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Inicio</label>
                <input type="datetime-local" class="input" [(ngModel)]="reserveForm.fechaHoraInicio" name="fechaHoraInicio" required />
              </div>
              <div>
                <label class="label">Fin</label>
                <input type="datetime-local" class="input" [(ngModel)]="reserveForm.fechaHoraFin" name="fechaHoraFin" required />
              </div>
            </div>
            <div>
              <label class="label">Tipo de vehículo (para tarifa)</label>
              <select class="select" [(ngModel)]="reserveForm.type" name="type">
                @if (rateOptions.length > 0) {
                  @for (r of rateOptions; track r.idTarifa) {
                    <option [value]="r.tipoVehiculo">{{ r.tipoVehiculo }} · {{ formatCurrency(r.precioHora) }}/hora</option>
                  }
                } @else {
                  <option>Sin tarifas</option>
                }
              </select>
            </div>
          </form>
          <div modal-footer>
            <button type="button" class="btn-ghost" (click)="reserveModal = false">Cancelar</button>
            <button type="button" class="btn-primary" [disabled]="saving" (click)="submitReservation()">
              {{ saving ? 'Reservando...' : 'Confirmar reserva' }}
            </button>
          </div>
        </app-modal>
      </div>
    }
  `,
})
export class ClientDashboardComponent {
  formatCurrency = formatCurrency;
  formatDate = formatDate;
  formatDateTime = formatDateTime;
  readonly tabs = ['Mis Vehículos', 'Mis Reservas', 'Mis Suscripciones'];
  readonly ENUMS = ENUMS;
  idCard: number | null;

  activeTab = 0;
  loading = true;
  error = '';
  msg = '';

  myVehicles: any[] = [];
  myReservations: any[] = [];
  mySubscriptions: any[] = [];
  spaceOptions: any[] = [];
  rateOptions: any[] = [];

  reserveModal = false;
  reserveForm = { idEspacio: '', fechaHoraInicio: '', fechaHoraFin: '', type: '' };
  saving = false;

  constructor(private api: ApiService, public auth: AuthService) {
    this.idCard = auth.getUserIdCard();
  }

  ngOnInit(): void {
    if (this.idCard != null) this.load();
  }

  get occupiedCount(): number {
    return this.myReservations.filter((r: any) => ['PENDIENTE', 'CONFIRMADA'].includes(r.estado)).length;
  }

  load(): void {
    if (this.idCard == null) return;
    this.loading = true;
    this.error = '';
    forkJoin({
      vehicles: this.api.getVehiclesByOwner(this.idCard!).pipe(catchError(() => of([]))),
      reservations: this.api.getReservationsByUser(this.idCard!).pipe(catchError(() => of([]))),
      subscriptions: this.api.getSubscriptionsByUser(this.idCard!).pipe(catchError(() => of([]))),
      spaces: this.api.getSpaces().pipe(catchError(() => of([]))),
      rates: this.api.getRates().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (data) => {
        this.myVehicles = data.vehicles || [];
        this.myReservations = data.reservations || [];
        this.mySubscriptions = data.subscriptions || [];
        this.spaceOptions = (data.spaces || []).filter((x: any) => x.estado === 'DISPONIBLE');
        this.rateOptions = data.rates || [];
      },
      error: (e) => { this.error = e?.message || 'Error de conexión.'; },
      complete: () => { this.loading = false; },
    });
  }

  registerVehicle(): void {
    if (this.idCard == null) return;
    this.error = '';
    const payload: Vehicle = {
      plate: this.vehicleForm.plate,
      typeVehicle: this.vehicleForm.typeVehicle as Vehicle['typeVehicle'],
      brandVehicle: this.vehicleForm.brandVehicle,
      colorVehicle: this.vehicleForm.colorVehicle,
      propertyCard: this.vehicleForm.propertyCard || undefined,
      entryDate: null,
      departureDate: null,
      ownerIdCard: this.idCard,
    };
    this.api.createVehicle(payload).subscribe({
      next: () => {
        this.msg = 'Vehículo registrado.';
        this.vehicleForm = { plate: '', typeVehicle: 'AUTO', brandVehicle: '', colorVehicle: '', propertyCard: '' };
        this.load();
      },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al registrar.';
        this.vehicleForm = { plate: '', typeVehicle: 'AUTO', brandVehicle: '', colorVehicle: '', propertyCard: '' }; },
    });
  }

  submitReservation(): void {
    if (this.idCard == null) return;
    this.saving = true;
    this.error = '';
    this.api.createReservation({
      idCard: this.idCard,
      idEspacio: Number(this.reserveForm.idEspacio),
      fechaHoraInicio: new Date(this.reserveForm.fechaHoraInicio).toISOString(),
      fechaHoraFin: new Date(this.reserveForm.fechaHoraFin).toISOString(),
      montoReserva: Number(this.reserveForm.type ? this.rateFor(this.reserveForm.type) : 0),
    }).subscribe({
      next: () => {
        this.msg = 'Reserva creada.';
        this.reserveModal = false;
        this.reserveForm = { idEspacio: '', fechaHoraInicio: '', fechaHoraFin: '', type: '' };
        this.saving = false;
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al crear la reserva.';
        this.saving = false;
      },
    });
  }

  cancelReservation(r: any): void {
    if (!window.confirm(`¿Cancelar la reserva #${r.idReserva}?`)) return;
    this.error = '';
    this.api.changeReservationState(r.idReserva, 'CANCELADA').subscribe({
      next: () => this.load(),
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al cancelar.'; },
    });
  }

  vehicleForm: { plate: string; typeVehicle: string; brandVehicle: string; colorVehicle: string; propertyCard: string } = {
    plate: '', typeVehicle: 'AUTO', brandVehicle: '', colorVehicle: '', propertyCard: '',
  };

  subForm: { plate: string; tipoAbono: string; monto: number } = {
    plate: '', tipoAbono: 'MENSUAL', monto: 0,
  };

  removeVehicle(v: any): void {
    if (!window.confirm(`¿Desea eliminar su vehículo ${v.plate}?`)) return;
    this.error = '';
    this.api.removeVehicle(v.plate).subscribe({
      next: () => { this.msg = 'Vehículo eliminado.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al eliminar el vehículo.'; },
    });
  }

  private selectedVehicleType(): string | null {
    const v = this.myVehicles.find((x: any) => x.plate === this.subForm.plate);
    return v ? v.typeVehicle : null;
  }

  subscriptionAmount(): number {
    const type = this.selectedVehicleType();
    if (!type) return 0;
    const rate = this.rateOptions.find((r: any) => r.tipoVehiculo === type);
    if (!rate) return 0;
    const m = Number(rate.precioMes || 0);
    switch (this.subForm.tipoAbono) {
      case 'ANUAL': return Number(rate.precioAnio || m * 12);
      case 'TRIMESTRAL': return m * 3;
      default: return m;
    }
  }

  registerSubscription(): void {
    if (this.idCard == null || !this.subForm.plate) return;
    this.error = '';
    this.msg = '';
    const monto = this.subscriptionAmount();
    this.api.createSubscription({
      idCard: this.idCard,
      plate: this.subForm.plate,
      tipoAbono: this.subForm.tipoAbono,
      monto,
    }).subscribe({
      next: () => {
        this.msg = 'Suscripción contratada.';
        this.subForm = { plate: '', tipoAbono: 'MENSUAL', monto: 0 };
        this.load();
      },
      error: (err) => { this.error = err?.error?.message || err?.message || 'Error al contratar la suscripción.'; },
    });
  }

  cancelSubscription(s: any): void {
    if (!window.confirm(`¿Cancelar la suscripción #${s.idAbono}?`)) return;
    this.error = '';
    this.api.changeSubscriptionState(s.idAbono, 'CANCELADO').subscribe({
      next: () => { this.msg = 'Suscripción cancelada.'; this.load(); },
      error: (err) => { this.error = err?.error?.message || err?.message || 'No se pudo cancelar la suscripción.'; },
    });
  }

  private rateFor(type: string): number {
    const rate = this.rateOptions.find((r: any) => r.tipoVehiculo === type);
    return rate ? rate.precioHora : 0;
  }
}
