declare let Buffer: any;
declare let window: any;

/**
 * Converts the value to base64.
 * @internal
 * @param value The value.
 * @return The base64 representation of the value.
 */
export function convertToBase64(value: string): string {
  if (typeof window !== 'undefined') {
    return window.btoa(value);
  } else if (typeof Buffer !== 'undefined') {
    return new Buffer(value, 'binary').toString('base64');
  } else {
    throw new Error('No implementation of `btoa` available.');
  }
}
