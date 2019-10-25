import { AbstractStore } from "./abstract-store";

/**
 * Store which keeps state in memory.
 */
export class MemoryStore<S = object> extends AbstractStore<S> {

  /** @inheritDoc */
  state: Readonly<S> = this.getInitialState();

  /** Get initial value of the {@link state}. */
  getInitialState(): S {
    return {} as S;
  }

  /** @inheritDoc */
  commit<T extends any[]>(mutation: (state: S, ...args: T) => any | false, ...args: T): void | Promise<void> {
    if (mutation(this.state, ...args) !== false) {
      this.state = this.beforeApply(this.state) || this.state;
      return this.notify(this.state);
    }
  }

  /**
   * Post process state before applying.
   * @param state - state to process.
   */
  beforeApply(state: S): S | void {
    // stub function
  }
}
