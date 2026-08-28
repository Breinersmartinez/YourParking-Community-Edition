import { useEffect, useState, useCallback } from 'react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Spinner from '../components/ui/Spinner';
import { vehicles, reservations, subscriptions, spaces, rates, ENUMS } from '../services';
import AuthService from '../services/AuthService';
import { formatCurrency, formatDateTime, formatDate } from '../utils/format';

const TABS = ['Mis Vehículos', 'Mis Reservas', 'Mis Suscripciones'];

function ClientDashboard() {
  const idCard = AuthService.getUserIdCard();
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const [myVehicles, setMyVehicles] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [mySubscriptions, setMySubscriptions] = useState([]);
  const [spaceOptions, setSpaceOptions] = useState([]);
  const [rateOptions, setRateOptions] = useState([]);

  const [reserveModal, setReserveModal] = useState(false);
  const [reserveForm, setReserveForm] = useState({ idEspacio: '', fechaHoraInicio: '', fechaHoraFin: '' });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [v, r, s, sp, rt] = await Promise.all([
        vehicles.getByOwner(idCard),
        reservations.getByUser(idCard),
        subscriptions.getByUser(idCard).catch(() => []),
        spaces.getAll().catch(() => []),
        rates.getAll().catch(() => []),
      ]);
      setMyVehicles(v || []);
      setMyReservations(r || []);
      setMySubscriptions(s || []);
      setSpaceOptions((sp || []).filter((x) => x.estado === 'DISPONIBLE'));
      setRateOptions(rt || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [idCard]);

  useEffect(() => {
    if (idCard) load();
  }, [idCard, load]);

  const registerVehicle = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    setError('');
    try {
      await vehicles.create({
        plate: fd.get('plate'),
        typeVehicle: fd.get('typeVehicle'),
        brandVehicle: fd.get('brandVehicle'),
        colorVehicle: fd.get('colorVehicle'),
        propertyCard: fd.get('propertyCard') || null,
        entryDate: null,
        departureDate: null,
        ownerIdCard: idCard,
      });
      setMsg('Vehículo registrado.');
      e.target.reset();
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const submitReservation = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await reservations.create({
        idCard,
        idEspacio: Number(reserveForm.idEspacio),
        fechaHoraInicio: new Date(reserveForm.fechaHoraInicio).toISOString(),
        fechaHoraFin: new Date(reserveForm.fechaHoraFin).toISOString(),
        montoReserva: Number(reserveForm.monto || 0),
      });
      setMsg('Reserva creada.');
      setReserveModal(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const cancelReservation = async (r) => {
    if (!window.confirm(`¿Cancelar la reserva #${r.idReserva}?`)) return;
    setError('');
    try {
      await reservations.changeState(r.idReserva, 'CANCELADA');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  if (!idCard) {
    return (
      <div className="card p-8 text-center">
        <p className="text-neutral-400">No se pudo identificar su cuenta. Vuelva a iniciar sesión.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Hola, {AuthService.getFirstName()} 👋
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Administra tus vehículos, reservas y suscripciones desde aquí.
        </p>
      </div>

      {error && <div className="mb-4 rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4"><p className="text-sm text-danger-500">{error}</p></div>}
      {msg && <div className="mb-4 rounded-md border-l-4 border-success-500 bg-success-500/10 p-4"><p className="text-sm text-success-500">{msg}</p></div>}

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={i === tab ? 'btn-primary' : 'btn-ghost'}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <>
          {tab === 0 && (
            <VehicleTab vehicles={myVehicles} onRegister={registerVehicle} vehicleTypes={ENUMS.VehicleType} />
          )}
          {tab === 1 && (
            <ReservationTab
              reservations={myReservations}
              onOpenReserve={() => setReserveModal(true)}
              onCancel={cancelReservation}
            />
          )}
          {tab === 2 && <SubscriptionTab subscriptions={mySubscriptions} />}
        </>
      )}

      <Modal title="Reservar espacio" open={reserveModal} onClose={() => setReserveModal(false)}
        footer={<>
          <button className="btn-ghost" onClick={() => setReserveModal(false)}>Cancelar</button>
          <button className="btn-primary" disabled={saving} type="button" onClick={submitReservation}>
            {saving ? 'Reservando...' : 'Confirmar reserva'}
          </button>
        </>}>
        <form onSubmit={submitReservation} className="space-y-4">
          <div><label className="label">Espacio disponible</label>
            <select className="select" value={reserveForm.idEspacio}
              onChange={(e) => setReserveForm({ ...reserveForm, idEspacio: e.target.value })} required>
              <option value="">Seleccionar</option>
              {spaceOptions.map((s) => <option key={s.idEspacio} value={s.idEspacio}>#{s.numeroEspacio}</option>)}
            </select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Inicio</label>
              <input type="datetime-local" className="input" value={reserveForm.fechaHoraInicio}
                onChange={(e) => setReserveForm({ ...reserveForm, fechaHoraInicio: e.target.value })} required /></div>
            <div><label className="label">Fin</label>
              <input type="datetime-local" className="input" value={reserveForm.fechaHoraFin}
                onChange={(e) => setReserveForm({ ...reserveForm, fechaHoraFin: e.target.value })} required /></div>
          </div>
          <div><label className="label">Tipo de vehículo (para tarifa)</label>
            <select className="select" value={reserveForm.type}
              onChange={(e) => setReserveForm({ ...reserveForm, type: e.target.value })}>
              {rateOptions.length ? rateOptions.map((r) => (
                <option key={r.idTarifa} value={r.tipoVehiculo}>{r.tipoVehiculo} · {formatCurrency(r.precioHora)}/hora</option>
              )) : <option>Sin tarifas</option>}
            </select></div>
        </form>
      </Modal>
    </div>
  );
}

function VehicleTab({ vehicles: list, onRegister, vehicleTypes }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="card overflow-hidden">
          <div className="card-header"><h3 className="font-semibold text-white">Mis vehículos</h3></div>
          {list.length === 0 ? (
            <div className="p-8 text-center text-neutral-500">Aún no tienes vehículos registrados.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead><tr><th>Placa</th><th>Tipo</th><th>Marca</th><th>Color</th></tr></thead>
                <tbody>
                  {list.map((v) => (
                    <tr key={v.plate}>
                      <td className="font-medium text-white">{v.plate}</td>
                      <td><Badge value={v.typeVehicle} /></td>
                      <td>{v.brandVehicle || '—'}</td>
                      <td>{v.colorVehicle || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="mb-4 font-semibold text-white">Registrar vehículo</h3>
        <form onSubmit={onRegister} className="space-y-3">
          <input name="plate" className="input uppercase" placeholder="Placa" required />
          <select name="typeVehicle" className="select" defaultValue="AUTO">
            {vehicleTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input name="brandVehicle" className="input" placeholder="Marca" />
          <input name="colorVehicle" className="input" placeholder="Color" />
          <input name="propertyCard" className="input" placeholder="Tarjeta de propiedad" />
          <button className="btn-primary w-full">Registrar</button>
        </form>
      </div>
    </div>
  );
}

function ReservationTab({ reservations: list, onOpenReserve, onCancel }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="grid grid-cols-2 gap-4 sm:flex">
          <div className="card px-4 py-2 text-sm"><span className="text-neutral-400">Ocupado: </span><span className="text-danger-500">{list.filter((r) => ['PENDIENTE', 'CONFIRMADA'].includes(r.estado)).length}</span></div>
          <div className="card px-4 py-2 text-sm"><span className="text-neutral-400">Total: </span><span className="text-white">{list.length}</span></div>
        </div>
        <button className="btn-primary" onClick={onOpenReserve}>Nueva reserva</button>
      </div>

      <div className="card overflow-hidden">
        {list.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">No tienes reservas.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead><tr><th>#</th><th>Espacio</th><th>Inicio</th><th>Fin</th><th>Monto</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.idReserva}>
                    <td className="font-medium text-white">#{r.idReserva}</td>
                    <td>#{r.idEspacio}</td>
                    <td>{formatDateTime(r.fechaHoraInicio)}</td>
                    <td>{formatDateTime(r.fechaHoraFin)}</td>
                    <td>{formatCurrency(r.montoReserva)}</td>
                    <td><Badge value={r.estado} /></td>
                    <td>{['PENDIENTE', 'CONFIRMADA'].includes(r.estado) && (
                      <button className="btn-danger btn-sm" onClick={() => onCancel(r)}>Cancelar</button>
                    )}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SubscriptionTab({ subscriptions: list }) {
  return (
    <div className="card overflow-hidden">
      <div className="card-header"><h3 className="font-semibold text-white">Mis suscripciones</h3></div>
      {list.length === 0 ? (
        <div className="p-8 text-center text-neutral-500">No tienes suscripciones activas.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead><tr><th>#</th><th>Placa</th><th>Tipo</th><th>Inicio</th><th>Fin</th><th>Monto</th><th>Estado</th></tr></thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.idAbono}>
                  <td className="font-medium text-white">#{s.idAbono}</td>
                  <td>{s.plate}</td>
                  <td><Badge value={s.tipoAbono} /></td>
                  <td>{formatDate(s.fechaInicio)}</td>
                  <td>{formatDate(s.fechaFin)}</td>
                  <td>{formatCurrency(s.monto)}</td>
                  <td><Badge value={s.estado} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ClientDashboard;
