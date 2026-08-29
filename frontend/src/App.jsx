import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeatureSection from './components/FeatureSection';
import Workflow from './components/Workflow';
import Footer from './components/Footer';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';

import Login from './pages/Login';
import ClientSignUp from './pages/ClientSignUp';
import ChatBot from './pages/ChatBot';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import SpacesManagement from './pages/SpacesManagement';
import LevelsZones from './pages/LevelsZones';
import TicketsManagement from './pages/TicketsManagement';
import ReservationsManagement from './pages/ReservationsManagement';
import IncidentsManagement from './pages/IncidentsManagement';
import VehiclesManagement from './pages/VehiclesManagement';
import UsersManagement from './pages/UsersManagement';
import RatesManagement from './pages/RatesManagement';
import PaymentsManagement from './pages/PaymentsManagement';

import ClientLayout from './layouts/ClientLayout';
import ClientDashboard from './pages/ClientDashboard';

import AuthService from './services/AuthService';

// Guard: redirige a /login si no hay sesión
function RequireAuth({ children }) {
  if (!AuthService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Admin layout (rutas bajo /admin)
function AdminRoute() {
  return (
    <RequireAuth>
      <AdminLayout />
    </RequireAuth>
  );
}

// Portal de cliente
function ClientRoute() {
  return (
    <RequireAuth>
      <ClientLayout />
    </RequireAuth>
  );
}

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Landing */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <div className="mx-auto max-w-7xl px-6 pt-20">
                <HeroSection />
                <FeatureSection />
                <Workflow />
                <Pricing />
                <Testimonials />
              </div>
              <Footer />
            </>
          }
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/clientSignUp" element={<ClientSignUp />} />
        <Route path="/chatBot" element={<ChatBot />} />

        {/* Portal cliente */}
        <Route path="/portal" element={<ClientRoute />}>
          <Route index element={<ClientDashboard />} />
        </Route>

        {/* Panel administración */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<AdminDashboard />} />
          <Route path="espacios" element={<SpacesManagement />} />
          <Route path="niveles" element={<LevelsZones />} />
          <Route path="tickets" element={<TicketsManagement />} />
          <Route path="reservas" element={<ReservationsManagement />} />
          <Route path="incidentes" element={<IncidentsManagement />} />
          <Route path="vehiculos" element={<VehiclesManagement />} />
          <Route path="clientes" element={<UsersManagement />} />
          <Route path="tarifas" element={<RatesManagement />} />
          <Route path="pagos" element={<PaymentsManagement />} />
        </Route>

        {/* Redirecciones de rutas antiguas */}
        <Route path="/UserHomeDashboard" element={<Navigate to="/portal" replace />} />
        <Route path="/AdminHomeDashboard" element={<Navigate to="/admin" replace />} />
        <Route path="/user-dashboard" element={<Navigate to="/admin/clientes" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
