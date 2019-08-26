import { DefaultEventEmitter, EventBindingConfigurer, EventDef, EventEmitter, EventListener } from "@mvcs/event";
import { ConfigurableInjector, Injector } from "@mvcs/injector";
import { Context } from "./context";
import { ContextEvent } from "./context-event";

export class DefaultContext implements Context {

  private readonly eventDispatcher: EventEmitter;

  /** @inheritDoc */
  injector: Injector;

  /** @inheritDoc */
  initialized: boolean;

  constructor() {
    this.eventDispatcher = new DefaultEventEmitter();
    this.injector = new ConfigurableInjector();
    this.injector.bind(EventEmitter).toConstant(this.eventDispatcher);
  }

  /** @inheritDoc */
  initialize(): void {
    if (this.initialized)
      return;

    if (Injector.root == null)
      Injector.root = this.injector;

    this.initialized = true;
    this.eventDispatcher.emit(ContextEvent.INITIALIZING);
    this.eventDispatcher.emit(ContextEvent.INITIALIZED);
    this.eventDispatcher.emit(ContextEvent.READY);
  }

  /** @inheritDoc */
  destroy(): void {
    // TODO: destroy
  }

  /** @inheritDoc */
  emit<T extends any[]>(name: EventDef<T>, ...args: T): void {
    return this.eventDispatcher.emit(name, ...args);
  }

  listen<T extends any[]>(name: EventDef<T>): EventBindingConfigurer<T> {
    return this.eventDispatcher.listen(name);
  }

  /** @inheritDoc */
  addEventListener<T extends any[]>(name: EventDef<T>, listener: EventListener<T>, target?: any): void {
    return this.eventDispatcher.addEventListener(name, listener, target);
  }

  /** @inheritDoc */
  removeEventListener(name: EventDef, listener: EventListener, target: any): void {
    return this.eventDispatcher.removeEventListener(name, listener, target);
  }
}
