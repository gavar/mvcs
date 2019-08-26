import { AbstractLoggerFactory, Logger } from "..";
import { ConsoleLogger, ConsoleLoggerOptions } from "./console-logger";

/**
 * Factory of {@link ConsoleLogger}.
 */
export class ConsoleLoggerFactory extends AbstractLoggerFactory {

  /** Options to use for newly created {@link ConsoleLogger}. */
  public readonly options: Partial<ConsoleLoggerOptions> = {};

  constructor(options?: Partial<ConsoleLoggerOptions>) {
    super();
    this.options = options || {};
  }

  /** @inheritDoc */
  protected createLogger(name: string): Logger {
    return new ConsoleLogger(name, void 0, this.options);
  }
}
