// require('./src/index.js')
const { ShardingManager } = require('discord.js')
const shard = new ShardingManager("./src/index.js", {
    token: "",
    autoSpawn: true,
    respawn: true,
    totalShards: "auto",
})

shard.spawn()

shard.on('launch', (shard) => {
    console.log(`⬇ [SHARD] Shard ID #${shard.id} ⬇`)
})