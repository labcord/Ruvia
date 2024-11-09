import { MessageReaction } from "discord.js";
import chalk from "chalk";
import { styles } from "../../styles.ts";
import type { RuviaReactionCommand } from "../types.d.ts";

export function RuviaReactionTrigers(
  reaction: MessageReaction,
  type: "add" | "remove",
  // deno-lint-ignore no-explicit-any
  args: Array<any>
) {
  let command: RuviaReactionCommand = reaction.client.commands.reaction.get(
    reaction.emoji.id || (reaction.emoji.name as string)
  ) as RuviaReactionCommand;

  console.log(command)

  if (!command) {
    console.log(
      chalk.red(
        styles.spaces() +
          `❌  | No commands found for the reaction with the id "${reaction.emoji.id || reaction.emoji.name}".`
      )
    );
  }

  if (type == "add" && command.executeWhenAdd) {
    command?.executeWhenAdd(args[0], args[1], args[2]);
  }

  if (type == "remove" && command.executeWhenRemove) {
    command?.executeWhenRemove(args[0], args[1], args[2]);
  }
}
