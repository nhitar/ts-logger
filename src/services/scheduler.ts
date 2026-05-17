import { createLogger } from "../core/logger.js";

export const log = createLogger();

export function scheduleTask(name: string, interval: number, task: Function) {
  log(`Task "${name}" with interval ${interval} msec started.`);
  setInterval(task, interval);
}
