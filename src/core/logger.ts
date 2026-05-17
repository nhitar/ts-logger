import { config } from "./config";

export function createLogger() {
  return function(level: string = "info", message: string) {
    const timestamp: string = new Date().toISOString().split('.')[0];
    console.log(`[${config.appName} ${level}]`, timestamp, message);
  };
}
