import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../services';
import logo from '../assets/YourParking.png';

function ClientSignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idCard: '',
    identificationType: 'CC',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    direction: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    const registrationData = {
      idCard: parseInt(formData.idCard, 10),
      identificationType: formData.identificationType,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phoneNumber: formData.phoneNumber,
      direction: formData.direction,
      role: 'USER',
    };

    try {
      await auth.register(registrationData);
      setSuccess('Registro exitoso. Redirigiendo al inicio de sesión...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Error al registrar. Inténtelo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const fieldClass = 'input';

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-12">
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" />

      <div className="relative w-full max-w-lg">
        <div className="card p-8 shadow-cardHover">
          <div className="mb-6 flex flex-col items-center">
            <img className="mb-4 h-14 w-14 rounded-2xl bg-primary-600 p-2" src={logo} alt="Logo" />
            <h2 className="text-center text-2xl font-bold text-white">Crear Cuenta</h2>
            <p className="mt-1 text-center text-sm text-neutral-400">
              Regístrate para acceder a nuestros servicios
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Tipo de Identificación</label>
                <select
                  name="identificationType"
                  required
                  value={formData.identificationType}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={fieldClass}
                >
                  <option value="TI">Tarjeta (TI)</option>
                  <option value="CC">Cédula (CC)</option>
                  <option value="NUIP">NUIP</option>
                  <option value="CE">Cédula Extranjería (CE)</option>
                  <option value="P">Pasaporte (P)</option>
                </select>
              </div>
              <div>
                <label className="label">Número de Identificación</label>
                <input
                  name="idCard"
                  type="number"
                  required
                  value={formData.idCard}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={fieldClass}
                  placeholder="Ingrese su número"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Nombre(s)</label>
                <input
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={fieldClass}
                  placeholder="Ingrese su nombre"
                />
              </div>
              <div>
                <label className="label">Apellido(s)</label>
                <input
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={fieldClass}
                  placeholder="Ingrese su apellido"
                />
              </div>
            </div>

            <div>
              <label className="label">Correo Electrónico</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={fieldClass}
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Contraseña</label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength="6"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={fieldClass}
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="label">Confirmar Contraseña</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength="6"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={fieldClass}
                  placeholder="Confirme su contraseña"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Número de Teléfono</label>
                <input
                  name="phoneNumber"
                  type="tel"
                  required
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={fieldClass}
                  placeholder="Ingrese su teléfono"
                />
              </div>
              <div>
                <label className="label">Dirección</label>
                <input
                  name="direction"
                  type="text"
                  required
                  value={formData.direction}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={fieldClass}
                  placeholder="Ingrese su dirección"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4">
                <p className="text-sm text-danger-500">{error}</p>
              </div>
            )}
            {success && (
              <div className="rounded-md border-l-4 border-success-500 bg-success-500/10 p-4">
                <p className="text-sm text-success-500">{success}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="btn-primary w-full py-2.5">
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                onClick={() => navigate('/login')}
                className="text-primary-400 hover:text-primary-300"
                type="button"
              >
                ¿Ya tienes cuenta? Iniciar sesión
              </button>
              <button
                onClick={() => navigate('/')}
                className="text-neutral-400 hover:text-neutral-200"
                type="button"
              >
                Volver al inicio
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClientSignUp;
