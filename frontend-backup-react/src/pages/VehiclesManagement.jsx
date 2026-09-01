import { useEffect, useState, useCallback } from 'react';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { vehicles, ENUMS } from '../services';
import { formatDateTime } from '../utils/format';

function VehiclesManagement() {
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
      setRows((await vehicles.getAll()) || []);
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
      plate: '',
      typeVehicle: 'AUTO',
      brandVehicle: '',
      colorVehicle: '',
      propertyCard: '',
      entryDate: '',
      departureDate: '',
      ownerIdCard: '',
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
    const payload = {
      plate: form.plate,
      typeVehicle: form.typeVehicle,
      brandVehicle: form.brandVehicle,
      colorVehicle: form.colorVehicle,
      propertyCard: form.propertyCard,
      entryDate: form.entryDate ? new Date(form.entryDate).toISOString() : null,
      departureDate: form.departureDate ? new Date(form.departureDate).toISOString() : null,
      ownerIdCard: form.ownerIdCard ? Number(form.ownerIdCard) : null,
    };
    try {
      await vehicles.create(payload);
      setMsg('Vehículo registrado correctamente.');
      setModal(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`¿Eliminar el vehículo ${row.plate}?`)) return;
    try {
      await vehicles.remove(row.plate);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: 'plate', label: 'Placa', render: (r) => <span className="font-medium text-white">{r.plate}</span> },
    { key: 'typeVehicle', label: 'Tipo', render: (r) => <BadgeType value={r.typeVehicle} /> },
    { key: 'brandVehicle', label: 'Marca' },
    { key: 'colorVehicle', label: 'Color' },
    { key: 'ownerIdCard', label: 'Propietario (ID)' },
    { key: 'entryDate', label: 'Ingreso', render: (r) => formatDateTime(r.entryDate) },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (r) => <button className="btn-danger btn-sm" onClick={() => remove(r)}>Eliminar</button>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gestión de Vehículos"
        description="Registra y administra los vehículos del parqueadero."
        actions={<button className="btn-primary" onClick={openCreate}>Registrar vehículo</button>}
      />

      {error && <div className="mb-4 rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4"><p className="text-sm text-danger-500">{error}</p></div>}
      {msg && <div className="mb-4 rounded-md border-l-4 border-success-500 bg-success-500/10 p-4"><p className="text-sm text-success-500">{msg}</p></div>}

      <DataTable loading={loading} columns={columns} rows={rows}
        searchKeys={['plate', 'brandVehicle', 'colorVehicle']} placeholder="Buscar por placa, marca o color..."
        emptyMessage="No hay vehículos registrados." />

      <Modal title="Registrar vehículo" open={!!modal} onClose={() => setModal(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
          <button className="btn-primary" disabled={saving} type="button" onClick={submit}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </>}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Placa</label>
              <input name="plate" className="input uppercase" value={form.plate || ''} onChange={handleChange} required /></div>
            <div><label className="label">Tipo</label>
              <select name="typeVehicle" className="select" value={form.typeVehicle || 'AUTO'} onChange={handleChange}>
                {ENUMS.VehicleType.map((t) => <option key={t} value={t}>{t}</option>)}
              </select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Marca</label>
              <input name="brandVehicle" className="input" value={form.brandVehicle || ''} onChange={handleChange} /></div>
            <div><label className="label">Color</label>
              <input name="colorVehicle" className="input" value={form.colorVehicle || ''} onChange={handleChange} /></div>
          </div>
          <div><label className="label">Tarjeta de propiedad</label>
            <input name="propertyCard" className="input" value={form.propertyCard || ''} onChange={handleChange} /></div>
          <div><label className="label">ID del propietario</label>
            <input name="ownerIdCard" type="number" className="input" value={form.ownerIdCard || ''} onChange={handleChange} placeholder="Cédula del cliente" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Ingreso</label>
              <input name="entryDate" type="datetime-local" className="input" value={form.entryDate || ''} onChange={handleChange} /></div>
            <div><label className="label">Salida</label>
              <input name="departureDate" type="datetime-local" className="input" value={form.departureDate || ''} onChange={handleChange} /></div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function BadgeType({ value }) {
  return <span className={value === 'MOTO' ? 'badge-yellow' : 'badge-blue'}>{value}</span>;
}

export default VehiclesManagement;
