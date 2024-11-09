import { Message } from "discord.js";
import { ruviaCacheMessages } from "../../cache/cache.ts";

export async function deferReply(msg: Message){
    let defermsg = await msg.reply(`:thought_balloon: | ${msg.client.user.displayName} is thinking...`)
    defermsg.type = "defer"
    ruviaCacheMessages.set(msg.id, defermsg)
}