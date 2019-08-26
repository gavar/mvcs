import { BeanType } from "@mvcs/core";
import { InjectionMeta, PropertyInjection } from "./injection-meta";
import { Injector } from "./injector";

/** Using stack to avoid creating function scope for every call. */
const stack: PropertyInjection[] = [];

/***
 * Property injection decorator.
 * @param type - type of the property to inject.
 * @param lazy - whether to inject on lazily on first access.
 */
export function inject<T>(type: BeanType<T>, lazy: boolean = true): InjectPropertyDecorator<T> {
  stack.push({type, lazy});
  return injectProperty as InjectPropertyDecorator<T>;
}

export interface InjectPropertyDecorator<T> {
  <O extends Record<K, T>, K extends keyof O>(target: O, propertyKey: K): void;
}

function injectProperty(prototype: object, key: string): void {
  // save injection for future use
  const injection = stack.pop();
  const {constructor} = prototype;
  InjectionMeta.setInjection(constructor, key, injection);

  // eager injector should be handled by injector
  if (!injection.lazy)
    return;

  // apply getter & setter
  Object.defineProperty(prototype, key, {
    configurable: true,
    enumerable: true,
    get() { return getProperty(this, key); },
    set(value: any) { setProperty(this, key, value); },
  });
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
