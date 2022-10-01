import Discord from "discord.js"
import { DiscordBot } from "../index.d"

const pongCommand = {
  name: "pong",
  description: "Ping!",
  dm_permission: true,
  default_member_permission: null,
  async run(
    bot: DiscordBot,
    message: Discord.Message | Discord.ChatInputCommandInteraction
  ): Promise<void> {
    await message.reply(`Ping ! ${bot.ws.ping}ms`)
  },
}

export default pongCommand
