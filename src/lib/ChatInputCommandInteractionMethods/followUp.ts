import { Message, MessageReplyOptions, TextChannel } from "discord.js";
import { ruviaCacheMessages } from "../../cache/cache.ts";

export function followUp(msg: Message, msgOptions: MessageReplyOptions){
    const bot_msg = ruviaCacheMessages.get(msg.id + ".botReply") as Message
    msg.channel.messages.cache.get(bot_msg.id).reply(msgOptions)
    ruviaCacheMessages.del(msg.id)
}