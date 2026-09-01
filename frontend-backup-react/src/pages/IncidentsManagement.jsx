import { useEffect, useState, useCallback } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { incidents, tickets, ENUMS } from '../services';
import { formatDateTime } from '../utils/format';

function IncidentsManagement() {
  const [rows, setRows] = useState([]);
  const [ticketsList, setTicketsList] = useState([]);
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
      const [i, t] = await Promise.all([
        incidents.getAll(),
        tickets.getAll().catch(() => []),
      ]);
      setRows(i || []);
      setTicketsList(t || []);
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
    setForm({ idEspacio: '', plate: '', fechaHora: new Date().toISOString().slice(0, 16), tipoIncidente: 'OTRO', descripcion: '' });
    setModal({ mode: 'create' });
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMsg('');
    try {
      await incidents.create({
        idEspacio: form.idEspacio ? Number(form.idEspacio) : null,
        plate: form.plate,
        fechaHora: new Date(form.fechaHora).toISOString(),
        tipoIncidente: form.tipoIncidente,
        descripcion: form.descripcion,
      });
      setMsg('Incidente reportado correctamente.');
      setModal(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changeState = async (row, estado) => {
    if (!window.confirm(`¿Cambiar el incidente #${row.idIncidente} a ${estado}?`)) return;
    try {
      await incidents.changeState(row.idIncidente, estado);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`¿Eliminar el incidente #${row.idIncidente}?`)) return;
    try {
      await incidents.remove(row.idIncidente);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: 'idIncidente', label: 'Incidente', render: (r) => <span className="font-medium text-white">#{r.idIncidente}</span> },
    { key: 'plate', label: 'Placa' },
    { key: 'idEspacio', label: 'Espacio', render: (r) => (r.idEspacio ? `#${r.idEspacio}` : '—') },
    { key: 'tipoIncidente', label: 'Tipo', render: (r) => <Badge value={r.tipoIncidente} /> },
    { key: 'fechaHora', label: 'Fecha', render: (r) => formatDateTime(r.fechaHora) },
    { key: 'descripcion', label: 'Descripción', className: 'max-w-xs truncate' },
    { key: 'estado', label: 'Estado', render: (r) => <Badge value={r.estado} /> },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (r) => (
        <div className="flex gap-1">
          {r.estado === 'REPORTADO' && <button className="btn-blue btn-sm" onClick={() => changeState(r, 'EN_PROCESO')}>En proceso</button>}
          {r.estado !== 'RESUELTO' && <button className="btn-success btn-sm" onClick={() => changeState(r, 'RESUELTO')}>Resolver</button>}
          <button className="btn-danger btn-sm" onClick={() => remove(r)}>Eliminar</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gestión de Incidentes"
        description="Reporta y da seguimiento a los incidentes del parqueadero."
        actions={<button className="btn-primary" onClick={openCreate}>Reportar incidente</button>}
      />

      {error && <div className="mb-4 rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4"><p className="text-sm text-danger-500">{error}</p></div>}
      {msg && <div className="mb-4 rounded-md border-l-4 border-success-500 bg-success-500/10 p-4"><p className="text-sm text-success-500">{msg}</p></div>}

      <DataTable loading={loading} columns={columns} rows={rows}
        searchKeys={['plate', 'descripcion']} placeholder="Buscar por placa o descripción..."
        emptyMessage="No hay incidentes registrados." />

      <Modal title="Reportar incidente" open={!!modal} onClose={() => setModal(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
          <button className="btn-primary" disabled={saving} type="button" onClick={submit}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </>}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Placa</label>
              <input list="placas" name="plate" className="input uppercase" value={form.plate || ''} onChange={handleChange} placeholder="ABC-123" required />
              <datalist id="placas">{ticketsList.map((t) => <option key={t.idTicket} value={t.plate} />)}</datalist></div>
            <div><label className="label">Tipo</label>
              <select name="tipoIncidente" className="select" value={form.tipoIncidente || 'OTRO'} onChange={handleChange}>
                {ENUMS.IncidentType.map((t) => <option key={t} value={t}>{t}</option>)}
              </select></div>
          </div>
          <div><label className="label">Espacio</label>
            <input name="idEspacio" type="number" className="input" value={form.idEspacio || ''} onChange={handleChange} placeholder="Opcional" /></div>
          <div><label className="label">Fecha y hora</label>
            <input name="fechaHora" type="datetime-local" className="input" value={form.fechaHora || ''} onChange={handleChange} required /></div>
          <div><label className="label">Descripción</label>
            <textarea name="descripcion" rows="3" className="input" value={form.descripcion || ''} onChange={handleChange} required /></div>
        </form>
      </Modal>
    </div>
  );
}

export default IncidentsManagement;
