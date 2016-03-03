/**
 * Splits the value by camel case.
 * @param value The value.
 * @return The value split by camel.
 */
export function splitCamelCase(value: string): string {
  return value.replace(/([a-z])([A-Z])/g, '$1 $2');
}
