import type { RuviaReactionCommand } from "../../types.d.ts";

const command: RuviaReactionCommand = {
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
