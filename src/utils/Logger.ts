import chalk from "chalk"

export class Logger {
  private static instance: Logger
  private constructor() {}
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  public info(message: string): void {
    console.info(chalk.bold.green(message))
  }

  public log(message: string): void {
    console.log(chalk.bold.blue(message))
  }

  public warn(message: string): void {
    console.warn(chalk.bold.yellow(message))
  }

  public error(message: string): void {
    console.error(chalk.bold.red(message))
  }
}

export default Logger.getInstance()
