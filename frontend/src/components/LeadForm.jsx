import React, { useState } from 'react';

export const LeadForm = ({ lead, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: lead?.nombre || '',
    telefono: lead?.telefono || '',
    email: lead?.email || '',
    fuente: lead?.fuente || 'web',
    notas: lead?.notas || ''
  });
  
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre.trim() || !formData.telefono.trim()) {
      setError('Nombre y teléfono son obligatorios');
      return;
    }
    setError('');
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}
      
      <div className="form-group">
        <label className="form-label">Nombre *</label>
        <input className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Juan Pérez" autoFocus />
      </div>

      <div className="form-group">
        <label className="form-label">Teléfono *</label>
        <input className="form-control" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="Ej. +34600123456" />
      </div>

      <div className="form-group">
        <label className="form-label">Email</label>
        <input className="form-control" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Ej. juan@email.com" />
      </div>

      <div className="form-group">
        <label className="form-label">Fuente</label>
        <select className="form-control" name="fuente" value={formData.fuente} onChange={handleChange}>
          <option value="web">Web</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="referido">Referido</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Notas</label>
        <textarea className="form-control" name="notas" value={formData.notas} onChange={handleChange} placeholder="Detalles adicionales..." />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button type="button" className="btn btn-outline" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">{lead ? 'Guardar Cambios' : 'Crear Lead'}</button>
      </div>
    </form>
  );
};
