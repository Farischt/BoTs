import Discord from "discord.js"
import { DiscordBot, DiscordMemberRole, DiscordWebHookName } from "../types"
import { MAIN_TEXT_CHANNEL_ID } from "../config.json"
import { Logger } from "../utils"

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

  const { user, guild } = newMember

  const welcomeEmbed = new Discord.EmbedBuilder()
    .setColor("Aqua")
    .setAuthor({ name: user.tag, iconURL: user.avatarURL() ?? undefined })
    .setDescription(
      `Welcome to ${newMember.user.tag} to **${guild.name}** ! \n
      Member count : **${guild.memberCount}**
    `
    )
    .setTimestamp()
    .setFooter({ text: `ID: ${user.id}` })

  await newMember.roles.add(defaultRole)

  const Welcomer = bot.webhooks.get(DiscordWebHookName.Welcomer)
  if (!Welcomer) return
  await Welcomer.send({ embeds: [welcomeEmbed] })

  Logger.info(
    `New member ${newMember.user.tag} joined the server and has been assigned the role ${defaultRole.name}.`
  )
}
