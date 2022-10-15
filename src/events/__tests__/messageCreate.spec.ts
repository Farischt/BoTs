import Discord from "discord.js"
import { DiscordBot, DiscordCommandDocument } from "../../types"
import { messageCreate, MessageErrorResponse } from "../index"

const INVALID_CONTENT = "hello"
const VALID_CONTENT = "!ping"
const VALID_COMMAND = "ping"

describe("message create handler", () => {
  it("should return if message does not start with command prefix", async () => {
    const messageMock = {
      content: INVALID_CONTENT,
    } as unknown as Discord.Message
    const botMock = {} as unknown as DiscordBot
    const result = await messageCreate(botMock, messageMock)
    expect(result).toBeUndefined()
  })

  it("should return a message if message  is empty", () => {
    const messageMock = {
      content: "!",
      reply: jest.fn(),
    } as unknown as Discord.Message
    const botMock = {} as unknown as DiscordBot
    messageCreate(botMock, messageMock)
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(
      MessageErrorResponse.InvalidCommandInput
    )
  })

  it("should return if message does not have a command", async () => {
    const messageMock = {
      content: VALID_CONTENT,
      reply: jest.fn(),
    } as unknown as Discord.Message
    const botMock = {
      commands: new Discord.Collection<
        Discord.Snowflake,
        DiscordCommandDocument
      >(),
    } as unknown as DiscordBot
    await messageCreate(botMock, messageMock)
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(
      MessageErrorResponse.CommandNotFound
    )
  })

  it("should return a message reply if cmd exist", async () => {
    const commandMock = {
      name: VALID_COMMAND,
      getName: jest.fn(() => VALID_COMMAND),
    } as unknown as DiscordCommandDocument
    const messageMock = {
      content: VALID_CONTENT,
      reply: jest.fn(),
    } as unknown as Discord.Message
    const botMock = {
      commands: new Discord.Collection<
        Discord.Snowflake,
        DiscordCommandDocument
      >([[VALID_COMMAND, commandMock]]),
    } as unknown as DiscordBot

    await messageCreate(botMock, messageMock)
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(
      `${MessageErrorResponse.CommandDepreciated} (/${commandMock.getName()})`
    )
  })
})
