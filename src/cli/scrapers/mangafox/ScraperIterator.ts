import * as mio from '../../';
import {evaluatePage} from './evaluators/page';

// TODO: Protect against an iterator with JUST ONE page. That's a scraper issue.
export class ScraperIterator implements mio.IScraperIterator {
  private _browserTab: mio.BrowserTab;
  private _evaluatorPage?: IEvaluatorPage;

  constructor(browserTab: mio.BrowserTab) {
    this._browserTab = browserTab;
    this._evaluatorPage = undefined;
  }

  closeAsync() {
    return this._browserTab.closeAsync();
  }

  async currentAsync() {
    if (this._evaluatorPage) {
      try {
        return await this._browserTab.bufferAsync(this._evaluatorPage.imageUrl);
      } catch (error) {
        await mio.timeoutAsync(1000);
        await this._evaluateAsync();
        return this._browserTab.bufferAsync(this._evaluatorPage.imageUrl);
      }
    } else {
      throw new Error('Call `moveAsync` before `currentAsync`');
    }
  }

  async moveAsync() {
    if (!this._evaluatorPage) {
      await this._evaluateAsync();
      return true;
    } else if (this._evaluatorPage.nextPageUrl) {
      await this._browserTab.navigateAsync(this._evaluatorPage.nextPageUrl);
      await this._evaluateAsync();
      return true;
    } else {
      return false;
    }
  }

  private async _evaluateAsync() {
    this._evaluatorPage = await this._browserTab.runIsolatedAsync(evaluatePage);
  }
}
