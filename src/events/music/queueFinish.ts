import { DiscordBot } from "../../types"

export default async function queueFinish(bot: DiscordBot): Promise<void> {
  bot.music.on("queueFinish", async (queue) => {
    await queue.channel.send(
      "`Music player stopped`, queue is empty! Run `play` command to start playing music again."
    )
    queue.player.disconnect()
    queue.player.node.destroyPlayer(queue.player.guildId)
  })
}
