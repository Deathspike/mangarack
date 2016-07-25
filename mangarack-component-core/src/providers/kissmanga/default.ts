import * as mio from '../../default';
import {createSeriesAsync} from './series';

/**
 * Represents the provider.
 * @internal
 */
export let kissmanga: mio.IProvider = {
  /**
   * Determines whether the address is a supported address.
   * @param address The address.
   * @return Indicates whether the address is a supported address.
   */
  isSupported: function(address: string): boolean {
    return /^http:\/\/kissmanga\.com\/Manga\//.test(address) && !/\/$/.test(address);
  },

  /**
   * Contains the name.
   */
  name: 'kissmanga',

  /**
   * Promises the series.
   * @param address The address.
   * @return The promise for the series.
   */
  seriesAsync: function(address: string): Promise<mio.ISeries> {
    if (!kissmanga.isSupported(address)) {
      throw new Error(`Invalid series address: ${address}`);
    } else {
      return createSeriesAsync(address);
    }
  }
};
