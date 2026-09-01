import api from './apiClient';

const auth = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }, { auth: false }),
  register: (data) =>
    api.post('/api/auth/register', data, { auth: false }),
};

const users = {
  getAll: () => api.get('/api/users'),
  getMe: () => api.get('/api/users/me'),
  getById: (idCard) => api.get(`/api/users/${idCard}`),
  getActive: () => api.get('/api/users/active'),
  getByRole: (role) => api.get(`/api/users/role/${role}`),
  update: (idCard, data) => api.put(`/api/users/${idCard}`, data),
  remove: (idCard) => api.del(`/api/users/${idCard}`),
  activate: (idCard) => api.patch(`/api/users/${idCard}/activate`),
  deactivate: (idCard) => api.patch(`/api/users/${idCard}/deactivate`),
};

const levels = {
  getAll: () => api.get('/api/levels'),
  getById: (id) => api.get(`/api/levels/${id}`),
  create: (data) => api.post('/api/levels', data),
  update: (id, data) => api.put(`/api/levels/${id}`, data),
  remove: (id) => api.del(`/api/levels/${id}`),
};

const zones = {
  getAll: () => api.get('/api/zones'),
  getById: (id) => api.get(`/api/zones/${id}`),
  getByLevel: (idPiso) => api.get(`/api/zones/level/${idPiso}`),
  create: (data) => api.post('/api/zones', data),
  update: (id, data) => api.put(`/api/zones/${id}`, data),
  remove: (id) => api.del(`/api/zones/${id}`),
};

const spaces = {
  getAll: () => api.get('/api/spaces'),
  getById: (id) => api.get(`/api/spaces/${id}`),
  getByState: (state) => api.get(`/api/spaces/state/${state}`),
  getByLevel: (idPiso) => api.get(`/api/spaces/level/${idPiso}`),
  getByZone: (idZona) => api.get(`/api/spaces/zone/${idZona}`),
  getAvailableCount: () => api.get('/api/spaces/available/count'),
  create: (data) => api.post('/api/spaces', data),
  update: (id, data) => api.put(`/api/spaces/${id}`, data),
  changeState: (id, state) =>
    api.patch(`/api/spaces/${id}/state?state=${state}`),
  remove: (id) => api.del(`/api/spaces/${id}`),
};

const vehicles = {
  getAll: () => api.get('/api/vehicles'),
  getByPlate: (plate) => api.get(`/api/vehicles/${plate}`),
  getByOwner: (idCard) => api.get(`/api/vehicles/owner/${idCard}`),
  create: (data) => api.post('/api/vehicles', data),
  remove: (plate) => api.del(`/api/vehicles/${plate}`),
};

const tickets = {
  getAll: () => api.get('/api/tickets'),
  getById: (id) => api.get(`/api/tickets/${id}`),
  getByVehicle: (plate) => api.get(`/api/tickets/vehicle/${plate}`),
  createEntry: (data) => api.post('/api/tickets/entry', data),
  close: (id, exitDate) =>
    api.post(`/api/tickets/${id}/close`, exitDate ? { exitDate } : undefined),
  cancel: (id) => api.post(`/api/tickets/${id}/cancel`),
};

const reservations = {
  getAll: () => api.get('/api/reservations'),
  getById: (id) => api.get(`/api/reservations/${id}`),
  getByUser: (idCard) => api.get(`/api/reservations/user/${idCard}`),
  getBySpace: (idEspacio) => api.get(`/api/reservations/space/${idEspacio}`),
  create: (data) => api.post('/api/reservations', data),
  changeState: (id, estado) =>
    api.patch(`/api/reservations/${id}/state?estado=${estado}`),
  remove: (id) => api.del(`/api/reservations/${id}`),
};

const payments = {
  getAll: () => api.get('/api/payments'),
  getById: (id) => api.get(`/api/payments/${id}`),
  getByState: (estado) => api.get(`/api/payments/state/${estado}`),
  create: (data) => api.post('/api/payments', data),
  remove: (id) => api.del(`/api/payments/${id}`),
};

const rates = {
  getAll: () => api.get('/api/rates'),
  getById: (id) => api.get(`/api/rates/${id}`),
  calculate: (tipoVehiculo, entry, exit) =>
    api.get(
      `/api/rates/calculate?tipoVehiculo=${encodeURIComponent(
        tipoVehiculo
      )}&entry=${encodeURIComponent(entry)}&exit=${encodeURIComponent(exit)}`
    ),
  create: (data) => api.post('/api/rates', data),
  update: (id, data) => api.put(`/api/rates/${id}`, data),
  remove: (id) => api.del(`/api/rates/${id}`),
};

const subscriptions = {
  getAll: () => api.get('/api/subscriptions'),
  getById: (id) => api.get(`/api/subscriptions/${id}`),
  getByUser: (idCard) => api.get(`/api/subscriptions/user/${idCard}`),
  create: (data) => api.post('/api/subscriptions', data),
  changeState: (id, estado) =>
    api.patch(`/api/subscriptions/${id}/state?estado=${estado}`),
  remove: (id) => api.del(`/api/subscriptions/${id}`),
};

const incidents = {
  getAll: () => api.get('/api/incidents'),
  getById: (id) => api.get(`/api/incidents/${id}`),
  getByState: (estado) => api.get(`/api/incidents/state/${estado}`),
  getByVehicle: (plate) => api.get(`/api/incidents/vehicle/${plate}`),
  create: (data) => api.post('/api/incidents', data),
  changeState: (id, estado) =>
    api.patch(`/api/incidents/${id}/state?estado=${estado}`),
  remove: (id) => api.del(`/api/incidents/${id}`),
};

export {
  api,
  auth,
  users,
  levels,
  zones,
  spaces,
  vehicles,
  tickets,
  reservations,
  payments,
  rates,
  subscriptions,
  incidents,
};

// Enums y constantes reutilizables en la UI
export const ENUMS = {
  Role: ['ADMIN', 'OPERATOR', 'SUPERVISOR', 'VIGILANTE', 'USER'],
  IdentificationType: ['TI', 'CC', 'NUIP', 'CE', 'P'],
  SpaceState: ['DISPONIBLE', 'OCUPADO', 'RESERVADO', 'MANTENIMIENTO'],
  SpaceType: ['ESTANDAR', 'DISCAPACIDAD', 'FAMILIA', 'ELECTRICO'],
  TicketState: ['ACTIVO', 'FINALIZADO', 'CANCELADO'],
  ReservationState: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'CUMPLIDA'],
  PaymentState: ['PENDIENTE', 'PAGADO', 'CANCELADO'],
  PaymentMethod: ['EFECTIVO', 'TARJETA', 'APP', 'QR'],
  SubscriptionState: ['ACTIVO', 'VENCIDO', 'CANCELADO'],
  SubscriptionType: ['MENSUAL', 'TRIMESTRAL', 'ANUAL'],
  IncidentState: ['REPORTADO', 'EN_PROCESO', 'RESUELTO'],
  IncidentType: ['DANIO', 'ROBO', 'ACCIDENTE', 'OTRO'],
  VehicleType: ['AUTO', 'MOTO', 'CAMIONETA', 'CAMION', 'BUS', 'BICICLETA'],
};
