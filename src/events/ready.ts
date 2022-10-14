import Discord from "discord.js"
import chalk from "chalk"
import { slashCommandsLoader } from "../loaders"
import { DiscordBot } from "../types"

export default async function ready(
  bot: DiscordBot,
  message: Discord.Message
): Promise<void> {
  if (!bot.user) return
  await slashCommandsLoader(bot)
  console.log(chalk.blue(`${bot.user.tag} is ready !`))
}
