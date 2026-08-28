import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function UserDashboard() {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState({
    idCard: '',
    identificationType: 'CC',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    direction: '',
    role: 'ADMIN',
    active: true
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchAdmins = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data);
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('idCard');
        localStorage.removeItem('firstName');
        navigate('/login');
      } else {
        setError('Error al cargar los administradores');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión al servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentAdmin({ 
      ...currentAdmin, 
      [name]: name === 'idCard' ? (value ? parseInt(value, 10) : '') : value 
    });
  };

  const resetForm = () => {
    setCurrentAdmin({
      idCard: '',
      identificationType: 'CC',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      direction: '',
      role: 'ADMIN',
      active: true
    });
  };

  const handleAddAdmin = () => {
    setIsAddingAdmin(true);
    setIsEditingAdmin(false);
    resetForm();
  };

  const handleEditAdmin = (user) => {
    setCurrentAdmin({
      idCard: user.idCard,
      identificationType: user.identificationType,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      phoneNumber: user.phoneNumber,
      direction: user.direction,
      role: user.role,
      active: user.active
    });
    setIsEditingAdmin(true);
    setIsAddingAdmin(false);
  };

  const handleDeleteAdmin = async (idCard) => {
    if (window.confirm('¿Está seguro de que desea eliminar este administrador?')) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${idCard}`, {
          method: 'DELETE',
          headers: getAuthHeaders(),
        });

        if (response.ok || response.status === 204) {
          fetchAdmins();
        } else if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('idCard');
          localStorage.removeItem('firstName');
          navigate('/login');
        } else {
          setError('Error al eliminar el administrador');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error de conexión al servidor');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentAdmin.idCard || !currentAdmin.firstName || !currentAdmin.lastName || 
        !currentAdmin.email || (!isEditingAdmin && !currentAdmin.password)) {
      setError('Todos los campos obligatorios deben ser completados');
      return;
    }

    try {
      let url, method, body;
      
      if (isEditingAdmin) {
        url = `${import.meta.env.VITE_API_URL}/api/users/${currentAdmin.idCard}`;
        method = 'PUT';
        body = { ...currentAdmin };
        if (!currentAdmin.password) {
          delete body.password;
        }
      } else {
        url = `${import.meta.env.VITE_API_URL}/api/auth/register`;
        method = 'POST';
        body = { ...currentAdmin };
      }

      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });

      if (response.ok) {
        fetchAdmins();
        resetForm();
        setIsAddingAdmin(false);
        setIsEditingAdmin(false);
        setError('');
      } else if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('idCard');
        localStorage.removeItem('firstName');
        navigate('/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al guardar el administrador');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión al servidor');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('idCard');
    localStorage.removeItem('firstName');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
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
          <Link to="/AdminHomeDashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800">
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

      <div className="ml-64 w-full">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center pb-5 border-b border-gray-200 mb-8">
            <h1 className="text-2xl font-bold text-black">Panel de Administración / Administradores</h1>
            <div className="flex items-center">
              <span className="mr-4 text-blue-900">
                Bienvenido, {localStorage.getItem('firstName')}
              </span>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Lista de Administradores</h2>
                <button 
                  onClick={handleAddAdmin}
                  className="bg-blue-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors duration-200"
                >
                  Agregar Administrador
                </button>
              </div>
              
              <div className="border-t border-gray-200">
                {admins.length === 0 ? (
                  <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                    No hay administradores registrados.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cédula</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Registro</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                          
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {admins.map((admin) => (
                          <tr key={admin.idCard} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.identificationType}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.idCard}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.firstName} {admin.lastName}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.phoneNumber}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(admin.registrationDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{admin.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 rounded ${admin.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {admin.active ? 'Activo' : 'Inactivo'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleEditAdmin(admin)}
                                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded mr-2 transition-colors duration-200"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDeleteAdmin(admin.idCard)}
                                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition-colors duration-200"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {(isAddingAdmin || isEditingAdmin) && (
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg leading-6 font-medium text-gray-900">
                    {isEditingAdmin ? 'Editar Administrador' : 'Agregar Administrador'}
                  </h2>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Tipo de Identificación</label>
                          <select
                            name="identificationType"
                            value={currentAdmin.identificationType}
                            onChange={handleInputChange}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                            required
                          >
                            <option value="TI">TI</option>
                            <option value="CC">CC</option>
                            <option value="NUIP">NUIP</option>
                            <option value="CE">CE</option>
                            <option value="P">Pasaporte</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Cédula</label>
                          <input
                            type="number"
                            name="idCard"
                            value={currentAdmin.idCard}
                            onChange={handleInputChange}
                            disabled={isEditingAdmin}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Nombre</label>
                          <input
                            type="text"
                            name="firstName"
                            value={currentAdmin.firstName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Apellido</label>
                          <input
                            type="text"
                            name="lastName"
                            value={currentAdmin.lastName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                            required
                          />
                        </div>
                      </div>
                      
                   

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
                        <input
                          type="email"
                          name="email"
                          value={currentAdmin.email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          {isEditingAdmin ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={currentAdmin.password}
                          onChange={handleInputChange}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                          required={!isEditingAdmin}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={currentAdmin.phoneNumber}
                          onChange={handleInputChange}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Dirección</label>
                        <input
                          type="text"
                          name="direction"
                          value={currentAdmin.direction}
                          onChange={handleInputChange}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                        />
                      </div>
                    </div>
                    
                    <div>
                          <label className="block text-sm font-medium text-gray-700">Rol</label>
                          <select
                            name="role"
                            value={currentAdmin.role}
                            onChange={handleInputChange}
                            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                            required
                          >
                            <option value="ADMIN">ADMIN</option>
                            <option value="OPERATOR">OPERATOR</option>
                            <option value="USER">VIGILANTE</option>
                            <option value="USER">SUPERVISOR</option>
                            <option value="USER">USER</option>
                          </select>
                        </div>

                    <div className="mt-6 flex items-center space-x-4">
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition-colors duration-200"
                      >
                        {isEditingAdmin ? 'Actualizar' : 'Guardar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingAdmin(false);
                          setIsEditingAdmin(false);
                          resetForm();
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors duration-200"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;