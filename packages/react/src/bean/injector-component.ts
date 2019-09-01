import { Injector } from "@mvcs/injector";
import { Component, useContext } from "react";
import { ReactContext } from "../context";

/** Component with dependency injections. */
export class InjectorComponent<P = any, S = never> extends Component<P, S> {

  /** Dependency injector providing bean injection for the instance. */
  readonly injector: Injector;

  constructor(props: P, context: any) {
    super(props, context);
    this.injector = useContext(ReactContext).injector;
    this.injector.inject(this);
  }
}
