import fs from "fs/promises"
import path from "path"

import { DiscordBot } from "../types"

const eventsDir = path.join(__dirname, "../events")

export default async function loader(bot: DiscordBot): Promise<void> {
  ;(await fs.readdir(eventsDir))
    .filter((file) => file.endsWith(".ts"))
    .forEach(async (file) => {
      if (file === "index.ts") return
      const event = (await import(`${eventsDir}/${file}`)).default
      bot.on(event.name, event.bind(null, bot))
    })
}
