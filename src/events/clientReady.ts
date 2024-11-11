import { Events, Client } from "discord.js";
import registerCommands from "@/ruvia/registerCommand.ts";

const event = {
  type: Events.ClientReady,
  execute: async (client: Client) => {
    await registerCommands(client)
  }
};

export default event;