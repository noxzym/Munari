const { MessageEmbed } = require('discord.js')
module.exports = {
    name: "respect",
    aliases: ["f"],
    category: "General",
    descriptions: "Pay the respect",
    usage: "respect [user]",
    options: [""],
    cooldown: "10",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        let member = message.mentions.members.first()

        let e = new MessageEmbed()
            .setColor(message.member.displayHexColor)

        if (member) {
            e.setDescription(`**React 🇫 to pay respect to \`${member.user.username}\`**`)
        } else {
            e.setDescription(`**React 🇫 to pay respect to all member**`)
        }

        var respect = await message.channel.send(e)
        await respect.react('🇫')

        if (member) {
            respect.awaitReactions((reaction, user) => reaction.emoji.name === '🇫' && user.id !== message.client.user.id, { time: 30000 })
                .then(x => message.channel.send(`**\`${x.size}\` People paid their respect for \`${member.user.username}\`**`).then(x => { x.delete({ timeout: 10000 }) }))
        } else {
            respect.awaitReactions((reaction, user) => reaction.emoji.name === '🇫' && user.id !== message.client.user.id, { time: 30000 })
                .then(x => message.channel.send(`**\`${x.size}\` People paid their respect for all member**`).then(x => { x.delete({ timeout: 10000 }) }))
        }

        
    }
}