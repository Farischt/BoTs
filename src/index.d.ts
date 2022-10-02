import Discord from "discord.js"

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
    message: Discord.ChatInputCommandInteraction,
    args: Discord.ChatInputCommandInteraction["options"]
  ) => any
}

// TODO : update all commands file to extends this class
export abstract class DiscordCommandDocument {
  public static name: string
  public static description: string
  public static dmPermission: boolean
  public static defaultMemberPermission: Discord.PermissionResolvable | null
  public static options?: DiscordCommandFileOptions[]

  public static run(
    bot: DiscordBot,
    message: Discord.ChatInputCommandInteraction,
    args: Discord.ChatInputCommandInteraction["options"]
  ): any
}

export interface DiscordBot extends Discord.Client {
  commands: Discord.Collection<string, DiscordCommandFile>
}
