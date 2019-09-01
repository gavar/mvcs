/**
 * Key mapping object literal.
 * @template P - type of component properties.
 * @template K - keys of component properties defined by the binding.
 * @template S - type of source object containing properties to copy into component props.
 */
export type KeyMap<K extends keyof any, S> = Record<K, keyof S>;

/**
 * Pair of keys.
 * @template A - key of the first object.
 * @template B - key of the second object.
 */
export type KeyPair<A extends keyof any, B extends keyof any> = [A, B];

/** Property mapping function. */
export interface ObjectToProps<S, P> {
  /**
   * Pick properties from the source object.
   * @param source - source object to pick properties from/
   * @returns component properties.
   */
  (source: S): P;
}

/**
 * Throws an error if argument value is null or undefined.
 * @param value - value to check.
 * @param name - name of the argument.
 */
export function argumentNotNull(value: any, name: string): void {
  if (value == null)
    throw new Error(`argument '${name}' should not be null`);
}

/**
 * Create function providing source object bt the property key.
 * @param key - key to use for source value.
 */
export function asKeyPicker<S extends P[K], P, K extends keyof P>(key: K): ObjectToProps<S, Pick<P, K>> {
  return function (source: S) {
    if (source)
      return {[key]: source} as any;
  };
}

/**
 * Create a function picking keys from the source object.
 * @param keys - keys to pick from source object.
 */
export function keysPicker<S extends Pick<P, K>, P, K extends keyof P>(keys: K[]): ObjectToProps<S, Pick<P, K>> {
  if (Array.isArray(keys))
    return function (source: S) {
      return pick(source, keys);
    };
}

/**
 * Create a function picking keys from the source object by the rules defined in a keymap.
 * @param keymap - keymap defining key picking rules.
 */
export function keymapPicker<S, P, K extends keyof P>(keymap: KeyMap<K, S>): ObjectToProps<S, Pick<P, K>> {
  if (typeof keymap === "object") {
    const pairs = toKeyPairs(keymap);
    return function (source: S) {
      return pickAs(source, pairs);
    };
  }
}

/**
 * From the source object pick properties defined by the key array.
 * @param source - source object to pick properties from.
 * @param keys - keys to pick from source.
 * @template T - type of the source object.
 * @template K - type of keys to pick.
 */
export function pick<T, K extends keyof T>(source: Pick<T, K>, keys: K[]): Pick<T, K> {
  let out: Pick<T, K>;
  for (const key of keys)
    if (key in source)
      if (out) out[key] = source[key];
      else out = {[key]: source[key]} as Pick<T, K>;
  return out;
}

/**
 * From source object pick properties such way, that output object will contain property value by the 2nd entry of the corresponding pair.
 * @param source - source object to pick properties from.
 * @param pairs - pairs defining source and target property names respectively.
 */
export function pickAs<K extends keyof any, S>(source: S, pairs: Array<KeyPair<keyof S, K>>): Record<K, any> {
  let out: Record<K, any>;
  for (const pair of pairs)
    if (pair[0] in source)
      if (out) out[pair[1]] = source[pair[0]];
      else out = {[pair[1]]: source[pair[0]]} as Record<K, any>;
  return out;
}

/**
 * Convert keymap to array of key pairs.
 * @param keymap - keymap to convert.
 */
function toKeyPairs<K extends keyof any, S>(keymap: KeyMap<K, S>): Array<KeyPair<keyof S, K>> {
  const keys = Object.keys(keymap) as K[];
  const pairs = new Array<KeyPair<keyof S, K>>(keys.length);
  for (let i = 0; i < keys.length; i++)
    pairs[i] = [keymap[keys[i]], keys[i]];
  return pairs;
}
