import fs from 'fs';

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yaml';

import { log } from './core/logger';
import database from './database/database';
import authRouter from './routes/authRouter';
import currencyRouter from './routes/currencyRouter';
import statusRouter from './routes/statusRouter';
import walletRouter from './routes/walletRouter';
import { runScheduler } from './services/scheduler';

const databaseReady = database.initDatabase();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/status', statusRouter);
app.use('/auth', authRouter);
app.use('/currencies', currencyRouter);
app.use('/wallets', walletRouter);

const swaggerYml = fs.readFileSync('openapi.yaml', 'utf8');
const swaggerDocument = yaml.parse(swaggerYml);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (process.env.NODE_ENV !== 'test') {
  const intervalTasks = runScheduler();

  process.on('SIGINT', () => {
    log('INFO', 'Received SIGINT.');
    intervalTasks.forEach((id) => clearInterval(id));
    log('INFO', 'Scheduler stopped.');
    server.close();
  });

  process.on('SIGTERM', () => {
    log('INFO', 'Received SIGTERM.');
    intervalTasks.forEach((id) => clearInterval(id));
    log('INFO', 'Scheduler stopped.');
    server.close();
  });
}

const PORT = 3000;
const server = app.listen(PORT);

export { app, server, databaseReady };
