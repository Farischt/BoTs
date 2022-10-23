import Discord from "discord.js"
import {
  DiscordBot,
  DiscordMusicCommand,
  DiscordCommandOptions,
  DiscordCommandData,
  DiscordCommandInteractionResponse,
  DiscordMusicCommandInteractionResponse,
} from "../../types"

export class PlayListCommand extends DiscordMusicCommand {
  public constructor(
    name: string,
    description: string,
    dmPermission: boolean,
    defaultMemberPermission: Discord.PermissionResolvable | null,
    options?: DiscordCommandOptions
  ) {
    super(name, description, dmPermission, defaultMemberPermission, options)
  }

  private formatIndex(index: number, size: number): string {
    return (index + 1).toString().padStart(size.toString().length, "0")
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

    if (!player.queue.tracks.length) {
      return await message.reply("There are no tracks in the queue.")
    }

    const size = player.queue.tracks.length
    const str = player.queue.tracks
      .map(
        (t, idx) =>
          `\`#${this.formatIndex(idx, size)}\` [**${t.title}**](${
            t.uri
          }) requested by ${t.requester ? `<@${t.requester}>` : ""}`
      )
      .join("\n")

    return await message.reply({
      content: str,
      ephemeral: true,
    })
  }
}

export const playListCommandData: DiscordCommandData = {
  name: "playlist",
  description: "Get the current playlist in the music player",
  dmPermission: true,
  defaultMemberPermission: null,
  options: undefined,
}

export default new PlayListCommand(
  playListCommandData.name,
  playListCommandData.description,
  playListCommandData.dmPermission,
  playListCommandData.defaultMemberPermission,
  playListCommandData.options
)
