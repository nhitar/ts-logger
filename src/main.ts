import { randomUUID } from 'node:crypto';

import express from 'express';

import { config } from './core/config';
import { log } from './core/logger';
import routes from './routes/routes';
import { scheduleTask } from './services/scheduler';

// function initScript() {
//   log('INFO', 'Scheduler started.');
//   scheduleTask(
//     'run logger',
//     config.intervalMsec,
//     (() => {
//       const requestId = randomUUID();
//       return () => {
//         log('INFO', 'Running.', requestId);
//       };
//     })(),
//   );
// }

// initScript();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', routes);

const PORT = 3000;
const server = app.listen(PORT);

export { app, server };
