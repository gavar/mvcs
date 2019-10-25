import { BeanType } from "@mvcs/core";
import { Newable } from "tstt";
import { BindingScopeSyntax, BindingToSyntax } from "./binding-syntax";

/**
 * Manages the mappings and acts as the central hub from which all injections are started.
 */
export interface Injector {
  /**
   * Get or create binding for a constructable bean type.
   * @param type - constructable type to bind.
   * @return existing or newly created binding for a given type.
   */
  bind<T>(type: Newable<T>): BindingToSyntax<T> & BindingScopeSyntax<T>;

  /**
   * Get or create binding for any bean type.
   * @param type - type describing the bean mapping.
   * @return existing or newly created binding for a given type.
   */
  bind<T>(type: BeanType<T>): BindingToSyntax<T>;

  /**
   * Get an instance of the object that uniquely matches the given object type, if any.
   *
   * If mapping for a given object does not exist, but given parameter is {@link Newable},
   * then it will be automatically mapped to a given type in singleton scope.
   *
   * @param type - type of the object to get or try to create.
   * @return existing or new instance of an object with all of its dependencies fulfilled.
   *
   * @throws NoSuchBeanDefinitionException if no bean of the given type was found
   * @throws NoUniqueBeanDefinitionException if more than one bean of the given type was found
   * @throws BeanException if the bean could not be created
   */
  bean<T>(type: BeanType<T>): T;

  /**
   * Creates an instance of the given type and injects into it.
   * @param type - type to instantiate
   * @return new instance, with all of its dependencies fulfilled
   *
   * @throws BeanException if the bean could not be created.
   */
  instantiate<T>(type: Newable<T>): T;

  /**
   * Inspects the given object and injects into all injection points configured for its class.
   * @param target - target to inject into.
   */
  inject(target: any): void;
}

export declare namespace Injector {
  export const BeanType: Injector;

  /**
   * Root injector to use as fallback.
   * Temporal solution until contexts are implemented.
   */
  export let root: Injector;
}

// TODO: remove namespace
export namespace Injector {
  const INJECTOR = Symbol("injector");
  export const BeanName = "Injector";

  /*** Get injector used to initialize given object.  */
  export function getInjector(object: any): Injector {
    return object[INJECTOR];
  }

  /** Set injector which is used to initialize object. */
  export function setInjector(object: any, value: Injector): void {
    object[INJECTOR] = value;
  }
}
