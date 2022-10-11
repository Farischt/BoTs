import Discord from "discord.js"
import chalk from "chalk"

import {
  DiscordBot,
  DiscordCommandDocument,
  DiscordCommandOptions,
  DiscordCommandData,
  DiscordCommandInteractionResponse,
} from "../types"

export enum OwnerInteractionResponse {
  Self = "Come on you are the owner, stop spamming me dude !",
}

class OwnerCommand extends DiscordCommandDocument {
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
  ): Promise<Discord.InteractionResponse<boolean> | undefined> {
    const { guild } = message
    if (!guild) {
      console.warn(chalk.bold.yellow(DiscordCommandInteractionResponse.NoGuild))
      return await message.reply(DiscordCommandInteractionResponse.NoGuild)
    }

    const owner = await this.getOwner(guild)
    if (!owner) {
      console.warn(chalk.bold.yellow(DiscordCommandInteractionResponse.NoOwner))
      return await message.reply(DiscordCommandInteractionResponse.NoOwner)
    }

    const interactionAuthor = this.getInteractionGuildMemberAuthor(
      guild,
      message
    )
    if (!interactionAuthor) {
      console.warn(
        chalk.bold.yellow(DiscordCommandInteractionResponse.NoAuthor)
      )
      return await message.reply(DiscordCommandInteractionResponse.NoAuthor)
    }

    if (owner.id === interactionAuthor.id)
      return await message.reply(OwnerInteractionResponse.Self)
    return await message.reply(
      `@${owner.user.tag} is the owner of this server ! He is a very nice guy and a f#cking GOAT !`
    )
  }
}

const ownerCommandData: DiscordCommandData = {
  name: "owner",
  description: "Retrieves the owner of the guild.",
  dmPermission: true,
  defaultMemberPermission: null,
  options: undefined,
}

export default new OwnerCommand(
  ownerCommandData.name,
  ownerCommandData.description,
  ownerCommandData.dmPermission,
  ownerCommandData.defaultMemberPermission,
  ownerCommandData.options
)
