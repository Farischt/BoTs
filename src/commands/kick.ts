import Discord from "discord.js"
import { DiscordBot, DiscordCommandFile } from "../index.d"

enum InteractionErrorResponse {
  NoMember = "No member to kick found !",
  Unkickable = "I can't kick this member !",
  SelfKick = "You can't kick yourself !",
  OwnerKick = "You can't kick the owner !",
  AlreadyKick = "This member is already kicked !",
  NoPermission = "You don't have the permission to kick a member !",
  NoAuthor = "No author found !",
  NoOwner = "No owner found !",
  NoReason = "No reason provided !",
  Unknown = "Something went wrong !",
}

const kickCommand: DiscordCommandFile = {
  name: "kick",
  description: "Kick a member",
  dmPermission: false,
  defaultMemberPermission: Discord.PermissionFlagsBits.KickMembers,
  options: [
    {
      type: "user",
      name: "member",
      description: "The member to kick",
      required: true,
    },
    {
      type: "string",
      name: "reason",
      description: "The reason for the kick",
      required: false,
    },
  ],

  async run(
    bot: DiscordBot,
    message: Discord.ChatInputCommandInteraction,
    args: Discord.ChatInputCommandInteraction["options"]
  ) {
    const userToKick = args.get("member")?.user
    if (!userToKick)
      return await message.reply(InteractionErrorResponse.NoMember)

    const memberToKick = message.guild?.members.cache.get(userToKick.id)
    if (!memberToKick) {
      return await message.reply(InteractionErrorResponse.NoMember)
    }
    const interactionAuthor = message.guild?.members.cache.get(message.user.id)
    if (!interactionAuthor)
      return await message.reply(InteractionErrorResponse.NoAuthor)

    const owner = await message.guild?.fetchOwner()
    if (!owner) return await message.reply(InteractionErrorResponse.NoOwner)
    else if (memberToKick.id === owner?.id)
      return await message.reply(InteractionErrorResponse.OwnerKick)
    else if (
      interactionAuthor.id !== owner.id &&
      kickCommand.defaultMemberPermission &&
      !interactionAuthor.permissions.has(kickCommand.defaultMemberPermission)
    )
      return await message.reply(InteractionErrorResponse.NoPermission)
    else if (memberToKick.id === interactionAuthor?.id)
      return await message.reply(InteractionErrorResponse.SelfKick)
    else if (!memberToKick.kickable)
      return await message.reply(InteractionErrorResponse.Unkickable)

    const reason =
      args.get("reason")?.value ?? InteractionErrorResponse.NoReason

    try {
      await userToKick.send(
        `You have been kick from ${
          message.guild?.name ?? "Unknow guild"
        }, for reason ${reason.toString()}, by ${interactionAuthor.user.tag}`
      )
      await memberToKick.kick(reason.toString())
      await message.reply(
        `${
          interactionAuthor.nickname ?? "Unknown user"
        } has successfully kicked ${
          userToKick.tag
        } for reason: ${reason.toString()}.`
      )
    } catch (err) {
      console.log(err)
      return await message.reply(InteractionErrorResponse.Unknown)
    }
  },
}

export default kickCommand
