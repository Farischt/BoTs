import fs from "fs/promises"
import path from "path"
import chalk from "chalk"
import Discord from "discord.js"

import { DiscordBot } from "../types"

const webHookDir = path.join(__dirname, "../hooks")

export default async function loader(bot: DiscordBot): Promise<void> {
  ;(await fs.readdir(webHookDir))
    .filter((file) => file.endsWith(".ts"))
    .forEach(async (fileName) => {
      if (fileName === "index.ts") return
      const webHook: Discord.WebhookClient = (
        await import(`${webHookDir}/${fileName}`)
      ).default
      if (!webHook)
        return console.error(
          chalk.bold.bgRed(`WebHook ${fileName} does not exist !`)
        )
      // - 3 in order to remove the .ts extension to the name
      bot.webhooks.set(
        `${
          fileName[0].toLocaleUpperCase() +
          fileName.slice(1, fileName.length - 3)
        }`,
        webHook
      )
    })
}
