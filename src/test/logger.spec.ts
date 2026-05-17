import { createLogger } from '../core/logger';

describe('Logger', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  it('should log message', () => {
    const log = createLogger();
    log('INFO', 'Test message.');
    expect(consoleSpy).toHaveBeenCalled();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('[js-logger] INFO'),
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Test message.'),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
