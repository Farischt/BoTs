import Discord from "discord.js"

import CONFIG from "../config.json"
import { DiscordBot } from "../types"

enum MessageErrorResponse {
  InvalidCommandInput = "Invalid command input !",
  CommandNotFound = "Command not found !",
  CommandDepreciated = "Bip bip bip... Please use slash commands instead.",
}

// LEGACY
export default async function messageCreate(
  bot: DiscordBot,
  message: Discord.Message
): Promise<Discord.Message<boolean> | undefined> {
  if (!message.content.startsWith(CONFIG.COMMAND_PREFIX)) return
  const args = message.content
    .slice(CONFIG.COMMAND_PREFIX.length)
    .trim()
    .split(/ +/g)
  const commandInput = args.shift()?.toLowerCase()
  if (!commandInput)
    return await message.reply(MessageErrorResponse.InvalidCommandInput)
  const cmd = bot.commands.get(commandInput)
  if (!cmd) return await message.reply(MessageErrorResponse.CommandNotFound)

  return await message.reply(
    `${MessageErrorResponse.CommandDepreciated} (/${cmd.getName()})`
  )
}
