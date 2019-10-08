import { BeanType, Mediator } from "@mvcs/core";
import { Store } from "@mvcs/store";
import { ComponentClass, ComponentType, Context } from "react";
import { Newable, RequiredKeys } from "tstt";
import { BeanConnect } from "../bean";
import { MediatorConnect, MediatorProvidePropsType } from "../mediator";
import { displayNameOf, EnhanceType } from "@mvcs/react-core";
import { ReactView } from "../view";
import { argumentNotNull, asKeyPicker, KeyMap, keymapPicker, keysPicker } from "./connect-utils";
import { ContextConnect } from "./context-connect";
import { Dispatch, DispatchToProps } from "./emitter-connect";
import { StoreConnectOptions } from "./store-connect";
import { ShouldUpdateStrategy, ViewConnect, ViewConnectOptions } from "./view-connect";

export function connect<P>(view: ComponentType<P>): Connect<P, RequiredKeys<P>> {
  return new ConnectConfigurer(view);
}

/**
 * Fluent API for configuring how particular view is connected to an application.
 * @template P - properties types of the connected component.
 * @template R - keys that are required in props.
 */
export interface Connect<P, R extends keyof P> {
  /**
   * Use given values by default.
   * Think of {@link ComponentClass#defaultProps} which are applied before from other sources property merging.
   * @param props - props to use by default.
   */
  withProps<K extends keyof P>(
    props: Pick<P, K>,
  ): ConnectKeys<P, R, K>;

  /**
   * Use properties from context of a particular type.
   * @param contextType - type of context to get properties from.
   * @param contextToProps - function mapping context values to component props.
   */
  withContext<C, K extends keyof P>(
    contextType: Context<C>,
    contextToProps: (context: C, own: Readonly<P>) => Pick<P, K>,
  ): ConnectKeys<P, R, K>;

  /**
   * Use context value as component property key.
   * @param contextType - type of context to provide by property key.
   * @param key - name of the property for the context values.
   */
  withContextAsKey<C extends P[K], K extends keyof P>(
    contextType: Context<C>, key: K,
  ): ConnectKeys<P, R, K>;

  /**
   * Use properties from {@link ChildContextProvider legacy context provider}.
   * @param contextToProps - function mapping context values to component props.
   */
  withLegacyContext<C, K extends keyof P>(
    contextToProps: (context: C, own: Readonly<P>) => Pick<P, K>,
  ): ConnectKeys<P, R, K>;

  /**
   * Bind component props to event dispatch function.
   * @param dispatchToProps - function mapping `dispatch` to component props.
   */
  withDispatch<K extends keyof P>(
    dispatchToProps: (dispatch: Dispatch, view: ReactView<P>) => Pick<P, K>,
  ): ConnectKeys<P, R, K>;

  /**
   * Use properties from a store of a particular type.
   * @param storeType - type of the store.
   * @param stateToProps - function mapping store state to component props.
   */
  withStore<S, K extends keyof P>(
    storeType: BeanType<Store<S>>,
    stateToProps: (state: S, own: Readonly<P>) => Pick<P, K>,
  ): ConnectKeys<P, R, K>;

  /**
   * Use properties from a store of a particular type.
   * @param storeType - type of the store.
   * @param keys - array of keys to copy from store state to component props.
   */
  withStoreKeys<S extends Pick<P, K>, K extends keyof P & keyof S>(
    storeType: BeanType<Store<S>>, keys: K[],
  ): ConnectKeys<P, R, K>;

  /**
   * Use properties from a store of a particular type.
   * @param storeType - type of the store.
   * @param keymap - mapping of store state keys to component props keys.
   */
  withStoreKeyMap<S, K extends keyof P>(
    storeType: BeanType<Store<S>>, keymap: KeyMap<K, S>,
  ): ConnectKeys<P, R, K>;

  /**
   * Use properties from a bean of a particular type.
   * @param beanType - type of the bean.
   * @param beanToProps - function mapping bean to component props.
   */
  withBean<B, K extends keyof P>(
    beanType: BeanType<B>,
    beanToProps: (bean: B, view: ReactView<P>) => Pick<P, K>,
  ): ConnectKeys<P, R, K>;

