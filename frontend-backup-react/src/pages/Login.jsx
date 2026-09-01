import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { auth, users } from '../services';
import logo from '../assets/YourParking.png';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = await auth.login(email, password);
      if (!data?.token) {
        setError(data?.message || 'Credenciales incorrectas.');
        return;
      }

      AuthService.login({
        token: data.token,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      });

      try {
        const me = await users.getMe();
        if (me) AuthService.setUserIdCard(me.idCard);
      } catch (_) {
        /* el idCard se obtiene de forma opcional */
      }

      const role = data.role;
      if (role === 'ADMIN' || role === 'OPERATOR' || role === 'SUPERVISOR' || role === 'VIGILANTE') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/portal', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-12">
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent-400/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="card p-8 shadow-cardHover">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-600">
              <img className="h-10 w-10" src={logo} alt="Logo" />
            </div>
            <h2 className="text-center text-2xl font-bold text-white">
              Bienvenido a <span className="text-primary-500">YourParking</span>
            </h2>
            <p className="mt-1 text-center text-sm text-neutral-400">
              Ingresa con tu correo electrónico
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="label">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="input"
                placeholder="Ingrese su correo electrónico"
              />
            </div>
            <div>
              <label htmlFor="password" className="label">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="input"
                placeholder="Ingrese su contraseña"
              />
            </div>

            {error && (
              <div className="rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4">
                <p className="text-sm text-danger-500">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-2.5"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                onClick={() => navigate('/ClientSignUp')}
                className="text-primary-400 hover:text-primary-300"
                type="button"
              >
                ¿No tienes cuenta? Crear cuenta
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

export default Login;
