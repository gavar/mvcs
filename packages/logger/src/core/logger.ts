import { Level } from "./level";

export interface Logger {

  /** Level of message to allow for logging. */
  readonly level: Level;

  /** Name of this logger instance. */
  readonly name: string;

  readonly isTrace: boolean;
  trace(pattern: string, ...params: any[]): void;
  trace(...params: any[]): void;

  readonly isDebug: boolean;
  debug(pattern: string, ...params: any[]): void;
  debug(...params: any[]): void;

  readonly isInfo: boolean;
  info(pattern: string, ...params: any[]): void;
  info(...params: any[]): void;

  readonly isWarn: boolean;
  warn(pattern: string, ...params: any[]): void;
  warn(...params: any[]): void;

  readonly isError: boolean;
  error(pattern: string, ...params: any[]): void;
  error(...params: any[]): void;

  readonly isFatal: boolean;
  fatal(pattern: string, ...params: any[]): void;
  fatal(...params: any[]): void;

  isLevel(level: Level): boolean;
  log(level: Level, pattern: string, ...params: any[]): void;
  log(level: Level, ...params: any[]): void;
}