  /**
   * Use properties from a bean of a particular type.
   * @param beanType - type of the bean.
   * @param keys - array of keys to copy from bean to component props.
   */
  withBeanKeys<B extends Pick<P, K>, K extends keyof P & keyof B>(
    beanType: BeanType<B>, keys: K[],
  ): ConnectKeys<P, R, K>;

  /**
   * Use properties from a bean of a particular type.
   * @param beanType - type of the bean.
   * @param keymap - mapping of bean keys to component props keys.
   */
  withBeanKeyMap<B, K extends keyof P>(
    beanType: BeanType<B>, keymap: KeyMap<K, B>,
  ): ConnectKeys<P, R, K>;

  /**
   * Create mediator instance per every component instance.
   * @param mediatorType - type of the mediator to create.
   */
  withMediator<M extends Mediator<ReactView<Partial<P>>>>(
    mediatorType: Newable<M>,
  ): ConnectProps<P, R, MediatorProvidePropsType<M>>;

  /**
   * Create mediator instance per every component instance.
   * @param mediatorType - type of the mediator to create.
   * @param mediatorToProps - function mapping mediator to component props.
   */
  withMediator<M extends Mediator<ReactView<Partial<P>>>, K extends keyof P>(
    mediatorType: Newable<M>,
    mediatorToProps: (mediator: M) => Pick<P, K>,
  ): ConnectKeys<P, R, K>;

  /**
   * Create mediator instance per every component instance.
   * @param mediatorType - type of the mediator to create.
   * @param keys - array of keys to copy from mediator to component props.
   */
  withMediatorKeys<M extends Mediator<ReactView<Partial<P>>> & Pick<P, K>, K extends keyof P & keyof M>(
    mediatorType: Newable<M>, keys: K[],
  ): ConnectKeys<P, R, K>;

  /**
   * Create mediator instance per every component instance.
   * @param mediatorType - type of the mediator to create.
   * @param keymap - mapping of mediator keys to component props keys.
   */
  withMediatorKeyMap<M extends Mediator<ReactView<Partial<P>>>, K extends keyof P>(
    mediatorType: Newable<M>, keymap: KeyMap<K, M>,
  ): ConnectKeys<P, R, K>;

  /**
   * Configure view to use particular strategy for checking whether it should re-render or not.
   * @param strategy - strategy to use.
   */
  withShouldUpdateStrategy(strategy: ShouldUpdateStrategy): this;

  /** Create component which will render view with configured props. */
  compose(): ComponentClass<Pick<P, R> & Partial<P>>;
}

export type ConnectKeys<P, R extends keyof P, K> = Connect<P, Exclude<R, K>>;
export type ConnectProps<P, R extends keyof P, T extends {}> = Connect<P, Exclude<R, RequiredKeys<T>>>;

/** Default implementation of the {@link Connect} API. */
class ConnectConfigurer<P, R extends keyof P> implements Connect<P, R>, ViewConnectOptions<P> {

  /** @inheritDoc */
  readonly view: EnhanceType<P> & ComponentClass<P>;

  /** @inheritDoc */
  props: Partial<P>;

  /** @inheritDoc */
  byBean: Array<BeanConnect<P>>;

  /** @inheritDoc */
  byStore: StoreConnectOptions[];

  /** @inheritDoc */
  byContext: Array<ContextConnect<P>>;

  /** @inheritDoc */
  byDispatch: Array<DispatchToProps<P>>;

  /** @inheritDoc */
  byMediators: Array<MediatorConnect<P>>;

  /** @inheritDoc */
  shouldUpdateStrategy: ShouldUpdateStrategy;

  constructor(view: ComponentType<P>) {
    this.view = view as any;
  }

  /** @inheritDoc */
  withProps<K extends keyof P>(props: Pick<P, K>) {
    argumentNotNull(props, "props");
    this.props = this.props
      ? Object.assign(this.props, props)
      : props as Partial<P>;
    return this as any;
  }

  /** @inheritDoc */
  withContext<C, K extends keyof P>(contextType: Context<C>, contextToProps: (context: C, own: Readonly<P>) => Pick<P, K>) {
    argumentNotNull(contextType, "contextType");
    argumentNotNull(contextToProps, "contextToProps");
    this.byContext = this.byContext || [];
    this.byContext.push({contextType, contextToProps});
    return this as any;
  }

