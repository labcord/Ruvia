import { Events, Message } from "discord.js";
import transformedSlashCommandExecutor from "@/ruvia/transformedSlashCommandExecutor.ts";

const event = {
  type: Events.MessageCreate,
  execute: (msg: Message) => {
    transformedSlashCommandExecutor(msg)
  }
};

export default event;