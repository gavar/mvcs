import { lazy } from "@emulsy/annotation";
import { BeanCreationException } from "./bean-creation-exception";

export class NoConstructorBeanCreationException extends BeanCreationException {
  @lazy
  get message(): string {
    return `Unable to instantiate of type '${this.beanTypeName}' because it's not a constructable type`;
  }
}
