import {
  MessageEditOptions,
  Message,
  MessageReplyOptions,
  ModalBuilder,
} from "discord.js";
import { deferReply } from "@/ruvia/ChatInputCommandInteractionMethods/deferReply.ts";
import { cacheMessages } from "@/ruvia/cache/cache.ts";
import { followUp } from "@/ruvia/ChatInputCommandInteractionMethods/followUp.ts";
import { editReply } from "@/ruvia/ChatInputCommandInteractionMethods/editReply.ts";
import {
  ToAPIApplicationCommandOptions,
  PermissionResolvable,
} from "discord.js";
import RuviaConfig from "rConfig";
import { showModal } from "@/ruvia/ChatInputCommandInteractionMethods/showModal.ts";
import { SlashCommand } from "rTypes";
import { mentionTimestamp } from "@/ruvia/utils.ts";

const prefix = Deno.env.get("PREFIX");

export default async function transformedSlashCommandExecutor(msg: Message) {
  if (msg.author.bot && msg.author.id == msg.client.user.id) {
    if (msg.reference?.messageId) {
      let reference_msg: Message = msg.channel.messages.cache.get(
        msg.reference.messageId
      )!
      if (
        msg.client.commands.message.has(reference_msg.content.split(" ")[0])
      ) {
        cacheMessages.set(`${reference_msg.id}.botReply`, msg);
      }
    }

    return;
  }

  const splitted_msg = msg.content.split(" ");

  if (!msg.client.commands.message.has(splitted_msg[0])) return;

  const ruvia_message = new Map();

  const msg_command: SlashCommand = msg.client.commands.message.get(
    splitted_msg[0]
  )!;

  if (
    (msg_command.blackList?.includes(msg.author.id) && msg_command.blackList) ||
    (!msg_command.whiteList?.includes(msg.author.id) && msg_command.whiteList)
  ) {
    msg.reply(
      RuviaConfig?.slashCommands?.options?.noPermissionMessage ||
        "❌ **| You are blocked from using this command.**"
    );
    return;
  }

  let cooldown = msg.client.cooldown.get(
    `message.${msg_command.command.name}-${msg.author.username}`
  );

  if (msg_command.cooldown && cooldown) {
    if (Date.now() < cooldown) {
      const cooldownMessage = await msg.reply(
        RuviaConfig?.cooldown?.warningMessage(msg_command.cooldown) ||
          `⏳ **| ${mentionTimestamp(
            new Date(cooldown),
            "R"
          )} the cooldown ends.**`
      );
      setTimeout(
        () => cooldownMessage.delete(),
        (RuviaConfig.cooldown?.warningMessageDeletionTime as number) * 1000 ||
          msg_command.cooldown * 1000
      );
      return;
    }
    msg.client.cooldown.set(
      `message.${msg_command.command.name}-${msg.author.username}`,
      Date.now() + msg_command.cooldown * 1000
    );
    setTimeout(() => {
      msg.client.cooldown.delete(
        `message.${msg_command.command.name}-${msg.author.username}`
      );
    }, msg_command.cooldown * 1000);
  } else if (msg_command.cooldown && !cooldown) {
    msg.client.cooldown.set(
      `message.${msg_command.command.name}-${msg.author.username}`,
      Date.now() + msg_command.cooldown * 1000
    );
  }

  if (
    msg_command.command?.default_member_permissions &&
    !msg.member?.permissions.has(
      msg_command.command.default_member_permissions as PermissionResolvable
    )
  ) {
    msg.reply(
      RuviaConfig.messageCommands?.options?.noPermissionMessage ||
        "❌ **| You do not have the necessary permissions to perform this command.**"
    );
    return;
  }

  let optionTypes = msg_command.command.options.reduce(
    (acc: any, item: ToAPIApplicationCommandOptions) => {
      acc[`${item.toJSON().name}`] = item.toJSON().type;
      return acc;
    },
    {}
  );

  ruvia_message.set(
    "options",
    Object.fromEntries(
      splitted_msg
        .filter((part) => part.includes(":"))
        .map((part) => {
          const [key, value] = part.split(":");
          let realValue;

          if (optionTypes[`${key}`] == 4) realValue = Number(value);
          else if (optionTypes[`${key}`] == 5) {
            if (value == "true") realValue = true;
            else realValue = false;
          } else if (
            optionTypes[`${key}`] == 6 ||
            optionTypes[`${key}`] == 7 ||
            optionTypes[`${key}`] == 8
          ) {
            realValue = value.trim().slice(3, value.length - 1);
          } else if (optionTypes[`${key}`] == 9) {
            realValue = value.trim().slice(2, value.length - 1);
          } else if (optionTypes[`${key}`] == 10) {
            realValue = value.trim();
          }

          return [key, optionTypes[`${key}`] == 3 ? value : realValue];
        })
    )
  );

  for (let option of msg_command.command.options) {
    if (
      (option?.required && !ruvia_message.get("options")[`${option.name}`]) ||
      option?.name == null
    ) {
      msg.reply(
        RuviaConfig?.messageCommands?.options?.requireMessage(option.name)
          ? RuviaConfig?.messageCommands?.options?.requireMessage(option.name)
          : `❌ **| A necessary parameter has been passed. (<${option.name}>)**`
      );
      return;
    }
  }

  ruvia_message.set(
    "command",
    msg.client.commands.message.get(splitted_msg[0])
  );

  ruvia_message.set(
    "appPermissions",
    msg.guild?.members.cache.get(msg.client.user.id)
  );

  ruvia_message.set("commandName", msg_command.command.name);

  ruvia_message.set("commandType", 1);

  ruvia_message.set("deferReply", async () => {
    await deferReply(msg);
  });

  ruvia_message.set("followUp", (messageReplyOptions: MessageReplyOptions) => {
    followUp(msg, messageReplyOptions);
  });

  ruvia_message.set("editReply", (messageEditOptions: MessageEditOptions) => {
    editReply(msg, messageEditOptions);
  });

  ruvia_message.set("showModal", async (modal: ModalBuilder) => {
    showModal(msg, splitted_msg[0].slice(prefix.length), modal);
  });

  Array.from(ruvia_message).forEach((ruvia_val) => {
    msg[`${ruvia_val[0]}`] = ruvia_val[1];
  });

  msg.client.commands.message
    .get(splitted_msg[0])
    .execute(msg, ruvia_message.get("options"));
}
