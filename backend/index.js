// This project is possible with the help of different resources that helped me to learn.
// Special thanks to Shreyandcodingschool, codewithharry and apnacollege for providing free courses.
// Thanks to Gemini, Claude and ChatGpt for helping me build this project.


// *imports

import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
import jsonHandler from './src/middlewares/jsonHandler.js';
import cron from 'node-cron';
import { generateTimePeriod } from './src/config/timeScheduleGenerator.js';
import { globalLimiter } from './src/middlewares/rateLimiter.js';
import cors from 'cors';
import pino_logger from './src/utils/pino.js'
import { initCalenderGenerator } from './src/config/masterCalenderGenerator.js';

// *route imports

import authRoutes from './src/routes/authRoutes.js';
import superUserRoutes from './src/routes/superUserRoutes.js';
import systemRoutes from './src/routes/systemRoutes.js';

// *catch unhandled rejections

process.on('unhandledRejection', (reason) => {
  pino_logger.fatal({ reason }, 'Unhandled promise rejection');
  process.exit(1);
});

// *startup message

pino_logger.info('Starting up')

// *declarations / configs

const port = process.env.PORT || 3000;
const app = express();

const allowedOrigins = [
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://192.168.29.124:5173',
  'http://10.138.15.139:5173'
];

// *middlewares

app.set('trust proxy', 1)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}));

app.use(globalLimiter);
app.use(express.json());
app.use(jsonHandler);
app.use(cookieParser());

async function bootstrap() {
  await connectDB();
  initCalenderGenerator(process.env.RESET_CALENDAR === 'true');

  cron.schedule('0 6 * * *', () => generateTimePeriod(), { scheduled: true });

  // *routes

  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to school management system.',
      metadata: {
        api: process.env.API_VERSION,
        node: process.version,
      }
    });
  });

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/su', superUserRoutes);
  app.use('/api/v1', systemRoutes);

  // *404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // *global error handler
  app.use((err, req, res, next) => {
    pino_logger.error({ err }, 'Unhandled error');
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
  });

  app.listen(port, () => pino_logger.info({ port }, 'Server listening'));
}

bootstrap().catch(err => {
  pino_logger.fatal({ err }, 'Failed to start server');
  process.exit(1);
});

// *exit gracefully of terminal signal

process.on('SIGTERM', () => {
  pino_logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    pino_logger.info('Server closed');
    process.exit(0);
  });
});

// *close server gracefully on (Ctrl+C)

process.on('SIGINT', () => {
  pino_logger.info('SIGINT received (Ctrl+C), shutting down');
  server.close(() => {
    pino_logger.info('Server closed');
    process.exit(0);
  });
});