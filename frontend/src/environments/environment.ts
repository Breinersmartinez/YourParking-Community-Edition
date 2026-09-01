// Variable de entorno para el backend. En el build de producción (Docker)
// se puede sobrescribir sustituyendo este valor en el paso de construcción.
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  breinLogicUrl: '',
};
