import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

function ChatBot() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  
  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      navigate('/login');
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    
    // Add user message to conversation
    const userMessage = { role: 'user', content: message };
    setConversation(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BREINLOGIC_URL}/api/get-result-BreinLogic`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: message })
      });
      
      const data = await response.json();
      
      if (data.statusCodeValue === 200 && data.body.candidates && data.body.candidates.length > 0) {
        const botResponse = data.body.candidates[0].content.parts[0].text;
        setConversation(prev => [...prev, { role: 'bot', content: botResponse }]);
      } else {
        setConversation(prev => [...prev, { 
          role: 'bot', 
          content: 'Lo siento, hubo un problema procesando tu mensaje. Por favor, intenta de nuevo.' 
        }]);
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setConversation(prev => [...prev, { 
        role: 'bot', 
        content: 'Error de conexión. Por favor, verifica tu conexión e intenta de nuevo.' 
      }]);
    } finally {
      setIsTyping(false);
    }
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
            <span className="text-xl font-bold">StellarPark</span>
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
         <Link to="/admin-dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 11a3 3 0 100-6 3 3 0 000 6z" />
  </svg>
  Gestion de Administradores
</Link>
         <Link to="/client-Dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                   Gestion de clientes
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
      <div className="ml-64 flex flex-col h-screen">
        <div className="px-8 py-6 border-b border-gray-200 bg-white shadow">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Navegación / Asistente Virtual</h1>
            <div className="flex items-center">
              <span className="mr-4 text-gray-700">
                Bienvenido, {localStorage.getItem('name')}
              </span>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded transition-colors duration-200"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col p-6 bg-gray-50 overflow-hidden">
          <div className="bg-white rounded-lg shadow-lg flex-1 flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white px-6 py-4 flex items-center">
              <div className="bg-white rounded-full p-2 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Asistente Virtual YourParking</h2>
                <p className="text-sm text-blue-100">En línea</p>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {conversation.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="bg-blue-100 rounded-full p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium mb-2">Bienvenido al Asistente Virtual</h3>
                  <p className="text-center max-w-md">
                    Pregúntame cualquier cosa sobre estacionamientos, reservas, tarifas o cualquier otra información que necesites.
                  </p>
                </div>
              ) : (
                <>
                  {conversation.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`mb-4 ${msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
                    >
                      <div 
                        className={`rounded-lg px-4 py-2 max-w-xs md:max-w-md lg:max-w-lg ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start mb-4">
                      <div className="bg-gray-200 text-gray-800 rounded-lg px-4 py-2">
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce"></div>
                          <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-600 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={chatEndRef} />
            </div>
            
            {/* Chat Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <textarea
                  className="flex-1 px-4 py-2 focus:outline-none resize-none"
                  placeholder="Escribe un mensaje..."
                  rows="2"
                  value={message}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  className="bg-blue-600 text-white px-4 flex items-center justify-center hover:bg-blue-700 transition-colors"
                  onClick={handleSendMessage}
                  disabled={isTyping || message.trim() === ''}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                El asistente virtual está basado en Inteligencia Artificial y puede no tener información sobre casos específicos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;