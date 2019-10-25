import { BeanType } from "@mvcs/core";
import { InjectionMeta, PropertyInjection } from "./injection-meta";
import { Injector } from "./injector";

/***
 * Property injection decorator.
 * @param type - type of the property to inject.
 * @param lazy - whether to inject on lazily on first access.
 */
export function inject<T>(type: BeanType<T>, lazy: boolean = true): InjectPropertyDecorator<T> {
  return injectProperty.bind({type, lazy}) as InjectPropertyDecorator<T>;
}

export interface InjectPropertyDecorator<T> {
  <O extends Record<K, T>, K extends keyof O>(target: O, propertyKey: K): void;
}

function injectProperty(this: PropertyInjection, prototype: object, key: string): PropertyDescriptor | void {
  // save injection for future use
  const {constructor} = prototype;
  InjectionMeta.setInjection(constructor, key, this);

  // eager injector should be handled by injector
  if (!this.lazy)
    return;

  // FIXME: babel will initialize property with `undefined` if you don't return descriptor
  // https://github.com/babel/babel/pull/9141
  // https://github.com/babel/babel/issues/9773
  // https://github.com/wycats/javascript-decorators
  return {
    configurable: true,
    enumerable: true,
    get(this: object) { return getProperty(this, key); },
    set(this: object, value: any) { setProperty(this, key, value); },
  };
}

function getProperty(object: object, key: string): any {
  const {constructor} = object;
  const injection = InjectionMeta.getInjection(constructor, key);
  if (!injection)
    throw new Error(`unable to find injection for property '${key}' on type '${constructor.name}'`);

  const injector = Injector.getInjector(object) || Injector.root;
  const value = injector.bean(injection.type);
  setProperty(object, key, value);
  return value;
}

function setProperty(object: object, key: string, value: any) {
  Object.defineProperty(object, key, {
    configurable: true,
    enumerable: true,
    value,
  });
}
