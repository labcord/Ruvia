import type { ButtonCommand } from "ruvia/types";

const button: ButtonCommand = {
  customId: "hello",
  execute(interaction) {
    interaction.reply("Hello, Ruvia!");
  },
};

export default button;