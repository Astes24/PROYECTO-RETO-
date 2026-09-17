import express from 'express';
import { getAll, getOne, runQuery } from '../database.js';
import { validateCita, validateEstado } from '../middleware/validation.js';

const router = express.Router();

// GET /api/citas - Listar citas con información del lead
router.get('/', (req, res) => {
  try {
    const { fecha, estado } = req.query;
    let query = `
      SELECT citas.*, leads.nombre as lead_nombre, leads.telefono as lead_telefono, leads.email as lead_email
      FROM citas
      JOIN leads ON citas.lead_id = leads.id
      WHERE 1=1
    `;
    const params = [];

    if (fecha) {
      query += ' AND citas.fecha = ?';
      params.push(fecha);
    }

    if (estado) {
      query += ' AND citas.estado = ?';
      params.push(estado);
    }

    query += ' ORDER BY citas.fecha ASC, citas.hora_inicio ASC';

    const citas = getAll(query, params);
    res.json({ success: true, data: citas });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// GET /api/citas/:id - Obtener cita por ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const cita = getOne(`
      SELECT citas.*, leads.nombre as lead_nombre, leads.telefono as lead_telefono
      FROM citas
      JOIN leads ON citas.lead_id = leads.id
      WHERE citas.id = ?
    `, [Number(id)]);

    if (!cita) {
      return res.status(404).json({ error: true, message: 'Cita no encontrada' });
    }

    res.json({ success: true, data: cita });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// POST /api/citas - Crear nueva cita (valida conflictos de horario)
router.post('/', validateCita, (req, res) => {
  try {
    const { lead_id, fecha, hora_inicio, hora_fin, motivo, estado, notas } = req.body;

    // Verificar que el lead existe
    const lead = getOne('SELECT id FROM leads WHERE id = ?', [Number(lead_id)]);
    if (!lead) {
      return res.status(400).json({ error: true, message: 'El lead especificado no existe.' });
    }

    // Verificar conflictos de horario
    const conflicto = getOne(`
      SELECT id FROM citas
      WHERE fecha = ? AND estado != 'cancelada'
      AND ((hora_inicio < ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin > ?) OR (hora_inicio >= ? AND hora_fin <= ?))
    `, [fecha, hora_fin, hora_inicio, hora_fin, hora_inicio, hora_inicio, hora_fin]);

    if (conflicto) {
      return res.status(400).json({
        error: true,
        message: 'Ya existe una cita programada en ese horario. Por favor seleccione otro horario.'
      });
    }

    const info = runQuery(
      `INSERT INTO citas (lead_id, fecha, hora_inicio, hora_fin, motivo, estado, notas) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [Number(lead_id), fecha, hora_inicio, hora_fin, motivo, estado || 'pendiente', notas || null]
    );

    const newCita = getOne(`
      SELECT citas.*, leads.nombre as lead_nombre, leads.telefono as lead_telefono
      FROM citas JOIN leads ON citas.lead_id = leads.id
      WHERE citas.id = ?
    `, [info.lastInsertRowid]);

    res.status(201).json({ success: true, data: newCita });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// PUT /api/citas/:id - Actualizar cita
router.put('/:id', validateCita, (req, res) => {
  try {
    const { id } = req.params;
    const { lead_id, fecha, hora_inicio, hora_fin, motivo, estado, notas } = req.body;

    // Verificar conflictos de horario (excluyendo la cita actual)
    const conflicto = getOne(`
      SELECT id FROM citas
      WHERE fecha = ? AND estado != 'cancelada' AND id != ?
      AND ((hora_inicio < ? AND hora_fin > ?) OR (hora_inicio < ? AND hora_fin > ?) OR (hora_inicio >= ? AND hora_fin <= ?))
    `, [fecha, Number(id), hora_fin, hora_inicio, hora_fin, hora_inicio, hora_inicio, hora_fin]);

    if (conflicto) {
      return res.status(400).json({
        error: true,
        message: 'Ya existe una cita en ese horario.'
      });
    }

    const info = runQuery(
      `UPDATE citas SET lead_id = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, motivo = ?, estado = ?, notas = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [Number(lead_id), fecha, hora_inicio, hora_fin, motivo, estado || 'pendiente', notas || null, Number(id)]
    );

    if (info.changes === 0) {
      return res.status(404).json({ error: true, message: 'Cita no encontrada' });
    }

    const updatedCita = getOne(`
      SELECT citas.*, leads.nombre as lead_nombre, leads.telefono as lead_telefono
      FROM citas JOIN leads ON citas.lead_id = leads.id
      WHERE citas.id = ?
    `, [Number(id)]);

    res.json({ success: true, data: updatedCita });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// PATCH /api/citas/:id/estado - Cambiar estado de cita
router.patch('/:id/estado', validateEstado, (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const info = runQuery(
      `UPDATE citas SET estado = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [estado, Number(id)]
    );

    if (info.changes === 0) {
      return res.status(404).json({ error: true, message: 'Cita no encontrada' });
    }

    const updatedCita = getOne(`
      SELECT citas.*, leads.nombre as lead_nombre, leads.telefono as lead_telefono
      FROM citas JOIN leads ON citas.lead_id = leads.id
      WHERE citas.id = ?
    `, [Number(id)]);

    res.json({ success: true, data: updatedCita });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// DELETE /api/citas/:id - Eliminar cita
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const info = runQuery('DELETE FROM citas WHERE id = ?', [Number(id)]);

    if (info.changes === 0) {
      return res.status(404).json({ error: true, message: 'Cita no encontrada' });
    }

    res.json({ success: true, data: { deleted: true } });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

export default router;
