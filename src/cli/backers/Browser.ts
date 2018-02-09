import * as mio from '../';
import * as puppeteer from 'puppeteer';
import shared = mio.shared;

// [Improvement] Scraper should use puppeteer directly.
// [Improvement] Scraper should use mouse emulation to open links.
export class Browser {
	private readonly _browser: puppeteer.Browser;

	private constructor(browser: puppeteer.Browser) {
		this._browser = browser;
	}

	async closeAsync() {
		await this._browser.close();
	}

	static async createAsync() {
		let userDataDir = shared.path.hidden(shared.settings.browserUserDataDir);
		let browser = await puppeteer.launch({headless: shared.settings.browserHeadless, userDataDir});
    return new Browser(browser);
	}

	async tabAsync(url: string) {
		return await mio.BrowserTab.createAsync(this._browser, url);
	}
}
