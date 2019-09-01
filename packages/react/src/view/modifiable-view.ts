import { DisposableBean } from "@mvcs/core";
import { Action, Mutable } from "tstt";
import { Mutation } from "../mutation";
import { DefaultView } from "./default-view";
import { ReactModifiableView } from "./react-modifiable-view";

export namespace ModifiableView {
  export interface Hooks {
    /** Hook to invoke when {@link ModifiableView#commit} occurs. */
    commit: Action;
  }
}

/**
 * Default implementation of the {@link ReactModifiableView}.
 */
export class ModifiableView<P = any, C = any> extends DefaultView<P, C> implements ReactModifiableView<P, C>, DisposableBean {

  /** State accumulated by {@link #commit} calls.  */
  readonly state: Partial<P> = {};

  /** Hooks for reacting on view modifications. */
  readonly hooks: ModifiableView.Hooks;

  constructor(hooks?: Partial<ModifiableView.Hooks>) {
    super();
    this.state = {};
    this.hooks = hooks ? {
      ...defaultHooks,
      ...hooks,
    } : defaultHooks;
  }

  /** @inheritDoc */
  set<K extends keyof P>(key: K, value: P[K]) {
    if (this.state[key] !== value) {
      this.state[key] = value;
      this.hooks.commit();
    }
  }

  /** @inheritDoc */
  commit<T extends any[]>(mutation: Mutation<P, T>, ...args: T): void {
    if (mutation(this.state as P, ...args) !== false)
      this.hooks.commit();
  }

  /** @inheritDoc */
  commitBy<O, T extends any[]>(by: O, mutation: Mutation<P, T, O>, ...args: T): void {
    if ((mutation as Function).call(by, this.state as P, ...args) !== false)
      this.hooks.commit();
  }

  /** @inheritDoc */
  destroy(this: Mutable<ModifiableView>) {
    this.state = null;
    this.hooks = null;
  }
}

/** Hooks to use by default to avoid null checks. */
const defaultHooks: ModifiableView.Hooks = {
  commit() { },
};
