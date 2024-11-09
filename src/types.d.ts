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

export type RuviaSlashCommand = {
  command: SlashCommandBuilder
  execute: (interaction: ChatInputCommandInteraction, options: Object) => void
  modal?: (interaction: ModalSubmitInteraction) => void
  autocomplete?: Array<any> | ((interaction: AutocompleteInteraction) => void) | { keys: string[], choices: Array<any> }
  cooldown?: number
  blackList?: Array<string>
  whiteList?: Array<string>
}

export type RuviaButtonCommand = {
  customId: string,
  execute: (interaction: ButtonInteraction) => void
}

export type RuviaContextCommand = {
  command: ContextMenuCommandBuilder
  execute: (interaction: RuviaContextCommand["command"]["type"] extends ApplicationCommandType.Message
    ? MessageContextMenuCommandInteraction : UserContextMenuCommandInteraction) => void
}

export type RuviaReactionCommand = {
  id: string
  executeWhenAdd?: (reaction: MessageReaction, user: User, details: MessageReactionEventDetails) => void
  executeWhenRemove?: (reaction: MessageReaction, user: User, details: MessageReactionEventDetails) => void
}

export type RuviaSelectMenuCommand = {
  customId: string
  execute: (interaction: AnySelectMenuInteraction) => void
}

export type RuviaEvent = {
  once?: boolean
  type: Events
  execute: (...params: any) => void
};

declare module "discord.js" {
    export interface Client {
        commands: {
          slash: Collection<string, RuviaSlashCommand>,
          message: Collection<string, RuviaSlashCommand>,
          button: Map<string, RuviaButtonCommand>,
          reaction: Map<string, RuviaReactionCommand>,
          context: Map<string, RuviaContextCommand>,
          selectmenu: Map<string, RuviaSelectMenuCommand>,
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