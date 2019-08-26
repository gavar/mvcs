import { Abstract } from "tstt";
import { Logger } from "./logger";
import { LoggerFactory } from "./logger-factory";
import defineProperty = Reflect.defineProperty;
import getPrototypeOf = Reflect.getPrototypeOf;

const stack: any[] = [];
const configs = new WeakMap<any, any>();

/**
 * Inject logger to a given target object.
 * @param target - target consuming logger.
 */
export function logging(target: Abstract): void {
  const {prototype} = target;
  const config = stack.length && stack.pop();
  if (config) configs.set(prototype, config);

  // logger already injected?
  if (Reflect.has(prototype, "logger"))
    return;

  // lazy logger
  defineProperty(prototype, "logger", {
    enumerable: true,
    configurable: true,
    get: getLogger,
    set: setLogger,
  });
}

export namespace logging {
  /**
   * Inject logger with provided configuration.
   * @param name - name of the logger to use.
   */
  export function $(name: string): ClassDecorator {
    stack.push(name);
    return logging;
  }
}

function getLogger(this: Abstract): Logger {
  // TODO: get logger factory from context
  const prototype = getPrototypeOf(this);
  const name = configs.get(prototype);
  const logger = name && LoggerFactory.getLogger(name) || LoggerFactory.getLogger(this);
  setLogger.call(prototype as any, logger);
  return logger;
}

function setLogger(this: Abstract, value: Logger) {
  defineProperty(this, "logger", {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}
