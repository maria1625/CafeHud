import { webcrypto } from 'node:crypto';

if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
  });
}

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { config } from './config/environment.js';
import authRoutes from './routes/auth.js';
import cafeRoutes from './routes/cafes.js';
import favoriteRoutes from './routes/favorites.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';
import healthRoutes from './routes/health.js';
import { errorHandler } from './middleware/errorHandler.js';
import { seedDatabase } from './seed/seedDatabase.js';

const __dirname = process.cwd();

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));

const allowedOrigins = [
  "http://localhost:3000",
  config.corsOrigin,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan('tiny'));

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cafes', cafeRoutes);
app.use('/api/v1/favorites', favoriteRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/', healthRoutes);

app.use(errorHandler);

const startServer = async () => {
  try {
    const { default: connectDB } = await import('./config/database.js');
    await connectDB();

    if (config.nodeEnv !== 'test') {
      await seedDatabase();
      app.listen(config.port, () => {
        console.log(`Backend server running on http://localhost:${config.port}`);
      });
    } else {
      console.log('Modo test activado: semilla deshabilitada y servidor no arranca en escucha.');
    }
  } catch (error) {
    console.error('Error conectando al servidor:', error);
  }
};

startServer();

export default app;
