import { Context, DefaultContext } from "@mvcs/context";
import { createContext } from "react";

export const RootContext = factory();
export const ReactContext = createContext(RootContext);

function factory(): Context {
  const context = new DefaultContext();
  context.initialize();
  return context;
}
