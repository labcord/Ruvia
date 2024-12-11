import { Client } from "discord.js";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { isAsyncFunction } from "ruvia";
import { styles } from "ruvia/style";
import chalk from "chalk";

export default async function handle(client: Client) {
  let eventsDir = join(Deno.cwd() as string, "./src/events");

  readdirSync(eventsDir).forEach(async (file) => {
    if (!file.endsWith(".ts")) return;

    let event: {
      once?: boolean;
      type: string;
      execute: (...params: any) => void;
    } = (await import(`@/src/events/${file}`)).default;

    if (!event.type) {
      throw new Error(
        `❌ | The type of the event in ${eventsDir}/${file} is not specified.`
      );
    }

    event.once
      ? isAsyncFunction(event.execute)
        ? client.once(
            event.type,
            async (...args) => await event.execute(...args)
          )
        : client.once(event.type, (...args) => event.execute(...args))
      : isAsyncFunction(event.execute)
      ? client.on(
          event.type,
          async (...args) => await event.execute(...args)
        )
      : client.on(event.type, (...args) => event.execute(...args));

    console.log(
      styles.spaces() +
        chalk.green(`✔️  | ${event.type} event loaded successfully.`)
    );
  });
}
