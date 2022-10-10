import Discord from "discord.js"
import chalk from "chalk"
import {
  DiscordBot,
  DiscordCommandOptions,
  DiscordModerationCommand,
} from "../types"

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

class BanCommand extends DiscordModerationCommand {
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

  private async runChecks(
    guild: Discord.Guild,
    interactionAuthor: Discord.GuildMember,
    memberToBan: Discord.GuildMember
  ): Promise<BanInteractionErrorResponse | null> {
    const owner = await this.getOwner(guild)
    if (!owner) return BanInteractionErrorResponse.NoOwner
    else if (this.isTargetOwner(memberToBan, owner))
      return BanInteractionErrorResponse.OwernBan
    else if (!memberToBan.bannable) return BanInteractionErrorResponse.Unbanable
    else if (this.isTargetSelf(memberToBan, interactionAuthor))
      return BanInteractionErrorResponse.SelfBan
    else if (
      this.hasAuthorValidPermission(
        interactionAuthor,
        owner,
        this.getDefaultMemberPermission()
      )
    )
      return BanInteractionErrorResponse.NoPermission
    else if (this.hasTargetHigherRole(memberToBan, interactionAuthor))
      return BanInteractionErrorResponse.HigherBan

    return null
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

    const memberToBan = this.getTarget(guild, userToBan.id)
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
