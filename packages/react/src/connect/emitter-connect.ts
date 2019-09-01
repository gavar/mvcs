import { closure, memoize } from "@emulsy/annotation";
import { EventDef, EventEmitter } from "@mvcs/event";
import { inject } from "@mvcs/injector";
import { ComponentType } from "react";
import { Partially, RequiredKeys } from "tstt";
import { InjectorComponent } from "../bean";
import { DefaultView, ReactView } from "../view";

/**
 * Binds an {@link EventEmitter} to an object that should be merged into the component props.
 * @template P - type of the view properties.
 * @template T - type of the object to be merged into the props.
 */
export interface EventPicker<P, T extends Partial<P>> {
  (dispatch: Dispatch, view: ReactView<P>): T;
}

/**
 * Injects events from an {@link EventEmitter} by mutating component props.
 * @template P - type of the view properties.
 * @template K - keys being injected into the view props.
 */
export interface EventInjector<P, K extends keyof P> {
  (dispatch: Dispatch, view: ReactView<P>, props: Partial<P>): void;
}

export interface Dispatch {
  <T extends any[]>(name: EventDef<T>, ...args: T): void;
}

/** Whether provided selector returns a props object that should be merged into existing props. */
function isPicker<P, K extends keyof P>(selector: DispatchToProps<P, K>): selector is EventPicker<P, Pick<P, K> & Partial<P>> {
  return selector.length <= 2;
}

/**
 * Bind events to components props by using provided selector on given event dispatcher.
 * @param selector - selector that binds event dispatcher events to props.
 * @param dispatch - function providing possibility to dispatch events.
 * @param view - component instance.
 * @param props - optional buffer to fill by selector.
 * @return {@link out} object with filled in props or a new object if {@link out} is null.
 */
function invoke<P, K extends keyof P>(selector: DispatchToProps<P, K>,
                                      dispatch: Dispatch, view: ReactView<P>,
                                      props?: Partial<P>): Partially<P, K> {
  // picker returns object
  if (isPicker(selector))
    return props
      ? Object.assign(props, selector(dispatch, view)) as any
      : selector(dispatch, view);

  // injector mutates
  props = props || {};
  selector(dispatch, view, props);
  return props as Partially<P, K>;
}

/**
 * Merge all of the selector into a single props object.
 * @param dispatch - function providing possibility to dispatch events.
 * @param ref - component state reference.
 * @param selectors - selectors binding events to component callbacks.
 * @param props - props object to fill by given selectors.
 */
function reduce<P>(dispatch: Dispatch,
                   ref: ReactView<P>,
                   selectors: ArrayLike<DispatchToProps<P, any>>,
                   props?: Partial<P>): Partial<P> {
  const size = selectors && selectors.length || 0;
  for (let i = 0; i < size; i++)
    props = invoke(selectors[i], dispatch, ref, props);
  return props;
}

/**
 * Represents a function which maps dispatch function to component props.
 * @see EventPicker
 * @see EventInjector
 */
export type DispatchToProps<P = {}, K extends keyof P = any> =
  | EventPicker<P, Pick<P, K> & Partial<P>>
  | EventInjector<P, K>;

export const DispatchToProps = {
  invoke,
  reduce,
};

/**
 * Connects view properties to a application event dispatcher.
 * @template P - type of view properties.
 * @template R - required keys.
 */
export class EmitterConnect<P, R extends keyof P = RequiredKeys<P>> extends InjectorComponent<Partially<P, R>> {

  /** Application context event dispatcher. */
  @inject(EventEmitter)
  readonly eventDispatcher: EventEmitter;

  protected readonly view: DefaultView<P>;
  protected readonly dispatchProps: Partially<P, R>;
  protected readonly componentType: ComponentType<P>;

  constructor(props: Partially<P, R>, context: any, componentType: ComponentType<P>, dispatchToProps: DispatchToProps<P, R>) {
    super(props, context);
    this.componentType = componentType;
    this.view = new DefaultView();
    this.view.update(props as P, context);
    this.dispatchProps = DispatchToProps.invoke(dispatchToProps, this.dispatch, this.view);
  }

  /** @inheritDoc */
  render() {
    const finalProps = this.calculateFinalProps(this.props);
    return this.view.render(this.componentType, finalProps, this.context);
  }

  @memoize
  protected calculateFinalProps(ownProps: this["props"]): P {
    return {
      ...this.dispatchProps,
      ...ownProps,
    } as P;
  }

  @closure
  /** Dispatch an event to the application context via {@link eventDispatcher}. */
  protected dispatch<T extends any[]>(name: EventDef<T>, ...args: T): void {
    this.eventDispatcher.emit(name, ...args);
  }
}
