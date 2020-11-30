// require('./src/index.js')
const { ShardingManager } = require('discord.js');
const mainFile = "./src/index.js";
const shards = new ShardingManager(`${mainFile}`, {
    token: 'NzQwMTEyMzUzNDgzNTU0ODU4.XykRVw.EDydgpK7SRPYBC3fPicAmvP1eh4',
});
shards.on('shardCreate', shard => {
    console.log(`[${new Date().toString().split(" ", 5).join(" ")}] Launched shard #${shard.id}`);
});
shards.on('message', (shard, msg) => {
    console.log(`[${new Date().toString().split(" ", 5).join(" ")}] #${shard.id} | ${msg._eval} | ${msg._result}`);
});
shards.spawn(2, 5500, 30000)