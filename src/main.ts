import express from 'express';

import { log } from './core/logger';
import database from './database/database';
import routes from './routes/routes';
import { runScheduler } from './services/scheduler';

const databaseReady = database.initDatabase();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);
if (process.env.NODE_ENV !== 'test') {
  const intervalTasks = runScheduler();

  process.on('SIGINT', () => {
    log('INFO', 'Received SIGINT.');
    intervalTasks.forEach((id) => clearInterval(id));
    console.log('Scheduler stopped.');
    server.close();
  });
}

const PORT = 3000;
const server = app.listen(PORT);

export { app, server, databaseReady };
