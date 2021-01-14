const { MessageEmbed } = require("discord.js")
const { data } = require('../../data/changelog.json')
module.exports = {
    name: "changelog",
    aliases: ["latest"],
    category: "Utility",
    descriptions: "Get information about latest update",
    usage: "changelog",
    options: null,
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {

        const generate = start => {
            const current = data.all.slice(start, start + 5);
            const page = (current/5).toFixed(0) !== current/5 ? parseFloat((current/5).toFixed(0)) + 1 : current/5
            let e = new MessageEmbed()
                .setAuthor(`Update Changelog`, client.user.avatarURL({ size: 4096, format: 'png' }))
                .setFooter(`Commanded by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
                .setTimestamp()
                .setFooter(`Commanded by ${message.author.tag}, Total ${page} page`, message.author.avatarURL({ dynamic: true }));
            current.forEach(x => e.addField(x.date, x.content));
            return e
        }

        var send = await message.channel.send(generate(0))
        await send.react('❌');
        if (data.all.length > 5) await send.react('➡️');

        let currentIndex = 0
        var collector = send.createReactionCollector((reaction, user) => ['⬅️', '❌', '➡️'].includes(reaction.emoji.name) && user.id === message.author.id, { time: 60000, errors: ['time'] });
        collector.on('collect', async reaction => {
            send.reactions.removeAll().catch(console.error)
            switch (reaction.emoji.name) {

                case '❌':
                    await send.delete({timeout: 3000})
                    break;

                case '⬅️':
                    currentIndex -= 5;
                    send.edit(generate(currentIndex));
                    await send.react('❌');
                    if (currentIndex !== 0) await send.react('⬅️');
                    if (currentIndex + 5 < data.all.length) await send.react('➡️')
                    break;

                case '➡️':
                    currentIndex += 5;
                    send.edit(generate(currentIndex));
                    await send.react('❌');
                    if (currentIndex !== 0) await send.react('⬅️');
                    if (currentIndex + 5 < data.all.length) await send.react('➡️')
                    break;

                default:
                    break;
                    
            }
        })
    }
}