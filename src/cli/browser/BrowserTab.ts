import * as jsdom from 'jsdom';
import * as mio from '../';
import * as puppeteer from 'puppeteer';
import shared = mio.shared;

export class BrowserTab {
	private _browser: puppeteer.Browser;
	private _page: puppeteer.Page;
	private _requests: {[url: string]: puppeteer.Request | ((request: puppeteer.Request) => void)};

	private constructor(browser: puppeteer.Browser, page: puppeteer.Page) {
		this._browser = browser;
		this._page = page;
		this._page.on('requestfinished', request => this._onRequestFinished(request));
		this._requests = {};
	}

	static async createAsync(browser: puppeteer.Browser, url: string, previousUrl?: string) {
		// Initialize the page.
		let page = await browser.newPage();
		await page.setUserAgent(shared.settings.browserUserAgent);	
		await page.setViewport(shared.settings.browserViewport);

		// Initialize the browser tab.
		let browserTab = new BrowserTab(browser, page);
		await browserTab.navigateAsync(url, previousUrl);
		return browserTab;
	}

	async closeAsync() {
		await this._page.close();
	}

	async bufferAsync(url: string) {
		let request = await this._waitForRequest(url);
		let response = request.response();
		if (response && response.status === 200) {
			return response.buffer();
		} else {
			throw new Error('Invalid browser buffer');
		}
	}

	// TODO: Clean me up.
	async navigateAsync(url: string, previousUrl?: string) {
		// Initialize the referer.
		let referer = previousUrl || await this._page.url();
		if (referer !== 'about:blank') await this._page.setExtraHTTPHeaders({Referer: referer});

		// Initialize the navigation.
		this._requests = {};
		await this._page.goto(url, {waitUntil: 'domcontentloaded'});

		// Handle invalid responses.
		for (let i = 1; true; i++) {
			let request = await this._waitForRequest(await this._page.url());
			let response = request.response();
			if (response && response.status === 200) return;
			if (i >= shared.settings.browserNavigateRetries) throw new Error('Invalid browser response');
			this._requests = {};
			await this._page.reload();
		}
	}

	async runIsolatedAsync<T>(handler: (window: Window) => T): Promise<T> {
		let html = await this._page.content();
		let url = await this._page.url();
		let dom = new jsdom.JSDOM(html, {url});
		return handler(dom.window);
	}

	async tabAsync(url: string) {
		let previousUrl = await this._page.url();
		return BrowserTab.createAsync(this._browser, url, previousUrl);
	}

	private _onRequestFinished(request: puppeteer.Request) {
		let value = this._requests[request.url];
		if (value instanceof Function) value(request);
		this._requests[request.url] = request;
	}

	async _waitForRequest(url: string) {
		return new Promise<puppeteer.Request>(resolve => {
			let value = this._requests[url];
			if (value instanceof Function) {
				let wrappedValue = value;
				this._requests[url] = request => resolve() || wrappedValue(request);
			} else if (value) {
				resolve(value);
			} else {
				this._requests[url] = resolve;
			}
		})
	}
}
