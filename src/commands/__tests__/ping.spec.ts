import Discord from "discord.js"
import { PingCommand } from "../"
import { DiscordBot } from "../../types"

describe("Ping command", () => {
  it("It should run the command and reply", async () => {
    const botMock = {
      ws: {
        ping: 100,
      },
    } as unknown as DiscordBot

    const messageMock = {
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction

    const result = await PingCommand.run(botMock, messageMock)
    expect(messageMock.reply).toHaveBeenCalledWith(
      `Pong ! ${botMock.ws.ping}ms`
    )
    expect(messageMock.reply).toHaveBeenCalledTimes(1)
    expect(result).toBeUndefined()
  })
})
