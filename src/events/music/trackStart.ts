import { DiscordBot } from "../../types"

export default async function trackStart(bot: DiscordBot): Promise<void> {
  bot.music.on("trackStart", async (queue, song) => {
    await queue.channel.send(
      `Now playing [**${song.title}**](${song.uri}) ${
        song.requester ? `<@${song.requester}>` : ""
      }`
    )
  })
}
