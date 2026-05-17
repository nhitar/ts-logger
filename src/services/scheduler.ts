import { IntervalError } from "../common/errors";
import { log } from "../core/logger";

export function scheduleTask(name: string, interval: number, task: Function) {
  if (interval <= 0) {
    throw new IntervalError("Invalid interval.");
  }

  log("INFO", `Task "${name}" with interval ${interval} msec started.`);
  return setInterval(task, interval);
}
