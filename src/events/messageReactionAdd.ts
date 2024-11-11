import {
    Events,
    MessageReaction,
    User,
    MessageReactionEventDetails,
  } from "discord.js";
  import trigger from "@/ruvia/reactionTrigers.ts"
  
  const event = {
    type: Events.MessageReactionAdd,
    execute: (
      reaction: MessageReaction,
      user: User,
      details: MessageReactionEventDetails
    ) => {

      trigger(reaction, "add", [ reaction , user, details ]); 
      // Replace the "add" parameter with "remove" in case of reaction removing.
    },
  };
  
  export default event;
  