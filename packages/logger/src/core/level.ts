/**
 * Type definition of well known logging level types.
 */
export type LevelType =
  | "FATAL"
  | "ERROR"
  | "WARN"
  | "INFO"
  | "DEBUG"
  | "TRACE"
  ;

export class Level {

  static readonly OFF = new Level("OFF", 0);
  static readonly FATAL = new Level("FATAL", 100);
  static readonly ERROR = new Level("ERROR", 200);
  static readonly WARN = new Level("WARN", 300);
  static readonly INFO = new Level("INFO", 400);
  static readonly DEBUG = new Level("DEBUG", 500);
  static readonly TRACE = new Level("TRACE", 600);
  static readonly ALL = new Level("ALL", Number.POSITIVE_INFINITY);

  /** Non-localized name of the level. */
  readonly name: LevelType | string;

  /** Integer value of the level. */
  readonly value: number;

  constructor(name: LevelType | string, value: number) {
    this.name = name;
    this.value = value;
  }

  /** @inheritDoc */
  toString() {
    return this.name;
  }

  /** @inheritDoc */
  valueOf() {
    return this.value;
  }
}
