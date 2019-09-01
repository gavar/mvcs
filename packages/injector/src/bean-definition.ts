import { BeanType } from "@mvcs/core";
import { Newable } from "tstt";

/**
 * Describes a bean instance, which has property values,
 * constructor argument values, and further information supplied by
 * concrete implementations.
 */
export interface BeanDefinition<T = any> {
  /** Type of the bean this definition is for. */
  readonly beanType: BeanType<T>;

  /** Defines which binding to use to create resolve bean instance. */
  readonly bindingType: BindingType;

  /** Defines scope of the bean lifecycle. */
  readonly bindingScope: BindingScope;

  /** Type of the bean that implements {@link beanType}. */
  readonly implementationType: Newable<T>;

  /** Constant value. */
  readonly constant: T;
}

/** Defines type of the binding. */
export const enum BindingType {
  /**
   * Binding to a an implementation type.
   * @see BeanDefinition#implementationType
   */
  Implementation = "implementation",

  /**
   * Binding to a a constant value.
   * @see BeanDefinition#constant
   */
  Constant = "constant",
}

/**
 * Defines beans lifecycle scope.
 */
export const enum BindingScope {
  /** Defines that only one bean of the given type should exists withing context. */
  Singleton = "singleton",

  /** Defines that new bean instance should be created for every request. */
  Prototype = "prototype",
}
