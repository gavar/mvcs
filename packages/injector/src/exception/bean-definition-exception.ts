import { BeanDefinition } from "..";
import { BeanCreationException } from "./bean-creation-exception";

/**
 * Exception thrown when encounters an error while
 * attempting to create a bean from a bean definition.
 */
export class BeanDefinitionException<T = any> extends BeanCreationException {
  /** Bean definition caused an exception. */
  public readonly beanDefinition: BeanDefinition<T>;

  constructor(beanDefinition: BeanDefinition<T>, message?: string) {
    super(beanDefinition.beanType, message);
    this.beanDefinition = beanDefinition;
  }
}
