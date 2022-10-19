import { DiscordBot } from "../../types"
import { Logger } from "../../utils"

export default async function connect(bot: DiscordBot): Promise<void> {
  bot.music.on("connect", () => {
    Logger.info(`Bot music player connected to lavalink server`)
  })
}
