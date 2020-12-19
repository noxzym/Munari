const { MessageEmbed } = require('discord.js')
const { get } = require('axios')
module.exports = {
    name: "vote",
    aliases: [""],
    category: "Utility",
    descriptions: "Vote me",
    usage: "vote",
    options: [""],
    cooldown: "",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        let status = 'https://top.gg/api/widget/740112353483554858.svg'.replace('svg', 'png')
        let topgg = await client.dbl.getBot(client.user.id).then(x => x.monthlyPoints)
        let dblist = await get('https://discordbotlist.com/api/v1/bots/740112353483554858').then(x => x.data.upvotes)
        let e = new MessageEmbed()
            .setColor(message.member.displayHexColor)
            .setAuthor(`Vote me in this website`, client.user.avatarURL({ size: 4096 }))
            .setDescription(`**[[\`top.gg\`](https://top.gg/bot/740112353483554858/vote)] • \`${topgg}\` Votes\n[[\`discord.boats\`](https://discord.boats/bot/740112353483554858/vote)] • \`-\` Votes\n[[\`discordbotlist.com\`](https://discordbotlist.com/bots/munari-rose/upvote)] • \`${dblist}\` Votes**`)
            .setThumbnail(client.user.avatarURL({ size: 4096 }))
            .setImage(status)
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
        message.channel.send(e)
    }
}   