/**
 * Whether provided value is a string containing message format template.
 */
export function isFormatString(value: any): value is string {
  return typeof value === "string"
    && value.indexOf("%") >= 0;
}
