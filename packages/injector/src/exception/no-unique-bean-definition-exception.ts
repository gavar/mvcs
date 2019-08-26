import { lazy } from "@emulsy/annotation";
import { BeanType } from "@mvcs/core";
import { NoSuchBeanDefinitionException } from "./no-such-bean-definition-exception";

export class NoUniqueBeanDefinitionException extends NoSuchBeanDefinitionException {
  /** Number of beans found when only one matching bean was expected. */
  public readonly numberOfBeans: number;

  @lazy
  get message(): string {
    return `Expected single matching bean of type '${this.beanTypeName}' but found ${this.numberOfBeans}`;
  }

  constructor(type: BeanType, numberOfBeans: number) {
    super(type);
    this.numberOfBeans = numberOfBeans;
  }
}
