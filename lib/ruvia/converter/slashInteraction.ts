import {
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  Client,
} from "discord.js";
import { Button } from "../classes/button.ts";
import { buttonInteractionCache } from "../cache/cache.ts";

export default function convertSlashInteraction(
  interaction: ChatInputCommandInteraction
) {
  const extendedReply = interaction.reply.bind(interaction);

  interaction.reply = async (
    options: InteractionReplyOptions & { fetchReply: true }
  ): Promise<any> => {
    await extendedReply(options).then(async (message) => {
      const ruviaComponents = options.components
      ?.flatMap((actionrow) => actionrow?.components)
      .filter((components) => components instanceof Button)

      if(!ruviaComponents || ruviaComponents?.length < 1) return

      const replied = (await interaction.fetchReply()).reactions.message

      ruviaComponents
        .forEach((buttonComponent) => {
          buttonInteractionCache.set(replied.id, {
            messageId: replied.id,
            channelId: replied.channelId,
            component: buttonComponent,
          });
        });
    });
  };

  return interaction;
}
