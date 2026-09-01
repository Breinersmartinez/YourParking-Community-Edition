import { useEffect, useState, useCallback } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { users, ENUMS } from '../services';
import { formatDate } from '../utils/format';

const EMPTY = {
  idCard: '',
  identificationType: 'CC',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phoneNumber: '',
  direction: '',
  role: 'ADMIN',
  active: true,
};

function UsersManagement() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setRows((await users.getAll()) || []);
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
    setForm({ ...EMPTY });
    setModal({ mode: 'create' });
  };

  const openEdit = (row) => {
    setForm({
      idCard: row.idCard,
      identificationType: row.identificationType,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      password: '',
      phoneNumber: row.phoneNumber,
      direction: row.direction,
      role: row.role,
      active: row.active,
    });
    setModal({ mode: 'edit', id: row.idCard });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!modal?.mode) return;
    setSaving(true);
    setError('');
    setMsg('');

    const idCard = Number(form.idCard);
    const base = {
      idCard,
      identificationType: form.identificationType,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phoneNumber: form.phoneNumber,
      direction: form.direction,
      role: form.role,
      active: form.active === '' ? true : Boolean(Number(form.active)),
    };

    try {
      if (modal.mode === 'edit') {
        const payload = { ...base };
        if (form.password) payload.password = form.password;
        await users.update(modal.id, payload);
        setMsg('Usuario actualizado correctamente.');
      } else {
        await users.update(idCard, { ...base, password: form.password });
        setMsg('Usuario creado correctamente.');
      }
      setModal(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (row) => {
    try {
      if (row.active) await users.deactivate(row.idCard);
      else await users.activate(row.idCard);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`¿Eliminar al usuario ${row.firstName} ${row.lastName}?`)) return;
    try {
      await users.remove(row.idCard);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: 'idCard', label: 'ID', render: (r) => <span className="font-medium text-white">{r.idCard}</span> },
    { key: 'firstName', label: 'Nombre', render: (r) => `${r.firstName} ${r.lastName}` },
    { key: 'email', label: 'Correo' },
    { key: 'role', label: 'Rol', render: (r) => <Badge value={r.role} /> },
    { key: 'active', label: 'Estado', render: (r) => <Badge value={r.active} /> },
    { key: 'registrationDate', label: 'Registro', render: (r) => formatDate(r.registrationDate) },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (r) => (
        <div className="flex gap-1">
          <button className="btn-outline btn-sm" onClick={() => openEdit(r)}>Editar</button>
          <button className={r.active ? 'btn-blue btn-sm' : 'btn-success btn-sm'} onClick={() => toggleActive(r)}>
            {r.active ? 'Desactivar' : 'Activar'}
          </button>
          <button className="btn-danger btn-sm" onClick={() => remove(r)}>Eliminar</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gestión de Usuarios"
        description="Administra los usuarios y sus roles en el sistema."
        actions={<button className="btn-primary" onClick={openCreate}>Nuevo usuario</button>}
      />

      {error && <div className="mb-4 rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4"><p className="text-sm text-danger-500">{error}</p></div>}
      {msg && <div className="mb-4 rounded-md border-l-4 border-success-500 bg-success-500/10 p-4"><p className="text-sm text-success-500">{msg}</p></div>}

      <DataTable loading={loading} columns={columns} rows={rows}
        searchKeys={['idCard', 'firstName', 'lastName', 'email', 'role']}
        placeholder="Buscar por nombre, correo, ID o rol..."
        emptyMessage="No hay usuarios registrados." />

      <Modal title={modal?.mode === 'edit' ? 'Editar usuario' : 'Nuevo usuario'} open={!!modal} onClose={() => setModal(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
          <button className="btn-primary" disabled={saving} type="button" onClick={submit}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </>}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Tipo de ID</label>
              <select name="identificationType" className="select" value={form.identificationType || 'CC'} onChange={handleChange}>
                {ENUMS.IdentificationType.map((t) => <option key={t} value={t}>{t}</option>)}
              </select></div>
            <div><label className="label">N° Identificación</label>
              <input name="idCard" type="number" className="input" value={form.idCard || ''} onChange={handleChange} disabled={modal?.mode === 'edit'} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Nombre</label>
              <input name="firstName" className="input" value={form.firstName || ''} onChange={handleChange} required /></div>
            <div><label className="label">Apellido</label>
              <input name="lastName" className="input" value={form.lastName || ''} onChange={handleChange} required /></div>
          </div>
          <div><label className="label">Correo</label>
            <input name="email" type="email" className="input" value={form.email || ''} onChange={handleChange} required /></div>
          <div><label className="label">{modal?.mode === 'edit' ? 'Nueva contraseña (opcional)' : 'Contraseña'}</label>
            <input name="password" type="password" className="input" value={form.password || ''} onChange={handleChange}
              required={modal?.mode !== 'edit'} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Teléfono</label>
              <input name="phoneNumber" className="input" value={form.phoneNumber || ''} onChange={handleChange} /></div>
            <div><label className="label">Dirección</label>
              <input name="direction" className="input" value={form.direction || ''} onChange={handleChange} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Rol</label>
              <select name="role" className="select" value={form.role || 'ADMIN'} onChange={handleChange}>
                {ENUMS.Role.map((r) => <option key={r} value={r}>{r}</option>)}
              </select></div>
            <div><label className="label">Estado</label>
              <select name="active" className="select" value={form.active === true ? '1' : '0'} onChange={handleChange}>
                <option value="1">Activo</option>
                <option value="0">Inactivo</option>
              </select></div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default UsersManagement;
