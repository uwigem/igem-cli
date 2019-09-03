import { AfterAuthenticationFunction } from '../types/afterAuthFunction';
import { HTTPS } from '../constants/igem-Constants';
import { progressMessage, successMessage, failMessage } from '../utils/progressMessages';

export type UploadImageOptions = {
	igemTeam: string,
	igemYear: string,
	imagePath: string,
	fileName: string
}

export type UploadImageReturn = Promise<string>;

// TODO: Factor out some things to use igem-constants
export const uploadImage: AfterAuthenticationFunction<UploadImageOptions, UploadImageReturn> = async (browser, page, { igemTeam, igemYear, imagePath, fileName }) => {
	let supposedFinalImageLink = `${HTTPS}${igemYear}.igem.org/File:T--${igemTeam}--${fileName}`;
	await page.goto(supposedFinalImageLink, { waitUntil: "domcontentloaded" });
	progressMessage(`Checking if ${fileName} exists...`);
	let possibleImageElement: string;

	try {
		possibleImageElement = await page.$eval(".fullImageLink", (el) => {
			if (el) {
				return (el.children[0].children[0] as HTMLImageElement).src;
			}
			return "";
		});
	} catch (e) {
		possibleImageElement = "";
	}

	if (possibleImageElement !== "") {
		progressMessage(`${fileName} exists, ignoring...`);
		return possibleImageElement;
	}

	await page.goto(`https://${igemYear}.igem.org/Special:Upload`, { waitUntil: "domcontentloaded" });
	progressMessage(`Uploading ${fileName}...`);
	const uploadButton = await page.$('input#wpUploadFile');
	await uploadButton!.uploadFile(imagePath);
	await page.type("#wpDestFile", `T--${igemTeam}--${fileName}`);

	// https://github.com/GoogleChrome/puppeteer/issues/1637#issuecomment-355223428
	await Promise.all([
		page.click(`input[name="wpUpload"]`),
		await page.waitForNavigation({ waitUntil: "domcontentloaded" })
	]);

	successMessage(`${fileName} uploaded!`);

	try {
		possibleImageElement = await page.$eval(".fullImageLink", (el) => {
			if (el) {
				return (el.children[0].children[0] as HTMLImageElement).src;
			}
			return "";
		});
	} catch (e) {
		failMessage(`Failed to upload ${fileName}`);
	}

	return possibleImageElement;
}