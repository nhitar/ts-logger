import { createLogger } from "../core/logger";

export const log = createLogger();

export function scheduleTask(name: string, interval: number, task: Function) {
  log("info", `Task "${name}" with interval ${interval} msec started.`);
  return setInterval(task, interval);
}
