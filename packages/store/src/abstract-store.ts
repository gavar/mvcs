import { StatePatcher } from "./state-patcher";
import { Store } from "./store";
import { StoreListener } from "./store-listener";
import { DefaultStoreListenerBinding, StoreListenerBinding } from "./store-listener-binding";

/**
 * Promise which is always resolved.
 * Only for optimizations, since {@link Promise#resolve} always returns new instance.
 */
const RESOLVE = Promise.resolve();

/**
 * Default store which keeps state in memory.
 * Abstract store providing subscription functionality.
 */
export abstract class AbstractStore<S = object> implements Store<S> {

  protected readonly bindings: DefaultStoreListenerBinding[] = [];

  /** @inheritDoc */
  abstract readonly state: Readonly<S>;

  /** @inheritDoc */
  set<K extends keyof S>(key: K, value: S[K]): void | Promise<void> {
    return this.commit(setKey, key, value);
  }

  /** @inheritdoc */
  patch(values: Partial<S>): void | Promise<void>;

  /** @inheritdoc */
  patch<T extends any[]>(
    patcher: (prev: Readonly<S>, ...args: T) => Partial<S>,
    ...args: T
  ): void | Promise<void>;

  /** @internal */
  patch(patch: any, ...args: any[]): void | Promise<void> {
    return this.commit(mutateByPatch, patch, ...args);
  }

  /** @inheritDoc */
  commitKey<K extends keyof S, T extends any[]>(key: K, mutation: (value: S[K], ...args: T) => any | false, ...args: T): void | Promise<void> {
    return this.commit(mutateKey, key, mutation, args);
  }

  /** @inheritDoc */
  abstract commit<T extends any[]>(
    mutation: (state: S, ...args: T) => any | false,
    ...args: T
  ): void | Promise<void>;

  /** @inheritDoc */
  on(listener: StoreListener<S>, target?: object): StoreListenerBinding<S> {
    const binding = new DefaultStoreListenerBinding(this, listener, target);
    this.bindings.push(binding);
    return binding;
  }

  /** @inheritDoc */
  off(listener: StoreListener<S>, target?: object): void {
    const bindings = this.bindings;
    for (let i = 0, size = bindings.length; i < size; i++) {
      const binding = bindings[i];
      if (binding.listener !== listener) continue;
      if (binding.target !== target) continue;
      bindings.splice(i, 1);
      binding.clear();
      return;
    }
  }

  /**
   * Notify subscribers that state has been changed.
   * @param state - current state of the store.
   */
  protected notify(state: Readonly<S>): Promise<void> {
    let size = 0;
    let promises: any | any[];

    for (const binding of this.bindings) {
      try {
        // notify subscribers
        const {listener, target} = binding;
        const promise = listener.call(target, state);

        // accumulate promises
        if (promise && promise.then)
          switch (size++) {
            case 0:
              promises = promise;
              break;
            case 1:
              promises = [promises, promise];
              break;
            default:
              promises.push(promise);
              break;
          }
      } catch (e) {
        console.error(e);
      }
    }

    // do not create promise until required
    if (size < 1) return RESOLVE;
    if (size < 2) return promises;
    return Promise.all<void>(promises as any[]) as any;
  }
}

/**
 * Set key to a particular value.
 * @param state - object to modify.
 * @param key - name of the property to modify.
 * @param value - value to set.
 * @returns true when value have changed; false otherwise.
 */
export function setKey<S, K extends keyof S>(state: S, key: K, value: S[K]): boolean {
  if (state[key] !== value) {
    state[key] = value;
    return true;
  }
  return false;
}

function mutateKey<S, K extends keyof S, T extends any[]>(state: S, key: K,
                                                          mutation: (value: S[K], ...args: T) => any | false,
                                                          args: T): any | false {
  return mutation(state[key], ...args);
}

function mutateByPatch<S, T extends any[]>(state: S, patch: Partial<S> | StatePatcher<S, T>, ...args: T): any | false {
  if (typeof patch === "function")
    patch = patch(state, ...args);

  if (typeof patch === "object")
    Object.assign(state, patch);
  else
    return false;
}
