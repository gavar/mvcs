import { BeanType, InitializingBean } from "@mvcs/core";
import { Newable } from "tstt";
import { BeanDefinition, BindingScope, BindingType } from "./bean-definition";
import { BindingScopeSyntax, BindingToSyntax } from "./binding-syntax";
import { ConfigurableBeanDefinition } from "./configurable-bean-definition";
import { BeanDefinitionException, NoSuchBeanDefinitionException } from "./exception";
import { Injector } from "./injector";

/**
 * Default implementation of {@link Injector}.
 * Provides possibility to configure mappings.
 */
export class ConfigurableInjector implements Injector {
  private readonly singletons: Map<BeanType, any>;
  private readonly definitions: Map<BeanType, ConfigurableBeanDefinition>;

  constructor() {
    this.singletons = new Map();
    this.definitions = new Map();
    this.bind(Injector).toConstant(this);
  }

  /** @inheritDoc */
  bind<T>(type: Newable<T>): BindingToSyntax<T> & BindingScopeSyntax<T>;

  /** @inheritDoc */
  bind<T>(type: BeanType<T>): BindingToSyntax<T>;

  /** @inheritDoc */
  bind<T>(type: BeanType<T>): BindingToSyntax<T> & BindingScopeSyntax<T> {
    // find bean definition
    let definition = this.definitions.get(type);
    // bind self to singleton by default
    if (!definition) {
      definition = new ConfigurableBeanDefinition(type);
      if (typeof type === "function")
        definition.to(type);
      definition.asSingleton();
      this.definitions.set(type, definition);
    }
    return definition;
  }

  /** @inheritDoc */
  bean<T>(type: BeanType<T>): T {
    // find bean definition
    let definition = this.definitions.get(type);
    // bind self to singleton by default
    if (!definition && typeof type === "function") {
      definition = new ConfigurableBeanDefinition(type);
      definition.to(type).asSingleton();
      this.definitions.set(type, definition);
    }

    // resolve
    if (definition)
      return this.resolve(definition);

    throw new NoSuchBeanDefinitionException(type);
  }

  /** @inheritDoc */
  inject(target: any): void {
    // TODO: eager injection via prototype chain
    Injector.setInjector(target, this);
    this.process(target);
  }

  /** @inheritDoc */
  instantiate<T>(type: Newable<T>): T {
    const bean = new type();
    this.inject(bean);
    return bean;
  }

  /**
   * Process bean by running pre / post processing hooks.
   * @param bean - bean to process.
   */
  private process(bean: any) {
    // TODO: create post processors
    if (InitializingBean.is(bean))
      bean.afterPropertiesSet();
  }

  /**
   * Resolve bean instance from a {@link BeanDefinition}.
   * @param definition - bean definition providing binding configuration.
   * @returns existing or newly created instance depending on configuration.
   */
  private resolve<T>(definition: BeanDefinition<T>): T {
    switch (definition.bindingScope) {
      case BindingScope.Singleton:
        let instance: T = this.singletons.get(definition.beanType);
        if (!instance) {
          instance = this.instanceOf(definition);
          this.singletons.set(definition.beanType, instance);
        }
        return instance;

      case BindingScope.Prototype:
        return this.instanceOf(definition);

      default:
        throw new BeanDefinitionException(definition, `unknown binding scope: '${definition.bindingScope}'`);
    }
  }

  /**
   * Get or create instance from a {@link BeanDefinition}.
   * @param definition - bean definition providing binding type.
   * @returns existing or newly created instance depending on {@link BeanDefinition#bindingType}.
   */
  private instanceOf<T>(definition: BeanDefinition<T>): T {
    switch (definition.bindingType) {
      case BindingType.Implementation:
        return this.instantiate(definition.implementationType);

      case BindingType.Constant:
        return definition.constant;

      default:
        throw new BeanDefinitionException(definition, `unknown binding type: '${definition.bindingType}'`);
    }
  }
}
