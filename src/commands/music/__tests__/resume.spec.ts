import Discord from "discord.js"
import { Node, Player } from "lavaclient"
import { CHANNELS } from "../../../config.json"
import {
  DiscordBot,
  DiscordCommandInteractionResponse,
  DiscordMusicCommandInteractionResponse,
  DiscordWebHookName,
} from "../../../types"
import { ResumeCommandInstance, ResumeInteractionResponse } from "../.."

const SOME_RANDOM_GUILD_ID = "SOME_RANDOM_GUILD_ID"
const SOME_RANDOM_USER_ID = "SOME_RANDOM_USER_ID"

describe("Resume player command", () => {
  it("Should return an error message if no guild found", async () => {
    const botMock = {} as unknown as DiscordBot
    const messageMock = {
      guild: null,
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction

    await ResumeCommandInstance.run(botMock, messageMock)
    expect(messageMock.reply).toHaveBeenCalledTimes(1)
    expect(messageMock.reply).toHaveBeenCalledWith({
      content: DiscordCommandInteractionResponse.NoGuild,
      ephemeral: true,
    })
  })

  it("Should return an error message if no author found", async () => {
    const botMock = {} as unknown as DiscordBot
    const messageMock = {
      guild: {
        members: {
          cache: new Discord.Collection<
            Discord.Snowflake,
            Discord.GuildMember
          >(),
        },
      } as Discord.Guild,
      user: {
        id: SOME_RANDOM_USER_ID,
      } as unknown as Discord.User,
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction

    await ResumeCommandInstance.run(botMock, messageMock)
    expect(messageMock.reply).toHaveBeenCalledTimes(1)
    expect(messageMock.reply).toHaveBeenCalledWith({
      content: DiscordCommandInteractionResponse.NoAuthor,
      ephemeral: true,
    })
  })

  it("Should return an error message if author is not in music voice channel", async () => {
    const botMock = {} as unknown as DiscordBot
    const messageMock = {
      guild: {
        // Means that the author is in a voice channel but not in the music one
        voiceStates: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.VoiceState>([
            [
              SOME_RANDOM_USER_ID,
              { channel: { id: "fkrefkearfke" } } as Discord.VoiceState,
            ],
          ]),
        },
        // Voice music channel is stored here
        channels: {
          cache: new Discord.Collection<
            Discord.Snowflake,
            Discord.GuildBasedChannel
          >([
            [
              CHANNELS.MUSIC.VOICE_ID,
              { id: CHANNELS.MUSIC.VOICE_ID } as Discord.GuildBasedChannel,
            ],
          ]),
        },
        members: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.GuildMember>(
            [
              [
                SOME_RANDOM_USER_ID,
                { id: SOME_RANDOM_USER_ID } as Discord.GuildMember,
              ],
            ]
          ),
        },
      } as Discord.Guild,
      user: {
        id: SOME_RANDOM_USER_ID,
      } as unknown as Discord.User,
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction

    await ResumeCommandInstance.run(botMock, messageMock)
    expect(messageMock.reply).toHaveBeenCalledTimes(1)
    expect(messageMock.reply).toHaveBeenCalledWith({
      content: DiscordMusicCommandInteractionResponse.NotInMusicChannel,
      ephemeral: true,
    })
  })

  it("Should return an error message if music player is not found", async () => {
    const botMock = {
      music: {
        // No player available for the SOME_RANDOM_GUILD_ID guild
        players: new Map<string, Player<Node>>(),
      },
    } as unknown as DiscordBot
    const messageMock = {
      guild: {
        id: SOME_RANDOM_GUILD_ID,
        // Means that the author is in the correct voice channel
        voiceStates: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.VoiceState>([
            [
              SOME_RANDOM_USER_ID,
              {
                channel: {
                  id: CHANNELS.MUSIC.VOICE_ID,
                } as Discord.VoiceBasedChannel,
              } as Discord.VoiceState,
            ],
          ]),
        },
        // Voice music channel is stored here
        channels: {
          cache: new Discord.Collection<
            Discord.Snowflake,
            Discord.GuildBasedChannel
          >([
            [
              CHANNELS.MUSIC.VOICE_ID,
              { id: CHANNELS.MUSIC.VOICE_ID } as Discord.GuildBasedChannel,
            ],
          ]),
        },
        members: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.GuildMember>(
            [
              [
                SOME_RANDOM_USER_ID,
                { id: SOME_RANDOM_USER_ID } as Discord.GuildMember,
              ],
            ]
          ),
        },
      } as Discord.Guild,
      user: {
        id: SOME_RANDOM_USER_ID,
      } as unknown as Discord.User,
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction

    await ResumeCommandInstance.run(botMock, messageMock)
    expect(messageMock.reply).toHaveBeenCalledTimes(1)
    expect(messageMock.reply).toHaveBeenCalledWith({
      content: DiscordMusicCommandInteractionResponse.NoPlayer,
      ephemeral: true,
    })
  })

  it("Should return an error message if music player is not connected", async () => {
    const botMock = {
      music: {
        players: new Map<string, Player<Node>>([
          [
            SOME_RANDOM_GUILD_ID,
            {
              connected: false,
            } as Player<Node>,
          ],
        ]),
      },
    } as unknown as DiscordBot
    const messageMock = {
      guild: {
        id: SOME_RANDOM_GUILD_ID,
        // Means that the author is in the correct voice channel
        voiceStates: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.VoiceState>([
            [
              SOME_RANDOM_USER_ID,
              {
                channel: {
                  id: CHANNELS.MUSIC.VOICE_ID,
                } as Discord.VoiceBasedChannel,
              } as Discord.VoiceState,
            ],
          ]),
        },
        // Voice music channel is stored here
        channels: {
          cache: new Discord.Collection<
            Discord.Snowflake,
            Discord.GuildBasedChannel
          >([
            [
              CHANNELS.MUSIC.VOICE_ID,
              { id: CHANNELS.MUSIC.VOICE_ID } as Discord.GuildBasedChannel,
            ],
          ]),
        },
        members: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.GuildMember>(
            [
              [
                SOME_RANDOM_USER_ID,
                { id: SOME_RANDOM_USER_ID } as Discord.GuildMember,
              ],
            ]
          ),
        },
      } as Discord.Guild,
      user: {
        id: SOME_RANDOM_USER_ID,
      } as unknown as Discord.User,
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction

    await ResumeCommandInstance.run(botMock, messageMock)
    expect(messageMock.reply).toHaveBeenCalledTimes(1)
    expect(messageMock.reply).toHaveBeenCalledWith({
      content: DiscordMusicCommandInteractionResponse.PlayerNotConnected,
      ephemeral: true,
    })
  })

  it("Should return an error message if music player is not paused", async () => {
    const botMock = {
      music: {
        players: new Map<string, Player<Node>>([
          [
            SOME_RANDOM_GUILD_ID,
            {
              connected: true,
              paused: false,
            } as Player<Node>,
          ],
        ]),
      },
    } as unknown as DiscordBot
    const messageMock = {
      guild: {
        id: SOME_RANDOM_GUILD_ID,
        voiceStates: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.VoiceState>([
            [
              SOME_RANDOM_USER_ID,
              {
                channel: {
                  id: CHANNELS.MUSIC.VOICE_ID,
                } as Discord.VoiceBasedChannel,
              } as Discord.VoiceState,
            ],
          ]),
        },
        channels: {
          cache: new Discord.Collection<
            Discord.Snowflake,
            Discord.GuildBasedChannel
          >([
            [
              CHANNELS.MUSIC.VOICE_ID,
              { id: CHANNELS.MUSIC.VOICE_ID } as Discord.GuildBasedChannel,
            ],
          ]),
        },
        members: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.GuildMember>(
            [
              [
                SOME_RANDOM_USER_ID,
                { id: SOME_RANDOM_USER_ID } as Discord.GuildMember,
              ],
            ]
          ),
        },
      } as Discord.Guild,
      user: {
        id: SOME_RANDOM_USER_ID,
      } as unknown as Discord.User,
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction

    await ResumeCommandInstance.run(botMock, messageMock)
    expect(messageMock.reply).toHaveBeenCalledTimes(1)
    expect(messageMock.reply).toHaveBeenCalledWith({
      content: ResumeInteractionResponse.AlreadyPlaying,
      ephemeral: true,
    })
  })

  it("Should resume the player and return a message", async () => {
    const botMock = {
      // Empty webhooks
      webhooks: new Discord.Collection<string, Discord.WebhookClient>(),
      music: {
        players: new Map<string, Player<Node>>([
          [
            SOME_RANDOM_GUILD_ID,
            {
              connected: true,
              paused: true,
              resume: jest.fn(),
              queue: {
                current: { title: "SOME_RANDOM_MUSIC_TITLE" },
              },
            } as unknown as Player<Node>,
          ],
        ]),
      },
    } as unknown as DiscordBot
    const messageMock = {
      guild: {
        id: SOME_RANDOM_GUILD_ID,
        voiceStates: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.VoiceState>([
            [
              SOME_RANDOM_USER_ID,
              {
                channel: {
                  id: CHANNELS.MUSIC.VOICE_ID,
                } as Discord.VoiceBasedChannel,
              } as Discord.VoiceState,
            ],
          ]),
        },
        channels: {
          cache: new Discord.Collection<
            Discord.Snowflake,
            Discord.GuildBasedChannel
          >([
            [
              CHANNELS.MUSIC.VOICE_ID,
              { id: CHANNELS.MUSIC.VOICE_ID } as Discord.GuildBasedChannel,
            ],
          ]),
        },
        members: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.GuildMember>(
            [
              [
                SOME_RANDOM_USER_ID,
                { id: SOME_RANDOM_USER_ID } as Discord.GuildMember,
              ],
            ]
          ),
        },
      } as Discord.Guild,
      user: {
        id: SOME_RANDOM_USER_ID,
      } as unknown as Discord.User,
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction

    const playerResumeSpy = jest.spyOn(
      botMock.music.players.get(
        SOME_RANDOM_GUILD_ID
      ) as unknown as Player<Node>,
      "resume"
    )

    await ResumeCommandInstance.run(botMock, messageMock)
    expect(playerResumeSpy).toHaveBeenCalledTimes(1)
    expect(messageMock.reply).toHaveBeenCalledTimes(1)
    expect(messageMock.reply).toHaveBeenCalledWith({
      content: ResumeInteractionResponse.Success,
      ephemeral: true,
    })
  })

  it("Should resume the player, trigger a webhook and return a message", async () => {
    const botMock = {
      webhooks: new Discord.Collection<string, Discord.WebhookClient>([
        [
          DiscordWebHookName.Dj,
          { send: jest.fn() } as unknown as Discord.WebhookClient,
        ],
      ]),
      music: {
        players: new Map<string, Player<Node>>([
          [
            SOME_RANDOM_GUILD_ID,
            {
              connected: true,
              paused: true,
              resume: jest.fn(),
              queue: {
                current: { title: "SOME_RANDOM_MUSIC_TITLE" },
              },
            } as unknown as Player<Node>,
          ],
        ]),
      },
    } as unknown as DiscordBot
    const messageMock = {
      guild: {
        id: SOME_RANDOM_GUILD_ID,
        voiceStates: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.VoiceState>([
            [
              SOME_RANDOM_USER_ID,
              {
                channel: {
                  id: CHANNELS.MUSIC.VOICE_ID,
                } as Discord.VoiceBasedChannel,
              } as Discord.VoiceState,
            ],
          ]),
        },
        channels: {
          cache: new Discord.Collection<
            Discord.Snowflake,
            Discord.GuildBasedChannel
          >([
            [
              CHANNELS.MUSIC.VOICE_ID,
              { id: CHANNELS.MUSIC.VOICE_ID } as Discord.GuildBasedChannel,
            ],
          ]),
        },
        members: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.GuildMember>(
            [
              [
                SOME_RANDOM_USER_ID,
                { id: SOME_RANDOM_USER_ID } as Discord.GuildMember,
              ],
            ]
          ),
        },
      } as Discord.Guild,
      user: {
        id: SOME_RANDOM_USER_ID,
      } as unknown as Discord.User,
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction

    const playerResumeSpy = jest.spyOn(
      botMock.music.players.get(
        SOME_RANDOM_GUILD_ID
      ) as unknown as Player<Node>,
      "resume"
    )

    const webhookTriggerSpy = jest.spyOn(
      botMock.webhooks.get(
        DiscordWebHookName.Dj
      ) as unknown as Discord.WebhookClient,
      "send"
    )

    await ResumeCommandInstance.run(botMock, messageMock)
    expect(
      botMock.webhooks.get(DiscordWebHookName.Dj)?.send
    ).toHaveBeenCalledTimes(1)
    expect(playerResumeSpy).toHaveBeenCalledTimes(1)
    expect(webhookTriggerSpy).toHaveBeenCalledTimes(1)
    expect(messageMock.reply).toHaveBeenCalledTimes(1)
    expect(messageMock.reply).toHaveBeenCalledWith({
      content: ResumeInteractionResponse.Success,
      ephemeral: true,
    })
  })
})
