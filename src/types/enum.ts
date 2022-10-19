export enum DiscordCommandInteractionResponse {
  NoGuild = "No guild found",
  NoOwner = "No owner found !",
  NoAuthor = "No author found !",
  Unknown = "Something went wrong !",
  NoVoiceChannel = "No voice channel found !",
  NoMainChannel = "No main channel found !",
}

export enum DiscordMusicCommandInteractionResponse {
  NotInVoiceChannel = "You must be in a voice channel to use music commands !",
  NotInMusicChannel = "You must be in the `Music` voice channel to use music commands !",
  NoPlayer = "There is no music player available !",
  PlayerNotConnected = "Player is not connected to the music voice channel !",
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
  Dj = "Dj",
}

export enum DiscordCommandOptionType {
  String = "string",
  User = "user",
  Boolean = "boolean",
}
