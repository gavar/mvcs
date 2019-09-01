import {
  EventBinder,
  EventBinding,
  EventBindingBySyntax,
  EventBindingConfigurer,
  EventDef,
  EventListener,
} from "@mvcs/event";
import { DefaultEventLinker } from "..";

namespace DefaultEventLinkerSuite {
  describe("DefaultEventLinker", () => {
    it("listen", listen);
    it("destroy", destroy);
  });

  export function listen() {
    const event = "dts-jest";
    const target = Symbol();
    const listener = () => {};

    const binder = new EventBinderMock();
    const linker = new DefaultEventLinker();
    linker.listen(binder, event).by(listener, target);

    const last = binder.bindings[0];
    expect(last.name).toBe(event);
    expect(last.target).toBe(target);
    expect(last.listener).toBe(listener);

    const bindings = linker.bindings;
    expect(bindings.length).toBe(1);
  }

  export function destroy() {
    const binder = new EventBinderMock();
    const linker = new DefaultEventLinker();
    linker.listen(binder, null).by(null, null).destroy();
    expect(binder.bindings.length).toBe(0);
  }

  class EventBinderMock implements EventBinder {
    readonly bindings: EventBindingMock[] = [];

    /** @inheritDoc */
    listen<T extends any[]>(name: EventDef<T>): EventBindingConfigurer<T> {
      const binding = new EventBindingMock();
      binding.name = name;
      binding.binder = this;
      this.bindings.push(binding);
      return binding;
    }
  }

  class EventBindingMock<T extends any[] = any> implements EventBindingConfigurer<T>, EventBinding<T> {
    binder: EventBinderMock;
    name: EventDef<T>;
    listener: EventListener<T>;
    target: any;

    /** @inheritDoc */
    by(listener: EventListener<T>, target?: any): EventBinding<T> {
      this.listener = listener;
      this.target = target;
      return this;
    }

    /** @inheritDoc */
    once(): EventBindingBySyntax<T> {
      return this;
    }

    /** @inheritDoc */
    destroy(): void {
      const bindings = this.binder.bindings;
      bindings.splice(bindings.indexOf(this), 1);
    }

    /** @inheritDoc */
    pause: null;

    /** @inheritDoc */
    resume: null;
  }
}
