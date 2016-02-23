import * as mio from '../../default';
import {createSeriesAsync} from './series';

/**
 * Represents the provider.
 * @internal
 */
export let mangafox: mio.IProvider = {
  /**
   * Contains the name.
   */
  name: 'mangafox',

  /**
   * Determines whether the address is a supported address.
   * @param address The address.
   * @return Indicates whether the address is a supported address.
   */
  isSupported: function(address: string): boolean {
    return /^http:\/\/mangafox\.me\/manga\/.+\/$/i.test(address);
  },

  /**
   * Promises the series.
   * @param address The address.
   * @return The promise for the series.
   */
  seriesAsync: function(address: string): Promise<mio.ISeries> {
    if (!mangafox.isSupported(address)) {
      throw new Error(`Invalid series address: ${address}`);
    } else {
      return createSeriesAsync(address);
    }
  }
};
