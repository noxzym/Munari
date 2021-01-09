const { MessageEmbed } = require("discord.js")
const { data } = require('../../data/changelog.json')
module.exports = {
    name: "changelog",
    aliases: ["latest"],
    category: "Utility",
    descriptions: "Get information about latest update",
    usage: "changelog",
    options: [""],
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {

        const generate = start => {
            const current = data.all.slice(start, start + 5);
            let e = new MessageEmbed()
                .setAuthor(`Update Changelog`, client.user.avatarURL({ size: 4096, format: 'png' }))
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }));
            current.forEach(x => e.addField(x.date, x.content));
            return e
        }
        const author = message.author
        message.channel.send(generate(0)).then(message => {
            if (data.all.length <= 5) return
            message.react('➡️')
            const collector = message.createReactionCollector((reaction, user) => ['⬅️', '➡️'].includes(reaction.emoji.name) && user.id === author.id, { time: 60000 })

            let currentIndex = 0
            collector.on('collect', reaction => {
                message.reactions.removeAll().then(async () => {
                    reaction.emoji.name === '⬅️' ? currentIndex -= 5 : currentIndex += 5
                    message.edit(generate(currentIndex))
                    if (currentIndex !== 0) await message.react('⬅️')
                    if (currentIndex + 5 < data.all.length) message.react('➡️')
                })
            })
        })
    }
}