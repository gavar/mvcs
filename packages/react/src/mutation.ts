/***
 * Represents function that mutates properties of an existing object.
 */
export interface Mutation<S = any, T extends any[] = never, O = any> {
  /**
   * Mutate object by applying changes from provided arguments.
   * @param object - object to mutate.
   * @param args - extra arguments provided by the invocation.
   * @return should return `false` if state change notification should be suppressed.
   */
  (this: O, object: S, ...args: T): void | boolean;
}
