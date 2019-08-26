import { Newable } from "tstt";

/**
 * Listens for view events and reacts in them.
 */
export interface Mediator<V = any> {

  /** View mediated by this instance. */
  readonly view: V;

  /**
   * Set view to mediate by this instance.
   * @param view - view to mediate.
   */
  setView(view: V): void;

  /**
   * Initializes the mediator.
   * This is run automatically when a mediator is created.
   * Normally the initialize function is where you would add handlers.
   */
  initialize?(): void;

  /**
   * Destroys the mediator.
   * This is run automatically when a mediator is destroyed.
   * You should clean up any handlers that were added directly.
   */
  destroy?(): void;
}

export namespace Mediator {
  /**
   * Create new instance of the mediator and assign self as view.
   * Specially designed for {@link Array.map}, where view is the last argument.
   * @see MediatorLifecycle.preInitialize
   * @see MediatorLifecycle.setView
   * @see MediatorLifecycle.initialize
   * @see MediatorLifecycle.postInitialize
   */
  export function create<M extends Mediator<V>, V>(type: Newable<M>, view: V, errorHandler?: MediatorErrorHandlerObject): M {
    const mediator: MediatorLifecycle<V> = new type();
    hook(mediator, "preInitialize", errorHandler);
    hook(mediator, "setView", errorHandler, view);
    hook(mediator, "initialize", errorHandler);
    hook(mediator, "postInitialize", errorHandler);
    return mediator as M;
  }

  /**
   * Function to pass as iterative callback in order to destroy given mediator.
   * @param mediator - mediator to destroy.
   * @see Mediator#destroy
   * @see MediatorLifecycle#postDestroy
   */
  export function destroyer(this: MediatorErrorHandlerObject, mediator: MediatorLifecycle) {
    hook(mediator, "destroy", this);
    hook(mediator, "postDestroy", this);
  }

  /**
   * Invoke hook on the given mediator.
   * @param mediator - mediator that may optionally implement a hook.
   * @param key - name of the hook to invoke.
   * @param errorHandler - handler to use for catching errors.
   * @param args - arguments to pass in a hook if any.
   */
  export function hook<//
    M extends Mediator & Partial<Record<K, F>>,
    K extends keyof M,
    F extends (...args: any) => any>(
    mediator: M, key: K,
    errorHandler: MediatorErrorHandlerObject = defaultErrorHandler,
    ...args: Parameters<M[K]>) {

    if (mediator[key])
      try { mediator[key].apply(mediator, args); } //
      catch (e) { errorHandler.catchMediatorHookError(e, key, mediator); }
  }

  /**
   * Invoke hook on every mediator.
   * @param mediators - list of mediators that may optionally implement a hook.
   * @param key - name of the hook to invoke.
   * @param errorHandler - handler to use for catching errors.
   * @param args - arguments to pass in a hook if any.
   */
  export function hookEach<//
    M extends Mediator & Partial<Record<K, F>>,
    K extends keyof M,
    F extends (...args: any[]) => any>(
    mediators: M[], key: K,
    errorHandler: MediatorErrorHandlerObject = defaultErrorHandler,
    ...args: Parameters<M[K]>) {

    if (mediators && mediators.length)
      for (const mediator of mediators)
        if (mediator[key])
          try { mediator[key].apply(mediator, args); } //
          catch (e) { errorHandler.catchMediatorHookError(e, key, mediator); }
  }
}

export interface MediatorErrorHandlerObject {
  /**
   * Function to invoke for catching errors while invoking mediator hooks.
   * @param error - error occurred while invoking mediator hook.
   * @param hook - name of the hook throwing an error.
   * @param mediator - mediator instance throwing an error.
   */
  catchMediatorHookError(error: Error, hook: keyof any, mediator: Mediator): void;
}

const defaultErrorHandler: MediatorErrorHandlerObject = {
  /** @inheritDoc */
  catchMediatorHookError(error: Error, hook: keyof any, mediator: Mediator) {
    console.error("error while trying to invoke hook '", hook, "' on a mediator", mediator, error);
  },
};

/**
 * Extra lifecycle methods of {@link Mediator} from internal use.
 */
export interface MediatorLifecycle<V = any> extends Mediator<V> {
  /**
   * Initializes the mediator, occurs just before {@link Mediator#initialize}.
   * This is run automatically when a mediator is created.
   */
  preInitialize?(): void;

  /**
   * Initializes the mediator, occurs just after {@link Mediator#initialize}.
   * This is run automatically when a mediator is created.
   */
  postInitialize?(): void;

  /**
   * Destroys the mediator, occurs just after {@link Mediator#destroy}.
   * This is run automatically when a mediator is destroyed.
   */
  postDestroy?(): void;
}
