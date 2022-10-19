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
import { CHANNELS } from "../../config.json"

enum ResumeInteractionResponse {
  AlreadyPlaying = "Player is already playing !",
  Success = "Successfully resumed the music !",
}

export class ResumeCommand extends DiscordMusicCommand {
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
    } else if (!player.paused) {
      return await message.reply({
        content: ResumeInteractionResponse.AlreadyPlaying,
        ephemeral: true,
      })
    }

    const song = player.queue.current

    await player.resume()
    const Dj = bot.webhooks.get(DiscordWebHookName.Dj)
    if (Dj)
      await Dj.send(
        `Music player \`resumed\` by ${`<@${author.id}>`} ! Use \`/pause\` to pause the music !${
          song
            ? `\nNow playing **${song.title}** on channel <#${CHANNELS.MUSIC.VOICE_ID}>`
            : ""
        }`
      )

    return await message.reply({
      content: ResumeInteractionResponse.Success,
      ephemeral: true,
    })
  }
}

export const resumeCommandData: DiscordCommandData = {
  name: "resume",
  description: "Resumes the music player",
  dmPermission: true,
  defaultMemberPermission: null,
  options: undefined,
}

export default new ResumeCommand(
  resumeCommandData.name,
  resumeCommandData.description,
  resumeCommandData.dmPermission,
  resumeCommandData.defaultMemberPermission,
  resumeCommandData.options
)
