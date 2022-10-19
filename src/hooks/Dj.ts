import Discord from "discord.js"
import { WEBHOOKS } from "../config.json"

export default new Discord.WebhookClient({
  id: WEBHOOKS.DJ.ID,
  token: WEBHOOKS.DJ.TOKEN,
})
