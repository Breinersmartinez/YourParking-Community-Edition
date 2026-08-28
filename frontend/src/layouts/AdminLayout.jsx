import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

function AdminLayout() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => AuthService.logout(navigate);

  return (
    <div className="min-h-screen bg-ink-950">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-ink-900 border-r border-neutral-800 lg:flex">
        <SidebarContent onLogout={handleLogout} />
      </aside>

      {/* Sidebar móvil */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 flex-col bg-ink-900 border-r border-neutral-800 flex">
            <SidebarContent onLogout={handleLogout} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-neutral-800 bg-ink-900/80 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              className="btn-ghost btn-sm lg:hidden"
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </button>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-primary-500" />
              <span className="text-sm font-semibold text-neutral-200">
                Panel de Administración
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-neutral-100">
                {AuthService.getFullName()}
              </p>
              <p className="text-xs text-neutral-400">{AuthService.getRole()}</p>
            </div>
            <button onClick={handleLogout} className="btn-danger btn-sm">
              Salir
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ onLogout }) {
  return (
    <>
      <div className="flex h-16 items-center gap-2 border-b border-neutral-800 px-5">
        <span className="text-lg font-bold tracking-tight text-white">
          Your<em className="not-italic text-primary-500">Parking</em>
        </span>
      </div>
      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        {NAV.map((group) => (
          <div key={group.section}>
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {group.section}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-neutral-800 p-4">
        <button
          onClick={onLogout}
          className="btn-outline w-full text-neutral-300"
        >
          <LogoutIcon />
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

/* Icons (inline SVG) */
const iconProps = {
  className: 'h-5 w-5 shrink-0',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};
const DashboardIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);
const SpacesIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="4" width="18" height="6" rx="1" />
    <rect x="3" y="14" width="6" height="6" rx="1" />
    <rect x="11" y="14" width="10" height="6" rx="1" />
  </svg>
);
const LevelsIcon = () => (
  <svg {...iconProps}>
    <path d="M3 5h18M3 9h18M3 13h18" />
    <path d="M9 5v14M15 5v9M9 19h6" />
  </svg>
);
const TicketsIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 9h18M3 15h18M9 5v14" />
  </svg>
);
const ReservationsIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);
const IncidentsIcon = () => (
  <svg {...iconProps}>
    <path d="M12 3l9 16H3l9-16z" />
    <path d="M12 10v4M12 17h.01" />
  </svg>
);
const VehiclesIcon = () => (
  <svg {...iconProps}>
    <path d="M5 17h14l1-7H4l1 7z" />
    <path d="M4 10l-1 4M21 10l1 4" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);
const UsersIcon = () => (
  <svg {...iconProps}>
    <circle cx="9" cy="8" r="3" />
    <path d="M3 20a6 6 0 0112 0M16 11a3 3 0 010 6M14 20a5 5 0 013-4" />
  </svg>
);
const RatesIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M15 9.5c-.5-1-1.5-1.5-3-1.5-1.6 0-3 .8-3 2s1.4 2 3 2 3 .8 3 2-1.4 2-3 2c-1.5 0-2.5-.5-3-1.5" />
  </svg>
);
const PaymentsIcon = () => (
  <svg {...iconProps}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M2 10h20M6 15h4" />
  </svg>
);
const MenuIcon = () => (
  <svg {...iconProps}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);
const LogoutIcon = () => (
  <svg {...iconProps}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

const NAV = [
  {
    section: 'Principal',
    items: [
      { to: '/admin', label: 'Dashboard', icon: <DashboardIcon />, end: true },
    ],
  },
  {
    section: 'Operación',
    items: [
      { to: '/admin/espacios', label: 'Espacios', icon: <SpacesIcon /> },
      { to: '/admin/niveles', label: 'Niveles y Zonas', icon: <LevelsIcon /> },
      { to: '/admin/tickets', label: 'Tickets', icon: <TicketsIcon /> },
      { to: '/admin/reservas', label: 'Reservas', icon: <ReservationsIcon /> },
      { to: '/admin/incidentes', label: 'Incidentes', icon: <IncidentsIcon /> },
    ],
  },
  {
    section: 'Gestión',
    items: [
      { to: '/admin/vehiculos', label: 'Vehículos', icon: <VehiclesIcon /> },
      { to: '/admin/clientes', label: 'Usuarios', icon: <UsersIcon /> },
      { to: '/admin/tarifas', label: 'Tarifas', icon: <RatesIcon /> },
      { to: '/admin/pagos', label: 'Pagos', icon: <PaymentsIcon /> },
    ],
  },
];

export default AdminLayout;
