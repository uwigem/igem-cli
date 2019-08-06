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
import { progressMessage } from './utils/progressMessages';


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
	.version("0.0.1")
	.description("Deploy to the iGEM Site easier!")
	.option("-e, --edit <page name> <content file>", "Create a new page or edit an existing page")
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
			afterAuth<EditPageOptions>(editPage, {
				pageName,
				pageContent: fileContents,
				igemTeam: igemTeam!,
				igemYear: igemYear!
			});
		}

		// Show the help menu if not enough arguments provided
		if (restArgs.length < 1) {
			program.outputHelp();
		}
	})();
} catch (error) {
	errorAndCrash(error);
}
