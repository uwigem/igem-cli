import { AfterAuthenticationFunction } from '../types/afterAuthFunction';

export type UploadImageOptions = {
	igemTeam: string,
	igemYear: string,
	imagePath: string,
	fileName: string
}

export const uploadImage: AfterAuthenticationFunction<UploadImageOptions> = async (browser, page, { igemTeam, igemYear, imagePath, fileName }) => {
	// https://2019.igem.org/Special:Upload
	// https://2019.igem.org/File:T--Washington--testimage2.png
	await page.goto(`https://${igemYear}.igem.org/Special:Upload`, { waitUntil: "domcontentloaded" });
	const uploadButton = await page.$('input#wpUploadFile');
	await uploadButton.uploadFile(imagePath);
	await page.type("#wpDestFile", `T--${igemTeam}--${fileName}`);
	await page.click("#wpUpload");
	await page.waitForNavigation({ waitUntil: "domcontentloaded" });
}