import { EventBinder, EventBindingConfigurer, EventContainer, EventDef, EventListener } from "@mvcs/event";

/**
 * Keeps track of listeners and provides the ability
 * to unregister all listeners with a single method call.
 */
export interface EventLinker {

  /**
   * List for an event on a given target.
   * @param binder - event binder to from which to listen event.
   * @param name - name of the event to listen.
   *
   * @see EventBinder#listen
   */
  listen<T extends any[]>(binder: EventBinder, name: EventDef<T>): EventBindingConfigurer<T>;

  /**
   * Adds the {@param listener} to a given target container.
   * @param container - event container to which to add event listener.
   * @param name - identifies the event to invoke listeners for.
   * @param listener - listener function to call whenever event occurs.
   * @param target - target to invoke listener on.
   *
   * @see EventContainer#addEventListener
   */
  addListener<T extends any[]>(container: EventContainer, name: EventDef<T>, listener: EventListener<T>, target?: any): void;

  /***
   * Removes listener from the given container.
   * @param container - event container from which to remove event listener.
   * @param name - identifies the event being removed.
   * @param listener - listener function to remove.
   * @param target - target of the listener function; if it's not given, only listener without target will be removed.
   *
   * @see EventContainer#removeEventListener
   */
  removeListener(container: EventContainer, name: EventDef, listener: EventListener, target: any): void;

  /** Unsubscribe all event listeners registered through proxy objects. */
  removeListeners(): void;
}

export namespace EventLinker {
  export declare const BeanType: EventLinker;
  export const BeanName = "EventLinker";
}
