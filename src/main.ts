import { config } from "./core/config";
import { log, scheduleTask } from "./services/scheduler";

function initScript() {
  log("info", "scheduler started.");
  scheduleTask("run logger", config.intervalMsec, () => {
    log("info", "running.");
  });
}

initScript()
