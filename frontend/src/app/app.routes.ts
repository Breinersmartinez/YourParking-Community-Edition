import { Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AdminLayoutComponent } from './layouts/admin-layout.component';
import { ClientLayoutComponent } from './layouts/client-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { SpacesComponent } from './pages/spaces/spaces.component';
import { LevelsZonesComponent } from './pages/levels-zones/levels-zones.component';
import { TicketsComponent } from './pages/tickets/tickets.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { VehiclesComponent } from './pages/vehicles/vehicles.component';
import { UsersComponent } from './pages/users/users.component';
import { RatesComponent } from './pages/rates/rates.component';
import { PaymentsComponent } from './pages/payments/payments.component';
import { ClientDashboardComponent } from './pages/client-dashboard/client-dashboard.component';
import { ChatbotComponent } from './pages/chatbot/chatbot.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'espacios', component: SpacesComponent },
      { path: 'niveles', component: LevelsZonesComponent },
      { path: 'tickets', component: TicketsComponent },
      { path: 'reservas', component: ReservationsComponent },
      { path: 'incidentes', component: IncidentsComponent },
      { path: 'vehiculos', component: VehiclesComponent },
      { path: 'clientes', component: UsersComponent },
      { path: 'tarifas', component: RatesComponent },
      { path: 'pagos', component: PaymentsComponent },
    ],
  },
  {
    path: 'portal',
    component: ClientLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: ClientDashboardComponent },
      { path: 'chatbot', component: ChatbotComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
