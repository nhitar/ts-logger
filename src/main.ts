import { config } from "./core/config.js";
import { log, scheduleTask } from "./services/scheduler.js";

function initScript() {
  log("scheduler.js file started.");
  scheduleTask("run logger", config.intervalMsec, () => {
    log("running.");
  });
}

initScript()
