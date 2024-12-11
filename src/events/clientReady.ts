import { Events, Client } from "discord.js";
import { registerCommands } from "ruvia";

const event = {
  type: Events.ClientReady,
  execute: async (client: Client) => {
    await registerCommands(client);
  },
};

export default event;
