import { DiscordBot, DiscordWebHookName } from "../../types"
import { CHANNELS } from "../../config.json"

export default async function queueFinish(bot: DiscordBot): Promise<void> {
  bot.music.on("queueFinish", async (queue) => {
    const Dj = bot.webhooks.get(DiscordWebHookName.Dj)
    const message = `Music player \`stopped\` because it is empty on channel <#${CHANNELS.MUSIC.VOICE_ID}> ! Use \`/play\` to play a music.`
    Dj ? await Dj.send(message) : await queue.channel.send(message)
  })
}
