import { Message } from "discord.js";
import { messageCache } from "../cache/cache.ts";

export async function deferReply(msg: Message){
    let defermsg = await msg.reply(`:thought_balloon: | ${msg.client.user.displayName} is thinking...`)
    defermsg.type = "defer"
    messageCache.set(msg.id, defermsg)
}