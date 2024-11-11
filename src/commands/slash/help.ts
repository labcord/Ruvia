import {
  SlashCommandBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import type { SlashCommand } from "rTypes";

const questions = [
  {
    q: "Is Ruvia currently being developed?",
    a: "Yes, Ruvia is currently being supported and developed.",
  },
  {
    q: "Is the project completely finished?",
    a: "No, Ruvia is currently in beta.",
  },
  {
    q: "Can I change Ruvia the way I want?",
    a: "Of course! But please give us credit if your project is open source.",
  },
];

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Get help about Ruvia.")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("What would you like to ask?")
        .setAutocomplete(true)
    ),
  execute: async (interaction, options: any) => {
    const embed = new EmbedBuilder()
      .setTitle("Get help for Ruvia")
      .setColor("Blurple");

      if(options.question){
        interaction.reply(questions.filter(question => question.q == options.question)[0].a)
        return
      }

    const select = new StringSelectMenuBuilder()
      .setCustomId(`getHelp`)
      .setPlaceholder("Get answers to your questions!")
      .addOptions(
        questions.map((question, i) => {
          return (
            new StringSelectMenuOptionBuilder()
          .setLabel(question.q)
          .setDescription(
            "View Question"
          )
          .setValue(`q${i}`)
          )
        })
      );

    const visitWebsite = new ButtonBuilder()
      .setLabel("Visit Documentation")
      .setStyle(ButtonStyle.Link)
      .setURL("https://mdevst.gitbook.io/ruvia");

    const actions = new ActionRowBuilder<StringSelectMenuBuilder>();
    actions.addComponents(select);
    const otherActions = new ActionRowBuilder<ButtonBuilder>()
    otherActions.addComponents(visitWebsite)

    interaction.reply({
      embeds: [embed],
      components: [actions, otherActions],
    });
  },
  autocomplete: questions.map((question) => question.q),
  cooldown: 3
};

export default command;
