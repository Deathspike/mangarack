import * as mio from '../../';
import {evaluatePage} from './evaluators/page';
import shared = mio.shared;

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
      for (let i = 0; ; i++) {
        try {
          return await this._browserTab.bufferAsync(this._evaluatorPage.imageUrl);
        } catch {
          try {
            await mio.timeoutAsync(1000);
            await this._evaluateAsync();
            return await this._browserTab.bufferAsync(this._evaluatorPage.imageUrl);
          } catch (error) {
            if (i === shared.settings.mangafoxIteratorRetries) throw error;
            await mio.timeoutAsync(9000);
            await this._browserTab.reloadAsync();
            await this._evaluateAsync();
          }
        }
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
