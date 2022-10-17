import Discord from "discord.js"
import {
  DiscordBot,
  DiscordCommandDocument,
  DiscordCommandOptions,
  DiscordCommandData,
} from "../../types"

export class PingCommand extends DiscordCommandDocument {
  public constructor(
    name: string,
    description: string,
    dmPermission: boolean,
    defaultMemberPermission: Discord.PermissionResolvable | null,
    options?: DiscordCommandOptions
  ) {
    super(name, description, dmPermission, defaultMemberPermission, options)
  }

  public async run(
    bot: DiscordBot,
    message: Discord.ChatInputCommandInteraction
  ): Promise<void> {
    await message.reply(`Pong ! ${bot.ws.ping}ms`)
  }
}

export const pingCommandData: DiscordCommandData = {
  name: "ping",
  description: "Pong!",
  dmPermission: true,
  defaultMemberPermission: null,
  options: undefined,
}

export default new PingCommand(
  pingCommandData.name,
  pingCommandData.description,
  pingCommandData.dmPermission,
  pingCommandData.defaultMemberPermission,
  pingCommandData.options
)
