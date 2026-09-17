import express from 'express';
import cors from 'cors';
import { initDatabase } from '../backend/database.js';

import leadsRoutes from '../backend/routes/leads.js';
import citasRoutes from '../backend/routes/citas.js';
import whatsappRoutes from '../backend/routes/whatsapp.js';
import dashboardRoutes from '../backend/routes/dashboard.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware: inicializar BD en el primer request (async)
let dbReady = false;
app.use(async (req, res, next) => {
  if (!dbReady) {
    try {
      await initDatabase();
      dbReady = true;
    } catch (error) {
      console.error('Error inicializando BD:', error);
      return res.status(500).json({ error: true, message: 'Error inicializando la base de datos' });
    }
  }
  next();
});

// Rutas de la API
app.use('/api/leads', leadsRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Mini Praxia API funcionando en Vercel 🏥' });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: true, message: 'Ocurrió un error en el servidor.' });
});

export default app;
