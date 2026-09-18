import React, { useMemo, useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { IconSearch, IconCalendar, IconEdit, IconTrash, IconInbox } from './icons';

const formatFecha = (valor) => {
  if (!valor) return '—';
  const iso = String(valor).replace(' ', 'T').slice(0, 10);
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
};

export const LeadTable = ({ leads, onEdit, onCreateCita, onDelete }) => {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (l) =>
        l.nombre?.toLowerCase().includes(q) ||
        l.telefono?.includes(q) ||
        l.email?.toLowerCase().includes(q)
    );
  }, [leads, search]);

  return (
    <div className="panel">
      <div style={{ padding: 'var(--sp-4)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'relative', maxWidth: 380 }}>
          <IconSearch
            style={{
              position: 'absolute',
              left: 10,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 16,
              height: 16,
              color: 'var(--ink-3)',
              pointerEvents: 'none'
            }}
          />
          <input
            type="search"
            className="form-control"
            placeholder="Buscar por nombre, teléfono o email"
            aria-label="Buscar leads"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 34 }}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Contacto</th>
              <th scope="col">Fuente</th>
              <th scope="col">Estado</th>
              <th scope="col">Alta</th>
              <th scope="col" style={{ textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty">
                    <span className="empty-icon"><IconInbox /></span>
                    <div>
                      <strong>{leads.length === 0 ? 'Todavía no hay leads' : 'Sin resultados'}</strong>
                      <p>{leads.length === 0 ? 'Crea el primero para empezar a agendar citas.' : 'Prueba con otro nombre, teléfono o email.'}</p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <tr key={lead.id}>
                  <td style={{ fontWeight: 600, color: 'var(--ink)' }}>{lead.nombre}</td>
                  <td>
                    <div className="num">{lead.telefono}</div>
                    {lead.email && <div className="list-sub">{lead.email}</div>}
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>{lead.fuente || '—'}</td>
                  <td><StatusBadge estado={lead.estado} /></td>
                  <td className="num">{formatFecha(lead.created_at || lead.fecha)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div className="flex justify-end gap-2">
                      <button type="button" className="btn-icon" onClick={() => onCreateCita(lead)} aria-label={`Agendar cita para ${lead.nombre}`} title="Agendar cita">
                        <IconCalendar />
                      </button>
                      <button type="button" className="btn-icon" onClick={() => onEdit(lead)} aria-label={`Editar ${lead.nombre}`} title="Editar lead">
                        <IconEdit />
                      </button>
                      <button type="button" className="btn-icon" onClick={() => onDelete(lead)} aria-label={`Eliminar ${lead.nombre}`} title="Eliminar lead">
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
