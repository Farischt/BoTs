import "@lavaclient/queue/register"
import Discord from "discord.js"
import { Node } from "lavaclient"

import { DISCORD_TOKEN, LAVALINK_CONNECTION } from "./config.json"
import { DiscordBot, DiscordCommandDocument } from "./types"
import loader from "./loaders"
;(async (): Promise<void> => {
  const intents = new Discord.IntentsBitField(3276799)
  const bot = new Discord.Client({ intents }) as DiscordBot

  bot.commands = new Discord.Collection<string, DiscordCommandDocument>()
  bot.webhooks = new Discord.Collection<string, Discord.WebhookClient>()
  bot.music = new Node({
    sendGatewayPayload: (id, payload) =>
      bot.guilds?.cache.get(id)?.shard.send(payload),
    connection: LAVALINK_CONNECTION,
  })

  await loader(bot)
  bot.login(DISCORD_TOKEN)
})()
