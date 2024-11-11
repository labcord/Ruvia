import {
  Interaction,
  MessageContextMenuCommandInteraction,
  ApplicationCommandType,
  UserContextMenuCommandInteraction,
} from "discord.js";
import RuviaConfig from "rConfig";
import { mentionTimestamp } from "@/ruvia/utils.ts";
import {
  SlashCommand,
  ButtonCommand,
  SelectMenuCommand,
  ContextCommand,
} from "rTypes";
import Fuse from "fuse.js";

export default async function interactionExecutor(
  interaction: Interaction
): Promise<void> {
  if (interaction.isChatInputCommand()) {
    let command: SlashCommand = interaction.client.commands.slash.get(
      interaction.commandName
    ) as SlashCommand;

    if (!command) {
      throw new Error(
        `❌ | The command named ${interaction.commandName} was not found.`
      );
    }

    let cooldown = interaction.client.cooldown.get(
      `${interaction.commandName}-${interaction.user.username}`
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
      interaction.client.cooldown.set(
        `${interaction.commandName}-${interaction.user.username}`,
        Date.now() + command.cooldown * 1000
      );
      setTimeout(() => {
        interaction.client.cooldown.delete(
          `${interaction.commandName}-${interaction.user.username}`
        );
      }, command.cooldown * 1000);
    } else if (command.cooldown && !cooldown) {
      interaction.client.cooldown.set(
        `${interaction.commandName}-${interaction.user.username}`,
        Date.now() + command.cooldown * 1000
      );
    }

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

  if (interaction.isAutocomplete()) {
    let command: SlashCommand = interaction.client.commands.slash.get(
      interaction.commandName
    ) as SlashCommand;

    if (!command) {
      throw new Error(
        `❌ | The command named ${interaction.commandName} was not found.`
      );
    } else if (command && command.autocomplete) {
      throw new Error(
        `❌ | The command named "${interaction.commandName}" does not have a string set for autocomplete.`
      );
    }

    if (Array.isArray(command.autocomplete)) {
      const fuse = new Fuse(command.autocomplete);

      await interaction.respond(
        fuse
          .search(interaction.options.getFocused())
          .map((item) => ({ name: item.item, value: item.item }))
      );
    } else if (typeof command.autocomplete == "object") {
      const fuse = new Fuse(command.autocomplete.choices, {
        keys: command.autocomplete.keys,
      });

      await interaction.respond(
        fuse
          .search(interaction.options.getFocused())
          .map((item) => ({ name: item.item, value: item.item }))
      );
    } else if (command.autocomplete) {
      command.autocomplete(interaction);
    }
  }

  if (interaction.isButton()) {
    let command: ButtonCommand = interaction.client.commands.button.get(
      interaction.customId
    ) as ButtonCommand;

    if (!command) {
      throw new Error(
        `❌ | The command with custom id "${interaction.customId}" does not have a string set for autocomplete.`
      );
    }

    command.execute(interaction);
  }

  if (interaction.isAnySelectMenu()) {
    let command: SelectMenuCommand = interaction.client.commands.selectmenu.get(
      interaction.customId
    ) as SelectMenuCommand;

    if (!command) {
      throw new Error(
        `❌ | The command with custom id "${interaction.customId}" does not have a string set for autocomplete.`
      );
    }

    command.execute(interaction);
  }

  if (interaction.isContextMenuCommand()) {
    let command: ContextCommand = interaction.client.commands.context.get(
      interaction.commandName
    ) as ContextCommand;

    if (!command) {
      throw new Error(
        `❌ | The command named ${interaction.commandName} was not found.`
      );
    }

    command.execute(
      interaction as unknown as ContextCommand["command"]["type"] extends ApplicationCommandType.Message
        ? MessageContextMenuCommandInteraction
        : UserContextMenuCommandInteraction
    );
  }

  if (interaction.isModalSubmit()) {
    let command: SlashCommand = interaction.client.commands.slash.get(
      interaction.customId
    ) as SlashCommand;

    if (!command) {
      throw new Error(
        `❌ | The command named ${interaction.customId} was not found.`
      );
    } else if (!command.modal) {
      throw new Error(
        `❌ | The command does not have a configuration for the modal.`
      );
    }

    command.modal(interaction);
  }
}
