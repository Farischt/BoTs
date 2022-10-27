import fs from "fs/promises"
import path from "path"

import { DiscordBot, DiscordCommandDocument } from "../types"
import { Logger, fileExtension } from "../utils"

const commandsDir = path.join(__dirname, "../commands")

export default async function loader(
  bot: DiscordBot,
  dir = commandsDir
): Promise<void> {
  ;(await fs.readdir(dir, { withFileTypes: true }))
    .filter(
      (file) =>
        file.name !== "__tests__" && file.name !== `index${fileExtension}`
    )
    .forEach(async (file) => {
      if (file.isDirectory()) {
        await loader(bot, path.join(dir, file.name))
      } else {
        if (!file.name.endsWith(fileExtension)) return
        const command: DiscordCommandDocument = (
          await import(`${dir}/${file.name}`)
        ).default
        if (!command)
          return Logger.error(`Command ${file.name} does not exist !`)
        if (!command.getName())
          return Logger.error(`Command ${file.name} has no name !`)
        bot.commands.set(command.getName(), command)
      }
    })
}
