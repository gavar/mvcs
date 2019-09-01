import { BeanType } from "@mvcs/core";
import { Injector } from "@mvcs/injector";
import { ReactView } from "../view";

/** Function connection bean properties to a view properties. */
export interface BeanToProps<P, B = any, V = ReactView<P>, T extends Partial<P> = any> {
  (bean: B, view: ReactView<P>): T;
}

/** Defines options for connection bean of particular type to a view via {@link BeanToProps}. */
export interface BeanConnect<P, B = any> {
  /** Type of the bean to inject. */
  beanType: BeanType<B>;
  /** Function for connecting bean properties to a view properties. */
  beanToProps: BeanToProps<P, B>;
}

export namespace BeanConnect {
  /**
   * Initialize bean connection by reducing bean connection configuration to a single properties objects.
   * @param array - bean connection configurations.
   * @param view - view state provider to use for all of the bean connections.
   * @param injector - injector to use for resolving bean instances.
   * @return properties merged from all of the bean connections.
   */
  export function reduce<P>(array: Array<BeanConnect<P>>, view: ReactView<P>, injector: Injector): Partial<P> {
    const props = {};
    for (const item of array) {
      const bean = injector.bean(item.beanType);
      const beanProps = item.beanToProps(bean, view);
      if (beanProps) Object.assign(props, beanProps);
    }
    return props;
  }
}
