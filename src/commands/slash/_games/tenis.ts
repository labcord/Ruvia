import { SlashCommandBuilder } from "discord.js";
import type { SlashCommand } from "ruvia/types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("tenis")
    .setDescription("Tenis!!"),
  execute: async (interaction, options: any) => {

    interaction.reply("🎾 Do you like the splitted layout system?")
  },
  cooldown: 5,
};

export default command;