import { Component } from "react";
import { useInjector } from "../hooks";

/** Component with dependency injections. */
export class InjectorComponent<P = any, S = never> extends Component<P, S> {
  /** Dependency injector providing bean injection for the instance. */
  readonly injector = useInjector(this);
}
