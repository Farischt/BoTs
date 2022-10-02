import Discord from "discord.js"
import { DiscordBot, DiscordCommandFile } from "../index.d"

enum InteractionErrorResponse {
  NoMember = "No member to ban found !",
  Unbanable = "I can't ban this member !",
  SelfBan = "You can't ban yourself !",
  OwernBan = "You can't ban the owner !",
  AlreadyBan = "This member is already banned !",
  NoBanList = "No ban list found !",
  NoPermission = "You don't have the permission to ban a member !",
  NoAuthor = "No author found !",
  NoOwner = "No owner found !",
  NoReason = "No reason provided !",
  Unknown = "Something went wrong !",
}

const banCommand: DiscordCommandFile = {
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

  async run(
    bot: DiscordBot,
    message: Discord.ChatInputCommandInteraction,
    args: Discord.ChatInputCommandInteraction["options"]
  ) {
    const userToBan = args.get("member")?.user
    if (!userToBan)
      return await message.reply(InteractionErrorResponse.NoMember)

    const memberToBan = message.guild?.members.cache.get(userToBan.id)
    if (!memberToBan) {
      return await message.reply(InteractionErrorResponse.NoMember)
    }
    const interactionAuthor = message.guild?.members.cache.get(message.user.id)
    if (!interactionAuthor)
      return await message.reply(InteractionErrorResponse.NoAuthor)

    const owner = await message.guild?.fetchOwner()
    if (!owner) return await message.reply(InteractionErrorResponse.NoOwner)
    else if (memberToBan.id === owner?.id)
      return await message.reply(InteractionErrorResponse.OwernBan)
    else if (
      interactionAuthor.id !== owner.id &&
      banCommand.defaultMemberPermission &&
      !interactionAuthor.permissions.has(banCommand.defaultMemberPermission)
    )
      return await message.reply(InteractionErrorResponse.NoPermission)
    else if (memberToBan.id === interactionAuthor?.id)
      return await message.reply(InteractionErrorResponse.SelfBan)
    else if (!memberToBan.bannable)
      return await message.reply(InteractionErrorResponse.Unbanable)

    const guildBans = await message.guild?.bans.fetch()
    if (!guildBans)
      return await message.reply(InteractionErrorResponse.NoBanList)
    else if (guildBans.get(memberToBan.id)) {
      return await message.reply(InteractionErrorResponse.AlreadyBan)
    }

    const reason =
      args.get("reason")?.value ?? InteractionErrorResponse.NoReason

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
        `${
          interactionAuthor.nickname?.toString() ?? "Unknow user"
        } has successfully banned ${
          userToBan.tag
        } for reason: ${reason.toString()}.`
      )
    } catch (err) {
      console.log(err)
      return await message.reply(InteractionErrorResponse.Unknown)
    }
  },
}

export default banCommand
