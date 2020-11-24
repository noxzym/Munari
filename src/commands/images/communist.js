const { MessageEmbed, MessageAttachment } = require('discord.js')
const alex = require('alexflipnote.js')
const { image } = new alex('93jQYsGpTm_Jz44_fxV2VlsL9t6Uk36zfHq3buCb')
module.exports = {
    name: "communist",
    aliases: [""],
    category: "Image",
    descriptions: "Are you communist?",
    usage: "communist [user]",
    options: [""],
    cooldown: "8",
    ownerOnly: false,
    guildOnly: true,
    async run(client, message, args) {
        const member = message.guild.members.cache.get(args[0]) || message.mentions.members.first() || message.member

        const img = await image.communist({ image: `${member.user.avatarURL({ dynamic: false, size: 4096, format: 'png' })}` })

        let ath = new MessageAttachment(img, "communist.png")

        let e = new MessageEmbed()
            .setTitle(member.user.tag)
            .setImage('attachment://communist.png')
            .setTimestamp()
        message.channel.send({ files: [ath], embed: e })
    }
}