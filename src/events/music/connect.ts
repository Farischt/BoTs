import { DiscordBot } from "../../types"
import { Logger } from "../../utils"

export default async function connect(bot: DiscordBot): Promise<void> {
  bot.music.on("connect", () => {
    Logger.info(`Now connected to Lavalink Server`)
  })
}
