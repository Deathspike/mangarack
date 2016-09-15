import * as mio from '../../default';
import {createSeriesAsync} from './series';

/**
 * Represents the provider.
 * @internal
 */
export const dynastyreader: mio.IProvider = {
  /**
   * Contains the name.
   */
  name: 'dynastyreader',

  /**
   * Determines whether the address is a supported address.
   * @param address The address.
   * @return Indicates whether the address is a supported address.
   */
  isSupported: function(address: string): boolean {
    return /^http:\/\/dynasty-scans\.com\/series\//.test(address) && !/\/$/.test(address);
  },

  /**
   * Promises the series.
   * @param address The address.
   * @return The promise for the series.
   */
  seriesAsync: function(address: string): Promise<mio.ISeries> {
    if (!dynastyreader.isSupported(address)) {
      throw new Error(`Invalid series address: ${address}`);
    }

    return createSeriesAsync(address);
  }
};
