import Discord from "discord.js"
import chalk from "chalk"
import {
  DiscordBot,
  DiscordCommandDocument,
  DiscordCommandOptions,
  BanInteractionErrorResponse,
} from "../types"

class BanCommand extends DiscordCommandDocument {
  public constructor(
    name: string,
    description: string,
    dmPermission: boolean,
    defaultMemberPermission: Discord.PermissionResolvable | null,
    options?: DiscordCommandOptions
  ) {
    super(name, description, dmPermission, defaultMemberPermission, options)
  }

  private getDiscordUserToBanFromArgs(
    args: Discord.ChatInputCommandInteraction["options"]
  ): Discord.User | null {
    return args.getUser("member")
  }

  private getDiscordGuildMemberToBan(
    guild: Discord.Guild,
    userId: string
  ): Discord.GuildMember | undefined {
    return guild.members.cache.get(userId)
  }

  private getInteractionGuildMemberAuthor(
    guild: Discord.Guild,
    message: Discord.ChatInputCommandInteraction
  ): Discord.GuildMember | undefined {
    return guild.members.cache.get(message.user.id)
  }

  private async getGuildOwner(
    guild: Discord.Guild
  ): Promise<Discord.GuildMember> {
    return await guild.fetchOwner()
  }

  private isMemberToBanOwner(
    owner: Discord.GuildMember,
    memberToBan: Discord.GuildMember
  ): boolean {
    return owner.id === memberToBan.id
  }

  private isRoleHigher(
    author: Discord.GuildMember,
    memberToBan: Discord.GuildMember
  ): boolean {
    return author.roles.highest.position < memberToBan.roles.highest.position
  }

  private isSelfBan(
    author: Discord.GuildMember,
    memberToBan: Discord.GuildMember
  ): boolean {
    return author.id === memberToBan.id
  }

  private hasAuthorValidPermission(
    author: Discord.GuildMember,
    owner: Discord.GuildMember
  ): boolean | 0n | null {
    return (
      author.id !== owner.id &&
      this.defaultMemberPermission &&
      !author.permissions.has(this.defaultMemberPermission)
    )
  }

  private async runChecks(
    guild: Discord.Guild,
    interactionAuthor: Discord.GuildMember,
    memberToBan: Discord.GuildMember
  ): Promise<BanInteractionErrorResponse | null> {
    let error: BanInteractionErrorResponse | null = null
    const owner = await this.getGuildOwner(guild)
    if (!owner) error = BanInteractionErrorResponse.NoOwner
    else if (this.isMemberToBanOwner(owner, memberToBan))
      error = BanInteractionErrorResponse.OwernBan
    else if (!memberToBan.bannable)
      error = BanInteractionErrorResponse.Unbanable
    else if (this.isSelfBan(interactionAuthor, memberToBan))
      error = BanInteractionErrorResponse.SelfBan
    else if (this.hasAuthorValidPermission(interactionAuthor, owner))
      error = BanInteractionErrorResponse.NoPermission
    else if (this.isRoleHigher(interactionAuthor, memberToBan))
      error = BanInteractionErrorResponse.HigherBan

    return error
  }

  private async getBanList(
    guild: Discord.Guild
  ): Promise<Discord.Collection<string, Discord.GuildBan>> {
    return await guild.bans.fetch()
  }

  public async run(
    bot: DiscordBot,
    message: Discord.ChatInputCommandInteraction,
    args: Discord.ChatInputCommandInteraction["options"]
  ): Promise<Discord.InteractionResponse<boolean> | undefined> {
    const { guild } = message
    if (!guild) {
      console.warn(chalk.bold.yellow(BanInteractionErrorResponse.NoGuild))
      return await message.reply(BanInteractionErrorResponse.NoGuild)
    }

    const userToBan = this.getDiscordUserToBanFromArgs(args)
    if (!userToBan) {
      console.warn(chalk.bold.yellow(BanInteractionErrorResponse.NoMember))
      return await message.reply(BanInteractionErrorResponse.NoMember)
    }

    const memberToBan = this.getDiscordGuildMemberToBan(guild, userToBan.id)
    if (!memberToBan) {
      console.warn(chalk.bold.yellow(BanInteractionErrorResponse.NoMember))
      return await message.reply(BanInteractionErrorResponse.NoMember)
    }
    const interactionAuthor = this.getInteractionGuildMemberAuthor(
      guild,
      message
    )
    if (!interactionAuthor) {
      console.warn(chalk.bold.yellow(BanInteractionErrorResponse.NoAuthor))
      return await message.reply(BanInteractionErrorResponse.NoAuthor)
    }

    const error = await this.runChecks(guild, interactionAuthor, memberToBan)
    if (error) {
      console.warn(chalk.bold.yellow(error))
      return await message.reply(error)
    }

    const guildBans = await this.getBanList(guild)
    if (!guildBans) {
      console.warn(chalk.bold.yellow(BanInteractionErrorResponse.NoBanList))
      return await message.reply(BanInteractionErrorResponse.NoBanList)
    } else if (guildBans.get(memberToBan.id)) {
      console.warn(chalk.bold.yellow(BanInteractionErrorResponse.AlreadyBan))
      return await message.reply(BanInteractionErrorResponse.AlreadyBan)
    }

    const reason =
      args.get("reason")?.value ?? BanInteractionErrorResponse.NoReason

    try {
      await userToBan.send(
        `You have been banned from ${
          message.guild?.name ?? "None"
        }, for reason ${reason.toString()}, by ${interactionAuthor.user.tag}`
      )
      await message.guild?.bans.create(userToBan.id, {
        reason: reason.toString(),
      })
      await message.reply(
        `${interactionAuthor.user.tag} has successfully banned ${
          userToBan.tag
        } for reason: ${reason.toString()}.`
      )
    } catch (err) {
      console.error(chalk.bold.red(err))
      return await message.reply(BanInteractionErrorResponse.Unknown)
    }
  }
}

const banCommandData = {
  name: "ban",
  description: "Ban a member",
  dmPermission: false,
  defaultMemberPermission: Discord.PermissionFlagsBits.BanMembers,
  options: [
    {
      type: "user",
      name: "member",
      description: "The member to ban",
      required: true,
    },
    {
      type: "string",
      name: "reason",
      description: "The reason for the ban",
      required: false,
    },
  ],
}

export default new BanCommand(
  banCommandData.name,
  banCommandData.description,
  banCommandData.dmPermission,
  banCommandData.defaultMemberPermission,
  banCommandData.options
)
