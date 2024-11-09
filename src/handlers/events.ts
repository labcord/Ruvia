import { Client } from "discord.js";
import { readdirSync } from "node:fs";
import { RuviaEvent } from "../types.d.ts";
import { join } from "node:path";
import { isAsyncFunction } from "../lib/ruviaUtils.ts";
import { styles } from "../../styles.ts";
import chalk from "chalk"

export default async function handle(client: Client) {
  let eventsDir = join(import.meta.dirname as string, "../events");

  readdirSync(eventsDir).forEach(async (file) => {
    if (!file.endsWith(".ts")) return;

    let event: RuviaEvent = (await import(`../events/${file}`)).default;

    if (!event.type) {
      throw new Error(
        `❌ | The type of the event in ${eventsDir}/${file} is not specified.`
      );
    }

    event.once
      ? isAsyncFunction(event.execute)
        ? client.once(
            event.type as string,
            async (...args) => await event.execute(...args)
          )
        : client.once(event.type as string, (...args) => event.execute(...args))
      : isAsyncFunction(event.execute)
      ? client.on(
          event.type as string,
          async (...args) => await event.execute(...args)
        )
      : client.on(event.type as string, (...args) => event.execute(...args));

    console.log(
        styles.spaces() + chalk.green(`✔️  | ${event.type} event loaded successfully.`)
    )  
  });
}
