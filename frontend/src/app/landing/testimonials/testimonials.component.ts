import { Component } from '@angular/core';
import { testimonials } from '../../shared/constants/landing-data';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  template: `
    <div class="mt-20 tracking-wide" id="Opiniones">
      <h2 class="my-10 text-center text-3xl sm:text-5xl lg:my-20 lg:text-6xl">
        Opiniones
      </h2>
      <div class="flex flex-wrap justify-center">
        @for (testimonial of testimonials; track testimonial.user) {
          <div class="w-full px-4 py-2 sm:w-1/2 lg:w-1/3">
            <div class="rounded-xl border border-neutral-800 bg-ink-900 p-6">
              <div class="mb-4 text-accent-400">
                ★★★★★
              </div>
              <p class="text-neutral-300">{{ testimonial.text }}</p>
              <div class="mt-8 flex items-start">
                <img
                  class="mr-4 h-12 w-12 rounded-full border-2 border-primary-500"
                  [src]="testimonial.image"
                  [alt]="testimonial.user"
                />
                <div>
                  <h6 class="text-white">{{ testimonial.user }}</h6>
                  <span class="text-sm italic text-primary-400">{{ testimonial.company }}</span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class TestimonialsComponent {
  testimonials = testimonials;
}
