import { Component } from '@angular/core';
import { features } from '../../shared/constants/landing-data';
import { CheckIconComponent } from '../../shared/icons/icons';

@Component({
  selector: 'app-features',
  standalone: true,
  template: `
    <div class="mt-20 min-h-[800px] border-b border-neutral-800" id="Servicios">
      <div class="text-center">
        <span class="inline-block rounded-full bg-primary-500/10 px-3 py-1 text-sm font-medium uppercase tracking-wide text-primary-400">
          Servicios
        </span>
        <h2 class="mt-10 text-3xl tracking-wide sm:text-5xl lg:mt-16 lg:text-6xl">
          Controlamos cada ingreso y
          <span class="bg-gradient-to-r from-primary-500 to-accent-400 bg-clip-text text-transparent">
            salida para garantizar la seguridad de tu vehículo.
          </span>
        </h2>
      </div>
      <div class="mt-12 flex flex-wrap lg:mt-20">
        @for (feature of features; track feature.text) {
          <div class="w-full sm:w-1/2 lg:w-1/3">
            <div class="flex">
              <div class="mx-6 flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10 p-2 text-primary-500">
                <app-icon-check [size]="'h-5 w-5'"></app-icon-check>
              </div>
              <div>
                <h5 class="mt-1 mb-6 text-xl text-white">{{ feature.text }}</h5>
                <p class="mb-20 p-2 text-neutral-400">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  imports: [CheckIconComponent],
})
export class FeaturesComponent {
  features = features;
}
