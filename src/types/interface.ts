import Discord from "discord.js"
import { Node } from "lavaclient"
import { DiscordCommandDocument } from "./"
import { DiscordCommandOptionType } from "./enum"

export interface DiscordBot extends Discord.Client {
  commands: Discord.Collection<string, DiscordCommandDocument>
  webhooks: Discord.Collection<string, Discord.WebhookClient>
  music: Node
}

export interface DiscordCommandOptionChoice {
  name: string
  value: string
}

export type DiscordCommandOptionChoices = DiscordCommandOptionChoice[]

export interface DiscordCommandOption {
  type: DiscordCommandOptionType
  name: string
  description: string
  required: boolean
  choices?: DiscordCommandOptionChoices
}

export type DiscordCommandOptions = DiscordCommandOption[]

export interface DiscordCommandData {
  name: string
  description: string
  dmPermission: boolean
  defaultMemberPermission: Discord.PermissionResolvable | null
  options?: DiscordCommandOptions
}
