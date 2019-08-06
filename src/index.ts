#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
import path from 'path';
import program from 'commander';
import { MAIN_COLOR, SECONDARY_COLOR } from './constants/CLI-Constants';

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

// Get environment configs
const igemUsername = process.env.IGEM_USERNAME;
const igemPassword = process.env.IGEM_PASSWORD;
if (!igemUsername || !igemPassword) {
	console.log(chalk.bgRed("Error! Username/Password not specified. Please see the README for more instructions."));
	process.exit(1);
}

program
	.version("0.0.1")
	.description("Deploy to the iGEM Site easier!")
	.option("-n, --newpage", "Create a new page")
	.parse(process.argv);

if (program.newpage) {
	console.log("new page is now being created");
}