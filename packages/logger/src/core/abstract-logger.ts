import { Level } from "./level";
import { Logger } from "./logger";

/**
 * Base class for loggers for ease of implementation.
 */
export abstract class AbstractLogger implements Logger {

  /** @inheritDoc */
  readonly name: string;

  /** @inheritDoc */
  readonly level: Level;

  /** @inheritDoc */
  readonly isTrace: boolean;

  /** @inheritDoc */
  readonly isDebug: boolean;

  /** @inheritDoc */
  readonly isInfo: boolean;

  /** @inheritDoc */
  readonly isWarn: boolean;

  /** @inheritDoc */
  readonly isError: boolean;

  /** @inheritDoc */
  readonly isFatal: boolean;

  constructor(name: string, level?: Level) {
    this.name = name;
    this.level = level = level || Level.INFO;
    if (level >= Level.FATAL) this.isFatal = true;
    if (level >= Level.ERROR) this.isError = true;
    if (level >= Level.WARN) this.isWarn = true;
    if (level >= Level.INFO) this.isInfo = true;
    if (level >= Level.DEBUG) this.isDebug = true;
    if (level >= Level.TRACE) this.isTrace = true;
  }

  /** @inheritDoc */
  isLevel(level: Level): boolean {
    return this.level >= level;
  }

  /** @inheritDoc */
  trace(message: string, ...params: any[]): void {
    this.print(Level.TRACE, message, params);
  }

  /** @inheritDoc */
  debug(message: string, ...params: any[]): void {
    this.print(Level.DEBUG, message, params);
  }

  /** @inheritDoc */
  info(message: string, ...params: any[]): void {
    this.print(Level.INFO, message, params);
  }

  /** @inheritDoc */
  warn(message: string, ...params: any[]): void {
    this.print(Level.WARN, message, params);
  }

  /** @inheritDoc */
  error(message: string, ...params: any[]): void {
    this.print(Level.ERROR, message, params);
  }

  /** @inheritDoc */
  fatal(message: string, ...params: any[]): void {
    this.print(Level.FATAL, message, params);
  }

  /** @inheritDoc */
  log(level: Level, message: string, ...params: any[]): void {
    this.print(level, message, params);
  }

  /** Write message to the underlying log. */
  protected abstract print(level: Level, message: string, params: any[]): void;
}
