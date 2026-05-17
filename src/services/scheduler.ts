import { IntervalError, NameError } from '../common/errors';
import { log } from '../core/logger';

export function scheduleTask(name: string, interval: number, task: Function) {
  if (name === '') {
    throw new NameError('Task name cannot be empty.');
  }

  if (interval <= 0) {
    throw new IntervalError('Invalid interval.');
  }

  log('INFO', `Task "${name}" with interval ${interval} msec started.`);
  return setInterval(task, interval);
}
