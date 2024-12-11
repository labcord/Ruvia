import { Interaction, Events } from "discord.js";
import { interactionExecutor } from "ruvia";

const event = {
  type: Events.InteractionCreate,
  execute: async (interaction: Interaction) => {
    await interactionExecutor(interaction);
  },
};

export default event;
