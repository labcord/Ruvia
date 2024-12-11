import { ButtonBuilder, ButtonComponentData, APIButtonComponent } from "discord.js";
import { readFileSync } from "node:fs";
import * as path from "jsr:@std/path";
import { Buffer } from "node:buffer";

export class Button extends ButtonBuilder {
    public cache: { time: number; expiredMessage: string; onClose?: () => ButtonBuilder; } | undefined

    constructor(data?: Partial<ButtonComponentData> | Partial<APIButtonComponent>) {
        super(data);
    }

    setCache(options: { time: number; expiredMessage: string; onClose?: () => ButtonBuilder }) {
        this.cache = options;
        return this
    }
}
