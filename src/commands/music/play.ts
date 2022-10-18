import Discord from "discord.js"
import { Addable } from "@lavaclient/queue"
import {
  DiscordBot,
  DiscordMusicCommand,
  DiscordCommandOptions,
  DiscordCommandData,
  DiscordCommandOptionType,
  DiscordCommandInteractionResponse,
} from "../../types"

interface GetMusicResponse {
  tracks: Addable[]
  success: string
  error: string
}

class PlayCommand extends DiscordMusicCommand {
  public constructor(
    name: string,
    description: string,
    dmPermission: boolean,
    defaultMemberPermission: Discord.PermissionResolvable | null,
    options?: DiscordCommandOptions
  ) {
    super(name, description, dmPermission, defaultMemberPermission, options)
  }

  private async getMusic(
    bot: DiscordBot,
    query: string
  ): Promise<GetMusicResponse> {
    const results = await bot.music.rest.loadTracks(`ytsearch:${query}`)

    let tracks: Addable[] = []
    let success: string = ""
    let error: string = ""

    switch (results.loadType) {
      case "LOAD_FAILED":
        error = "Failed to load track"
        break
      case "NO_MATCHES":
        error = "No matches"
        break
      case "PLAYLIST_LOADED":
        tracks = results.tracks
        success = `Queued playlist [**${results.playlistInfo.name}**](${query}), it has a total of **${tracks.length}** tracks.`
        break
      case "TRACK_LOADED":
        tracks = [results.tracks[0]]
        success = `Queued track [**${results.tracks[0].info.title}**](${results.tracks[0].info.uri})`
        break
      case "SEARCH_RESULT":
        tracks = results.tracks
        success = `Queued [**${results.tracks[0].info.title}**](${results.tracks[0].info.uri})`
        break
    }

    return { tracks, success, error }
  }

  public async run(
    bot: DiscordBot,
    message: Discord.ChatInputCommandInteraction
  ): Promise<any> {
    const guild = message.guild
    if (!guild)
      return await message.reply(DiscordCommandInteractionResponse.NoGuild)

    const query = message.options.getString("song")
    if (!query) return await message.reply("No query provided")

    const author = this.getGuildMember(guild, message.user.id)
    if (!author)
      return await message.reply(DiscordCommandInteractionResponse.NoAuthor)

    if (!author.voice.channelId)
      return await message.reply("You are not in a voice channel")

    const vc = this.getAuthorVoiceState(guild, author)?.channel
    if (!vc)
      return await message.reply(
        DiscordCommandInteractionResponse.NoVoiceChannel
      )

    const mainChannel = this.getMainTextChannel(guild)
    if (!mainChannel)
      return await message.reply(
        DiscordCommandInteractionResponse.NoMainChannel
      )

    const player =
      bot.music.players.get(guild.id) ?? bot.music.createPlayer(guild.id)
    if (player && player.channelId !== vc.id)
      return await message.reply("You are not in the same voice channel as me")

    const { tracks, success, error } = await this.getMusic(bot, query)

    if (success) {
      await message.reply(success)
    } else if (error) {
      return await message.reply(error)
    }

    if (!player.connected) {
      player.queue.channel = mainChannel as Discord.TextBasedChannel
      player.connect(vc.id, { deafened: true })
    }

    const started = player.playing || player.paused
    player.queue.add(tracks, { requester: author.id, next: true })
    if (!started) {
      await player.queue.start()
    }
  }
}

export const playCommandData: DiscordCommandData = {
  name: "play",
  description: "Play the specified song",
  dmPermission: true,
  defaultMemberPermission: null,
  options: [
    {
      name: "song",
      description: "The song to play",
      type: DiscordCommandOptionType.String,
      required: true,
    },
  ],
}

export default new PlayCommand(
  playCommandData.name,
  playCommandData.description,
  playCommandData.dmPermission,
  playCommandData.defaultMemberPermission,
  playCommandData.options
)
