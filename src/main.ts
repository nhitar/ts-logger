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

app.use('/', routes);

const PORT = 3000;
const server = app.listen(PORT, async () => {
  log('INFO', `Server running on http://localhost:${PORT}`);
});

export { app, server };
