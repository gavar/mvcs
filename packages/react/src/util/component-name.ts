import { ComponentType } from "react";

/**
 * Resolve name of given component view.
 * @param view - view component class or pure view function.
 */
export function componentName<P>(view: ComponentType<P>): string | void {
  if (typeof view.displayName === "string")
    return view.displayName;

  if (view.prototype)
    if (typeof view.prototype.constructor === "function")
      return view.prototype.constructor.name;

  if (typeof view === "function")
    return view.name;
}
