import Discord from "discord.js"
import { Player } from "discord-player"
import "discord-player/smoothVolume"

import { DISCORD_TOKEN } from "./config.json"
import { DiscordBot, DiscordCommandDocument } from "./types"
import loader from "./loaders"

const main = async (): Promise<void> => {
  const intents = new Discord.IntentsBitField(3276799)
  const bot = new Discord.Client({ intents }) as DiscordBot

  bot.commands = new Discord.Collection<string, DiscordCommandDocument>()
  bot.webhooks = new Discord.Collection<string, Discord.WebhookClient>()
  bot.player = new Player(bot, {
    ytdlOptions: {
      quality: "highestaudio",
      highWaterMark: 1 << 25,
    },
  })
  bot.login(DISCORD_TOKEN)
  await loader(bot)
}

main()
