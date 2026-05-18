import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { loadEnv } from './config/env.js';
import { connectDB } from './database/connectDB.js';
import { requestLogger } from './middleware/requestLogger.js';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import apiRouter from './routes/index.js';

dotenv.config();

export function createApp(): express.Application {
  const config = loadEnv();
  const app = express();

  app.use(cors({
    origin: config.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(requestLogger);

  app.use('/api/v1', apiRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  return app;
}

export async function startApp(): Promise<express.Application> {
  await connectDB();
  return createApp();
}
