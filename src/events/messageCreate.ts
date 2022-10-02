import Discord from "discord.js"

import CONFIG from "../config.json"
import { DiscordBot } from "../index.d"

// Depreciated
export default function messageCreate(
  bot: DiscordBot,
  message: Discord.Message
): Promise<Discord.Message<boolean>> | undefined {
  if (message.author.bot) return
  if (!message.content.startsWith(CONFIG.COMMAND_PREFIX)) return
  const args = message.content
    .slice(CONFIG.COMMAND_PREFIX.length)
    .trim()
    .split(/ +/g)
  const commandInput = args.shift()?.toLowerCase()
  if (!commandInput) return
  const cmd = bot.commands.get(commandInput)
  if (!cmd) return message.reply("Command not found !")
  cmd.run(bot, message, args)
}
