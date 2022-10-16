import Discord from "discord.js"
import { OwnerCommand, OwnerInteractionResponse } from "../"
import { DiscordBot, DiscordCommandInteractionResponse } from "../../types"
import { Logger } from "../../utils"

const USER_ID = "123456789"
const OTHER_USER_ID = "987654321"

const warn = jest.spyOn(Logger, "warn")

describe("Ping command", () => {
  it("It should warn if guild doesn't exist", async () => {
    const messageMock = {
      guild: null,
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction
    const botMock = {} as unknown as DiscordBot

    await OwnerCommand.run(botMock, messageMock)
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(
      DiscordCommandInteractionResponse.NoGuild
    )
    expect(warn).toBeCalledTimes(1)
    expect(warn).toBeCalledWith(DiscordCommandInteractionResponse.NoGuild)
  })

  it("should warn if owner doesn't exist", async () => {
    const messageMock = {
      guild: {
        fetchOwner: jest.fn().mockResolvedValue(null),
      },
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction
    const botMock = {} as unknown as DiscordBot

    await OwnerCommand.run(botMock, messageMock)
    expect(messageMock.guild?.fetchOwner).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(
      DiscordCommandInteractionResponse.NoOwner
    )
    expect(warn).toBeCalledTimes(1)
    expect(warn).toBeCalledWith(DiscordCommandInteractionResponse.NoOwner)
  })

  it("should warn if author doesn't exist", async () => {
    const messageMock = {
      user: {
        id: USER_ID,
      },
      guild: {
        fetchOwner: jest.fn().mockResolvedValue({} as Discord.GuildMember),
        members: {
          cache: {
            get: jest.fn().mockReturnValue(null),
          },
        },
      },
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction
    const botMock = {} as unknown as DiscordBot

    await OwnerCommand.run(botMock, messageMock)
    expect(messageMock.guild?.fetchOwner).toBeCalledTimes(1)
    expect(messageMock.guild?.members.cache.get).toBeCalledTimes(1)
    expect(messageMock.guild?.members.cache.get).toBeCalledWith(
      messageMock.user.id
    )
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(
      DiscordCommandInteractionResponse.NoAuthor
    )
    expect(warn).toBeCalledTimes(1)
    expect(warn).toBeCalledWith(DiscordCommandInteractionResponse.NoAuthor)
  })

  it("should reply if author is owner", async () => {
    const messageMock = {
      user: {
        id: USER_ID,
      },
      guild: {
        fetchOwner: jest
          .fn()
          .mockResolvedValue({ id: USER_ID } as unknown as Discord.GuildMember),
        members: {
          cache: {
            get: jest
              .fn()
              .mockReturnValue({ id: USER_ID } as Discord.GuildMember),
          },
        },
      },
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction
    const botMock = {} as unknown as DiscordBot

    await OwnerCommand.run(botMock, messageMock)
    expect(messageMock.guild?.fetchOwner).toBeCalledTimes(1)
    expect(messageMock.guild?.members.cache.get).toBeCalledTimes(1)
    expect(messageMock.guild?.members.cache.get).toBeCalledWith(
      messageMock.user.id
    )
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(OwnerInteractionResponse.Self)
  })

  it("should reply the owner id", async () => {
    const messageMock = {
      user: {
        id: USER_ID,
      },
      guild: {
        fetchOwner: jest.fn().mockResolvedValue({
          id: OTHER_USER_ID,
          user: { id: OTHER_USER_ID },
        } as Discord.GuildMember),
        members: {
          cache: {
            get: jest
              .fn()
              .mockReturnValue({ id: USER_ID } as Discord.GuildMember),
          },
        },
      },
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction
    const botMock = {} as unknown as DiscordBot

    await OwnerCommand.run(botMock, messageMock)
    expect(messageMock.guild?.fetchOwner).toBeCalledTimes(1)
    expect(messageMock.guild?.members.cache.get).toBeCalledTimes(1)
    expect(messageMock.guild?.members.cache.get).toBeCalledWith(
      messageMock.user.id
    )
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(
      `<@${OTHER_USER_ID}> is the owner of this server ! He is a very nice guy and a f#cking GOAT !`
    )
  })
})
