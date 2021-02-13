const { MessageAttachment } = require('discord.js')
const { createEmbed } = require("../../utils/createEmbed");

module.exports = {
    name: "vote",
    aliases: null,
    category: "Utility",
    descriptions: "Vote me",
    usage: "vote",
    options: null,
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    missing: {
        botperms: ["EMBED_LINKS"],
        userperms: null
    },
    async run(client, message, args) {
        let ath = new MessageAttachment('https://top.gg/api/widget/740112353483554858.png', 'topgg.png')
        let topgg = await client.dbl.getBot("740112353483554858").then(x => x.monthlyPoints)

        let e = createEmbed("info")
            .setAuthor(`Vote me!`, client.user.avatarURL({ size: 4096 }))
            .setDescription(`Do you want to vote me? click [[**\`HERE\`**](https://top.gg/bot/740112353483554858/vote)]\nI have **\`${topgg}\`** Votes for this month`)
            .setImage('attachment://topgg.png')
            .setTimestamp()
            .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
        message.channel.send({files: [ath], embed: e})
    }
}   