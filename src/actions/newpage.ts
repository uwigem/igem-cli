import { AfterAuthenticationFunction } from '../types/afterAuthFunction';
import { HTTPS, NEWPAGE } from '../constants/igem-Constants';
import { progressMessage } from '../utils/progressMessages';

export type EditPageOptions = {
	pageName: string,
	pageContent: string
	igemTeam: string
	igemYear: string
}

export const editPage: AfterAuthenticationFunction<EditPageOptions> = async (browser, page, { pageName, pageContent, igemTeam, igemYear }) => {
	let pageToEdit = `${HTTPS}${igemYear}${NEWPAGE.REST_URL}${igemTeam}/${pageName}${NEWPAGE.ACTION_EDIT}`;
	await page.goto(
		pageToEdit,
		{ waitUntil: "domcontentloaded" }
	);
	progressMessage(`Navigated to ${pageToEdit}...`);
	await page.evaluate((getter, content) => {
		if (document) {
			(document.querySelector(getter)! as HTMLInputElement).value = content;
		}
	}, NEWPAGE.TEXT_BOX_GETTER, pageContent);
	progressMessage(`Typing content...`);
	await page.click(NEWPAGE.SAVE_BUTTON_GETTER);
	progressMessage(`Content saved.`);
	process.exit(0);
};