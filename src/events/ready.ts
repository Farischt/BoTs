import Discord from "discord.js"

import slashCommandsLoader from "../loaders/slashCommands"
import { DiscordBot } from "../types"

export default async function ready(
  bot: DiscordBot,
  message: Discord.Message
): Promise<void> {
  if (bot.user) console.log(`${bot.user.tag} is ready !`)
  await slashCommandsLoader(bot)
}
