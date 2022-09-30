import Discord from "discord.js"

import { DiscordCompleteClient } from "./index.d"
import CONFIG from "./config.json"
import loader from "./loaders"
import readAndReturnCommand from "./commands"

const intents = new Discord.IntentsBitField(3276799)
const bot = new Discord.Client({ intents }) as DiscordCompleteClient

bot.commands = new Discord.Collection()
bot.login(CONFIG.DISCORD_TOKEN)
loader(bot)

bot.on("ready", async () => {
  console.log(`${bot.user?.tag} is online !`)
})

bot.on("messageCreate", async (message) => {
  readAndReturnCommand(bot, message)
})
