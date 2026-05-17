import { scheduleTask } from "../services/scheduler";
import { createLogger } from "../core/logger"

describe("Logger", () => {
  let consoleSpy: jest.SpyInstance;
  
  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });
  
  it("should log message", () => {
    const log = createLogger()
    log("info", "Test message.");
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[js-logger info]"),
      expect.any(String),
      expect.stringContaining("Test message.")
    );
  });

  it("should schedule message", () => {
    const log = createLogger()
    let task = "run logger";
    const interval = scheduleTask(task, 3000, () => {
        log("info", "Test message.");
      });
    expect(consoleSpy).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("[js-logger info]"),
      expect.any(String),
      expect.stringContaining(`Task "${task}"`)
    );
    clearInterval(interval);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
