import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function AdminHomeDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    spacesAvailable: 0,
    todayEntries: 0,
    activeReservations: 0,
    dailyRevenue: 0
  });

  // Verificar si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setIsLoading(false);
      loadStats();
    }
  }, [navigate]);

  const loadStats = async () => {
    try {
      // TODO: En producción, conectar con el backend real
      // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/stats/dashboard`, {
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   }
      // });
      // const data = await response.json();
      
      // Simulación temporal de datos
      setTimeout(() => {
        setStats({
          spacesAvailable: 45,
          todayEntries: 78,
          activeReservations: 12,
          dailyRevenue: 560000
        });
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setIsLoading(false);
    }
  };

  const modules = [
    {
      id: 'spaces',
      title: 'Espacios disponibles',
      value: stats.spacesAvailable,
      path: '/spaces-management',
      color: 'bg-blue-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
      )
    },
    {
      id: 'entries',
      title: 'Ingresos del día',
      value: stats.todayEntries,
      path: '/daily-entries',
      color: 'bg-green-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'reservations',
      title: 'Reservas',
      value: stats.activeReservations,
      path: '/reservations',
      color: 'bg-purple-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 'revenue',
      title: 'Ingresos',
      value: `$${stats.dailyRevenue.toLocaleString()}`,
      path: '/finance',
      color: 'bg-yellow-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'vehicles',
      title: 'Gestión de vehículos',
      description: 'Registrar y administrar vehículos',
      path: '/vehicles',
      color: 'bg-red-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      )
    },
    {
      id: 'USER',
      title: 'Gestión de usuarios',
      description: 'Administrar información de usuarios',
      path: '/user-dashboard',
      color: 'bg-indigo-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      id: 'rates',
      title: 'Tarifas',
      description: 'Configurar tarifas del parqueadero',
      path: '/rates',
      color: 'bg-pink-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 'reports',
      title: 'Informes',
      description: 'Generar reportes y estadísticas',
      path: '/reports',
      color: 'bg-gray-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
  
    {
      id: 'bot',
      title: 'Asistente Virtual',
      description: 'Asistente Virtual BrainLogic',
      path: '/chatbot',
      color: 'bg-cyan-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('idCard');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    navigate('/login');
  };

  // Obtener nombre completo del usuario
  const getUserFullName = () => {
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';
    return `${firstName} ${lastName}`.trim() || 'Usuario';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
          <div className="flex items-center">
            <span className="text-xl font-bold">YourParking</span>
          </div>
        </div>
        <nav className="mt-5">
          <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase">
            Navegación
          </div>
          <Link to="/AdminHomeDashboard" className="flex items-center px-4 py-3 text-white bg-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Inicio
          </Link>
        
          <Link to="/user-Dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Gestión de usuarios
          </Link>
          <Link to="/chatbot" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Asistente Virtual
          </Link>
          <Link to="/checkout" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Checkout
          </Link>
          <Link to="/reports" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Informes
          </Link>
          <Link to="/notifications" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            Notificaciones
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Navegación / Inicio</h1>
          <div className="flex items-center">
            <span className="mr-4 text-gray-700">
              Bienvenido, {getUserFullName()}
            </span>
            <button 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-200"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5 flex items-center">
              <div className="bg-blue-500 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Espacios disponibles</p>
                <p className="text-2xl font-bold">{stats.spacesAvailable}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5 flex items-center">
              <div className="bg-green-500 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Ingresos del día</p>
                <p className="text-2xl font-bold">{stats.todayEntries}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5 flex items-center">
              <div className="bg-purple-500 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Reservas activas</p>
                <p className="text-2xl font-bold">{stats.activeReservations}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-5 flex items-center">
              <div className="bg-yellow-500 rounded-full p-3 mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Ingresos del día</p>
                <p className="text-2xl font-bold">${stats.dailyRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Modules */}
        <div className="bg-white rounded-lg shadow-lg mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800">Módulos disponibles</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modules.slice(4).map((module) => (
                <Link 
                  key={module.id}
                  to={module.path}
                  className="block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="flex items-center mb-3">
                    <div className={`rounded-full p-3 mr-4 ${module.color} text-white`}>
                      {module.icon}
                    </div>
                    <h3 className="text-lg font-medium text-gray-800">{module.title}</h3>
                  </div>
                  <p className="text-gray-600">{module.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-600 text-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-medium mb-4">Espacios disponibles</h3>
            <div className="flex justify-between items-center">
              <div className="text-4xl font-bold">{stats.spacesAvailable}</div>
              <Link 
                to="/spaces-management"
                className="inline-flex items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
              >
                Ver detalles
              </Link>
            </div>
          </div>
          
          <div className="bg-green-600 text-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-medium mb-4">Ingresos del día</h3>
            <div className="flex justify-between items-center">
              <div className="text-4xl font-bold">{stats.todayEntries}</div>
              <Link 
                to="/daily-entries"
                className="inline-flex items-center justify-center px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors duration-200"
              >
                Ver detalles
              </Link>
            </div>
          </div>
          
          <div className="bg-purple-600 text-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-medium mb-4">Reservas</h3>
            <div className="flex justify-between items-center">
              <div className="text-4xl font-bold">{stats.activeReservations}</div>
              <Link 
                to="/reservations"
                className="inline-flex items-center justify-center px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors duration-200"
              >
                Ver detalles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHomeDashboard;