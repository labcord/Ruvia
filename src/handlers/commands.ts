import { Client } from "discord.js";
import { readdir, readdirSync } from "node:fs";
import path from "node:path";
import "../types.d.ts";
import type {
  RuviaReactionCommand,
  RuviaSlashCommand,
  RuviaButtonCommand,
  RuviaContextCommand,
  RuviaSelectMenuCommand,
} from "../types.d.ts";

export default async function handle(client: Client) {
  let slashCommandsDir = path.join(import.meta.dirname as string, "../commands/slash");

  const slashCommandsFiles = readdirSync(slashCommandsDir).filter((file) =>
    file.endsWith(".ts")
  );

  for (const file of slashCommandsFiles) {
    const importedCommand: RuviaSlashCommand = (
      await import(`../commands/slash/${file}`)
    ).default;
    client.commands.slash.set(importedCommand.command.name, importedCommand);

    client.commands.message.set(
      Deno.env.get("PREFIX") + importedCommand.command.toJSON().name,
      importedCommand
    );
  }

  let buttonCommandsDir = path.join(import.meta.dirname as string, "../commands/button");

  const buttonCommandsFiles = readdirSync(buttonCommandsDir).filter((file) =>
    file.endsWith(".ts")
  );

  for (const file of buttonCommandsFiles) {
    const importedCommand: RuviaButtonCommand = (
      await import(`../commands/button/${file}`)
    ).default;

    if (importedCommand.customId.startsWith("rM")) {
      throw new Error(
        "❌ | A button name can not start with “rM”. Check the documentation for more detailed information."
      );
    }

    client.commands.button.set(importedCommand.customId, importedCommand);
  }

  let reactionCommandsDir = path.join(
    import.meta.dirname as string,
    "../commands/reaction"
  );

  const reactionCommandsFiles = readdirSync(reactionCommandsDir).filter(
    (file) => file.endsWith(".ts")
  );

  for (const file of reactionCommandsFiles) {
    const importedCommand: RuviaReactionCommand = (
      await import(`../commands/reaction/${file}`)
    ).default;

    client.commands.reaction.set(importedCommand.id, importedCommand);
  }

  let contextCommandsDir = path.join(
    import.meta.dirname as string,
    "../commands/context"
  );

  const contextCommandsFiles = readdirSync(contextCommandsDir).filter((file) =>
    file.endsWith(".ts")
  );

  for (const file of contextCommandsFiles) {
    const importedCommand: RuviaContextCommand = (
      await import(`../commands/context/${file}`)
    ).default;

    client.commands.context.set(
      `${importedCommand.command.type == 2 ? "u" : "m"}_${
        importedCommand.command.name
      }`,
      importedCommand
    );
  }

  let selectmenuCommandsDir = path.join(
    import.meta.dirname as string,
    "../commands/selectmenu"
  );

  const selectmenuCommandsFiles = readdirSync(selectmenuCommandsDir).filter((file) =>
    file.endsWith(".ts")
  );

  for (const file of selectmenuCommandsFiles) {
    const importedCommand: RuviaSelectMenuCommand = (
      await import(`../commands/selectmenu/${file}`)
    ).default;

    client.commands.selectmenu.set(
      importedCommand.customId,
      importedCommand
    );
  }
}
