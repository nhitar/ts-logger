import { IntervalError } from '../common/errors/intervalError';
import { TaskNameError } from '../common/errors/taskNameError';
import { updateCurrencyPrices } from '../controllers/currencyController';
import { config } from '../core/config';
import { log } from '../core/logger';

export function scheduleTask(name: string, interval: number, task: () => void) {
  if (name === '') {
    throw new TaskNameError('Task name cannot be empty.');
  }

  if (interval <= 0) {
    throw new IntervalError('Invalid interval.');
  }

  log('INFO', `Task "${name}" with interval ${interval} msec started.`);
  return setInterval(task, interval);
}

export function runScheduler() {
  log('INFO', 'Scheduler started.');
  const intervalTasks = [];
  intervalTasks.push(
    scheduleTask('update prices', config.intervalMsec, updateCurrencyPrices),
  );
  return intervalTasks;
}
