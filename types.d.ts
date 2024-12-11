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
    },wwww
}

export type SlashCommand = {
  command: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction, options: Object) => void
  modal?: (interaction: ModalSubmitInteraction) => void
  autocomplete?: Array<object> | ((interaction: AutocompleteInteraction) => void) | { keys: string[], choices: Array<object> }
  cooldown?: number
  blackList?: Array<string>
  whiteList?: Array<string>
  category?: string
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
          slash: Collection<string, SlashCommand | Function | object>,
          message: Collection<string, SlashCommand | Function | object>,
          button: Map<string, ButtonCommand | Function | object>,
          reaction: Map<string, ReactionCommand | Function | object>,
          context: Map<string, ContextCommand | Function | object>,
          selectmenu: Map<string, SelectMenuCommand> | Function | object,
        },
        cooldown: Collection<string, number>
        modals: Map<string, any>,
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