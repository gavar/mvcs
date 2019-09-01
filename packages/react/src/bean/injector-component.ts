import { Injector } from "@mvcs/injector";
import { Component } from "react";

/** Component with dependency injections. */
export class InjectorComponent<P = any, S = never> extends Component<P, S> {

  /** Dependency injector providing bean injection for the instance. */
  readonly injector: Injector;

  constructor(props: P, context: any) {
    super(props, context);
    // TODO: get injector from context
    this.injector = Injector.root;
    this.injector.inject(this);
  }
}
