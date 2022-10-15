import Discord from "discord.js"
import chalk from "chalk"
import { BanCommandInstance, BanInteractionResponse } from "../"
import { DiscordBot, DiscordCommandInteractionResponse } from "../../types"

describe("Ban command", () => {
  it("should warn and return message if guild doesn't exist", async () => {
    const botMock = {} as DiscordBot
    const messageMock = {
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction
    const argsMock = {} as Discord.ChatInputCommandInteraction["options"]
    const warn = jest.spyOn(console, "warn")

    await BanCommandInstance.run(botMock, messageMock, argsMock)
    expect(warn).toBeCalledTimes(1)
    expect(warn).toBeCalledWith(
      chalk.bold.yellow(DiscordCommandInteractionResponse.NoGuild)
    )
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(
      DiscordCommandInteractionResponse.NoGuild
    )
  })

  it("should warn and return message if user to ban doesn't exist", async () => {
    const botMock = {} as DiscordBot
    const messageMock = {
      reply: jest.fn(),
      guild: {} as Discord.Guild,
    } as unknown as Discord.ChatInputCommandInteraction
    const argsMock = {
      getUser: jest.fn().mockReturnValue(undefined),
    } as unknown as Discord.ChatInputCommandInteraction["options"]
    const warn = jest.spyOn(console, "warn")

    await BanCommandInstance.run(botMock, messageMock, argsMock)
    expect(warn).toBeCalledTimes(1)
    expect(warn).toBeCalledWith(
      chalk.bold.yellow(BanInteractionResponse.NoMember)
    )
    expect(argsMock.getUser).toBeCalled()
    expect(argsMock.getUser).toBeCalledWith("member")
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(BanInteractionResponse.NoMember)
  })

  it("should warn and return message if member to ban doesn't exist", async () => {
    const botMock = {} as DiscordBot
    const messageMock = {
      reply: jest.fn(),
      guild: {
        members: {
          cache: {
            get: jest.fn().mockReturnValue(undefined),
          },
        },
      } as unknown as Discord.Guild,
    } as unknown as Discord.ChatInputCommandInteraction
    const argsMock = {
      getUser: jest.fn().mockReturnValue({ id: "1234" } as Discord.User),
    } as unknown as Discord.ChatInputCommandInteraction["options"]
    const warn = jest.spyOn(console, "warn")

    await BanCommandInstance.run(botMock, messageMock, argsMock)
    expect(warn).toBeCalledTimes(1)
    expect(warn).toBeCalledWith(
      chalk.bold.yellow(BanInteractionResponse.NoMember)
    )
    expect(argsMock.getUser).toBeCalled()
    expect(argsMock.getUser).toBeCalledWith("member")
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(BanInteractionResponse.NoMember)
  })
})
