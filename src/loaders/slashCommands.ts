import Discord, { REST, Routes } from "discord.js"
import chalk from "chalk"
import { DiscordBot, DiscordCommandOption } from "../types"

export function addSlashCommandOption(
  slashCommand: Discord.SlashCommandBuilder,
  option: DiscordCommandOption
): void {
  const optionType =
    option.type.slice(0, 1).toUpperCase() +
    option.type.slice(1, option.type.length)

  switch (optionType) {
    case "User":
      slashCommand.addUserOption((opt) =>
        opt
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(option.required)
      )
      break
    case "String":
      slashCommand.addStringOption((opt) =>
        opt
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(option.required)
      )
      break
    default:
      console.error(chalk.bold.bgRed(`Not supported option type ${optionType}`))
  }
}

export default async function loader(bot: DiscordBot): Promise<void> {
  const commands: Discord.SlashCommandBuilder[] = []
  bot.commands.forEach((command) => {
    const { options } = command
    const slashCommand = new Discord.SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description)
      .setDMPermission(command.dmPermission)
      .setDefaultMemberPermissions(command.defaultMemberPermission?.toString())

    if (options && options.length > 0) {
      options.forEach((opt) => {
        addSlashCommandOption(slashCommand, opt)
      })
    }
    commands.push(slashCommand)
  })

  const rest = new REST({ version: "10" }).setToken(bot.token?.toString() ?? "")
  try {
    await rest.put(Routes.applicationCommands(bot.user?.id ?? ""), {
      body: commands,
    })
  } catch (error) {
    console.error(chalk.bold.bgRed("Slash commands failed to load :\n"), error)
  }
}
