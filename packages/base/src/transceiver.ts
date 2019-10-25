import { lazy } from "@emulsy/annotation";
import { beanDestroyer, BeanDestroyErrorHandler, DisposableBean } from "@mvcs/core";
import { EventBindingConfigurer, EventDef, EventEmitter, EventListener } from "@mvcs/event";
import { EventLinker } from "@mvcs/event-linker";
import { inject, Injector } from "@mvcs/injector";
import { Logger, logging } from "@mvcs/logger";

/**
 * Base class for communication with an application via events.
 */
@logging
export abstract class Transceiver implements DisposableBean, BeanDestroyErrorHandler {

  /** Logger of this instance. */
  readonly logger: Logger;

  /** Dependency injector providing bean injection for the instance. */
  @inject(Injector)
  readonly injector: Injector;

  /** Application context event dispatcher. */
  @inject(EventEmitter)
  readonly eventDispatcher: EventEmitter;

  /** Linker to easily manage event subscriptions. */
  @inject(EventLinker)
  readonly eventLinker: EventLinker;

  /** List of objects to dispose upon destroying this instance. */
  @lazy.factory(Array)
  readonly disposables: DisposableBean[];

  /** @inheritDoc */
  destroy(): void {
    this.removeListeners();
    this.dispose();
  }

  /** @inheritDoc */
  catchBeanDestroyError(error: Error, bean: any) {
    this.logger.error("error while destroying bean", bean, error);
  }

  /** Dispatch an event to the application context via {@link eventDispatcher}. */
  protected dispatch<T extends any[]>(name: EventDef<T>, ...args: T): void {
    return this.eventDispatcher.emit(name, ...args);
  }

  /**
   * Dispatch multiple events to the application context via {@link eventDispatcher}
   * @param names - array of events to dispatch.
   * @param args - arguments to pass for every event.
   */
  protected multicast<T extends any[]>(names: Array<EventDef<T>>, ...args: T): void {
    for (const name of names)
      this.eventDispatcher.emit(name, ...args);
  }

  /**
   * Dispatch multiple events to the application context via {@link eventDispatcher}.
   * @param items - items containing events to dispatch.
   * @param reduce - function converting item to a dispatching event.
   * @param args - arguments to pass for every event.
   */
  protected multicastReduce<U, T extends any[]>(items: U[], reduce: (item: U) => EventDef<T>, ...args: T): void {
    for (const item of items)
      this.eventDispatcher.emit(reduce(item), ...args);
  }

  /** Listen for a context event via {@link eventDispatcher}. */
  protected listenContext<T extends any[]>(name: EventDef<T>): EventBindingConfigurer<T> {
    return this.eventLinker.listen(this.eventDispatcher, name);
  }

  /** Adds event listener to the application context via {@link eventDispatcher}. */
  protected addContextListener<T extends any[]>(
    name: EventDef<T>,
    listener: EventListener<T>,
    target: any = this): void {
    this.eventLinker.addListener(this.eventDispatcher, name, listener, target);
  }

  /** Remove event listener from the application context via {@link eventDispatcher}. */
  protected removeContextListener(
    name: EventDef,
    listener: EventListener,
    target: any = this): void {
    this.eventLinker.removeListener(this.eventDispatcher, name, listener, target);
  }

  /** Remove all event listeners created via {@link eventLinker}. */
  protected removeListeners() {
    // gently check for property existence to avoid lazy injection
    if (this.hasOwnProperty("eventLinker"))
      this.eventLinker.removeListeners();
  }

  /**
   * Dispose every object within {@link disposables} list.
   */
  protected dispose() {
    // dispose objects
    if (this.hasOwnProperty("disposables")) {
      this.disposables.forEach(beanDestroyer, this);
      this.disposables.length = 0;
    }
  }
}
