import type { RuviaButtonCommand } from "../../types.d.ts";

const button: RuviaButtonCommand = {
  customId: "hello",
  execute(interaction) {
    interaction.reply("Hello, Ruvia!");
  },
};

export default button;