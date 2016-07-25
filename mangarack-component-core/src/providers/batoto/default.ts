import * as mio from '../../default';
import {createSeriesAsync} from './series';

/**
 * Represents the provider.
 * @internal
 */
export let batoto: mio.IProvider = {
  /**
   * Determines whether the address is a supported address.
   * @param address The address.
   * @return Indicates whether the address is a supported address.
   */
  isSupported: function(address: string): boolean {
    return /^https?:\/\/bato\.to\/comic\/_\/comics\/.*-r[0-9]+$/i.test(address);
  },

  /**
   * Contains the name.
   */
  name: 'batoto',

  /**
   * Promises the series.
   * @param address The address.
   * @return The promise for the series.
   */
  seriesAsync: function(address: string): Promise<mio.ISeries> {
    if (!batoto.isSupported(address)) {
      throw new Error(`Invalid series address: ${address}`);
    } else {
      return createSeriesAsync(address);
    }
  }
};
