import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  template: `
    <div class="relative flex flex-col items-center py-16 lg:py-20">
      <div class="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary-600/20 blur-3xl"></div>

      <div class="relative">
        <h1 class="text-4xl text-center tracking-wide sm:text-6xl lg:text-7xl">
          Bienvenido a
          <span class="bg-gradient-to-r from-primary-500 to-accent-400 bg-clip-text text-transparent">
            YourParking
          </span>
        </h1>
        <p class="mx-auto mt-8 max-w-4xl text-center text-lg text-neutral-400">
          El parqueadero inteligente que te permite reservar, pagar y monitorear
          tu espacio de estacionamiento de forma rápida y segura. Olvídate de
          dar vueltas buscando dónde estacionar.
        </p>
      </div>

      <div class="relative mt-10 flex flex-wrap justify-center gap-4">
        <button class="btn-primary px-8 py-3 text-base" (click)="goLogin()">Reservar</button>
        <a
          href="https://api.whatsapp.com/send/?phone=573138619952&text&type=phone_number&app_absent=0"
          class="btn-outline px-8 py-3 text-base"
        >
          Contactarse
        </a>
      </div>

      <div class="relative mt-12 flex flex-col justify-center gap-4 md:flex-row">
        <video autoplay loop muted class="w-full rounded-xl border border-primary-600/40 shadow-lg shadow-primary-900/20 md:w-1/2">
          <source src="assets/Parqueadero1.2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <video autoplay loop muted class="w-full rounded-xl border border-primary-600/40 shadow-lg shadow-primary-900/20 md:w-1/2">
          <source src="assets/Parqueadero1.3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  `,
  imports: [RouterModule],
})
export class HeroComponent {
  constructor(private router: Router) {}

  goLogin(): void {
    this.router.navigate(['/login']);
  }
}
