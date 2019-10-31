import { Component, ComponentType } from "react";
import { REACT_FORWARD_REF_TYPE, ReactElement } from "../core";
import { HTMLTag } from "../types";

const types: Record<keyof any, boolean> = {
  [REACT_FORWARD_REF_TYPE]: true,
};

/**
 * Check whether provided type supports passing a ref property.
 * @see https://reactjs.org/docs/refs-and-the-dom.html#accessing-refs
 */
export function isRefComplaint(type: HTMLTag | ComponentType | ReactElement): boolean {
  if (type)
    return typeof type === "string"
      || type instanceof Component
      || (type as ReactElement).$$typeof in types;
}
