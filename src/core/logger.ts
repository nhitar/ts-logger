import { config } from "./config";

type LoggerLevels = "info" | "warn" | "error" | "debug" | "trace";

function colourOutput(message: string, colour: string) {
  switch(colour) {
    case "red":
      return `\x1b[31m${message}\x1b[0m`;
    case "green": 
      return `\x1b[32m${message}\x1b[0m`;
    default:
      return message;
  }
}

export function createLogger() {
  return function(level: LoggerLevels = "info", message: string) {
    const timestamp: string = new Date().toISOString().split('.')[0];
    const output = `[${config.appName} ${level}] ${timestamp} ${message}`;
    if (level === "warn" || level === "error") {
      console.log(colourOutput(output, "red"));
    } else {
      console.log(colourOutput(output, "green"));
    }
  };
}
