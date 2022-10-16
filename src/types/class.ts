import Discord from "discord.js"
import { DiscordBot, DiscordCommandOptions } from "."

export abstract class DiscordCommandDocument {
  private readonly name: string
  private readonly description: string
  private readonly dmPermission: boolean
  private readonly defaultMemberPermission: Discord.PermissionResolvable | null
  // TODO: Update options to be null instead of undefined
  private readonly options?: DiscordCommandOptions

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

  public getName(): string {
    return this.name
  }

  public getDescription(): string {
    return this.description
  }

  public getDmPermission(): boolean {
    return this.dmPermission
  }

  public getDefaultMemberPermission(): Discord.PermissionResolvable | null {
    return this.defaultMemberPermission
  }

  public getOptions(): DiscordCommandOptions | undefined {
    return this.options
  }

  protected getInteractionGuildMemberAuthor(
    guild: Discord.Guild,
    message: Discord.ChatInputCommandInteraction
  ): Discord.GuildMember | undefined {
    return guild.members.cache.get(message.user.id)
  }

  protected async getOwner(guild: Discord.Guild): Promise<Discord.GuildMember> {
    return await guild.fetchOwner()
  }

  public abstract run(
    bot: DiscordBot,
    message: Discord.ChatInputCommandInteraction,
    args: Discord.ChatInputCommandInteraction["options"]
  ): Promise<any>
}

export abstract class DiscordModerationCommand extends DiscordCommandDocument {
  protected getTarget(
    guild: Discord.Guild,
    userId: string
  ): Discord.GuildMember | undefined {
    return guild.members.cache.get(userId)
  }

  protected isTargetOwner(
    target: Discord.GuildMember,
    owner: Discord.GuildMember
  ): boolean {
    return target.id === owner.id
  }

  protected hasTargetHigherRole(
    target: Discord.GuildMember,
    author: Discord.GuildMember
  ): boolean {
    return author.roles.highest.position < target.roles.highest.position
  }

  protected isTargetSelf(
    target: Discord.GuildMember,
    author: Discord.GuildMember
  ): boolean {
    return target.id === author.id
  }
}

export abstract class DiscordMusicCommand extends DiscordCommandDocument {}
