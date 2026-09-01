import { useEffect, useState, useCallback } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { reservations, spaces } from '../services';
import { formatCurrency, formatDateTime } from '../utils/format';

function ReservationsManagement() {
  const [rows, setRows] = useState([]);
  const [spacesList, setSpacesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [r, s] = await Promise.all([
        reservations.getAll(),
        spaces.getAll().catch(() => []),
      ]);
      setRows(r || []);
      setSpacesList(s || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setForm({
      idCard: '',
      idEspacio: '',
      fechaHoraInicio: '',
      fechaHoraFin: '',
      montoReserva: '',
    });
    setModal({ mode: 'create' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMsg('');
    try {
      await reservations.create({
        idCard: Number(form.idCard),
        idEspacio: Number(form.idEspacio),
        fechaHoraInicio: new Date(form.fechaHoraInicio).toISOString(),
        fechaHoraFin: new Date(form.fechaHoraFin).toISOString(),
        montoReserva: Number(form.montoReserva),
      });
      setMsg('Reserva creada correctamente.');
      setModal(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changeState = async (row, estado) => {
    if (!window.confirm(`¿Cambiar la reserva #${row.idReserva} a ${estado}?`)) return;
    setError('');
    try {
      await reservations.changeState(row.idReserva, estado);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`¿Eliminar la reserva #${row.idReserva}?`)) return;
    setError('');
    try {
      await reservations.remove(row.idReserva);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const spaceNum = (idEspacio) => spacesList.find((s) => s.idEspacio === idEspacio)?.numeroEspacio ?? idEspacio;

  const columns = [
    { key: 'idReserva', label: 'Reserva', render: (r) => <span className="font-medium text-white">#{r.idReserva}</span> },
    { key: 'idCard', label: 'Cliente (ID)' },
    { key: 'idEspacio', label: 'Espacio', render: (r) => `#${spaceNum(r.idEspacio)}` },
    { key: 'fechaHoraInicio', label: 'Inicio', render: (r) => formatDateTime(r.fechaHoraInicio) },
    { key: 'fechaHoraFin', label: 'Fin', render: (r) => formatDateTime(r.fechaHoraFin) },
    { key: 'montoReserva', label: 'Monto', render: (r) => formatCurrency(r.montoReserva) },
    { key: 'estado', label: 'Estado', render: (r) => <Badge value={r.estado} /> },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (r) => (
        <div className="flex gap-1">
          {['PENDIENTE', 'CONFIRMADA'].includes(r.estado) && (
            <button className="btn-success btn-sm" onClick={() => changeState(r, 'CUMPLIDA')}>Cumplir</button>
          )}
          {r.estado !== 'CANCELADA' && (
            <button className="btn-danger btn-sm" onClick={() => changeState(r, 'CANCELADA')}>Cancelar</button>
          )}
          <button className="btn-outline btn-sm" onClick={() => remove(r)}>Eliminar</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gestión de Reservas"
        description="Administra las reservas de espacios de los clientes."
        actions={<button className="btn-primary" onClick={openCreate}>Nueva reserva</button>}
      />

      {error && <div className="mb-4 rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4"><p className="text-sm text-danger-500">{error}</p></div>}
      {msg && <div className="mb-4 rounded-md border-l-4 border-success-500 bg-success-500/10 p-4"><p className="text-sm text-success-500">{msg}</p></div>}

      <DataTable loading={loading} columns={columns} rows={rows}
        searchKeys={['idReserva', 'idCard']} placeholder="Buscar por reserva o cliente..."
        emptyMessage="No hay reservas registradas." />

      <Modal title="Nueva reserva" open={!!modal} onClose={() => setModal(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
          <button className="btn-primary" disabled={saving} type="button" onClick={submit}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </>}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">ID del cliente</label>
              <input name="idCard" type="number" className="input" value={form.idCard || ''} onChange={handleChange} required /></div>
            <div><label className="label">Espacio</label>
              <select name="idEspacio" className="select" value={form.idEspacio || ''} onChange={handleChange} required>
                <option value="">Seleccionar</option>
                {spacesList.filter((s) => s.estado === 'DISPONIBLE').map((s) => (
                  <option key={s.idEspacio} value={s.idEspacio}>#{s.numeroEspacio}</option>
                ))}
              </select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Inicio</label>
              <input name="fechaHoraInicio" type="datetime-local" className="input" value={form.fechaHoraInicio || ''} onChange={handleChange} required /></div>
            <div><label className="label">Fin</label>
              <input name="fechaHoraFin" type="datetime-local" className="input" value={form.fechaHoraFin || ''} onChange={handleChange} required /></div>
          </div>
          <div><label className="label">Monto</label>
            <input name="montoReserva" type="number" step="0.01" className="input" value={form.montoReserva || ''} onChange={handleChange} required /></div>
        </form>
      </Modal>
    </div>
  );
}

export default ReservationsManagement;
