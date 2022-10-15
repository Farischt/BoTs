import Discord from "discord.js"
import chalk from "chalk"
import {
  DiscordBot,
  DiscordCommandOptions,
  DiscordModerationCommand,
  DiscordCommandInteractionResponse,
  DiscordCommandData,
} from "../types"

export enum BanInteractionResponse {
  NoMember = "No member to ban found !",
  Unbanable = "I can't ban this member !",
  SelfBan = "You can't ban yourself !",
  OwernBan = "You can't ban the owner !",
  AlreadyBan = "This member is already banned !",
  HigherBan = "You can't ban a member with higher role than you !",
  NoBanList = "No ban list found !",
  NoPermission = "You don't have the permission to ban a member !",
  NoReason = "No reason provided !",
}

export class BanCommand extends DiscordModerationCommand {
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

  private async getBanList(
    guild: Discord.Guild
  ): Promise<Discord.Collection<string, Discord.GuildBan>> {
    return await guild.bans.fetch()
  }

  private async runChecks(
    guild: Discord.Guild,
    interactionAuthor: Discord.GuildMember,
    memberToBan: Discord.GuildMember
  ): Promise<
    BanInteractionResponse | DiscordCommandInteractionResponse | null
  > {
    const owner = await this.getOwner(guild)
    if (!owner) return DiscordCommandInteractionResponse.NoOwner
    else if (this.isTargetOwner(memberToBan, owner))
      return BanInteractionResponse.OwernBan
    else if (!memberToBan.bannable) return BanInteractionResponse.Unbanable
    else if (this.isTargetSelf(memberToBan, interactionAuthor))
      return BanInteractionResponse.SelfBan
    else if (
      this.hasAuthorValidPermission(
        interactionAuthor,
        owner,
        this.getDefaultMemberPermission()
      )
    )
      return BanInteractionResponse.NoPermission
    else if (this.hasTargetHigherRole(memberToBan, interactionAuthor))
      return BanInteractionResponse.HigherBan

    return null
  }

  public async run(
    bot: DiscordBot,
    message: Discord.ChatInputCommandInteraction,
    args: Discord.ChatInputCommandInteraction["options"]
  ): Promise<Discord.InteractionResponse<boolean> | undefined> {
    const { guild } = message
    if (!guild) {
      console.warn(chalk.bold.yellow(DiscordCommandInteractionResponse.NoGuild))
      return await message.reply(DiscordCommandInteractionResponse.NoGuild)
    }

    const userToBan = this.getDiscordUserToBanFromArgs(args)
    if (!userToBan) {
      console.warn(chalk.bold.yellow(BanInteractionResponse.NoMember))
      return await message.reply(BanInteractionResponse.NoMember)
    }

    const memberToBan = this.getTarget(guild, userToBan.id)
    if (!memberToBan) {
      console.warn(chalk.bold.yellow(BanInteractionResponse.NoMember))
      return await message.reply(BanInteractionResponse.NoMember)
    }
    const interactionAuthor = this.getInteractionGuildMemberAuthor(
      guild,
      message
    )
    if (!interactionAuthor) {
      console.warn(
        chalk.bold.yellow(DiscordCommandInteractionResponse.NoAuthor)
      )
      return await message.reply(DiscordCommandInteractionResponse.NoAuthor)
    }

    const error = await this.runChecks(guild, interactionAuthor, memberToBan)
    if (error) {
      console.warn(chalk.bold.yellow(error))
      return await message.reply(error)
    }

    const guildBans = await this.getBanList(guild)
    if (!guildBans) {
      console.warn(chalk.bold.yellow(BanInteractionResponse.NoBanList))
      return await message.reply(BanInteractionResponse.NoBanList)
    } else if (guildBans.get(memberToBan.id)) {
      console.warn(chalk.bold.yellow(BanInteractionResponse.AlreadyBan))
      return await message.reply(BanInteractionResponse.AlreadyBan)
    }

    const reason = args.get("reason")?.value ?? BanInteractionResponse.NoReason

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
      return await message.reply(DiscordCommandInteractionResponse.Unknown)
    }
  }
}

export const banCommandData: DiscordCommandData = {
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
