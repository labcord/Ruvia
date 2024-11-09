import { Events, Message } from "discord.js";
import { RuviaTransformedSlashCommandExecutor } from "../lib/RuviaTransformedSlashCommandExecutor.ts";

const event = {
  type: Events.MessageCreate,
  execute: (msg: Message) => {
    RuviaTransformedSlashCommandExecutor(msg)
  }
};

export default event;