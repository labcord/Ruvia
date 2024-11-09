import { Events, Client } from "discord.js";
import { RuviaRegistersCommands } from "../lib/RuviaRegisterCommand.ts";

const event = {
  type: Events.ClientReady,
  execute: async (client: Client) => {
    await RuviaRegistersCommands(client)
  }
};

export default event;