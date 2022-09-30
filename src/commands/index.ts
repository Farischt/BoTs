import Discord from "discord.js"

import { DiscordCompleteClient } from "../index.d"
import CONFIG from "../config.json"

export default async function readAndReturnCommand(
  bot: DiscordCompleteClient,
  message: Discord.Message
) {
  if (message.author.bot) return
  if (!message.content.startsWith(CONFIG.COMMAND_PREFIX)) return
  const args = message.content
    .slice(CONFIG.COMMAND_PREFIX.length)
    .trim()
    .split(/ +/g)
  const commandInput = args.shift()?.toLowerCase()
  if (!commandInput) return
  const cmd = bot.commands.get(commandInput)
  if (!cmd) return
  cmd.run(bot, message, args)
}
