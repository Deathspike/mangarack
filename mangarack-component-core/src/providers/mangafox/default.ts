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
  return /^https?:\/\/mangafox\.me\/manga\/.+\/$/i.test(address);
}

/**
 * Promises the series.
 * @param address The address.
 * @return The promise for the series.
 */
function seriesAsync(address: string): Promise<mio.ISeries> {
  let normalizedAddress = normalizeAddress(address);
  if (isSupported(normalizedAddress)) {
    return createSeriesAsync(normalizedAddress);
  } else {
    throw new Error(`Invalid series address: ${address}`);
  }
}

/**
 * Normalizes the address.
 * @param address The address.
 * @return The normalized address.
 */
function normalizeAddress(address: string): string {
  if (/^http:\/\//i.test(address)) {
    return `https://${address.substr(7)}`;
  } else {
    return address;
  }
}
