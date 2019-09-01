import { EventBinder } from "./event-binder";
import { EventContainer } from "./event-container";
import { EventDef } from "./event-name";

/**
 * provides possibility to emit events,
 * additionally to {@link EventContainer} functionality.
 */
export interface EventEmitter extends EventBinder, EventContainer {
  /**
   * Synchronously calls each of the listeners registered for the event identified by {@param name}.
   * Listener invocation occurs in the order they were registered.
   *
   * @param name - identifies the event to invoke listeners for.
   * @param args - event arguments to supply for each event listener.
   */
  emit<T extends any[]>(name: EventDef<T>, ...args: T): void;
}

export namespace EventEmitter {
  export declare const BeanType: EventEmitter;
  export const BeanName = "EventEmitter";

  /** Global shared instance of {@link EventEmitter}. */
  export let shared: EventEmitter;
}
