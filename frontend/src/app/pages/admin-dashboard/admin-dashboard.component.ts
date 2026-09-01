import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { formatCurrency, formatDateTime } from '../../core/utils/format';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state.component';
import { PageHeaderComponent } from '../../shared/ui/page-header.component';
import { SpinnerComponent } from '../../shared/ui/spinner.component';
import { StatCardComponent } from '../../shared/ui/stat-card.component';
import { SpacesIconComponent, TicketsIconComponent, ReservationsIconComponent, RevenueIconComponent } from '../../shared/icons/icons';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, PageHeaderComponent, StatCardComponent, SpinnerComponent, EmptyStateComponent, BadgeComponent,
    SpacesIconComponent, TicketsIconComponent, ReservationsIconComponent, RevenueIconComponent],
  template: `
    @if (loading) {
      <div class="flex h-[70vh] items-center justify-center">
        <app-spinner size="lg"></app-spinner>
      </div>
    } @else {
      <div>
        <app-page-header title="Dashboard" description="Resumen general del estado del parqueadero en tiempo real."></app-page-header>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <app-stat-card title="Espacios disponibles" [value]="stats.availableSpaces + ' / ' + stats.totalSpaces" tone="primary">
            <app-icon-spaces></app-icon-spaces>
          </app-stat-card>
          <app-stat-card title="Tickets activos" [value]="stats.activeTickets" tone="blue">
            <app-icon-tickets></app-icon-tickets>
          </app-stat-card>
          <app-stat-card title="Reservas en curso" [value]="stats.activeReservations" tone="yellow">
            <app-icon-reservations></app-icon-reservations>
          </app-stat-card>
          <app-stat-card title="Ingresos (pagados)" [value]="formatCurrency(stats.revenue)" tone="green">
            <app-icon-revenue></app-icon-revenue>
          </app-stat-card>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div class="card">
            <div class="card-header flex items-center justify-between">
              <h3 class="font-semibold text-white">Últimos tickets</h3>
              <a routerLink="/admin/tickets" class="text-sm text-primary-400 hover:text-primary-300">Ver todos</a>
            </div>
            @if (latestTickets.length === 0) {
              <app-empty-state message="No hay tickets registrados."></app-empty-state>
            } @else {
              <div class="overflow-x-auto">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Placa</th>
                      <th>Ingreso</th>
                      <th>Monto</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (t of latestTickets; track t.idTicket) {
                      <tr>
                        <td class="font-medium text-white">{{ t.plate }}</td>
                        <td>{{ formatDateTime(t.entryDate) }}</td>
                        <td>{{ formatCurrency(t.totalAmount) }}</td>
                        <td><app-badge [value]="t.state"></app-badge></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>

          <div class="card">
            <div class="card-header flex items-center justify-between">
              <h3 class="font-semibold text-white">Últimas reservas</h3>
              <a routerLink="/admin/reservas" class="text-sm text-primary-400 hover:text-primary-300">Ver todas</a>
            </div>
            @if (latestReservations.length === 0) {
              <app-empty-state message="No hay reservas registradas."></app-empty-state>
            } @else {
              <div class="overflow-x-auto">
                <table class="table">
                  <thead>
                    <tr>
                      <th># Reserva</th>
                      <th>Espacio</th>
                      <th>Inicio</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (r of latestReservations; track r.idReserva) {
                      <tr>
                        <td class="font-medium text-white">#{{ r.idReserva }}</td>
                        <td>Espacio {{ r.idEspacio }}</td>
                        <td>{{ formatDateTime(r.fechaHoraInicio) }}</td>
                        <td><app-badge [value]="r.estado"></app-badge></td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <a routerLink="/admin/vehiculos" class="card flex items-center gap-4 p-5 transition-colors hover:border-primary-500/50">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <app-icon-spaces></app-icon-spaces>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ stats.totalVehicles }}</p>
              <p class="text-sm text-neutral-400">Vehículos registrados</p>
            </div>
          </a>
          <a routerLink="/admin/incidentes" class="card flex items-center gap-4 p-5 transition-colors hover:border-primary-500/50">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-danger-500/10 text-danger-500">
              <app-icon-spaces></app-icon-spaces>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ stats.pendingIncidents }}</p>
              <p class="text-sm text-neutral-400">Incidentes sin resolver</p>
            </div>
          </a>
          <a routerLink="/admin/pagos" class="card flex items-center gap-4 p-5 transition-colors hover:border-primary-500/50">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-success-500/10 text-success-500">
              <app-icon-revenue></app-icon-revenue>
            </div>
            <div>
              <p class="text-2xl font-bold text-white">{{ formatCurrency(stats.revenue) }}</p>
              <p class="text-sm text-neutral-400">Ingresos totales</p>
            </div>
          </a>
        </div>
      </div>
    }
  `,
})
export class AdminDashboardComponent {
  formatCurrency = formatCurrency;
  formatDateTime = formatDateTime;
  loading = true;
  stats = {
    availableSpaces: 0,
    totalSpaces: 0,
    activeTickets: 0,
    activeReservations: 0,
    revenue: 0,
    totalVehicles: 0,
    pendingIncidents: 0,
  };
  latestTickets: any[] = [];
  latestReservations: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    forkJoin({
      spaces: this.api.getSpaces().pipe(catchError(() => of([]))),
      tickets: this.api.getTickets().pipe(catchError(() => of([]))),
      reservations: this.api.getReservations().pipe(catchError(() => of([]))),
      payments: this.api.getPayments().pipe(catchError(() => of([]))),
      vehicles: this.api.getVehicles().pipe(catchError(() => of([]))),
      incidents: this.api.getIncidents().pipe(catchError(() => of([]))),
    }).subscribe({
      next: (data) => {
        const available = (data.spaces || []).filter((s: any) => s.estado === 'DISPONIBLE').length;
        this.stats = {
          availableSpaces: available,
          totalSpaces: (data.spaces || []).length,
          activeTickets: (data.tickets || []).filter((t: any) => t.state === 'ACTIVO').length,
          activeReservations: (data.reservations || []).filter((r: any) =>
            ['PENDIENTE', 'CONFIRMADA'].includes(r.estado)
          ).length,
          revenue: (data.payments || [])
            .filter((p: any) => p.estadoPago === 'PAGADO')
            .reduce((acc: number, p: any) => acc + Number(p.montoTotal || 0), 0),
          totalVehicles: (data.vehicles || []).length,
          pendingIncidents: (data.incidents || []).filter((i: any) =>
            ['REPORTADO', 'EN_PROCESO'].includes(i.estado)
          ).length,
        };
        this.latestTickets = (data.tickets || [])
          .slice()
          .sort((a: any, b: any) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
          .slice(0, 5);
        this.latestReservations = (data.reservations || [])
          .slice()
          .sort((a: any, b: any) => new Date(b.fechaHoraInicio).getTime() - new Date(a.fechaHoraInicio).getTime())
          .slice(0, 5);
      },
      error: () => {},
      complete: () => { this.loading = false; },
    });
  }
}
