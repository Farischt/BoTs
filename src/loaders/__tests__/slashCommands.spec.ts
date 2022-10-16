import { PingCommand, pingCommandData } from "../../commands"
import { DiscordCommandOptionType } from "../../types"
import { createSlashCommand, addSlashCommandOption } from "../slashCommands"

describe("Slash Commands Loader", () => {
  it("Should create a slash command", () => {
    const command = PingCommand
    const slashCommand = createSlashCommand(command)
    expect(slashCommand.toJSON()).toEqual({
      name: pingCommandData.name,
      description: pingCommandData.description,
      dm_permission: pingCommandData.dmPermission,
      default_member_permissions:
        pingCommandData.defaultMemberPermission ?? undefined,
      options: pingCommandData.options ?? [],
    })
  })

  it("Should create and add user option to a slash command", () => {
    const command = PingCommand
    const slashCommand = createSlashCommand(command)
    const addUserOption = jest.spyOn(slashCommand, "addUserOption")
    const options = {
      name: "user",
      description: "User to ping",
      type: DiscordCommandOptionType.User,
      required: true,
    }

    addSlashCommandOption(slashCommand, options)
    expect(slashCommand.options).toEqual(
      new Array({
        name: options.name,
        description: options.description,
        required: options.required,
        type: 6,
      })
    )
    expect(addUserOption).toBeCalledTimes(1)
    expect(addUserOption).toBeCalledWith(expect.any(Function))
  })

  it("Should create and add string option to a slash command", () => {
    const command = PingCommand
    const slashCommand = createSlashCommand(command)
    const addStringOption = jest.spyOn(slashCommand, "addStringOption")
    const options = {
      name: "test",
      description: "test description",
      type: DiscordCommandOptionType.String,
      required: true,
    }

    addSlashCommandOption(slashCommand, options)
    expect(slashCommand.options).toEqual([
      {
        name: options.name,
        description: options.description,
        required: options.required,
        type: 3,
      },
    ])
    expect(addStringOption).toBeCalledTimes(1)
    expect(addStringOption).toBeCalledWith(expect.any(Function))
  })

  it("Should log unsupported option type", () => {
    const command = PingCommand
    const slashCommand = createSlashCommand(command)
    const options = {
      name: "test",
      description: "test description",
      type: DiscordCommandOptionType.Boolean,
      required: true,
    }
    const error = jest.spyOn(console, "error")

    addSlashCommandOption(slashCommand, options)
    expect(error).toBeCalledTimes(1)
  })
})
