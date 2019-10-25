import { Abstract, Newable } from "tstt";

/**
 * Type identifier for runtime types that are affected by type erasure (interfaces, types, etc).
 * Makes possible way to use interface as type, thankfully to typescript declaration merging feature.
 *
 * Consider following example code:
 *
 * @example
 * export interface Example { ... }
 * export namespace Example {
 *   export declare const BeanType: Example;
 *   export const BeanName = "Example";
 * }
 * ....
 * const bean = context.bean(Example);
 */
export type VirtualBeanType<T = any> = {} & {
  /**
   * Property value declaring instance type of the bean.
   * Value is not used during runtime and required only for type checking.
   */
  readonly BeanType: T;

  /** Display name of the bean. */
  readonly BeanName: string;
}

/**
 * Defines possible ways to identify beans.
 */
export type BeanType<T = any> =
  | Newable<T> //         class itself (function) uniquely identify bean
  | Abstract<T> //        abstract class itself (function) uniquely identify bean
  | VirtualBeanType<T> // object reference declaring type properties uniquely identify bean
  | symbol //             symbol uniquely identify bean
  | string //             name of the bean, does not provide unique identity, since it may collide with other names
  ;

export function beanTypeName<T>(type: BeanType<T>): string | undefined {
  if (type)
    switch (typeof type) {
      case "string":
        return type;
      case "symbol":
        return type.toString();
      case "function":
        return type.name;
      case "object":
        return (type as VirtualBeanType).BeanName;
    }
}
