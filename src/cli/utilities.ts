// TODO: Move me.
export function format(value: number, wholeNumberLength: number) {
  let result = String(value);
  let index = result.indexOf('.');
  for (let i = wholeNumberLength - (index >= 0 ? index : result.length); i > 0; i--) result = '0' + result;
  return result;
}

// TODO: Move me.
export async function usingAsync<T extends {closeAsync: () => Promise<void>}>(awaiter: Promise<T | undefined>, handler: (value: T) => Promise<void>) {
  let value = await awaiter;
  if (value) {
    try {
      await handler(value);
    } finally {
      await value.closeAsync();
    }
  }
}
