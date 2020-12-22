const { MessageEmbed, MessageAttachment } = require('discord.js')
const alex = require('alexflipnote.js')
module.exports = {
    name: "invert",
    aliases: [""],
    category: "Image",
    descriptions: "Invert avatar color",
    usage: "invert [user]",
    options: [""],
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const { image } = new alex(client.config.alexapi)

        const member =
            message.guild.members.cache.get(args[0]) ||
            message.guild.members.cache.find(x => x.user.username.toLowerCase() === `${args[0]}` || x.user.username === `${args[0]}`) ||
            message.mentions.members.first() ||
            message.member
        const img = await image.invert({ image: `${member.user.avatarURL({ dynamic: false, size: 4096, format: 'png' })}` })

        let ath = new MessageAttachment(img, "invert.png")
        var fetchmsg = await message.channel.send(`Fetching Image <a:LoadingFetch:785715659727175731>`)

        let e = new MessageEmbed()
            .setColor(message.member.displayHexColor)
            .setTitle(member.user.tag)
            .setImage('attachment://invert.png')
            .setTimestamp()
        message.channel.send({ files: [ath], embed: e })
        fetchmsg.delete()
    }
}