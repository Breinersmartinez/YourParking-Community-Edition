import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  template: `
    <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-12">
      <div class="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-600/20 blur-3xl"></div>
      <div class="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl"></div>

      <div class="relative w-full max-w-lg">
        <div class="card p-8 shadow-cardHover">
          <div class="mb-6 flex flex-col items-center">
            <img class="mb-4 h-14 w-14 rounded-2xl bg-primary-600 p-2" src="assets/YourParking.png" alt="Logo" />
            <h2 class="text-center text-2xl font-bold text-white">Crear Cuenta</h2>
            <p class="mt-1 text-center text-sm text-neutral-400">
              Regístrate para acceder a nuestros servicios
            </p>
          </div>

          <form class="space-y-4" (ngSubmit)="onSubmit()">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="label">Tipo de Identificación</label>
                <select
                  name="identificationType"
                  required
                  [(ngModel)]="formData.identificationType"
                  [disabled]="isLoading"
                  class="input"
                >
                  @for (option of identificationOptions; track option.value) {
                    <option [value]="option.value">{{ option.label }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="label">Número de Identificación</label>
                <input
                  name="idCard"
                  type="number"
                  required
                  [(ngModel)]="formData.idCard"
                  [disabled]="isLoading"
                  class="input"
                  placeholder="Ingrese su número"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="label">Nombre(s)</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  [(ngModel)]="formData.firstName"
                  [disabled]="isLoading"
                  class="input"
                  placeholder="Ingrese su nombre"
                />
              </div>
              <div>
                <label class="label">Apellido(s)</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  [(ngModel)]="formData.lastName"
                  [disabled]="isLoading"
                  class="input"
                  placeholder="Ingrese su apellido"
                />
              </div>
            </div>

            <div>
              <label class="label">Correo Electrónico</label>
              <input
                name="email"
                type="email"
                required
                [(ngModel)]="formData.email"
                [disabled]="isLoading"
                class="input"
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="label">Contraseña</label>
                <input
                  name="password"
                  type="password"
                  required
                  minlength="6"
                  [(ngModel)]="formData.password"
                  [disabled]="isLoading"
                  class="input"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label class="label">Confirmar Contraseña</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minlength="6"
                  [(ngModel)]="formData.confirmPassword"
                  [disabled]="isLoading"
                  class="input"
                  placeholder="Confirme su contraseña"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label class="label">Número de Teléfono</label>
                <input
                  name="phoneNumber"
                  type="tel"
                  required
                  [(ngModel)]="formData.phoneNumber"
                  [disabled]="isLoading"
                  class="input"
                  placeholder="Ingrese su teléfono"
                />
              </div>
              <div>
                <label class="label">Dirección</label>
                <input
                  name="direction"
                  type="text"
                  required
                  [(ngModel)]="formData.direction"
                  [disabled]="isLoading"
                  class="input"
                  placeholder="Ingrese su dirección"
                />
              </div>
            </div>

            @if (error) {
              <div class="rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4">
                <p class="text-sm text-danger-500">{{ error }}</p>
              </div>
            }
            @if (success) {
              <div class="rounded-md border-l-4 border-success-500 bg-success-500/10 p-4">
                <p class="text-sm text-success-500">{{ success }}</p>
              </div>
            }

            <button type="submit" [disabled]="isLoading" class="btn-primary w-full py-2.5">
              {{ isLoading ? 'Registrando...' : 'Registrarse' }}
            </button>

            <div class="flex items-center justify-between text-sm">
              <button type="button" (click)="goLogin()" class="text-primary-400 hover:text-primary-300">
                ¿Ya tienes cuenta? Iniciar sesión
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
export class SignupComponent {
  identificationOptions = [
    { value: 'TI', label: 'Tarjeta (TI)' },
    { value: 'CC', label: 'Cédula (CC)' },
    { value: 'NUIP', label: 'NUIP' },
    { value: 'CE', label: 'Cédula Extranjería (CE)' },
    { value: 'P', label: 'Pasaporte (P)' },
  ];
  formData = {
    identificationType: 'CC',
    idCard: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    direction: '',
  };
  error = '';
  success = '';
  isLoading = false;

  constructor(
    private api: ApiService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.isLoading = true;
    this.error = '';
    this.success = '';

    if (this.formData.password !== this.formData.confirmPassword) {
      this.error = 'Las contraseñas no coinciden';
      this.isLoading = false;
      return;
    }
    if (this.formData.password.length < 6) {
      this.error = 'La contraseña debe tener al menos 6 caracteres';
      this.isLoading = false;
      return;
    }

    const registrationData = {
      idCard: parseInt(this.formData.idCard, 10),
      identificationType: this.formData.identificationType,
      firstName: this.formData.firstName,
      lastName: this.formData.lastName,
      email: this.formData.email,
      password: this.formData.password,
      phoneNumber: this.formData.phoneNumber,
      direction: this.formData.direction,
      role: 'USER',
    };

    this.api.register(registrationData).subscribe({
      next: () => {
        this.success = 'Registro exitoso. Redirigiendo al inicio de sesión...';
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'Error al registrar. Inténtelo de nuevo.';
        this.isLoading = false;
      },
    });
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
