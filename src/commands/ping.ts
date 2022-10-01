import Discord from "discord.js"
import { DiscordBot } from "../index.d"

const pingCommand = {
  name: "ping",
  description: "Pong!",
  dm_permission: true,
  default_member_permission: null,
  async run(
    bot: DiscordBot,
    message: Discord.Message | Discord.ChatInputCommandInteraction
  ): Promise<void> {
    await message.reply(`Pong ! ${bot.ws.ping}ms`)
  },
}

export default pingCommand

// Discord.js docs
// const { SlashCommandBuilder } = require("discord.js")

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("user-info")
//     .setDescription("Display info about yourself."),
//   async execute(interaction) {
//     return interaction.reply(
//       `Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`
//     )
//   },
// }
