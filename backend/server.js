import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { initDatabase } from './database.js';

import leadsRoutes from './routes/leads.js';
import citasRoutes from './routes/citas.js';
import whatsappRoutes from './routes/whatsapp.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'] }));
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/leads', leadsRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Mini Praxia API funcionando correctamente 🏥' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ error: true, message: 'Ocurrió un error en el servidor.' });
});

// Inicializar BD y luego arrancar servidor
async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`\n🏥 Servidor Mini Praxia corriendo en http://localhost:${PORT}`);
      console.log(`📡 API disponible en http://localhost:${PORT}/api\n`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

start();
