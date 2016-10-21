import * as mio from '../../default';
import {createSeriesAsync} from './series';

/**
 * Represents the provider.
 */
export let batoto: mio.IProvider = {isSupported: isSupported, name: 'batoto', seriesAsync: seriesAsync};

/**
 * Determines whether the address is a supported address.
 * @param address The address.
 * @return Indicates whether the address is a supported address.
 */
function isSupported(address: string): boolean {
  return /^https?:\/\/bato\.to\/comic\/_\/comics\/.*-r[0-9]+$/i.test(address);
}

/**
 * Promises the series.
 * @param address The address.
 * @return The promise for the series.
 */
function seriesAsync(address: string): Promise<mio.ISeries> {
  if (!isSupported(address)) {
    throw new Error(`Invalid series address: ${address}`);
  } else {
    return createSeriesAsync(address);
  }
}
