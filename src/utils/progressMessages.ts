import chalk from 'chalk';

export const progressMessage = (msg: string) => {
	console.log(chalk.cyan(msg) + "\n");
}