import { EventListener } from "./event-listener";
import { EventDef } from "./event-name";

/**
 * Represents an event container with fluent event subscription.
 */
export interface EventBinder {
  /**
   * Create configurable event binding for the event with given name.
   * @param name - identifies the event to subscribe for.
   * @return event configurer, which provides fine-tune adjustments.
   */
  listen<T extends any[]>(name: EventDef<T>): EventBindingConfigurer<T>;
}

/**
 * Represents API for fine tune event configuration.
 */
export interface EventBindingConfigurer<T extends any[] = any> extends EventBindingBySyntax<T>, EventBindingTimesSyntax<T> {

}

export interface EventBindingBySyntax<T extends any[] = any> {
  /**
   * Finalize configuration process by subscribing event given listener.
   * @param listener - listener function to call whenever event occurs.
   * @param target - target to invoke listener on.
   * @return event binding which control event lifecycle.
   */
  by(listener: EventListener<T>, target?: any): EventBinding<T>;
}

export interface EventBindingTimesSyntax<T extends any[] = any> {
  /** Configure event listener to be invoked only once. */
  once(): EventBindingBySyntax<T>;
}

/**
 * Represents object which controls lifecycle of single event listener.
 */
export interface EventBinding<T = any> {
  /** Stop listening for an event. */
  pause(): void;

  /** Continue listening for an event. */
  resume(): void;

  /** Remove event listener from the event container. */
  destroy(): void;
}
