import { Message, MessageReplyOptions, TextChannel } from "discord.js";
import { cacheMessages } from "@/ruvia/cache/cache.ts";

export function followUp(msg: Message, msgOptions: MessageReplyOptions){
    const bot_msg = cacheMessages.get(msg.id + ".botReply") as Message
    (msg.channel.messages.cache.get(bot_msg.id) as unknown as Message).reply(msgOptions)
    cacheMessages.del(msg.id)
}