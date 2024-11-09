import {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  ContextMenuCommandType,
} from "discord.js";
import type { RuviaContextCommand } from "../../types.d.ts";
import { mentionUser } from "../../lib/ruviaUtils.ts";

const command: RuviaContextCommand = {
  command: new ContextMenuCommandBuilder()
    .setContexts(0)
    .setName("ask")
    .setType(ApplicationCommandType.User as ContextMenuCommandType),
  execute(interaction) {
    interaction.reply(
      `Hey ${mentionUser(
        interaction.targetUser.id
      )}, are you love Ruvia? \n Don't know what it is? Check it out now! \n https://github.com/labcord/ruvia`
    );
  },
};

export default command;
