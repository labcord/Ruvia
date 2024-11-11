import { Message } from "discord.js";
import { cacheMessages } from "@/ruvia/cache/cache.ts";

export async function deferReply(msg: Message){
    let defermsg = await msg.reply(`:thought_balloon: | ${msg.client.user.displayName} is thinking...`)
    defermsg.type = "defer"
    cacheMessages.set(msg.id, defermsg)
}