import { Logger } from "./logger";
import { LoggerFactory } from "./logger-factory";

/**
 * Base class for logger factories, which store created loggers in a cache.
 */
export abstract class AbstractLoggerFactory implements LoggerFactory {

  /** Cache of loggers by name. */
  private readonly loggers: Record<string, Logger> = {};

  /** @inheritDoc */
  getLogger(name: string): Logger {
    // create logger if not exists
    let logger = this.loggers[name];
    if (!logger) {
      logger = this.createLogger(name);
      this.loggers[name] = logger;
    }
    return logger;
  }

  /** Creates new instance of a logger. */
  protected abstract createLogger(name: string): Logger;
}
