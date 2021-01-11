const fetch = require('node-fetch')
module.exports = {
    name: "docs",
    aliases: null,
    category: "General",
    descriptions: "Display discord.js documentation",
    usage: "docs <query>",
    options: null,
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        
        const input = args.join(' ')
        if (!input) return client.commands.get('help').run(client, message, [this.name]).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

        await fetch(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(input)}`)
            .then(res => res.json())
            .then(embed => {
                if (embed && !embed.eror) {
                    message.channel.send({ embed })
                } else {
                    return message.channel.send(`I can't search the query`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
                }
            })
            .catch(e => {
                console.log(e)
                message.channel.send(`I can't search the query`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
            })

    }
}