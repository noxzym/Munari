// require('./src/index.js')
const { ShardingManager } = require('discord.js')
const shard = new ShardingManager("./src/index.js", {
    token: 'NzQwMTEyMzUzNDgzNTU0ODU4.XykRVw.EDydgpK7SRPYBC3fPicAmvP1eh4',
    shardList: 'auto',
    respawn: true,
    totalShards: 1,
})

shard.spawn()

shard.on('launch', (shard) => {
    console.log(`⬇ [SHARD] Shard ID #${shard.id} ⬇`)
})