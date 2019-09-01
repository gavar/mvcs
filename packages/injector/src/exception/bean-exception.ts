import { Exception } from "@emulsy/lang";
import { BeanType, beanTypeName } from "@mvcs/core";

/**
 * Base class for all exceptions thrown by beans resolution process.
 */
export class BeanException extends Exception {
  /** Type of the missing bean. */
  public readonly beanType: BeanType;

  /** Get name of the {@link #beanType}. */
  get beanTypeName(): string {
    return beanTypeName(this.beanType);
  }

  constructor(type: BeanType, message?: string) {
    super(message);
    this.beanType = type;
  }
}
