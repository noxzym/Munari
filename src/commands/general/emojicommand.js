const { Util, MessageEmbed } = require('discord.js')
const moment = require('moment')
module.exports = {
    name: "emoji",
    aliases: ["em"],
    category: "General",
    descriptions: "Get info about emoji",
    usage: "em <emoji> [options]",
    options: [""],
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const em = args[0]
        if (!em) return message.channel.send(this.usage)

        // const regex = /a?:.+?:\d+/;
        // const input = em.match(regex)
        // if (!input) return message.channel.send(`Maybe this is default emoji?`)
        // const id = em.match(regex).input.replace(/a?:.+?:/, '').replace('<', '').replace('>', '')

        const eminfo = await Util.parseEmoji(em)
        if (eminfo.id === null) return message.channel.send(`I can't get this emoji`)
        const image = eminfo.animated === false ? `https://cdn.discordapp.com/emojis/${eminfo.id}.png?size=4096` : `https://cdn.discordapp.com/emojis/${eminfo.id}.gif`
        const name = eminfo.name
        const ID = eminfo.id
        const createdAt = moment(client.emojis.cache.get(ID).createdAt).format('MMMM Do YYYY, h:mm:ss a');
        if (!createdAt) return message.channel.send(`I can't get this emoji because i am not join server this emoji`)
        const animated = eminfo.animated ? 'True' : 'False'
        const information = eminfo.animated === false ? `<:${eminfo.name}:${eminfo.id}>` : `<a:${eminfo.name}:${eminfo.id}>`
        let e = new MessageEmbed()
        .setColor(message.member.displayHexColor)
        .setAuthor(`Emoji Command`)
        .setDescription(`**Name: \`${name}\`\nID: \`${ID}\`\nAnimated: \`${animated}\`\nIdentifier: \`${information}\`\nCreatedAt: \`${createdAt}\`**`)
        .setImage(image)
        message.channel.send(e)
    }
}