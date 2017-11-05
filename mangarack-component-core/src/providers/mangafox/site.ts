/**
 * Represents the collection of site utilities.
 */
export let site = {
  /**
   * Resolves a context-aware address.
   * @param from The from address.
   * @param to The to address.
   * @return The absolute address.
   */
  resolve: (from: string, to: string) => {
    // NOTE: We should be using `url.resolve` instead of this hack, or
    // a context-aware browser emulation. The latter has future preference.
    if (/^\/\//.test(to)) {
      return from.match(/^(https?:)/)![1] + to;
    } else {
      return to;
    }
  }
}
