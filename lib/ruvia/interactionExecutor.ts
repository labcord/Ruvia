import {
  Interaction,
  MessageContextMenuCommandInteraction,
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
} from "discord.js";
import RuviaConfig from "ruvia/config";
import { isAsyncFunction, mentionTimestamp } from "ruvia";
import {
  SlashCommand,
  ButtonCommand,
  SelectMenuCommand,
  ContextCommand,
} from "ruvia/types";
import Fuse from "fuse.js";
import convertSlashInteraction from "./converter/slashInteraction.ts";

export default async function interactionExecutor(
  discordInteraction: Interaction
): Promise<void> {
  if (discordInteraction.isChatInputCommand()) {
    const interaction = convertSlashInteraction(
      discordInteraction
    );
    let command: SlashCommand = interaction.client.commands.slash.get(
      discordInteraction.commandName
    ) as SlashCommand;

    const layout: Function | undefined = interaction.client.commands.slash.get(
      `@layout${command.category || ""}`
    ) as Function | undefined;

    if (!command) {
      throw new Error(
        `❌ | The command named ${discordInteraction.commandName} was not found.`
      );
    }

    let cooldown = interaction.client.cooldown.get(
      `${discordInteraction.commandName}-${discordInteraction.user.username}`
    ) as number;

    if (command.cooldown && cooldown) {
      if (Date.now() < cooldown) {
        interaction.reply(
          (RuviaConfig?.cooldown?.warningMessage &&
            RuviaConfig?.cooldown?.warningMessage(cooldown)) ||
            `⏳ **| ${mentionTimestamp(
              new Date(cooldown),
              "R"
            )} the cooldown will end.**`
        );
        setTimeout(
          () => interaction.deleteReply(),
          RuviaConfig.cooldown?.warningMessageDeletionTime ||
            Date.now() + command.cooldown * 1000 - Date.now()
        );
        return;
      }
      discordInteraction.client.cooldown.set(
        `${discordInteraction.commandName}-${discordInteraction.user.username}`,
        Date.now() + command.cooldown * 1000
      );
      setTimeout(() => {
        discordInteraction.client.cooldown.delete(
          `${discordInteraction.commandName}-${discordInteraction.user.username}`
        );
      }, command.cooldown * 1000);
    } else if (command.cooldown && !cooldown) {
      interaction.client.cooldown.set(
        `${interaction.commandName}-${interaction.user.username}`,
        Date.now() + command.cooldown * 1000
      );
    }

    if (layout) {
      if (isAsyncFunction(layout)) {
        layout(interaction).then(() => {
          command.execute(
            interaction,
            (
              interaction.options as unknown as {
                _group: string | null;
                _subcommand: string | null;
                _hoistedOptions: Array<{
                  name: string;
                  type: number;
                  value: string;
                }>;
              }
            )._hoistedOptions.reduce(
              (acc: any[], o: any) => {
                return { ...acc, [o.name]: o.value };
              },
              {
                ...(interaction.options._group
                  ? {
                      group: interaction.options._group,
                      subcommand: interaction.options._subcommand,
                    }
                  : interaction.options._subcommand
                  ? { subcommand: interaction.options._subcommand }
                  : {}),
              }
            )
          );
        });
      } else {
        layout(interaction);

        command.execute(
          interaction,
          (
            interaction.options as unknown as {
              _group: string | null;
              _subcommand: string | null;
              _hoistedOptions: Array<{
                name: string;
                type: number;
                value: string;
              }>;
            }
          )._hoistedOptions.reduce(
            (acc: any[], o: any) => {
              return { ...acc, [o.name]: o.value };
            },
            {
              ...(interaction.options._group
                ? {
                    group: interaction.options._group,
                    subcommand: interaction.options._subcommand,
                  }
                : interaction.options._subcommand
                ? { subcommand: interaction.options._subcommand }
                : {}),
            }
          )
        );
      }
    } else {
      command.execute(
        interaction,
        (
          interaction.options as unknown as {
            _group: string | null;
            _subcommand: string | null;
            _hoistedOptions: Array<{
              name: string;
              type: number;
              value: string;
            }>;
          }
        )._hoistedOptions.reduce(
          (acc: any[], o: any) => {
            return { ...acc, [o.name]: o.value };
          },
          {
            ...(interaction.options._group
              ? {
                  group: interaction.options._group,
                  subcommand: interaction.options._subcommand,
                }
              : interaction.options._subcommand
              ? { subcommand: interaction.options._subcommand }
              : {}),
          }
        )
      );
    }
  }

  if (discordInteraction.isAutocomplete()) {
    let command: SlashCommand = discordInteraction.client.commands.slash.get(
      discordInteraction.commandName
    ) as SlashCommand;

    if (!command) {
      throw new Error(
        `❌ | The command named ${discordInteraction.commandName} was not found.`
      );
    } else if (command && !command.autocomplete) {
      throw new Error(
        `❌ | The command named "${discordInteraction.commandName}" does not have a string array for autocomplete.`
      );
    }

    if (Array.isArray(command.autocomplete)) {
      const fuse = new Fuse(command.autocomplete);

      await discordInteraction.respond(
        fuse
          .search(discordInteraction.options.getFocused())
          .map((item) => ({ name: item.item, value: item.item }))
      );
    } else if (typeof command.autocomplete == "object") {
      const fuse = new Fuse(command.autocomplete.choices, {
        keys: command.autocomplete.keys,
      });

      await discordInteraction.respond(
        fuse
          .search(discordInteraction.options.getFocused())
          .map((item) => ({ name: item.item, value: item.item }))
      );
    } else if (command.autocomplete) {
      command.autocomplete(discordInteraction);
    }
  }

  if (discordInteraction.isButton()) {
    let command: ButtonCommand = discordInteraction.client.commands.button.get(
      discordInteraction.customId
    ) as ButtonCommand;

    if (!command) {
      throw new Error(
        `❌ | The command with custom id "${discordInteraction.customId}" does not have a string set for autocomplete.`
      );
    }

    command.execute(discordInteraction);
  }

  if (discordInteraction.isAnySelectMenu()) {
    let command: SelectMenuCommand =
      discordInteraction.client.commands.selectmenu.get(
        discordInteraction.customId
      ) as SelectMenuCommand;

    if (!command) {
      throw new Error(
        `❌ | The command with custom id "${discordInteraction.customId}" does not have a string set for autocomplete.`
      );
    }

    command.execute(discordInteraction);
  }

  if (discordInteraction.isContextMenuCommand()) {
    let command: ContextCommand =
      discordInteraction.client.commands.context.get(
        discordInteraction.commandName
      ) as ContextCommand;

    if (!command) {
      throw new Error(
        `❌ | The command named ${discordInteraction.commandName} was not found.`
      );
    }

    command.execute(
      discordInteraction as unknown as ContextCommand["command"]["type"] extends ApplicationCommandType.Message
        ? MessageContextMenuCommandInteraction
        : UserContextMenuCommandInteraction
    );
  }

  if (discordInteraction.isModalSubmit()) {
    let command: SlashCommand = discordInteraction.client.commands.slash.get(
      discordInteraction.customId
    ) as SlashCommand;

    if (!command) {
      throw new Error(
        `❌ | The command named ${discordInteraction.customId} was not found.`
      );
    } else if (!command.modal) {
      throw new Error(
        `❌ | The command does not have a configuration for the modal.`
      );
    }

    command.modal(discordInteraction);
  }
}
