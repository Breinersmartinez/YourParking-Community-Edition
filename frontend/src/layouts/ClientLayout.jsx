import { Link, Outlet, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

export default function ClientLayout() {
  const navigate = useNavigate();
  const handleLogout = () => AuthService.logout(navigate);

  return (
    <div className="min-h-screen bg-ink-950">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-800 bg-ink-900/80 px-4 backdrop-blur sm:px-6">
        <Link to="/portal" className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-primary-500" />
          <span className="text-lg font-bold tracking-tight text-white">
            Your<em className="not-italic text-primary-500">Parking</em>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-neutral-100">{AuthService.getFullName()}</p>
            <p className="text-xs text-neutral-400">Cliente · {AuthService.getUserIdCard() || ''}</p>
          </div>
          <Link to="/" className="btn-ghost btn-sm">Ver sitio</Link>
          <button onClick={handleLogout} className="btn-danger btn-sm">Salir</button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
