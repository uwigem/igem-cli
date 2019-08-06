import chalk from 'chalk';

export const progressMessage = (msg: string) => {
	console.log(chalk.cyan(msg));
}

export const successMessage = (msg: string) => {
	console.log(chalk.green(msg));
}