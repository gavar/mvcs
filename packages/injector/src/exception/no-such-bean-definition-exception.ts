import { lazy } from "@emulsy/annotation";
import { BeanException } from "./bean-exception";

/**
 * Exception thrown when bean factory is asked for a bean instance for which it
 * cannot find a definition. This may point to a non-existing bean, a non-unique bean,
 * or a manually registered singleton instance without an associated bean definition.
 */
export class NoSuchBeanDefinitionException extends BeanException {
  @lazy
  get message(): string {
    return `No qualifying bean of type '${this.beanTypeName}' available`;
  }
}
