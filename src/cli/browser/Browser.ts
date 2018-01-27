import * as mio from '../';
import * as puppeteer from 'puppeteer';
import shared = mio.shared;

export class Browser {
	private _browser: puppeteer.Browser;

	private constructor(browser: puppeteer.Browser) {
		this._browser = browser;
	}

	async closeAsync() {
		await this._browser.close();
	}

	static async createAsync() {
		let userDataDir = shared.path.hidden('chromeCache');
		let browser = await puppeteer.launch({headless: shared.settings.browserHeadless, userDataDir});
    return new Browser(browser);
	}

	async tabAsync(url: string) {
		return mio.BrowserTab.createAsync(this._browser, url);
	}
}
