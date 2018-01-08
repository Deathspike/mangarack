import * as mio from '../../default';
import {createSeriesAsync} from './series';

/**
 * Represents the provider.
 */
export let mangafox: mio.IProvider = {isSupported: isSupported, name: 'mangafox', seriesAsync: seriesAsync};

/**
 * Determines whether the address is a supported address.
 * @param address The address.
 * @return Indicates whether the address is a supported address.
 */
function isSupported(address: string): boolean {
  return /^https?:\/\/mangafox\.la\/manga\/.+\/$/i.test(address);
}

/**
 * Promises the series.
 * @param address The address.
 * @return The promise for the series.
 */
function seriesAsync(address: string): Promise<mio.ISeries> {
  if (isSupported(address)) {
    return createSeriesAsync(address);
  } else {
    throw new Error(`Invalid series address: ${address}`);
  }
}
