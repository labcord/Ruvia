import {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  ContextMenuCommandType,
} from "discord.js";
import type { ContextCommand } from "rTypes";
import { mentionUser } from "@/ruvia/utils.ts";

const command: ContextCommand = {
  command: new ContextMenuCommandBuilder()
    .setContexts(0)
    .setName("ask")
    .setType(ApplicationCommandType.User as ContextMenuCommandType),
  execute(interaction) {
    interaction.reply(
      `Hey ${mentionUser(
        interaction.targetId
      )}, are you love Ruvia? \n Don't know what it is? Check it out now! \n https://github.com/labcord/ruvia`
    );
  },
};

export default command;
