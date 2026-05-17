import { config } from "./config.js";


export function createLogger() {
  return function(...args: unknown[]) {
    console.log(`[${config.appName}]`, ...args);
  };
}
