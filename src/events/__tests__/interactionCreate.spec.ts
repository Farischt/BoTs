import Discord from "discord.js"
import { DiscordBot, DiscordCommandDocument } from "../../types"
import { interactionCreate } from "../index"

const INVALID_COMMAND_NAME = "anyCommand"
const VALID_COMMAND_NAME = "anyCommand"

describe("Interaction Hanlder", () => {
  it("should return if interaction is not a chat input command", async () => {
    const interaction = {
      isChatInputCommand: () => false,
    } as unknown as Discord.Interaction
    const bot = {
      commands: new Discord.Collection<
        Discord.Snowflake,
        DiscordCommandDocument
      >(),
    } as unknown as DiscordBot

    const result = await interactionCreate(bot, interaction)
    expect(result).toBe(undefined)
  })

  it("should return if command is not found", async () => {
    const interaction = {
      isChatInputCommand: () => true,
      commandName: INVALID_COMMAND_NAME,
    } as unknown as Discord.Interaction
    const bot = {
      commands: new Discord.Collection<
        Discord.Snowflake,
        DiscordCommandDocument
      >(),
    } as unknown as DiscordBot

    const result = await interactionCreate(bot, interaction)
    expect(result).toBe(undefined)
  })

  it("should run command if found", async () => {
    const interaction = {
      isChatInputCommand: () => true,
      commandName: VALID_COMMAND_NAME,
      options: {},
    } as unknown as Discord.ChatInputCommandInteraction<Discord.CacheType>
    const run = jest.fn()
    const bot = {
      commands: new Discord.Collection<
        Discord.Snowflake,
        DiscordCommandDocument
      >([[VALID_COMMAND_NAME, { run } as unknown as DiscordCommandDocument]]),
    } as unknown as DiscordBot

    const result = await interactionCreate(bot, interaction)
    expect(result).toBe(undefined)
    expect(run).toBeCalledWith(bot, interaction, interaction.options)
    expect(run).toBeCalledTimes(1)
  })
})
