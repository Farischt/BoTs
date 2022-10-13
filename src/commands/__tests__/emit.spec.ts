import Discord from "discord.js"
import chalk from "chalk"
import { EmitCommand } from "../"
import { DiscordBot } from "../../types"

describe("Ping command", () => {
  it("Should return if ", async () => {
    const botMock = {} as unknown as DiscordBot
    const messageMock = {
      options: {
        getString: jest.fn((string: string) => null),
      },
    } as unknown as Discord.ChatInputCommandInteraction

    const result = await EmitCommand.run(botMock, messageMock)
    expect(messageMock.options.getString).toHaveBeenCalledWith("event")
    expect(messageMock.options.getString).toHaveBeenCalledTimes(1)
    expect(result).toBeUndefined()
  })

  it("should return if event is not in eventChoices", async () => {
    const event = "invalidEvent"
    const botMock = {} as unknown as DiscordBot
    const messageMock = {
      reply: jest.fn(),
      options: {
        getString: jest.fn(() => event),
      },
    } as unknown as Discord.ChatInputCommandInteraction
    const log = jest.spyOn(console, "error")

    const result = await EmitCommand.run(botMock, messageMock)
    expect(messageMock.options.getString).toHaveBeenCalledWith("event")
    expect(messageMock.options.getString).toHaveBeenCalledTimes(1)
    expect(log).toHaveBeenCalledWith(
      chalk.bold.red(`Invalid event : ${event}.`)
    )
    expect(result).toBeUndefined()
  })

  it("Should emit event", async () => {
    const event = "guildMemberRemove"
    const botMock = {
      emit: jest.fn(),
    } as unknown as DiscordBot
    const messageMock = {
      reply: jest.fn(),
      member: {
        user: {
          id: "123456789",
        },
      },
      options: {
        getString: jest.fn(() => event),
      },
    } as unknown as Discord.ChatInputCommandInteraction

    const result = await EmitCommand.run(botMock, messageMock)
    expect(messageMock.options.getString).toHaveBeenCalledWith("event")
    expect(messageMock.options.getString).toHaveBeenCalledTimes(1)
    expect(botMock.emit).toHaveBeenCalledWith(event, messageMock.member)
    expect(botMock.emit).toHaveBeenCalledTimes(1)
    expect(result).toBeUndefined()
  })

  it("Should return if member is null", async () => {
    const event = "guildMemberRemove"
    const botMock = {
      emit: jest.fn(),
    } as unknown as DiscordBot
    const messageMock = {
      reply: jest.fn(),
      member: null,
      options: {
        getString: jest.fn(() => event),
      },
    } as unknown as Discord.ChatInputCommandInteraction

    const result = await EmitCommand.run(botMock, messageMock)
    expect(messageMock.options.getString).toHaveBeenCalledWith("event")
    expect(messageMock.options.getString).toHaveBeenCalledTimes(1)
    expect(botMock.emit).not.toHaveBeenCalled()
    expect(result).toBeUndefined()
  })

  it("Should emit event and reply", async () => {
    const event = "guildMemberRemove"
    const botMock = {
      emit: jest.fn(),
    } as unknown as DiscordBot
    const messageMock = {
      reply: jest.fn(),
      member: {
        user: {
          id: "123456789",
        },
      },
      options: {
        getString: jest.fn(() => event),
      },
    } as unknown as Discord.ChatInputCommandInteraction

    const result = await EmitCommand.run(botMock, messageMock)
    expect(messageMock.options.getString).toHaveBeenCalledWith("event")
    expect(messageMock.options.getString).toHaveBeenCalledTimes(1)
    expect(botMock.emit).toHaveBeenCalledWith(event, messageMock.member)
    expect(botMock.emit).toHaveBeenCalledTimes(1)
    expect(messageMock.reply).toHaveBeenCalledWith(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `Event ${event} emitted by <@${messageMock.member?.user.id}>`
    )
    expect(messageMock.reply).toHaveBeenCalledTimes(1)
    expect(result).toBeUndefined()
  })
})
