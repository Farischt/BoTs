import Discord from "discord.js"
import { DiscordBot } from "../types"

export default async function interactionCreate(
  bot: DiscordBot,
  interaction: Discord.Interaction
): Promise<void> {
  if (!interaction.isChatInputCommand()) return
  const cmd = bot.commands.get(interaction.commandName)
  if (!cmd) return
  cmd.run(bot, interaction, interaction.options)
}
