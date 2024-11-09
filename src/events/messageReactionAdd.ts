import {
    Events,
    MessageReaction,
    User,
    MessageReactionEventDetails,
  } from "discord.js";
  import { RuviaReactionTrigers } from "../lib/RuviaReactionTrigers.ts";
  
  const event = {
    type: Events.MessageReactionAdd,
    execute: (
      reaction: MessageReaction,
      user: User,
      details: MessageReactionEventDetails
    ) => {
      console.log(reaction)
      RuviaReactionTrigers(reaction, "add", [ reaction , user, details ]); 
      // Replace the "add" parameter with "remove" in case of reaction removing.
    },
  };
  
  export default event;
  