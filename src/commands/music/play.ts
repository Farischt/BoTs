import Discord from "discord.js"
import {
  DiscordBot,
  DiscordMusicCommand,
  DiscordCommandOptions,
  DiscordCommandData,
  DiscordCommandOptionType,
} from "../../types"

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

  public async run(
    bot: DiscordBot,
    message: Discord.ChatInputCommandInteraction
  ): Promise<any> {
    const { guild, member } = message

    if (!bot.user) {
      return await message.reply("No bot !")
    }

    if (!guild)
      return await message.reply("This command can only be used in a guild.")
    if (!member)
      return await message.reply("This command can only be used by a member.")

    const author = this.getGuildMember(guild, member.user.id)
    if (!author) return await message.reply("Member not found.")

    const me = this.getGuildMember(guild, bot.user.id)

    if (!author.voice.channelId)
      return await message.reply({
        content: "You are not in a voice channel!",
        ephemeral: true,
      })
    if (me?.voice.channelId && author.voice.channelId !== me.voice.channelId)
      return await message.reply({
        content: "You are not in my voice channel!",
        ephemeral: true,
      })
    const query = message.options.getString("song")
    if (!query) return await message.reply("No query provided.")

    const voiceChannel = author.voice.channel
    if (!voiceChannel) {
      return await message.reply("Voice channel not found !")
    }

    const queue = await bot.player.createQueue(guild, {
      metadata: {
        channel: voiceChannel,
      },
      initialVolume: 100,
      autoSelfDeaf: false,
    })

    // verify vc connection
    try {
      if (!queue.connection) await queue.connect(voiceChannel)
    } catch {
      queue.destroy()
      return await message.reply({
        content: "Could not join your voice channel!",
        ephemeral: true,
      })
    }

    await message.deferReply()
    const track = await bot.player
      .search(query, {
        requestedBy: message.user,
      })
      .then((x) => x.tracks[0])
    if (!track)
      return await message.followUp({
        content: `❌ | Track **${query}** not found!`,
      })

    queue.addTrack(track)

    if (!queue.playing) await queue.play()

    console.log(queue.playing)
    console.log(queue.current)

    return await message.followUp({
      content: `⏱️ | Loading track **${track.title}**!`,
    })
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
