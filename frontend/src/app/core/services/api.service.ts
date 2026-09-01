import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { Incident, Rate, Reservation, Space, Subscription, Ticket, User, Vehicle, Zone, Level, Payment, AuthResponse } from '../models';
import { environment } from '../../../environments/environment';

const BASE_URL: string = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // ---- Auth ----
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${BASE_URL}/api/auth/login`, { email, password });
  }
  register(data: Record<string, unknown>): Observable<unknown> {
    return this.http.post(`${BASE_URL}/api/auth/register`, data);
  }

  // ---- Users ----
  getUsers(): Observable<User[]> { return this.http.get<User[]>(`${BASE_URL}/api/users`); }
  getUserMe(): Observable<User> { return this.http.get<User>(`${BASE_URL}/api/users/me`); }
  getUserById(idCard: number): Observable<User> { return this.http.get<User>(`${BASE_URL}/api/users/${idCard}`); }
  getUsersActive(): Observable<User[]> { return this.http.get<User[]>(`${BASE_URL}/api/users/active`); }
  getUsersByRole(role: string): Observable<User[]> { return this.http.get<User[]>(`${BASE_URL}/api/users/role/${role}`); }
  updateUser(idCard: number, data: Partial<User>): Observable<User> { return this.http.put<User>(`${BASE_URL}/api/users/${idCard}`, data); }
  removeUser(idCard: number): Observable<unknown> { return this.http.delete(`${BASE_URL}/api/users/${idCard}`); }
  activateUser(idCard: number): Observable<unknown> { return this.http.patch(`${BASE_URL}/api/users/${idCard}/activate`, {}); }
  deactivateUser(idCard: number): Observable<unknown> { return this.http.patch(`${BASE_URL}/api/users/${idCard}/deactivate`, {}); }

  // ---- Levels ----
  getLevels(): Observable<Level[]> { return this.http.get<Level[]>(`${BASE_URL}/api/levels`); }
  getLevelById(id: number): Observable<Level> { return this.http.get<Level>(`${BASE_URL}/api/levels/${id}`); }
  createLevel(data: Level): Observable<Level> { return this.http.post<Level>(`${BASE_URL}/api/levels`, data); }
  updateLevel(id: number, data: Level): Observable<Level> { return this.http.put<Level>(`${BASE_URL}/api/levels/${id}`, data); }
  removeLevel(id: number): Observable<unknown> { return this.http.delete(`${BASE_URL}/api/levels/${id}`); }

  // ---- Zones ----
  getZones(): Observable<Zone[]> { return this.http.get<Zone[]>(`${BASE_URL}/api/zones`); }
  getZoneById(id: number): Observable<Zone> { return this.http.get<Zone>(`${BASE_URL}/api/zones/${id}`); }
  getZonesByLevel(idPiso: number): Observable<Zone[]> { return this.http.get<Zone[]>(`${BASE_URL}/api/zones/level/${idPiso}`); }
  createZone(data: Zone): Observable<Zone> { return this.http.post<Zone>(`${BASE_URL}/api/zones`, data); }
  updateZone(id: number, data: Zone): Observable<Zone> { return this.http.put<Zone>(`${BASE_URL}/api/zones/${id}`, data); }
  removeZone(id: number): Observable<unknown> { return this.http.delete(`${BASE_URL}/api/zones/${id}`); }

  // ---- Spaces ----
  getSpaces(): Observable<Space[]> { return this.http.get<Space[]>(`${BASE_URL}/api/spaces`); }
  getSpaceById(id: number): Observable<Space> { return this.http.get<Space>(`${BASE_URL}/api/spaces/${id}`); }
  getSpacesByState(state: string): Observable<Space[]> { return this.http.get<Space[]>(`${BASE_URL}/api/spaces/state/${state}`); }
  getSpacesByLevel(idPiso: number): Observable<Space[]> { return this.http.get<Space[]>(`${BASE_URL}/api/spaces/level/${idPiso}`); }
  getSpacesByZone(idZona: number): Observable<Space[]> { return this.http.get<Space[]>(`${BASE_URL}/api/spaces/zone/${idZona}`); }
  getSpacesAvailableCount(): Observable<number> { return this.http.get<number>(`${BASE_URL}/api/spaces/available/count`); }
  createSpace(data: Space): Observable<Space> { return this.http.post<Space>(`${BASE_URL}/api/spaces`, data); }
  updateSpace(id: number, data: Space): Observable<Space> { return this.http.put<Space>(`${BASE_URL}/api/spaces/${id}`, data); }
  changeSpaceState(id: number, state: string): Observable<unknown> { return this.http.patch(`${BASE_URL}/api/spaces/${id}/state?state=${state}`, {}); }
  removeSpace(id: number): Observable<unknown> { return this.http.delete(`${BASE_URL}/api/spaces/${id}`); }

  // ---- Vehicles ----
  getVehicles(): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(`${BASE_URL}/api/vehicles`); }
  getVehicleByPlate(plate: string): Observable<Vehicle> { return this.http.get<Vehicle>(`${BASE_URL}/api/vehicles/${plate}`); }
  getVehiclesByOwner(idCard: number): Observable<Vehicle[]> { return this.http.get<Vehicle[]>(`${BASE_URL}/api/vehicles/owner/${idCard}`); }
  createVehicle(data: Vehicle): Observable<Vehicle> { return this.http.post<Vehicle>(`${BASE_URL}/api/vehicles`, data); }
  updateVehicle(plate: string, data: Partial<Vehicle>): Observable<Vehicle> { return this.http.put<Vehicle>(`${BASE_URL}/api/vehicles/${plate}`, data); }
  removeVehicle(plate: string): Observable<unknown> { return this.http.delete(`${BASE_URL}/api/vehicles/${plate}`); }

  // ---- Tickets ----
  getTickets(): Observable<Ticket[]> { return this.http.get<Ticket[]>(`${BASE_URL}/api/tickets`); }
  getTicketById(id: number): Observable<Ticket> { return this.http.get<Ticket>(`${BASE_URL}/api/tickets/${id}`); }
  getTicketsByVehicle(plate: string): Observable<Ticket[]> { return this.http.get<Ticket[]>(`${BASE_URL}/api/tickets/vehicle/${plate}`); }
  createTicketEntry(data: Record<string, unknown>): Observable<Ticket> { return this.http.post<Ticket>(`${BASE_URL}/api/tickets/entry`, data); }
  closeTicket(id: number, exitDate?: string): Observable<Ticket> {
    return this.http.post<Ticket>(`${BASE_URL}/api/tickets/${id}/close`, exitDate ? { exitDate } : {});
  }
  cancelTicket(id: number): Observable<unknown> { return this.http.post(`${BASE_URL}/api/tickets/${id}/cancel`, {}); }

  // ---- Reservations ----
  getReservations(): Observable<Reservation[]> { return this.http.get<Reservation[]>(`${BASE_URL}/api/reservations`); }
  getReservationById(id: number): Observable<Reservation> { return this.http.get<Reservation>(`${BASE_URL}/api/reservations/${id}`); }
  getReservationsByUser(idCard: number): Observable<Reservation[]> { return this.http.get<Reservation[]>(`${BASE_URL}/api/reservations/user/${idCard}`); }
  getReservationsBySpace(idEspacio: number): Observable<Reservation[]> { return this.http.get<Reservation[]>(`${BASE_URL}/api/reservations/space/${idEspacio}`); }
  createReservation(data: Record<string, unknown>): Observable<Reservation> { return this.http.post<Reservation>(`${BASE_URL}/api/reservations`, data); }
  changeReservationState(id: number, estado: string): Observable<unknown> { return this.http.patch(`${BASE_URL}/api/reservations/${id}/state?estado=${estado}`, {}); }
  removeReservation(id: number): Observable<unknown> { return this.http.delete(`${BASE_URL}/api/reservations/${id}`); }

  // ---- Payments ----
  getPayments(): Observable<Payment[]> { return this.http.get<Payment[]>(`${BASE_URL}/api/payments`); }
  getPaymentById(id: number): Observable<Payment> { return this.http.get<Payment>(`${BASE_URL}/api/payments/${id}`); }
  getPaymentsByState(estado: string): Observable<Payment[]> { return this.http.get<Payment[]>(`${BASE_URL}/api/payments/state/${estado}`); }
  createPayment(data: Record<string, unknown>): Observable<Payment> { return this.http.post<Payment>(`${BASE_URL}/api/payments`, data); }
  removePayment(id: number): Observable<unknown> { return this.http.delete(`${BASE_URL}/api/payments/${id}`); }

  // ---- Rates ----
  getRates(): Observable<Rate[]> { return this.http.get<Rate[]>(`${BASE_URL}/api/rates`); }
  getRateById(id: number): Observable<Rate> { return this.http.get<Rate>(`${BASE_URL}/api/rates/${id}`); }
  calculateRate(tipoVehiculo: string, entry: string, exit: string): Observable<number> {
    return this.http.get<number>(`${BASE_URL}/api/rates/calculate?tipoVehiculo=${encodeURIComponent(tipoVehiculo)}&entry=${encodeURIComponent(entry)}&exit=${encodeURIComponent(exit)}`);
  }
  createRate(data: Rate): Observable<Rate> { return this.http.post<Rate>(`${BASE_URL}/api/rates`, data); }
  updateRate(id: number, data: Rate): Observable<Rate> { return this.http.put<Rate>(`${BASE_URL}/api/rates/${id}`, data); }
  removeRate(id: number): Observable<unknown> { return this.http.delete(`${BASE_URL}/api/rates/${id}`); }

  // ---- Subscriptions ----
  getSubscriptions(): Observable<Subscription[]> { return this.http.get<Subscription[]>(`${BASE_URL}/api/subscriptions`); }
  getSubscriptionById(id: number): Observable<Subscription> { return this.http.get<Subscription>(`${BASE_URL}/api/subscriptions/${id}`); }
  getSubscriptionsByUser(idCard: number): Observable<Subscription[]> { return this.http.get<Subscription[]>(`${BASE_URL}/api/subscriptions/user/${idCard}`); }
  createSubscription(data: Record<string, unknown>): Observable<Subscription> { return this.http.post<Subscription>(`${BASE_URL}/api/subscriptions`, data); }
  changeSubscriptionState(id: number, estado: string): Observable<unknown> { return this.http.patch(`${BASE_URL}/api/subscriptions/${id}/state?estado=${estado}`, {}); }
  removeSubscription(id: number): Observable<unknown> { return this.http.delete(`${BASE_URL}/api/subscriptions/${id}`); }

  // ---- Incidents ----
  getIncidents(): Observable<Incident[]> { return this.http.get<Incident[]>(`${BASE_URL}/api/incidents`); }
  getIncidentById(id: number): Observable<Incident> { return this.http.get<Incident>(`${BASE_URL}/api/incidents/${id}`); }
  getIncidentsByState(estado: string): Observable<Incident[]> { return this.http.get<Incident[]>(`${BASE_URL}/api/incidents/state/${estado}`); }
  getIncidentsByVehicle(plate: string): Observable<Incident[]> { return this.http.get<Incident[]>(`${BASE_URL}/api/incidents/vehicle/${plate}`); }
  createIncident(data: Record<string, unknown>): Observable<Incident> { return this.http.post<Incident>(`${BASE_URL}/api/incidents`, data); }
  changeIncidentState(id: number, estado: string): Observable<unknown> { return this.http.patch(`${BASE_URL}/api/incidents/${id}/state?estado=${estado}`, {}); }
  removeIncident(id: number): Observable<unknown> { return this.http.delete(`${BASE_URL}/api/incidents/${id}`); }
}
