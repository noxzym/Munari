// const express = require("express");
// const app = express();

// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/views/index.html");
// });

// const listener = app.listen(process.env.PORT, () => {
//   console.log("Your app is listening on port " + listener.address().port);
// });
// require('./src/index.js')
const { ShardingManager } = require('discord.js-light');
const manager = new ShardingManager('./src/index.js', { 
	totalShards: 'auto',
	token: "NzQwMTEyMzUzNDgzNTU0ODU4.XykRVw.EDydgpK7SRPYBC3fPicAmvP1eh4",
});

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`));
manager.spawn();
