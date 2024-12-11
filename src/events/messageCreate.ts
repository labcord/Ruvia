import { Events, Message } from "discord.js";
import { transformedSlashCommandExecutor } from "ruvia";

const event = {
  type: Events.MessageCreate,
  execute: (msg: Message) => {
    transformedSlashCommandExecutor(msg);
  },
};

export default event;
