/**
 * Event signature definition.
 * Represents all possible ways to define event with explicitly defined payload.
 * @template T - type of event payload data.
 *
 * @see EventKey<T>
 * @see EventName<T>
 */
export type EventDef<T extends any[] = any> = EventName<T> | EventKey<T>;

/**
 * String which represents event type.
 * Explicitly defines type of the event payload by template parameter.
 *
 * @template T - type of event payload data.
 * @see EventKey#type.
 */
export type EventName<T extends any[] = any> = string;

/**
 * Object which identifies event.
 * Explicitly defines type of the event payload by template parameter.
 * @template T - type of event payload data.
 * @see EventName
 */
export interface EventKey<T extends any[] = any> {
  /**
   * Represents the type of the event.
   * @see {@link Event#type}.
   */
  type: string;
}

/**
 * Extra event type value from {@link EventDef}.
 * @param value - string or object with type property.
 */
export function eventTypeOf(value: EventDef): string {
  if (typeof value === "string") return value;
  if (typeof value === "object") return value.type;
}

/** Whether given value satisfy {@link EventKey} interface. */
export function isEventKey(value: Partial<EventKey>): value is EventKey {
  return typeof value === "object"
    && typeof value.type === "string";
}

/** Whether two values of {@link EventKey} have same type. */
export function equalEventKey(a: EventKey, b: EventDef): boolean {
  return eventTypeOf(a) === eventTypeOf(b);
}
