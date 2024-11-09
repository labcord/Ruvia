import {
    Interaction,
    MessageContextMenuCommandInteraction,
    ApplicationCommandType,
    UserContextMenuCommandInteraction
  } from "discord.js";
  import { RuviaConfig } from "../ruvia.config.ts";
  import { mentionTimestamp } from "../lib/ruviaUtils.ts";
  import {
    RuviaSlashCommand,
    RuviaButtonCommand,
    RuviaSelectMenuCommand,
    RuviaContextCommand,
  } from "../types.d.ts";
  import Fuse from "fuse.js";

export async function RuviaInteractionExecutor(interaction: Interaction): Promise<void>  {
  if (interaction.isChatInputCommand()) {
    let command: RuviaSlashCommand = interaction.client.commands.slash.get(
      interaction.commandName
    ) as RuviaSlashCommand;

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
          RuviaConfig.cooldown?.warningMessage(cooldown) ||
            `⏳ **| ${mentionTimestamp(
              new Date(cooldown),
              "R"
            )} the cooldown will end.**`
        );
        setTimeout(
          () => interaction.deleteReply(),
          RuviaConfig.cooldown?.warningMessageDeletionTime || Date.now() + command.cooldown * 1000 - Date.now()
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
          _hoistedOption: Array<{
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
    let command: RuviaSlashCommand = interaction.client.commands.slash.get(
      interaction.commandName
    ) as RuviaSlashCommand;

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
    let command: RuviaButtonCommand = interaction.client.commands.button.get(
      interaction.customId
    ) as RuviaButtonCommand;

    if (!command) {
      throw new Error(
        `❌ | The command with custom id "${interaction.customId}" does not have a string set for autocomplete.`
      );
    }

    command.execute(interaction);
  }

  if (interaction.isAnySelectMenu()) {
    let command: RuviaSelectMenuCommand =
      interaction.client.commands.selectmenu.get(
        interaction.customId
      ) as RuviaSelectMenuCommand;

    if (!command) {
      throw new Error(
        `❌ | The command with custom id "${interaction.customId}" does not have a string set for autocomplete.`
      );
    }

    command.execute(interaction);
  }

  if (interaction.isContextMenuCommand()) {
    let command: RuviaContextCommand = interaction.client.commands.context.get(
      interaction.commandName
    ) as RuviaContextCommand;

    if (!command) {
      throw new Error(
        `❌ | The command named ${interaction.commandName} was not found.`
      );
    }

    command.execute(
      interaction as unknown as RuviaContextCommand["command"]["type"] extends ApplicationCommandType.Message
        ? MessageContextMenuCommandInteraction
        : UserContextMenuCommandInteraction
    );
  }

  if (interaction.isModalSubmit()) {
    let command: RuviaSlashCommand = interaction.client.commands.slash.get(
      interaction.customId
    ) as RuviaSlashCommand;

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
