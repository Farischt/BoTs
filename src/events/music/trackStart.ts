import { DiscordBot } from "../../types"
import { VOICE_CHANNELS } from "../../config.json"

export default async function trackStart(bot: DiscordBot): Promise<void> {
  bot.music.on("trackStart", async (queue, song) => {
    await queue.channel.send(
      `Now playing [**${song.title}**](${song.uri}) on channel <#${
        VOICE_CHANNELS.MUSIC_ID
      }> ${song.requester ? `<@${song.requester}> ` : ""}`
    )
  })
}
