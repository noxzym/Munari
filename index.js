const { ShardingManager } = require('discord.js');
const mainFile = "./src/index.js";

process.on("unhandledRejection", e => {
    console.error(`Error handler caught an error: \n${e.stack}`);
});

process.on("uncaughtException", e => {
    console.error(`Error handler caught an error: \n${e.stack}`);
    console.info("Fatal error has been detected. Exiting processing...");

    process.exit(1);
});

const shards = new ShardingManager(`${mainFile}`, {
    totalShards: 'auto',
    mode: 'process',
    respawn: true,
    token: 'NzQwMTEyMzUzNDgzNTU0ODU4.XykRVw.EDydgpK7SRPYBC3fPicAmvP1eh4'
    // token: 'NzkxMjcxMjIzMDc3MTA5ODIw.X-MuwA.XTpdWsnWaAt3Qm7qGqkQr7zL3cM'
});

shards.on('shardCreate', shard => {
    console.log(`[ShardManager] Shard #${shard.id} has spawned`);
    shard.on("disconnect", () => {
        console.log(`[ShardManager] Shard #${shard.id} has disconnected`);
    });
    shard.on("reconnecting", () => {
        console.log(`[ShardManager] Shard #${shard.id} has reconnected.`);
    });
    if (shards.shards.size === shards.totalShards) console.log("[ShardManager] All shards spawned successfully.");
});
shards.on('message', (shard, msg) => {
    console.log(`[${new Date().toString().split(" ", 5).join(" ")}] #${shard.id} | ${msg._eval} | ${msg._result}`);
});
shards.spawn(shards.totalShards, undefined, -1).catch(e => console.log("SHARD_SPAWN_ERR: ", e));
