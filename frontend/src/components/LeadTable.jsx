import React, { useState } from 'react';
import { StatusBadge } from './StatusBadge';

export const LeadTable = ({ leads, onEdit, onCreateCita, onView }) => {
  const [search, setSearch] = useState('');

  const filtered = leads.filter(l => 
    l.nombre?.toLowerCase().includes(search.toLowerCase()) || 
    l.telefono?.includes(search) ||
    l.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass table-container">
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Buscar lead por nombre, teléfono o email..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '400px' }}
        />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Contacto</th>
            <th>Fuente</th>
            <th>Estado</th>
            <th>Fecha</th>
            <th style={{ textAlign: 'right' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }} className="text-secondary">No se encontraron leads.</td></tr>
          ) : (
            filtered.map(lead => (
              <tr key={lead.id}>
                <td style={{ fontWeight: 500 }}>{lead.nombre}</td>
                <td>
                  <div>{lead.telefono}</div>
                  <div className="text-secondary" style={{ fontSize: '0.75rem' }}>{lead.email}</div>
                </td>
                <td style={{ textTransform: 'capitalize' }}>{lead.fuente}</td>
                <td><StatusBadge estado={lead.estado || 'Nuevo'} /></td>
                <td>{new Date(lead.created_at || lead.fecha).toLocaleDateString()}</td>
                <td style={{ textAlign: 'right' }}>
                  <div className="flex justify-end gap-2">
                    <button className="btn-icon" onClick={() => onCreateCita(lead)} title="Agendar Cita">
                      📅
                    </button>
                    <button className="btn-icon" onClick={() => onEdit(lead)} title="Editar Lead">
                      ✏️
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
