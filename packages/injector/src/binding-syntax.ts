import { Newable } from "tstt";

export interface BindingToSyntax<T> {
  to(implementation: Newable<T>): BindingScopeSyntax<T>;
  toConstant(value: T): void;
}

export interface BindingScopeSyntax<T> {
  asSingleton(): void;
  asPrototype(): void;
}
