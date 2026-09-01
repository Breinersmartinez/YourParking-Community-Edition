import { Injectable } from '@angular/core';
import type { Role } from '../models';

const SESSION_KEYS = {
  token: 'token',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  role: 'role',
  idCard: 'idCard',
} as const;

@Injectable({ providedIn: 'root' })
export class AuthService {
  login({ token, email, firstName, lastName, role }: { token: string; email: string; firstName: string; lastName: string; role: Role }) {
    this.clear();
    if (token) localStorage.setItem(SESSION_KEYS.token, token);
    if (email) localStorage.setItem(SESSION_KEYS.email, email);
    if (firstName) localStorage.setItem(SESSION_KEYS.firstName, firstName);
    if (lastName) localStorage.setItem(SESSION_KEYS.lastName, lastName);
    if (role) localStorage.setItem(SESSION_KEYS.role, role);
  }

  getToken(): string | null {
    return localStorage.getItem(SESSION_KEYS.token);
  }

  getEmail(): string | null {
    return localStorage.getItem(SESSION_KEYS.email);
  }

  getFirstName(): string | null {
    return localStorage.getItem(SESSION_KEYS.firstName);
  }

  getLastName(): string | null {
    return localStorage.getItem(SESSION_KEYS.lastName);
  }

  getRole(): string | null {
    return localStorage.getItem(SESSION_KEYS.role);
  }

  getUserIdCard(): number | null {
    const value = localStorage.getItem(SESSION_KEYS.idCard);
    return value ? Number(value) : null;
  }

  setUserIdCard(idCard: number): void {
    if (idCard != null) localStorage.setItem(SESSION_KEYS.idCard, String(idCard));
  }

  getFullName(): string {
    const first = this.getFirstName() || '';
    const last = this.getLastName() || '';
    return `${first} ${last}`.trim() || 'Usuario';
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  isUser(): boolean {
    return this.getRole() === 'USER';
  }

  isStaff(): boolean {
    const role = this.getRole();
    return !!role && ['ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE'].includes(role);
  }

  getAuthHeaders(): { 'Content-Type': string; Authorization: string } {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    };
  }

  clear(): void {
    Object.values(SESSION_KEYS).forEach((key) => localStorage.removeItem(key));
  }

  logout(): void {
    this.clear();
  }
}
