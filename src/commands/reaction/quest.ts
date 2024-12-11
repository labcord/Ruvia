import type { ReactionCommand } from "ruvia/types";

const command: ReactionCommand = {
  id: "❓",
  executeWhenAdd(react) {
    console.log(react)
    if (react.message.channel.isSendable())
      react.message.channel.send(JSON.stringify(react));
  },
  executeWhenRemove(react) {
    /*if (react.message.channel.isSendable())
      react.message.channel.send(JSON.stringify(react));*/
  },
};

export default command;
