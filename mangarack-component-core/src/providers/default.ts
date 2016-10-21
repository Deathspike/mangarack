import * as mio from '../default';
import {batoto} from './batoto/default';
import {kissmanga} from './kissmanga/default';
import {mangafox} from './mangafox/default';
const providers = [batoto, kissmanga, mangafox];

/**
 * Opens the provider for the name or address.
 * @param nameOrAddress The name or address.
 * @return The provider.
 */
export function openProvider(nameOrAddress: string): mio.IProvider {
  for (let provider of providers) {
    if (provider.name === nameOrAddress || provider.isSupported(nameOrAddress)) {
      return provider;
    }
  }
  throw new Error(`Invalid series name or adress: ${nameOrAddress}`);
}

/**
 * Promises the series.
 * @param address The address.
 * @return The promise for the series.
 */
export function openSeriesAsync(address: string): Promise<mio.ISeries> {
  return openProvider(address).seriesAsync(address);
}
