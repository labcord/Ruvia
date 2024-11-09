import { Client } from "discord.js";
import chalk from "chalk";
import { styles } from "../../styles.ts";

export async function RuviaRegistersCommands(client: Client) {
  await client.application?.commands
    .set(
      Array.from([...client.commands.slash, ...client.commands.context]).map(
        (command) => command[1].command
      )
    )
    .catch((err) => {
      throw new Error(err);
    })
    .then(() => {
      console.log(
        chalk.green(
          styles.spaces() + `✔️  | Application commands loaded successfully.`
        )
      );
    });
}
