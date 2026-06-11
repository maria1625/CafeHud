import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import connectDB from './config/database.js';
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

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(morgan('tiny'));

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
