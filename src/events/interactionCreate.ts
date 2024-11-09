import {
  Interaction,
  Events
} from "discord.js";
import { RuviaInteractionExecutor } from "../lib/RuviaInteractionExecutor.ts";

const event = {
  type: Events.InteractionCreate,
  execute: async (interaction: Interaction) => {
   await RuviaInteractionExecutor(interaction)
  }
};

export default event;
