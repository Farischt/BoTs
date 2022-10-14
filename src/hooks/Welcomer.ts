import Discord from "discord.js"
import { WEBHOOKS } from "../config.json"

export default new Discord.WebhookClient({
  id: WEBHOOKS.WELCOMER.ID,
  token: WEBHOOKS.WELCOMER.TOKEN,
})
