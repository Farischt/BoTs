import Discord from "discord.js"
import { DiscordBot } from "../types"
import { Logger } from "../utils"

export default async function interactionCreate(
  bot: DiscordBot,
  interaction: Discord.Interaction
): Promise<void> {
  if (!interaction.isChatInputCommand()) return
  const cmd = bot.commands.get(interaction.commandName)
  if (!cmd) return
  Logger.info(`Command ${interaction.commandName} launched`)
  cmd.run(bot, interaction, interaction.options)
}
