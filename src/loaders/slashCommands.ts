import Discord, { REST, Routes } from "discord.js"

import { DiscordBot } from "../index.d"

export default async function loader(bot: DiscordBot): Promise<void> {
  const commands: Discord.SlashCommandBuilder[] = []
  bot.commands.forEach((command) => {
    const { options } = command
    const slashCommand = new Discord.SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description)
      .setDMPermission(command.dm_permission)
      .setDefaultMemberPermissions(command.default_member_permissions)

    if (options && options.length > 0) {
      options.forEach((opt) => {
        slashCommand.addStringOption((option = opt) => {
          return option
            .setName(option.name)
            .setDescription(option.description)
            .setRequired(option.required)
        })
      })
    }
    commands.push(slashCommand)
  })

  const rest = new REST({ version: "10" }).setToken(bot.token?.toString() ?? "")
  try {
    console.log("Loading slash commands...")
    await rest.put(Routes.applicationCommands(bot.user?.id ?? ""), {
      body: commands,
    })
    console.log("Slash commands succesfully loaded")
  } catch (error) {
    console.error("Slash commands failed to load", error)
  }
}
