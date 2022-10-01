import Discord from "discord.js"

// Changes todo here
// Make all "Commands" as Slach commands even those with no slash

export interface DiscordCommand
  extends Omit<Discord.SlashCommandBuilder, "options"> {
  options?: Discord.SlashCommandStringOption[]
  run: (
    bot: DiscordBot,
    message?: Discord.Message | Discord.ChatInputCommandInteraction,
    args?: Discord.SlashCommandStringOption[] | string[]
  ) => Promise<void>
}

export interface DiscordBot extends Discord.Client {
  commands: Discord.Collection<string, DiscordCommand>
}
