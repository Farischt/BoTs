import Discord from "discord.js"
import { Command } from "../index.d"

const pingCommand: Command = {
  name: "ping",
  async run(bot: Discord.Client, message: Discord.Message, args: string[]) {
    await message.reply(`Pong ! ${bot.ws.ping}ms`)
  },
}

export default pingCommand
