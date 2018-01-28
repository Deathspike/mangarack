import * as mio from '../../';
import {evaluatePage} from './evaluators/page';

export class Iterator implements mio.IProviderIterator {
  private _browserTab: mio.BrowserTab;
  private _current?: IEvaluatorPage;

  constructor(browserTab: mio.BrowserTab) {
    this._browserTab = browserTab;
    this._current = undefined;
  }

  closeAsync() {
    return this._browserTab.closeAsync();
  }

  async currentAsync() {
    if (this._current) {
      try {
        return await this._browserTab.bufferAsync(this._current.imageUrl);
      } catch (error) {
        await mio.timeoutAsync(1000);
        await this._updateAsync();
        return this._browserTab.bufferAsync(this._current.imageUrl);
      }
    } else {
      throw new Error('Call `moveAsync` before `currentAsync`');
    }
  }

  async moveAsync() {
    if (!this._current) {
      await this._updateAsync();
      return true;
    } else if (this._current.nextPageUrl) {
      await this._browserTab.navigateAsync(this._current.nextPageUrl);
      await this._updateAsync();
      return true;
    } else {
      return false;
    }
  }

  private async _updateAsync() {
    this._current = await this._browserTab.runIsolatedAsync(evaluatePage);
  }
}
