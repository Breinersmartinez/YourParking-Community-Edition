import { useEffect, useState, useCallback } from 'react';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { levels, zones } from '../services';

function LevelsZones() {
  const [levelRows, setLevelRows] = useState([]);
  const [zoneRows, setZoneRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [levelModal, setLevelModal] = useState(null);
  const [zoneModal, setZoneModal] = useState(null);
  const [form, setForm] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [l, z] = await Promise.all([
        levels.getAll(),
        zones.getAll().catch(() => []),
      ]);
      setLevelRows(l || []);
      setZoneRows(z || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Niveles
  const openLevel = (mode, row) => {
    setForm(
      mode === 'edit'
        ? { numeroPiso: row.numeroPiso, capacidadTotal: row.capacidadTotal, espaciosDisponibles: row.espaciosDisponibles }
        : { numeroPiso: '', capacidadTotal: '', espaciosDisponibles: '' }
    );
    setLevelModal({ mode, id: mode === 'edit' ? row.idPiso : null });
  };

  const submitLevel = async (e) => {
    e.preventDefault();
    const payload = {
      numeroPiso: Number(form.numeroPiso),
      capacidadTotal: Number(form.capacidadTotal),
      espaciosDisponibles: Number(form.espaciosDisponibles),
    };
    try {
      if (levelModal.mode === 'edit') await levels.update(levelModal.id, payload);
      else await levels.create(payload);
      setLevelModal(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const removeLevel = async (row) => {
    if (!window.confirm(`¿Eliminar el piso ${row.numeroPiso}?`)) return;
    try {
      await levels.remove(row.idPiso);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  // Zonas
  const openZone = (mode, row) => {
    setForm(
      mode === 'edit'
        ? { nombreZona: row.nombreZona, descripcion: row.descripcion, idPiso: row.idPiso }
        : { nombreZona: '', descripcion: '', idPiso: '' }
    );
    setZoneModal({ mode, id: mode === 'edit' ? row.idZona : null });
  };

  const submitZone = async (e) => {
    e.preventDefault();
    const payload = {
      nombreZona: form.nombreZona,
      descripcion: form.descripcion,
      idPiso: Number(form.idPiso),
    };
    try {
      if (zoneModal.mode === 'edit') await zones.update(zoneModal.id, payload);
      else await zones.create(payload);
      setZoneModal(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const levelNumber = (idPiso) => levelRows.find((l) => l.idPiso === idPiso)?.numeroPiso ?? idPiso;

  const levelColumns = [
    { key: 'numeroPiso', label: 'Piso', render: (r) => <span className="font-medium text-white">Piso {r.numeroPiso}</span> },
    { key: 'capacidadTotal', label: 'Capacidad total' },
    { key: 'espaciosDisponibles', label: 'Disponibles', render: (r) => <BadgeValue value={r.espaciosDisponibles} /> },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (r) => (
        <div className="flex gap-1">
          <button className="btn-outline btn-sm" onClick={() => openLevel('edit', r)}>Editar</button>
          <button className="btn-danger btn-sm" onClick={() => removeLevel(r)}>Eliminar</button>
        </div>
      ),
    },
  ];

  const zoneColumns = [
    { key: 'nombreZona', label: 'Zona', render: (r) => <span className="font-medium text-white">{r.nombreZona}</span> },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'idPiso', label: 'Piso', render: (r) => `Piso ${levelNumber(r.idPiso)}` },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (r) => (
        <div className="flex gap-1">
          <button className="btn-outline btn-sm" onClick={() => openZone('edit', r)}>Editar</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Niveles y Zonas"
        description="Organiza la estructura del parqueadero en pisos y zonas."
        actions={
          <>
            <button className="btn-outline" onClick={() => openZone('create')}>Nueva zona</button>
            <button className="btn-primary" onClick={() => openLevel('create')}>Nuevo piso</button>
          </>
        }
      />

      {error && <div className="mb-4 rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4"><p className="text-sm text-danger-500">{error}</p></div>}

      <div className="space-y-6">
        <DataTable loading={loading} columns={levelColumns} rows={levelRows}
          searchKeys={['numeroPiso']} placeholder="Buscar piso..." emptyMessage="No hay pisos registrados." />
        <DataTable loading={loading} columns={zoneColumns} rows={zoneRows}
          searchKeys={['nombreZona', 'descripcion']} placeholder="Buscar zona..." emptyMessage="No hay zonas registradas." />
      </div>

      {/* Modal Nivel */}
      <Modal title={levelModal?.mode === 'edit' ? 'Editar piso' : 'Nuevo piso'} open={!!levelModal}
        onClose={() => setLevelModal(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setLevelModal(null)}>Cancelar</button>
          <button className="btn-primary" type="button" onClick={submitLevel}>Guardar</button>
        </>}>
        <form onSubmit={submitLevel} className="space-y-4">
          <div><label className="label">N° Piso</label>
            <input name="numeroPiso" type="number" className="input" value={form.numeroPiso || ''} onChange={(e) => setForm({ ...form, numeroPiso: e.target.value })} required /></div>
          <div><label className="label">Capacidad total</label>
            <input name="capacidadTotal" type="number" className="input" value={form.capacidadTotal || ''} onChange={(e) => setForm({ ...form, capacidadTotal: e.target.value })} required /></div>
          <div><label className="label">Espacios disponibles</label>
            <input name="espaciosDisponibles" type="number" className="input" value={form.espaciosDisponibles ?? ''} onChange={(e) => setForm({ ...form, espaciosDisponibles: e.target.value })} required /></div>
        </form>
      </Modal>

      {/* Modal Zona */}
      <Modal title={zoneModal?.mode === 'edit' ? 'Editar zona' : 'Nueva zona'} open={!!zoneModal}
        onClose={() => setZoneModal(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setZoneModal(null)}>Cancelar</button>
          <button className="btn-primary" type="button" onClick={submitZone}>Guardar</button>
        </>}>
        <form onSubmit={submitZone} className="space-y-4">
          <div><label className="label">Nombre de zona</label>
            <input name="nombreZona" className="input" value={form.nombreZona || ''} onChange={(e) => setForm({ ...form, nombreZona: e.target.value })} required /></div>
          <div><label className="label">Descripción</label>
            <textarea name="descripcion" className="input" rows="2" value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} /></div>
          <div><label className="label">Piso</label>
            <select name="idPiso" className="select" value={form.idPiso || ''} onChange={(e) => setForm({ ...form, idPiso: e.target.value })} required>
              <option value="">Seleccionar</option>
              {levelRows.map((l) => <option key={l.idPiso} value={l.idPiso}>Piso {l.numeroPiso}</option>)}
            </select></div>
        </form>
      </Modal>
    </div>
  );
}

function BadgeValue({ value }) {
  return (
    <span className={value > 0 ? 'badge-green' : 'badge-red'}>
      {value}
    </span>
  );
}

export default LevelsZones;
