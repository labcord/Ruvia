import {
  Interaction,
  Events
} from "discord.js";
import interactionExecutor from "@/ruvia/interactionExecutor.ts";

const event = {
  type: Events.InteractionCreate,
  execute: async (interaction: Interaction) => {
   await interactionExecutor(interaction)
  }
};

export default event;
