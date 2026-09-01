import { NgTemplateOutlet } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import {
  MenuIconComponent, DashboardIconComponent, SpacesIconComponent,
  LevelsIconComponent, TicketsIconComponent, ReservationsIconComponent, IncidentsIconComponent,
  VehiclesIconComponent, UsersIconComponent, RatesIconComponent, PaymentsIconComponent, LogoutIconComponent,
} from '../shared/icons/icons';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgTemplateOutlet,
    MenuIconComponent, DashboardIconComponent, SpacesIconComponent,
    LevelsIconComponent, TicketsIconComponent, ReservationsIconComponent, IncidentsIconComponent,
    VehiclesIconComponent, UsersIconComponent, RatesIconComponent, PaymentsIconComponent, LogoutIconComponent],
  template: `
    <div class="min-h-screen bg-ink-950">
      <!-- Sidebar desktop -->
      <aside class="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-neutral-800 bg-ink-900 lg:flex">
        <ng-container *ngTemplateOutlet="sidebarContent"></ng-container>
      </aside>

      <!-- Sidebar móvil -->
      @if (open) {
        <div class="fixed inset-0 z-50 lg:hidden">
          <div class="absolute inset-0 bg-black/60" (click)="open = false"></div>
          <aside class="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-neutral-800 bg-ink-900">
            <ng-container *ngTemplateOutlet="sidebarContent"></ng-container>
          </aside>
        </div>
      }

      <!-- Main -->
      <div class="lg:pl-64">
        <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-800 bg-ink-900/80 px-4 backdrop-blur sm:px-6">
          <div class="flex items-center gap-3">
            <button class="btn-ghost btn-sm lg:hidden" (click)="open = true"><app-icon-menu></app-icon-menu></button>
            <div class="flex items-center gap-2">
              <span class="h-3 w-3 rounded-full bg-primary-500"></span>
              <span class="text-sm font-semibold text-neutral-200">Panel de Administración</span>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="hidden text-right sm:block">
              <p class="text-sm font-semibold text-neutral-100">{{ auth.getFullName() }}</p>
              <p class="text-xs text-neutral-400">{{ auth.getRole() }}</p>
            </div>
            <button (click)="logout()" class="btn-danger btn-sm">Salir</button>
          </div>
        </header>

        <main class="p-4 sm:p-6 lg:p-8">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <ng-template #sidebarContent>
      <div class="flex h-16 items-center gap-2 border-b border-neutral-800 px-5">
        <span class="text-lg font-bold tracking-tight text-white">
          Your<em class="text-primary-500 not-italic">Parking</em>
        </span>
      </div>
      <nav class="flex-1 space-y-6 overflow-y-auto p-4">
        <div>
          <p class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Principal</p>
          <ul class="space-y-1">
            <li><a routerLink="/admin" [class]="navClass('/admin', true)" (click)="open = false"><span class="shrink-0"><app-icon-dashboard></app-icon-dashboard></span>Dashboard</a></li>
          </ul>
        </div>
        <div>
          <p class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Operación</p>
          <ul class="space-y-1">
            <li><a routerLink="/admin/espacios" [class]="navClass('/admin/espacios')" (click)="open = false"><span class="shrink-0"><app-icon-spaces></app-icon-spaces></span>Espacios</a></li>
            <li><a routerLink="/admin/niveles" [class]="navClass('/admin/niveles')" (click)="open = false"><span class="shrink-0"><app-icon-levels></app-icon-levels></span>Niveles y Zonas</a></li>
            <li><a routerLink="/admin/tickets" [class]="navClass('/admin/tickets')" (click)="open = false"><span class="shrink-0"><app-icon-tickets></app-icon-tickets></span>Tickets</a></li>
            <li><a routerLink="/admin/reservas" [class]="navClass('/admin/reservas')" (click)="open = false"><span class="shrink-0"><app-icon-reservations></app-icon-reservations></span>Reservas</a></li>
            <li><a routerLink="/admin/incidentes" [class]="navClass('/admin/incidentes')" (click)="open = false"><span class="shrink-0"><app-icon-incidents></app-icon-incidents></span>Incidentes</a></li>
          </ul>
        </div>
        <div>
          <p class="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Gestión</p>
          <ul class="space-y-1">
            <li><a routerLink="/admin/vehiculos" [class]="navClass('/admin/vehiculos')" (click)="open = false"><span class="shrink-0"><app-icon-vehicles></app-icon-vehicles></span>Vehículos</a></li>
            <li><a routerLink="/admin/clientes" [class]="navClass('/admin/clientes')" (click)="open = false"><span class="shrink-0"><app-icon-users></app-icon-users></span>Usuarios</a></li>
            <li><a routerLink="/admin/tarifas" [class]="navClass('/admin/tarifas')" (click)="open = false"><span class="shrink-0"><app-icon-rates></app-icon-rates></span>Tarifas</a></li>
            <li><a routerLink="/admin/pagos" [class]="navClass('/admin/pagos')" (click)="open = false"><span class="shrink-0"><app-icon-payments></app-icon-payments></span>Pagos</a></li>
          </ul>
        </div>
      </nav>
      <div class="border-t border-neutral-800 p-4">
        <button (click)="logout()" class="btn-outline w-full text-neutral-300">
          <app-icon-logout></app-icon-logout>
          Cerrar sesión
        </button>
      </div>
    </ng-template>
  `,
})
export class AdminLayoutComponent {
  open = false;

  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  navClass(path: string, end = false): string {
    const active = this.router.isActive(path, end);
    return 'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ' +
      (active ? 'bg-primary-600 text-white' : 'text-neutral-300 hover:bg-neutral-800 hover:text-white');
  }
}
