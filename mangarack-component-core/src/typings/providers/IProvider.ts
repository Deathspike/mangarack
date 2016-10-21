import * as mio from '../../default';

/**
 * Represents a provider.
 */
export interface IProvider extends mio.IProviderMetadata {
  /**
   * Determines whether the address is a supported address.
   * @param address The address.
   * @return Indicates whether the address is a supported address.
   */
  isSupported: (address: string) => boolean;

  /**
   * Promises the series.
   * @param address The address.
   * @return The promise for the series.
   */
  seriesAsync: (address: string) => Promise<mio.ISeries>;
}
