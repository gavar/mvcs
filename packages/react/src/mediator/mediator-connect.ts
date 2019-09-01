import { Mediator, MediatorErrorHandlerObject } from "@mvcs/core";
import { Newable } from "tstt";
import { ReactView } from "../view";
import { ReactViewMediator } from "./react-view-mediator";

/**
 * Defines configuration of how mediator is connected to a view.
 */
export interface MediatorConnect<P = any,
  V extends ReactView<P> = any,
  M extends Mediator<V> = any> {

  /** Mediator type to instantiate for react view. */
  mediatorType: Newable<M>;

  /** Function to map mediator to react component properties. */
  mediatorToProps?(mediator: M): unknown;
}

export namespace MediatorConnect {
  /**
   * Initialize mediator connections by creating mediator instances.
   * @param array - array of mediators to initialize.
   * @param view - view to set for every mediator in a list.
   * @param props - props to fill with result of {@link MediatorConnect#mediatorToProps}.
   * @param errorHandler - object to use for error handling.
   */
  export function create<P>(array: Array<MediatorConnect<P>>,
                            view: ReactView<P>, props: Partial<P>,
                            errorHandler?: MediatorErrorHandlerObject) {
    const mediators = new Array(array.length) as Array<ReactViewMediator<P>>;
    for (let i = 0; i < array.length; i++) {
      const {mediatorType, mediatorToProps} = array[i];
      const mediator = mediators[i] = Mediator.create(mediatorType, view, errorHandler);
      if (mediatorToProps) Object.assign(props, mediatorToProps(mediator));
      else if (mediator.getInitialProps) Object.assign(props, mediator.getInitialProps());
    }
    return mediators;
  }
}
