import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { navItems } from '../../shared/constants/landing-data';
import { MenuIconComponent, XIconComponent } from '../../shared/icons/icons';

@Component({
  selector: 'app-navbar',
  standalone: true,
  template: `
    <nav class="sticky top-0 z-50 border-b border-neutral-800 bg-ink-950/80 py-3 backdrop-blur-lg">
      <div class="relative mx-auto max-w-7xl px-4 lg:text-sm">
        <div class="flex items-center justify-between">
          <div class="flex items-center flex-shrink-0">
            <div class="mr-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-600">
              <img class="h-7 w-7" src="assets/YourParking.png" alt="Logo" />
            </div>
            <span class="text-xl tracking-tight text-white">
              Your<em class="text-primary-500 not-italic">Parking</em>
            </span>
          </div>
          <ul class="ml-14 hidden space-x-12 lg:flex">
            @for (item of navItems; track item.label) {
              <li>
                <a [href]="item.href" class="text-neutral-300 transition-colors hover:text-primary-400">{{ item.label }}</a>
              </li>
            }
          </ul>
          <div class="ml-8 hidden items-center space-x-4 lg:flex">
            <button class="btn-primary" (click)="goLogin()">Ingresar</button>
          </div>
          <div class="flex flex-col justify-end lg:hidden">
            <button (click)="toggle()" class="btn-ghost p-2 text-white">
              @if (mobileOpen) { <app-icon-x></app-icon-x> } @else { <app-icon-menu></app-icon-menu> }
            </button>
          </div>
        </div>
        @if (mobileOpen) {
          <div class="fixed top-16 right-0 z-20 w-72 border-l border-b border-neutral-800 bg-ink-900 p-6 lg:hidden">
            <ul>
              @for (item of navItems; track item.label) {
                <li class="py-3">
                  <a [href]="item.href" class="text-neutral-200 hover:text-primary-400">{{ item.label }}</a>
                </li>
              }
            </ul>
            <button class="btn-primary mt-4 w-full" (click)="goLogin()">Ingresar</button>
          </div>
        }
      </div>
    </nav>
  `,
  imports: [MenuIconComponent, XIconComponent],
})
export class NavbarComponent {
  mobileOpen = false;
  navItems = navItems;

  constructor(private router: Router) {}

  toggle(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }
}
