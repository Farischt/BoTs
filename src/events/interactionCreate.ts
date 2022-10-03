import Discord from "discord.js"
import chalk from "chalk"
import { DiscordBot } from "../types"

export default async function interactionCreate(
  bot: DiscordBot,
  interaction: Discord.Interaction
): Promise<void> {
  if (!interaction.isChatInputCommand()) return
  const cmd = bot.commands.get(interaction.commandName)
  if (!cmd) return
  console.info(chalk.green(`Command ${interaction.commandName} launched`))
  cmd.run(bot, interaction, interaction.options)
}
