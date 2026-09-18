import React, { useId, useState } from 'react';

const validar = (f) => {
  const errores = {};
  if (!f.nombre.trim() || f.nombre.trim().length < 2) {
    errores.nombre = 'Escribe al menos 2 caracteres.';
  }
  if (f.telefono.trim().replace(/\D/g, '').length < 7) {
    errores.telefono = 'El teléfono debe tener al menos 7 dígitos.';
  }
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    errores.email = 'El email no tiene un formato válido.';
  }
  return errores;
};

export const LeadForm = ({ lead, onSubmit, onCancel, submitting = false }) => {
  const uid = useId();
  const [formData, setFormData] = useState({
    nombre: lead?.nombre || '',
    telefono: lead?.telefono || '',
    email: lead?.email || '',
    fuente: lead?.fuente || 'web',
    estado: lead?.estado || 'nuevo',
    notas: lead?.notas || ''
  });
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const encontrados = validar(formData);
    setErrores(encontrados);
    if (Object.keys(encontrados).length > 0) return;
    onSubmit(formData);
  };

  const field = (name) => `${uid}-${name}`;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label" htmlFor={field('nombre')}>Nombre *</label>
        <input
          id={field('nombre')}
          className="form-control"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej. Juan Pérez"
          aria-invalid={errores.nombre ? 'true' : undefined}
          aria-describedby={errores.nombre ? field('nombre-error') : undefined}
          autoFocus
        />
        {errores.nombre && <span className="field-error" id={field('nombre-error')}>{errores.nombre}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={field('telefono')}>Teléfono *</label>
        <input
          id={field('telefono')}
          className="form-control num"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Ej. +52 55 5123 4567"
          aria-invalid={errores.telefono ? 'true' : undefined}
          aria-describedby={errores.telefono ? field('telefono-error') : undefined}
        />
        {errores.telefono && <span className="field-error" id={field('telefono-error')}>{errores.telefono}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={field('email')}>Email</label>
        <input
          id={field('email')}
          className="form-control"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Ej. juan@correo.com"
          aria-invalid={errores.email ? 'true' : undefined}
          aria-describedby={errores.email ? field('email-error') : undefined}
        />
        {errores.email && <span className="field-error" id={field('email-error')}>{errores.email}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="form-group">
          <label className="form-label" htmlFor={field('fuente')}>Fuente</label>
          <select id={field('fuente')} className="form-control" name="fuente" value={formData.fuente} onChange={handleChange}>
            <option value="web">Web</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="referido">Referido</option>
            <option value="instagram">Instagram</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor={field('estado')}>Estado</label>
          <select id={field('estado')} className="form-control" name="estado" value={formData.estado} onChange={handleChange}>
            <option value="nuevo">Nuevo</option>
            <option value="contactado">Contactado</option>
            <option value="convertido">Convertido</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor={field('notas')}>Notas</label>
        <textarea id={field('notas')} className="form-control" name="notas" value={formData.notas} onChange={handleChange} placeholder="Detalles adicionales" />
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={submitting}>Cancelar</button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Guardando…' : lead ? 'Guardar cambios' : 'Crear lead'}
        </button>
      </div>
    </form>
  );
};
