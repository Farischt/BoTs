import { DiscordBot } from "../types"
import commandsLoader from "./commands"
import eventsLoader from "./events"
import webhooksLoader from "./webhooks"

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
}
