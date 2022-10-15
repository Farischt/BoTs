import Discord from "discord.js"
import chalk from "chalk"
import { BanCommandInstance, BanInteractionResponse } from "../"
import { DiscordBot, DiscordCommandInteractionResponse } from "../../types"

const USER_TO_BAN_ID = "1234"
const MESSAGE_AUTHOR_ID = "5678"
const GUILD_OWNER_ID = "9012"
const ERROR_MESSAGE = "Error message"

describe("Ban command", () => {
  it("Should warn and return message if guild doesn't exist", async () => {
    // argsMock define the args containing the target user to ban
    const argsMock = {} as Discord.ChatInputCommandInteraction["options"]
    const botMock = {} as DiscordBot
    const messageMock = {
      reply: jest.fn(),
    } as unknown as Discord.ChatInputCommandInteraction
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

  it("Should warn and return message if user to ban doesn't exist", async () => {
    const argsMock = {
      getUser: jest.fn().mockReturnValue(undefined),
    } as unknown as Discord.ChatInputCommandInteraction["options"]
    const botMock = {} as DiscordBot
    const messageMock = {
      reply: jest.fn(),
      guild: {} as Discord.Guild,
    } as unknown as Discord.ChatInputCommandInteraction
    const warn = jest.spyOn(console, "warn")

    await BanCommandInstance.run(botMock, messageMock, argsMock)
    expect(warn).toBeCalledTimes(1)
    expect(warn).toBeCalledWith(
      chalk.bold.yellow(BanInteractionResponse.NoUser)
    )
    expect(argsMock.getUser).toBeCalled()
    expect(argsMock.getUser).toBeCalledWith("member")
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(BanInteractionResponse.NoUser)
  })

  it("Should warn and return message if member to ban doesn't exist", async () => {
    const argsMock = {
      getUser: jest
        .fn()
        .mockReturnValue({ id: USER_TO_BAN_ID } as Discord.User),
    } as unknown as Discord.ChatInputCommandInteraction["options"]
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
    const warn = jest.spyOn(console, "warn")

    await BanCommandInstance.run(botMock, messageMock, argsMock)
    expect(warn).toBeCalledTimes(1)
    expect(warn).toBeCalledWith(
      chalk.bold.yellow(BanInteractionResponse.NoMember)
    )
    expect(argsMock.getUser).toBeCalled()
    expect(argsMock.getUser).toBeCalledWith("member")
    expect(messageMock.guild?.members.cache.get).toBeCalledTimes(1)
    expect(messageMock.guild?.members.cache.get).toBeCalledWith(USER_TO_BAN_ID)
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(BanInteractionResponse.NoMember)
  })

  it("Should warn and return message if guild member author doesn't exist", async () => {
    const argsMock = {
      getUser: jest
        .fn()
        .mockReturnValue({ id: USER_TO_BAN_ID } as Discord.User),
    } as unknown as Discord.ChatInputCommandInteraction["options"]
    const botMock = {} as DiscordBot
    const messageMock = {
      user: {
        id: MESSAGE_AUTHOR_ID,
      },
      reply: jest.fn(),
      guild: {
        members: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.GuildMember>(
            [[USER_TO_BAN_ID, {} as Discord.GuildMember]]
          ),
        },
      } as unknown as Discord.Guild,
    } as unknown as Discord.ChatInputCommandInteraction

    const warn = jest.spyOn(console, "warn")
    const cacheGet = jest.spyOn(
      messageMock.guild?.members.cache as unknown as Discord.Collection<
        Discord.Snowflake,
        Discord.GuildMember
      >,
      "get"
    )

    await BanCommandInstance.run(botMock, messageMock, argsMock)
    expect(warn).toBeCalledTimes(1)
    expect(warn).toBeCalledWith(
      chalk.bold.yellow(DiscordCommandInteractionResponse.NoAuthor)
    )
    expect(argsMock.getUser).toBeCalled()
    expect(argsMock.getUser).toBeCalledWith("member")
    expect(cacheGet).toBeCalledTimes(2)
    expect(cacheGet).toBeCalledWith(USER_TO_BAN_ID)
    expect(cacheGet).toBeCalledWith(MESSAGE_AUTHOR_ID)
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(
      DiscordCommandInteractionResponse.NoAuthor
    )
  })

  it("Should warn and return message if guild owner doesn't exist", async () => {
    const argsMock = {
      getUser: jest
        .fn()
        .mockReturnValue({ id: USER_TO_BAN_ID } as Discord.User),
    } as unknown as Discord.ChatInputCommandInteraction["options"]
    const botMock = {} as DiscordBot
    const messageMock = {
      user: {
        id: MESSAGE_AUTHOR_ID,
      },
      reply: jest.fn(),
      guild: {
        fetchOwner: jest.fn().mockResolvedValue(undefined),
        members: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.GuildMember>(
            [
              [USER_TO_BAN_ID, {} as Discord.GuildMember],
              [MESSAGE_AUTHOR_ID, {} as Discord.GuildMember],
            ]
          ),
        },
      } as unknown as Discord.Guild,
    } as unknown as Discord.ChatInputCommandInteraction

    const warn = jest.spyOn(console, "warn")
    const cacheGet = jest.spyOn(
      messageMock.guild?.members.cache as unknown as Discord.Collection<
        Discord.Snowflake,
        Discord.GuildMember
      >,
      "get"
    )

    await BanCommandInstance.run(botMock, messageMock, argsMock)
    expect(warn).toBeCalledTimes(1)
    expect(warn).toBeCalledWith(
      chalk.bold.yellow(DiscordCommandInteractionResponse.NoOwner)
    )
    expect(argsMock.getUser).toBeCalled()
    expect(argsMock.getUser).toBeCalledWith("member")
    expect(cacheGet).toBeCalledTimes(2)
    expect(cacheGet).toBeCalledWith(USER_TO_BAN_ID)
    expect(cacheGet).toBeCalledWith(MESSAGE_AUTHOR_ID)
    expect(messageMock.guild?.fetchOwner).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(
      DiscordCommandInteractionResponse.NoOwner
    )
  })

  describe("Check user permissions", () => {
    it("should warn and return message if target is owner", async () => {
      const botMock = {} as DiscordBot
      const messageMock = {
        user: {
          id: MESSAGE_AUTHOR_ID,
        },
        reply: jest.fn(),
        guild: {
          fetchOwner: jest.fn().mockResolvedValue({
            id: GUILD_OWNER_ID,
          } as Discord.GuildMember),
          members: {
            cache: new Discord.Collection<
              Discord.Snowflake,
              Discord.GuildMember
            >([
              [GUILD_OWNER_ID, { id: GUILD_OWNER_ID } as Discord.GuildMember],
              [
                MESSAGE_AUTHOR_ID,
                { id: MESSAGE_AUTHOR_ID } as Discord.GuildMember,
              ],
            ]),
          },
        } as unknown as Discord.Guild,
      } as unknown as Discord.ChatInputCommandInteraction

      const argsMock = {
        getUser: jest
          .fn()
          .mockReturnValue({ id: GUILD_OWNER_ID } as Discord.User),
      } as unknown as Discord.ChatInputCommandInteraction["options"]
      const warn = jest.spyOn(console, "warn")

      const cacheGet = jest.spyOn(
        messageMock.guild?.members.cache as unknown as Discord.Collection<
          Discord.Snowflake,
          Discord.GuildMember
        >,
        "get"
      )

      await BanCommandInstance.run(botMock, messageMock, argsMock)
      expect(warn).toBeCalledTimes(1)
      expect(warn).toBeCalledWith(
        chalk.bold.yellow(BanInteractionResponse.OwernBan)
      )
      expect(argsMock.getUser).toBeCalled()
      expect(argsMock.getUser).toBeCalledWith("member")
      expect(cacheGet).toBeCalledTimes(2)
      expect(cacheGet).toBeCalledWith(GUILD_OWNER_ID)
      expect(cacheGet).toBeCalledWith(MESSAGE_AUTHOR_ID)
      expect(messageMock.guild?.fetchOwner).toBeCalledTimes(1)
      expect(messageMock.reply).toBeCalledTimes(1)
      expect(messageMock.reply).toBeCalledWith(BanInteractionResponse.OwernBan)
    })

    it("should warn and return message if member is not bannable", async () => {
      const botMock = {} as DiscordBot
      const messageMock = {
        user: {
          id: MESSAGE_AUTHOR_ID,
        },
        reply: jest.fn(),
        guild: {
          fetchOwner: jest.fn().mockResolvedValue({
            id: GUILD_OWNER_ID,
          } as Discord.GuildMember),
          members: {
            cache: new Discord.Collection<
              Discord.Snowflake,
              Discord.GuildMember
            >([
              [
                USER_TO_BAN_ID,
                { id: USER_TO_BAN_ID, bannable: false } as Discord.GuildMember,
              ],
              [
                MESSAGE_AUTHOR_ID,
                { id: MESSAGE_AUTHOR_ID } as Discord.GuildMember,
              ],
            ]),
          },
        } as unknown as Discord.Guild,
      } as unknown as Discord.ChatInputCommandInteraction

      const argsMock = {
        getUser: jest
          .fn()
          .mockReturnValue({ id: USER_TO_BAN_ID } as Discord.User),
      } as unknown as Discord.ChatInputCommandInteraction["options"]
      const warn = jest.spyOn(console, "warn")

      const cacheGet = jest.spyOn(
        messageMock.guild?.members.cache as unknown as Discord.Collection<
          Discord.Snowflake,
          Discord.GuildMember
        >,
        "get"
      )

      await BanCommandInstance.run(botMock, messageMock, argsMock)
      expect(warn).toBeCalledTimes(1)
      expect(warn).toBeCalledWith(
        chalk.bold.yellow(BanInteractionResponse.Unbanable)
      )
      expect(argsMock.getUser).toBeCalled()
      expect(argsMock.getUser).toBeCalledWith("member")
      expect(cacheGet).toBeCalledTimes(2)
      expect(cacheGet).toBeCalledWith(USER_TO_BAN_ID)
      expect(cacheGet).toBeCalledWith(MESSAGE_AUTHOR_ID)
      expect(messageMock.guild?.fetchOwner).toBeCalledTimes(1)
      expect(messageMock.reply).toBeCalledTimes(1)
      expect(messageMock.reply).toBeCalledWith(BanInteractionResponse.Unbanable)
    })

    it("Should warn and return message if user tries to ban hiself", async () => {
      const botMock = {} as DiscordBot
      const messageMock = {
        user: {
          id: MESSAGE_AUTHOR_ID,
        },
        reply: jest.fn(),
        guild: {
          fetchOwner: jest.fn().mockResolvedValue({
            id: GUILD_OWNER_ID,
          } as Discord.GuildMember),
          members: {
            cache: new Discord.Collection<
              Discord.Snowflake,
              Discord.GuildMember
            >([
              [
                MESSAGE_AUTHOR_ID,
                {
                  id: MESSAGE_AUTHOR_ID,
                  bannable: true,
                } as Discord.GuildMember,
              ],
            ]),
          },
        } as unknown as Discord.Guild,
      } as unknown as Discord.ChatInputCommandInteraction

      const argsMock = {
        getUser: jest
          .fn()
          .mockReturnValue({ id: MESSAGE_AUTHOR_ID } as Discord.User),
      } as unknown as Discord.ChatInputCommandInteraction["options"]
      const warn = jest.spyOn(console, "warn")

      const cacheGet = jest.spyOn(
        messageMock.guild?.members.cache as unknown as Discord.Collection<
          Discord.Snowflake,
          Discord.GuildMember
        >,
        "get"
      )

      await BanCommandInstance.run(botMock, messageMock, argsMock)
      expect(warn).toBeCalledTimes(1)
      expect(warn).toBeCalledWith(
        chalk.bold.yellow(BanInteractionResponse.SelfBan)
      )
      expect(argsMock.getUser).toBeCalled()
      expect(argsMock.getUser).toBeCalledWith("member")
      expect(cacheGet).toBeCalledTimes(2)
      expect(cacheGet).toBeCalledWith(MESSAGE_AUTHOR_ID)
      expect(cacheGet).toBeCalledWith(MESSAGE_AUTHOR_ID)
      expect(messageMock.guild?.fetchOwner).toBeCalledTimes(1)
      expect(messageMock.reply).toBeCalledTimes(1)
      expect(messageMock.reply).toBeCalledWith(BanInteractionResponse.SelfBan)
    })

    it("Should warn and return message if target has a higher role", async () => {
      const botMock = {} as DiscordBot
      const messageMock = {
        user: {
          id: MESSAGE_AUTHOR_ID,
        },
        reply: jest.fn(),
        guild: {
          fetchOwner: jest.fn().mockResolvedValue({
            id: GUILD_OWNER_ID,
          } as Discord.GuildMember),
          members: {
            cache: new Discord.Collection<
              Discord.Snowflake,
              Discord.GuildMember
            >([
              [
                USER_TO_BAN_ID,
                {
                  id: USER_TO_BAN_ID,
                  bannable: true,
                  roles: {
                    highest: {
                      position: 2,
                    },
                  },
                } as Discord.GuildMember,
              ],
              [
                MESSAGE_AUTHOR_ID,
                {
                  id: MESSAGE_AUTHOR_ID,
                  roles: {
                    highest: {
                      position: 1,
                    },
                  },
                } as Discord.GuildMember,
              ],
            ]),
          },
        } as unknown as Discord.Guild,
      } as unknown as Discord.ChatInputCommandInteraction

      const argsMock = {
        getUser: jest
          .fn()
          .mockReturnValue({ id: USER_TO_BAN_ID } as Discord.User),
      } as unknown as Discord.ChatInputCommandInteraction["options"]
      const warn = jest.spyOn(console, "warn")

      const cacheGet = jest.spyOn(
        messageMock.guild?.members.cache as unknown as Discord.Collection<
          Discord.Snowflake,
          Discord.GuildMember
        >,
        "get"
      )

      await BanCommandInstance.run(botMock, messageMock, argsMock)
      expect(warn).toBeCalledTimes(1)
      expect(warn).toBeCalledWith(
        chalk.bold.yellow(BanInteractionResponse.HigherBan)
      )
      expect(argsMock.getUser).toBeCalled()
      expect(argsMock.getUser).toBeCalledWith("member")
      expect(cacheGet).toBeCalledTimes(2)
      expect(cacheGet).toBeCalledWith(USER_TO_BAN_ID)
      expect(cacheGet).toBeCalledWith(MESSAGE_AUTHOR_ID)
      expect(messageMock.guild?.fetchOwner).toBeCalledTimes(1)
      expect(messageMock.reply).toBeCalledTimes(1)
      expect(messageMock.reply).toBeCalledWith(BanInteractionResponse.HigherBan)
    })
  })

  it("it should warn and return a message if no bans list was found", async () => {
    const botMock = {} as DiscordBot
    const messageMock = {
      user: {
        id: MESSAGE_AUTHOR_ID,
      },
      reply: jest.fn(),
      guild: {
        bans: {
          fetch: jest.fn().mockResolvedValue(undefined),
        } as unknown as Discord.GuildBanManager,
        fetchOwner: jest.fn().mockResolvedValue({
          id: GUILD_OWNER_ID,
        } as Discord.GuildMember),
        members: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.GuildMember>(
            [
              [
                USER_TO_BAN_ID,
                {
                  id: USER_TO_BAN_ID,
                  bannable: true,
                  roles: {
                    highest: {
                      position: 2,
                    },
                  },
                } as Discord.GuildMember,
              ],
              [
                MESSAGE_AUTHOR_ID,
                {
                  id: MESSAGE_AUTHOR_ID,
                  roles: {
                    highest: {
                      position: 3,
                    },
                  },
                } as Discord.GuildMember,
              ],
            ]
          ),
        },
      } as unknown as Discord.Guild,
    } as unknown as Discord.ChatInputCommandInteraction

    const argsMock = {
      getUser: jest
        .fn()
        .mockReturnValue({ id: USER_TO_BAN_ID } as Discord.User),
    } as unknown as Discord.ChatInputCommandInteraction["options"]
    const warn = jest.spyOn(console, "warn")

    const cacheGet = jest.spyOn(
      messageMock.guild?.members.cache as unknown as Discord.Collection<
        Discord.Snowflake,
        Discord.GuildMember
      >,
      "get"
    )

    await BanCommandInstance.run(botMock, messageMock, argsMock)
    expect(warn).toBeCalledTimes(1)
    expect(warn).toBeCalledWith(
      chalk.bold.yellow(BanInteractionResponse.NoBanList)
    )
    expect(argsMock.getUser).toBeCalled()
    expect(argsMock.getUser).toBeCalledWith("member")
    expect(cacheGet).toBeCalledTimes(2)
    expect(cacheGet).toBeCalledWith(USER_TO_BAN_ID)
    expect(cacheGet).toBeCalledWith(MESSAGE_AUTHOR_ID)
    expect(messageMock.guild?.fetchOwner).toBeCalledTimes(1)
    expect(messageMock.guild?.bans.fetch).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(BanInteractionResponse.NoBanList)
  })

  it("Should warn and return a message if target is already banned", async () => {
    const botMock = {} as DiscordBot
    const messageMock = {
      user: {
        id: MESSAGE_AUTHOR_ID,
      },
      reply: jest.fn(),
      guild: {
        bans: {
          fetch: jest
            .fn()
            .mockResolvedValue(
              new Discord.Collection<Discord.Snowflake, Discord.GuildBan>([
                [USER_TO_BAN_ID, {} as Discord.GuildBan],
              ])
            ),
          get: jest.fn().mockReturnValue({
            user: {
              id: USER_TO_BAN_ID,
            } as Discord.User,
          } as unknown as Discord.GuildBan),
        } as unknown as Discord.GuildBanManager,
        fetchOwner: jest.fn().mockResolvedValue({
          id: GUILD_OWNER_ID,
        } as Discord.GuildMember),
        members: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.GuildMember>(
            [
              [
                USER_TO_BAN_ID,
                {
                  id: USER_TO_BAN_ID,
                  bannable: true,
                  roles: {
                    highest: {
                      position: 2,
                    },
                  },
                } as Discord.GuildMember,
              ],
              [
                MESSAGE_AUTHOR_ID,
                {
                  id: MESSAGE_AUTHOR_ID,
                  roles: {
                    highest: {
                      position: 3,
                    },
                  },
                } as Discord.GuildMember,
              ],
            ]
          ),
        },
      } as unknown as Discord.Guild,
    } as unknown as Discord.ChatInputCommandInteraction

    const argsMock = {
      getUser: jest
        .fn()
        .mockReturnValue({ id: USER_TO_BAN_ID } as Discord.User),
    } as unknown as Discord.ChatInputCommandInteraction["options"]
    const warn = jest.spyOn(console, "warn")

    const cacheGet = jest.spyOn(
      messageMock.guild?.members.cache as unknown as Discord.Collection<
        Discord.Snowflake,
        Discord.GuildMember
      >,
      "get"
    )

    await BanCommandInstance.run(botMock, messageMock, argsMock)
    expect(warn).toBeCalledTimes(1)
    expect(warn).toBeCalledWith(
      chalk.bold.yellow(BanInteractionResponse.AlreadyBan)
    )
    expect(argsMock.getUser).toBeCalled()
    expect(argsMock.getUser).toBeCalledWith("member")
    expect(cacheGet).toBeCalledTimes(2)
    expect(cacheGet).toBeCalledWith(USER_TO_BAN_ID)
    expect(cacheGet).toBeCalledWith(MESSAGE_AUTHOR_ID)
    expect(messageMock.guild?.fetchOwner).toBeCalledTimes(1)
    expect(messageMock.guild?.bans.fetch).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(BanInteractionResponse.AlreadyBan)
  })

  it("Should ban the target user", async () => {
    const botMock = {} as DiscordBot
    const messageMock = {
      user: {
        id: MESSAGE_AUTHOR_ID,
      },
      reply: jest.fn(),
      guild: {
        bans: {
          fetch: jest
            .fn()
            .mockResolvedValue(
              new Discord.Collection<Discord.Snowflake, Discord.GuildBan>([])
            ),
          get: jest.fn().mockReturnValue(undefined),
          create: jest.fn(),
        } as unknown as Discord.GuildBanManager,
        fetchOwner: jest.fn().mockResolvedValue({
          id: GUILD_OWNER_ID,
        } as Discord.GuildMember),
        members: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.GuildMember>(
            [
              [
                USER_TO_BAN_ID,
                {
                  id: USER_TO_BAN_ID,
                  bannable: true,
                  user: {
                    tag: "UserToBan#1234",
                  },
                  roles: {
                    highest: {
                      position: 2,
                    },
                  },
                } as Discord.GuildMember,
              ],
              [
                MESSAGE_AUTHOR_ID,
                {
                  id: MESSAGE_AUTHOR_ID,
                  user: {
                    tag: "test#1234",
                  },
                  roles: {
                    highest: {
                      position: 3,
                    },
                  },
                } as Discord.GuildMember,
              ],
            ]
          ),
        },
      } as unknown as Discord.Guild,
    } as unknown as Discord.ChatInputCommandInteraction

    const argsMock = {
      get: jest.fn().mockReturnValue({
        value: "Provided reason",
      }),
      getUser: jest.fn().mockReturnValue({
        id: USER_TO_BAN_ID,
        tag: "UserToBan#1234",
        send: jest.fn(),
      } as unknown as Discord.User),
    } as unknown as Discord.ChatInputCommandInteraction["options"]

    const cacheGet = jest.spyOn(
      messageMock.guild?.members.cache as unknown as Discord.Collection<
        Discord.Snowflake,
        Discord.GuildMember
      >,
      "get"
    )

    const result = await BanCommandInstance.run(botMock, messageMock, argsMock)

    expect(argsMock.getUser).toBeCalled()
    expect(argsMock.getUser).toBeCalledWith("member")
    expect(cacheGet).toBeCalledTimes(2)
    expect(cacheGet).toBeCalledWith(USER_TO_BAN_ID)
    expect(cacheGet).toBeCalledWith(MESSAGE_AUTHOR_ID)
    expect(messageMock.guild?.fetchOwner).toBeCalledTimes(1)
    expect(messageMock.guild?.bans.fetch).toBeCalledTimes(1)
    // expect(messageMock.guild?.bans.create).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(result).toBe(undefined)
  })

  it("Should return an error when trying to ban", async () => {
    const botMock = {} as DiscordBot
    const messageMock = {
      user: {
        id: MESSAGE_AUTHOR_ID,
      },
      reply: jest.fn(),
      guild: {
        bans: {
          fetch: jest
            .fn()
            .mockResolvedValue(
              new Discord.Collection<Discord.Snowflake, Discord.GuildBan>([])
            ),
          get: jest.fn().mockReturnValue(undefined),
          create: jest.fn(),
        } as unknown as Discord.GuildBanManager,
        fetchOwner: jest.fn().mockResolvedValue({
          id: GUILD_OWNER_ID,
        } as Discord.GuildMember),
        members: {
          cache: new Discord.Collection<Discord.Snowflake, Discord.GuildMember>(
            [
              [
                USER_TO_BAN_ID,
                {
                  id: USER_TO_BAN_ID,
                  bannable: true,
                  user: {
                    tag: undefined,
                  } as unknown as Discord.User,
                  roles: {
                    highest: {
                      position: 2,
                    },
                  },
                } as Discord.GuildMember,
              ],
              [
                MESSAGE_AUTHOR_ID,
                {
                  id: MESSAGE_AUTHOR_ID,
                  user: {
                    tag: undefined,
                  } as unknown as Discord.User,
                  roles: {
                    highest: {
                      position: 3,
                    },
                  },
                } as Discord.GuildMember,
              ],
            ]
          ),
        },
      } as unknown as Discord.Guild,
    } as unknown as Discord.ChatInputCommandInteraction

    const argsMock = {
      get: jest.fn().mockReturnValue({
        value: "Provided reason",
      }),
      getUser: jest.fn().mockReturnValue({
        id: USER_TO_BAN_ID,
        tag: undefined,
        send: jest.fn(() => {
          throw new Error(ERROR_MESSAGE)
        }),
      } as unknown as Discord.User),
    } as unknown as Discord.ChatInputCommandInteraction["options"]

    const cacheGet = jest.spyOn(
      messageMock.guild?.members.cache as unknown as Discord.Collection<
        Discord.Snowflake,
        Discord.GuildMember
      >,
      "get"
    )
    const error = jest.spyOn(console, "error")

    await BanCommandInstance.run(botMock, messageMock, argsMock)

    expect(argsMock.getUser).toBeCalled()
    expect(argsMock.getUser).toBeCalledWith("member")
    expect(cacheGet).toBeCalledTimes(2)
    expect(cacheGet).toBeCalledWith(USER_TO_BAN_ID)
    expect(cacheGet).toBeCalledWith(MESSAGE_AUTHOR_ID)
    expect(messageMock.guild?.fetchOwner).toBeCalledTimes(1)
    expect(messageMock.guild?.bans.fetch).toBeCalledTimes(1)
    expect(error).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledTimes(1)
    expect(messageMock.reply).toBeCalledWith(
      DiscordCommandInteractionResponse.Unknown
    )
  })
})
