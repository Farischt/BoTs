import Discord from "discord.js"

// Changes todo here
// Make all "Commands" as Slach commands even those with no slash

// export interface DiscordCommand
//   extends Omit<Discord.SlashCommandBuilder, "options"> {
//   options?: Discord.SlashCommandOptionsOnlyBuilder[]
//   run: (
//     bot: DiscordBot,
//     message?: Discord.Message | Discord.ChatInputCommandInteraction,
//     args?: Discord.SlashCommandOptionsOnlyBuilder
//   ) => Promise<void>
// }

export interface DiscordCommandFileOptions {
  type: string
  name: string
  description: string
  required: boolean
}
export interface DiscordCommandFile {
  name: string
  description: string
  dmPermission: boolean
  defaultMemberPermission: Discord.PermissionResolvable | null
  options?: DiscordCommandFileOptions[]
  run: (
    bot: DiscordBot,
    message: Discord.Message | Discord.ChatInputCommandInteraction,
    args: any
  ) => Promise<void>
}

export interface DiscordBot extends Discord.Client {
  commands: Discord.Collection<string, DiscordCommandFile>
}
