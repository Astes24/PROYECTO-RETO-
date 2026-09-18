import express from 'express';
import { getAll, getOne, runQuery } from '../database.js';

const router = express.Router();

// POST /api/whatsapp/webhook - Simular recepción de mensaje entrante
router.post('/webhook', (req, res) => {
  try {
    const { telefono, mensaje } = req.body;

    if (!telefono || !mensaje) {
      return res.status(400).json({ error: true, message: 'Teléfono y mensaje son obligatorios.' });
    }

    // Rechazar mensajes repetidos del mismo número dentro de una ventana de 2 minutos
    const repetido = getOne(`
      SELECT id FROM mensajes_whatsapp
      WHERE telefono = ? AND mensaje = ? AND direccion = 'entrante'
      AND created_at > datetime('now', '-2 minutes')
    `, [telefono, mensaje]);

    if (repetido) {
      return res.status(400).json({ error: true, message: 'Mensaje repetido: ya recibimos este mismo mensaje hace instantes.' });
    }

    let lead = getOne('SELECT id FROM leads WHERE telefono = ?', [telefono]);

    if (!lead) {
      // Crear nuevo lead automáticamente
      const info = runQuery(
        `INSERT INTO leads (nombre, telefono, fuente, estado) VALUES (?, ?, 'whatsapp', 'nuevo')`,
        ['Lead WhatsApp', telefono]
      );
      lead = { id: info.lastInsertRowid };
    }

    const msgInfo = runQuery(
      `INSERT INTO mensajes_whatsapp (lead_id, telefono, mensaje, direccion) VALUES (?, ?, ?, 'entrante')`,
      [lead.id, telefono, mensaje]
    );

    const newMsg = getOne('SELECT * FROM mensajes_whatsapp WHERE id = ?', [msgInfo.lastInsertRowid]);
    res.status(201).json({ success: true, data: newMsg });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// POST /api/whatsapp/enviar - Simular envío de mensaje saliente
router.post('/enviar', (req, res) => {
  try {
    const { telefono, mensaje } = req.body;

    if (!telefono || !mensaje) {
      return res.status(400).json({ error: true, message: 'Teléfono y mensaje son obligatorios.' });
    }

    const lead = getOne('SELECT id FROM leads WHERE telefono = ?', [telefono]);
    const lead_id = lead ? lead.id : null;

    const info = runQuery(
      `INSERT INTO mensajes_whatsapp (lead_id, telefono, mensaje, direccion) VALUES (?, ?, ?, 'saliente')`,
      [lead_id, telefono, mensaje]
    );

    const newMsg = getOne('SELECT * FROM mensajes_whatsapp WHERE id = ?', [info.lastInsertRowid]);
    res.status(201).json({ success: true, data: newMsg });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// GET /api/whatsapp/mensajes/:telefono - Historial de mensajes por teléfono
router.get('/mensajes/:telefono', (req, res) => {
  try {
    const { telefono } = req.params;
    const mensajes = getAll(
      'SELECT * FROM mensajes_whatsapp WHERE telefono = ? ORDER BY created_at ASC',
      [telefono]
    );

    res.json({ success: true, data: mensajes });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

export default router;
