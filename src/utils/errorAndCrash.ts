import chalk from 'chalk';

export const errorAndCrash = (errorLines: string[]) => {
	console.log(chalk.bgRed(errorLines.join("\n")));
	process.exit(1);
}