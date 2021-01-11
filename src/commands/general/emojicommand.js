const { Util, MessageEmbed } = require('discord.js')
const moment = require('moment')
module.exports = {
    name: "emoji",
    aliases: ["em"],
    category: "General",
    descriptions: "Get info about emoji",
    usage: "em <emoji> [options]",
    options: null,
    cooldown: "5",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const em = args[0]
        if (!em) return client.commands.get('help').run(client, message, [this.name]).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());

        const eminfo = await Util.parseEmoji(em)
        if (eminfo.id === null) return message.channel.send(`I can't get this emoji`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(console.error());
        const image = eminfo.animated === false ? `https://cdn.discordapp.com/emojis/${eminfo.id}.png?size=4096` : `https://cdn.discordapp.com/emojis/${eminfo.id}.gif`
        const name = eminfo.name
        const ID = eminfo.id
        const createdAt = client.emojis.cache.get(ID) === undefined ? "Unknown" : moment(client.emojis.cache.get(ID).createdAt).format('MMMM Do YYYY, h:mm:ss a');
        const animated = eminfo.animated ? 'Yes' : 'No'
        const information = eminfo.animated === false ? `<:${eminfo.name}:${eminfo.id}>` : `<a:${eminfo.name}:${eminfo.id}>`
        let e = new MessageEmbed()
        .setColor(message.member.displayHexColor)
        .setDescription(`**Name: \`${name}\`\nID: \`${ID}\`\nAnimated: \`${animated}\`\nIdentifier: \`${information}\`\nCreatedAt: \`${createdAt}\`**`)
        .setImage(image)
        message.channel.send(e)
    }
}