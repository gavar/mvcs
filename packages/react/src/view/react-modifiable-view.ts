import { Mutation } from "../mutation";
import { ReactView } from "./react-view";

/**
 * Additionally to default properties, provides way of altering props, by committing mutations to an own state.
 */
export interface ReactModifiableView<P = unknown, C = unknown> extends ReactView<P, C> {

  /**
   * Modify rendering properties by changing value of the the particular property.
   * @param key - name of the property to modify.
   * @param value - value to set for the property.
   */
  set<K extends keyof P>(key: K, value: P[K]): void;

  /**
   * Commit mutation to the rendering properties.
   * IMPORTANT:
   * - properties provided to a mutation function are only set of accumulated changes but not the actual rendering properties.
   * - make sure you're not using those for evaluating current rendering props.
   *
   * @param mutation - mutation aggregating props to inject over the component provided props.
   * @param args - arguments to pass into mutation.
   */
  commit<T extends any[]>(mutation: Mutation<P, T>, ...args: T): void;

  /**
   * Commit mutation to the rendering properties.
   * Works same as {@link #commit}, but provides possibility to define this argument passed into a mutation function.
   * @param by - this argument to pass into a mutation function.
   * @param mutation - mutation aggregating props to inject over the component provided props.
   * @param args - arguments to pass into mutation.
   */
  commitBy<O, T extends any[]>(by: O, mutation: Mutation<P, T, O>, ...args: T): void;
}
