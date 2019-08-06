import puppeteer from 'puppeteer';

export type AfterAuthenticationFunction<T> = (
	browser: puppeteer.Browser,
	page: puppeteer.Page,
	afterAuthFunctionOptions: T
) => void