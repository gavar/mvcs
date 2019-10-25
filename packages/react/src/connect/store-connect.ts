import { BeanType } from "@mvcs/core";
import { Injector } from "@mvcs/injector";
import { Store, StoreListener, StoreListenerBinding } from "@mvcs/store";
import { ComponentType, createElement } from "react";
import { Partially } from "tstt";
import { InjectorComponent } from "../bean";

/**
 * @see StorePicker
 * @see StoreInjector
 */
export type StateSelector<S, P, K extends keyof P> =
  | StorePicker<S, P, Pick<P, K>>
  | StoreInjector<S, P, K>
  ;

/**
 * Picks values from a store that should be merged into the component props.
 * @template S - type of the store state.
 * @template P - type of the view properties.
 * @template T - type of the object to be merged into the props.
 */
export interface StorePicker<S, P, T> {
  (state: S, own: Readonly<P>): T;
}

/**
 * Injects store state values by mutating component props.
 * @template S - type of the store state.
 * @template P - type of the view properties.
 * @template K - keys being injected into the view props.
 */
export interface StoreInjector<S, P, K extends keyof P> {
  (state: S, own: Readonly<P>, props: Partial<P>): void;
}

/**
 * Extract props from a given store state by using provided selector.
 * @param selector - selector that extracts props from a state.
 * @param state - state of the store.
 * @param own - component own props.
 * @param props - buffer to fill by selector.
 */
function invoke<S, P, K extends keyof P>(
  selector: StateSelector<S, P, K>,
  state: S, own: Readonly<P>,
  props?: Partial<P>): Partially<P, K> {
  // picker returns object
  if (isPicker(selector))
    return props
      ? Object.assign(props, selector(state, own)) as any
      : selector(state, own);

  // injector mutates
  props = props || {};
  selector(state, own, props);
  return props as Partially<P, K>;
}

/** Whether provided selector returns a props object that should be merged into existing props. */
function isPicker<S, P, K extends keyof P>(selector: StateSelector<S, P, K>): selector is StorePicker<S, P, Pick<P, K>> {
  return selector.length <= 2;
}

/**
 * Properties of the {@link StoreConnect}.
 * @template S - type of the store state.
 * @template P - type of the view properties.
 * @template K - keys being injected into the view props.
 */
export interface StoreConnectOptions<P = unknown, S = unknown, K extends keyof P = never> {

  /** Function which maps store state to view properties. */
  stateToProps: StateSelector<S, P, K>;

  /**
   * Type of the store containing state.
   * Store bean is injected by {@link Injector}.
   */
  storeType: BeanType<Store<S>>;
}

/**
 * Connects component properties to a state from a store.
 * @template P - props of the view component.
 * @template S - state of the store.
 */
export class StoreConnect<P, K extends keyof P, S> extends InjectorComponent<Partially<P, K>, Partial<P>> {
  protected readonly view: ComponentType<P>;
  protected readonly options: StoreConnectOptions<P, S, K>;
  protected readonly bindings: Array<StoreListenerBinding<S>> = [];

  constructor(props: Partially<P, K>, context: any, view: ComponentType<P>, options: StoreConnectOptions<P, S, K>) {
    super(props, context);
    this.view = view;
    this.options = options;
  }

  /** @inheritDoc */
  componentDidMount(): void {
    const {storeType} = this.options;
    const injector = this.injector;
    const store = injector.bean(storeType);
    const binding = store.on(this.onStoreChange, this);
    this.bindings.push(binding);
  }

  /** @inheritDoc */
  render() {
    // merge props
    const props = {
      ...this.state,
      ...this.props,
    };

    // render
    return createElement(this.view, props);
  }

  /** @inheritDoc */
  componentWillUnmount(): void {
    for (const bindings of this.bindings)
      bindings.destroy();
    this.bindings.length = 0;
  }

  protected onStoreChange(state: S) {
    const {stateToProps} = this.options;
    const next = invoke(stateToProps, state, this.props as unknown as Readonly<P>);
    this.setState(next);
  }
}

export namespace StoreConnect {
  /**
   * Subscribe provide listener to list of stores.
   * @param injector - injector to use for resolving store type to an instance.
   * @param listener - listener that handles store modifications.
   * @param target - target to invoke listener on.
   * @param items - list of configurations providing store type to listen for.
   * @return list of bindings for each store.
   */
  export function on<P, S>(
    injector: Injector,
    listener: StoreListener<S>,
    target: object,
    items: ArrayLike<StoreConnectOptions<P, S>>): StoreListenerBinding<S>[] {
    const size = items && items.length || 0;
    if (size <= 0) return;

    const bindings = new Array(size);
    for (let i = 0; i < size; i++) {
      const {storeType} = items[i];
      const store = injector.bean(storeType);
      bindings[i] = store.on(listener, target);
    }
    return bindings;
  }

  /**
   * Reduce result of selecting props from multiple stores into a single object.
   * @param own - component own props.
   * @param bindings - list of the bindings providing store to select props from.
   * @param items - list of options providing state selector by the corresponding index of the binding.
   * @param out - buffer to fill with props from all stores.
   * @return {@link out} object with filled in props or a new object if {@param out} is null.
   */
  export function reduce<P, S>(own: P,
    bindings: ArrayLike<StoreListenerBinding<S>>,
    items: ArrayLike<StoreConnectOptions<P, S>>,
    out?: Partial<P>): Partial<P> {
    const size = bindings && bindings.length || 0;
    for (let i = 0; i < size; i++) {
      const {state} = bindings[i].store;
      const {stateToProps} = items[i];
      out = invoke(stateToProps, state, own, out);
    }
    return out;
  }
}
