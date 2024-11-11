import type { SelectMenuCommand } from "rTypes";

const questions = [
    {
      q: "Is Ruvia currently being developed?",
      a: "Yes, Ruvia is currently being supported and developed. If you find a bug, don't hesitate to let us know!",
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

const command: SelectMenuCommand = {
 customId: "getHelp",
 execute(interaction){
    interaction.reply(questions[Number(interaction.values[0].slice(1))].a)
 }
};


export default command;