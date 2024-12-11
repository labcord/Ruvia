import { SlashCommandBuilder, AttachmentBuilder, ActionRowBuilder, ButtonStyle } from "discord.js";
import type { SlashCommand } from "ruvia/types";
import { Attachment, Button } from "ruvia/classes";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("attachment")
    .setDescription("Image Class Command"),
  execute: async (interaction, options: any) => {

    const img = new Attachment("/assets/labcordLogo.png") as unknown as AttachmentBuilder
    
    const actions = new ActionRowBuilder()
    .setComponents(
      new Button()
      .setCustomId("image")
      .setLabel("Button")
      .setStyle(ButtonStyle.Danger)
      .setCache({ time: 2000, expiredMessage: "This button is out of time!" })
    )

    interaction.reply({ 
      content: "Image",
      files: [img],
      components: [actions]
    });
  },
  cooldown: 5,
};

export default command;
