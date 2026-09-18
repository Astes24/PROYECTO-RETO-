import React from 'react';
import { StatusBadge } from './StatusBadge';
import { IconClock, IconCalendar, IconEdit, IconTrash } from './icons';

const ESTADOS = ['pendiente', 'confirmada', 'cancelada', 'reprogramada'];

// Se formatea la fecha sin `new Date()` para evitar el desfase UTC.
const formatFecha = (fecha) => {
  const iso = String(fecha || '').slice(0, 10);
  const [y, m, d] = iso.split('-');
  return y && m && d ? `${d}/${m}/${y}` : iso;
};

export const CitaCard = ({ cita, onChangeEstado, onEdit, onDelete }) => {
  const estado = (cita.estado || 'pendiente').toLowerCase();
  const paciente = cita.lead_nombre || 'Paciente sin nombre';

  return (
    <article className="cita" data-estado={estado}>
      <div className="cita-top">
        <div>
          <div className="cita-paciente">{paciente}</div>
          <div className="cita-meta">
            <span>
              <IconClock />
              {cita.hora_inicio?.slice(0, 5)}–{cita.hora_fin?.slice(0, 5)}
            </span>
            <span>
              <IconCalendar />
              {formatFecha(cita.fecha)}
            </span>
          </div>
        </div>
        <StatusBadge estado={cita.estado} />
      </div>

      {cita.motivo && <div className="cita-motivo">{cita.motivo}</div>}

      <div className="cita-actions">
        <select
          className="form-control"
          value={estado}
          onChange={(e) => onChangeEstado(cita.id, e.target.value)}
          aria-label={`Estado de la cita de ${paciente}`}
        >
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e.charAt(0).toUpperCase() + e.slice(1)}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button type="button" className="btn-icon" onClick={() => onEdit(cita)} aria-label={`Editar cita de ${paciente}`} title="Editar">
            <IconEdit />
          </button>
          <button type="button" className="btn-icon" onClick={() => onDelete(cita.id)} aria-label={`Eliminar cita de ${paciente}`} title="Eliminar">
            <IconTrash />
          </button>
        </div>
      </div>
    </article>
  );
};
