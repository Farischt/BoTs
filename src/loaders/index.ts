import fs from "fs/promises"
import path from "path"

import { DiscordCompleteClient } from "../index.d"

const commandsDir = path.join(__dirname, "../commands")

export default async function loader(bot: DiscordCompleteClient) {
  const commands = (await fs.readdir(commandsDir)).filter((file) =>
    file.endsWith(".ts")
  )

  commands.forEach(async (fileName) => {
    const command = (await import(`${commandsDir}/${fileName}`)).default
    if (!command.name) return console.error(`Command ${fileName} has no name !`)
    bot.commands.set(command.name, command)
    console.warn(`Command ${command.name} loaded !`)
  })
}
