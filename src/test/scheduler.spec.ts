import { scheduleTask } from '../services/scheduler';

describe('Scheduler', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.useFakeTimers();
  });

  it('should schedule task', () => {
    const taskSpy = jest.fn();

    const interval = scheduleTask('run logger', 3000, taskSpy);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[js-logger] INFO'),
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Task "run logger" with interval 3000 msec started.',
      ),
    );

    expect(taskSpy).not.toHaveBeenCalled();

    jest.advanceTimersByTime(3000);

    expect(taskSpy).toHaveBeenCalledTimes(1);

    clearInterval(interval);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });
});
