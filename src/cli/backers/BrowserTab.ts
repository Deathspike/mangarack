import * as jsdom from 'jsdom';
import * as mio from '../';
import * as puppeteer from 'puppeteer';

export class BrowserTab {
	private readonly _browser: puppeteer.Browser;
	private readonly _page: puppeteer.Page;
	private readonly _requests: {[url: string]: puppeteer.Request | ((request: puppeteer.Request) => void)};

	private constructor(browser: puppeteer.Browser, page: puppeteer.Page) {
		this._browser = browser;
		this._page = page;
		this._page.on('requestfinished', request => this._onRequestFinished(request));
		this._requests = {};
	}

	static async createAsync(browser: puppeteer.Browser, url: string, previousUrl?: string) {
		// Initialize the page.
		let page = await browser.newPage();
		let userAgent = await browser.userAgent();
		await page.setUserAgent(userAgent.replace(/HeadlessChrome/g, 'Chrome'));
		await page.setViewport(mio.settings.browserViewport);

		// Initialize the browser tab.
		let browserTab = new BrowserTab(browser, page);
		await browserTab.navigateAsync(url, previousUrl);
		return browserTab;
	}

	async closeAsync() {
		await this._page.close();
	}

	async bufferAsync(url: string) {
		let request = await this._waitForRequestAsync(url);
		let response = request.response();
		if (response && response.status() === 200) {
			return response.buffer();
		} else {
			throw new Error('Invalid browser buffer response');
		}
	}

	async navigateAsync(url: string, previousUrl?: string) {
		// Initialize the referrer.
		let referrer = previousUrl || (await this._page.url()) || undefined;
		if (referrer === 'about:blank') referrer = undefined;

		// Initialize the navigation.
		this._emptyRequests();
		await this._gotoAsync(url, referrer);

		// Initialize the response.
		for (let i = 1; i <= mio.settings.browserNavigationRetries; i++) {
			let request = await this._waitForRequestAsync(await url);
			let response = request.response();
			if (response && response.status() === 200) return await mio.timeoutAsync(mio.settings.browserNavigationResponseDelay);
			await mio.timeoutAsync(mio.settings.browserNavigationTimeoutRetry);
			await this.reloadAsync();
		}

		// Invalid response.
		throw new Error('Invalid browser navigation response');
	}

	async runIsolatedAsync<T>(handler: (window: Window) => T) {
		let html = await this._page.content();
		let url = await this._page.url();
		let dom = new jsdom.JSDOM(html, {url});
		return handler(dom.window);
	}

	async reloadAsync() {
		this._emptyRequests();
		await this._page.reload();
	}

	async tabAsync(url: string) {
		let previousUrl = await this._page.url();
		return BrowserTab.createAsync(this._browser, url, previousUrl);
	}

	private _emptyRequests() {
		for (let key in this._requests) {
			delete this._requests[key];
		}
	}

	private async _gotoAsync(url: string, referrer?: string) {
		let client = (this._page as any)._client as puppeteer.CDPSession;
		let response = await client.send('Page.navigate', {url, referrer});
		if (response.errorText) throw new Error(response.errorText);
	}

	private _onRequestFinished(request: puppeteer.Request) {
		let value = this._requests[request.url()];
		if (value instanceof Function) value(request);
		this._requests[request.url()] = request;
	}

	private _waitForRequestAsync(url: string) {
		return new Promise<puppeteer.Request>(resolve => {
			let value = this._requests[url];
			if (value instanceof Function) {
				let previousResolve = value;
				this._requests[url] = request => {
					previousResolve(request);
					resolve();
				};
			} else if (value) {
				resolve(value);
			} else {
				this._requests[url] = resolve;
			}
		});
	}
}
