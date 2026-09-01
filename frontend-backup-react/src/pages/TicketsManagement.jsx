import { useEffect, useState, useCallback } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { tickets, spaces, vehicles } from '../services';
import { formatCurrency, formatDateTime, formatDuration } from '../utils/format';

function TicketsManagement() {
  const [rows, setRows] = useState([]);
  const [spacesList, setSpacesList] = useState([]);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [entryModal, setEntryModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [entryForm, setEntryForm] = useState({
    plate: '',
    idEspacio: '',
    entryDate: '',
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [t, s, v] = await Promise.all([
        tickets.getAll(),
        spaces.getAll().catch(() => []),
        vehicles.getAll().catch(() => []),
      ]);
      setRows(t || []);
      setSpacesList(s || []);
      setVehiclesList(v || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const availableSpaces = spacesList.filter((s) => s.estado === 'DISPONIBLE');

  const openEntry = () => {
    setEntryForm({
      plate: '',
      idEspacio: availableSpaces[0]?.idEspacio ?? '',
      entryDate: new Date().toISOString().slice(0, 16),
    });
    setEntryModal(true);
  };

  const submitEntry = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMsg('');
    try {
      await tickets.createEntry({
        plate: entryForm.plate,
        idEspacio: Number(entryForm.idEspacio),
        entryDate: new Date(entryForm.entryDate).toISOString(),
      });
      setMsg('Ingreso registrado correctamente.');
      setEntryModal(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const closeTicket = async (row) => {
    if (!window.confirm(`¿Registrar la salida del ticket #${row.idTicket}?`)) return;
    setError('');
    try {
      await tickets.close(row.idTicket);
      setMsg('Salida registrada. Monto calculado por el sistema.');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const cancelTicket = async (row) => {
    if (!window.confirm(`¿Cancelar el ticket #${row.idTicket}?`)) return;
    setError('');
    try {
      await tickets.cancel(row.idTicket);
      setMsg('Ticket cancelado.');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const spaceNum = (idEspacio) => spacesList.find((s) => s.idEspacio === idEspacio)?.numeroEspacio ?? idEspacio;

  const columns = [
    { key: 'idTicket', label: 'Ticket', render: (r) => <span className="font-medium text-white">#{r.idTicket}</span> },
    { key: 'plate', label: 'Placa' },
    { key: 'idEspacio', label: 'Espacio', render: (r) => `#${spaceNum(r.idEspacio)}` },
    { key: 'entryDate', label: 'Ingreso', render: (r) => formatDateTime(r.entryDate) },
    { key: 'exitDate', label: 'Salida', render: (r) => (r.exitDate ? formatDateTime(r.exitDate) : '—') },
    { key: 'totalMinutes', label: 'Duración', render: (r) => formatDuration(r.totalMinutes) },
    { key: 'totalAmount', label: 'Monto', render: (r) => formatCurrency(r.totalAmount) },
    { key: 'state', label: 'Estado', render: (r) => <Badge value={r.state} /> },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (r) => (
        <div className="flex gap-1">
          {r.state === 'ACTIVO' && (
            <>
              <button className="btn-success btn-sm" onClick={() => closeTicket(r)}>Salida</button>
              <button className="btn-danger btn-sm" onClick={() => cancelTicket(r)}>Cancelar</button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tickets de Ingreso/Salida"
        description="Controla las entradas y salidas de vehículos."
        actions={<button className="btn-primary" onClick={openEntry}>Registrar ingreso</button>}
      />

      {error && <div className="mb-4 rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4"><p className="text-sm text-danger-500">{error}</p></div>}
      {msg && <div className="mb-4 rounded-md border-l-4 border-success-500 bg-success-500/10 p-4"><p className="text-sm text-success-500">{msg}</p></div>}

      <DataTable loading={loading} columns={columns} rows={rows}
        searchKeys={['plate', 'idTicket']} placeholder="Buscar por ticket o placa..."
        emptyMessage="No hay tickets registrados." />

      <Modal title="Registrar ingreso" open={entryModal} onClose={() => setEntryModal(false)}
        footer={<>
          <button className="btn-ghost" onClick={() => setEntryModal(false)}>Cancelar</button>
          <button className="btn-primary" disabled={saving} type="button" onClick={submitEntry}>{saving ? 'Registrando...' : 'Registrar entrada'}</button>
        </>}>
        <form onSubmit={submitEntry} className="space-y-4">
          <div>
            <label className="label">Placa</label>
            <input list="vehiculos" name="plate" className="input uppercase" value={entryForm.plate}
              onChange={(e) => setEntryForm({ ...entryForm, plate: e.target.value })} placeholder="ABC-123" required />
            <datalist id="vehiculos">
              {vehiclesList.map((v) => <option key={v.plate} value={v.plate} />)}
            </datalist>
          </div>
          <div>
            <label className="label">Espacio disponible</label>
            <select name="idEspacio" className="select" value={entryForm.idEspacio}
              onChange={(e) => setEntryForm({ ...entryForm, idEspacio: e.target.value })} required>
              {availableSpaces.length === 0 && <option value="">Sin espacios disponibles</option>}
              {availableSpaces.map((s) => (
                <option key={s.idEspacio} value={s.idEspacio}>#{s.numeroEspacio} (Piso {s.idPiso})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Fecha y hora de ingreso</label>
            <input name="entryDate" type="datetime-local" className="input" value={entryForm.entryDate}
              onChange={(e) => setEntryForm({ ...entryForm, entryDate: e.target.value })} required />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default TicketsManagement;
