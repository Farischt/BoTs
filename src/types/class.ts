import Discord from "discord.js"
import { DiscordBot, DiscordCommandOptions } from "."
import { CHANNELS } from "../config.json"

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

  protected getGuildMember(
    guild: Discord.Guild,
    userId: string
  ): Discord.GuildMember | undefined {
    return guild.members.cache.get(userId)
  }

  protected async getOwner(guild: Discord.Guild): Promise<Discord.GuildMember> {
    return await guild.fetchOwner()
  }

  protected getMainTextChannel(
    guild: Discord.Guild
  ): Discord.GuildBasedChannel | undefined {
    return guild.channels.cache.get(CHANNELS.GENERAL.TEXT_ID)
  }

  protected getMusicTextChannel(guild: Discord.Guild): Discord.TextChannel {
    return guild.channels.cache.get(
      CHANNELS.MUSIC.TEXT_ID
    ) as Discord.TextChannel
  }

  public abstract run(
    bot: DiscordBot,
    message: Discord.CommandInteraction,
    args: Discord.CommandInteraction["options"]
  ): Promise<any>
}

export abstract class DiscordModerationCommand extends DiscordCommandDocument {
  protected isTargetOwner(
    target: Discord.GuildMember,
    owner: Discord.GuildMember
  ): boolean {
    return target.id === owner.id
  }

  protected isTargetSelf(
    target: Discord.GuildMember,
    author: Discord.GuildMember
  ): boolean {
    return target.id === author.id
  }

  protected hasTargetHigherRole(
    target: Discord.GuildMember,
    author: Discord.GuildMember
  ): boolean {
    return author.roles.highest.position < target.roles.highest.position
  }
}

export abstract class DiscordMusicCommand extends DiscordCommandDocument {
  protected getAuthorVoiceState(
    guild: Discord.Guild,
    author: Discord.GuildMember
  ): Discord.VoiceState | undefined {
    return guild.voiceStates.cache.get(author.id)
  }

  protected getMusicVoiceChannel(
    guild: Discord.Guild
  ): Discord.GuildBasedChannel | undefined {
    return guild.channels.cache.get(CHANNELS.MUSIC.VOICE_ID)
  }

  protected isInMusicVoiceChannel(
    guild: Discord.Guild,
    author: Discord.GuildMember
  ): boolean {
    return (
      this.getAuthorVoiceState(guild, author)?.channel?.id ===
      this.getMusicVoiceChannel(guild)?.id
    )
  }
}
