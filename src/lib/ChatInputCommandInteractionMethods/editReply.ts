import { Message, MessageEditOptions } from "discord.js";
import { ruviaCacheMessages } from "../../cache/cache.ts";

export function editReply(msg: Message, msgOptions: MessageEditOptions){
    const bot_msg = ruviaCacheMessages.get(msg.id + ".botReply") as Message
    msg.channel.messages.cache.get(bot_msg.id).edit(msgOptions)
    ruviaCacheMessages.del(msg.id)
}