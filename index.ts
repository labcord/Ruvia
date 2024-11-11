import chalk from "chalk";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import { styles } from "./styles.ts";
import "jsr:@std/dotenv/load";
import RuviaConfig from "rConfig"

if(RuviaConfig == null){
  throw new Error("❌ | A null export cannot be made in ruvia.config.ts.")
}

const {
  Guilds,
  MessageContent,
  GuildMessages,
  GuildMembers,
  GuildVoiceStates,
  GuildMessageReactions,
  GuildEmojisAndStickers,
} = GatewayIntentBits;
const client = new Client({
  intents: [
    Guilds,
    MessageContent,
    GuildMessages,
    GuildMembers,
    GuildVoiceStates,
    GuildMessageReactions,
    GuildEmojisAndStickers,
  ],
});

console.log(
  chalk.gray(styles.ruvia),
  chalk.yellow("🟡 | Launching your bot...")
);

import { readdirSync } from "node:fs";

client.commands = {
  slash: new Collection(),
  message: new Collection(),
  button: new Map(),
  reaction: new Map(),
  context: new Map(),
  selectmenu: new Map(),
};

client.modals = new Map();
client.cooldown = new Collection();

try {
  readdirSync("./src/handlers").forEach(async (handler) => {
    const handle = (await import(`@/src/handlers/${handler}`)).default;
    await handle(client).then(() => {
      console.log(
        chalk.green(
          styles.spaces() +
            `✔️  | The "${handler.slice(0, -3)}" handle loaded successfully.`
        )
      );
    });
  });
} catch (err) {
  throw new Error(
    chalk.red(styles.spaces() + "❌ | There was a problem loading handlers.") +
      "\n" +
      err
  );
}

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

client
  .login(Deno.env.get("TOKEN"))
  .catch((err) => {
    throw new Error(err);
  })
  .then(() => {
    console.log(
      chalk.green(styles.spaces() + `✔️  | Bot started successfully.`)
    );
  });
