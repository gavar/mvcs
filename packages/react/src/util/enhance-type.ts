import { ComponentType } from "react";

export type EnhanceType<P = any> = ComponentType<P> & {
  source?: ComponentType<P>;
};
