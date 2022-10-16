import Discord, { REST, Routes } from "discord.js"
import {
  DiscordBot,
  DiscordCommandDocument,
  DiscordCommandOption,
  DiscordCommandOptionType,
} from "../types"
import { Logger } from "../utils"

export function addSlashCommandOption(
  slashCommand: Discord.SlashCommandBuilder,
  option: DiscordCommandOption
): void {
  switch (option.type) {
    case DiscordCommandOptionType.User:
      slashCommand.addUserOption((opt) =>
        opt
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(option.required)
      )
      break
    case DiscordCommandOptionType.String:
      slashCommand.addStringOption((opt) => {
        opt
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(option.required)
        if (option.choices) {
          option.choices?.forEach((choice) => {
            opt.addChoices(choice)
          })
        }
        return opt
      })
      break
    default:
      Logger.error(`Not supported option type ${option.type}`)
  }
}

export function createSlashCommand(
  command: DiscordCommandDocument
): Discord.SlashCommandBuilder {
  return new Discord.SlashCommandBuilder()
    .setName(command.getName())
    .setDescription(command.getDescription())
    .setDMPermission(command.getDmPermission())
    .setDefaultMemberPermissions(
      command.getDefaultMemberPermission()?.toString()
    )
}

export function createSlashCommands(
  bot: DiscordBot
): Discord.SlashCommandBuilder[] {
  const commands: Discord.SlashCommandBuilder[] = []
  bot.commands.forEach((command) => {
    const options = command.getOptions()
    const slashCommand = createSlashCommand(command)

    if (options && options.length > 0) {
      options.forEach((opt) => {
        addSlashCommandOption(slashCommand, opt)
      })
    }
    commands.push(slashCommand)
  })

  return commands
}

export default async function loader(bot: DiscordBot): Promise<void> {
  const commands = createSlashCommands(bot)
  const rest = new REST({ version: "10" }).setToken(bot.token?.toString() ?? "")
  try {
    await rest.put(Routes.applicationCommands(bot.user?.id ?? ""), {
      body: commands,
    })
  } catch (error) {
    Logger.error("Slash commands failed to load\n")
  }
}
