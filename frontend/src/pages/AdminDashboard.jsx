import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import {
  spaces,
  tickets,
  reservations,
  payments,
  vehicles,
  incidents,
} from '../services';
import { formatCurrency, formatDateTime } from '../utils/format';

const iconProps = {
  className: 'h-6 w-6',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const SpacesIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="4" width="18" height="6" rx="1" />
    <rect x="3" y="14" width="6" height="6" rx="1" />
    <rect x="11" y="14" width="10" height="6" rx="1" />
  </svg>
);
const TicketIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M8 9h8M8 13h5" />
  </svg>
);
const ReservationsIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M8 3v4M16 3v4M3 10h18" />
  </svg>
);
const RevenueIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M15 9.5c-.5-1-1.5-1.5-3-1.5-1.6 0-3 .8-3 2s1.4 2 3 2 3 .8 3 2-1.4 2-3 2c-1.5 0-2.5-.5-3-1.5" />
  </svg>
);

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    availableSpaces: 0,
    totalSpaces: 0,
    activeTickets: 0,
    activeReservations: 0,
    revenue: 0,
    totalVehicles: 0,
    pendingIncidents: 0,
  });
  const [latestTickets, setLatestTickets] = useState([]);
  const [latestReservations, setLatestReservations] = useState([]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [spacesList, ticketsList, reservationsList, paymentsList, vehiclesList, incidentsList] =
        await Promise.all([
          spaces.getAll().catch(() => []),
          tickets.getAll().catch(() => []),
          reservations.getAll().catch(() => []),
          payments.getAll().catch(() => []),
          vehicles.getAll().catch(() => []),
          incidents.getAll().catch(() => []),
        ]);

      const available = (spacesList || []).filter(
        (s) => s.estado === 'DISPONIBLE'
      ).length;

      setStats({
        availableSpaces: available,
        totalSpaces: (spacesList || []).length,
        activeTickets: (ticketsList || []).filter((t) => t.state === 'ACTIVO').length,
        activeReservations: (reservationsList || []).filter((r) =>
          ['PENDIENTE', 'CONFIRMADA'].includes(r.estado)
        ).length,
        revenue: (paymentsList || [])
          .filter((p) => p.estadoPago === 'PAGADO')
          .reduce((acc, p) => acc + Number(p.montoTotal || 0), 0),
        totalVehicles: (vehiclesList || []).length,
        pendingIncidents: (incidentsList || []).filter((i) =>
          ['REPORTADO', 'EN_PROCESO'].includes(i.estado)
        ).length,
      });

      setLatestTickets((ticketsList || [])
        .slice()
        .sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))
        .slice(0, 5));

      setLatestReservations((reservationsList || [])
        .slice()
        .sort((a, b) => new Date(b.fechaHoraInicio) - new Date(a.fechaHoraInicio))
        .slice(0, 5));
    } catch (e) {
      /* valores por defecto */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Resumen general del estado del parqueadero en tiempo real."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Espacios disponibles"
          value={`${stats.availableSpaces} / ${stats.totalSpaces}`}
          icon={<SpacesIcon />}
          tone="primary"
        />
        <StatCard
          title="Tickets activos"
          value={stats.activeTickets}
          icon={<TicketIcon />}
          tone="blue"
        />
        <StatCard
          title="Reservas en curso"
          value={stats.activeReservations}
          icon={<ReservationsIcon />}
          tone="yellow"
        />
        <StatCard
          title="Ingresos (pagados)"
          value={formatCurrency(stats.revenue)}
          icon={<RevenueIcon />}
          tone="green"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-semibold text-white">Últimos tickets</h3>
            <Link to="/admin/tickets" className="text-sm text-primary-400 hover:text-primary-300">
              Ver todos
            </Link>
          </div>
          {latestTickets.length === 0 ? (
            <EmptyState message="No hay tickets registrados." />
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Placa</th>
                    <th>Ingreso</th>
                    <th>Monto</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {latestTickets.map((t) => (
                    <tr key={t.idTicket}>
                      <td className="font-medium text-white">{t.plate}</td>
                      <td>{formatDateTime(t.entryDate)}</td>
                      <td>{formatCurrency(t.totalAmount)}</td>
                      <td>
                        <Badge value={t.state} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h3 className="font-semibold text-white">Últimas reservas</h3>
            <Link to="/admin/reservas" className="text-sm text-primary-400 hover:text-primary-300">
              Ver todas
            </Link>
          </div>
          {latestReservations.length === 0 ? (
            <EmptyState message="No hay reservas registradas." />
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th># Reserva</th>
                    <th>Espacio</th>
                    <th>Inicio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {latestReservations.map((r) => (
                    <tr key={r.idReserva}>
                      <td className="font-medium text-white">#{r.idReserva}</td>
                      <td>Espacio {r.idEspacio}</td>
                      <td>{formatDateTime(r.fechaHoraInicio)}</td>
                      <td>
                        <Badge value={r.estado} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Link to="/admin/vehiculos" className="card flex items-center gap-4 p-5 transition-colors hover:border-primary-500/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <SpacesIcon />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.totalVehicles}</p>
            <p className="text-sm text-neutral-400">Vehículos registrados</p>
          </div>
        </Link>
        <Link to="/admin/incidentes" className="card flex items-center gap-4 p-5 transition-colors hover:border-primary-500/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-danger-500/10 text-danger-500">
            <SpacesIcon />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.pendingIncidents}</p>
            <p className="text-sm text-neutral-400">Incidentes sin resolver</p>
          </div>
        </Link>
        <Link to="/admin/pagos" className="card flex items-center gap-4 p-5 transition-colors hover:border-primary-500/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-500/10 text-success-500">
            <RevenueIcon />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{formatCurrency(stats.revenue)}</p>
            <p className="text-sm text-neutral-400">Ingresos totales</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
