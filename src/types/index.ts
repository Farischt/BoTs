import Discord from "discord.js"
import "@lavaclient/queue"

export {
  DiscordCommandDocument,
  DiscordModerationCommand,
  DiscordMusicCommand,
} from "./class"
export {
  DiscordBot,
  DiscordCommandData,
  DiscordCommandOptions,
  DiscordCommandOption,
  DiscordCommandOptionChoice,
  DiscordCommandOptionChoices,
} from "./interface"
export {
  DiscordCommandInteractionResponse,
  DiscordMemberRole,
  DiscordWebHookName,
  DiscordCommandOptionType,
  DiscordMusicCommandInteractionResponse,
} from "./enum"

declare module "@lavaclient/queue" {
  interface Queue {
    channel: Discord.TextBasedChannel
  }
}
