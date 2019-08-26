import { format } from "util";
import { AbstractLogger, consolePrint, isFormatString, Level, LevelType } from "../core";

export interface ConsoleLoggerOptions {

  /** Whether to include current time in output message. */
  showTime: boolean;

  /** Whether to include logging level in output message. */
  showLevel: boolean;

  /** Whether to include logger name in output message. */
  showName: boolean;
}

/**
 * Logger writing messages to the {@link console}.
 * Designed for s
 */
export class ConsoleLogger extends AbstractLogger {

  /** Logging options of this logger. */
  public readonly options: ConsoleLoggerOptions;

  constructor(name: string, level?: Level, options?: Partial<ConsoleLoggerOptions>) {
    super(name, level);
    this.options = {
      showTime: true,
      showLevel: true,
      showName: true,
      ...options,
    };
  }

  /** @inheritDoc */
  protected print(level: Level, message: string, params: any[]): void {
    // do not p
    if (this.level >= level) {
      // format
      if (isFormatString(message)) {
        message = format(message, params);
        params = null;
      }
      // prefix
      const {showTime, showLevel, showName} = this.options;
      if (showTime || showLevel || showName) {
        const prefix = [];
        if (showTime) prefix.push(new Date().toISOString().substring(11, 23));
        if (showLevel) prefix.push(this.level.name);
        if (showName) prefix.push(this.name);
        message = `${prefix.join(" ")}: ${message}`;
      }
      // print
      consolePrint(level.name as LevelType, message, ...params);
    }
  }
}
