const SESSION_KEYS = {
  token: 'token',
  email: 'email',
  firstName: 'firstName',
  lastName: 'lastName',
  role: 'role',
  idCard: 'idCard',
};

class AuthService {
  static login({ token, email, firstName, lastName, role }) {
    this.clear();
    if (token) localStorage.setItem(SESSION_KEYS.token, token);
    if (email) localStorage.setItem(SESSION_KEYS.email, email);
    if (firstName) localStorage.setItem(SESSION_KEYS.firstName, firstName);
    if (lastName) localStorage.setItem(SESSION_KEYS.lastName, lastName);
    if (role) localStorage.setItem(SESSION_KEYS.role, role);
  }

  static getToken() {
    return localStorage.getItem(SESSION_KEYS.token);
  }

  static getEmail() {
    return localStorage.getItem(SESSION_KEYS.email);
  }

  static getFirstName() {
    return localStorage.getItem(SESSION_KEYS.firstName);
  }

  static getLastName() {
    return localStorage.getItem(SESSION_KEYS.lastName);
  }

  static getRole() {
    return localStorage.getItem(SESSION_KEYS.role);
  }

  static getUserIdCard() {
    const value = localStorage.getItem(SESSION_KEYS.idCard);
    return value ? Number(value) : null;
  }

  static setUserIdCard(idCard) {
    if (idCard != null) localStorage.setItem(SESSION_KEYS.idCard, idCard);
  }

  static getFullName() {
    const first = this.getFirstName() || '';
    const last = this.getLastName() || '';
    return `${first} ${last}`.trim() || 'Usuario';
  }

  static isAuthenticated() {
    return !!this.getToken();
  }

  static isAdmin() {
    return this.getRole() === 'ADMIN';
  }

  static isUser() {
    return this.getRole() === 'USER';
  }

  static isStaff() {
    const role = this.getRole();
    return ['ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE'].includes(role);
  }

  static getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    };
  }

  static clear() {
    Object.values(SESSION_KEYS).forEach((key) => localStorage.removeItem(key));
  }

  static logout(navigate) {
    this.clear();
    if (navigate) navigate('/login');
  }

  static handleResponseError(response, navigate) {
    if (response.status === 401 || response.status === 403) {
      this.logout(navigate);
      return true;
    }
    return false;
  }
}

export default AuthService;
