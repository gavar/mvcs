import { Abstract, Newable } from "tstt";

/**
 * Type identifier for runtime types affected by type erasure (interfaces, types, etc).
 * Possible way to use interface as type, thankfully to typescript declaration merging feature.
 *
 * Consider following example code:
 *
 * @example
 * import { BeanKey } from "mvcs";
 * export interface Example { ... }
 * export namespace Example {
 *   export const beanType: BeanKey<Example> = Symbol("Example");
 * }
 * ....
 * const bean = context.bean(Example);
 */
export interface VirtualBeanType<T = any> {
  /** Value to use to uniquely identify bean type binding. */
  readonly beanType: BeanKey<T>;
}

/**
 * Defines possible variations of bean type identifiers.
 */
export type BeanType<T = any> =
  | Newable<T> //         constructable classes identified by function type itself
  | Abstract<T> //        abstract classes are also uniquely identified by function type itself
  | VirtualBeanType<T> // syntax sugar for identifying interfaces to avoid hanging variables exports
  | symbol //             preferred way of identifying interfaces, protects from collisions
  | string //             by name, easiest way, but does not protect from collisions
  ;

/**
 * Defines key to use for association bean definition with a type.
 */
export type BeanKey<T = any> =
  | string
  | symbol
  | Abstract<T>
  | Newable<T>
  ;

export namespace BeanType {

  /** Extract key from a bean type. */
  export function key<T>(beanType: BeanType<T>): BeanKey<T> {
    return (beanType as VirtualBeanType<T>).beanType || beanType as BeanKey<T>;
  }

  /** Get name of a bean type. */
  export function name<T>(beanType: BeanType<T>): string {
    const beanKey = key(beanType);
    return (beanKey as Function).name || beanKey.toString();
  }
}
