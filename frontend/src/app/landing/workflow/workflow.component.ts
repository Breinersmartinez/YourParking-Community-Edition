import { Component } from '@angular/core';
import { checklistItems } from '../../shared/constants/landing-data';
import { CheckIconComponent } from '../../shared/icons/icons';

@Component({
  selector: 'app-workflow',
  standalone: true,
  template: `
    <div class="mt-20" id="Caracteristicas">
      <h2 class="mt-6 text-center text-3xl tracking-wide sm:text-5xl lg:text-6xl">
        Caracteristicas
        <span class="bg-gradient-to-r from-primary-500 to-accent-400 bg-clip-text text-transparent">
          de los servicios del parqueadero.
        </span>
      </h2>
      <div class="flex flex-wrap justify-center">
        <div class="w-full p-2 lg:w-1/2">
          <img
            src="assets/parqueaderoSeñalizacionRoja.jpg"
            alt="Señalización del parqueadero"
            class="w-full rounded-xl border border-neutral-800"
          />
        </div>
        <div class="w-full pt-12 lg:w-1/2">
          @for (item of checklistItems; track item.title) {
            <div class="mb-12 flex">
              <div class="mx-6 flex h-10 w-10 items-center justify-center rounded-full bg-primary-500/10 p-2 text-primary-500">
                <app-icon-check [size]="'h-5 w-5'"></app-icon-check>
              </div>
              <div>
                <h5 class="mb-2 mt-1 text-xl text-white">{{ item.title }}</h5>
                <p class="text-neutral-400">{{ item.description }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  imports: [CheckIconComponent],
})
export class WorkflowComponent {
  checklistItems = checklistItems;
}
