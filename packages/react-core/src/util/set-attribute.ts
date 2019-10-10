import { Nil } from "tstt";

/**
 * Set attribute of the HTML element.
 * Removes attribute from the element when provided value is nil.
 * @param element - HTML element to modify.
 * @param qualifiedName - name of the attribute.
 * @param value - attribute value or nil.
 */
export function setAttribute<T extends Element, K extends keyof T>(
  element: T,
  qualifiedName: K & string,
  value: T[K] | string | Nil,
) {
  if (value != null) element.setAttribute(qualifiedName, value as any);
  else element.removeAttribute(qualifiedName);
}
