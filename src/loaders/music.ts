import { DiscordBot } from "../types"
import { connect, queueFinish, trackStart } from "../events"

export default async function musicLoader(bot: DiscordBot): Promise<void> {
  await connect(bot)
  await queueFinish(bot)
  await trackStart(bot)
}
