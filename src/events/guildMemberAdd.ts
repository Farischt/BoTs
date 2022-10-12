import Discord from "discord.js"
import chalk from "chalk"
import { DiscordBot, DiscordMemberRole } from "../types"
import { MAIN_TEXT_CHANNEL_ID } from "../config.json"

// TODO : Find a way to send a message to the user when he joins the server
export default async function guildMemberAdd(
  bot: DiscordBot,
  newMember: Discord.GuildMember
): Promise<void> {
  const textChannel = newMember.guild.channels.cache.get(MAIN_TEXT_CHANNEL_ID)
  if (!textChannel) return
  const defaultRole = newMember.guild.roles.cache.find(
    (role) => role.name === DiscordMemberRole.Default
  )
  if (!defaultRole) return
  await newMember.roles.add(defaultRole)
  console.log(
    chalk.green(
      `New member ${newMember.user.tag} joined the server and has been assigned the role ${defaultRole.name}.`
    )
  )
}
