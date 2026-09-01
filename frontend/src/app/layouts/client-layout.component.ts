import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-client-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <div class="min-h-screen bg-ink-950">
      <header class="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-800 bg-ink-900/80 px-4 backdrop-blur sm:px-6">
        <a routerLink="/portal" class="flex items-center gap-2">
          <span class="h-3 w-3 rounded-full bg-primary-500"></span>
          <span class="text-lg font-bold tracking-tight text-white">
            Your<em class="text-primary-500 not-italic">Parking</em>
          </span>
        </a>
        <div class="flex items-center gap-3">
          <div class="hidden text-right sm:block">
            <p class="text-sm font-semibold text-neutral-100">{{ auth.getFullName() }}</p>
            <p class="text-xs text-neutral-400">Cliente · {{ auth.getUserIdCard() !== null ? auth.getUserIdCard() : '' }}</p>
          </div>
          <a routerLink="/" class="btn-ghost btn-sm">Ver sitio</a>
          <button (click)="logout()" class="btn-danger btn-sm">Salir</button>
        </div>
      </header>
      <main class="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class ClientLayoutComponent {
  constructor(public auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
