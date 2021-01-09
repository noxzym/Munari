const axios = require('axios')
module.exports = {
    name: 'ready',
    async run(client) {
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
        setInterval(() => {

            client.dbl.postStats({
                serverCount: client.guilds.cache.size,
                shardId: client.shard.ids[0],
                shardCount: client.ws.totalShards
            })

            client.boat.postStats(
                client.guilds.cache.size, client.user.id
                )

            axios.post('https://discord.bots.gg/api/v1/bots/740112353483554858/stats', {
                guildCount: client.guilds.cache.size, shardCount: client.ws.totalShards
            }, {
                headers: {
                    Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGkiOnRydWUsImlkIjoiMjQzNzI4NTczNjI0NjE0OTEyIiwiaWF0IjoxNjA4MTI4OTYwfQ.AFqBCF0pWLsS7Nqf89hfBNpELzKyoLmlsN_d6Wp6Qa0'
                }
            })

            axios.post('https://discordbotlist.com/api/v1/bots/740112353483554858/stats', {
                guilds: client.guilds.cache.size, users: client.users.cache.size
            }, {
                headers: {
                    Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoxLCJpZCI6Ijc0MDExMjM1MzQ4MzU1NDg1OCIsImlhdCI6MTYwODEyNzEyNn0.d5ikZ309UZspeFoDqkDuyoCK5_b4xir9fdD37zf2EoU'
                }
            })
            
        }, 1800000)
    }
}