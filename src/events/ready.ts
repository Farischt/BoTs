import Discord from "discord.js"
import { slashCommandsLoader } from "../loaders"
import { DiscordBot } from "../types"
import { Logger } from "../utils"

export default async function ready(
  bot: DiscordBot,
  message: Discord.Message
): Promise<void> {
  if (!bot.user) return
  await slashCommandsLoader(bot)
  bot.music.connect(bot.user.id)
  Logger.log(`${bot.user.tag} is ready !`)
}
