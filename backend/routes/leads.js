import express from 'express';
import { getAll, getOne, runQuery } from '../database.js';
import { validateLead } from '../middleware/validation.js';

const router = express.Router();

// GET /api/leads - Listar todos los leads
router.get('/', (req, res) => {
  try {
    const { estado, search } = req.query;
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params = [];

    if (estado) {
      query += ' AND estado = ?';
      params.push(estado);
    }

    if (search) {
      query += ' AND (nombre LIKE ? OR telefono LIKE ? OR email LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY created_at DESC';

    const leads = getAll(query, params);
    res.json({ success: true, data: leads });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// GET /api/leads/:id - Obtener lead por ID con sus citas
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const lead = getOne('SELECT * FROM leads WHERE id = ?', [Number(id)]);

    if (!lead) {
      return res.status(404).json({ error: true, message: 'Lead no encontrado' });
    }

    const citas = getAll('SELECT * FROM citas WHERE lead_id = ? ORDER BY fecha DESC, hora_inicio DESC', [Number(id)]);
    lead.citas = citas;

    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// POST /api/leads - Crear nuevo lead
router.post('/', validateLead, (req, res) => {
  try {
    const { nombre, telefono, email, fuente, estado, notas } = req.body;

    const existingLead = getOne('SELECT id FROM leads WHERE telefono = ?', [telefono]);
    if (existingLead) {
      return res.status(400).json({ error: true, message: 'Ya existe un lead con este teléfono.' });
    }

    const info = runQuery(
      `INSERT INTO leads (nombre, telefono, email, fuente, estado, notas) VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre, telefono, email || null, fuente || 'whatsapp', estado || 'nuevo', notas || null]
    );

    const newLead = getOne('SELECT * FROM leads WHERE id = ?', [info.lastInsertRowid]);
    res.status(201).json({ success: true, data: newLead });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// PUT /api/leads/:id - Actualizar lead
router.put('/:id', validateLead, (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email, fuente, estado, notas } = req.body;

    const existingLead = getOne('SELECT id FROM leads WHERE telefono = ? AND id != ?', [telefono, Number(id)]);
    if (existingLead) {
      return res.status(400).json({ error: true, message: 'Ya existe otro lead con este teléfono.' });
    }

    const info = runQuery(
      `UPDATE leads SET nombre = ?, telefono = ?, email = ?, fuente = ?, estado = ?, notas = ? WHERE id = ?`,
      [nombre, telefono, email || null, fuente || 'whatsapp', estado || 'nuevo', notas || null, Number(id)]
    );

    if (info.changes === 0) {
      return res.status(404).json({ error: true, message: 'Lead no encontrado' });
    }

    const updatedLead = getOne('SELECT * FROM leads WHERE id = ?', [Number(id)]);
    res.json({ success: true, data: updatedLead });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// DELETE /api/leads/:id - Eliminar lead (cascada)
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;

    runQuery('DELETE FROM mensajes_whatsapp WHERE lead_id = ?', [Number(id)]);
    runQuery('DELETE FROM citas WHERE lead_id = ?', [Number(id)]);
    const info = runQuery('DELETE FROM leads WHERE id = ?', [Number(id)]);

    if (info.changes === 0) {
      return res.status(404).json({ error: true, message: 'Lead no encontrado' });
    }

    res.json({ success: true, data: { deleted: true } });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

export default router;
