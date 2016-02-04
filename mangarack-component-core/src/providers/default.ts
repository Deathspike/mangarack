'use strict';
import * as mio from '../default';
import {batoto} from './batoto/default';
import {kissmanga} from './kissmanga/default';
import {mangafox} from './mangafox/default';
let providers = [batoto, kissmanga, mangafox];

/**
 * Opens the provider for the address.
 * @param address The address.
 * @return The provider.
 */
export function openProvider(address: string): mio.IProvider {
  for (let provider of providers) {
    if (provider.isSupported(address)) {
      return provider;
    }
  }
  throw new Error(`Invalid series adress: ${address}`);
}

/**
 * Promises the series.
 * @param address The address.
 * @return The promise for the series.
 */
export function openSeriesAsync(address: string): Promise<mio.ISeries> {
  return openProvider(address).seriesAsync(address);
}
