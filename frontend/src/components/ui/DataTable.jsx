import { useState } from 'react';
import EmptyState from './EmptyState';
import Spinner from './Spinner';

/**
 * Tabla de datos genérica con búsqueda.
 * columns: [{ key, label, render?, className? }]
 * searchKeys: array de keys de fila para filtrar
 */
export default function DataTable({
  columns,
  rows = [],
  searchKeys = [],
  placeholder = 'Buscar...',
  loading = false,
  emptyMessage = 'Sin datos para mostrar',
}) {
  const [query, setQuery] = useState('');

  const filtered = query
    ? rows.filter((row) =>
        searchKeys.some((key) => {
          const val = String(row[key] ?? '');
          return val.toLowerCase().includes(query.toLowerCase());
        })
      )
    : rows;

  return (
    <div className="card">
      {searchKeys.length > 0 && (
        <div className="border-b border-neutral-800 px-5 py-4">
          <input
            className="input max-w-sm"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      )}
      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className={col.className}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, ri) => (
                <tr key={row._key ?? ri}>
                  {columns.map((col, ci) => (
                    <td key={ci} className={col.className}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
