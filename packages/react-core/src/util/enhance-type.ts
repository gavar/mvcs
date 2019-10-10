import { ComponentType } from "react";

/**
 * Component type which is result of the HOC function.
 * @see https://reactjs.org/docs/higher-order-components.html
 */
export type EnhanceType<P = any> = ComponentType<P> & {
  /** Source component being enhanced by the HOC. */
  source?: ComponentType<P>;
};
