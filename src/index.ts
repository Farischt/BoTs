import Discord from "discord.js"

import CONFIG from "./config.json"
import { DiscordBot, DiscordCommandDocument } from "./types"
import loader from "./loaders"

const intents = new Discord.IntentsBitField(3276799)
const bot = new Discord.Client({ intents }) as DiscordBot

bot.commands = new Discord.Collection<string, DiscordCommandDocument>()
bot.webhooks = new Discord.Collection<string, Discord.WebhookClient>()
bot.login(CONFIG.DISCORD_TOKEN)
loader(bot)
