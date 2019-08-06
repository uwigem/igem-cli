#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import path from 'path';
import program from 'commander';
import { MAIN_COLOR, SECONDARY_COLOR } from './constants/CLI-Constants';
import { errorAndCrash } from './utils/errorAndCrash';
import { initPuppetAndAuthenticate } from './utils/initPuppetAndAuthenticate';
import { editPage, EditPageOptions } from './actions/newpage';

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
	.option("-e, --edit", "Create a new page")
	.parse(process.argv);

const restArgs = process.argv.slice(2);


// Main
(async () => {
	if (program.edit) {
		const afterAuth = await initPuppetAndAuthenticate(igemUsername!, igemPassword!);
		afterAuth<EditPageOptions>(editPage, {
			pageName: "wkwokTestPage4",
			pageContent: "hihi",
			igemTeam: igemTeam!,
			igemYear: igemYear!
		});
	}

	// Show the help menu if not enough arguments provided
	if (restArgs.length < 1) {
		program.outputHelp();
	}
})();
