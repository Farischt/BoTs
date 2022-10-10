import fs from "fs/promises"
import path from "path"
import chalk from "chalk"

import { DiscordBot, DiscordCommandDocument } from "../types"

const commandsDir = path.join(__dirname, "../commands")

export default async function loader(bot: DiscordBot): Promise<void> {
  ;(await fs.readdir(commandsDir))
    .filter((file) => file.endsWith(".ts"))
    .forEach(async (fileName) => {
      if (fileName === "index.ts") return
      const command: DiscordCommandDocument = (
        await import(`${commandsDir}/${fileName}`)
      ).default
      if (!command)
        return console.error(
          chalk.bold.bgRed(`Command ${fileName} does not exist !`)
        )
      if (!command.getName())
        return console.error(
          chalk.bold.bgRed(`Command ${fileName} has no name !`)
        )
      bot.commands.set(command.getName(), command)
    })
}
