const { MessageEmbed } = require('discord.js')
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
        let e = new MessageEmbed()
            .setColor(message.member.displayHexColor)
            .setAuthor(`Vote me in this website`, client.user.avatarURL({ size: 4096 }))
            .setDescription(`**[[\`top.gg\`](https://top.gg/bot/740112353483554858/vote)] • [[\`discord.boats\`](https://discord.boats/bot/740112353483554858/vote)] • [[\`discordbotlist.com\`](https://discordbotlist.com/bots/munari-rose/upvote)]**`)
            .setThumbnail(client.user.avatarURL({ size: 4096 }))
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
        message.channel.send(e)
    }
}   