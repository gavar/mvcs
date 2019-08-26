/***
 * Represents function that mutates properties of an existing state object.
 * Allows to receive custom arguments while updating state.
 */
export interface StateMutation<S = any, T extends any[] = []> {
  /**
   * Mutate state by applying changes from provided arguments.
   * @param state - state to mutate.
   * @param args - extra arguments provided by the invocation.
   * @return should  return `false` if state change notification should be suppressed.
   */
  (state: S, ...args: T): any | false;
}
