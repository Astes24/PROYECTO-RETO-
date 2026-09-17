import { getOne } from '../database.js';

export function validateLead(req, res, next) {
  const { nombre, telefono, email } = req.body;

  if (!nombre || nombre.trim().length < 2) {
    return res.status(400).json({ error: true, message: 'El nombre es obligatorio y debe tener al menos 2 caracteres.' });
  }

  if (!telefono || telefono.trim().replace(/\D/g, '').length < 7) {
    return res.status(400).json({ error: true, message: 'El teléfono es obligatorio y debe tener al menos 7 dígitos.' });
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: true, message: 'El formato del email no es válido.' });
    }
  }

  next();
}

export function validateCita(req, res, next) {
  const { lead_id, fecha, hora_inicio, hora_fin, motivo } = req.body;

  if (!lead_id) {
    return res.status(400).json({ error: true, message: 'El lead_id es obligatorio.' });
  }

  const leadExists = getOne('SELECT id FROM leads WHERE id = ?', [Number(lead_id)]);
  if (!leadExists) {
    return res.status(404).json({ error: true, message: 'El lead especificado no existe.' });
  }

  if (!fecha) {
    return res.status(400).json({ error: true, message: 'La fecha es obligatoria.' });
  }

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  if (fecha < todayStr) {
    return res.status(400).json({ error: true, message: 'La fecha de la cita no puede estar en el pasado.' });
  }

  if (!hora_inicio || !hora_fin) {
    return res.status(400).json({ error: true, message: 'Las horas de inicio y fin son obligatorias.' });
  }

  if (hora_fin <= hora_inicio) {
    return res.status(400).json({ error: true, message: 'La hora de fin debe ser posterior a la hora de inicio.' });
  }

  if (!motivo) {
    return res.status(400).json({ error: true, message: 'El motivo es obligatorio.' });
  }

  next();
}

export function validateEstado(req, res, next) {
  const { estado } = req.body;
  const validEstados = ['pendiente', 'confirmada', 'cancelada', 'reprogramada'];

  if (!estado || !validEstados.includes(estado)) {
    return res.status(400).json({ error: true, message: `Estado inválido. Debe ser uno de: ${validEstados.join(', ')}` });
  }

  next();
}
