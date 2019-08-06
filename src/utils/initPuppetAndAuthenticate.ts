import puppeteer from 'puppeteer';
import { AfterAuthenticationFunction } from '../types/afterAuthFunction';
import { LOGIN } from '../constants/igem-Constants';
import { progressMessage } from './progressMessages';

/**
 * Authenticates the user and returns a promise that resolves into a function that is called afterwards
 * with a defined type.
 * 
 * @param {string} igemUsername iGEM Username
 * @param {string} igemPassword iGEM Password
 * @returns {AfterAuthenticationFunction} Function that is called afterwards
 */
export const initPuppetAndAuthenticate = async (igemUsername: string, igemPassword: string) => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();

	progressMessage(`Logging in as ${igemUsername}...`);
	await page.goto(LOGIN.URL, { waitUntil: "domcontentloaded" });
	await page.type(LOGIN.USERNAME_GETTER, igemUsername);
	await page.type(LOGIN.PASSWORD_GETTER, igemPassword);
	await page.click(LOGIN.SUBMIT_GETTER);
	progressMessage("Login success!");

	return async <T>(afterAuthFunction: AfterAuthenticationFunction<T>, afterAuthFunctionOptions: T) => {
		await afterAuthFunction(browser, page, afterAuthFunctionOptions);
	}
}