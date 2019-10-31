import { Context } from "react";
import { ReactDispatcher } from "../core";
import { useDispatcher } from "./core";

/**
 * Allows to use context hook in classes via {@link ReactDispatcher#readContext}.
 * Accepts a context object (the value returned from `React.createContext`) and returns the current
 * context value, as given by the nearest context provider for the given context.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usecontext
 */
export function useContext<T>(context: Context<T>): T {
  // HACK: React throwInvalidHookError has zero arguments
  const {useContext, readContext} = useDispatcher();
  const use = useContext.length < 1 ? readContext : useContext;
  return use(context);
}
