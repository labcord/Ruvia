import NC from "node-cache"

export const ruviaCacheMessages = new NC({ stdTTL: 60, checkperiod: 30 })