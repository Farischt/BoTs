import { DiscordBot } from "../../types"

export default async function queueFinish(bot: DiscordBot): Promise<void> {
  bot.music.on("queueFinish", async (queue) => {
    await queue.channel.send("Uh oh, the queue has ended :/")
    queue.player.disconnect()
    queue.player.node.destroyPlayer(queue.player.guildId)
  })
}
