import Discord from "discord.js"
import { DiscordBot } from "../types"
import commandsLoader from "./commands"
import eventsLoader from "./events"
import webhooksLoader from "./webhooks"
import musicLoader from "./music"

export {
  default as slashCommandsLoader,
  addSlashCommandOption,
  createSlashCommand,
  createSlashCommands,
} from "./slashCommands"
export { commandsLoader, eventsLoader, webhooksLoader }

export default async function loader(bot: DiscordBot): Promise<void> {
  await commandsLoader(bot)
  await eventsLoader(bot)
  await webhooksLoader(bot)
  await musicLoader(bot)

  bot.ws.on(
    Discord.GatewayDispatchEvents.VoiceServerUpdate,
    async (data) => await bot.music.handleVoiceUpdate(data)
  )
  bot.ws.on(
    Discord.GatewayDispatchEvents.VoiceStateUpdate,
    async (data) => await bot.music.handleVoiceUpdate(data)
  )
}
