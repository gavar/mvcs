import { Nil } from "tstt";

/**
 * Set property if tge CSS style object.
 * Deletes property key from the style object when provided value is nil.
 * @param style - CSS style object instance.
 * @param key - name of te property to set.
 * @param value -
 */
export function setStyleProp<K extends keyof CSSStyleDeclaration>(
  style: CSSStyleDeclaration, key: K,
  value: CSSStyleDeclaration[K] | string | Nil) {
  if (value == null) delete style[key];
  else style[key] = value as any;
}
