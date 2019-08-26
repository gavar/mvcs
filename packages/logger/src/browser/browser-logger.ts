import { format } from "util";
import { AbstractLogger, consolePrint, Level, LevelType } from "../core";
import { isFormatString } from "../core";

/**
 * Logger writing messages to the {@link console} designed to be used in browsers.
 * Not converting objects to string so the could be observed as object in browser dev tools.
 */
export class BrowserLogger extends AbstractLogger {

  /** @inheritDoc */
  protected print(level: Level, message: string, params: any[]) {
    if (this.level >= level) {
      const type = level.name as LevelType;
      if (isFormatString(message))
        consolePrint(type, format(message, params));
      else
        consolePrint(type, message, ...params);
    }
  }
}
