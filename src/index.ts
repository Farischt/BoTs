import Discord from "discord.js"

import CONFIG from "./config.json"
import { DiscordBot, DiscordCommandFile } from "./index.d"
import { commandsLoader, eventsLoader } from "./loaders"

const intents = new Discord.IntentsBitField(3276799)
const bot = new Discord.Client({ intents }) as DiscordBot

bot.commands = new Discord.Collection<string, DiscordCommandFile>()
bot.login(CONFIG.DISCORD_TOKEN)
commandsLoader(bot)
eventsLoader(bot)
