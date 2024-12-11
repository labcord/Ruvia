import {
  Message,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle, ModalBuilder
} from "discord.js";
import RuviaConfig from "ruvia/config";

export async function showModal(msg: Message, command: string, modal: ModalBuilder) {
  msg.client.modals.set(command, modal)

  const openModalButton = new ButtonBuilder()
    .setLabel(
      RuviaConfig.messageCommands?.options?.openModalMessage || "Open Modal ➔"
    )
    .setStyle(
      RuviaConfig.messageCommands?.options?.openModalStyle as unknown as ButtonStyle || ButtonStyle.Primary
    )
    .setCustomId(`rM${command}`);

  msg.reply({
    components: [
        new ActionRowBuilder()
        .setComponents(openModalButton)
    // deno-lint-ignore no-explicit-any
    ] as any,
  });
}
