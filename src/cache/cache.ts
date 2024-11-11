import NC from "node-cache"

export let bot = new NC({ stdTTL: 60, checkperiod: 30 })

/**
 * 
 * You can create your own cache system. You can find documents related to Node Cache in the link below.
 * https://github.com/node-cache/node-cache
 * 
 */