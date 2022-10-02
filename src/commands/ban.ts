import Discord from "discord.js"
import { DiscordBot, DiscordCommandFile } from "../index.d"

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
    message: Discord.Message | Discord.ChatInputCommandInteraction,
    args: any
  ): Promise<void> {
    await message.reply(`Ban ! ${bot.ws.ping}ms`)
  },
}

export default banCommand
