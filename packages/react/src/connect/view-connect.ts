import { closure } from "@emulsy/annotation";
import { shallowDiffers } from "@emulsy/compare";
import { beanDestroyer, BeanDestroyErrorHandler, Mediator, MediatorErrorHandlerObject } from "@mvcs/core";
import { EventDef, EventEmitter } from "@mvcs/event";
import { inject } from "@mvcs/injector";
import { Logger, logging } from "@mvcs/logger";
import { StoreListenerBinding } from "@mvcs/store";
import { Component, ComponentType, Ref, RefObject } from "react";
import { Mutable } from "tstt";
import { BeanConnect, InjectorComponent } from "../bean";
import { MediatorConnect, ReactViewMediator } from "../mediator";
import { scheduleUpdate, Toggling } from "@mvcs/react-core";
import { ModifiableView } from "../view";
import { DispatchToProps } from "./emitter-connect";
import { StoreConnect, StoreConnectOptions } from "./store-connect";
import { ContextConnect } from "./context-connect";

type WithRef<P> = P & { ref?: Ref<any>; };

/**
 * Component that merges properties for various sources configured by {@link ViewConnectOptions}.
 */
@logging
export class ViewConnect<P = unknown> extends InjectorComponent<WithRef<P>, Toggling>
  implements MediatorErrorHandlerObject, BeanDestroyErrorHandler {

  /** Application context event dispatcher. */
  @inject(EventEmitter)
  readonly eventDispatcher: EventEmitter;

  // common
  ref: any;
  options: ViewConnectOptions<P>;
  readonly logger: Logger;

  // by own
  private finalProps: WithRef<P>;
  private ownPropsDirty: boolean;

  // by view
  private view: ModifiableView<P>;
  private viewPropsDirty: boolean;

  // by context
  private contextProps: Partial<P>;
  private contextPropsDirty: boolean;

  // by beans
  private beanProps: Partial<P>;

  // by stores
  private stores: StoreListenerBinding[];
  private storeProps: Partial<P>;
  private storePropsDirty: boolean;

  // by dispatch
  private dispatchProps: Partial<P>;

  // by mediators
  private mediators: Array<ReactViewMediator<P>>;
  private mediatorProps: Partial<P>;

  constructor(props: P, context: any, options?: ViewConnectOptions<P>) {
    super(props, context);
    // initialize
    this.ownPropsDirty = true;
    this.options = options || this.options;
    this.view = new ModifiableView({
      commit: this.onViewCommit,
    });
    this.view.update(props, context);

    // by beans
    // TODO: do we need to track props changes to recalculate beanProps?
    if (this.options.byBean)
      this.beanProps = BeanConnect.reduce(this.options.byBean, this.view, this.injector);

    // by stores
    if (this.options.byStore) {
      this.stores = StoreConnect.on(this.injector, this.onStoreChanged, this, this.options.byStore);
      this.storePropsDirty = true;
    }

    // by dispatch
    // TODO: do we need to track props changes to recalculate dispatchProps?
    if (this.options.byDispatch)
      this.dispatchProps = DispatchToProps.reduce(this.dispatch, this.view, this.options.byDispatch);

    // by mediator
    // TODO: do we need to track props changes to recalculate beanProps?
    if (this.options.byMediators) {
      this.mediatorProps = {};
      this.mediators = MediatorConnect.create(this.options.byMediators, this.view, this.mediatorProps, this);
    }

    // initial props
    this.finalProps = this.calculateFinalProps(props);
    Mediator.hookEach(this.mediators, "componentWillMount", this);
  }

  /** @inheritDoc */
  componentDidMount(): void {
    Mediator.hookEach(this.mediators, "componentDidMount", this);
  }

  /** @inheritDoc */
  componentWillReceiveProps(props: Readonly<P>, context: any): void {
    Mediator.hookEach(this.mediators, "componentWillReceiveProps", this, props, context);
  }

  /** @inheritDoc */
  forceUpdate(callBack?: () => void): void {
    this.ownPropsDirty = true;
    this.contextPropsDirty = true;
    super.forceUpdate(callBack);
  }

  /** @inheritDoc */
  shouldComponentUpdate(props: Readonly<P>, state: Toggling, context: any): boolean {
    this.ownPropsDirty = this.ownPropsDirty || shallowDiffers(this.props, props);

    // use update strategy defined by component when strategy not specified explicitly
    if (this.options.shouldUpdateStrategy == null) {
      if (isWithShouldUpdate(this.ref)) {
        const next = this.calculateFinalProps(props);
        return this.ref.shouldComponentUpdate(next, this.ref.state, context);
      }
      return true;
    }

    return this.options.shouldUpdateStrategy === true
      || this.ownPropsDirty
      || this.viewPropsDirty
      || this.storePropsDirty
      || this.contextPropsDirty;
  }

  /** @inheritDoc */
  render() {
    this.view.updateBy(this);
    this.finalProps = this.calculateFinalProps(this.props);
    Mediator.hookEach(this.mediators, "componentRender", this, this.finalProps, this.context);
    return this.view.render(this.options.view, this.finalProps, this.context);
  }

  /** @inheritDoc */
  componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<Toggling>, snapshot?: any): void {
    Mediator.hookEach(this.mediators, "componentDidUpdate", this, prevProps);
  }

  /** @inheritDoc */
  componentWillUnmount(): void {
    // common
    this.ref = null;

    // by view
    this.view = null;
    this.viewPropsDirty = false;

    // by store
    const {stores} = this;
    if (stores) {
      this.stores = null;
      stores.forEach(beanDestroyer, this);
    }

    // by mediator
    const {mediators} = this;
    if (mediators) {
      this.mediators = null;
      this.mediatorProps = null;
      mediators.forEach(Mediator.destroyer, this);
    }
  }

  /** @inheritDoc */
  catchMediatorHookError(error: Error, hook: keyof any, mediator: Mediator) {
    this.logger.error("error while trying to invoke hook '", hook, "' on a mediator", mediator, error);
  }

  /** @inheritDoc */
  catchBeanDestroyError(error: Error, bean: any) {
    this.logger.error("error while destroying bean", bean, error);
  }

  /** Calculate final props to pass into connected component. */
  private calculateFinalProps(own: Readonly<P>): P {
    let {finalProps} = this;

    // track if part of final props changes
    let dirty: boolean = this.ownPropsDirty || this.viewPropsDirty;

    // by context
    if (this.contextPropsDirty || this.ownPropsDirty)
      if (this.updateContextProps(own, true))
        dirty = true;

    // by store
    if (this.storePropsDirty || this.ownPropsDirty)
      if (this.updateStoreProps(own, true))
        dirty = true;

    // should merge?
    if (dirty) {
      // merge props
      finalProps = Object.assign({},
        this.options.props,
        this.contextProps,
        this.beanProps,
        this.storeProps,
        this.dispatchProps,
        this.mediatorProps,
        own,
        this.view.state,
      );

      // overrides
      finalProps.ref = this.setRef;

      // reset flags
      this.viewPropsDirty = false;
    }

    return finalProps;
  }

  private updateStoreProps(own: Readonly<P>, diff: boolean): boolean {
    if (this.stores) {
      const {storeProps} = this;
      this.storePropsDirty = false;
      this.storeProps = StoreConnect.reduce(own, this.stores, this.options.byStore);
      return diff && shallowDiffers(storeProps, this.storeProps);
    }
  }

  private updateContextProps(own: Readonly<P>, diff: boolean): boolean {
    if (this.options.byContext) {
      const {contextProps} = this;
      this.contextPropsDirty = false;
      this.contextProps = ContextConnect.reduce(own, this.context, this.options.byContext);
      return diff && shallowDiffers(contextProps, this.contextProps);
    }
  }

  @closure
  protected setRef(instance: any) {
    this.ref = instance;
    const {ref} = this.props;
    if (typeof ref === "function") (ref as Function)(instance);
    else if (typeof ref === "object") (ref as Mutable<RefObject<any>>).current = instance;
    Mediator.hookEach(this.mediators, "setRef", this, instance);
  }

  @closure
  /** Occurs whenever view commits changes */
  protected onViewCommit() {
    // setting own props dirty just to avoid unnecessary diff of own props
    this.ownPropsDirty = true;
    this.viewPropsDirty = true;
    scheduleUpdate(this);
  }

  /** Occurs whenever any store from the bound stores has been changed. */
  protected onStoreChanged(): void {
    // setting own props dirty just to avoid unnecessary diff of own props
    this.ownPropsDirty = true;
    this.storePropsDirty = true;
    scheduleUpdate(this);
  }

  @closure
  /** Dispatch an event to the application context via {@link eventDispatcher}. */
  protected dispatch<T extends any[]>(name: EventDef<T>, ...args: T): void {
    this.eventDispatcher.emit(name, ...args);
  }
}

type WithShouldUpdate = Pick<Component, "props" | "state" | "shouldComponentUpdate">;
function isWithShouldUpdate(value: any): value is WithShouldUpdate {
  return value
    && typeof (value as WithShouldUpdate).shouldComponentUpdate === "function";
}

export type ShouldUpdateStrategy =
  | "shallow"
  | true
  ;

export interface ViewConnectOptions<P> {
  view: ComponentType<P>;
  props?: Partial<P>;
  byBean: Array<BeanConnect<P>>;
  byStore?: Array<StoreConnectOptions<P>>;
  byContext: Array<ContextConnect<P>>;
  byDispatch?: Array<DispatchToProps<P>>;
  byMediators?: Array<MediatorConnect<P>>;
  shouldUpdateStrategy?: ShouldUpdateStrategy;
}
