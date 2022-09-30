import Discord from "discord.js"

export interface DiscordCompleteClient extends Discord.Client {
  commands: Discord.Collection<string, Command>
}

export interface Command {
  name: string
  run: (
    bot: DiscordCompleteClient,
    message: Discord.Message<boolean>,
    args: string[]
  ) => void
}
