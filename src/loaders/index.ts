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

export default function loader(bot: DiscordBot): void {
  commandsLoader(bot)
  eventsLoader(bot)
  webhooksLoader(bot)
}
