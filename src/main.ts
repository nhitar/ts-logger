import { randomUUID } from 'node:crypto';

import { config } from './core/config';
import { log } from './core/logger';
import { scheduleTask } from './services/scheduler';

function initScript() {
  log('INFO', 'Scheduler started.');
  scheduleTask(
    'run logger',
    config.intervalMsec,
    (() => {
      const requestId = randomUUID();
      return () => {
        log('INFO', 'Running.', requestId);
      };
    })(),
  );
}

initScript();
