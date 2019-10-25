import { EventListener } from "./event-listener";
import { EventDef } from "./event-name";

/**
 * Provides possibility to subscribe to or unsubscribe from events.
 */
export interface EventContainer {
  /**
   * Adds the {@param listener} function to the end of the listeners array for for the event identified by
   * {@param name}. Multiple calls with same combination of {@param name} and {@param listener} will result in the
   * listener being added multiple times.
   * @param name - identifies the event to invoke listeners for.
   * @param listener - listener function to call whenever event occurs.
   * @param target - target to invoke listener on.
   */
  addEventListener<T extends any[]>(name: EventDef<T>, listener: EventListener<T>, target?: any): void;

  /***
   * Removes listener previously registered for same event, callback and target.
   * @param name - identifies the event being removed.
   * @param listener - listener function to remove.
   * @param target - target of the listener function; if it's not given, only listener without target will be removed.
   */
  removeEventListener(name: EventDef, listener: EventListener, target: any): void;
}
