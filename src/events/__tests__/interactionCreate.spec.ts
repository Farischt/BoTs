import Discord from "discord.js"
import { DiscordBot, DiscordCommandDocument } from "../../types"
import { interactionCreate } from "../index"

describe("Interaction Hanlder", () => {
  it("should return if interaction is not a chat input command", async () => {
    const interaction = {
      isChatInputCommand: () => false,
    } as unknown as Discord.Interaction
    const bot = {
      commands: new Map<string, DiscordCommandDocument>(),
    } as unknown as DiscordBot

    const result = await interactionCreate(bot, interaction)
    expect(result).toBe(undefined)
  })

  it("should return if command is not found", async () => {
    const interaction = {
      isChatInputCommand: () => true,
      commandName: "anyCommand",
    } as unknown as Discord.Interaction
    const bot = {
      commands: new Map<string, DiscordCommandDocument>(),
    } as unknown as DiscordBot

    const result = await interactionCreate(bot, interaction)
    expect(result).toBe(undefined)
  })

  it("should run command if found", async () => {
    const interaction = {
      isChatInputCommand: () => true,
      commandName: "anyCommand",
      options: {},
    } as unknown as Discord.ChatInputCommandInteraction<Discord.CacheType>
    const run = jest.fn()
    const bot = {
      commands: new Map<string, DiscordCommandDocument>([
        ["anyCommand", { run } as unknown as DiscordCommandDocument],
      ]),
    } as unknown as DiscordBot

    const result = await interactionCreate(bot, interaction)
    expect(result).toBe(undefined)
    expect(run).toBeCalledWith(bot, interaction, interaction.options)
  })
})
