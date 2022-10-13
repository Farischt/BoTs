import Discord from "discord.js"
import chalk from "chalk"
import { DiscordBot, DiscordMemberRole } from "../types"
import { MAIN_TEXT_CHANNEL_ID, WEBHOOKS } from "../config.json"

export async function runWebHook(embed: Discord.EmbedBuilder): Promise<void> {
  const Welcomer = new Discord.WebhookClient({
    id: WEBHOOKS.WELCOMER.ID,
    token: WEBHOOKS.WELCOMER.TOKEN,
  })
  await Welcomer.send({ embeds: [embed] })
}

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

  // TODO : prevent the following to be called during tests
  if (process.env.NODE_ENV !== "test") {
    await runWebHook(welcomeEmbed)
  }
  console.log(
    chalk.green(
      `New member ${newMember.user.tag} joined the server and has been assigned the role ${defaultRole.name}.`
    )
  )
}
