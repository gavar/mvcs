import { Context, DefaultContext } from "@mvcs/context";
import { createContext } from "react";

export const ReactContext = createContext<Context>(new DefaultContext());
