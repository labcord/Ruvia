import { ChatInputCommandInteraction } from "discord.js";

export default async function SlashCommandsLayout(
  interaction: ChatInputCommandInteraction
) {
  if (interaction.channel?.isSendable())
    interaction.channel.send("I love Ruvia and games!!");
}
