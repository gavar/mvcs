import { Component, ElementType, ReactElement } from "react";
import { REACT_FORWARD_REF_TYPE } from "../core";

const types: Record<keyof any, boolean> = {
  [REACT_FORWARD_REF_TYPE]: true,
};

/**
 * Check whether provided type supports passing a ref property.
 * @see https://reactjs.org/docs/refs-and-the-dom.html#accessing-refs
 */
export function isRefComplaint<T>(type: ElementType | ReactElement): boolean {
  if (type) {
    const {$$typeof} = type as ReactElement;
    return typeof type === "string"
      || type instanceof Component
      || $$typeof in types;
  }
}
