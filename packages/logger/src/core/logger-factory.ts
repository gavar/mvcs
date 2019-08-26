import { Logger } from "./logger";

/**
 * Manufactures logger instances.
 */
export interface LoggerFactory {
  /**
   * Get an appropriate {@link Logger} instance as specified by the {@param name} parameter.
   * @param name - the name of the Logger to return.
   * @returns a logger instance.
   */
  getLogger(name: string): Logger;
}

export namespace LoggerFactory {
  /**
   * Logger factory providing loggers.
   * @default ConsoleLoggerFactory
   */
  export let factory: LoggerFactory;

  /**
   * Return a logger named corresponding to the type passed as parameter,
   * using the statically bound {@link LoggerFactory} instance.
   * @param type - the returned logger will be named after class or function.
   * @returns a logger instance.
   */
  export function getLogger(type: Function): Logger;

  /**
   * Return a logger named corresponding to the type of given instance
   * using the statically bound {@link LoggerFactory} instance.
   * @param object - the returned logger will be named after instance class.
   * @returns a logger instance.
   */
  export function getLogger(object: { constructor: Function }): Logger;

  /**
   * Get a logger named according to the name parameter,
   * using the statically bound {@link LoggerFactory} instance.
   * @param name - the name of the logger.
   * @returns a logger instance.
   */
  export function getLogger(name: string): Logger;

  /** @internal */
  export function getLogger(type: any): Logger {
    const {factory} = LoggerFactory;

    if (arguments.length < 1)
      return factory.getLogger("");

    if (typeof type === "string")
      return factory.getLogger(type);

    if (typeof type === "function")
      return factory.getLogger(type.name);

    if (type && typeof type.constructor === "function")
      return factory.getLogger(type.constructor.name);

    return factory.getLogger(String(type));
  }
}
