import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import logo from "../assets/StellarCodeLogo.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoSignUp = () => {
    navigate('/ClientSignUp');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Guardar toda la información del usuario usando AuthService
        AuthService.login(data.token, data.email, data.name, data.role);
        
        // Redirigir según el rol
        if (data.role === 'ADMIN') {
          navigate('/AdminHomeDashboard');
        } else if (data.role === 'USER') {
          navigate('/UserHomeDashboard'); // o la ruta que uses para clientes
        } else {
          navigate('/'); // ruta por defecto
        }
      } else {
        setError(data.message || "Credenciales incorrectas. Por favor, inténtelo de nuevo.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Error de conexión con el servidor. Por favor, inténtelo más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-black p-8 rounded-lg shadow-lg relative">
        <button
          onClick={handleGoHome}
          className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition text-sm"
          type="button"
        >
          Volver a inicio
        </button>

        <div className="flex flex-col items-center">
          <img className="h-20 w-auto mb-4" src={logo} alt="Logo" />
          <h2 className="text-center text-2xl font-bold text-white">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Ingresa con tu correo electrónico
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ingrese su correo electrónico"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Ingrese su contraseña"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 px-4 text-sm font-medium rounded-md text-white ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={handleGoSignUp}
              className="text-blue-400 hover:text-blue-300 text-sm"
              type="button"
            >
              ¿No tienes cuenta? Crear una cuenta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;