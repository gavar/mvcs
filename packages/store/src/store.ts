import { StateMutation } from "./state-mutation";
import { StoreListener } from "./store-listener";
import { StoreListenerBinding } from "./store-listener-binding";

/**
 * Store holds the state tree of specific domain.
 */
export interface Store<S = object> {

  /** Gets value of the current state. */
  readonly state: Readonly<S>;

  /**
   * Modify state by changing value of the property by given name.
   * For every call the notification callback will be triggered if value changes.
   * @param key - name of the property to modify.
   * @param value - value to set for the property.
   */
  set<K extends keyof S>(key: K, value: S[K]): void | Promise<void>;

  /**
   * Partially update values of the store state by merging with provided values.
   * @param values - values to assign to the current state.
   * @returns promise which waits until all subscribers has been notified.
   */
  patch(values: Partial<S>): void | Promise<void>;

  /**
   * Partially update values of the store state by merging with return value of the given function.
   * @param patcher - {@link StatePatcher function} that returns values to assign to a current state.
   * @param args - extra arguments to pass to the specified function.
   * @returns promise which waits until all subscribers has been notified.
   */
  patch<T extends any[]>(
    patcher: (prev: Readonly<S>, ...args: T) => Partial<S>,
    ...args: T
  ): void | Promise<void>;

  /**
   * Mutate state by running it through a given mutation function.
   * @param mutation - {@link StateMutation state mutation function}.
   * @param args - additional arguments to pass into mutation function.
   */
  commit<T extends any[]>(
    mutation: (state: S, ...args: T) => any | false,
    ...args: T
  ): void | Promise<void>;

  /**
   * Mutate particular key of the state by running it through a given mutation function.
   * @param key - key of the state to mutate.
   * @param mutation - {@link StateMutation state mutation function}.
   * @param args - additional arguments to pass into mutation function.
   */
  commitKey<K extends keyof S, T extends any[]>(key: K,
    mutation: (value: S[K], ...args: T) => any | false,
    ...args: T
  ): void | Promise<void>;

  /**
   * Subscribe listener for store state modifications.
   * @param listener - listener that handles store modifications.
   * @param target - target to invoke listener on.
   */
  on(listener: StoreListener<S>, target?: object): StoreListenerBinding<S>;

  /**
   * Removes listener previously registered for a store state modifications.
   * @param listener - listener function to remove.
   * @param target - target of the listener function; if it's not given, only listener without target will be removed.
   */
  off(listener: StoreListener<S>, target?: object): void;
}
