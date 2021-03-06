import { ComponentSpec, ElementType } from "react";

/**
 * Get display name of the given component.
 * @param view - react component to resolve display name of.
 */
export function displayNameOf(view: ElementType | ComponentSpec<any, any>): string {
  // HTML element
  if (typeof view === "string")
    return view;

  // display name
  if (typeof view.displayName === "string")
    return view.displayName;

  // ComponentSpec
  if (typeof view === "object")
    if (typeof view.render === "function")
      return view.render.name;

  // class Component
  if (view.prototype)
    if (typeof view.prototype.constructor === "function")
      return view.prototype.constructor.name;

  // functional component
  if (typeof view === "function")
    return view.name;
}
