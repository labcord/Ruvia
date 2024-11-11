import type { ButtonCommand } from "rTypes";

const button: ButtonCommand = {
  customId: "hello",
  execute(interaction) {
    interaction.reply("Hello, Ruvia!");
  },
};

export default button;