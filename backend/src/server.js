import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pool from './config/db.js';
import personasRoutes from './routes/personasRoutes.js';

const app = express();
const port = Number(process.env.PORT || 3000);
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') || true }));
app.use(express.json({ limit: '20kb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/personas', personasRoutes);
app.use((req, res) => res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.path}` }));
app.use((error, _req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(500).json({ message: 'Error interno del servidor.' });
});

try {
  await pool.query('SELECT 1');
  app.listen(port, () => console.log(`API disponible en http://localhost:${port}`));
} catch (error) {
  console.error('No fue posible conectar con MySQL:', error.message);
  process.exit(1);
}
