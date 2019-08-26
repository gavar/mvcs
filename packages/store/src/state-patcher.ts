/***
 * Function provides values to assign to the current state relying on previous values.
 */
export interface StatePatcher<S = any, T extends any[] = never> {
  /**
   * Calculate state to assign to the current state.
   * @param prev - previous state.
   * @param args - extra arguments provided by a caller.
   * @returns state to assign to the current state.
   */
  (prev: Readonly<S>, ...args: T): Partial<S>;
}
