import puppeteer from 'puppeteer';

export type AfterAuthenticationFunction<T, U> = (
	browser: puppeteer.Browser,
	page: puppeteer.Page,
	afterAuthFunctionOptions: T
) => U