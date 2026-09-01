import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import type { AuthResponse } from '../../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-12">
      <div class="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-600/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl"></div>

      <div class="relative w-full max-w-md">
        <div class="card p-8 shadow-cardHover">
          <div class="mb-8 flex flex-col items-center">
            <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600">
              <img class="h-10 w-10" src="assets/YourParking.png" alt="Logo" />
            </div>
            <h2 class="text-center text-2xl font-bold text-white">
              Bienvenido a <span class="text-primary-500">YourParking</span>
            </h2>
            <p class="mt-1 text-center text-sm text-neutral-400">
              Ingresa con tu correo electrónico
            </p>
          </div>

          <form class="space-y-5" (ngSubmit)="onSubmit()">
            <div>
              <label for="email" class="label">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                [(ngModel)]="email"
                name="email"
                [disabled]="isLoading"
                class="input"
                placeholder="Ingrese su correo electrónico"
              />
            </div>
            <div>
              <label for="password" class="label">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                [(ngModel)]="password"
                name="password"
                [disabled]="isLoading"
                class="input"
                placeholder="Ingrese su contraseña"
              />
            </div>

            @if (error) {
              <div class="rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4">
                <p class="text-sm text-danger-500">{{ error }}</p>
              </div>
            }

            <button
              type="submit"
              [disabled]="isLoading"
              class="btn-primary w-full py-2.5"
            >
              {{ isLoading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
            </button>

            <div class="flex items-center justify-between text-sm">
              <button type="button" (click)="goSignup()" class="text-primary-400 hover:text-primary-300">
                ¿No tienes cuenta? Crear cuenta
              </button>
              <button type="button" (click)="goHome()" class="text-neutral-400 hover:text-neutral-200">
                Volver al inicio
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  imports: [FormsModule],
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.error = '';

    this.api.login(this.email, this.password).subscribe({
      next: (data: AuthResponse) => {
        if (!data.token) {
          this.error = 'Credenciales incorrectas.';
          this.isLoading = false;
          return;
        }

        this.auth.login({
          token: data.token,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
        });

        this.api.getUserMe().subscribe({
          next: (me) => {
            if (me) this.auth.setUserIdCard(me.idCard);
            this.isLoading = false;
            this.redirectByRole(data.role);
          },
          error: () => {
            this.isLoading = false;
            this.redirectByRole(data.role);
          },
        });
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error de conexión con el servidor.';
        this.isLoading = false;
      },
    });
  }

  private redirectByRole(role: string): void {
    if (role === 'ADMIN' || role === 'OPERATOR' || role === 'SUPERVISOR' || role === 'VIGILANTE') {
      this.router.navigate(['/admin'], { replaceUrl: true });
    } else {
      this.router.navigate(['/portal'], { replaceUrl: true });
    }
  }

  goSignup(): void {
    this.router.navigate(['/signup']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
