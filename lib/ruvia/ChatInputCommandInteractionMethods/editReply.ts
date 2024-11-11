import { Message, MessageEditOptions } from "discord.js";
import { cacheMessages } from "@/ruvia/cache/cache.ts";

export function editReply(msg: Message, msgOptions: MessageEditOptions){
    const bot_msg = cacheMessages.get(msg.id + ".botReply") as Message
    (msg.channel.messages.cache.get(bot_msg.id) as unknown as Message).edit(msgOptions)
    cacheMessages.del(msg.id)
}