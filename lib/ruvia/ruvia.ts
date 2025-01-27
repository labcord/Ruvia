import {
  Client,
  Guild,
  ApplicationCommand,
  GuildMember,
  PermissionsBitField,
  Channel,
  BaseMessageOptions,
  SlashCommandBuilder,
} from "discord.js";
import path from "node:path";

import interactionExecutor from "./interactionExecutor.ts";
import registerCommands from "./registerCommand.ts";
import reactionTrigers from "./interactionExecutor.ts";
import transformedSlashCommandExecutor from "./transformedSlashCommandExecutor.ts";

import { readdirSync } from "node:fs";

export {
  interactionExecutor,
  registerCommands,
  reactionTrigers,
  transformedSlashCommandExecutor,
};

export function getAllFiles(
  folderPath: string,
  mainFolderPath: string
): Array<{ name: string; parent: string }> {
  const results = [];

  const items = readdirSync(folderPath, { withFileTypes: true });
  for (const item of items) {
    const itemPath = path.join(folderPath, item.name); // Tam dosya yolunu oluştur
    if (item.isDirectory()) {
      results.push(...getAllFiles(itemPath, mainFolderPath));
    } else {
      results.push(
        item.parentPath.endsWith(mainFolderPath)
          ? { parent: "", name: item.name }
          : {
              parent: item.parentPath.split(mainFolderPath)[1],
              name: item.name,
            }
      );
    }
  }

  return results;
}

export async function findRole(options: {
  client: Client;
  role: string | Array<string>;
  guild: string | { id: string; fromCache: boolean } | Guild;
}) {
  if (!options.client) {
    throw new Error(
      "❌ | No client was specified for Ruvia's “findRole” utility."
    );
  }

  const guild =
    options.guild instanceof Guild
      ? options.guild
      : typeof options.guild == "object" && options.guild.fromCache
      ? options.client.guilds.cache.get(options.guild.id)
      : await options.client.guilds.fetch(
          typeof options.guild == "object" ? options.guild.id : options.guild
        );

  const allRoles = await guild?.roles.fetch();

  return allRoles?.filter((role) =>
    Array.isArray(options.role)
      ? options.role.includes(role.id)
      : role.id == options.role
  );
}

export function mentionUser(userId: string) {
  return `<@${userId}>`;
}

export function mentionChannel(channelId: string) {
  return `<#${channelId}>`;
}

export function mentionCommand(command: ApplicationCommand) {
  return `</${command.name}:${command.id}>`;
}

export function mentionRole(roleId: string, guildId?: string) {
  return guildId == roleId ? "@everyone" : `<@&${roleId}>`;
}

export function mentionTimestamp(
  date: Date,
  previewType?: "f" | "F" | "d" | "D" | "t" | "T" | "R"
) {
  return `<t:${Math.floor(new Date(date).getTime() / 1000)}:${
    previewType || "f"
  }>`;
}

export async function hasPermission(options: {
  guild: Guild;
  member: GuildMember | { id: string; fromCache?: boolean };
  permission: PermissionsBitField | Array<PermissionsBitField>;
}) {
  const member =
    options.member instanceof GuildMember
      ? options.member
      : options.member.fromCache
      ? (options.guild.members.cache.get(options.member.id) as GuildMember)
      : await options.guild.members.fetch(options.member.id);

  return options.permission instanceof PermissionsBitField
    ? member.permissions.has(options.permission)
    : options.permission.filter((perm) => member.permissions.has(perm))
        .length == options.permission.length;
}

export function sendDelayedMessage(
  channel: Channel,
  message: BaseMessageOptions | string,
  duration: number
) {
  setTimeout(() => {
    if (channel.isSendable()) channel.send(message);
    else
      throw new Error(
        `❌ | Can not send messages to the channel named "${channel.name}".`
      );
  }, duration * 1000);
}

export function isAsyncFunction(func: Function): boolean {
  return func.constructor.name === "AsyncFunction";
}

/**
 *
 * This function code is taken from the “https://github.com/MericcaN41/discordjs-v14-template-ts” repository.
 *
 */
export function sendTimedMessage(
  message: string,
  channel: Channel,
  duration: number
) {
  if (channel.isSendable()) {
    channel
      .send(message)
      .then((m) =>
        setTimeout(
          async () => (await channel.messages.fetch(m)).delete(),
          duration * 1000
        )
      );
  } else
    throw new Error(
      `❌ | Can not send messages to the channel named "${channel.name}".`
    );
}

export function getAllCommands(
  client: Client,
  options?: {
    only?: Array<
      "button" | "context" | "message" | "reaction" | "selectmenu" | "slash"
    >;
  }
) {
  return ["button", "context", "message", "reaction", "selectmenu", "slash"]
    .filter((type) =>
      options?.only ? options?.only?.includes(type as any) : true
    )
    .map((type) => client.commands[`${type}`]);
}

export function setBlacklist(
  commandName: string,
  ids: string[],
  { client }: { client: Client }
) {
  if(!client.commands.slash.has(commandName)) throw new Error("No such slash commands were found.")
  const command = client.commands.slash.find(
    (cmd) => cmd?.command?.name == commandName
  );
  const editedCommand = { ...command, blackList: ids }
  client.commands.slash.set(commandName, editedCommand)
}

export function setWhitelist(
  commandName: string,
  ids: string[],
  { client }: { client: Client }
) {
  if(!client.commands.slash.has(commandName)) throw new Error("No such slash commands were found.")
  const command = client.commands.slash.find(
    (cmd) => cmd?.command?.name == commandName
  );
  const editedCommand = { ...command, whiteList: ids }
  client.commands.slash.set(commandName, editedCommand)
}

export const utils = {
  findRole,
  mentionUser,
  mentionChannel,
  mentionCommand,
  mentionRole,
  mentionTimestamp,
  hasPermission,
  getAllCommands,
};
