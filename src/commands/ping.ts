import Discord from "discord.js"
import { DiscordBot, DiscordCommandFile } from "../index.d"

const pingCommand: DiscordCommandFile = {
  name: "ping",
  description: "Pong!",
  dmPermission: true,
  defaultMemberPermission: null,
  async run(
    bot: DiscordBot,
    message: Discord.Message | Discord.ChatInputCommandInteraction
  ): Promise<void> {
    await message.reply(`Pong ! ${bot.ws.ping}ms`)
  },
}

export default pingCommand
