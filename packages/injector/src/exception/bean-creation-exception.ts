import { lazy } from "@emulsy/annotation";
import { BeanException } from "./bean-exception";

/**
 * Exception thrown when encounters an error while
 * attempting to create a bean from a bean definition.
 */
export class BeanCreationException extends BeanException {
  @lazy
  get message() {
    return `unable to create bean: '${this.beanTypeName}'`;
  }
}
