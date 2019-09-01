/**
 * Shallow compare whether two object has any with different value.
 */
export function shallowDiffers(a: any, b: any): boolean {
  if (a == null) return b != null;
  if (b == null) return false;
  for (const k in a) if (!(k in b)) return true;
  for (const k in b) if (a[k] !== b[k]) return true;
  return false;
}
