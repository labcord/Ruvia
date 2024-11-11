import { cacheMessages } from "@/ruvia/cache/cache.ts"
import { Client, Message } from "discord.js";

const mode = Deno.env.get("mode");

export default async function handle(client: Client) {
    cacheMessages.on("expired", (key: string, value: Message) => {

    if (value.type == "defer") {
      if (mode == "dev")
        throw new Error(
          "❌ | Message timing time exceeded 1 minute and was removed from the cache. Please reduce your processing time to make your app work better."
        );
    }

  });
  
}
