import chalk from 'chalk';

export const progressMessage = (msg: string) => {
	console.log(chalk.cyan(msg));
}

export const successMessage = (msg: string) => {
	console.log(chalk.green(msg));
}

export const failMessage = (msg: string) => {
	console.log(chalk.red(msg));
}