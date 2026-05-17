import { config } from "./core/config";
import { log } from "./core/logger";
import { scheduleTask } from "./services/scheduler";

function initScript() {
  log("INFO", "Scheduler started.");
  scheduleTask("run logger", config.intervalMsec, () => {
    log("INFO", "Running.");
  });
}

initScript()
