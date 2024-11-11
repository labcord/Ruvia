import { Client } from "discord.js";
import { readdirSync } from "node:fs";
import path from "node:path";
import type {
  ReactionCommand,
  SlashCommand,
  ButtonCommand,
  ContextCommand,
  SelectMenuCommand,
} from "rTypes";

export default async function handle(client: Client) {

  let slashCommandsDir = path.join(Deno.cwd() as string, "./src/commands/slash");

  const slashCommandsFiles = readdirSync(slashCommandsDir).filter((file) =>
    file.endsWith(".ts")
  );

  for (const file of slashCommandsFiles) {
    const importedCommand: SlashCommand = (
      await import(`@/src/commands/slash/${file}`)
    ).default;
    client.commands.slash.set(importedCommand.command.name, importedCommand);

    client.commands.message.set(
      Deno.env.get("PREFIX") + importedCommand.command.toJSON().name,
      importedCommand
    );
  }

  let buttonCommandsDir = path.join(Deno.cwd() as string, "./src/commands/button");

  const buttonCommandsFiles = readdirSync(buttonCommandsDir).filter((file) =>
    file.endsWith(".ts")
  );

  for (const file of buttonCommandsFiles) {
    const importedCommand: ButtonCommand = (
      await import(`@/src/commands/button/${file}`)
    ).default;

    if (importedCommand.customId.startsWith("rM")) {
      throw new Error(
        "❌ | A button name can not start with “rM”. Check the documentation for more detailed information."
      );
    }

    client.commands.button.set(importedCommand.customId, importedCommand);
  }

  let reactionCommandsDir = path.join(
    Deno.cwd() as string,
    "./src/commands/reaction"
  );

  const reactionCommandsFiles = readdirSync(reactionCommandsDir).filter(
    (file) => file.endsWith(".ts")
  );

  for (const file of reactionCommandsFiles) {
    const importedCommand: ReactionCommand = (
      await import(`@/src/commands/reaction/${file}`)
    ).default;

    client.commands.reaction.set(importedCommand.id, importedCommand);
  }

  let contextCommandsDir = path.join(
    Deno.cwd() as string,
    "./src/commands/context"
  );

  const contextCommandsFiles = readdirSync(contextCommandsDir).filter((file) =>
    file.endsWith(".ts")
  );

  for (const file of contextCommandsFiles) {
    const importedCommand: ContextCommand = (
      await import(`@/src/commands/context/${file}`)
    ).default;

    client.commands.context.set(
      `${importedCommand.command.type == 2 ? "u" : "m"}_${
        importedCommand.command.name
      }`,
      importedCommand
    );
  }

  let selectmenuCommandsDir = path.join(
    Deno.cwd() as string,
    "./src/commands/selectmenu"
  );

  const selectmenuCommandsFiles = readdirSync(selectmenuCommandsDir).filter((file) =>
    file.endsWith(".ts")
  );

  for (const file of selectmenuCommandsFiles) {
    const importedCommand: SelectMenuCommand = (
      await import(`@/src/commands/selectmenu/${file}`)
    ).default;

    client.commands.selectmenu.set(
      importedCommand.customId,
      importedCommand
    );
  }
}
