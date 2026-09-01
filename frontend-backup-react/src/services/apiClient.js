import AuthService from './AuthService';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(path, { method = 'GET', body, auth = true, raw = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = AuthService.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const options = { method, headers };
  if (body !== undefined) options.body = JSON.stringify(body);

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, options);
  } catch (err) {
    throw new ApiError('Error de conexión con el servidor.', 0, null);
  }

  if (!response.ok) {
    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      /* empty */
    }
    const message = data?.message || data?.error || `Error ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  if (response.status === 204 || raw) return null;

  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (_) {
    return text;
  }
}

export default {
  get: (path, opts = {}) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts = {}) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts = {}) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts = {}) => request(path, { ...opts, method: 'PATCH', body }),
  del: (path, opts = {}) => request(path, { ...opts, method: 'DELETE' }),
  BASE_URL,
  ApiError,
};
