import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { pricingOptions } from '../../shared/constants/landing-data';
import { CheckIconComponent } from '../../shared/icons/icons';

@Component({
  selector: 'app-pricing',
  standalone: true,
  template: `
    <div class="mt-20" id="Precios">
      <h2 class="my-8 text-center text-3xl tracking-wide sm:text-5xl lg:text-6xl">
        Tarifas Del Parqueadero
      </h2>
      <div class="flex flex-wrap">
        @for (option of pricingOptions; track option.title; let i = $index) {
          <div class="w-full p-2 sm:w-1/2 lg:w-1/3">
            <div
              class="relative flex h-full flex-col rounded-xl border p-8"
              [class]="i === 2 ? 'border-primary-500 bg-primary-500/5' : 'border-neutral-700 bg-ink-900'"
            >
              @if (i === 2) {
                <span class="absolute -top-3 right-6 rounded-full bg-accent-400 px-3 py-1 text-xs font-semibold text-ink-950">
                  Más popular
                </span>
              }
              <p class="mb-6 text-2xl font-semibold text-white">{{ option.title }}</p>
              <p class="mb-6">
                <span class="mr-2 text-4xl font-bold text-primary-500">{{ option.price }}</span>
              </p>
              <ul class="mb-8 flex-1">
                @for (item of option.features; track item) {
                  <li class="mt-4 flex items-center text-neutral-300">
                    <app-icon-check [size]="'h-5 w-5'"></app-icon-check>
                    <span class="ml-2">{{ item }}</span>
                  </li>
                }
              </ul>
              <button (click)="goLogin()" class="w-full py-2.5" [class]="i === 2 ? 'btn-primary' : 'btn-outline'">
                Reservar
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  imports: [CheckIconComponent],
})
export class PricingComponent {
  pricingOptions = pricingOptions;

  constructor(private router: Router) {}

  goLogin(): void {
    this.router.navigate(['/login']);
  }
}
