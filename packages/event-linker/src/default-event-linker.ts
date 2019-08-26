import {
  equalEventKey,
  EventBinder,
  EventBinding,
  EventBindingConfigurer,
  EventContainer,
  EventDef,
  EventKey,
  EventListener,
  eventTypeOf,
} from "@mvcs/event";
import { EventLinker } from "./event-linker";

/**
 * Default implementation of the {@link EventLinker}.
 */
export class DefaultEventLinker implements EventLinker {

  /** List of events added via {@link listen}. */
  readonly links: EventLink[] = [];

  /** List of events added via {@link addListener}. */
  readonly bindings: ProxyBinding[] = [];

  /** @inheritDoc */
  listen<T extends any[]>(binder: EventBinder, name: EventDef<T>): EventBindingConfigurer<T> {
    return new ProxyBinding(this, binder.listen(name));
  }

  /** @inheritDoc */
  addListener<T extends any[]>(container: EventContainer, name: EventDef<T>, listener: EventListener<T>, target?: any): void {
    container.addEventListener(name, listener, target);
    const link = {type: eventTypeOf(name)} as EventLink<T>;
    link.listener = listener;
    link.container = container;
    if (target) link.target = target;
    this.links.push(link);
  }

  /** @inheritDoc */
  removeListener(container: EventContainer, name: EventDef, listener: EventListener, target: any): void {
    // remove from container
    container.removeEventListener(name, listener, target);

    // remove from links
    const links = this.links;
    for (let i = 0; i < links.length; i++) {
      // find match
      const link = links[i];
      if (link.listener !== listener) continue;
      if (link.target !== target) continue;
      if (!equalEventKey(link, name)) continue;

      // fill empty slot
      const last = links.pop();
      if (i < links.length)
        links[i] = last;
    }
  }

  /** @inheritDoc */
  removeListeners() {
    for (const link of this.links)
      link.container.removeEventListener(link, link.listener, link.target);

    for (const binding of this.bindings) {
      binding.destroy();
      binding.clear();
    }

    this.links.length = 0;
    this.bindings.length = 0;
  }
}

interface EventLink<T extends any[] = any> extends EventKey<T> {
  container: EventContainer;
  listener: EventListener<T>;
  target: any;
}

interface EventBindingConfigurable<T extends any[] = any> extends EventBindingConfigurer<T>, EventBinding<T> {

}

class ProxyBinding<T extends any[] = any> implements EventBindingConfigurable<T> {

  protected linker: DefaultEventLinker;
  protected binding: EventBindingConfigurable<T>;

  constructor(linker: DefaultEventLinker, configurer: EventBindingConfigurer<T>) {
    this.linker = linker;
    this.binding = configurer as EventBindingConfigurable<T>;
  }

  /** @inheritDoc */
  by(listener: EventListener<T>, target?: any): EventBinding<T> {
    this.linker.bindings.push(this);
    this.binding = this.binding.by(listener, target) as EventBindingConfigurable<T>;
    return this;
  }

  /** @inheritDoc */
  once() {
    this.binding = this.binding.once() as EventBindingConfigurable<T>;
    return this;
  }

  /** @inheritDoc */
  destroy(): void {
    this.binding.destroy();
    const bindings = this.linker.bindings;
    const index = bindings.indexOf(this);
    if (index >= 0) {
      const last = bindings.pop();
      if (index > bindings.length)
        bindings[index] = last;
    }

    this.clear();
  }

  /** @inheritDoc */
  pause(): void {
    this.binding.pause();
  }

  /** @inheritDoc */
  resume(): void {
    this.binding.resume();
  }

  clear() {
    this.linker = null;
    this.binding = null;
  }
}
