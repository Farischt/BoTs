import Discord from "discord.js"
import {
  DiscordBot,
  DiscordMusicCommand,
  DiscordCommandOptions,
  DiscordCommandData,
  DiscordCommandInteractionResponse,
  DiscordMusicCommandInteractionResponse,
  DiscordWebHookName,
} from "../../types"

export enum PauseInteractionResponse {
  AlreadyPaused = "Player is already paused !",
  Success = "Successfully paused the music !",
}

export class PauseCommand extends DiscordMusicCommand {
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
  ): Promise<Discord.InteractionResponse<boolean>> {
    const guild = message.guild
    if (!guild)
      return await message.reply({
        content: DiscordCommandInteractionResponse.NoGuild,
        ephemeral: true,
      })

    const author = this.getGuildMember(guild, message.user.id)
    if (!author)
      return await message.reply({
        content: DiscordCommandInteractionResponse.NoAuthor,
        ephemeral: true,
      })
    else if (!this.isInMusicVoiceChannel(guild, author)) {
      return await message.reply({
        content: DiscordMusicCommandInteractionResponse.NotInMusicChannel,
        ephemeral: true,
      })
    }

    const player = bot.music.players.get(guild.id)
    if (!player) {
      return await message.reply({
        content: DiscordMusicCommandInteractionResponse.NoPlayer,
        ephemeral: true,
      })
    }

    if (!player.connected) {
      return await message.reply({
        content: DiscordMusicCommandInteractionResponse.PlayerNotConnected,
        ephemeral: true,
      })
    } else if (player.paused) {
      return await message.reply({
        content: PauseInteractionResponse.AlreadyPaused,
        ephemeral: true,
      })
    }

    await player.pause(true)
    const Dj = bot.webhooks.get(DiscordWebHookName.Dj)
    if (Dj)
      await Dj.send(
        `Music player \`paused\` by ${`<@${author.id}>`} ! Use \`/resume\` to resume the music !`
      )

    return await message.reply({
      content: PauseInteractionResponse.Success,
      ephemeral: true,
    })
  }
}

export const pauseCommandData: DiscordCommandData = {
  name: "pause",
  description: "Pauses the music player",
  dmPermission: true,
  defaultMemberPermission: null,
  options: undefined,
}

export default new PauseCommand(
  pauseCommandData.name,
  pauseCommandData.description,
  pauseCommandData.dmPermission,
  pauseCommandData.defaultMemberPermission,
  pauseCommandData.options
)
