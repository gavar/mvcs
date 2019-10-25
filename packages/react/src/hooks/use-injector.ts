import { Injector } from "@mvcs/injector";
import { useContext } from "@mvcs/react.core";
import { ReactContext } from "../context";

/**
 * Get {@link Injector} for the current component.
 * @param target - target to inject into.
 */
export function useInjector(target?: any): Injector {
  const {injector} = useContext(ReactContext);
  if (target) injector.inject(target);
  return injector;
}
