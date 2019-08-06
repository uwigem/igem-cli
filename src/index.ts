#!/usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import figlet from 'figlet';
// import path from 'path';
// import program from 'commander';
import { MAIN_COLOR, SECONDARY_COLOR } from './constants/CLI-Constants';

clear();
console.log(
	chalk.bgHex(SECONDARY_COLOR).hex(MAIN_COLOR)(
		figlet.textSync("igem cli", { horizontalLayout: 'full' })
	),
	"\n",
	chalk.bgHex(SECONDARY_COLOR).hex(MAIN_COLOR)(
		"by Washington iGEM"
	)
);