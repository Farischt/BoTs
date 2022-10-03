import Discord from "discord.js"

export interface DiscordCommandOption {
  type: string
  name: string
  description: string
  required: boolean
}

export type DiscordCommandOptions = DiscordCommandOption[]

export interface DiscordCommandData {
  name: string
  description: string
  dmPermission: boolean
  defaultMemberPermission: Discord.PermissionResolvable | null
  options?: DiscordCommandOptions
}

export abstract class DiscordCommandDocument {
  public name: string
  public description: string
  public dmPermission: boolean
  public defaultMemberPermission: Discord.PermissionResolvable | null
  public options?: DiscordCommandOptions

  constructor(
    name: string,
    description: string,
    dmPermission: boolean,
    defaultMemberPermission: Discord.PermissionResolvable | null,
    options?: DiscordCommandOptions
  ) {
    this.name = name
    this.description = description
    this.dmPermission = dmPermission
    this.defaultMemberPermission = defaultMemberPermission
    this.options = options
  }

  public abstract run(
    bot: DiscordBot,
    message: Discord.ChatInputCommandInteraction,
    args: Discord.ChatInputCommandInteraction["options"]
  ): Promise<any>
}

export interface DiscordBot extends Discord.Client {
  commands: Discord.Collection<string, DiscordCommandDocument>
}

export enum BanInteractionErrorResponse {
  NoGuild = "No guild found",
  NoMember = "No member to ban found !",
  Unbanable = "I can't ban this member !",
  SelfBan = "You can't ban yourself !",
  OwernBan = "You can't ban the owner !",
  AlreadyBan = "This member is already banned !",
  HigherBan = "You can't ban a member with higher role than you !",
  NoBanList = "No ban list found !",
  NoPermission = "You don't have the permission to ban a member !",
  NoAuthor = "No author found !",
  NoOwner = "No owner found !",
  NoReason = "No reason provided !",
  Unknown = "Something went wrong !",
}
