import * as mio from '../../default';
import {createSeriesAsync} from './series';

/**
 * Represents the provider.
 */
export let mangafox: mio.IProvider = {name: 'mangafox', seriesAsync: seriesAsync, support: support};

/**
 * Promises the series.
 * @param address The address.
 * @return The promise for the series.
 */
function seriesAsync(address: string): Promise<mio.ISeries> {
  if (!support) {
    throw new Error(`Invalid series address: ${address}`);
  } else {
    return createSeriesAsync(address);
  }
}

/**
 * Determines whether the address is a supported address.
 * @param address The address.
 * @return Indicates whether the address is a supported address.
 */
function support(address: string): boolean {
  return /^http:\/\/mangafox\.me\/manga\/.+\/$/i.test(address);
}
