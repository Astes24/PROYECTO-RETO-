import React, { useEffect, useId, useState } from 'react';
import { api } from '../api/client';

const fechaLocalHoy = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

// Suma minutos sin desbordar al día siguiente (evita 00:xx < inicio).
const sumarMinutos = (hhmm, minutos) => {
  const [h, m] = hhmm.split(':').map(Number);
  const total = Math.min(h * 60 + m + minutos, 23 * 60 + 59);
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

const validar = (f) => {
  const errores = {};
  if (!f.lead_id) errores.lead_id = 'Selecciona un paciente.';
  if (!f.fecha) errores.fecha = 'La fecha es obligatoria.';
  else if (f.fecha < fechaLocalHoy()) errores.fecha = 'La fecha no puede estar en el pasado.';
  if (!f.hora_inicio) errores.hora_inicio = 'Indica la hora de inicio.';
  if (!f.hora_fin) errores.hora_fin = 'Indica la hora de fin.';
  else if (f.hora_inicio && f.hora_fin <= f.hora_inicio) errores.hora_fin = 'Debe ser posterior a la hora de inicio.';
  if (!f.motivo.trim()) errores.motivo = 'Escribe el motivo de la consulta.';
  return errores;
};

export const CitaForm = ({ cita, onSubmit, onCancel, leadId, submitting = false }) => {
  const uid = useId();
  const [leads, setLeads] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errores, setErrores] = useState({});

  const [formData, setFormData] = useState({
    lead_id: cita?.lead_id || leadId || '',
    fecha: cita?.fecha || fechaLocalHoy(),
    hora_inicio: cita?.hora_inicio?.slice(0, 5) || '10:00',
    hora_fin: cita?.hora_fin?.slice(0, 5) || '10:30',
    motivo: cita?.motivo || '',
    estado: cita?.estado || 'pendiente',
    notas: cita?.notas || ''
  });

  useEffect(() => {
    let activo = true;
    api
      .getLeads()
      .then((data) => {
        if (!activo) return;
        setLeads(data);
        setFormData((prev) => (prev.lead_id ? prev : { ...prev, lead_id: data[0]?.id || '' }));
      })
      .catch(() => {})
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === 'hora_inicio' && value) {
        next.hora_fin = sumarMinutos(value, 30);
      }
      return next;
    });
    setErrores((prev) => ({ ...prev, [name]: undefined, ...(name === 'hora_inicio' ? { hora_fin: undefined } : {}) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const encontrados = validar(formData);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    onSubmit(formData);
  };

  const field = (name) => `${uid}-${name}`;

  if (cargando) {
    return <div className="skeleton" style={{ height: 260 }} aria-label="Cargando formulario" />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor={field('lead_id')}>Paciente *</label>
        <select
          id={field('lead_id')}
          className="form-control"
          name="lead_id"
          value={formData.lead_id}
          onChange={handleChange}
          aria-invalid={errores.lead_id ? 'true' : undefined}
        >
          <option value="">Selecciona un paciente…</option>
          {leads.map((l) => (
            <option key={l.id} value={l.id}>{l.nombre} · {l.telefono}</option>
          ))}
        </select>
        {errores.lead_id && <span className="field-error">{errores.lead_id}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={field('motivo')}>Motivo *</label>
        <input
          id={field('motivo')}
          className="form-control"
          name="motivo"
          value={formData.motivo}
          onChange={handleChange}
          placeholder="Ej. Consulta general"
          aria-invalid={errores.motivo ? 'true' : undefined}
        />
        {errores.motivo && <span className="field-error">{errores.motivo}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={field('fecha')}>Fecha *</label>
        <input
          id={field('fecha')}
          className="form-control num"
          type="date"
          name="fecha"
          value={formData.fecha}
          onChange={handleChange}
          aria-invalid={errores.fecha ? 'true' : undefined}
        />
        {errores.fecha && <span className="field-error">{errores.fecha}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label" htmlFor={field('hora_inicio')}>Hora inicio *</label>
          <input
            id={field('hora_inicio')}
            className="form-control num"
            type="time"
            name="hora_inicio"
            value={formData.hora_inicio}
            onChange={handleChange}
            aria-invalid={errores.hora_inicio ? 'true' : undefined}
          />
          {errores.hora_inicio && <span className="field-error">{errores.hora_inicio}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor={field('hora_fin')}>Hora fin *</label>
          <input
            id={field('hora_fin')}
            className="form-control num"
            type="time"
            name="hora_fin"
            value={formData.hora_fin}
            onChange={handleChange}
            aria-invalid={errores.hora_fin ? 'true' : undefined}
          />
          {errores.hora_fin && <span className="field-error">{errores.hora_fin}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={field('notas')}>Notas</label>
        <textarea id={field('notas')} className="form-control" name="notas" value={formData.notas} onChange={handleChange} placeholder="Detalles de la cita" />
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={submitting}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Guardando…' : cita ? 'Guardar cambios' : 'Agendar cita'}
        </button>
      </div>
    </form>
  );
};
