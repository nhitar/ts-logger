import { UUID, randomUUID } from 'node:crypto';

import { config } from './config';

type LoggerLevels = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'TRACE';

export const log = createLogger();

function colourOutput(message: string, colour: string) {
  switch (colour) {
    case 'red':
      console.log(`\x1b[31m${message}\x1b[0m`);
      return;
    case 'green':
      console.log(`\x1b[32m${message}\x1b[0m`);
      return;
    default:
      console.log(message);
  }
}

export function createLogger() {
  return function (
    level: LoggerLevels = 'INFO',
    message: string,
    requestId: UUID = randomUUID(),
  ) {
    const currentDate: string = new Date().toISOString().split('.')[0];
    const output: string = `[${config.appName}] ${level} ${requestId.slice(0, 8)} ${currentDate} ${message}`;

    if (level === 'WARN' || level === 'ERROR') {
      colourOutput(output, 'red');
    } else {
      colourOutput(output, 'green');
    }

    return requestId;
  };
}
