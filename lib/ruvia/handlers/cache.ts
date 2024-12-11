import { buttonInteractionCache, messageCache } from "../cache/cache.ts";
import { Client, Message, ButtonBuilder, ActionRowBuilder } from "discord.js";
import { Button } from "../classes/button.ts";

export default async function handle(client: Client) {
  messageCache.on("expired", (key: string, value: Message) => {
    if (value.type == "defer") {
      throw new Error(
        "❌ | Message timing time exceeded 1 minute and was removed from the cache. Please reduce your processing time to make your app work better."
      );
    }
  });

  buttonInteractionCache.on(
    "expired",
    (
      key: string,
      value: { messageId: string; channelId: string; component: Button }
    ) => {
      const channel = client.channels.cache.get(value.channelId);
      if (!channel?.isTextBased()) return;
      const message = channel.messages.cache.get(value.messageId);
      const components = message?.components.flatMap(
        (actionrow) => actionrow?.components
      );
      if (!components) return;
      const expiredButton = components.find(
        (component: any) =>
          component.componentType != 5 &&
          component.customId == value.component.data?.custom_id
      );

      const actionRow = new ActionRowBuilder();
      actionRow.setComponents(
        components.map((component) =>
          component.customId == expiredButton?.customId
            ? value.component.cache?.onClose
              ? value.component.cache?.onClose()
              : new ButtonBuilder({
                  ...value.component.data,
                  label: value.component.cache?.expiredMessage,
                  disabled: true,
                })
            : component
        )
      );

      message?.edit({
        components: [actionRow],
      });

      console.log(
        components.map((component) =>
          component.customId == expiredButton?.customId
            ? value.component.cache?.onClose
              ? value.component.cache?.onClose()
              : new ButtonBuilder({
                  ...value.component.data,
                  label: value.component.cache?.expiredMessage,
                  disabled: true,
                })
            : component
        )
      );
    }
  );
}
