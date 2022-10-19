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

  public log(message: string): void {
    console.log(chalk.bold.blue(message))
  }

  public table(
    data: any[],
    columns: string[],
    spacingTop?: boolean,
    spacingBottom?: boolean
  ): void {
    spacingTop && console.log("\n")
    console.table(data, columns)
    spacingBottom && console.log("\n")
  }

  public info(message: string): void {
    console.info(chalk.bold.green(message))
  }

  public warn(message: string): void {
    console.warn(chalk.bold.yellow(message))
  }

  public error(message: string): void {
    console.error(chalk.bold.red(message))
  }
}

export default Logger.getInstance()
