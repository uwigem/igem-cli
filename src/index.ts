#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import path from 'path';
import program from 'commander';
import { MAIN_COLOR, SECONDARY_COLOR } from './constants/CLI-Constants';
import { errorAndCrash } from './utils/errorAndCrash';
import { initPuppetAndAuthenticate } from './utils/initPuppetAndAuthenticate';
import { editPage, EditPageOptions } from './actions/editPage';
import fs from 'fs';
import { progressMessage, successMessage } from './utils/progressMessages';
import { UploadImageOptions, UploadImageReturn, uploadImage } from './actions/uploadImage';


// Print CLI intro line
clear();
console.log(
	chalk.bgHex(SECONDARY_COLOR).hex(MAIN_COLOR)(
		figlet.textSync("igem cli", { horizontalLayout: 'full' })
	),
	"\n",
	chalk.bgHex(SECONDARY_COLOR).hex(MAIN_COLOR)(
		"by Washington iGEM"
	),
	"\n"
);

// Get environment configs, crash if not set.
const igemUsername = process.env.IGEM_USERNAME;
const igemPassword = process.env.IGEM_PASSWORD;
const igemTeam = process.env.IGEM_TEAM;
const igemYear = process.env.IGEM_YEAR;

if (!igemUsername || !igemPassword || !igemTeam || !igemYear) {
	errorAndCrash(["Error! Username/Password/Team/Year not specified. Please see the README for more instructions."]);
}

// Set up routes
program
	.version("0.0.2")
	.description("Deploy to the iGEM Site easier!")
	.option("-e, --edit <page name> <content path>", "Create a new page or edit an existing page.")
	.option("-a, --all <content folder>", "Create content pages from html files inside a specified folder")
	.option("-i, --image <image path>", "Upload an image to the igem site.")
	.parse(process.argv);

const restArgs = process.argv.slice(3);

// Main
try {
	(async () => {
		if (program.edit) {
			let pageName = restArgs[0];
			progressMessage(`Editing page: ${pageName}`);
			const afterAuth = await initPuppetAndAuthenticate(igemUsername!, igemPassword!);
			const fileContents = fs.readFileSync(path.join(process.cwd(), restArgs[1]), { encoding: 'utf8' });
			await afterAuth<EditPageOptions, void>(editPage, {
				pageName,
				pageContent: fileContents,
				igemTeam: igemTeam!,
				igemYear: igemYear!
			});
			process.exit(0);
		}

		if (program.all) {
			const afterAuth = await initPuppetAndAuthenticate(igemUsername!, igemPassword!);
			const files = fs.readdirSync(path.join(process.cwd(), restArgs[0]));
			successMessage(`Found files ${files.join(", ")}`);

			// async await does not work inside forEach loops
			for (let i = 0; i < files.length; i++) {
				let file = files[i];
				let pageName = file.split(".")[0];
				const fileContents = fs.readFileSync(path.join(process.cwd(), restArgs[0], file), { encoding: 'utf8' });
				await afterAuth<EditPageOptions, void>(editPage, {
					pageName,
					pageContent: fileContents,
					igemTeam: igemTeam!,
					igemYear: igemYear!
				});
			}
			process.exit(0);
		}

		if (program.image) {
			const afterAuth = await initPuppetAndAuthenticate(igemUsername!, igemPassword!);
			const imagePath = path.join(process.cwd(), restArgs[0]);
			const fileNameSplit = restArgs[0].split("/");
			const fileName = fileNameSplit[fileNameSplit.length - 1];

			const imageUrl = await afterAuth<UploadImageOptions, UploadImageReturn>(uploadImage, {
				igemTeam: igemTeam!,
				igemYear: igemYear!,
				imagePath,
				fileName
			});

			successMessage(`${fileName}:\t\t${imageUrl}`);
		}

		// Show the help menu if not enough arguments provided
		if (restArgs.length < 1) {
			program.outputHelp();
		}
	})();
} catch (error) {
	errorAndCrash(error);
}
