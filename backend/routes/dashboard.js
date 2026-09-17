import express from 'express';
import { getAll, getOne } from '../database.js';

const router = express.Router();

// GET /api/dashboard/resumen - Métricas generales
router.get('/resumen', (req, res) => {
  try {
    const total_leads = getOne('SELECT COUNT(*) as count FROM leads')?.count || 0;
    const leads_nuevos = getOne("SELECT COUNT(*) as count FROM leads WHERE estado = 'nuevo'")?.count || 0;
    const leads_contactados = getOne("SELECT COUNT(*) as count FROM leads WHERE estado = 'contactado'")?.count || 0;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const citas_hoy = getOne('SELECT COUNT(*) as count FROM citas WHERE fecha = ?', [todayStr])?.count || 0;
    const citas_pendientes = getOne("SELECT COUNT(*) as count FROM citas WHERE estado = 'pendiente'")?.count || 0;
    const citas_confirmadas = getOne("SELECT COUNT(*) as count FROM citas WHERE estado = 'confirmada'")?.count || 0;
    const citas_canceladas = getOne("SELECT COUNT(*) as count FROM citas WHERE estado = 'cancelada'")?.count || 0;
    const citas_reprogramadas = getOne("SELECT COUNT(*) as count FROM citas WHERE estado = 'reprogramada'")?.count || 0;

    res.json({
      success: true,
      data: {
        totalLeads: total_leads,
        leadsNuevos: leads_nuevos,
        leadsContactados: leads_contactados,
        citasHoy: citas_hoy,
        citasPendientes: citas_pendientes,
        citasConfirmadas: citas_confirmadas,
        citasCanceladas: citas_canceladas,
        citasReprogramadas: citas_reprogramadas
      }
    });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

// GET /api/dashboard/hoy - Citas del día con datos del lead
router.get('/hoy', (req, res) => {
  try {
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const citas = getAll(`
      SELECT citas.*, leads.nombre as lead_nombre, leads.telefono as lead_telefono
      FROM citas
      JOIN leads ON citas.lead_id = leads.id
      WHERE citas.fecha = ?
      ORDER BY citas.hora_inicio ASC
    `, [todayStr]);

    res.json({ success: true, data: citas });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

export default router;
