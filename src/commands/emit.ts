import chalk from "chalk"
import Discord from "discord.js"
import {
  DiscordBot,
  DiscordCommandDocument,
  DiscordCommandOptions,
  DiscordCommandData,
  DiscordCommandOptionType,
} from "../types"

class EmitCommand extends DiscordCommandDocument {
  public readonly eventChoices = ["guildMemberAdd", "guildMemberRemove"]
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
    const event = message.options.getString("event")
    if (!event) return

    if (!this.eventChoices.includes(event)) {
      console.error(chalk.bold.red(`Invalid event : ${event}.`))
      await message.reply(`Invalid event : ${event}.`)
      return
    }
    if (!message.member) return
    bot.emit(event, message.member)
    await message.reply(
      `Event ${event} emitted by <@${message.member.user.id}>`
    )
  }
}

export const emitCommandData: DiscordCommandData = {
  name: "emit",
  description: "Emit a choosen event",
  dmPermission: false,
  defaultMemberPermission: Discord.PermissionFlagsBits.Administrator,
  options: [
    {
      type: DiscordCommandOptionType.String,
      name: "event",
      description: "Event to emit",
      required: true,
      choices: [
        { name: "guild member add", value: "guildMemberAdd" },
        { name: "guild member remove", value: "guildMemberRemove" },
      ],
    },
  ],
}

export default new EmitCommand(
  emitCommandData.name,
  emitCommandData.description,
  emitCommandData.dmPermission,
  emitCommandData.defaultMemberPermission,
  emitCommandData.options
)
