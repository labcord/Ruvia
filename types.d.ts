import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ModalSubmitInteraction,
  AutocompleteInteraction,
  ButtonInteraction,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  MessageContextMenuCommandInteraction,
  UserContextMenuCommandInteraction,
  MessageReaction,
  User,
  MessageReactionEventDetails,
  AnySelectMenuInteraction,
  Collection,
  Events,
} from "discord.js"

export type RuviaConfig = {
    messageCommands?: {
      options?: {
        requireMessage?: (requiredOptionName: string) => string,
        openModalMessage?: string,
        openModalStyle?: "Danger" | "Primary" | "Secondary" | "Success" | "Link"
        noPermissionMessage?: string
      }
    }
    slashCommands?: {
      options?: {
        noPermissionMessage?: string,
      }
    }
    cooldown?: {
      warningMessage?: (remainingTime: number) => string
      warningMessageDeletionTime?: number
    }
}

export type SlashCommand = {
  command: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction, options: Object) => void
  modal?: (interaction: ModalSubmitInteraction) => void
  autocomplete?: Array<any> | ((interaction: AutocompleteInteraction) => void) | { keys: string[], choices: Array<any> }
  cooldown?: number
  blackList?: Array<string>
  whiteList?: Array<string>
}

export type ButtonCommand = {
  customId: string,
  execute: (interaction: ButtonInteraction) => void
}

export type ContextCommand = {
  command: ContextMenuCommandBuilder
  execute: (interaction: ContextCommand["command"]["type"] extends ApplicationCommandType.Message
    ? MessageContextMenuCommandInteraction : UserContextMenuCommandInteraction) => void
}

export type ReactionCommand = {
  id: string
  executeWhenAdd?: (reaction: MessageReaction, user: User, details: MessageReactionEventDetails) => void
  executeWhenRemove?: (reaction: MessageReaction, user: User, details: MessageReactionEventDetails) => void
}

export type SelectMenuCommand = {
  customId: string
  execute: (interaction: AnySelectMenuInteraction) => void
}

declare module "discord.js" {
    export interface Client {
        commands: {
          slash: Collection<string, SlashCommand>,
          message: Collection<string, SlashCommand>,
          button: Map<string, ButtonCommand>,
          reaction: Map<string, ReactionCommand>,
          context: Map<string, ContextCommand>,
          selectmenu: Map<string, SelectMenuCommand>,
        },
        cooldown: Collection<string, number>
        modals: Map<string, any>
    }
}

declare global {
  namespace NodeJS {
      interface ProcessEnv {
          TOKEN: string,
          CLIENT_ID: string,
          PREFIX: string,
      }
  }
}