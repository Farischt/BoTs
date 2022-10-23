import Discord from "discord.js"
import { Addable } from "@lavaclient/queue"
import { LoadType } from "@lavaclient/types/v3"
import {
  DiscordBot,
  DiscordMusicCommand,
  DiscordCommandOptions,
  DiscordCommandData,
  DiscordCommandOptionType,
  DiscordCommandInteractionResponse,
  DiscordMusicCommandInteractionResponse,
} from "../../types"

interface GetMusicResponse {
  tracks: Addable[]
  success: string
  error: string
}

enum PlayInteractionResponse {
  NoQuery = "No query provided !",
  LoadFailed = "Failed to load your track !",
  NoMatch = "No result matches your query !",
  NoVoiceMusicChannel = "No voice channel found !",
  NotSameChannel = "You must be in the same voice channel as me to play music !",
  Success = "Successfully added your music !",
  Busy = "Music added to the queue ! The bot is already playing music !",
}

export class PlayCommand extends DiscordMusicCommand {
  public constructor(
    name: string,
    description: string,
    dmPermission: boolean,
    defaultMemberPermission: Discord.PermissionResolvable | null,
    options?: DiscordCommandOptions
  ) {
    super(name, description, dmPermission, defaultMemberPermission, options)
  }

  private getQueryToPlayFromArgs(
    args: Discord.ChatInputCommandInteraction["options"]
  ): string | null {
    return args.getString("song")
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
      case LoadType.LoadFailed:
        error = PlayInteractionResponse.LoadFailed
        break
      case LoadType.NoMatches:
        error = PlayInteractionResponse.NoMatch
        break
      case LoadType.PlaylistLoaded:
        tracks = results.tracks
        success = `Queued playlist [**${results.playlistInfo.name}**](${query}), it has a total of **${tracks.length}** tracks.`
        break
      case LoadType.TrackLoaded:
        tracks = [results.tracks[0]]
        success = `Queued track [**${results.tracks[0].info.title}**](${results.tracks[0].info.uri})`
        break
      case LoadType.SearchResult:
        // Same as the previous case but we want to make sur to queue the first most revelant result
        tracks = [results.tracks[0]]
        success = `Queued track [**${results.tracks[0].info.title}**](${results.tracks[0].info.uri})`
        break
    }

    return { tracks, success, error }
  }

  public async run(
    bot: DiscordBot,
    message: Discord.ChatInputCommandInteraction
  ): Promise<
    Discord.InteractionResponse<boolean> | undefined | Discord.Message<boolean>
  > {
    const guild = message.guild
    if (!guild)
      return await message.reply({
        content: DiscordCommandInteractionResponse.NoGuild,
        ephemeral: true,
      })

    const query = this.getQueryToPlayFromArgs(message.options)
    if (!query)
      return await message.reply({
        content: PlayInteractionResponse.NoQuery,
        ephemeral: true,
      })

    const author = this.getGuildMember(guild, message.user.id)
    if (!author)
      return await message.reply({
        content: DiscordCommandInteractionResponse.NoAuthor,
        ephemeral: true,
      })

    if (!author.voice.channelId)
      return await message.reply({
        content: DiscordMusicCommandInteractionResponse.NotInVoiceChannel,
        ephemeral: true,
      })

    // TODO : Reusable code for all music commands
    const authorVoiceChannel = this.getAuthorVoiceState(guild, author)?.channel
    if (!authorVoiceChannel) {
      return await message.reply({
        content: DiscordCommandInteractionResponse.NoVoiceChannel,
        ephemeral: true,
      })
    }

    const musicVoiceChannel = this.getMusicVoiceChannel(guild)
    if (!musicVoiceChannel) {
      return await message.reply(PlayInteractionResponse.NoVoiceMusicChannel)
    } else if (authorVoiceChannel.id !== musicVoiceChannel.id) {
      return await message.reply({
        content: DiscordMusicCommandInteractionResponse.NotInMusicChannel,
        ephemeral: true,
      })
    }
    // TODO : End of reusable code for all music commands

    const musicTextChannel = this.getMusicTextChannel(guild)
    if (!musicTextChannel)
      return await message.reply({
        content: DiscordCommandInteractionResponse.NoMainChannel,
        ephemeral: true,
      })

    const player =
      bot.music.players.get(guild.id) ?? bot.music.createPlayer(guild.id)

    if (player.channelId && player.channelId !== authorVoiceChannel.id)
      return await message.reply({
        content: PlayInteractionResponse.NotSameChannel,
        ephemeral: true,
      })

    const { tracks, error, success } = await this.getMusic(bot, query)
    if (success) {
      await message.reply({
        content: success,
        ephemeral: true,
      })
    } else if (error) {
      return await message.reply({ content: error, ephemeral: true })
    }

    // At this point, a message has been sent to the user, we need to use followUp method to send a new message

    if (!player.connected) {
      player.queue.channel = musicTextChannel
      player.connect(musicVoiceChannel.id, { deafened: true })
    }

    player.queue.add(tracks, { requester: author.id })
    const started = player.playing || player.paused
    if (started) {
      return await message.followUp({
        content: PlayInteractionResponse.Busy,
        ephemeral: true,
      })
    }
    await player.queue.start()
    return await message.followUp({
      content: PlayInteractionResponse.Success,
      ephemeral: true,
    })
  }
}

export const playCommandData: DiscordCommandData = {
  name: "play",
  description: "Play or add the specified song to the music player",
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
