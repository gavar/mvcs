import { BeanType, beanTypeName } from "@mvcs/core";
import { Store } from "@mvcs/store";
import { ComponentClass, ComponentType } from "react";
import { Partially } from "tstt";
import { StateSelector, StoreConnect, StoreConnectOptions } from "../connect";
import { EnhanceType } from "@mvcs/react-core";

/**
 * Connect view to store properties.
 * @param storeType - type of the store to use.
 * @param stateToProps - function that extracts view properties from a store state.
 */
export function withStore<S, P, K extends keyof P>(storeType: BeanType<Store<S>>, stateToProps: StateSelector<S, P, K>) {
  return function (view: ComponentType<P>): ComponentClass<Partially<P, K>> {
    return annotate(view, {storeType, stateToProps}) as any;
  };
}

function annotate<S, P, K extends keyof P>(view: EnhanceType<P>, options: StoreConnectOptions<P, S, K>) {
  class ViewConnect extends StoreConnect<P, K, S> {
    constructor(props: P, context: any) {
      super(props, context, view, options);
    }
  }

  const clazz = ViewConnect as EnhanceType;
  clazz.source = view.source || view;
  clazz.displayName = `${beanTypeName(options.storeType)}`;
  return ViewConnect;
}
