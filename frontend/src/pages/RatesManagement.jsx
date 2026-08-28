import { useEffect, useState, useCallback } from 'react';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { rates, ENUMS } from '../services';
import { formatCurrency } from '../utils/format';

function RatesManagement() {
  const [rows, setRows] = useState([]);
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
      setRows((await rates.getAll()) || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openModal = (mode, row) => {
    setForm(
      mode === 'edit'
        ? {
            tipoVehiculo: row.tipoVehiculo,
            precioHora: row.precioHora,
            precioFraccion: row.precioFraccion,
            precioDia: row.precioDia,
            precioMes: row.precioMes,
            precioAnio: row.precioAnio,
            fechaVigenciaInicio: row.fechaVigenciaInicio || '',
            fechaVigenciaFin: row.fechaVigenciaFin || '',
          }
        : {
            tipoVehiculo: 'AUTO',
            precioHora: '',
            precioFraccion: '',
            precioDia: '',
            precioMes: '',
            precioAnio: '',
            fechaVigenciaInicio: '',
            fechaVigenciaFin: '',
          }
    );
    setModal({ mode, id: mode === 'edit' ? row.idTarifa : null });
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMsg('');
    const payload = {
      tipoVehiculo: form.tipoVehiculo,
      precioHora: Number(form.precioHora),
      precioFraccion: Number(form.precioFraccion),
      precioDia: Number(form.precioDia),
      precioMes: Number(form.precioMes),
      precioAnio: Number(form.precioAnio),
      fechaVigenciaInicio: form.fechaVigenciaInicio ? new Date(form.fechaVigenciaInicio).toISOString().slice(0, 10) : null,
      fechaVigenciaFin: form.fechaVigenciaFin ? new Date(form.fechaVigenciaFin).toISOString().slice(0, 10) : null,
    };
    try {
      if (modal.mode === 'edit') await rates.update(modal.id, payload);
      else await rates.create(payload);
      setMsg('Tarifa guardada correctamente.');
      setModal(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`¿Eliminar la tarifa ${row.tipoVehiculo}?`)) return;
    try {
      await rates.remove(row.idTarifa);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: 'tipoVehiculo', label: 'Tipo', render: (r) => <span className="font-medium text-white">{r.tipoVehiculo}</span> },
    { key: 'precioHora', label: 'Hora', render: (r) => formatCurrency(r.precioHora) },
    { key: 'precioFraccion', label: 'Fracción', render: (r) => formatCurrency(r.precioFraccion) },
    { key: 'precioDia', label: 'Día', render: (r) => formatCurrency(r.precioDia) },
    { key: 'precioMes', label: 'Mes', render: (r) => formatCurrency(r.precioMes) },
    { key: 'precioAnio', label: 'Año', render: (r) => formatCurrency(r.precioAnio) },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (r) => (
        <div className="flex gap-1">
          <button className="btn-outline btn-sm" onClick={() => openModal('edit', r)}>Editar</button>
          <button className="btn-danger btn-sm" onClick={() => remove(r)}>Eliminar</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tarifas"
        description="Configura las tarifas por tipo de vehículo del parqueadero."
        actions={<button className="btn-primary" onClick={() => openModal('create')}>Nueva tarifa</button>}
      />

      {error && <div className="mb-4 rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4"><p className="text-sm text-danger-500">{error}</p></div>}
      {msg && <div className="mb-4 rounded-md border-l-4 border-success-500 bg-success-500/10 p-4"><p className="text-sm text-success-500">{msg}</p></div>}

      <DataTable loading={loading} columns={columns} rows={rows}
        searchKeys={['tipoVehiculo']} placeholder="Buscar por tipo de vehículo..."
        emptyMessage="No hay tarifas configuradas." />

      <Modal title={modal?.mode === 'edit' ? 'Editar tarifa' : 'Nueva tarifa'} open={!!modal} onClose={() => setModal(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
          <button className="btn-primary" disabled={saving} type="button" onClick={submit}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </>}>
        <form onSubmit={submit} className="space-y-4">
          <div><label className="label">Tipo de vehículo</label>
            <select name="tipoVehiculo" className="select" value={form.tipoVehiculo || ''} onChange={handleChange} required>
              {ENUMS.VehicleType.map((t) => <option key={t} value={t}>{t}</option>)}
            </select></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Precio hora</label>
              <input name="precioHora" type="number" step="0.01" className="input" value={form.precioHora || ''} onChange={handleChange} required /></div>
            <div><label className="label">Precio fracción</label>
              <input name="precioFraccion" type="number" step="0.01" className="input" value={form.precioFraccion || ''} onChange={handleChange} required /></div>
            <div><label className="label">Precio día</label>
              <input name="precioDia" type="number" step="0.01" className="input" value={form.precioDia || ''} onChange={handleChange} required /></div>
            <div><label className="label">Precio mes</label>
              <input name="precioMes" type="number" step="0.01" className="input" value={form.precioMes || ''} onChange={handleChange} required /></div>
            <div><label className="label">Precio año</label>
              <input name="precioAnio" type="number" step="0.01" className="input" value={form.precioAnio || ''} onChange={handleChange} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Vigencia inicio</label>
              <input name="fechaVigenciaInicio" type="date" className="input" value={form.fechaVigenciaInicio || ''} onChange={handleChange} /></div>
            <div><label className="label">Vigencia fin</label>
              <input name="fechaVigenciaFin" type="date" className="input" value={form.fechaVigenciaFin || ''} onChange={handleChange} /></div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default RatesManagement;
