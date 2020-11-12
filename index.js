// const express = require("express");
// const app = express();

// app.get("/", (request, response) => {
//   response.sendFile(__dirname + "/views/index.html");
// });

// const listener = app.listen(process.env.PORT, () => {
//   console.log("Your app is listening on port " + listener.address().port);
// });

const { ShardingManager } = require('discord.js-light');

		// Create sharding manager
		const manager = new ShardingManager('./src/index.js', {
			// Sharding options
			totalShards: 'auto',
			token: 'NzQwMTEyMzUzNDgzNTU0ODU4.XykRVw.EDydgpK7SRPYBC3fPicAmvP1eh4',
		});

		// Spawn your shards
		manager.spawn().then(logger.log('=-=-=-=-=-=-=- Loading shard(s) -=-=-=-=-=-=-='));

		// Emitted when a shard is created
		manager.on('shardCreate', (shard) => {
			logger.log(`Shard ${shard.id} launched`);
		});
require('./src/index.js')