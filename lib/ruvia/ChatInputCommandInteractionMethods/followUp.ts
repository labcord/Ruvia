import { Message, MessageReplyOptions } from "discord.js";
import { messageCache } from "../cache/cache.ts";

export function followUp(msg: Message, msgOptions: MessageReplyOptions){
    const bot_msg = messageCache.get(msg.id + ".botReply") as Message
    (msg.channel.messages.cache.get(bot_msg.id) as unknown as Message).reply(msgOptions)
    messageCache.del(msg.id)
}