/**
 * Create shallow copy of the object when it's frozen.
 * @param props - object properties to unfreeze.
 */
export function unfreeze<T extends object>(props: T | Readonly<T>): T {
  return Object.isFrozen(props) ? {...props} : props;
}
