import { Message, MessageEditOptions } from "discord.js";
import { messageCache } from "../cache/cache.ts";

export function editReply(msg: Message, msgOptions: MessageEditOptions){
    const bot_msg = messageCache.get(msg.id + ".botReply") as Message
    (msg.channel.messages.cache.get(bot_msg.id) as unknown as Message).edit(msgOptions)
    messageCache.del(msg.id)
}