/**
 * Defines an event listening function.
 * @template T - type of event arguments.
 */
export interface EventListener<T extends any[] = any> {
  (...args: T): any;
}
