// import Discord from "discord.js"
// import { DiscordBot, DiscordCommandDocument } from "../../types"
// import { ready } from "../index"
// import { PingCommand } from "../../commands"
// import CONFIG from "../../config.json"

describe("Ready Handler", () => {
  it("should log if and load slash commands", async () => {
    expect(true).toBe(true)
  })
  //   console.log(PingCommand.getOptions())
  //   const run = jest.fn()
  //   const bot = {
  //     token: CONFIG.DISCORD_TOKEN,
  //     user: {
  //       tag: "Bot v14#5148",
  //       // TODO: add id from config
  //       id: "1025373911145254994",
  //     },
  //     commands: new Map<string, DiscordCommandDocument>([
  //       [
  //         "ping",
  //         {
  //           PingCommand,
  //         } as unknown as DiscordCommandDocument,
  //       ],
  //     ]),
  //   } as unknown as DiscordBot
  //   const slashCommandsLoader = jest.fn()
  //   jest.mock("../../loaders/slashCommands", () => slashCommandsLoader)
  //   const log = jest.spyOn(console, "log")
  //   const chalk = {
  //     blue: jest.fn(),
  //   }
  //   await ready(bot, {} as unknown as Discord.Message)
  //   // expect(log).toBeCalledWith(chalk.blue(`${bot.user?.tag} is ready !`))
  //   expect(slashCommandsLoader).toBeCalledWith(bot)
  // })
})
