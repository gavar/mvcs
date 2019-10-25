import { Mediator } from "@mvcs/core";
import { displayNameOf } from "@mvcs/react.core";
import { ComponentType } from "react";
import { Newable } from "tstt";
import { ReactView } from "../view";
import { MediatorConnect } from "./mediator-connect";
import { ReactMediatorConnect } from "./react-mediator-connect";

/**
 * Enhancer which creates high-order component, that automatically creates mediators of given types,
 * whenever react component is mounted.
 * @param mediatorTypes - type of mediators to instantiate when react component is mounted.
 */
export function mediateBy<P>(...mediatorTypes: Array<Newable<Mediator<ReactView<P>>>>): (view: ComponentType<P>) => ComponentType<Partial<P>> {
  const mediators: Array<MediatorConnect<P>> = mediatorTypes.map(mediatorType => ({mediatorType}));
  return function (view: ComponentType<P>): ComponentType<Partial<P>> {
    return annotate(view, mediators) as any;
  };
}

function annotate<P>(view: ComponentType<P>, mediators: Array<MediatorConnect<P>>) {
  class ViewMediator extends ReactMediatorConnect<P> {
    constructor(props: P, context: any) {
      super(props, context, view, mediators);
    }
  }

  const clazz = ViewMediator as ComponentType<P>;
  clazz.displayName = `${displayNameOf(view)}ViewMediator`;
  return ViewMediator;
}
