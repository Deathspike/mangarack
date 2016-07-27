/* tslint:disable:interface-name */

/**
 * Represents the window.
 */
interface Window {
  /**
   * Indicates whether the application is loading through asset overrides.
   */
  assetLoading?: boolean;

  /**
   * Contains the collection of asset overrides.
   */
  assetOverrides?: AssetOverrides;
}
