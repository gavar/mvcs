import { AbstractLoggerFactory, Logger } from "../core";
import { BrowserLogger } from "./browser-logger";

/**
 * Factory of {@link BrowserLogger}.
 */
export class BrowserLoggerFactory extends AbstractLoggerFactory {

  /** @inheritDoc */
  protected createLogger(name: string): Logger {
    return new BrowserLogger(name);
  }
}
