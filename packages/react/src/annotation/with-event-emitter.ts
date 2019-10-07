import { ComponentClass, ComponentType } from "react";
import { Partially } from "tstt";
import { DispatchToProps, EmitterConnect } from "../connect";
import { componentNameOf, EnhanceType } from "@mvcs/react-core";

/**
 * Connect view to a application event dispatcher.
 * @param emitterToProps - function that binds emitter to an actions.
 */
export function withEventEmitter<P, K extends keyof P>(emitterToProps: DispatchToProps<P, K>) {
  return function (view: ComponentType<P>): ComponentClass<Partially<P, K>> {
    return annotate(view, emitterToProps) as any;
  };
}

function annotate<P, K extends keyof P>(view: EnhanceType<P>, emitterToProps: DispatchToProps<P>) {
  class ViewConnect extends EmitterConnect<P, K> {
    constructor(props: P, context: any) {
      super(props, context, view, emitterToProps);
    }
  }

  const clazz = ViewConnect as EnhanceType;
  clazz.source = view.source || view;
  clazz.displayName = `${componentNameOf(clazz.source)}Events`;
  return ViewConnect;
}
