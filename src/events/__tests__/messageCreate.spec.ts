import Discord from "discord.js"
import { PingCommand } from "../../commands"
import { DiscordBot, DiscordCommandDocument } from "../../types"
import { messageCreate, MessageErrorResponse } from "../index"

describe("message create handler", () => {
  it("should return if message does not start with command prefix", async () => {
    const messageMock = {
      content: "hello",
    } as unknown as Discord.Message
    const botMock = {} as unknown as DiscordBot
    const result = await messageCreate(botMock, messageMock)
    expect(result).toBeUndefined()
  })

  it("should return if message does not have a command", async () => {
    const messageMock = {
      content: "!hello",
      reply: jest.fn(),
    } as unknown as Discord.Message
    const botMock = {
      commands: new Discord.Collection<
        Discord.Snowflake,
        DiscordCommandDocument
      >(),
    } as unknown as DiscordBot
    await messageCreate(botMock, messageMock)
    expect(messageMock.reply).toBeCalledWith(
      MessageErrorResponse.CommandNotFound
    )
  })

  it("should return a message reply if cmd exist", async () => {
    const messageMock = {
      content: `!${PingCommand.getName()}`,
      reply: jest.fn(),
    } as unknown as Discord.Message
    const botMock = {
      commands: new Discord.Collection<
        Discord.Snowflake,
        DiscordCommandDocument
      >([["ping", PingCommand]]),
    } as unknown as DiscordBot

    await messageCreate(botMock, messageMock)
    expect(messageMock.reply).toBeCalledWith(
      `${MessageErrorResponse.CommandDepreciated} (/${PingCommand.getName()})`
    )
  })
})
