import NC from "node-cache"

export const messageCache = new NC({ stdTTL: 60, checkperiod: 30 })

export const buttonInteractionCache = new NC({ stdTTL: 10, checkperiod: 5 })