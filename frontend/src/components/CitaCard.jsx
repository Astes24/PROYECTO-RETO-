import React from 'react';
import { StatusBadge } from './StatusBadge';

export const CitaCard = ({ cita, onChangeEstado, onEdit, onDelete }) => {
  // Determine border color based on status
  let borderColor = 'var(--secondary)';
  const est = (cita.estado || '').toLowerCase();
  if (est === 'pendiente') borderColor = 'var(--warning)';
  else if (est === 'confirmada') borderColor = 'var(--success)';
  else if (est === 'cancelada') borderColor = 'var(--danger)';
  else if (est === 'reprogramada') borderColor = 'var(--accent)';

  return (
    <div className="glass" style={{
      padding: '1.25rem',
      borderRadius: 'var(--radius-md)',
      borderLeft: `4px solid ${borderColor}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      transition: 'transform 0.2s',
      cursor: 'default'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div className="flex justify-between items-start">
        <div>
          <div style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            {cita.Lead?.nombre || 'Paciente Desconocido'}
          </div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🕒 {cita.hora_inicio?.substring(0,5)} - {cita.hora_fin?.substring(0,5)}</span>
            <span>•</span>
            <span>📅 {new Date(cita.fecha).toLocaleDateString()}</span>
          </div>
        </div>
        <StatusBadge estado={cita.estado || 'Pendiente'} />
      </div>

      <div style={{ fontSize: '0.875rem' }}>
        <span className="text-secondary">Motivo: </span>
        <span>{cita.motivo}</span>
      </div>

      <div className="flex justify-between items-center mt-2" style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
        <select 
          className="form-control" 
          style={{ width: '150px', padding: '0.25rem 0.5rem' }}
          value={cita.estado}
          onChange={(e) => onChangeEstado(cita.id, e.target.value)}
        >
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
          <option value="reprogramada">Reprogramada</option>
        </select>

        <div className="flex gap-2">
          <button className="btn-icon" onClick={() => onEdit(cita)} title="Editar">✏️</button>
          <button className="btn-icon" onClick={() => onDelete(cita.id)} title="Eliminar">🗑️</button>
        </div>
      </div>
    </div>
  );
};
