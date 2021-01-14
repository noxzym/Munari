const { MessageEmbed, MessageAttachment, Message } = require('discord.js')
module.exports = {
    name: "snipe",
    aliases: null,
    category: "Utility",
    descriptions: "Get last message delete",
    usage: "snipe [channel[mention/id]]",
    options: null,
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const channel = message.guild.channels.cache.get(args[0]) || message.mentions.channels.first() || message.channel;
        const snipes = client.snipes.get(channel.id)

        let e = new MessageEmbed()
        let snipemsg;
        if (snipes === undefined) {
            return message.channel.send(e.setDescription(`I can't get last message delete in channel **\`${channel.name}\`**`).setColor('RED')).then(msg => { msg.delete({ timeout: 5000 }) })
        } else {
            snipemsg = snipes[0]
            e.setColor(snipemsg.color)
            e.setAuthor(`Last MessageDelete by ${snipemsg.author.tag}`, snipemsg.author.avatarURL({ dynamic: true }))
            e.setDescription(snipemsg.content.length <= 1091 ? snipemsg.content : snipemsg.content.substr(0, 1091).trim() + ' ...')
            e.setImage(snipemsg.image)
            e.setFooter(`Time: ${snipemsg.date} • #${channel.name}`)
            message.channel.send({ embed: e })
        }
    }
}