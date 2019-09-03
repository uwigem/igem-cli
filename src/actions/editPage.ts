import { AfterAuthenticationFunction } from '../types/afterAuthFunction';
import { HTTPS, NEWPAGE } from '../constants/igem-Constants';
import { progressMessage, successMessage } from '../utils/progressMessages';

export type EditPageOptions = {
	pageName: string,
	pageContent: string
	igemTeam: string
	igemYear: string,
	template?: boolean
}

export const editPage: AfterAuthenticationFunction<EditPageOptions, void> = async (browser, page, { pageName, pageContent, igemTeam, igemYear, template }) => {
	let pageToEdit = `${HTTPS}${igemYear}${template ? NEWPAGE.TEMPLATE_URL : NEWPAGE.REST_URL}${igemTeam}/${pageName}${NEWPAGE.ACTION_EDIT}`;
	await page.goto(
		pageToEdit,
		{ waitUntil: "domcontentloaded" }
	);

	progressMessage(`Navigated to ${pageToEdit}...`);

	const elementContent = await page.$eval(NEWPAGE.TEXT_BOX_GETTER, (el) => {
		return el.textContent;
	});
	if (typeof elementContent === "string" && elementContent.trim() !== pageContent.trim()) {
		await page.evaluate((getter, content) => {
			if (document) {
				let getElement = (document.querySelector(getter)! as HTMLInputElement);
				getElement.value = content;
			}
		}, NEWPAGE.TEXT_BOX_GETTER, pageContent);
		progressMessage(`Typing content...`);
		await page.click(NEWPAGE.SAVE_BUTTON_GETTER);
		successMessage(`Content saved for ${pageName}.`);
	} else {
		successMessage(`Content not modified for ${pageName}. Ignoring...`);
	}
};