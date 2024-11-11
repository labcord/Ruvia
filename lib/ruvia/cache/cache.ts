import NC from "node-cache"

export let cacheMessages = new NC({ stdTTL: 60, checkperiod: 30 })