import React, { useState, useEffect } from 'react';
import { api } from '../api/client';

export const CitaForm = ({ cita, onSubmit, onCancel, leadId }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    lead_id: cita?.lead_id || leadId || '',
    fecha: cita?.fecha || new Date().toISOString().split('T')[0],
    hora_inicio: cita?.hora_inicio || '10:00',
    hora_fin: cita?.hora_fin || '10:30',
    motivo: cita?.motivo || '',
    notas: cita?.notas || ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    api.getLeads().then(data => {
      setLeads(data);
      if (!formData.lead_id && data.length > 0) {
        setFormData(prev => ({ ...prev, lead_id: data[0].id }));
      }
    }).finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'hora_inicio' && value) {
        // Auto set hora_fin to 30 min later
        const [h, m] = value.split(':').map(Number);
        const endD = new Date();
        endD.setHours(h, m + 30);
        next.hora_fin = `${endD.getHours().toString().padStart(2, '0')}:${endD.getMinutes().toString().padStart(2, '0')}`;
      }
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.lead_id || !formData.fecha || !formData.hora_inicio || !formData.hora_fin || !formData.motivo) {
      setError('Todos los campos marcados con * son obligatorios');
      return;
    }
    setError('');
    onSubmit(formData);
  };

  if (loading) return <div className="p-4 text-center">Cargando...</div>;

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      
      <div className="form-group">
        <label className="form-label">Paciente (Lead) *</label>
        <select className="form-control" name="lead_id" value={formData.lead_id} onChange={handleChange}>
          <option value="">Seleccione un paciente...</option>
          {leads.map(l => (
            <option key={l.id} value={l.id}>{l.nombre} ({l.telefono})</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Motivo *</label>
        <input className="form-control" name="motivo" value={formData.motivo} onChange={handleChange} placeholder="Ej. Consulta general" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Fecha *</label>
          <input className="form-control" type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label">Hora Inicio *</label>
          <input className="form-control" type="time" name="hora_inicio" value={formData.hora_inicio} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label className="form-label">Hora Fin *</label>
          <input className="form-control" type="time" name="hora_fin" value={formData.hora_fin} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Notas</label>
        <textarea className="form-control" name="notas" value={formData.notas} onChange={handleChange} placeholder="Detalles de la cita..." />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">{cita ? 'Guardar Cambios' : 'Agendar Cita'}</button>
      </div>
    </form>
  );
};
