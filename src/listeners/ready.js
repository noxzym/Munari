const axios = require('axios')
// const Mongoose = require("mongoose")

module.exports = {
    name: 'ready',
    async run(client) {        
        // Mongoose.connect("mongodb+srv://tetew123:tetew123@cluster0.f78hd.mongodb.net/Database", {
        //     useUnifiedTopology: true,
        //     useNewUrlParser: true
        // }).then(console.log(`Mongoose has connected!`))
        console.log("Amjay Mabar, SKUUYYY");

        setInterval(() => {
            const status = [
                `• Mention me for know my prefix •`,
                `• Ready to ${client.guilds.cache.size} Servers •`,
                `• With ${client.users.cache.size} Users •`,
            ];
            const type = [
                "PLAYING",
                "WATCHING",
                "LISTENING"
            ]
            let random = Math.floor(Math.random() * status.length)
            let randomtp = Math.floor(Math.random() * type.length)
            client.user.setActivity(status[random], { type: type[randomtp] });
        }, 60 * 1000 * 30);
        
        // setInterval(() => {
        //     client.dbl.postStats({
        //         serverCount: client.guilds.cache.size,
        //         shardId: client.shard.ids[0],
        //         shardCount: client.ws.totalShards
        //     })
        // }, 1800000)
    }
}