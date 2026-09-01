import { useEffect, useState, useCallback } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';
import { payments, tickets, ENUMS } from '../services';
import { formatCurrency, formatDateTime } from '../utils/format';

function PaymentsManagement() {
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
      const [p, t] = await Promise.all([
        payments.getAll(),
        tickets.getAll().catch(() => []),
      ]);
      setRows(p || []);
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
    setForm({ idTicket: '', montoTotal: '', metodoPago: 'EFECTIVO', referenciaTransaccion: '' });
    setModal({ mode: 'create' });
  };

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMsg('');
    try {
      await payments.create({
        idTicket: Number(form.idTicket),
        montoTotal: Number(form.montoTotal),
        metodoPago: form.metodoPago,
        referenciaTransaccion: form.referenciaTransaccion,
      });
      setMsg('Pago registrado correctamente.');
      setModal(null);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    if (!window.confirm(`¿Eliminar el pago #${row.idPayment}?`)) return;
    try {
      await payments.remove(row.idPayment);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const columns = [
    { key: 'idPayment', label: 'Pago', render: (r) => <span className="font-medium text-white">#{r.idPayment}</span> },
    { key: 'idTicket', label: 'Ticket', render: (r) => `#${r.idTicket}` },
    { key: 'montoTotal', label: 'Monto', render: (r) => formatCurrency(r.montoTotal) },
    { key: 'metodoPago', label: 'Método', render: (r) => <Badge value={r.metodoPago} /> },
    { key: 'fechaHoraPago', label: 'Fecha', render: (r) => formatDateTime(r.fechaHoraPago) },
    { key: 'referenciaTransaccion', label: 'Referencia' },
    { key: 'estadoPago', label: 'Estado', render: (r) => <Badge value={r.estadoPago} /> },
    {
      key: 'acciones',
      label: 'Acciones',
      render: (r) => <button className="btn-danger btn-sm" onClick={() => remove(r)}>Eliminar</button>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Gestión de Pagos"
        description="Registra y consulta los pagos del parqueadero."
        actions={<button className="btn-primary" onClick={openCreate}>Registrar pago</button>}
      />

      {error && <div className="mb-4 rounded-md border-l-4 border-danger-500 bg-danger-500/10 p-4"><p className="text-sm text-danger-500">{error}</p></div>}
      {msg && <div className="mb-4 rounded-md border-l-4 border-success-500 bg-success-500/10 p-4"><p className="text-sm text-success-500">{msg}</p></div>}

      <DataTable loading={loading} columns={columns} rows={rows}
        searchKeys={['idPayment', 'idTicket', 'referenciaTransaccion']}
        placeholder="Buscar por pago, ticket o referencia..."
        emptyMessage="No hay pagos registrados." />

      <Modal title="Registrar pago" open={!!modal} onClose={() => setModal(null)}
        footer={<>
          <button className="btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
          <button className="btn-primary" disabled={saving} type="button" onClick={submit}>{saving ? 'Guardando...' : 'Guardar'}</button>
        </>}>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label">Ticket</label>
              <select name="idTicket" className="select" value={form.idTicket || ''} onChange={handleChange} required>
                <option value="">Seleccionar</option>
                {ticketsList.map((t) => <option key={t.idTicket} value={t.idTicket}>#{t.idTicket} - {t.plate}</option>)}
              </select></div>
            <div><label className="label">Método de pago</label>
              <select name="metodoPago" className="select" value={form.metodoPago || 'EFECTIVO'} onChange={handleChange}>
                {ENUMS.PaymentMethod.map((m) => <option key={m} value={m}>{m}</option>)}
              </select></div>
          </div>
          <div><label className="label">Monto total</label>
            <input name="montoTotal" type="number" step="0.01" className="input" value={form.montoTotal || ''} onChange={handleChange} required /></div>
          <div><label className="label">Referencia de transacción</label>
            <input name="referenciaTransaccion" className="input" value={form.referenciaTransaccion || ''} onChange={handleChange} /></div>
        </form>
      </Modal>
    </div>
  );
}

export default PaymentsManagement;