  /** @inheritDoc */
  withContextAsKey<C extends P[K], K extends keyof P>(contextType: Context<C>, key: K) {
    argumentNotNull(key, "key");
    return this.withContext(contextType, asKeyPicker(key));
  }

  /** @inheritDoc */
  withLegacyContext<C, K extends keyof P>(contextToProps: (context: C, own: Readonly<P>) => Pick<P, K>) {
    argumentNotNull(contextToProps, "contextToProps");
    this.byContext = this.byContext || [];
    this.byContext.push({contextToProps});
    return this as any;
  }

  /** @inheritDoc */
  withDispatch<K extends keyof P>(dispatchToProps: (dispatch: Dispatch, view: ReactView<P>) => Pick<P, K>) {
    argumentNotNull(dispatchToProps, "dispatchToProps");
    this.byDispatch = this.byDispatch || [];
    this.byDispatch.push(dispatchToProps);
    return this as any;
  }

  /** @inheritDoc */
  withStore<S, K extends keyof P>(storeType: BeanType<Store<S>>, stateToProps: (state: S, own: Readonly<P>) => Pick<P, K>) {
    argumentNotNull(storeType, "storeType");
    argumentNotNull(stateToProps, "stateToProps");
    const options = {storeType, stateToProps} as StoreConnectOptions;
    this.byStore = this.byStore || [];
    this.byStore.push(options);
    return this as any;
  }

  /** @inheritDoc */
  withStoreKeys<S extends Pick<P, K>, K extends keyof P & keyof S>(storeType: BeanType<Store<S>>, keys: K[]) {
    return this.withStore(storeType, keysPicker(keys));
  }

  /** @inheritDoc */
  withStoreKeyMap<S, K extends keyof P>(storeType: BeanType<Store<S>>, keymap: KeyMap<K, S>) {
    return this.withStore(storeType, keymapPicker(keymap));
  }

  /** @inheritDoc */
  withBean<B, K extends keyof P>(beanType: BeanType<B>, beanToProps: (bean: B, view: ReactView<P>) => Pick<P, K>) {
    argumentNotNull(beanType, "beanType");
    argumentNotNull(beanToProps, "beanToProps");
    this.byBean = this.byBean || [];
    this.byBean.push({beanType, beanToProps});
    return this as any;
  }

  /** @inheritDoc */
  withBeanKeys<B extends Pick<P, K>, K extends keyof P & keyof B>(beanType: BeanType<B>, keys: K[]) {
    return this.withBean(beanType, keysPicker(keys));
  }

  /** @inheritDoc */
  withBeanKeyMap<B, K extends keyof P>(beanType: BeanType<B>, keymap: KeyMap<K, B>) {
    return this.withBean(beanType, keymapPicker(keymap));
  }

  /** @inheritDoc */
  withMediator<M extends Mediator<ReactView<Partial<P>>>, K extends keyof P>(mediatorType: Newable<M>, mediatorToProps?: (mediator: M) => Pick<P, K>) {
    argumentNotNull(mediatorType, "mediatorType");
    this.byMediators = this.byMediators || [];
    this.byMediators.push({mediatorType, mediatorToProps});
    return this as any;
  }

  /** @inheritDoc */
  withMediatorKeys<M extends Mediator<ReactView<Partial<P>>> & Pick<P, K>, K extends keyof P & keyof M>(mediatorType: Newable<M>, keys: K[]) {
    return this.withMediator(mediatorType, keysPicker(keys));
  }

  /** @inheritDoc */
  withMediatorKeyMap<M extends Mediator<ReactView<Partial<P>>>, K extends keyof P>(mediatorType: Newable<M>, keymap: KeyMap<K, M>) {
    return this.withMediator(mediatorType, keymapPicker(keymap));
  }

  /** @inheritDoc */
  withShouldUpdateStrategy(strategy: ShouldUpdateStrategy) {
    this.shouldUpdateStrategy = strategy;
    return this;
  }

  /** @inheritDoc */
  compose() {
    const type: EnhanceType<P> = class extends ViewConnect<P> {};
    type.prototype.options = Object.seal(this);
    type.source = this.view.source || this.view;
    type.displayName = `${displayNameOf(type.source)}Connect`;
    if (this.view.contextType) type.contextType = this.view.contextType;
    return type as any;
  }
}
