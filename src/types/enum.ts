export enum DiscordCommandInteractionResponse {
  NoGuild = "No guild found",
  NoOwner = "No owner found !",
  NoAuthor = "No author found !",
  Unknown = "Something went wrong !",
  NoVoiceChannel = "No voice channel found !",
  NoMainChannel = "No main channel found !",
}

export enum DiscordMemberRole {
  Owner = "@owner",
  Admin = "@admin",
  Moderator = "@moderator",
  User = "@user",
  Default = "@user",
}

export enum DiscordWebHookName {
  Welcomer = "Welcomer",
}

export enum DiscordCommandOptionType {
  String = "string",
  User = "user",
  Boolean = "boolean",
}
