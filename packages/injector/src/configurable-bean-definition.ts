import { BeanType } from "@mvcs/core";
import { Newable } from "tstt";
import { BeanDefinition, BindingScope, BindingType } from "./bean-definition";
import { BindingScopeSyntax, BindingToSyntax } from "./binding-syntax";

/**
 * Bean definition with fluent confirmation syntax.
 */
export class ConfigurableBeanDefinition<T = any> implements //
  BeanDefinition<T>,
  BindingToSyntax<T>,
  BindingScopeSyntax<T> {

  /** @inheritDoc */
  readonly beanType: BeanType<T>;

  /** @inheritDoc */
  bindingType: BindingType;

  /** @inheritDoc */
  bindingScope: BindingScope;

  /** @inheritDoc */
  implementationType: Newable<T>;

  /** @inheritDoc */
  constant: T;

  constructor(beanType: BeanType<T>) {
    this.beanType = beanType;
  }

  /** @inheritDoc */
  to(implementation: Newable<T>): BindingScopeSyntax<T> {
    this.implementationType = implementation;
    this.bindingType = BindingType.Implementation;
    return this;
  }

  /** @inheritDoc */
  toConstant(value: T): void {
    this.constant = value;
    this.bindingType = BindingType.Constant;
  }

  /** @inheritDoc */
  asSingleton(): void {
    this.bindingScope = BindingScope.Singleton;
  }

  /** @inheritDoc */
  asPrototype(): void {
    this.bindingScope = BindingScope.Prototype;
  }
}
