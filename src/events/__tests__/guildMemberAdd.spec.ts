import Discord from "discord.js"
import { DiscordBot, DiscordMemberRole } from "../../types"
import { guildMemberAdd } from "../index"
import { MAIN_TEXT_CHANNEL_ID } from "../../config.json"

describe("guildMemberAdd Handler", () => {
  it("should return if text channel is not", async () => {
    const newMemberMock = {
      guild: {
        channels: {
          cache: new Discord.Collection<
            Discord.Snowflake,
            Discord.GuildBasedChannel
          >(),
        },
      },
    } as unknown as Discord.GuildMember
    const botMock = {} as unknown as DiscordBot

    const result = await guildMemberAdd(botMock, newMemberMock)
    expect(result).toBe(undefined)
  })

  it("should return if default role is not found", async () => {
    const newMemberMock = {
      guild: {
        channels: {
          cache: new Discord.Collection<string, Discord.GuildBasedChannel>([
            [MAIN_TEXT_CHANNEL_ID, {} as Discord.GuildBasedChannel],
          ]),
        },
        roles: {
          cache: new Discord.Collection<string, Discord.Role>(),
        },
      },
    } as unknown as Discord.GuildMember
    const botMock = {} as unknown as DiscordBot

    const result = await guildMemberAdd(botMock, newMemberMock)
    expect(result).toBe(undefined)
  })

  it("should add role to new member", async () => {
    const newMemberMock = {
      user: { tag: "newMember#1234" } as Discord.User,
      guild: {
        channels: {
          cache: new Discord.Collection<string, Discord.GuildBasedChannel>([
            [MAIN_TEXT_CHANNEL_ID, {} as Discord.GuildBasedChannel],
          ]),
        },
        roles: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.Role>([
            [
              DiscordMemberRole.Default,
              { name: DiscordMemberRole.Default } as Discord.Role,
            ],
          ]),
        },
      },
      roles: {
        cache: new Discord.Collection<Discord.Snowflake, Discord.Role>(),
        add: jest.fn(() =>
          newMemberMock.roles.cache.set(DiscordMemberRole.Default, {
            name: DiscordMemberRole.Default,
          } as Discord.Role)
        ),
      } as unknown as Discord.GuildMemberRoleManager,
    } as unknown as Discord.GuildMember
    const botMock = {} as unknown as DiscordBot

    await guildMemberAdd(botMock, newMemberMock)
    expect(newMemberMock.roles.add).toBeCalledTimes(1)
    // TODO : Find a way to test if the role has been added to the member
    // expect(newMemberMock.roles.cache).toContain({
    //   name: DiscordMemberRole.Default,
    // })
  })
})
