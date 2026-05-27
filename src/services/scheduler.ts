import { randomUUID } from 'node:crypto';

import { IntervalError } from '../common/errors/intervalError';
import { TaskNameError } from '../common/errors/taskNameError';
import { config } from '../core/config';
import { log } from '../core/logger';

export function scheduleTask(name: string, interval: number, task: Function) {
  if (name === '') {
    throw new TaskNameError('Task name cannot be empty.');
  }

  if (interval <= 0) {
    throw new IntervalError('Invalid interval.');
  }

  log('INFO', `Task "${name}" with interval ${interval} msec started.`);
  return setInterval(task, interval);
}

function runScheduler() {
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
