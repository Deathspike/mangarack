import * as mio from '../../';
import {evaluatePage} from './evaluators/page';
import shared = mio.shared;

export class ScraperIterator implements mio.IScraperIterator {
  private readonly _browserTab: mio.BrowserTab;
  private _currentPageNumber: number;
  private _page?: IEvaluatorPage;
  
  constructor(browserTab: mio.BrowserTab) {
    this._browserTab = browserTab;
    this._currentPageNumber = 1;
    this._page = undefined;
  }

  closeAsync() {
    return this._browserTab.closeAsync();
  }

  async currentAsync() {
    if (this._page) {
      for (let i = 0; ; i++) {
        try {
          return await this._browserTab.bufferAsync(this._page.imageUrl);
        } catch {
          try {
            await mio.timeoutAsync(1000);
            await this._evaluateAsync();
            return await this._browserTab.bufferAsync(this._page.imageUrl);
          } catch (error) {
            if (i === shared.settings.mangafoxIteratorRetries) throw error;
            await mio.timeoutAsync(9000);
            await this._browserTab.reloadAsync();
            await this._evaluateAsync();
          }
        }
      }
    } else {
      throw new Error('Invalid scraper iterator call');
    }
  }

  async moveAsync() {
    if (!this._page) {
      await this._evaluateAsync();
      return true;
    } else if (this._page.nextPageUrl) {
      await this._browserTab.navigateAsync(this._page.nextPageUrl);
      await this._evaluateAsync();
      this._currentPageNumber++;
      return true;
    } else if (this._currentPageNumber >= 2) {
      return false;
    } else {
      throw new Error('Invalid scraper iterator response');
    }
  }

  private async _evaluateAsync() {
    this._page = await this._browserTab.runIsolatedAsync(evaluatePage);
  }
}
