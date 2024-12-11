import { readFileSync } from "node:fs";
import { AttachmentBuilder } from "discord.js"
import * as path from "jsr:@std/path";
import { Buffer } from "node:buffer";

export class Attachment {
    public buffer: Buffer

    constructor(filePath: string){
        const src = path.join(Deno.cwd() as string, "./src", filePath);
        const buffer = readFileSync(src)
        this.buffer = buffer
        const attachment = new AttachmentBuilder(buffer, { name: filePath.split("/").pop() })
        return attachment
    }
}