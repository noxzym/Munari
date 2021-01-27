const { MessageEmbed, MessageAttachment } = require('discord.js')
module.exports = {
    name: "vote",
    aliases: null,
    category: "Utility",
    descriptions: "Vote me",
    usage: "vote",
    options: null,
    cooldown: "",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        let ath = new MessageAttachment('https://top.gg/api/widget/740112353483554858.png', 'topgg.png')
        let topgg = await client.botlist.dbl.getBot("740112353483554858").then(x => x.monthlyPoints)
        let e = new MessageEmbed()
            .setColor(message.member.displayHexColor)
            .setAuthor(`Vote me!`, client.user.avatarURL({ size: 4096 }))
            .setDescription(`Do you want to vote me? click [[**\`HERE\`**](https://top.gg/bot/740112353483554858/vote)]\nI have **\`${topgg}\`** Votes for this month`)
            .setImage('attachment://topgg.png')
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
        message.channel.send({files: [ath], embed: e})
    }
}   