import { EventBinding, EventBindingConfigurer } from "./event-binder";
import { EventEmitter } from "./event-emitter";
import { EventListener } from "./event-listener";
import { EventDef, EventKey, eventTypeOf } from "./event-name";

/** Default implementation of {@link EventEmitter}. */
export class DefaultEventEmitter implements EventEmitter {

  private bindings: Record<string, BindingList>;

  /** @inheritDoc */
  emit<T extends any[]>(name: EventDef<T>, ...args: T): void {
    // search for bindings
    const bindings = this.bindingsOf(name, false);
    if (!bindings) return;
    try {
      // lock to avoid modifications
      bindings.lock++;

      for (let i = 0, size = bindings.length; i < size; i++) {
        const binding = bindings[i];

        // skip empty or inactive
        if (!binding || binding.inactive)
          continue;

        // countdown invocations
        if (binding.times !== null)
          binding.times--;

        // invoke (null >= 0 -> true)
        if (binding.times >= 0)
          binding.listener.apply(binding.target, args);

        // evict if out of invocations
        if (binding.times === 0 || binding.times < 0) {
          bindings[i] = null;
          bindings.dirty = true;
        }

      }
    } finally {
      // unlock and try to clean
      bindings.lock--;
      tidy(bindings);
    }
  }

  /**
   * Add event bindings to this emitter.
   * @param binding - event binding to add.
   */
  addEventBinding<T extends any[]>(binding: DefaultEventBinding<T>): void {
    this.bindingsOf<T>(binding, true).push(binding);
  }

  /** @inheritDoc */
  listen<T extends any[]>(name: EventDef<T>): EventBindingConfigurer<T> {
    return new DefaultEventBinding(this, name);
  }

  /** @inheritDoc */
  addEventListener<T extends any[]>(name: EventDef<T>, listener: EventListener<T>, target?: any): void {
    const binding = new DefaultEventBinding(this, name);
    binding.listener = listener;
    if (target) binding.target = target;
    this.addEventBinding(binding);
  }

  /** @inheritDoc */
  removeEventListener(name: EventDef, listener: EventListener, target: any): void {
    // check if any binding exists
    const bindings = this.bindingsOf(name, false);
    if (!bindings || !bindings.length) return;

    // remove all that match
    for (let i = 0; i < bindings.length; i++) {
      const binding = bindings[i];
      if (binding.target !== target) continue;
      if (binding.listener !== listener) continue;

      // clear and remove binding reference
      bindings[i] = null;
      bindings.dirty = true;
      binding.clear();
    }

    // try to clean
    tidy(bindings);
  }

  /**
   * Get array of bindings associated with provided event identity.
   * @param name - event identity.
   * @param create - whether to create bindings array if not created yet.
   */
  private bindingsOf<T extends any[]>(name: EventDef<T>, create: true): BindingList<T>;

  /**
   * Get array of bindings associated with provided event identity.
   * @param name - event identity.
   * @param create - whether to create bindings array if not created yet.
   */
  private bindingsOf<T extends any[]>(name: EventDef<T>, create: false): BindingList<T> | void;

  /**
   * Get array of bindings associated with provided event identity.
   * @param name - event identity.
   * @param create - whether to create bindings array if not created yet.
   */
  private bindingsOf<T extends any[]>(name: EventDef<T>, create: boolean): BindingList<T> | void {
    // check if there is any event
    if (!this.bindings)
      if (create) this.bindings = {};
      else return;

    // resolve key, fallback to '*' event type
    const type = eventTypeOf(name) || "*";

    // by type
    let byType = this.bindings[type];
    if (!byType && create) {
      byType = createBindingList();
      this.bindings[type] = byType;
    }

    return byType;
  }
}

function createBindingList<T extends any[] = any>(): BindingList<T> {
  const list = [] as BindingList<T>;
  list.lock = 0;
  list.dirty = false;
  return list;
}

interface BindingList<T extends any[] = any> extends Array<DefaultEventBinding<T>> {
  /** Lock list from being resized */
  lock: number;

  /** Dirty flag for requesting cleanup. */
  dirty: boolean;
}

/** Tidy-up list by removing all null or empty items. */
function tidy<T extends any[]>(list: BindingList<T>) {
  // abstain if locked or clean
  if (list.lock || !list.dirty)
    return;

  for (let i = 0, size = list.length; i < size; i++) {
    // continue if not null or empty slot
    if (list[i])
      continue;

    // fill empty slot
    const last = list.pop();
    if (i < list.length)
      list[i--] = last;
  }

  // mark as clean
  list.dirty = false;
}

class DefaultEventBinding<T extends any[] = any> implements EventKey<T>, EventBindingConfigurer<T>, EventBinding<T> {

  private emitter: DefaultEventEmitter;

  constructor(emitter: DefaultEventEmitter, event: EventDef<T>) {
    this.type = eventTypeOf(event);
    this.emitter = emitter;
    this.times = null;
  }

  /** @inheritDoc */
  public type: string;

  public inactive: boolean;
  public listener: EventListener<T>;
  public times: number;
  public target?: any;

  /** @inheritDoc */
  once() {
    this.times = 1;
    return this;
  }

  /** @inheritDoc */
  by(listener: EventListener<T>, target?: any): EventBinding<T> {
    this.listener = listener;
    this.target = target;
    this.emitter.addEventBinding(this);
    return this;
  }

  /** @inheritDoc */
  pause(): void {
    this.inactive = true;
  }

  /** @inheritDoc */
  resume(): void {
    this.inactive = false;
  }

  /** Clear all fields. */
  clear(): void {
    this.target = null;
    this.emitter = null;
    this.listener = null;
  }

  /** @inheritDoc */
  destroy(): void {
    this.inactive = true;
    this.emitter.removeEventListener(this, this.listener, this.target);
    this.clear();
  }
}
