import { DiscordBot, DiscordWebHookName } from "../../types"
import { CHANNELS } from "../../config.json"

export default async function trackStart(bot: DiscordBot): Promise<void> {
  bot.music.on("trackStart", async (queue, song) => {
    const Dj = bot.webhooks.get(DiscordWebHookName.Dj)
    const message = `Now playing [**${song.title}**](${
      song.uri
    }) on channel <#${CHANNELS.MUSIC.VOICE_ID}> ${
      song.requester ? `<@${song.requester}> ` : ""
    }`
    Dj ? await Dj.send(message) : await queue.channel.send(message)
  })
}
