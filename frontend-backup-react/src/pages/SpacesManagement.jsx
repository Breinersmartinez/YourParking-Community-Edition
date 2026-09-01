import { useEffect, useState, useCallback } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { spaces, levels, zones, ENUMS } from '../services';

const EMPTY = {
  numeroEspacio: '',
  estado: 'DISPONIBLE',
  tipoEspacio: 'ESTANDAR',
  dimensiones: '',
  idPiso: '',
  idZona: '',
};

function SpacesManagement() {
  const [rows, setRows] = useState([]);
  const [levelsList, setLevelsList] = useState([]);
  const [zonesList, setZonesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [modal, setModal] = useState(null); // { mode: 'create'|'edit', data }
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [s, l, z] = await Promise.all([
        spaces.getAll(),
        levels.getAll().catch(() => []),
        zones.getAll().catch(() => []),
      ]);
      setRows(s || []);
      setLevelsList(l || []);
      setZonesList(z || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const levelNumber = (idPiso) =>
    levelsList.find((l) => l.idPiso === idPiso)?.numeroPiso ?? idPiso;
  const zoneName = (idZona) =>
    zonesList.find((z) => z.idZona === idZona)?.nombreZona ?? idZona;

  const openCreate = () => {
    setForm(EMPTY);
    setModal({ mode: 'create' });
  };

  const openEdit = (row) => {
    setForm({
      numeroEspacio: row.numeroEspacio,
      estado: row.estado,
      tipoEspacio: row.tipoEspacio,
      dimensiones: row.dimensiones || '',
      idPiso: row.idPiso,
      idZona: row.idZona,
    });
    setModal({ mode: 'edit', id: row.idEspacio });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMsg('');
    const payload = {
      numeroEspacio: Number(form.numeroEspacio),
      estado: form.estado,
      tipoEspacio: form.tipoEspacio,
      dimensiones: form.dimensiones,
      idPiso: Number(form.idPiso),
      idZona: form.idZona ? Number(form.idZona) : null,
    };
    try {
      if (modal.mode === 'edit') {
        await spaces.update(modal.id, payload);
        setMsg('Espacio actualizado correctamente.');
      } else {
        await spaces.create(payload);
        setMsg('Espacio creado correctamente.');
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const changeState = async (row, estado) => {
    if (!window.confirm(`¿Cambiar el estado del espacio ${row.numeroEspacio} a ${estado}?`)) return;
    try {
      await spaces.changeState(row.idEspacio, estado);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`¿Eliminar el espacio ${row.numeroEspacio}?`)) return;
    try {
      await spaces.remove(row.idEspacio);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: 'numeroEspacio', label: 'N° Espacio', render: (r) => <span className="font-medium text-white">{r.numeroEspacio}</span> },
    { key: 'estado', label: 'Estado', render: (r) => <Badge value={r.estado} /> },
    { key: 'tipoEspacio', label: 'Tipo', render: (r) => <Badge value={r.tipoEspacio} /> },
    { key: 'dimensiones', label: 'Dimensiones' },
    { key: 'idPiso', label: 'Piso', render: (r) => `Piso ${levelNumber(r.idPiso)}` },
    { key: 'idZona', label: 'Zona', render: (r) => zoneName(r.idZona) },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          <button className="btn-outline btn-sm" onClick={() => openEdit(r)}>Editar</button>
          <button className="btn-danger btn-sm" onClick={() => remove(r)}>Eliminar</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gestión de Espacios"
        description="Administra la disponibilidad y configuración de los espacios del parqueadero."
        actions={<button className="btn-primary" onClick={openCreate}>Nuevo espacio</button>}
      />

      {error && <div className="mb-4 rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4"><p className="text-sm text-danger-500">{error}</p></div>}
      {msg && <div className="mb-4 rounded-md border-l-4 border-success-500 bg-success-500/10 p-4"><p className="text-sm text-success-500">{msg}</p></div>}

      <DataTable
        loading={loading}
        columns={columns}
        rows={rows}
        searchKeys={['numeroEspacio', 'dimensiones']}
        placeholder="Buscar por número o dimensiones..."
        emptyMessage="No hay espacios registrados."
      />

      <div className="mt-6">
        <h3 className="mb-3 font-semibold text-white">Cambio rápido de estado</h3>
        <div className="card overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Espacio</th>
                {ENUMS.SpaceState.map((s) => (
                  <th key={s}>{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 15).map((r) => (
                <tr key={r.idEspacio}>
                  <td className="font-medium text-white">#{r.numeroEspacio}</td>
                  {ENUMS.SpaceState.map((s) => (
                    <td key={s}>
                      <button
                        className={`btn-sm ${r.estado === s ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => r.estado !== s && changeState(r, s)}
                      >
                        {s}
                      </button>
                    </td>
                  ))}
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-neutral-500">Sin espacios.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        title={modal?.mode === 'edit' ? 'Editar espacio' : 'Nuevo espacio'}
        open={!!modal}
        onClose={() => setModal(null)}
        footer={
          <>
            <button className="btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn-primary" disabled={saving} onClick={handleSubmit} type="button">
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">N° Espacio</label>
              <input name="numeroEspacio" type="number" className="input" value={form.numeroEspacio}
                onChange={handleChange} required />
            </div>
            <div>
              <label className="label">Tipo</label>
              <select name="tipoEspacio" className="select" value={form.tipoEspacio} onChange={handleChange}>
                {ENUMS.SpaceType.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Estado</label>
            <select name="estado" className="select" value={form.estado} onChange={handleChange}>
              {ENUMS.SpaceState.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Dimensiones</label>
            <input name="dimensiones" className="input" value={form.dimensiones} onChange={handleChange}
              placeholder="Ej: 2.5m x 5m" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Piso</label>
              <select name="idPiso" className="select" value={form.idPiso} onChange={handleChange} required>
                <option value="">Seleccionar</option>
                {levelsList.map((l) => <option key={l.idPiso} value={l.idPiso}>Piso {l.numeroPiso}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Zona</label>
              <select name="idZona" className="select" value={form.idZona} onChange={handleChange}>
                <option value="">Sin zona</option>
                {zonesList.map((z) => <option key={z.idZona} value={z.idZona}>{z.nombreZona}</option>)}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default SpacesManagement;
